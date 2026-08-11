
# Setup Guide

## 5-Minute Setup

### 1. Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Git

### 2. Clone
```bash
git clone https://github.com/<your-org>/fence-estimator.git
cd fence-estimator
```

### 3. Install
```bash
cd backend
npm install
cd ../frontend
npm install
```
If your checkout uses the root-level static prototype instead of a dedicated frontend folder, install backend dependencies only and serve `index.html` directly.

### 4. Configure
Create `backend/.env`:
```env
PORT=3001
DATABASE_URL=******localhost:5432/fence_depot
JWT_SECRET=replace-with-a-secure-random-secret
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### 5. Run
```bash
cd backend
npm run migrate
npm run seed
npm run dev
```
Serve the frontend and open the local URL in a browser.

---

## Environment Variables Reference
| Variable | Example | Purpose |
|---|---|---|
| `PORT` | `3001` | Backend listen port |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string |
| `DB_HOST` | `localhost` | Optional separate DB host |
| `DB_PORT` | `5432` | Optional separate DB port |
| `DB_NAME` | `fence_depot` | Optional separate DB name |
| `DB_USER` | `fence_app` | Optional separate DB user |
| `DB_PASSWORD` | `...` | Optional separate DB password |
| `JWT_SECRET` | random 64+ chars | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `FRONTEND_URL` | `http://localhost:3000` | Browser origin |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed origin for API |
| `SMTP_HOST` | `smtp.example.com` | Email server |
| `SMTP_USER` | `notifications@example.com` | SMTP username |
| `SMTP_PASSWORD` | `...` | SMTP password |

---

## Default Credentials
Fence Depot should **not** ship with permanent hard-coded production credentials.

For local development, if you load the sample seed data from the docs, use:
- **Email:** `admin@fencedepot.local`
- **Password:** `ChangeMe123!`

Immediately change the password after first login.

---

## Quick Verification
```bash
curl http://localhost:3001/api/health
```
Then log in through the browser and create a sample project.
