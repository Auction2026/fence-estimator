# syntax=docker/dockerfile:1.7

# Fence Estimator backend container image
# - installs production dependencies in a dedicated stage
# - copies frontend assets for standalone static fallback hosting
# - runs as a non-root user

FROM node:20-alpine AS deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime
LABEL org.opencontainers.image.title="Fence Estimator"
LABEL org.opencontainers.image.description="Express backend for the Fence Estimator application"
LABEL org.opencontainers.image.source="https://github.com/Auction2026/fence-estimator"

ENV NODE_ENV=production
ENV PORT=5000
ENV APP_HOME=/app

WORKDIR /app

# Create a dedicated non-root runtime identity
RUN addgroup -S nodeapp && adduser -S nodeapp -G nodeapp

# Copy runtime dependencies and application code
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY backend ./backend
COPY frontend ./public

# Runtime directory for logs or generated output if needed
RUN mkdir -p /app/logs && chown -R nodeapp:nodeapp /app

# Drop privileges before exposing the service
USER nodeapp
EXPOSE 5000

# Health check uses the API health route
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:5000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Run the Express server from the backend working directory
WORKDIR /app/backend
CMD ["node", "server.js"]
