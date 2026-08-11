# PART 4: FENCE ESTIMATOR IMPLEMENTATION MENU
## Complete 6-Step Setup Guide for Your Programmer

---

## OVERVIEW

This guide walks your programmer through setting up the complete Fence Depot Fence Estimator system from start to finish. Follow each step in order.

---

## STEP 1: SYSTEM REQUIREMENTS

### Server Requirements
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **MongoDB**: Version 6.x or higher (Community Edition is free)
- **Operating System**: Windows 10/11, macOS 12+, or Ubuntu 20.04+
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: Minimum 10GB free

### For Local Development (Programmer's Computer)
```
Node.js:  https://nodejs.org (download LTS version)
MongoDB:  https://www.mongodb.com/try/download/community
Git:      https://git-scm.com/downloads
```

### For Production Server (Live Website)
```
Cloud Options:
- DigitalOcean Droplet ($6/month): https://www.digitalocean.com
- AWS EC2 (t3.small): https://aws.amazon.com
- Railway.app (easy Node.js hosting): https://railway.app
- Render.com (free tier available): https://render.com

Database Options:
- MongoDB Atlas (free 512MB): https://www.mongodb.com/cloud/atlas
- Self-hosted MongoDB on same server
```

---

## STEP 2: DOWNLOAD AND SETUP

### 2A. Clone the Repository
```bash
# Open Terminal (Mac/Linux) or Command Prompt (Windows)
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator
```

### 2B. Review Folder Structure
```
fence-estimator/
├── backend/           ← Server code (Node.js/Express)
│   ├── server.js      ← Main server file
│   ├── package.json   ← Dependencies list
│   └── .env.example   ← Environment variables template
├── frontend/          ← Web interface (HTML/CSS/JS)
│   ├── index.html     ← Main application page
│   ├── css/           ← Stylesheets
│   └── js/            ← JavaScript files
├── database/          ← Database setup
│   ├── schema.sql     ← Table definitions
│   ├── seed.sql       ← Product data
│   └── migrations/    ← Database update scripts
└── docs/              ← Documentation
```

### 2C. Install Backend Dependencies
```bash
# Navigate to backend folder
cd backend

# Install all required packages
npm install

# This will install:
# - express (web server)
# - mongoose (MongoDB connection)
# - jsonwebtoken (user login security)
# - bcryptjs (password encryption)
# - cors (cross-origin requests)
# - dotenv (environment variables)
# - nodemailer (email sending)
# - pdfkit (PDF generation)
# - multer (file uploads)
```

### 2D. Verify Installation
```bash
# Check that all packages installed
npm list --depth=0

# You should see a list of packages without errors
```

---

## STEP 3: DATABASE SETUP

### 3A. Install MongoDB
**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run the installer (choose "Complete" installation)
3. MongoDB will start automatically as a Windows Service

**Mac:**
```bash
# Install with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Ubuntu/Linux:**
```bash
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 3B. Verify MongoDB is Running
```bash
# Check MongoDB status
mongosh

# You should see the MongoDB shell prompt
# Type: exit  to quit
```

### 3C. Create Database
```bash
# In MongoDB shell:
mongosh

use fence_estimator_db

# Create first admin user
db.users.insertOne({
  username: "admin",
  email: "admin@fencedepot.com",
  password: "$2a$10$placeholder",  // Will be set properly via app
  role: "admin",
  company: "Fence Depot",
  createdAt: new Date()
})

exit
```

### 3D. Using MongoDB Atlas (Cloud Database - Recommended for Production)
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create free cluster (M0 - 512MB free)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `******cluster0.xxxxx.mongodb.net/`)
6. Use this in your .env file (see Step 4)

---

## STEP 4: ENVIRONMENT CONFIGURATION

### 4A. Create Environment File
```bash
# In the backend/ folder
cp .env.example .env
```

### 4B. Edit the .env File
Open `backend/.env` in a text editor and fill in:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database (choose one)
# Option A - Local MongoDB:
MONGO_URI=mongodb://localhost:27017/fence_estimator_db

# Option B - MongoDB Atlas (Cloud):
MONGO_URI=******cluster0.xxxxx.mongodb.net/fence_estimator_db

# Security (CHANGE THIS - use a long random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-long-and-random-123456

# Email Configuration (for sending estimates by email)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Company Information
COMPANY_NAME=Fence Depot
COMPANY_PHONE=555-555-5555
COMPANY_EMAIL=info@fencedepot.com
COMPANY_ADDRESS=123 Main Street, Your City, ST 12345
```

### 4C. Gmail App Password Setup (for Email Feature)
1. Go to your Google Account: https://myaccount.google.com
2. Security → 2-Step Verification → Turn ON
3. Security → App passwords
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password
6. Use this as EMAIL_PASS in your .env file

---

## STEP 5: STARTING THE APPLICATION

### 5A. Start the Backend Server
```bash
# In the backend/ folder
cd backend

# For development (auto-restarts when you make changes)
npm run dev

# For production
npm start

# You should see:
# ✅ MongoDB Connected: localhost
# 🚀 Server running on port 3000
```

### 5B. Open the Frontend
```bash
# Option A: Open directly in browser
# Double-click: frontend/index.html
# OR drag the file into your browser

# Option B: Serve with a simple server (recommended)
cd frontend
npx serve .
# Then open: http://localhost:3000 or http://localhost:5000
```

### 5C. First Login
1. Open browser to: http://localhost:3000
2. Click "Register" to create your first account
3. Fill in: Username, Email, Password, Company Name
4. Click Register
5. Login with your new credentials

### 5D. Test the Application
After logging in, you should be able to:
- ✅ Create a new project
- ✅ Fill in customer information
- ✅ Add fence specifications
- ✅ Generate an estimate
- ✅ Create a contract

---

## STEP 6: PRODUCTION DEPLOYMENT

### 6A. Deploy to Railway.app (Easiest Option)
1. Go to: https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your fence-estimator repository
5. Add environment variables from your .env file
6. Railway will automatically deploy

### 6B. Deploy to DigitalOcean Droplet
```bash
# On your local computer, SSH into your server
ssh root@YOUR_SERVER_IP

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator/backend

# Install dependencies
npm install

# Create and edit .env file
nano .env
# (Fill in your production settings)

# Install PM2 (keeps app running 24/7)
npm install -g pm2
pm2 start server.js --name fence-estimator
pm2 startup
pm2 save
```

### 6C. Set Up Nginx (Reverse Proxy)
```bash
sudo apt install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/fence-estimator
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/fence-estimator/frontend;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/fence-estimator /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6D. Set Up SSL (HTTPS) with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_DOMAIN.com
# Follow the prompts
# Certbot will automatically renew the certificate
```

---

## QUICK REFERENCE CARD

### Common Commands
```bash
# Start development server
cd backend && npm run dev

# Check if server is running
curl http://localhost:3000/api/health

# View server logs
pm2 logs fence-estimator

# Restart server
pm2 restart fence-estimator

# Stop server
pm2 stop fence-estimator
```

### API Endpoints Summary
```
POST   /api/auth/register    - Create new user account
POST   /api/auth/login       - Login
GET    /api/projects         - List all projects
POST   /api/projects         - Create project
GET    /api/projects/:id     - Get project details
PUT    /api/projects/:id     - Update project
DELETE /api/projects/:id     - Delete project
GET    /api/estimates        - List estimates
POST   /api/estimates        - Create estimate
GET    /api/contracts        - List contracts
POST   /api/contracts        - Create contract
GET    /api/change-orders    - List change orders
POST   /api/change-orders    - Create change order
GET    /api/notes            - List notes
POST   /api/notes            - Create note
GET    /api/inventory        - List products
```

### Default Ports
```
Backend Server:  3000
Frontend Dev:    5000 (when using npx serve)
MongoDB:         27017
```

---

## PROGRAMMER NOTES

### Technologies Used
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)
- **PDF Generation**: PDFKit
- **Email**: Nodemailer

### File to Modify for Company Info
Edit `backend/.env` to change company name, address, phone, email.

### Adding New Products to Inventory
Products are stored in MongoDB. Use the admin panel or MongoDB Compass to add products directly to the `products` collection.

### Backup Database
```bash
mongodump --db fence_estimator_db --out ./backup/$(date +%Y%m%d)
```

### Restore Database
```bash
mongorestore --db fence_estimator_db ./backup/YYYYMMDD/fence_estimator_db
```

---

*Implementation Guide Complete - Fence Depot Fence Estimator v1.0*
