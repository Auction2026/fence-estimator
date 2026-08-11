# DATA FLOW DIAGRAM
**Fence Estimator Pro** – How Data Moves Through the System

```
USER INPUT (Frontend)
        │
        ▼
┌───────────────────┐
│  Tab 1: Project   │──► localStorage.saveProject()
│  Customer Info    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Tab 2: Fence     │──► localStorage.saveSpecs()
│  Specifications   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐      ┌───────────────────────────────┐
│  Tab 8: Estimate  │─────►│  calculations.js              │
│  (Calculate btn)  │      │  - Read specs from storage    │
└────────┬──────────┘      │  - Apply MATERIAL_RATES[]     │
         │                 │  - Apply HEIGHT_MULTIPLIERS[] │
         │                 │  - Calculate labour hours     │
         │                 │  - Calculate equipment days   │
         │                 │  - Apply tax (13% HST)        │
         │                 │  - Return lineItems[] + total │
         │                 └───────────────┬───────────────┘
         │                                 │
         ▼                                 ▼
┌───────────────────┐      ┌───────────────────────────────┐
│  Display          │      │  localStorage.saveEstimate()  │
│  - Line items     │◄─────│  + POST /api/estimates        │
│  - Subtotal       │      └───────────────────────────────┘
│  - Tax            │
│  - TOTAL          │
└────────┬──────────┘
         │ Create Contract btn
         ▼
┌───────────────────┐      ┌───────────────────────────────┐
│  Tab 9: Contract  │─────►│  localStorage.saveContract()  │
│  - Price LOCKED   │      │  + POST /api/contracts        │
│  - Signatures     │      │  priceLocked = TRUE           │
└────────┬──────────┘      └───────────────────────────────┘
         │ Change needed
         ▼
┌───────────────────┐      ┌───────────────────────────────┐
│  Tab 12:          │─────►│  Calculations.applyChange     │
│  Change Orders    │      │  Order() recalculates total   │
│                   │      │  POST /api/change-orders      │
└────────┬──────────┘      └───────────────────────────────┘
         │ Work complete
         ▼
┌───────────────────┐      ┌───────────────────────────────┐
│  Tab 13: Sign-Off │─────►│  localStorage.saveSignOff()   │
│  Completion       │      │  + POST /api/sign-offs        │
└───────────────────┘      └───────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DATA STORAGE FLOW:

Frontend ──► localStorage (immediate, offline)
         └──► API call (async, when backend available)
              └──► MySQL database (persistent)
```
