# PART 4: IMPLEMENTATION MENU
## Fence Depot Fence Estimator — Complete 6-Step Setup Guide

---

## OVERVIEW

This guide walks you (or your programmer) through setting up the Fence Depot Fence Estimator from scratch. Follow every step in order.

**What you will need:**
- A computer with internet access
- About 2–3 hours to complete setup
- Your programmer (or a basic knowledge of Node.js)

---

## STEP 1: INSTALL REQUIRED SOFTWARE

### 1A — Install Node.js

Node.js is the engine that runs the backend server.

1. Go to: **https://nodejs.org**
2. Click the big green **"LTS"** button (recommended for most users)
3. Download and run the installer
4. Follow the on-screen prompts (click Next → Next → Install → Finish)
5. Verify install: Open a terminal/command prompt and type:
   ```
   node --version
   ```
   You should see something like: `v18.17.0`

### 1B — Install Git

Git is used to download and manage the code.

1. Go to: **https://git-scm.com**
2. Click "Download for Windows" (or Mac)
3. Install with default settings
4. Verify: Open terminal and type:
   ```
   git --version
   ```

### 1C — Install MySQL (Database)

1. Go to: **https://dev.mysql.com/downloads/mysql/**
2. Download **MySQL Community Server** (free)
3. Run the installer — choose "Developer Default"
4. Set a root password (write this down!)
5. Complete the installation

### 1D — (Optional) Install VS Code (Code Editor)

1. Go to: **https://code.visualstudio.com**
2. Download and install
3. This lets you view and edit the code files

---

## STEP 2: DOWNLOAD THE CODE FROM GITHUB

1. Open a terminal (Command Prompt on Windows, Terminal on Mac)

2. Navigate to where you want to save the project:
   ```
   cd C:\Projects
   ```
   *(or any folder you prefer)*

3. Clone the repository:
   ```
   git clone https://github.com/Auction2026/fence-estimator.git
   ```

4. Enter the project folder:
   ```
   cd fence-estimator
   ```

5. You should now see these folders:
   ```
   fence-estimator/
   ├── backend/        ← Server code
   ├── database/       ← Database setup files
   ├── docs/           ← Documentation
   └── index.html      ← Frontend app
   ```

---

## STEP 3: SET UP THE DATABASE

### 3A — Log in to MySQL

Open a terminal and type:
```
mysql -u root -p
```
Enter your root password when prompted.

### 3B — Run the Schema (creates all 9 tables)

In the MySQL prompt, run:
```sql
source C:/Projects/fence-estimator/database/schema.sql
```
*(Replace the path with your actual path)*

### 3C — Load the Product Data (seed data)

```sql
source C:/Projects/fence-estimator/database/seed.sql
```

### 3D — Verify Setup

```sql
USE fence_estimator;
SHOW TABLES;
SELECT COUNT(*) FROM inventory_products;
```

You should see **9 tables** and **250+ products** loaded.

### 3E — Create App Database User

```sql
source C:/Projects/fence-estimator/database/migrations/001_create_database.sql
```

---

## STEP 4: CONFIGURE THE BACKEND SERVER

### 4A — Install Node.js Dependencies

In your terminal, navigate to the backend folder:
```
cd C:\Projects\fence-estimator\backend
npm install
```

This downloads all required packages (may take 2–3 minutes).

### 4B — Create Environment File

1. In the `backend/` folder, find the file `.env.example`
2. Copy it and rename the copy to `.env`
3. Open `.env` in a text editor and fill in your settings:

```
# Database Connection
DB_HOST=localhost
DB_PORT=3306
DB_NAME=fence_estimator
DB_USER=fence_app
DB_PASSWORD=<your-strong-database-password>

# JWT Secret (change this to something random!)
JWT_SECRET=your-super-secret-key-change-this-now-12345

# Server Port
PORT=3001

# Email (optional - for sending estimates)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Important:** Change `JWT_SECRET` to any long random string (for security).

### 4C — Start the Backend Server

```
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 3001
```

**Keep this terminal window open** — the server must stay running.

---

## STEP 5: OPEN THE FRONTEND APP

The frontend is a single HTML file that works in any web browser.

### Option A — Open Directly (Simple)

1. Find the file: `fence-estimator/index.html`
2. Double-click it to open in your web browser
3. The app will load immediately

### Option B — Run with Local Server (Recommended)

For full features (API calls to backend), serve the frontend:

1. Open a NEW terminal (keep the backend terminal open)
2. Navigate to the main project folder:
   ```
   cd C:\Projects\fence-estimator
   ```
3. Install a simple server:
   ```
   npm install -g serve
   ```
4. Start it:
   ```
   serve . -p 3000
   ```
5. Open your browser and go to: **http://localhost:3000**

---

## STEP 6: VERIFY EVERYTHING WORKS

### 6A — Test the Frontend

1. Open the app in your browser
2. You should see the **Fence Depot** landing page
3. Click **"Demo Mode"** or **"Login"**
4. Navigate through the tabs: Dashboard, New Estimate, Projects, etc.
5. Try creating a test estimate

### 6B — Test the Backend API

Open a browser and go to:
```
http://localhost:3001/health
```

You should see:
```json
{ "status": "ok", "timestamp": "2024-..." }
```

### 6C — Test Database Connection

In the MySQL terminal:
```sql
USE fence_estimator;
SELECT * FROM inventory_products LIMIT 5;
```

You should see product rows.

### 6D — Full System Checklist

| Component         | Test                              | Expected Result        |
|------------------|-----------------------------------|------------------------|
| Node.js          | `node --version`                  | v18+ shown             |
| MySQL            | Connect to fence_estimator DB     | Connected successfully |
| Backend Server   | `http://localhost:3001/health`    | `{"status":"ok"}`      |
| Frontend App     | Open index.html in browser        | App loads with tabs    |
| Product Data     | COUNT(*) from inventory_products  | 250+ rows              |
| Login System     | Login with admin / password       | Dashboard appears      |

---

## QUICK REFERENCE — STARTING THE SYSTEM

Every time you want to use the estimator, do this:

**Step 1:** Start MySQL (if not running as a service)
**Step 2:** Open terminal → go to `backend/` → run `npm start`
**Step 3:** Open browser → go to `http://localhost:3000` (or open index.html)

---

## PROGRAMMER NOTES

- Backend uses **Express.js** with MongoDB/Mongoose schemas
- To switch from MongoDB to MySQL: replace the Mongoose models with Sequelize or raw MySQL2 queries
- Frontend is a standalone SPA (single HTML file) — no build step needed
- All 8 tabs are implemented in index.html
- API base URL is configured in the frontend's `API_BASE` constant

---

## SUPPORT

If you run into problems, see:
- `docs/PART_5_TROUBLESHOOTING_GUIDE.md` — 110+ common issues and solutions
- GitHub Issues: https://github.com/Auction2026/fence-estimator/issues
