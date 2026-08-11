# WIRE GRID 09 — PRICE LOCK FLOW
## How Price Locking Protects Estimates

```
╔══════════════════════════════════════════════════════════════════════════╗
║                      PRICE LOCK FLOW                                     ║
╚══════════════════════════════════════════════════════════════════════════╝

ESTIMATE CREATED
(price_locked = FALSE)
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│              ESTIMATE IN DRAFT STATE                     │
│                                                          │
│  All prices are "live" — they update if material         │
│  prices change in the database.                         │
│                                                          │
│  User can:                                               │
│  ✅ Edit any line item                                   │
│  ✅ Add/remove materials                                 │
│  ✅ Change quantities                                    │
│  ✅ Apply discounts                                      │
│  ✅ Modify labor cost                                    │
└───────────────┬─────────────────────────────────────────┘
                │
                │ User clicks [Lock Price] button
                ▼
┌─────────────────────────────────────────────────────────┐
│              PRICE LOCK CONFIRMATION                     │
│                                                          │
│  ⚠️  Are you sure?                                       │
│                                                          │
│  "Locking this estimate will freeze all prices.         │
│  Material price changes will NOT affect this estimate.   │
│  This is recommended before sending to the customer."   │
│                                                          │
│  [Cancel]           [Yes, Lock Prices]                  │
└───────────────┬─────────────────────────────────────────┘
                │ User confirms
                ▼
┌─────────────────────────────────────────────────────────┐
│              PATCH /api/estimates/:id/lock               │
│                                                          │
│  UPDATE estimates SET                                    │
│    price_locked    = TRUE,                              │
│    price_locked_at = NOW(),                             │
│    price_locked_by = req.user.id                        │
│  WHERE id = :id                                         │
│  AND   price_locked = FALSE;  -- prevent double lock    │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│              LOCKED ESTIMATE BEHAVIOR                    │
│                                                          │
│  User can:                                               │
│  ✅ View estimate                                        │
│  ✅ Print estimate                                       │
│  ✅ Email estimate                                       │
│  ✅ Approve / Reject estimate                            │
│  ✅ Create new version (unfrozen copy)                   │
│                                                          │
│  User CANNOT:                                            │
│  ❌ Edit line item prices                               │
│  ❌ Change material quantities                           │
│  ❌ Modify discount                                      │
│                                                          │
│  Backend enforces this:                                  │
│  PUT /api/estimates/:id → returns 403 if price_locked   │
└───────────────┬─────────────────────────────────────────┘
                │
         Need to edit?
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│              CREATE NEW VERSION                          │
│                                                          │
│  POST /api/estimates/:id/new-version                    │
│                                                          │
│  • Copies all data from current estimate                │
│  • Sets new version = current_version + 1              │
│  • Sets price_locked = FALSE                            │
│  • Sets status = 'draft'                                │
│  • New estimate_number (EST-2026-XXXX version 2)        │
│  • Original estimate remains locked/archived            │
└─────────────────────────────────────────────────────────┘
```
