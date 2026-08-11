# CHANGE ORDER FLOW
## Fence Depot Estimator — Change Order Process

```
═══════════════════════════════════════════════════════════════
                    CHANGE ORDER WORKFLOW
═══════════════════════════════════════════════════════════════

  WHEN ARE CHANGE ORDERS USED?
  • Customer wants more fence added
  • Customer wants different material (upgrade/downgrade)
  • Unforeseen site conditions require extra work
  • Customer adds gates after contract signed

──────────────────────────────────────────────────────────────

  TRIGGER: Scope change identified during active project
                        │
                        ▼
  ┌──────────────────────────────────────────────────────────┐
  │  ESTIMATOR CREATES CHANGE ORDER                          │
  │                                                          │
  │  change_orders:                                          │
  │  • co_number    = "CO-2026-001" (auto-generated)        │
  │  • contract_id  = (parent contract UUID)                │
  │  • project_id   = (project UUID)                        │
  │  • reason       = "Customer requests 25ft extension"    │
  │  • description  = detailed scope description            │
  │  • amount       = $1,250.00                             │
  │  • status       = 'pending'                             │
  └──────────────────────────┬───────────────────────────────┘
                             │
                             ▼
  ┌──────────────────────────────────────────────────────────┐
  │  NOTIFY CUSTOMER                                         │
  │  • Email sent with change order details                  │
  │  • Customer reviews scope + price                        │
  │  • Customer has X days to respond                        │
  └──────────────────────────┬───────────────────────────────┘
                             │
                   ┌─────────┴──────────┐
                   │                    │
                   ▼                    ▼
          ┌─────────────────┐  ┌─────────────────────────────┐
          │    APPROVED     │  │         REJECTED             │
          │                 │  │                              │
          │ status='approved'│  │ status='rejected'            │
          │ approved_by=uid │  │ Work continues as-is         │
          │ approved_at=now │  │ Original contract unchanged  │
          └────────┬────────┘  └─────────────────────────────┘
                   │
                   ▼
  ┌──────────────────────────────────────────────────────────┐
  │  CONTRACT TOTAL UPDATED (ADDENDUM)                       │
  │                                                          │
  │  Original Contract Total:      $7,290.57                │
  │  Change Order CO-2026-001:    +$1,250.00                │
  │  ─────────────────────────────────────                  │
  │  Revised Project Total:        $8,540.57                │
  │                                                          │
  │  NOTE: Original contract record is NOT modified.         │
  │  The change order creates an addendum record.            │
  └──────────────────────────────────────────────────────────┘
                   │
                   ▼
  ┌──────────────────────────────────────────────────────────┐
  │  WORK CONTINUES / COMPLETES                              │
  │  change_orders.status = 'complete'                       │
  └──────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════
                    CHANGE ORDER NUMBERING
═══════════════════════════════════════════════════════════════

  Format: CO-{YEAR}-{SEQUENCE}
  Example: CO-2026-001

  Multiple change orders per project are allowed:
  CO-2026-001  → Approved  (+$1,250.00)
  CO-2026-002  → Rejected
  CO-2026-003  → Approved  (+$450.00)
  ─────────────────────────────────────
  Total change orders: +$1,700.00


═══════════════════════════════════════════════════════════════
                    CHANGE ORDER IMPACT ON BILLING
═══════════════════════════════════════════════════════════════

  ┌──────────────────────────────────────────────────────────┐
  │  Project Financial Summary                               │
  │                                                          │
  │  Original contract:         $7,290.57                   │
  │  Deposit collected (30%):   $2,187.17                   │
  │  Balance due (original):    $5,103.40                   │
  │                                                          │
  │  Change Orders (approved):                              │
  │  + CO-001: $1,250.00                                    │
  │  + CO-003: $  450.00                                    │
  │  ─────────────────────────                              │
  │  Total CO amount:           $1,700.00                   │
  │                                                          │
  │  REVISED BALANCE DUE:       $6,803.40                   │
  │  ════════════════════════════════════                   │
  └──────────────────────────────────────────────────────────┘
```
