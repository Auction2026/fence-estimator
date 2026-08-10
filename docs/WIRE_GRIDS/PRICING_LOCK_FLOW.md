# WIRE GRID 9 – PRICING LOCK FLOW
## How Pricing Lock Protects Estimate Totals

```
╔══════════════════════════════════════════════════════════════════════╗
║                   PRICING LOCK FLOW                                 ║
╚══════════════════════════════════════════════════════════════════════╝

─────────────────────────────────────────────────────────────
WHY PRICING LOCK EXISTS
─────────────────────────────────────────────────────────────

  Problem: Material prices change over time.
  If a customer approved an estimate at $2,500 but material
  costs increased, the total might auto-update to $3,200.
  
  Solution: Lock the prices at approval time so the estimate
  total is protected from future price changes.

─────────────────────────────────────────────────────────────
PRICING LOCK FLOW
─────────────────────────────────────────────────────────────

  ESTIMATE CREATED (price_locked = FALSE)
          │
          │  Materials priced at current inventory costs
          │  Grand total calculated normally
          │
          ▼
  ESTIMATE SENT TO CUSTOMER
          │
          │  Customer reviews & approves
          │
          ▼
  USER CLICKS "Lock Prices" (Pricing Lock tab)
          │
          ▼
  ┌─────────────────────────────────────┐
  │  Backend: PUT /api/estimates/:id    │
  │  { price_locked: true }             │
  │                                     │
  │  For each item in estimate_items:   │
  │    locked_price = unit_price        │
  │    (snapshot of current price)      │
  │                                     │
  │  UPDATE estimates SET               │
  │    price_locked = TRUE,             │
  │    locked_at = NOW()                │
  └──────────────────┬──────────────────┘
                     │
                     ▼
  ESTIMATE IS NOW LOCKED (🔒)
          │
  ┌───────┴──────────────────────────────┐
  │  What changes are BLOCKED:           │
  │  ✗ Cannot update item unit prices    │
  │  ✗ Cannot change material quantities │
  │  ✗ Grand total cannot be recalculated│
  └───────┬──────────────────────────────┘
          │
  ┌───────┴──────────────────────────────┐
  │  What STILL works:                   │
  │  ✓ Can add notes to project          │
  │  ✓ Can upload photos                 │
  │  ✓ Can create change orders          │
  │    (for additional scope changes)    │
  └──────────────────────────────────────┘
          │
          ▼
  IF CHANGES NEEDED AFTER LOCK:
  → Create a CHANGE ORDER (not edit estimate)
  → Change order gets approved separately
  → Contract amended with new total

─────────────────────────────────────────────────────────────
UNLOCKING
─────────────────────────────────────────────────────────────

  Admin or Manager only (role check required)
          │
          ▼
  Click "Unlock" button
          │
          ▼
  ┌─────────────────────────────────────┐
  │  Confirm dialog:                    │
  │  "Unlock will allow price changes.  │
  │   Are you sure?"                    │
  └───────────────────┬─────────────────┘
                      │ Confirmed
                      ▼
  UPDATE estimates SET
    price_locked = FALSE,
    locked_at = NULL
  WHERE id = :id;
          │
          ▼
  ⚠️  Audit log entry created
  Prices can be updated again

─────────────────────────────────────────────────────────────
LOCK STATUS INDICATORS
─────────────────────────────────────────────────────────────

  🔓 Unlocked:  Blue badge "Active – Prices May Change"
  🔒 Locked:    Green badge "Locked [date] – Prices Protected"
```
