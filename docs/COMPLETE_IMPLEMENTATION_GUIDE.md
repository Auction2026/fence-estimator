# Complete Implementation Guide

## Delivered structure
- `frontend/` contains the browser-based estimator workspace.
- `backend/` contains the existing Express server plus modular routes, controller helpers, middleware, and tests.
- `database/` contains PostgreSQL schema, seed, index, trigger, and migration scripts.
- `scripts/` contains setup/build/deploy helpers for local environments.
- `.github/workflows/` contains CI/CD automation.

## Local setup
1. Copy `.env.example` to `.env` and review the values.
2. Install backend dependencies with `cd backend && npm install`.
3. Create the database and run:
   - `PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" -f database/schema.sql`
   - `PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" -f database/indexes.sql`
   - `PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" -f database/procedures.sql`
   - `PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" -f database/seed.sql`
4. Start the backend with `cd backend && npm start`.
5. Start the frontend with `cd frontend && npm start` and open `http://localhost:4173`.

## Frontend workflow
- Tab 1 captures customer and job details.
- Tab 2 captures fence specifications and drives estimate totals.
- Tabs 3-7 store layout, drawings, permit, and utility data.
- Tabs 8-14 cover estimate, contract, extras, crew, change order, sign-off, and notes workflows.
- Tabs 15-17 expose admin metrics, product catalog, and mapping summary tools.

## Backend workflow
- `backend/server.js` remains the active Express entry point.
- `backend/routes/` provides modular route files for projects, estimates, and contracts.
- `backend/controllers/projectController.js` contains reusable normalization and validation helpers.
- `backend/middleware/auth.js` centralizes token extraction and role checks.
- `backend/services/estimateMath.js` provides reusable estimate math for tests and route handlers.

## Validation
- Backend tests: `cd backend && npm test`
- Frontend smoke run: `cd frontend && npm start`
- Syntax checks: `node --check` can be run against JS entry points when needed.
