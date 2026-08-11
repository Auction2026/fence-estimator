# PART 4 Implementation Menu

## Pre-installation Requirements
- Node.js 20+
- npm 10+
- PostgreSQL 15+
- Git

## Step 1: Install Node.js & NPM
1. Download Node.js LTS.
2. Install using defaults.
3. Verify with `node -v` and `npm -v`.

## Step 2: Install PostgreSQL
1. Install PostgreSQL server.
2. Create a database user.
3. Create database `fence_estimator`.

## Step 3: Clone Repository
1. `git clone https://github.com/Auction2026/fence-estimator.git`
2. `cd fence-estimator`

## Step 4: Install Dependencies
1. `cd backend && npm install`
2. `cd ../frontend && npm install`

## Step 5: Configure Environment
1. Copy `backend/.env.example` to `backend/.env`.
2. Set DB connection string and JWT secrets.

## Step 6: Start Application
1. `cd backend && npm run dev`
2. Serve frontend using `cd ../frontend && npm start`

## Database Setup
1. `psql -d fence_estimator -f database/schema.sql`
2. `psql -d fence_estimator -f database/seed.sql`

## User Creation
Create an admin user through the backend registration endpoint or seed script.

## Go-live Checklist
- Environment variables set
- DB migrations complete
- HTTPS enabled
- Backups scheduled
- Smoke tests pass
