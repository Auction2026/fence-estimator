# PART 5: Troubleshooting Guide

## Backend
- **Server fails to start**: run `npm install` inside `backend` and verify `.env` exists.
- **Mongo connection loop**: verify `MONGO_URI` points to an active server.
- **401 token errors**: check `JWT_SECRET` consistency.

## Frontend
- **Blank tab panel**: ensure all scripts under `frontend/js/tabs` are present.
- **CORS errors**: verify backend CORS config and frontend API URL.
- **Print/export not responding**: browser popup blockers can suppress print windows.

## Database
- **Schema apply fails**: run migrations in order and ensure PostgreSQL syntax mode.
- **Seed conflicts**: `ON CONFLICT` is expected and safe.

## Operations
- **No new generation output**: check latest workflow run state and queued job logs.
- **Queued cloud run**: trigger a fresh run by issuing a new explicit generation request.
