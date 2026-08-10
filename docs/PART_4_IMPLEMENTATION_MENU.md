# PART 4 IMPLEMENTATION MENU

## PRE-INSTALLATION CHECKLIST
- OS: Linux/macOS/Windows
- Node.js 20+
- MongoDB for application runtime data
- PostgreSQL optional reference schema/scripts in /database
- 8GB RAM minimum
- Stable internet

## STEP 1: INSTALL NODE.JS
- https://nodejs.org/
- Install LTS
- Verify: `node -v && npm -v`
- If missing path, reopen terminal.

## STEP 2: INSTALL DATABASE
- Install MongoDB (required runtime database for backend API).
- Create MongoDB database `fence_estimator`.
- Create app user with least privilege.
- Verify MongoDB connection with CLI login.
- Optional: install PostgreSQL only if you plan to use `/database/*.sql` reference scripts.

## STEP 3: CLONE REPOSITORY
- Install git.
- `git clone https://github.com/Auction2026/fence-estimator.git`
- Confirm files exist.

## STEP 4: INSTALL DEPENDENCIES
- Backend: `cd backend && npm install`
- Frontend: `cd frontend && npm install`
- Verify no install errors.

## STEP 5: CONFIGURE ENVIRONMENT
- Copy `.env.example` to `.env`
- Set `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`
- Add email/API keys if integrating providers.

## STEP 6: START SERVER
- Backend: `npm run dev`
- Frontend: `npm start`
- Verify health endpoint and tab rendering.

## CONFIGURATION GUIDE
- Database pools, JWT expiry, CORS allowlist.

## DEPLOYMENT GUIDE
- Local: single VM.
- Production: reverse proxy + process manager.
- Cloud: AWS/Azure/GCP managed DB and autoscaling.

## TESTING GUIDE
- Unit tests for calculations and auth.
- Integration API tests.
- End-to-end browser workflow.
- Performance load checks.

## USER SETUP
- Register admin.
- Create estimator and crew users.
- Verify role-based access.

## DATA IMPORT
- Runtime MongoDB: import catalog through API/admin tooling.
- Optional PostgreSQL reference: run `seed.sql` for products (950 rows).

## GO-LIVE CHECKLIST
- Final smoke tests
- Backups validated
- Security headers and secret rotation
- Performance baseline recorded
- Team training completed
