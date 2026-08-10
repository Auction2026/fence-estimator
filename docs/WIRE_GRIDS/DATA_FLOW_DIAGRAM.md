# WIRE GRID 2 – DATA FLOW DIAGRAM
## How Data Moves Through the Application

```
╔══════════════════════════════════════════════════════════════════════╗
║                    DATA FLOW DIAGRAM                                ║
╚══════════════════════════════════════════════════════════════════════╝

USER INPUT (Browser)
        │
        ▼
┌───────────────────┐
│  Form / Wizard    │  ← User fills in customer info, fence specs
│  (frontend tabs)  │
└────────┬──────────┘
         │  JavaScript Event
         ▼
┌───────────────────┐
│  app.js / tab.js  │  ← Validates input, formats data
│  (JS Logic)       │
└────────┬──────────┘
         │  fetch() API call
         │  POST /api/estimates
         ▼
┌───────────────────┐
│  Express Router   │  ← Receives JSON request
│  (server.js)      │
└────────┬──────────┘
         │  JWT Middleware
         ▼
┌───────────────────┐
│  Auth Check       │  ← Verifies token is valid
│  (middleware)     │
└────────┬──────────┘
         │  Validated
         ▼
┌───────────────────┐
│  Business Logic   │  ← Calculates totals, validates business rules
│  (route handler)  │
└────────┬──────────┘
         │  SQL Query
         │  INSERT INTO estimates
         ▼
┌───────────────────┐
│  PostgreSQL DB    │  ← Stores data permanently
│  (estimates table)│
└────────┬──────────┘
         │  Triggers fire
         ▼
┌───────────────────┐
│  Auto-updated_at  │  ← set_updated_at() trigger runs
│  (DB Trigger)     │
└────────┬──────────┘
         │  Returns inserted row
         ▼
┌───────────────────┐
│  JSON Response    │  ← { id, estimateNum, grandTotal, ... }
│  (HTTP 201)       │
└────────┬──────────┘
         │  Response received
         ▼
┌───────────────────┐
│  Frontend Update  │  ← Updates UI, shows toast "Estimate saved"
│  (tab refresh)    │
└───────────────────┘

─────────────────────────────────────────────────────────────
OFFLINE MODE (Backend Unavailable)
─────────────────────────────────────────────────────────────

USER INPUT
        │
        ▼
┌───────────────────┐
│  app.js try/catch │  ← API call fails (catch block)
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  localStorage     │  ← Data saved to browser storage
│  (fd_estimates)   │
└────────┬──────────┘
         │  On reconnect
         ▼
┌───────────────────┐
│  Sync to Backend  │  ← Data pushed to API when available
└───────────────────┘
```
