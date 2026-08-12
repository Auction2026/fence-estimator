# 🏗️ Fence Depot Estimator

**Professional Fence Estimation Software for Fence Depot**

[![Repository](https://img.shields.io/badge/GitHub-Auction2026%2Ffence--estimator-blue)](https://github.com/Auction2026/fence-estimator)

---

## 🚀 Quick Start

```
https://github.com/Auction2026/fence-estimator
```

Open `index.html` in your browser — **no installation required** for the frontend.

---

## 📂 Project Structure (40 Sections)

```
fence-estimator/
│
├── index.html                  ← Original single-file version (works standalone)
├── index-professional.html     ← Professional version
│
├── frontend/                   ← ORGANIZED FRONTEND (Sections 1–27)
│   ├── index.html              ← Section 1: Main HTML
│   ├── package.json            ← Section 10: Frontend config
│   ├── css/
│   │   ├── styles.css          ← Section 2: Main styles
│   │   └── responsive.css      ← Section 3: Mobile styles
│   └── js/
│       ├── app.js              ← Section 4: Core app logic
│       ├── api.js              ← Section 5: Backend API calls
│       ├── calculations.js     ← Section 6: Material calculations
│       ├── validation.js       ← Section 7: Form validation
│       ├── storage.js          ← Section 8: localStorage helpers
│       ├── ui.js               ← Section 9: UI utilities
│       ├── tabs/
│       │   ├── tab01-dashboard.js   ← Section 11
│       │   ├── tab02-estimates.js   ← Section 12
│       │   ├── tab03-chain-link.js  ← Section 13
│       │   ├── tab04-vinyl.js       ← Section 14
│       │   ├── tab05-wood.js        ← Section 15
│       │   ├── tab06-ornamental.js  ← Section 16
│       │   ├── tab07-farm.js        ← Section 17
│       │   ├── tab08-gates.js       ← Section 18
│       │   ├── tab09-access.js      ← Section 19
│       │   ├── tab10-drawing.js     ← Section 20
│       │   ├── tab11-inventory.js   ← Section 21
│       │   ├── tab12-suppliers.js   ← Section 22
│       │   ├── tab13-analytics.js   ← Section 23
│       │   ├── tab14-reports.js     ← Section 24
│       │   ├── tab15-settings.js    ← Section 25
│       │   ├── tab16-mapping.js     ← Section 26
│       │   └── tab17-customers.js   ← Section 27
│       └── tools/
│           ├── drawing.js      ← Section 28: Canvas drawing tool
│           ├── mapping.js      ← Section 29: Google Maps tool
│           └── export.js       ← Section 30: PDF/CSV export
│
├── backend/                    ← EXPRESS SERVER (Sections 31–34)
│   ├── server.js               ← Section 31: Main Express server
│   ├── package.json            ← Backend dependencies
│   ├── .env.example            ← Environment variables template
│   ├── routes/
│   │   └── api.js              ← Section 32: API routes
│   ├── controllers/
│   │   ├── authController.js   ← Section 33: Auth controller
│   │   └── projectController.js ← Section 33: Project controller
│   └── middleware/
│       └── auth.js             ← Section 34: JWT middleware
│
├── database/                   ← DATABASE (Sections 35–38)
│   ├── schema.sql              ← Section 35: Table definitions
│   ├── seed.sql                ← Section 36: Sample data
│   ├── migrations/
│   │   └── 001_initial_schema.sql ← Section 37: Migration
│   └── procedures/
│       └── functions.sql       ← Section 38: Stored procedures
│
└── docs/                       ← DOCUMENTATION (Sections 39–40)
    ├── FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md ← Section 39
    └── WIRE_GRIDS/             ← Section 40: Architecture diagrams
```

---

## 🔗 Direct Links to All 40 Sections

See [SECTIONS_INDEX.md](./SECTIONS_INDEX.md) for clickable links to every file.

---

## ⚡ How to Run

### Option 1: Open in Browser (No Install)
```
1. Download this repository
2. Open index.html in your browser
3. Done! No server needed.
```

### Option 2: Run the Full Stack

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB connection
npm run dev
```

**Frontend (served by backend):**
```
Open http://localhost:3000 in your browser
```

---

## 🏗️ What This App Does

- 📋 **Create estimates** for chain link, vinyl, wood, ornamental, and farm fencing
- 🔢 **Calculate materials** automatically (posts, rails, mesh, fittings)
- 💰 **Price materials** from real inventory database
- 📄 **Generate PDF** estimates to email to customers
- 🗺️ **Draw fence layouts** on canvas or Google Maps
- 📊 **Track analytics** and close rates

---

## 📞 Support

Repository: [github.com/Auction2026/fence-estimator](https://github.com/Auction2026/fence-estimator)
