# Fence Estimator

Delivered repository structure now includes a modular frontend workspace, the existing Express backend, modular backend route/controller helpers, PostgreSQL scripts, Docker assets, CI workflows, and backend tests.

## Start locally
1. Copy `./.env.example` to `.env`.
2. Install backend dependencies: `cd backend && npm install`.
3. Start the backend: `npm start`.
4. In a second shell start the frontend: `cd frontend && npm start`.
5. Open `http://localhost:4173`.

## Key paths
- `frontend/index.html`
- `frontend/js/`
- `backend/server.js`
- `backend/routes/`
- `database/`
- `docs/`
- `scripts/`
