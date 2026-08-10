# PART 4 – IMPLEMENTATION MENU
## Fence Depot Estimator Pro – Complete Installation & Deployment Guide

---

## PRE-INSTALLATION CHECKLIST

Before you begin, confirm you have the following:

- [ ] **Server / Computer** running Linux (Ubuntu 20.04+), macOS 12+, or Windows 10/11
- [ ] **Node.js 18+** installed – [nodejs.org](https://nodejs.org)
- [ ] **PostgreSQL 14+** installed – [postgresql.org](https://www.postgresql.org/download/)
- [ ] **Git** installed – [git-scm.com](https://git-scm.com)
- [ ] **GitHub account** with access to `Auction2026/fence-estimator`
- [ ] Text editor (VS Code recommended)
- [ ] Terminal / Command Prompt open
- [ ] Internet connection for npm package download

---

## STEP 1 – CLONE THE REPOSITORY

Open your Terminal (Mac/Linux) or Command Prompt (Windows) and run:

```bash
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator
```

You should now see a folder called `fence-estimator` with all the code inside.

---

## STEP 2 – SET UP THE DATABASE

### 2a. Create the database

```bash
# Open PostgreSQL command line
psql -U postgres

# Inside psql, run:
CREATE DATABASE fence_estimator;
CREATE USER fence_user WITH PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE fence_estimator TO fence_user;
\q
```

### 2b. Run the schema (creates all tables)

```bash
psql -U fence_user -d fence_estimator -f database/schema.sql
```

Expected output:
```
CREATE EXTENSION
CREATE TABLE
CREATE INDEX
... (many lines)
CREATE TRIGGER
```

### 2c. Load the seed data (products, admin user)

```bash
psql -U fence_user -d fence_estimator -f database/seed.sql
```

Expected output:
```
INSERT 0 1   ← admin user
INSERT 0 5   ← suppliers
INSERT 0 90  ← inventory items
```

---

## STEP 3 – CONFIGURE THE BACKEND

### 3a. Install Node.js dependencies

```bash
cd backend
npm install
```

This installs all required packages (Express, PostgreSQL driver, JWT, etc.).

### 3b. Create your environment file

```bash
cp .env.example .env
```

Open `.env` in your text editor and fill in your settings:

```env
# Server
PORT=3000
NODE_ENV=production

# Database – match what you created in Step 2
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fence_estimator
DB_USER=fence_user
DB_PASSWORD=YourSecurePassword123!
DB_SSL=false

# JWT Secret – make this a long random string (32+ characters)
JWT_SECRET=replace-this-with-a-very-long-random-secret-key-here

# Admin Email (first login)
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=ChangeMe@FirstLogin!
```

> ⚠️ **IMPORTANT**: Change `JWT_SECRET`, `DB_PASSWORD`, and `ADMIN_PASSWORD` before going live!

### 3c. Test the backend starts

```bash
node server.js
```

You should see:
```
✅ Database connected
🚀 Fence Estimator API running on port 3000
```

Press `Ctrl+C` to stop it for now.

---

## STEP 4 – CONFIGURE THE FRONTEND

The frontend is a static HTML/CSS/JS application.

### 4a. Open `frontend/js/app.js` in your text editor

Find this line near the top:
```javascript
const API_BASE = window.API_BASE || 'http://localhost:3000/api';
```

If your backend will run on a different address (e.g., a server), change `http://localhost:3000/api` to your server's URL.

### 4b. Test the frontend

Simply open `frontend/index.html` in Google Chrome or Microsoft Edge.

You should see the Fence Depot Estimator interface with all 17 tabs.

---

## STEP 5 – RUN THE FULL APPLICATION

### 5a. Start the backend (in Terminal 1)

```bash
cd backend
node server.js
```

### 5b. Serve the frontend (in Terminal 2)

```bash
cd frontend
npx serve -s . -l 3001
```

Then open your browser and go to:
```
http://localhost:3001
```

### 5c. Log in

- Email: `admin@fencedepot.local` (or whatever you set in `.env`)
- Password: `Admin@1234` ← **CHANGE THIS IMMEDIATELY**

---

## STEP 6 – PRODUCTION DEPLOYMENT

For a real business environment:

### 6a. Use PM2 to keep the server running

```bash
npm install -g pm2
cd backend
pm2 start server.js --name fence-estimator-api
pm2 save
pm2 startup
```

### 6b. Set up Nginx as reverse proxy (Linux only)

```nginx
# /etc/nginx/sites-available/fence-estimator
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    root /var/www/fence-estimator/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/fence-estimator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6c. SSL Certificate (HTTPS) – Free with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

---

## GO-LIVE CHECKLIST

Before showing to customers:

- [ ] Changed default admin password
- [ ] Changed `JWT_SECRET` in `.env` to random 32+ character string
- [ ] Database is backed up (see `database/procedures/backup.sql`)
- [ ] HTTPS/SSL is active
- [ ] Tested New Estimate flow end-to-end
- [ ] Tested printing an estimate
- [ ] Verified all 17 tabs load
- [ ] Added your company name and phone in Admin → Company Settings

---

## CONFIGURATION REFERENCE

| Setting | Location | Default | Description |
|---------|----------|---------|-------------|
| `PORT` | `.env` | 3000 | Backend server port |
| `DB_PASSWORD` | `.env` | — | PostgreSQL password |
| `JWT_SECRET` | `.env` | — | Token signing key |
| `DEFAULT_MARKUP` | Admin → Settings | 20% | Default estimate markup |
| `DEFAULT_LABOR_RATE` | Admin → Settings | $12/ft | Default labor per foot |
| `TAX_RATE` | Admin → Company | 0% | Tax applied to totals |

---

## QUICK REFERENCE – COMMON COMMANDS

```bash
# Start backend
cd backend && node server.js

# Start frontend dev server
cd frontend && npx serve -s . -l 3001

# Check backend is running
curl http://localhost:3000/api/health

# Reset database (⚠️ deletes all data)
psql -U fence_user -d fence_estimator -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql -U fence_user -d fence_estimator -f database/schema.sql
psql -U fence_user -d fence_estimator -f database/seed.sql

# View logs (PM2)
pm2 logs fence-estimator-api

# Restart server (PM2)
pm2 restart fence-estimator-api
```

---

*For troubleshooting, see `docs/PART_5_TROUBLESHOOTING_GUIDE.md`*
