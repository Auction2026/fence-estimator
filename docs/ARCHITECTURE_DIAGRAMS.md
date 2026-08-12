# Architecture Diagrams

## Runtime overview
`frontend/index.html` -> browser state + autosave -> optional `/api/*` sync -> current Express + MongoDB runtime.

Parallel to the current runtime, `database/` ships PostgreSQL schema, seed, trigger, index, and migration assets so the repository also has a structured SQL persistence layer ready for teams that prefer PostgreSQL-backed reporting or a future backend migration.

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
