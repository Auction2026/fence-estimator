# PART 4 — IMPLEMENTATION MENU
## Fence Depot Estimator — Complete Setup Guide

---

## PRE-INSTALLATION CHECKLIST

Before you begin, make sure you have:

- [ ] A computer running Windows 10/11, macOS 12+, or Ubuntu 20.04+
- [ ] Internet connection
- [ ] Administrator / sudo access on your computer
- [ ] GitHub account (free at github.com)
- [ ] A PostgreSQL-compatible hosting plan **or** a local development machine

---

## STEP 1 — Install Node.js & NPM

Node.js powers the backend server.

### Windows
1. Go to **https://nodejs.org**
2. Click **"LTS"** (the green button — Long Term Support)
3. Run the downloaded `.msi` installer → click Next → Next → Install
4. Restart your computer
5. Open **Command Prompt** and type:
   ```
   node --version
   npm --version
   ```
   You should see version numbers. ✅

### macOS
1. Go to **https://nodejs.org**
2. Download the **LTS .pkg** installer
3. Double-click to install
4. Open **Terminal** (press Cmd+Space, type "Terminal")
5. Type:
   ```
   node --version
   npm --version
   ```
   ✅

### Ubuntu / Linux
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

---

## STEP 2 — Install PostgreSQL Database

### Windows
1. Go to **https://www.postgresql.org/download/windows/**
2. Click **"Download the installer"**
3. Run the installer — choose version **15 or 16**
4. When asked for a password, choose something you'll remember (e.g., `FenceDepot2026!`)
5. Keep default port **5432**
6. Finish installation
7. Open **pgAdmin** (installed with PostgreSQL) to verify it works ✅

### macOS
```bash
brew install postgresql@16
brew services start postgresql@16
```
*(Install Homebrew first from https://brew.sh if you don't have it)*

### Ubuntu / Linux
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Create the database
Open **pgAdmin** (Windows/Mac) or terminal (Linux):
```sql
CREATE DATABASE fence_estimator;
CREATE USER fence_user WITH ENCRYPTED PASSWORD 'YourPassword123!';
GRANT ALL PRIVILEGES ON DATABASE fence_estimator TO fence_user;
```

---

## STEP 3 — Get the Repository Code

### Option A: Download ZIP (easiest)
1. Go to **https://github.com/Auction2026/fence-estimator**
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Extract the ZIP to a folder (e.g., `C:\FenceEstimator\` or `~/FenceEstimator/`)

### Option B: Git Clone (for developers)
```bash
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator
```

---

## STEP 4 — Install Dependencies

Open a terminal/command prompt **inside the project folder**.

### Install Backend Dependencies
```bash
cd backend
npm install
```
You should see packages downloading. When done: ✅

### Return to root
```bash
cd ..
```

---

## STEP 5 — Configure Environment

1. Copy the example config file:

   **Windows:**
   ```
   copy backend\.env.example backend\.env
   ```
   **Mac/Linux:**
   ```
   cp backend/.env.example backend/.env
   ```

2. Open `backend/.env` in Notepad (Windows) or any text editor

3. Fill in your values:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=fence_estimator
   DB_USER=fence_user
   DB_PASSWORD=YourPassword123!
   JWT_SECRET=change_this_to_a_long_random_string_at_least_32_chars
   NODE_ENV=production
   ```

4. Save the file ✅

---

## STEP 6 — Set Up the Database

### Run Schema (creates all tables)
```bash
# Open pgAdmin Query Tool, paste contents of database/schema.sql and run
# OR from terminal:
psql -U fence_user -d fence_estimator -f database/schema.sql
```

### Run Migrations (adds indexes, constraints)
```bash
psql -U fence_user -d fence_estimator -f database/migrations/migration-002-add-indexes.sql
psql -U fence_user -d fence_estimator -f database/migrations/migration-003-add-constraints.sql
```

### Load Product Data (300+ products)
```bash
psql -U fence_user -d fence_estimator -f database/seed.sql
```

### Verify (you should see 300+ products)
```bash
psql -U fence_user -d fence_estimator -c "SELECT COUNT(*) FROM inventory;"
```

> **Note:** The seed file contains 300+ products across all fence categories. Additional product imports
> can be added via CSV using the Data Import procedures in this guide.

---

## STEP 7 — Start the Server

```bash
cd backend
npm start
```

You should see:
```
🚀 Fence Depot Estimator Server running on port 3000
📊 Database connected successfully
✅ Ready for connections
```

---

## STEP 8 — Open the Application

### Local (Frontend Only — No Backend Required)
1. Navigate to your project folder
2. Double-click **`index.html`**
3. It opens in your browser — you're ready! ✅

### Full Stack (Backend + Frontend)
1. Start the backend server (Step 7)
2. Open a browser and go to: **http://localhost:3000**
3. Log in with the admin credentials set during setup

---

## CONFIGURATION GUIDE

### Changing Company Name / Logo
1. Open `index.html` in a text editor
2. Find `"Fence Depot Estimator"` and replace with your company name
3. Find the 🔧 emoji (logo) and replace with your logo `<img>` tag

### Setting Tax Rate
In `index.html`, find `TAX_RATE` and change `0.0875` (8.75%) to your local rate.

### Changing Default Markup
In `backend/.env` or `index.html`, find `MARKUP_PCT` and change from `0.35` (35%) to your desired markup.

---

## DEPLOYMENT TO PRODUCTION

### Option A: Deploy Frontend Only (Netlify — Free)
1. Go to **https://netlify.com** → Sign up (free)
2. Drag & drop your project folder onto Netlify
3. Your site goes live instantly with a URL ✅

### Option B: Full Stack (Railway.app — Easy)
1. Go to **https://railway.app** → Sign up
2. Connect your GitHub repository
3. Railway auto-detects Node.js and deploys
4. Add environment variables in Railway dashboard
5. Add a PostgreSQL database from Railway's plugin store

### Option C: VPS (DigitalOcean, Linode, AWS)
1. Create a Ubuntu 22.04 server
2. SSH into the server
3. Follow Steps 1-8 above on the server
4. Use **PM2** to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name fence-estimator
   pm2 startup
   pm2 save
   ```
5. Use **Nginx** as a reverse proxy for port 80/443

---

## USER SETUP GUIDE

### Creating the First Admin User
The seed file creates a default admin with password `ChangeMe2026!`. **Change this immediately before going live:**
```sql
UPDATE users
SET password_hash = 'your_bcrypt_hash'
WHERE email = 'admin@fencedepot.com';
```
*(Use bcrypt to hash your new password: `node -e "const b=require('bcryptjs');b.hash('YourNewPassword',10).then(h=>console.log(h))"` )*

### Creating Additional Users
```sql
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('estimator@yourcompany.com', 'hashed_password', 'John', 'Smith', 'estimator');
```
Roles: `admin`, `estimator`, `viewer`

---

## DATA IMPORT PROCEDURES

### Import Existing Customers from CSV
```bash
psql -U fence_user -d fence_estimator -c "\COPY customers(first_name,last_name,email,phone,company_name) FROM 'customers.csv' CSV HEADER"
```

### Import Existing Products from CSV
```bash
psql -U fence_user -d fence_estimator -c "\COPY inventory(plu,name,department,category,unit,cost,price) FROM 'products.csv' CSV HEADER"
```

---

## GO-LIVE CHECKLIST

- [ ] Node.js installed and working
- [ ] PostgreSQL installed and database created
- [ ] Code downloaded from GitHub
- [ ] `npm install` completed in backend/
- [ ] `.env` file configured with real values
- [ ] Database schema loaded (schema.sql)
- [ ] Migrations run (migration-002, 003)
- [ ] Products seeded (seed.sql)
- [ ] Server starts without errors
- [ ] Admin user password changed from default
- [ ] Frontend opens in browser
- [ ] Test estimate created successfully
- [ ] PDF generation works (if using backend)
- [ ] Backup procedure scheduled

**🎉 You're live! Start creating estimates.**
