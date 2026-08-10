# WIRE GRID 4 – PROJECT LIFECYCLE
## Project Status Progression from Lead to Completion

```
╔══════════════════════════════════════════════════════════════════════╗
║                    PROJECT LIFECYCLE                                ║
╚══════════════════════════════════════════════════════════════════════╝

  CUSTOMER INQUIRY
         │
         ▼
  ┌─────────────┐
  │   ESTIMATE  │ ← New Estimate wizard → status = "draft"
  │   CREATED   │
  └──────┬──────┘
         │ Estimate sent to customer
         ▼
  ┌─────────────┐
  │   ESTIMATE  │ ← status = "sent"
  │    SENT     │
  └──────┬──────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
APPROVED    REJECTED
    │         │
    │         └──→ Archive estimate → End
    │
    ▼
  ┌─────────────┐
  │  CONTRACT   │ ← Generated from estimate
  │   DRAFTED   │   status = "draft"
  └──────┬──────┘
         │ Sent for signature
         ▼
  ┌─────────────┐
  │  CONTRACT   │ ← status = "signed"
  │   SIGNED    │   Customer signature captured
  └──────┬──────┘
         │ Work begins
         ▼
  ┌─────────────┐
  │   PROJECT   │ ← status = "in-progress"
  │ IN PROGRESS │   Photos, notes, site map active
  └──────┬──────┘
         │
    ┌────┴────────────┐
    │                 │
    ▼                 ▼
CHANGE ORDER      NO CHANGES
NEEDED                │
    │                 │
    ▼                 │
  ┌───────────┐       │
  │ CHANGE    │       │
  │ ORDER     │       │
  │ APPROVED  │       │
  └─────┬─────┘       │
        │             │
        └──────┬──────┘
               │ Work complete
               ▼
       ┌──────────────┐
       │    SIGN-OFF  │ ← Customer signs off on completed work
       │    OBTAINED  │
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │   PROJECT    │ ← status = "complete"
       │   COMPLETE   │   Revenue recorded in Analytics
       └──────────────┘

─────────────────────────────────────────────────────────────
STATUS REFERENCE
─────────────────────────────────────────────────────────────

  pending     → Estimate saved, not yet started
  in-progress → Work actively underway
  complete    → Work done, signed off
  cancelled   → Job cancelled
  on-hold     → Paused (weather, materials, etc.)

─────────────────────────────────────────────────────────────
CANCELLATION PATH
─────────────────────────────────────────────────────────────

  Any stage → CANCELLED → status = "cancelled"
                       → Contract voided
                       → No sign-off required
```
