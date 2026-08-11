# WIRE GRID 01 — SYSTEM ARCHITECTURE
## Fence Estimator — Complete System Overview

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    FENCE ESTIMATOR SYSTEM ARCHITECTURE                   ║
╚══════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                                    │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │                    WEB BROWSER                               │       │
│  │                                                              │       │
│  │  ┌────────────────────────────────────────────────────────┐  │       │
│  │  │                 index.html (SPA)                       │  │       │
│  │  │                                                        │  │       │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │  │       │
│  │  │  │  Tab Router  │  │  App State  │  │  Local Store │  │  │       │
│  │  │  │  (app.js)    │  │  (storage)  │  │ (localStorage)│  │  │       │
│  │  │  └──────┬──────┘  └──────┬──────┘  └──────────────┘  │  │       │
│  │  │         │                │                             │  │       │
│  │  │  ┌──────▼──────────────────────────────────────────┐  │  │       │
│  │  │  │           8 TABS (UI Components)                │  │  │       │
│  │  │  │  Dashboard │ New Estimate │ Projects │ Inventory │  │  │       │
│  │  │  │  Materials │ Suppliers   │ Analytics│ Settings  │  │  │       │
│  │  │  └──────────────────────────────────────────────────┘  │  │       │
│  │  │                                                        │  │       │
│  │  │  ┌──────────────────────────────────────────────────┐  │  │       │
│  │  │  │  calculations.js │ validation.js │ ui.js          │  │  │       │
│  │  │  │  api.js          │ charts.js     │ storage.js     │  │  │       │
│  │  │  └──────────────────────────────────────────────────┘  │  │       │
│  │  └────────────────────────────────────────────────────────┘  │       │
│  └──────────────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────┬───────────────────────────┘
                                              │  HTTPS (REST API)
                                              │  JSON Requests
                                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          SERVER LAYER                                    │
│                                                                          │
│  ┌───────────────────────────┐    ┌────────────────────────────────────┐ │
│  │       NGINX               │    │       Node.js / Express            │ │
│  │   (Reverse Proxy)         │    │        (server.js)                 │ │
│  │                           │    │                                    │ │
│  │  Port 80  → redirect      │    │  Middleware:                       │ │
│  │  Port 443 → SSL + serve   │───▶│  • cors, helmet, morgan            │ │
│  │                           │    │  • express-rate-limit              │ │
│  │  /api/* → proxy :3000     │    │  • body-parser, dotenv             │ │
│  │  /*      → index.html     │    │                                    │ │
│  └───────────────────────────┘    │  API Routes:                       │ │
│                                   │  • GET/POST /api/estimates         │ │
│                                   │  • GET/POST /api/customers         │ │
│                                   │  • GET/POST /api/materials         │ │
│                                   │  • GET/POST /api/projects          │ │
│                                   │  • GET/POST /api/suppliers         │ │
│                                   │  • GET/POST /api/settings          │ │
│                                   │  • POST     /api/auth/login        │ │
│                                   └───────────────┬────────────────────┘ │
└───────────────────────────────────────────────────┼─────────────────────┘
                                                    │  pg Pool (SQL)
                                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          DATABASE LAYER                                  │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    PostgreSQL 16                                 │    │
│  │                   Database: fence_estimator                     │    │
│  │                                                                  │    │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │    │
│  │  │  users   │ │customers │ │suppliers │ │    materials     │  │    │
│  │  │ settings │ │projects  │ │estimates │ │ estimate_items   │  │    │
│  │  │audit_log │ │          │ │          │ │supplier_materials│  │    │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │    │
│  │                                                                  │    │
│  │  Triggers: auto-number, recalc-totals, price-history, timestamps │    │
│  │  Views: v_estimate_summary, v_project_summary, v_low_stock      │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```
