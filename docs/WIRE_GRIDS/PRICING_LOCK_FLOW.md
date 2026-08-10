# WIRE GRID 9: PRICING LOCK FLOW

```
╔══════════════════════════════════════════════════════╗
║           ESTIMATE PRICING LOCK MECHANISM            ║
╚══════════════════════════════════════════════════════╝

WHY PRICING LOCK?
  Prevents material costs from changing after estimate is
  sent to customer. Locks prices at time of estimate creation.

FLOW:
                   Estimate Created
                        │
                        ▼
              ┌──────────────────┐
              │ pricing_locked   │
              │    = FALSE       │
              │ (editable)       │
              └────────┬─────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
  Edit materials             Send estimate
  Edit line_items            to customer
  Recalculate totals              │
         │                         ▼
         │                ┌──────────────────┐
         │                │ LOCK PRICING     │
         │                │                  │
         │                │ pricing_locked   │
         │                │   = TRUE         │
         │                │ pricing_locked_at│
         │                │   = NOW()        │
         │                └────────┬─────────┘
         │                         │
         │                         ▼
         │               ┌──────────────────┐
         │               │ Attempt to edit  │
         │               │ line items       │
         │               └────────┬─────────┘
         │                        │
         │               ┌────────┴─────────┐
         │               │                  │
         │           pricing_locked=T    pricing_locked=F
         │               │                  │
         │               ▼                  ▼
         │           BLOCKED            ALLOWED
         │           (403 error)        (save succeeds)
         │
         │
UNLOCK PRICING (Admin Only):
  Only users with role = 'admin' can set pricing_locked = FALSE
  This is logged in the notes table with note_type = 'billing'

DATABASE:
  estimates.pricing_locked    BOOLEAN  DEFAULT FALSE
  estimates.pricing_locked_at TIMESTAMPTZ

API ENDPOINT (backend):
  PATCH /api/estimates/:id/lock
    { locked: true/false }
    Requires: admin role JWT
```
