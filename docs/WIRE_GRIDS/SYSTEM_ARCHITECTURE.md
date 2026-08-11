# SYSTEM ARCHITECTURE
## Fence Depot Estimator — Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FENCE DEPOT ESTIMATOR                           │
│                     System Architecture v1.0                        │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  CLIENT LAYER (Browser)                                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  index.html  (Single Page Application)                       │   │
│  │                                                              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │   │
│  │  │Dashboard │  │Estimates │  │ Projects │  │Inventory │   │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │   │
│  │  │Materials │  │Suppliers │  │Analytics │                   │   │
│  │  └──────────┘  └──────────┘  └──────────┘                  │   │
│  │                                                              │   │
│  │  JavaScript Engine:                                          │   │
│  │  • Estimate Wizard (5 steps)                                │   │
│  │  • INVENTORY_DB (950+ SKUs in-memory)                       │   │
│  │  • Auto-calculation engine                                  │   │
│  │  • localStorage persistence                                  │   │
│  │  • PDF/Print generation                                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                           │ HTTP/REST API                            │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│  SERVER LAYER (Node.js / Express)                                    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  backend/server.js                                           │   │
│  │                                                              │   │
│  │  Middleware Stack:                                           │   │
│  │  → CORS          (cross-origin control)                      │   │
│  │  → Helmet        (security headers)                          │   │
│  │  → Rate Limiter  (DDoS protection)                           │   │
│  │  → Auth (JWT)    (authentication)                            │   │
│  │  → Body Parser   (JSON/form data)                            │   │
│  │                                                              │   │
│  │  API Routes:                                                 │   │
│  │  /api/auth        → Login, logout, refresh                   │   │
│  │  /api/users       → User management (admin)                  │   │
│  │  /api/customers   → Customer CRUD                            │   │
│  │  /api/projects    → Project CRUD                             │   │
│  │  /api/estimates   → Estimate CRUD + PDF                      │   │
│  │  /api/inventory   → Product catalog                          │   │
│  │  /api/contracts   → Contract management                      │   │
│  │  /api/change-orders → Change order flow                      │   │
│  │  /api/notes       → Notes hub                                │   │
│  │  /api/crew        → Crew management                          │   │
│  │  /api/permits     → Permit tracking                          │   │
│  │  /api/reports     → Analytics & reporting                    │   │
│  │  /api/email       → Email sending                            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                           │ SQL                                      │
└───────────────────────────┼──────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────────┐
│  DATA LAYER (PostgreSQL)                                             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Tables:                                                     │   │
│  │  users          customers       projects                     │   │
│  │  fence_specs    estimates       estimate_line_items          │   │
│  │  inventory      contracts       change_orders                │   │
│  │  notes          crew            project_crew                 │   │
│  │  permits        sign_offs       audit_log                    │   │
│  │                                                              │   │
│  │  Procedures:                                                 │   │
│  │  archive_old_projects()    purge_old_audit_log()             │   │
│  │  verify_db_integrity()     perform_maintenance()             │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│  EXTERNAL SERVICES                                                   │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  SMTP Email  │  │ Google Maps  │  │ PDF Generator (PDFKit)   │  │
│  │  (nodemailer)│  │  (mapping)   │  │ (estimate output)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML5 / CSS3 / Vanilla JS | SPA interface |
| Backend | Node.js 20 + Express 4 | REST API server |
| Database | PostgreSQL 15+ | Persistent data store |
| Auth | JWT (JSON Web Tokens) | Stateless auth |
| PDF | PDFKit | Estimate/contract PDF |
| Email | Nodemailer | Customer notifications |
| Maps | Google Maps JS API | Site mapping |
| Security | Helmet + bcrypt + rate-limit | Security hardening |
