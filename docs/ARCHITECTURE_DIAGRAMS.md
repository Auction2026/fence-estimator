# Architecture Diagrams

## Runtime overview
`frontend/index.html` -> browser state + autosave -> optional `/api/*` sync -> MongoDB backend today / PostgreSQL schema scripts for future structured persistence.

## Frontend modules
- `api.js`: namespace bootstrap and network calls.
- `calculations.js`: pricing math and contract preview text.
- `validation.js`: shared payload validation.
- `storage.js`: local persistence, import, export.
- `ui.js`: rendering and layout helpers.
- `tabs/*`: tab-specific event handlers.
- `tools/*`: drawing, mapping, printing, and export helpers.

## Backend modules
- `server.js`: current all-in-one Express runtime.
- `routes/*.js`: modular endpoints ready for gradual adoption.
- `middleware/auth.js`: JWT parsing and role checks.
- `controllers/projectController.js`: project normalization and CRUD handlers.
- `services/estimateMath.js`: reusable estimate calculations.
