
# Fence Depot Documentation

## Project overview
Fence Depot is a fence estimating and project workflow application for residential, commercial, and specialty fencing jobs. It organizes the job lifecycle from customer intake through fence specifications, layout, estimate generation, contract locking, change orders, crew planning, and final sign-off.

## Core features
- 17-tab guided project workflow
- Automatic estimate calculation
- Inventory and catalog pricing lookup
- Price locking before contract issue
- Change-order approval flow
- Project notes, admin controls, and mapping support
- JWT-based authentication
- PostgreSQL-backed project data storage

## Technology stack
- **Frontend:** HTML, CSS, vanilla JavaScript
- **Backend:** Node.js + Express on port `3001`
- **Database:** PostgreSQL
- **Deployment:** PM2 + nginx
- **Auth:** JWT bearer tokens

## Quick start
1. Install Node.js 18+ and PostgreSQL 14+.
2. Clone the repository.
3. Install backend and frontend dependencies.
4. Create `backend/.env` with database and JWT settings.
5. Run migrations and seed data.
6. Start the backend on port `3001` and serve the frontend.

See these files for full details:
- `SETUP_GUIDE.md`
- `PART_4_IMPLEMENTATION_MENU.md`
- `API_DOCUMENTATION.md`
- `DATABASE_SCHEMA.md`

## Repository note
This repository snapshot contains a lightweight prototype structure today, while the docs in this folder describe the finalized production architecture expected for the Fence Depot application.

## License
Use the project’s repository license if one is added at the root. If no root license file exists yet, treat this documentation as project-internal reference material until licensing is formalized.
