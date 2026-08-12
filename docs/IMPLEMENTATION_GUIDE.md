# Implementation Guide

## Frontend
1. Open `frontend/index.html` in a browser.
2. Ensure `frontend/css/styles.css`, `frontend/css/responsive.css`, and all `frontend/js/**/*.js` files are available.
3. Use tab modules in `frontend/js/tabs/` to initialize tab-specific logic.

## Backend
1. Install dependencies in `/backend` with `npm install`.
2. Copy `backend/.env.example` to `backend/.env` and set values.
3. Start with `npm run dev` or `npm start`.

## Database
1. Apply `database/schema.sql`.
2. Apply `database/indexes.sql`.
3. Optional sample data from `database/seed.sql`.
