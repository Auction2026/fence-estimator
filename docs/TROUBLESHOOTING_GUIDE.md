# Troubleshooting Guide

## Frontend shows blank values
- Open browser dev tools and check for JS errors.
- Confirm `frontend/js/app.js` is loaded from `frontend/index.html`.

## Backend will not start
- Verify `backend/.env` exists and has `MONGO_URI`.
- Run `npm install` in `/backend`.

## API 401 errors
- Include `Authorization: ****** for protected endpoints.

## Data not saved
- Confirm browser localStorage is enabled.
- For backend persistence, verify database connectivity.
