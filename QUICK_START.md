# ⚡ Quick Start Guide

Get the Fence Depot Estimator running in under 5 minutes.

---

## Option A — Open Directly in Browser (Fastest)

**No installation. No server. Just open and use.**

1. Go to: [github.com/Auction2026/fence-estimator](https://github.com/Auction2026/fence-estimator)
2. Click **index.html**
3. Click **Raw** button
4. Save the page (`Ctrl+S` / `Cmd+S`)
5. Open the saved file in your browser
6. Done ✅

---

## Option B — Download and Run Locally

```bash
# 1. Download the repo
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator

# 2. Open the app
open index.html          # Mac
start index.html         # Windows
xdg-open index.html      # Linux
```

---

## Option C — Run Full Stack (Backend + Frontend)

```bash
# 1. Clone repo
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator

# 2. Setup backend
cd backend
npm install
cp .env.example .env

# 3. Edit .env file - add your MongoDB connection string
# MONGO_URI=mongodb://localhost:27017/fence-estimator
# JWT_SECRET=your-secret-key-here

# 4. Start backend
npm run dev

# 5. Open browser to http://localhost:3000
```

---

## Default Login

| Field | Value |
|-------|-------|
| Username | admin |
| Password | admin123 |

> ⚠️ **Change the password after first login**

---

## What You'll See

1. **Landing page** — Fence Depot branding + features
2. **Login screen** — Enter credentials (or click Demo Mode)
3. **Dashboard** — 17 tabs across the top:
   - 📊 Dashboard
   - 📋 Estimates
   - ⛓️ Chain Link
   - 🪵 Wood, Vinyl, Ornamental, Farm
   - 🚪 Gates
   - 🗝️ Access Control
   - ✏️ Drawing Tool
   - 📦 Inventory
   - 📊 Analytics & Reports
   - ⚙️ Settings
   - 🗺️ Mapping

---

## Create Your First Estimate

1. Click **Estimates** tab
2. Click **New Estimate** button
3. Fill in customer name, address, phone
4. Select fence type (Chain Link, Vinyl, Wood, etc.)
5. Enter linear footage and height
6. Click **Generate Estimate**
7. View materials list with prices
8. Click **Print / PDF** to send to customer

---

## Need Help?

- 📋 See [SECTIONS_INDEX.md](./SECTIONS_INDEX.md) for all 40 code files
- 📖 See [docs/FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md](./docs/FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md) for complete guide
- 📁 See [README.md](./README.md) for full project overview
