# SYSTEM ARCHITECTURE
## Fence Depot Fence Estimator - Complete System Overview

```
═══════════════════════════════════════════════════════════════════════════
                    FENCE DEPOT FENCE ESTIMATOR
                      SYSTEM ARCHITECTURE v1.0
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                   BROWSER / WEB CLIENT                            │  │
│  │                                                                   │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │  │
│  │  │  index.html │  │  CSS Files  │  │   JavaScript Modules    │  │  │
│  │  │  (17 tabs)  │  │  styles.css │  │   app.js  api.js        │  │  │
│  │  │             │  │  resp.css   │  │   calc.js valid.js      │  │  │
│  │  └─────────────┘  └─────────────┘  │   storage.js ui.js     │  │  │
│  │                                    └─────────────────────────┘  │  │
│  │                                                                   │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │                    TAB MODULES (js/tabs/)                  │  │  │
│  │  │  tab1-project  tab2-survey   tab3-specs   tab4-materials   │  │  │
│  │  │  tab5-labor    tab6-equip    tab7-pricing tab8-summary     │  │  │
│  │  │  tab9-contract tab10-co      tab11-signoff tab12-notes     │  │  │
│  │  │  tab13-photos  tab14-sched   tab15-reports tab16-inv       │  │  │
│  │  │  tab17-mapping                                             │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  │                                                                   │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │                    TOOL MODULES (js/tools/)                │  │  │
│  │  │     drawing.js    mapping.js    printing.js   export.js    │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                              │  HTTP/HTTPS
                              │  REST API calls
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION LAYER                               │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │              BACKEND SERVER (Node.js + Express.js)                │  │
│  │                       backend/server.js                          │  │
│  │                                                                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │  │
│  │  │  MIDDLEWARE  │  │   ROUTING    │  │   BUSINESS LOGIC     │   │  │
│  │  │   - CORS     │  │  /api/auth   │  │  - Estimate Calc     │   │  │
│  │  │   - Auth JWT │  │  /api/proj   │  │  - PDF Generation    │   │  │
│  │  │   - Logging  │  │  /api/est    │  │  - Email Sending     │   │  │
│  │  │   - Static   │  │  /api/contr  │  │  - File Uploads      │   │  │
│  │  │   - Body     │  │  /api/notes  │  │  - Data Validation   │   │  │
│  │  │     Parser   │  │  /api/inv    │  │  - Auth & Sessions   │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                              │  Mongoose ORM
                              │  MongoDB Protocol
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                    │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     MONGODB DATABASE                              │  │
│  │                  (fence_estimator_db)                             │  │
│  │                                                                   │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │  │
│  │  │  users   │ │ projects │ │estimates │ │   fence_specs      │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────────────┘  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐  │  │
│  │  │contracts │ │change_or │ │ sign_offs│ │       notes        │  │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────────────┘  │  │
│  │  ┌──────────┐                                                    │  │
│  │  │ products │  (950+ catalog items)                              │  │
│  │  └──────────┘                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                         EXTERNAL SERVICES
═══════════════════════════════════════════════════════════════════════════

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐
│  GOOGLE MAPS    │  │  EMAIL SERVICE  │  │      FILE STORAGE           │
│  JavaScript API │  │  (Nodemailer/   │  │  (Local filesystem /        │
│  - Site mapping │  │   Gmail/SMTP)   │  │   Cloud storage option)     │
│  - Address      │  │  - Send quotes  │  │  - Photo uploads            │
│    lookup       │  │  - Send PDFs    │  │  - Generated PDFs           │
└─────────────────┘  └─────────────────┘  └─────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                    KEY DESIGN DECISIONS
═══════════════════════════════════════════════════════════════════════════

1. AUTHENTICATION:  JWT tokens stored in browser localStorage
2. API PATTERN:     RESTful JSON API over HTTP
3. FRONTEND:        Vanilla JS (no framework) for simplicity
4. DATABASE:        MongoDB for flexible document storage
5. PDF:             Server-side generation with PDFKit
6. OFFLINE:         localStorage auto-save for form data

═══════════════════════════════════════════════════════════════════════════
```
