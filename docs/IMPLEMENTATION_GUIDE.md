# Implementation Guide

## 1. Start the delivered package
1. Open a terminal in the repository root.
2. Run `npm start`.
3. Open `http://localhost:3000`.
4. The frontend auto-signs in with the bundled demo account and creates a starter project.

## 2. Backend layout
- `backend/server.js` starts the HTTP server and serves the frontend.
- `backend/routes/*.js` declares the API surface.
- `backend/controllers/*.js` handles auth, projects, estimates, contracts, and admin data.
- `backend/utils/calculations.js` contains the shared pricing engine.

## 3. Frontend layout
- `frontend/index.html` is the workspace shell.
- `frontend/js/tabs/` contains the 17 requested workflow tabs.
- `frontend/js/api.js` uses the backend when available and falls back to local browser storage for review or demo use.

## 4. Database rollout
1. Apply `database/schema.sql` to the target SQLite database.
2. Run `database/seed.sql` for the starter account, project, and 950 generated catalog rows.
3. Archive a baseline backup using `database/backup-procedures.sql`.

## 5. Production notes
- Replace the `.env.example` values with production secrets.
- Swap the in-memory backend repository with a persistent database adapter before live deployment.
- Move demo credentials out of source control for any non-demo environment.
