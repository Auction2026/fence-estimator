# FENCE DEPOT ESTIMATOR — VERSION 1.0 GUIDE

**Last updated:** August 13, 2026

---

## TABLE OF CONTENTS
1. Project Overview
2. What Is In This Project (File Map)
3. How To Open and Use the Program
4. The 17 Tabs Explained
5. Installation & Setup (for the programmer)
6. How the Code Works
7. What Is Finished and What Is Left
8. Support Files

---

## SECTION 1: PROJECT OVERVIEW

**Project Name:** Fence Depot Estimator Version 1.0
**Purpose:** Professional estimation system for fence installation projects
**Technology Stack:** HTML5, CSS3, JavaScript (frontend); Node.js, Express, MongoDB/Mongoose (backend API)
**Target Users:** Fence contractors, estimators, project managers

There are **three ways to run the program**, from easiest to most advanced:

| Version | File | Needs Install? | Who It's For |
|---|---|---|---|
| Demo / walkthrough | `index.html` | No — opens in browser | Quick look at the design |
| Professional standalone | `index-professional.html` | No — opens in browser | Daily use, saves in browser |
| Full 17-tab app | `frontend/index.html` | No — opens in browser | Daily use, all 17 tabs |
| Backend API server | `backend/server.js` | Yes — Node.js + MongoDB | Programmer (multi-user, real database) |

---

## SECTION 2: WHAT IS IN THIS PROJECT (FILE MAP)

```
fence-estimator/
├── index.html                     Demo landing page + 5-step estimate wizard
├── index-professional.html       Standalone professional estimator
├── Start-Fence-Estimator.bat     One-click open (Windows)
├── Start-Fence-Estimator.command One-click open (Mac)
├── Open-Fence-Estimator.url      Desktop shortcut — copy to your desktop (Windows)
├── PROGRAMMER_HANDOFF.md         Hand this to your programmer
├── frontend/
│   ├── index.html                17-tab application
│   ├── css/
│   │   ├── styles.css            Main styling
│   │   └── responsive.css        Phone/tablet layout
│   └── js/
│       ├── app.js                Main logic — all 17 tabs wired up
│       ├── api.js                Talks to backend API (optional)
│       ├── calculations.js       Estimate calculation engine
│       ├── validation.js         Form checking (email, phone, postal)
│       ├── storage.js            Saves data in the browser
│       ├── ui.js                 Notifications, tab switching, tables
│       └── tabs/
│           ├── tab1-project.js   Project info helpers
│           ├── tab2-specs.js     Fence specs helpers
│           ├── tab3-layout.js    Layout canvas helpers
│           ├── tab4-installation.js
│           └── tab5-drawings.js
├── backend/
│   ├── server.js                 Express API server (12 endpoints, MongoDB)
│   └── package.json              npm start / npm run dev / npm test
└── docs/
    ├── FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md  (this file)
    └── research/                 Analysis notes
```

---

## SECTION 3: HOW TO OPEN AND USE THE PROGRAM

### Easiest — click the link
👉 https://html-preview.github.io/?url=https://github.com/Auction2026/fence-estimator/blob/main/index.html

### From your computer
1. **Windows:** double-click `Start-Fence-Estimator.bat`
2. **Mac:** double-click `Start-Fence-Estimator.command`
3. Or double-click `index.html`, `index-professional.html`, or `frontend/index.html` directly.

Your work saves automatically in the browser (localStorage). No internet needed after the page is open.

---

## SECTION 4: THE 17 TABS EXPLAINED (frontend/index.html)

| # | Tab | What it does |
|---|---|---|
| 1 | Project | Customer name, address, contact info |
| 2 | Specs | Fence type, height, color, footage, gates — feeds the estimate |
| 3 | Layout | Draw the fence layout with your mouse |
| 4 | Install | Installation task/labor breakdown table |
| 5 | Drawings | Upload shop drawings (PDF/JPG/PNG) |
| 6 | Permits | Permit number and status |
| 7 | Utilities | Utility locate checklist (hydro, gas, water, sewer) |
| 8 | Estimate | Live totals — materials, labor, equipment, tax; Generate PDF; Lock Price |
| 9 | Contract | Customer + locked price, mouse signature, sign contract |
| 10 | Extras | Add extra items — automatically added to the estimate |
| 11 | Crew | Crew list with roles |
| 12 | Changes | Change orders with cost |
| 13 | SignOff | Completion checklist and final sign-off |
| 14 | Notes | Timestamped project notes |
| 15 | Admin | Project count and revenue summary |
| 16 | Catalog | Product list with live search |
| 17 | Mapping | Property map (needs a Google Maps API key — see handoff) |

---

## SECTION 5: INSTALLATION & SETUP (FOR THE PROGRAMMER)

The browser versions need **no installation**. The backend API is optional and needs:

1. **Node.js 18+** — nodejs.org
2. **MongoDB 6+** — mongodb.com/try/download/community (the server exits at startup if MongoDB is not running)
3. Then:
   ```bash
   git clone https://github.com/Auction2026/fence-estimator.git
   cd fence-estimator/backend
   npm install
   npm start          # or: npm run dev (auto-restart)
   ```
4. Server runs at http://localhost:5000 (health check: `GET /api/health`).
5. Optional environment variables: `PORT`, `MONGO_URI`, `JWT_SECRET`.

### Backend API endpoints (backend/server.js)
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `POST/GET /api/projects`, `GET/PUT /api/projects/:projectId`
- `POST /api/estimates`, `GET /api/estimates/:projectId`
- `POST /api/contracts`, `GET /api/contracts/:projectId`
- `GET /api/health`

---

## SECTION 6: HOW THE CODE WORKS

### Frontend (frontend/js/app.js)
- `appState` object holds everything: project data, specs, estimate, extras, crew, notes, change orders.
- Every change calls `saveAppState()` → browser localStorage → survives closing the page.
- `calculateEstimate()` prices by fence type ($/linear ft), labor at $50/hr × 0.5 hr/ft, equipment, gates, plus extras; `calculateTotal()` adds 13% tax.
- `generatePDF()` opens a printable estimate; `lockPrice()` freezes the total onto the Contract tab.

### Calculation engine (frontend/js/calculations.js)
`EstimationCalculator` class: material prices by type and grade (standard/premium/commercial), labor rates by role, discounts, installment plans, and timeline estimates.

### Backend (backend/server.js)
Express + Mongoose. Schemas: User, Project, FenceSpecs, Estimate, Contract, ChangeOrder, SignOff, Notes. JWT authentication with bcrypt password hashing. Its own calculation engine mirrors the frontend one.

---

## SECTION 7: WHAT IS FINISHED AND WHAT IS LEFT

### ✅ Finished
- Demo walkthrough (`index.html`) — landing, login, dashboard, 5-step wizard
- Professional standalone (`index-professional.html`)
- 17-tab app (`frontend/index.html`) — **all 17 tabs now work** (completed Aug 13, 2026)
- Browser saving (localStorage) for all tabs
- Printable PDF estimate, price lock, contract signature
- Backend API with authentication and 12 endpoints

### ⏳ Left for the programmer (details in PROGRAMMER_HANDOFF.md)
1. Google Maps API key for Tab 17 (Mapping)
2. Connect frontend to backend API (`js/api.js` is ready but unused — app currently saves in browser only)
3. Real product catalog import (Tab 16 has 10 sample products; full POS inventory pending)
4. Email sending for estimates/contracts (backend has nodemailer installed)
5. Optional: split tab 6–17 logic from app.js into separate files under `js/tabs/` to match tabs 1–5

---

## SECTION 8: SUPPORT FILES

- `PROGRAMMER_HANDOFF.md` — everything your programmer needs, in one file
- `docs/research/` — analysis and troubleshooting notes
- `FENCE_MATERIAL_SPECIFICATIONS.md` — fence material reference
- `README.md` — quick start with the click-to-open link
