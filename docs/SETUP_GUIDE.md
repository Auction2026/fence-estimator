# Quick Setup Guide

## 5-Minute Setup (Local/Development)

### Step 1: Database
```bash
mysql -u root -p -e "CREATE DATABASE fence_estimator;"
mysql -u root -p fence_estimator < database/schema.sql
mysql -u root -p fence_estimator < database/seed.sql
```

### Step 2: Backend
```bash
cd backend
cp .env.example .env
# Edit .env: set DB_PASSWORD and JWT_SECRET
npm install
npm start
```

### Step 3: Frontend
```bash
# Open directly in browser (no build needed):
open frontend/index.html
# Or serve with:
cd frontend && npx serve .
```

### Step 4: Test
- Open `http://localhost:3000/api/health` → should return `{"status":"ok"}`
- Open `frontend/index.html` → 17-tab application loads

For full production setup, see [PART_4_IMPLEMENTATION_MENU.md](PART_4_IMPLEMENTATION_MENU.md).
