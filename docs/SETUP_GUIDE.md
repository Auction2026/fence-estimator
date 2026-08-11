# SETUP GUIDE
## Quick Setup for Programmers

---

## Prerequisites

Install these before starting:
- **Node.js 18+**: https://nodejs.org (LTS version)
- **MongoDB 6+**: https://www.mongodb.com/try/download/community
- **Git**: https://git-scm.com

---

## Quick Setup (5 Minutes)

```bash
# 1. Clone the repo
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET, email settings

# 4. Start backend
npm run dev
# Should see: ✅ MongoDB Connected | 🚀 Server running on port 3000

# 5. Open frontend (in a new terminal)
# Option A: Open directly
open ../frontend/index.html

# Option B: Serve it
cd ../frontend
npx serve .
```

---

## Environment Variables (.env)

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/fence_estimator_db
JWT_SECRET=change-this-to-a-random-secret-string-at-least-32-chars
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
COMPANY_NAME=Fence Depot
COMPANY_PHONE=555-555-5555
COMPANY_EMAIL=info@fencedepot.com
COMPANY_ADDRESS=123 Main St, Your City, ST 12345
```

---

## Verify It's Working

```bash
# Test the health endpoint
curl http://localhost:3000/api/health

# Should return:
# {"status":"ok","message":"Server is running"}
```

---

## Create First Admin Account

1. Open frontend in browser
2. Click "Register"
3. Fill in all fields
4. First user registered becomes available with estimator role
5. To make admin: use MongoDB Compass or mongosh to set role

```bash
mongosh fence_estimator_db
db.users.updateOne({email: "your@email.com"}, {$set: {role: "admin"}})
```

---

## Production Deployment

See `PART_4_IMPLEMENTATION_MENU.md` Step 6 for full production setup including:
- PM2 process manager
- Nginx reverse proxy
- SSL certificate
- MongoDB Atlas cloud database

---

## Technology Notes

- **Backend**: Express.js REST API with JWT auth
- **Database**: MongoDB with Mongoose ORM
- **Frontend**: Vanilla JS (no framework required)
- **PDFs**: Generated server-side with PDFKit
- **Email**: Nodemailer (Gmail or SMTP)

---

## Folder Structure

```
backend/server.js        ← All routes and business logic (1,234 lines)
frontend/index.html      ← Main app (17 tabs)
frontend/js/api.js       ← All API calls
frontend/js/calculations.js ← Estimate math
database/schema.sql      ← Table reference (MongoDB equiv)
database/seed.sql        ← Product catalog
```

---

*Setup Guide - Fence Depot Fence Estimator v1.0*
