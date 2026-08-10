# PART 4: IMPLEMENTATION MENU
## Fence Depot Fence Estimator — Complete Setup Guide
### 6-Step Installation & Go-Live Checklist

---

## PRE-INSTALLATION CHECKLIST

Before starting, verify you have:

- [ ] **Node.js** v18 or higher installed — [nodejs.org](https://nodejs.org)
- [ ] **PostgreSQL** 14 or higher installed — [postgresql.org](https://www.postgresql.org)
- [ ] **Git** installed — [git-scm.com](https://git-scm.com)
- [ ] GitHub repository access to `Auction2026/fence-estimator`
- [ ] A text editor (VS Code recommended)
- [ ] A terminal / command prompt (Windows PowerShell, macOS Terminal, or Linux bash)
- [ ] Internet connection for npm package downloads

---

## STEP 1: DOWNLOAD THE CODE

### Option A — Git Clone (Recommended)
```bash
# Open your terminal and run:
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator
```

### Option B — Download ZIP
1. Go to: https://github.com/Auction2026/fence-estimator
2. Click the green **Code** button
3. Click **Download ZIP**
4. Unzip to a folder on your computer (e.g., `C:\fence-estimator\`)

---

## STEP 2: SET UP THE DATABASE

### 2a. Open PostgreSQL
```bash
# On Windows — open pgAdmin or run:
psql -U postgres

# On Mac/Linux:
psql -U postgres
```

### 2b. Create the Database
```sql
-- In the psql terminal:
CREATE DATABASE fence_estimator;
\c fence_estimator
```

### 2c. Run the Schema
```bash
# In your terminal (from the project folder):
psql -U postgres -d fence_estimator -f database/schema.sql
```

Expected output:
```
CREATE EXTENSION
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE FUNCTION
CREATE TRIGGER
CREATE VIEW
```

### 2d. Load the Seed Data (Products & Sample Data)
```bash
psql -U postgres -d fence_estimator -f database/seed.sql
```

Expected output:
```
INSERT 0 3    (users)
INSERT 0 5    (projects)
INSERT 0 5    (fence_specs)
INSERT 0 90   (inventory - named items)
INSERT 0 200  (bulk wood)
INSERT 0 200  (bulk chain link fittings)
INSERT 0 200  (bulk vinyl)
INSERT 0 200  (bulk installation supplies)
```

### 2e. Verify Database
```sql
-- Check tables:
\dt

-- Check inventory count:
SELECT COUNT(*) FROM inventory;
-- Should show 950+

-- Check users:
SELECT username, role FROM users;
```

---

## STEP 3: CONFIGURE THE BACKEND

### 3a. Navigate to Backend Folder
```bash
cd backend
```

### 3b. Install Dependencies
```bash
npm install
```

### 3c. Create Environment File
```bash
# Copy the example:
cp .env.example .env

# On Windows:
copy .env.example .env
```

### 3d. Edit the `.env` File
Open `.env` in your text editor and update:

```env
# Database connection
MONGO_URI=mongodb://localhost:27017/fence-estimator
# OR for PostgreSQL:
DATABASE_URL=******localhost:5432/fence_estimator

# JWT Secret (change this to a long random string)
JWT_SECRET=change-this-to-something-very-long-and-random-at-least-32-chars

# Server port
PORT=3000

# Email (optional — for sending estimates)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

> **⚠️ IMPORTANT:** Change `JWT_SECRET` to a unique random string before going live.

### 3e. Start the Backend Server
```bash
npm start
```

Expected output:
```
✅ MongoDB Connected: localhost
🚀 Fence Estimator API running on port 3000
```

### 3f. Test the Backend
Open your browser and go to:
```
http://localhost:3000/api/health
```

You should see:
```json
{ "status": "ok", "message": "Fence Estimator API is running" }
```

---

## STEP 4: CONFIGURE THE FRONTEND

### 4a. Open the Frontend
The frontend is a static HTML application. You can open it two ways:

**Option 1 — Direct File Open (No install needed):**
```
Double-click: frontend/index.html
```

**Option 2 — Serve with Node.js (Recommended for production):**
```bash
cd frontend
npm install
npm start
```
Then open: http://localhost:3001

### 4b. Connect Frontend to Backend

1. Open the app in your browser
2. Log in with: `admin` / `admin123`
3. Click **⚙️ Settings** in the left menu
4. Under **API / Backend Connection**, enter:
   ```
   http://localhost:3000
   ```
5. Click **Test Connection** — you should see ✅ Connected!
6. Click **Save**

### 4c. Update Company Information
1. In Settings, under **Company Information**, fill in:
   - Company Name
   - Phone
   - Email
   - Address
   - License Number
2. Click **Save Company Info**

---

## STEP 5: TEST THE SYSTEM

### 5a. Login Test
- [ ] Open frontend (http://localhost:3001 or frontend/index.html)
- [ ] Login with `admin` / `admin123` → should enter dashboard
- [ ] Login with `estimator` / `estimate123` → should enter dashboard

### 5b. Create Test Estimate
- [ ] Click **✏️ New Estimate**
- [ ] Step 1: Enter customer name and address
- [ ] Step 2: Select "Chain Link", 6 ft, 200 ft footage
- [ ] Step 3: Verify materials appear
- [ ] Step 4: Verify labor calculates
- [ ] Step 5: Click "Save Estimate"
- [ ] Verify estimate appears in **📁 Projects**

### 5c. Test All 17 Tabs
- [ ] Dashboard — stats show
- [ ] New Estimate — wizard works
- [ ] Projects — estimate shows
- [ ] Materials — table loads
- [ ] Pricing — fence types show
- [ ] Inventory — items show
- [ ] Suppliers — default suppliers show
- [ ] Contracts — empty (OK)
- [ ] Change Orders — empty (OK)
- [ ] Sign-Off — project dropdown populates
- [ ] Notes — add a note
- [ ] Map Tool — address search works
- [ ] Drawing Tool — canvas appears
- [ ] Analytics — charts render
- [ ] Reports — print buttons work
- [ ] Crew — add crew member
- [ ] Settings — company info saves

### 5d. Run Database Migration Tests
```bash
psql -U postgres -d fence_estimator -f database/migrations/003_add_pricing_lock.sql
psql -U postgres -d fence_estimator -f database/migrations/004_add_crew_assignments.sql
```

---

## STEP 6: GO LIVE (Production Deployment)

### 6a. Security Checklist (REQUIRED before going live)
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Change all default passwords in the database
- [ ] Enable HTTPS (SSL certificate)
- [ ] Enable firewall rules on your server
- [ ] Disable debug/development mode

### 6b. Production Backend Options

**Option 1 — VPS (DigitalOcean, Linode, etc.)**
```bash
# On your server:
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator/backend
npm install --production
npm install -g pm2
pm2 start server.js --name fence-estimator
pm2 save
pm2 startup
```

**Option 2 — Heroku**
```bash
heroku create fence-estimator-app
heroku config:set JWT_SECRET=your-secret
heroku config:set DATABASE_URL=your-postgres-url
git push heroku main
```

**Option 3 — Railway / Render (Easiest)**
1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy clicks automatically

### 6c. Frontend Production Hosting

**Option 1 — Same server as backend**
```
Place frontend/ folder in backend/public/
```

**Option 2 — GitHub Pages (free)**
```bash
git subtree push --prefix frontend origin gh-pages
```

**Option 3 — Netlify/Vercel**
1. Connect GitHub repository
2. Set publish directory to `frontend`
3. Deploy

### 6d. Post-Deploy Verification
- [ ] Backend health check returns OK
- [ ] Frontend loads over HTTPS
- [ ] Login works with production credentials
- [ ] Database queries return correct data
- [ ] Email notifications work (if configured)
- [ ] PDF generation works
- [ ] Backup procedure runs

### 6e. Create Production Admin Account
```sql
-- In psql on your production database:
INSERT INTO users (username, email, password_hash, role, company)
VALUES (
  'your-admin-name',
  'admin@yourcompany.com',
  -- Generate hash with: node -e "const b=require('bcryptjs');console.log(b.hashSync('YourPassword123',10))"
  'PASTE_BCRYPT_HASH_HERE',
  'admin',
  'Your Company Name'
);

-- Then delete the demo users:
DELETE FROM users WHERE username IN ('admin','estimator','crew1');
```

---

## COMPLETE GO-LIVE CHECKLIST

```
INFRASTRUCTURE
[ ] Server provisioned and accessible
[ ] Domain name configured
[ ] SSL certificate installed
[ ] Firewall configured

DATABASE
[ ] PostgreSQL installed and running
[ ] fence_estimator database created
[ ] Schema deployed (schema.sql)
[ ] Seed data loaded (seed.sql)
[ ] Migrations run (001-004)
[ ] Production admin account created
[ ] Demo users deleted

BACKEND
[ ] Node.js dependencies installed
[ ] .env configured with real values
[ ] JWT_SECRET changed (32+ chars)
[ ] Process manager running (pm2)
[ ] Health endpoint returns 200

FRONTEND
[ ] Frontend accessible via HTTPS
[ ] Backend URL configured in Settings
[ ] Company information set
[ ] Logo/branding updated

TESTING
[ ] All 17 tabs tested
[ ] Estimate creation tested end-to-end
[ ] Contract signing tested
[ ] Print/PDF export tested
[ ] Data export tested
[ ] Login/logout tested

STAFF TRAINING
[ ] Admin user trained
[ ] Estimator users created
[ ] Crew users created (if needed)
[ ] Quick reference guide printed
```

---

## SUPPORT & TROUBLESHOOTING

For common issues, see `docs/PART_5_TROUBLESHOOTING_GUIDE.md`

For emergency support, check:
- GitHub Issues: https://github.com/Auction2026/fence-estimator/issues
- Backend logs: `pm2 logs fence-estimator`
- Database logs: PostgreSQL error log
