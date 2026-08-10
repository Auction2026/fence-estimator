# WIRE GRID 2: DATA FLOW DIAGRAM

```
╔══════════════════════════════════════════════════════╗
║       HOW DATA MOVES THROUGH THE APPLICATION        ║
╚══════════════════════════════════════════════════════╝

USER INPUT (Browser Forms)
         │
         ▼
   ┌─────────────┐
   │ Validation  │──── FAIL ────► Error Toast ◄─────┐
   │ (app.js)    │                                   │
   └─────┬───────┘                                   │
         │ PASS                                      │
         ▼                                           │
   ┌─────────────┐
   │  State Mgmt │ ──► localStorage.setItem(LS_KEY)
   │  (app.js)   │
   │  state = {} │ ◄── localStorage.getItem(LS_KEY)
   └─────┬───────┘
         │
         ├─── OFFLINE MODE (no backend) ──► localStorage only
         │
         └─── ONLINE MODE (backend configured)
                        │
                        ▼
               ┌────────────────┐
               │ REST API Call  │
               │ fetch(apiUrl)  │
               │                │
               │ GET  /api/...  │
               │ POST /api/...  │
               │ PUT  /api/...  │
               │ DEL  /api/...  │
               └───────┬────────┘
                        │
                        ▼
               ┌────────────────┐
               │ Express.js     │
               │ server.js      │
               │                │
               │ Auth Middleware│
               │ → verify JWT   │
               └───────┬────────┘
                        │
                        ▼
               ┌────────────────┐
               │  Database      │
               │  Query         │
               │  (PostgreSQL)  │
               └───────┬────────┘
                        │
                        ▼
               ┌────────────────┐
               │ JSON Response  │
               │ { data: [...] }│
               └───────┬────────┘
                        │
                        ▼
               ┌────────────────┐
               │ Tab Refresh    │
               │ renderXxx()    │
               └───────┬────────┘
                        │
                        ▼
               ┌────────────────┐
               │ DOM Update     │
               │ innerHTML      │
               └────────────────┘

KEY DATA STORES:
  localStorage['fenceEstimatorData'] — all offline state
  localStorage['fenceEstimatorUser'] — current user session
  localStorage['apiUrl']              — backend connection URL
```
