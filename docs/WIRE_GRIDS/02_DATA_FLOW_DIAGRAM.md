# WIRE GRID 2 – DATA FLOW DIAGRAM
## How Data Moves Through the Entire System

---

## 📊 COMPLETE DATA FLOW

```
╔══════════════════════════════════════════════════════════════════════╗
║              FENCE ESTIMATOR – DATA FLOW DIAGRAM                    ║
╚══════════════════════════════════════════════════════════════════════╝

USER ACTION: "User clicks Calculate Materials"
     │
     ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: FRONTEND (Browser)                                     │
│                                                                 │
│  User fills in:                                                 │
│  ┌──────────────┐  ┌───────────────┐  ┌───────────────────┐    │
│  │  Fence Type  │  │   Footage     │  │   Fence Height    │    │
│  │  Chain Link  │  │   200 feet    │  │   6 feet          │    │
│  └──────────────┘  └───────────────┘  └───────────────────┘    │
│                             │                                   │
│         JavaScript collects all form values                     │
│         materials-calc.js runs calculations                     │
│         Results displayed in materials table                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │  (If saving to backend)
                              │  POST /api/materials
                              │  Body: { projectId, items, totals }
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: BACKEND (Server)                                       │
│                                                                 │
│  server.js receives the request                                 │
│         │                                                       │
│         ▼                                                       │
│  Middleware checks:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ✅ Is user logged in? (JWT token valid?)               │   │
│  │  ✅ Is the data valid? (required fields present?)       │   │
│  │  ✅ Does project belong to this user?                   │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                       │
│         ▼                                                       │
│  Controller processes:                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  materials.js:                                          │   │
│  │  - Delete old materials for this project                │   │
│  │  - Insert new materials list                            │   │
│  │  - Update estimate_summaries table                      │   │
│  │  - Return success response                              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │  INSERT INTO materials (...)
                              │  UPDATE estimate_summaries (...)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: DATABASE (MongoDB/PostgreSQL)                          │
│                                                                 │
│  materials table:                                               │
│  ┌────────────┬──────────────────────┬───────┬──────────────┐  │
│  │ project_id │ sku                  │  qty  │  line_total  │  │
│  ├────────────┼──────────────────────┼───────┼──────────────┤  │
│  │     42     │ CL-FABRIC-6-11-GAL   │   4   │   $224.00    │  │
│  │     42     │ POST-LINE-1.66-GAL   │  19   │   $218.50    │  │
│  │     42     │ POST-TERM-2.5-GAL    │   6   │   $111.00    │  │
│  │     42     │ RAIL-TOP-1.66-GAL    │  10   │   $165.00    │  │
│  │    ...     │ ...                  │  ...  │    ...       │  │
│  └────────────┴──────────────────────┴───────┴──────────────┘  │
│                                                                 │
│  estimate_summaries table:                                      │
│  ┌────────────┬──────────────────┬────────┬──────────────────┐  │
│  │ project_id │ materials_total  │  tax   │     total        │  │
│  ├────────────┼──────────────────┼────────┼──────────────────┤  │
│  │     42     │    $1,284.50     │$106.17 │   $1,390.67      │  │
│  └────────────┴──────────────────┴────────┴──────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │  Response: { success: true, total: 1284.50 }
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: BACK TO FRONTEND                                       │
│                                                                 │
│  Browser receives response                                      │
│  JavaScript updates the screen:                                 │
│  - Materials table shows all items                              │
│  - Subtotal shows $1,284.50                                     │
│  - Status bar shows "Materials calculated"                      │
│  - Tab 7 Summary updates automatically                          │
└─────────────────────────────────────────────────────────────────┘


══════════════════════════════════════════════════════════════════
                 SIMPLE DATA FLOW SUMMARY
══════════════════════════════════════════════════════════════════

     User Action
          │
          ▼
   Frontend (Browser)  ──────────────────────────────┐
          │                                           │
          │ HTTP Request                              │ HTTP Response
          ▼                                           │
   Backend (Server)                                   │
          │                                           │
          │ Database Query                            │ Query Result
          ▼                                           │
   Database (MongoDB)  ──────────────────────────────┘
          │
          ▼
   Data Saved Permanently


══════════════════════════════════════════════════════════════════
                 ESTIMATE DATA FLOW (ALL 17 TABS)
══════════════════════════════════════════════════════════════════

TAB 1 Data                  TAB 2 Data               TAB 3 Data
Customer Name, Address  +   Fence Type, Height   +   Footage, Terrain
                            │                         │
                            └──────────┬──────────────┘
                                       ▼
                              TAB 4: Calculate Materials
                              (Using prices from MATERIAL_PRICES)
                                       │
                                       ▼
                           TAB 5: Add Labor Costs
                                       │
                                       ▼
                           TAB 6: Add Equipment Costs
                                       │
                                       ▼
                           TAB 7: Combine = ESTIMATE TOTAL
                                   $X,XXX.XX
                                       │
                                       ▼
                           TAB 8: Lock Contract Price
                              (Price is now FROZEN)
                                       │
                                       ▼
                           TAB 9: Any Changes = Change Orders
                              (Each CO adds to contract price)
                                       │
                                       ▼
                           TAB 10: Generate Invoices
                           TAB 14: Track Progress
                           TAB 15: Sign Off = COMPLETE
```

---

## 📖 KEY RULES OF DATA FLOW

1. **Data flows LEFT TO RIGHT** through the tabs (Tab 1 → 2 → 3...)
2. **Each tab feeds the next** – you must complete earlier tabs first
3. **Contract Lock FREEZES the price** – Tab 8 locks all dollar amounts
4. **Only Change Orders can change price** after Tab 8 is locked
5. **localStorage saves automatically** – your data is safe if you refresh

---

## ✅ WHAT HAPPENS TO YOUR DATA

| Where | Saved? | How Long? |
|-------|--------|-----------|
| Browser (localStorage) | Yes | Until you clear browser data |
| Backend database | Yes | Permanently, until deleted |
| Printed PDF | Yes | Until paper is lost |
