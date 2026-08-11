# WIRE GRID 10 — CHANGE ORDER FLOW
## How Change Orders Work During Active Projects

```
╔══════════════════════════════════════════════════════════════════════════╗
║                       CHANGE ORDER FLOW                                  ║
╚══════════════════════════════════════════════════════════════════════════╝

PROJECT STATUS: IN_PROGRESS
Approved Estimate: EST-2026-0042 ($8,500.00)
                    │
                    │ Something changes in the field...
                    ▼
┌─────────────────────────────────────────────────────────┐
│                 CHANGE ORDER TRIGGERS                    │
│                                                          │
│  Common reasons a change order is needed:               │
│  • Customer requests additional fence sections           │
│  • Underground obstacles require rerouting              │
│  • Upgrade from galvanized to vinyl-coated              │
│  • Add privacy slats not in original estimate           │
│  • Extra gates requested after work started             │
│  • Material price increase (rare if price-locked)       │
│  • Soil conditions require deeper posts                 │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              CREATE CHANGE ORDER                         │
│                                                          │
│  POST /api/change-orders                                │
│  {                                                       │
│    estimate_id: 42,                                     │
│    project_id: 5,                                       │
│    description: "Add 25ft of 6ft galv chain link",      │
│    reason: "Customer extended property line",           │
│    additional_cost: 850.00,                             │
│    additional_days: 1                                   │
│  }                                                       │
│                                                          │
│  → CO number auto-assigned: CO-2026-0001                │
│  → Status: PENDING                                      │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│              CUSTOMER APPROVAL REQUIRED                  │
│                                                          │
│  Estimator:                                              │
│  1. Prints CO-2026-0001 (shows additional $850)         │
│  2. Customer reviews on-site                            │
│  3. Customer signs paper copy (or email approval)       │
│  4. Estimator enters approval in system:                │
│     PATCH /api/change-orders/1/approve                  │
│     → status: APPROVED                                  │
│     → approved_by: user.id                             │
│     → approved_at: NOW()                               │
└───────────────────┬─────────────────────────────────────┘
                    │
          ┌─────────┴────────────┐
          │                      │
    APPROVED                 REJECTED
          │                      │
          ▼                      ▼
┌──────────────────┐    ┌──────────────────────┐
│  UPDATE PROJECT  │    │  CO status = REJECTED │
│  TOTALS          │    │  No change to project │
│                  │    │  Document reason      │
│  New total:      │    └──────────────────────┘
│  $8,500 + $850   │
│  = $9,350.00     │
│                  │
│  Completion date │
│  + 1 day         │
└──────────────────┘

CHANGE ORDER STATUS FLOW:
══════════════════════════════════════════
  pending → approved → (work completed)
  pending → rejected → (no action)
  pending → cancelled → (no action)
══════════════════════════════════════════

BEST PRACTICES:
• Always get written/signed approval before starting CO work
• CO increases project total for final invoice
• Keep CO paperwork with job folder
• Update materials order if new materials needed
```
