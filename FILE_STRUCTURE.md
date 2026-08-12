# 📂 File Structure — Fence Depot Estimator

Complete visual tree of all files and what each one does.

```
fence-estimator/
│
├── README.md                       ← Start here — project overview
├── SECTIONS_INDEX.md               ← All 40 sections with links
├── QUICK_START.md                  ← Get running in 5 minutes
├── FILE_STRUCTURE.md               ← This file
├── NAVIGATION_GUIDE.md             ← How to find anything
├── SECTIONS_OVERVIEW.md            ← Table of all 40 sections
│
├── index.html                      ← STANDALONE VERSION (works without server)
├── index-professional.html         ← Professional UI version
│
├── frontend/                       ← ORGANIZED FRONTEND
│   ├── index.html                  ← Linked version (uses external CSS/JS)
│   ├── package.json
│   ├── css/
│   │   ├── styles.css              ← Main CSS (931 lines)
│   │   └── responsive.css          ← Responsive/mobile CSS
│   └── js/
│       ├── app.js                  ← Core navigation & wizard logic
│       ├── api.js                  ← Fetch calls to backend API
│       ├── calculations.js         ← Material quantity math
│       ├── validation.js           ← Input validation
│       ├── storage.js              ← localStorage utilities
│       ├── ui.js                   ← Toast, loading, formatting
│       ├── tabs/
│       │   ├── tab01-dashboard.js
│       │   ├── tab02-estimates.js
│       │   ├── tab03-chain-link.js
│       │   ├── tab04-vinyl.js
│       │   ├── tab05-wood.js
│       │   ├── tab06-ornamental.js
│       │   ├── tab07-farm.js
│       │   ├── tab08-gates.js
│       │   ├── tab09-access.js
│       │   ├── tab10-drawing.js
│       │   ├── tab11-inventory.js
│       │   ├── tab12-suppliers.js
│       │   ├── tab13-analytics.js
│       │   ├── tab14-reports.js
│       │   ├── tab15-settings.js
│       │   ├── tab16-mapping.js
│       │   └── tab17-customers.js
│       └── tools/
│           ├── drawing.js          ← Canvas drawing tool
│           ├── mapping.js          ← Google Maps integration
│           └── export.js           ← PDF & CSV export
│
├── backend/                        ← EXPRESS.JS SERVER
│   ├── server.js                   ← Main server + MongoDB models
│   ├── package.json                ← npm dependencies
│   ├── .env.example                ← Environment config template
│   ├── routes/
│   │   └── api.js                  ← REST API routes
│   ├── controllers/
│   │   ├── authController.js       ← Login/logout/token
│   │   └── projectController.js    ← CRUD for estimates/customers
│   └── middleware/
│       └── auth.js                 ← JWT verification
│
├── database/                       ← SQL DATABASE FILES
│   ├── schema.sql                  ← Create all tables
│   ├── seed.sql                    ← Insert sample data
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── procedures/
│       └── functions.sql           ← Triggers & functions
│
├── docs/                           ← DOCUMENTATION
│   ├── FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md
│   └── WIRE_GRIDS/                 ← Architecture diagrams
│
├── BACKUP_LOG.md
├── FENCE_MATERIAL_SPECIFICATIONS.md
└── MEGA_RESEARCH_SESSION_LOG.md
```

---

## File Count Summary

| Area | Files |
|------|-------|
| Root docs | 6 |
| Frontend HTML | 2 |
| Frontend CSS | 2 |
| Frontend JS Core | 6 |
| Frontend Tab Files | 17 |
| Frontend Tools | 3 |
| Backend | 6 |
| Database | 4 |
| Documentation | 2 |
| **TOTAL** | **48** |
