# WIRE GRID 1 – SYSTEM ARCHITECTURE DIAGRAM
## How All Parts of the Fence Estimator Connect Together

---

## 🗺️ OVERVIEW: THREE-LAYER SYSTEM

```
╔══════════════════════════════════════════════════════════════════════╗
║                    FENCE DEPOT FENCE ESTIMATOR                       ║
║                     COMPLETE SYSTEM ARCHITECTURE                     ║
╚══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│                        LAYER 1: FRONTEND                            │
│                   (What the user sees & clicks)                     │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                   index.html (17 Tabs)                      │  │
│   │                                                             │  │
│   │  TAB 1    TAB 2    TAB 3    TAB 4    TAB 5    TAB 6         │  │
│   │  Project  Fence    Layout   Materials Labor    Equipment    │  │
│   │  Info     Specs                                             │  │
│   │                                                             │  │
│   │  TAB 7    TAB 8    TAB 9    TAB 10   TAB 11   TAB 12        │  │
│   │  Summary  Contract Change   Invoice  Schedule  Crew         │  │
│   │           Lock    Orders                                    │  │
│   │                                                             │  │
│   │  TAB 13   TAB 14   TAB 15   TAB 16   TAB 17                 │  │
│   │  Supplier  Project  Sign-Off  Reports  Mapping              │  │
│   │  Orders   Tracking                                          │  │
│   └─────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│   JavaScript Files:          │                                      │
│   ┌──────────────────────────┤                                      │
│   │ main.js (state & logic)  │                                      │
│   │ materials-calc.js        │                                      │
│   │ contract.js              │                                      │
│   │ reports.js               │                                      │
│   │ tools/drawing.js         │                                      │
│   │ tools/signature.js       │                                      │
│   │ tools/print.js           │                                      │
│   └──────────────────────────┘                                      │
└─────────────────────────────────────┬───────────────────────────────┘
                                      │
                                      │  HTTP / REST API calls
                                      │  (JSON data)
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        LAYER 2: BACKEND                             │
│                  (The "brain" – handles all logic)                  │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                   server.js (Express.js)                    │  │
│   │                                                             │  │
│   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│   │  │   Routes     │  │ Controllers  │  │   Middleware      │  │  │
│   │  │              │  │              │  │                   │  │  │
│   │  │ /api/auth    │  │ auth.js      │  │ verifyToken.js    │  │  │
│   │  │ /api/projects│  │ projects.js  │  │ validateInput.js  │  │  │
│   │  │ /api/materials│ │ materials.js │  │ errorHandler.js   │  │  │
│   │  │ /api/estimates│ │ estimates.js │  │ logger.js         │  │  │
│   │  │ /api/contracts│ │ contracts.js │  └──────────────────┘  │  │
│   │  │ /api/reports  │ │ reports.js   │                         │  │
│   │  │ /api/invoices │ └──────────────┘                         │  │
│   │  └──────────────┘                                           │  │
│   │                                                             │  │
│   │  ┌──────────────────────────────────────────────────────┐  │  │
│   │  │                   Utilities                          │  │  │
│   │  │  calcEngine.js  pdfGenerator.js  emailService.js    │  │  │
│   │  └──────────────────────────────────────────────────────┘  │  │
│   └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────┬───────────────────────────────┘
                                      │
                                      │  MongoDB queries
                                      │  (Mongoose ORM)
                                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        LAYER 3: DATABASE                            │
│                    (Stores all permanent data)                      │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐  │
│   │                   MongoDB / PostgreSQL                      │  │
│   │                                                             │  │
│   │  users        customers      projects      fence_specs      │  │
│   │  layouts      materials      labor         equipment        │  │
│   │  estimate_    contracts      change_orders invoices         │  │
│   │  summaries                                                  │  │
│   │  schedules    crew_members   purchase_orders tracking_log   │  │
│   │  sign_offs    products                                      │  │
│   │                                                             │  │
│   │               📁 schema.sql   📁 seed.sql                  │  │
│   └─────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘

EXTERNAL SERVICES:
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────┐
│   Google Maps API    │  │   Email Service       │  │  PDF Engine  │
│   (Tab 17 Mapping)   │  │   (nodemailer)        │  │  (PDFKit)    │
└──────────────────────┘  └──────────────────────┘  └──────────────┘
```

---

## 📖 HOW TO READ THIS DIAGRAM

- **Frontend** = The web page users see (HTML + CSS + JavaScript)
- **Backend** = The server that processes requests (Node.js + Express)
- **Database** = Where all data is permanently stored (MongoDB)
- **Arrows** show which direction data flows
- **HTTP/API calls** = The frontend sends requests to the backend
- **MongoDB queries** = The backend asks the database for data

---

## ✅ SUMMARY

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML, CSS, JavaScript | User interface – what you see & click |
| Backend | Node.js, Express.js | Logic, calculations, security |
| Database | MongoDB | Store all data permanently |
| External | Google Maps, Email, PDF | Optional features |
