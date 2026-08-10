# WIRE GRID 1 – SYSTEM ARCHITECTURE
## Fence Depot Estimator Pro – Complete System Overview

```
╔══════════════════════════════════════════════════════════════════════╗
║           FENCE DEPOT ESTIMATOR PRO – SYSTEM ARCHITECTURE           ║
╚══════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                              │
│                                                                     │
│   ┌──────────────────────────────────────────────────────────────┐  │
│   │             FRONTEND (HTML / CSS / JavaScript)               │  │
│   │                                                              │  │
│   │  ┌────────────┐  ┌────────────┐  ┌────────────┐            │  │
│   │  │  index.html│  │  css/*.css │  │  js/*.js   │            │  │
│   │  │  (17 tabs) │  │  (styles)  │  │  (logic)   │            │  │
│   │  └────────────┘  └────────────┘  └────────────┘            │  │
│   │                                                              │  │
│   │  localStorage ──── Offline fallback ──── Live data sync      │  │
│   └──────────────────────────────────────────────────────────────┘  │
│                              │ HTTPS / fetch()                       │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND SERVER (Node.js)                        │
│                     backend/server.js                               │
│                                                                     │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│   │ Express  │  │  JWT     │  │  bcrypt  │  │  Calculation     │  │
│   │ Router   │  │  Auth    │  │  Hashing │  │  Engine          │  │
│   └────┬─────┘  └──────────┘  └──────────┘  └──────────────────┘  │
│        │                                                             │
│   ┌────┴─────────────────────────────────────────────────────────┐  │
│   │  REST API Endpoints                                          │  │
│   │  GET/POST/PUT/DELETE /api/estimates                          │  │
│   │  GET/POST/PUT/DELETE /api/projects                           │  │
│   │  GET/POST/PUT/DELETE /api/contracts                          │  │
│   │  GET/POST/PUT/DELETE /api/change-orders                      │  │
│   │  GET/POST/PUT/DELETE /api/inventory                          │  │
│   │  GET/POST /api/auth/login                                    │  │
│   │  GET /api/dashboard/summary                                  │  │
│   └────┬─────────────────────────────────────────────────────────┘  │
└────────┼────────────────────────────────────────────────────────────┘
         │ pg (node-postgres)
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     DATABASE (PostgreSQL 14+)                       │
│                                                                     │
│   ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│   │  users   │  │inventory │  │  estimates   │  │   projects   │  │
│   └──────────┘  └──────────┘  └──────────────┘  └──────────────┘  │
│   ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│   │suppliers │  │contracts │  │change_orders │  │  sign_offs   │  │
│   └──────────┘  └──────────┘  └──────────────┘  └──────────────┘  │
│   ┌──────────┐                                                      │
│   │  notes   │                                                      │
│   └──────────┘                                                      │
└─────────────────────────────────────────────────────────────────────┘

KEY:
  ──→  Data flows from left to right
  ↕    Bidirectional communication
  └┘   Module boundary
```

## Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | HTML5 / CSS3 / Vanilla JS | Latest |
| Backend | Node.js + Express | 18+ / 4.x |
| Database | PostgreSQL | 14+ |
| Auth | JWT (JSON Web Tokens) | RS256 |
| Password | bcrypt | 12 rounds |
| Process Manager | PM2 | 5.x |
| Web Server | Nginx (production) | 1.24+ |
