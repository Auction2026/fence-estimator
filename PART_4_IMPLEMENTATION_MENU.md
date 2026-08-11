# FENCE ESTIMATOR — PART 4: IMPLEMENTATION MENU
## Complete 6-Step Setup Guide for Your Programmer

---

## OVERVIEW

This document provides step-by-step instructions for a programmer to deploy the Fence Estimator system from scratch. The system consists of:

- **Frontend** — Single-page application (HTML/CSS/JavaScript)  
- **Backend** — Node.js/Express REST API  
- **Database** — PostgreSQL  
- **Hosting** — Any Linux VPS or cloud provider  

**Estimated setup time:** 2–4 hours for an experienced programmer.

---

## PREREQUISITES

| Requirement | Minimum Version | Recommended |
|-------------|----------------|-------------|
| Node.js     | 18.x           | 20.x LTS    |
| npm         | 9.x            | 10.x        |
| PostgreSQL   | 14.x           | 16.x        |
| Git         | 2.x            | Latest      |
| OS          | Ubuntu 20.04+  | Ubuntu 22.04|

---

## STEP 1: CLONE THE REPOSITORY

### 1.1 Clone from GitHub

```bash
# Clone the repository
git clone https://github.com/Auction2026/fence-estimator.git

# Enter the project directory
cd fence-estimator
```

### 1.2 Verify the File Structure

After cloning, you should see:

```
fence-estimator/
├── index.html                      ← Main SPA (frontend entry)
├── index-professional.html         ← Professional version
├── FENCE_MATERIAL_SPECIFICATIONS.md
├── PART_4_IMPLEMENTATION_MENU.md   ← This file
├── PART_5_TROUBLESHOOTING_GUIDE.md
├── frontend/                       ← Frontend CSS & JS assets
│   ├── css/
│   │   ├── styles.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── app.js
│   │   ├── api.js
│   │   ├── calculations.js
│   │   ├── validation.js
│   │   ├── storage.js
│   │   ├── ui.js
│   │   └── charts.js
│   └── package.json
├── backend/                        ← Express API server
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── database/                       ← SQL schema & seed data
│   ├── schema.sql
│   ├── seed.sql
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_seed_data.sql
│   │   ├── 003_price_history.sql
│   │   └── 004_change_orders.sql
│   └── procedures/
│       └── backup_procedures.sql
└── docs/
    └── WIRE_GRIDS/                 ← Architecture diagrams
```

---

## STEP 2: DATABASE SETUP

### 2.1 Install PostgreSQL (if not already installed)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Windows:**  
Download from https://www.postgresql.org/download/windows/ and run the installer.

### 2.2 Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In the psql shell, run these commands:
CREATE DATABASE fence_estimator;
CREATE USER fence_user WITH ENCRYPTED PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE fence_estimator TO fence_user;
\q
```

### 2.3 Run Database Migrations

```bash
# From the project root directory:
cd database

# Run schema (creates all 9 tables, views, triggers, functions)
psql -U fence_user -d fence_estimator -h localhost -f schema.sql

# Run seed data (adds sample materials, customers, users, etc.)
psql -U fence_user -d fence_estimator -h localhost -f seed.sql

# Run additional migrations
psql -U fence_user -d fence_estimator -h localhost -f migrations/003_price_history.sql
psql -U fence_user -d fence_estimator -h localhost -f migrations/004_change_orders.sql

# Run backup procedures
psql -U fence_user -d fence_estimator -h localhost -f procedures/backup_procedures.sql
```

**Expected output after schema.sql:**
```
CREATE TABLE (×9)
CREATE INDEX (×20+)
CREATE TRIGGER (×8)
CREATE FUNCTION (×5)
INSERT 15 (settings)
```

### 2.4 Verify Database

```bash
psql -U fence_user -d fence_estimator -h localhost

# Verify tables exist:
\dt

# Should show: users, settings, customers, suppliers, materials,
# supplier_materials, projects, estimates, estimate_items, audit_log

# Check material count:
SELECT COUNT(*) FROM materials;
# Expected: 150+ rows from seed data

\q
```

---

## STEP 3: BACKEND SETUP

### 3.1 Install Node.js Dependencies

```bash
# From the project root:
cd backend
npm install
```

This installs: express, pg (PostgreSQL client), cors, dotenv, bcryptjs, jsonwebtoken, helmet, express-rate-limit, morgan.

### 3.2 Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file with your values
nano .env
```

**Fill in these values in `.env`:**
```env
# Server
PORT=3000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fence_estimator
DB_USER=fence_user
DB_PASSWORD=YourSecurePassword123!

# JWT Secret (generate a strong random string)
JWT_SECRET=replace_with_64_character_random_string_here_abc123xyz789

# Company Settings
COMPANY_NAME=ABC Fence Company
TAX_RATE=0.0875
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3.3 Test the Backend

```bash
# Start in development mode (auto-restart on changes)
npm run dev

# OR start in production mode
npm start
```

**Expected output:**
```
[2026] Server running on port 3000
[2026] Database connected: fence_estimator
[2026] API ready at http://localhost:3000/api
```

### 3.4 Verify API Endpoints

Open a second terminal and test:

```bash
# Health check
curl http://localhost:3000/api/health
# Expected: {"status":"ok","database":"connected"}

# Get materials list
curl http://localhost:3000/api/materials
# Expected: JSON array of materials

# Get settings
curl http://localhost:3000/api/settings
# Expected: JSON object with company settings
```

---

## STEP 4: FRONTEND SETUP

### 4.1 No Build Required — Use Directly

The frontend is a **single-page application** built with plain HTML, CSS, and JavaScript. No build tools or compilation required.

Simply open `index.html` in a web browser to use it locally, OR serve it via a web server for production.

### 4.2 Configure API URL in index.html

Find this line in `index.html` and update the API URL:

```javascript
// Find this near the top of the script section:
const API_BASE_URL = 'http://localhost:3000/api';

// For production, change to your server URL:
const API_BASE_URL = 'https://yourdomain.com/api';
```

### 4.3 Serve Frontend (Development)

**Option A: Python (simplest)**
```bash
# From project root
python3 -m http.server 8080
# Open: http://localhost:8080
```

**Option B: Node http-server**
```bash
npm install -g http-server
http-server . -p 8080
# Open: http://localhost:8080
```

**Option C: VS Code Live Server**  
Install "Live Server" extension, right-click `index.html` → Open with Live Server.

---

## STEP 5: PRODUCTION DEPLOYMENT

### 5.1 Set Up NGINX Web Server

```bash
# Install NGINX
sudo apt install nginx -y

# Create site configuration
sudo nano /etc/nginx/sites-available/fence-estimator
```

**Paste this NGINX configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend files
    root /var/www/fence-estimator;
    index index.html;

    # Serve frontend SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node.js backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/fence-estimator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5.2 Copy Files to Web Server

```bash
# Create web root
sudo mkdir -p /var/www/fence-estimator

# Copy all frontend files
sudo cp -r . /var/www/fence-estimator/
sudo chown -R www-data:www-data /var/www/fence-estimator
```

### 5.3 Run Backend with PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the backend
cd /var/www/fence-estimator/backend
pm2 start server.js --name "fence-estimator-api"

# Auto-start on server reboot
pm2 startup
pm2 save
```

**Useful PM2 commands:**
```bash
pm2 status          # Check if running
pm2 logs            # View live logs
pm2 restart fence-estimator-api
pm2 stop fence-estimator-api
```

### 5.4 SSL Certificate (HTTPS) — Recommended

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get free SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renew (runs twice daily)
sudo crontab -e
# Add: 0 0,12 * * * certbot renew --quiet
```

---

## STEP 6: VERIFY COMPLETE INSTALLATION

### 6.1 System Check Checklist

Run each verification step:

```bash
# 1. Database is running
sudo systemctl status postgresql
# Expected: active (running)

# 2. Backend API is running
pm2 status
# Expected: fence-estimator-api  online

# 3. NGINX is running
sudo systemctl status nginx
# Expected: active (running)

# 4. API health check
curl https://yourdomain.com/api/health
# Expected: {"status":"ok","database":"connected"}

# 5. Materials data loaded
curl https://yourdomain.com/api/materials | python3 -m json.tool | head -20
# Expected: JSON array with materials

# 6. Frontend loads
curl -I https://yourdomain.com/
# Expected: HTTP/1.1 200 OK
```

### 6.2 Test Core Features in Browser

Open `https://yourdomain.com` and verify:

| Feature | How to Test | Expected Result |
|---------|-------------|-----------------|
| Dashboard loads | Open site | Dashboard tab visible with stats |
| New Estimate | Click "New Estimate" tab | 5-step wizard appears |
| Step 1 | Fill customer name, address | Form validates correctly |
| Step 2 | Select fence type, height, footage | Options populate |
| Step 3 | Review materials | Items calculate automatically |
| Step 4 | Review pricing | Totals calculate with tax |
| Step 5 | Save estimate | Estimate saves, number assigned |
| Projects tab | Click "Projects" | Project list loads from database |
| Inventory tab | Click "Inventory" | Materials list loads |
| Print estimate | Click Print button | Print-ready PDF layout |

### 6.3 Create First Admin User

```bash
# Connect to database
psql -U fence_user -d fence_estimator -h localhost

# Update admin user password (replace with bcrypt hash in production)
UPDATE users SET password_hash = crypt('YourAdminPassword', gen_salt('bf'))
WHERE username = 'admin';

\q
```

### 6.4 First Login

1. Go to `https://yourdomain.com`
2. Username: `admin`
3. Password: `YourAdminPassword` (or whatever you set above)
4. Go to **Settings** tab → Update company name, phone, tax rate
5. System is ready for use! ✅

---

## QUICK REFERENCE

### Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| PORT | Yes | Backend port | 3000 |
| NODE_ENV | Yes | Environment | production |
| DB_HOST | Yes | Database host | localhost |
| DB_PORT | Yes | Database port | 5432 |
| DB_NAME | Yes | Database name | fence_estimator |
| DB_USER | Yes | Database user | fence_user |
| DB_PASSWORD | Yes | Database password | SecurePass123! |
| JWT_SECRET | Yes | JWT signing key | 64-char random string |
| COMPANY_NAME | No | Company name | ABC Fence Co |
| TAX_RATE | No | Sales tax | 0.0875 |

### Common Commands

```bash
# Start development
cd backend && npm run dev

# Start production
cd backend && npm start

# View API logs
pm2 logs fence-estimator-api

# Restart API
pm2 restart fence-estimator-api

# Database backup
pg_dump -U fence_user fence_estimator > backup_$(date +%Y%m%d).sql

# Database restore
psql -U fence_user fence_estimator < backup_20260811.sql
```

### Support Files Location

| File | Purpose |
|------|---------|
| `database/schema.sql` | Database structure (run once) |
| `database/seed.sql` | Sample data (run once) |
| `backend/.env` | Environment configuration |
| `backend/server.js` | Main API server |
| `index.html` | Main frontend application |

---

*Implementation Menu — Fence Estimator v1.0*  
*Repository: https://github.com/Auction2026/fence-estimator*
