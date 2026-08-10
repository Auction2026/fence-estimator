# PART 4 – IMPLEMENTATION MENU
## Fence Depot Fence Estimator – Step-by-Step Setup Guide

---

## ✅ BEFORE YOU START – REQUIREMENTS

Make sure you have these installed:

| Requirement | Version | Where to Get It |
|------------|---------|-----------------|
| Node.js | v18 or newer | https://nodejs.org |
| npm | v9 or newer | Comes with Node.js |
| MongoDB | v6 or newer | https://www.mongodb.com |
| Git | Any | https://git-scm.com |
| A web browser | Chrome, Edge, Firefox | Already installed |

---

## 📋 STEP 1 – DOWNLOAD THE CODE

Open a terminal (Command Prompt on Windows) and type:

```bash
# Clone the repository
git clone https://github.com/Auction2026/fence-estimator.git

# Go into the folder
cd fence-estimator
```

You will now see all the files on your computer.

---

## 📋 STEP 2 – SET UP THE BACKEND (SERVER)

```bash
# Go into the backend folder
cd backend

# Install all required packages
npm install

# This downloads everything the server needs
# It may take 1-2 minutes
```

---

## 📋 STEP 3 – CONFIGURE ENVIRONMENT VARIABLES

The backend needs a configuration file. Create it:

```bash
# While still in the backend/ folder, copy the example file:
cp .env.example .env
```

Now open the `.env` file in a text editor and fill in your values:

```
# ============================================================
# REQUIRED SETTINGS – Fill these in
# ============================================================

# Your MongoDB database address
MONGO_URI=mongodb://localhost:27017/fence-estimator

# Secret key for user logins (make this a long random string)
JWT_SECRET=your-secret-key-here-make-it-long-and-random

# Which port the server runs on
PORT=3001

# ============================================================
# OPTIONAL SETTINGS
# ============================================================

# Email settings (for sending estimates by email)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@fencedepot.com

# Google Maps API (for Tab 17 - Mapping)
GOOGLE_MAPS_API_KEY=your-google-maps-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**IMPORTANT:**
- Never share your `.env` file with anyone
- Never put real passwords or API keys in GitHub

---

## 📋 STEP 4 – START MONGODB DATABASE

MongoDB needs to be running before the backend starts.

**On Windows:**
1. Open Services (press Win + R, type `services.msc`)
2. Find "MongoDB" in the list
3. Right-click → Start
4. OR open Command Prompt and type: `net start MongoDB`

**On Mac/Linux:**
```bash
# Start MongoDB
sudo systemctl start mongod

# OR on Mac with Homebrew:
brew services start mongodb-community
```

**Verify MongoDB is running:**
```bash
# Connect to MongoDB to test it
mongosh
# If it shows a prompt like "test>", MongoDB is running!
# Type exit to quit
```

---

## 📋 STEP 5 – START THE BACKEND SERVER

```bash
# Make sure you're in the backend/ folder
cd backend

# Start the server
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Fence Estimator Server running on port 3001
📍 Health check: http://localhost:3001/health
```

If you see errors, see **Part 5: Troubleshooting Guide**.

---

## 📋 STEP 6 – OPEN THE FRONTEND

The frontend is a simple HTML file – no build needed!

**Option A: Open directly in browser**
1. Go to your `fence-estimator` folder
2. Go into the `frontend` folder
3. Double-click `index.html`
4. It will open in your browser!

**Option B: Use a simple web server (recommended)**
```bash
# Install a simple server (one time only)
npm install -g live-server

# Go to the frontend folder
cd frontend

# Start the server
live-server

# It will open automatically at http://localhost:8080
```

---

## 📋 STEP 7 – TEST THE APPLICATION

Once both backend and frontend are running:

1. **Open browser:** `http://localhost:8080`
2. **You should see:** The Fence Estimator with 17 tabs
3. **Test Tab 1:** Enter customer information
4. **Test Tab 2:** Select "Chain Link" fence type
5. **Test Tab 3:** Enter 100 feet of footage
6. **Test Tab 4:** Click "Calculate Materials" – you should see a parts list!

---

## 📋 STEP 8 – CREATE YOUR FIRST ESTIMATE

1. **Tab 1 – Project Info**
   - Enter customer name, address, phone
   - Click "Save & Continue"

2. **Tab 2 – Fence Specs**
   - Select: Chain Link
   - Height: 6 ft
   - Color: Galvanized
   - Click "Save & Continue"

3. **Tab 3 – Layout**
   - Enter total footage: 200
   - Click "Save & Continue"

4. **Tab 4 – Materials**
   - Click "Calculate Materials"
   - Review the materials list
   - Adjust quantities if needed

5. **Tab 5 – Labor**
   - Enter crew size and hours
   - Labor total calculates automatically

6. **Tab 7 – Estimate Summary**
   - Click "Build Estimate"
   - See the total price
   - Click "Print Estimate" to print it

---

## 📋 OPTIONAL: DEPLOY TO A SERVER (for remote access)

If you want the estimator accessible from any computer:

### Deploy to Heroku (Easy)
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create fence-depot-estimator

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set MONGO_URI=your-mongodb-atlas-uri

# Deploy
git push heroku main
```

### Deploy to VPS (Advanced)
1. Get a server from DigitalOcean, Linode, or AWS
2. Install Node.js and MongoDB on the server
3. Copy files to server
4. Use PM2 to keep server running:
```bash
npm install -g pm2
pm2 start backend/server.js --name fence-estimator
pm2 startup
pm2 save
```

---

## ✅ SETUP COMPLETE CHECKLIST

```
□ Node.js installed
□ npm install completed in backend/
□ .env file created with MONGO_URI and JWT_SECRET
□ MongoDB running
□ Backend started (npm start in backend/)
□ Frontend opened in browser
□ First estimate created successfully
□ Print estimate tested
```

---

## 🆘 NEED HELP?

See **Part 5: Troubleshooting Guide** for solutions to 110+ common issues.

---

*Fence Depot Fence Estimator – Implementation Guide v1.0*
