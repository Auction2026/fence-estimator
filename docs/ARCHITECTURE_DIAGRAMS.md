# Architecture Overview

## Frontend
- `frontend/index.html` hosts 17 tabs.
- `frontend/js/app.js` handles app state and tab switching.
- `frontend/js/*` modules provide API, calculations, validation, storage, and UI updates.

## Backend
- Express server (`backend/server.js`) with modular routes/controllers.
- Mongoose models for project/estimate/contract records.

## Data
- SQL schema in `/database` for optional relational storage.
