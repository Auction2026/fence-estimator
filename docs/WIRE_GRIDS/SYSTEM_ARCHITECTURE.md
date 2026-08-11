# DIAGRAM 1: SYSTEM ARCHITECTURE
## Fence Depot Fence Estimator — Complete System Overview

```
═══════════════════════════════════════════════════════════════════════
                    FENCE DEPOT FENCE ESTIMATOR
                      SYSTEM ARCHITECTURE v1.0
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│                          USER LAYER                                  │
│                                                                      │
│   👤 Admin          👤 Estimator         👤 Crew                     │
│   (Full Access)     (Estimates Only)     (View Only)                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼ HTTPS / Browser
┌─────────────────────────────────────────────────────────────────────┐
│                       FRONTEND LAYER                                 │
│                       (index.html)                                   │
│                                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │  Landing   │  │   Login    │  │  Dashboard │  │   8 Tabs     │  │
│  │   Page     │  │   Screen   │  │            │  │              │  │
│  └────────────┘  └────────────┘  └────────────┘  └──────────────┘  │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  JavaScript Engine                                           │    │
│  │  • calculateAndRenderMaterials()   • switchTab()            │    │
│  │  • estimateState object            • INVENTORY_DB (61 SKUs) │    │
│  │  • localStorage persistence        • findMesh(), invByPlu() │    │
│  └─────────────────────────────────────────────────────────────┘    │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼ REST API (JSON)
┌─────────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER                                  │
│                    (backend/server.js)                               │
│                    Express.js + Node.js                              │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │ Auth Routes │  │ Project API │  │ Estimate API│                  │
│  │ /api/auth/* │  │/api/projects│  │/api/estimates│                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │Products API │  │  PDF Route  │  │ Email Route │                  │
│  │ /api/products│ │  /api/pdf   │  │ /api/email  │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Middleware Stack                                             │   │
│  │  CORS → JSON Parser → Auth JWT → Logger → Error Handler      │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
┌───────────────────────┐   ┌────────────────────────────┐
│  MongoDB (Primary DB) │   │  MySQL (Relational DB)      │
│  (Mongoose Models)    │   │  (9 Tables - schema.sql)    │
│                       │   │                             │
│  Collections:         │   │  Tables:                    │
│  • users              │   │  • users                    │
│  • projects           │   │  • customers                │
│  • estimates          │   │  • projects                 │
│  • fenceSpecs         │   │  • fence_specifications     │
│  • products           │   │  • estimates                │
│  • changeOrders       │   │  • estimate_line_items      │
│                       │   │  • inventory_products       │
│                       │   │  • change_orders            │
│                       │   │  • audit_log                │
└───────────────────────┘   └────────────────────────────┘

                    ┌────────────────────────────┐
                    │   EXTERNAL SERVICES         │
                    │                             │
                    │  📧 SMTP Email Server       │
                    │  📄 PDFKit (PDF Generator)  │
                    │  🔐 JWT (Auth Tokens)        │
                    │  🔒 bcrypt (Passwords)       │
                    └────────────────────────────┘

═══════════════════════════════════════════════════════════════════════
PORT ASSIGNMENTS:
  Frontend:  http://localhost:3000  (static serve)
  Backend:   http://localhost:3001  (Express API)
  MongoDB:   mongodb://localhost:27017
  MySQL:     mysql://localhost:3306
═══════════════════════════════════════════════════════════════════════
```
