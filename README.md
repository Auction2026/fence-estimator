# 🏗️ Fence Depot Estimator — v1.0

**Professional fence estimating, contracts, crew scheduling and inventory management.**

---

## 📊 LINES OF CODE — CURRENT STATUS

| Category | Files | Lines |
|---|---|---|
| **Frontend HTML** | 3 | 4,173 |
| **Frontend CSS** | 2 | 867 |
| **Frontend JS (core)** | 6 | 1,130 |
| **Frontend JS (17 tabs)** | 17 | 724 |
| **Frontend JS (3 tools)** | 3 | 313 |
| **Backend (Express API)** | 1 | 1,234 |
| **Database (Schema + Seed)** | 6 | 479 |
| **TOTAL** | **38 files** | **~9,326 lines** |

---

## 🗂️ PROJECT STRUCTURE

```
fence-estimator/
│
├── index.html                        ← Main app (single-file, original — 1,749 lines)
├── index-professional.html           ← Professional UI variant (2,272 lines)
│
├── frontend/                         ← Modular frontend (clean split-file version)
│   ├── index.html                    ← Entry point with all 17 tabs
│   ├── package.json
│   ├── css/
│   │   ├── styles.css                ← Design tokens, layout, components (710 lines)
│   │   └── responsive.css            ← Mobile breakpoints (157 lines)
│   └── js/
│       ├── app.js                    ← App controller, tab switching, auth
│       ├── api.js                    ← API client (fetch wrapper)
│       ├── calculations.js           ← Materials calculation engine
│       ├── validation.js             ← Form validation
│       ├── storage.js                ← localStorage persistence
│       ├── ui.js                     ← Toast, modal, loader, DOM helpers
│       ├── tabs/
│       │   ├── tab01-dashboard.js    ← Dashboard stats & activity feed
│       │   ├── tab02-new-project.js  ← Customer intake form
│       │   ├── tab03-estimate.js     ← 5-step estimate wizard ⭐
│       │   ├── tab04-projects.js     ← All projects list
│       │   ├── tab05-contracts.js    ← Contract management
│       │   ├── tab06-scheduling.js   ← Job scheduling calendar
│       │   ├── tab07-crew.js         ← Crew management
│       │   ├── tab08-inventory.js    ← Inventory browser
│       │   ├── tab09-customers.js    ← Customer CRM
│       │   ├── tab10-reports.js      ← Revenue & activity reports
│       │   ├── tab11-map.js          ← Map measurement tool
│       │   ├── tab12-photos.js       ← Site photos
│       │   ├── tab13-settings.js     ← App settings
│       │   ├── tab14-help.js         ← Help & documentation
│       │   ├── tab15-payments.js     ← Payment tracking
│       │   ├── tab16-suppliers.js    ← Supplier management
│       │   └── tab17-drawing.js      ← Drawing tool tab
│       └── tools/
│           ├── drawing.js            ← Canvas fence sketcher
│           ├── mapping.js            ← Google Maps / Leaflet integration
│           └── export.js             ← PDF, CSV, print utilities
│
├── backend/
│   ├── server.js                     ← Express API (1,234 lines)
│   ├── package.json                  ← Dependencies
│   └── .env.example                  ← Environment config template
│
└── database/
    ├── schema.sql                    ← Full PostgreSQL schema (281 lines)
    ├── seed.sql                      ← 61 inventory SKUs + lookup data
    └── migrations/
        ├── 001_initial_schema.sql    ← Base schema
        ├── 002_add_payments.sql      ← Payments table
        ├── 003_add_crew_scheduling.sql ← Crew & schedule tables
        └── 004_add_suppliers.sql     ← Suppliers & purchase orders
```

---

## 🚀 QUICK START

### 1. Open the frontend (no server needed for demo)
```bash
cd frontend
# Option A — open directly in browser:
open index.html

# Option B — serve locally:
npx serve . -l 3000
# Then visit: http://localhost:3000
```

### 2. Run the backend server
```bash
cd backend
cp .env.example .env      # edit MONGO_URI and JWT_SECRET
npm install
npm run dev               # starts on http://localhost:5000
```

### 3. Set up the database
```bash
# PostgreSQL:
psql -U postgres -d fence_estimator -f database/schema.sql
psql -U postgres -d fence_estimator -f database/seed.sql
```

---

## 🔗 BACKEND API ENDPOINTS

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Create user account |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET  | `/api/auth/me` | Current user info |
| POST | `/api/projects` | Create project |
| GET  | `/api/projects` | List projects |
| GET  | `/api/projects/:id` | Get project |
| PUT  | `/api/projects/:id` | Update project |
| POST | `/api/estimates` | Create estimate |
| GET  | `/api/estimates/:projectId` | Get estimates |
| POST | `/api/contracts` | Create contract |
| GET  | `/api/contracts/:projectId` | Get contract |
| GET  | `/api/health` | Server health check |

---

## 🧱 FENCE TYPES SUPPORTED

| Type | Heights | Colors | Gates |
|---|---|---|---|
| Chain Link | 4, 5, 6, 8 ft | Galvanized, Black, Green | Single, Double, Slide |
| Wood | 4, 6, 8 ft | Natural cedar, PT | Swing, Double |
| Aluminum | 4, 5, 6, 8 ft | Black, Bronze, White | Swing |
| Vinyl PVC | 4, 6, 8 ft | White, Tan, Gray | Swing |

---

## 📦 INVENTORY

**61 SKUs** pre-loaded including:
- Chain link fabric (10 rolls — 4 to 8 ft, multiple gauges and colors)
- Line posts (6 sizes)
- Terminal/corner posts (3 sizes)
- Top rail (3 sizes × 21 ft)
- Tension wire (2 gauges)
- Hardware: brace bands, tie wire, caps, tension bars (10 items)
- Gates: 8 styles + hardware
- Concrete: 60 lb and 80 lb bags
- Wood fence: pickets, posts, rails, screws (9 items)
- Aluminum: posts, panels, gates, caps (5 items)
- Vinyl PVC: posts, panels, gates, caps (5 items)

---

## ⚙️ ENVIRONMENT VARIABLES

Copy `backend/.env.example` to `backend/.env` and set:

```
MONGO_URI=mongodb://localhost:27017/fence-estimator
JWT_SECRET=your-secret-key-here
PORT=5000
SMTP_HOST=smtp.gmail.com
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
```

---

## 📄 LICENSE

Internal use — Fence Depot © 2026
