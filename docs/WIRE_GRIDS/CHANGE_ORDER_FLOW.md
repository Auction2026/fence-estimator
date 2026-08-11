# DIAGRAM 10: CHANGE ORDER FLOW
## Fence Depot Fence Estimator — Change Order Process

```
═══════════════════════════════════════════════════════════════════════
                   CHANGE ORDER FLOW DIAGRAM
         Handling Scope Changes After Estimate Approval
═══════════════════════════════════════════════════════════════════════

TRIGGER: Scope change discovered during active project
─────────────────────────────────────────────────────
  Examples:
  • Customer adds more fence sections
  • Underground obstacles discovered (rock, utilities)
  • Customer changes fence type after approval
  • Extra gates requested
  • Original measurements were incorrect
       │
       ▼
  Estimator opens "Projects" tab
       │
       ▼
  Selects the active project
       │
       ▼
  Clicks [+ Change Order] button

CHANGE ORDER CREATION
──────────────────────────────────────────────
  ┌─────────────────────────────────────────┐
  │  Change Order Form                       │
  │                                         │
  │  Project: #002 - Smith Residence         │
  │  Original Estimate: EST-2024-012         │
  │                                         │
  │  Requested By: [Customer] [Estimator]   │
  │                                         │
  │  Description:                           │
  │  [Add 15ft extra run on north side +   ]│
  │  [1 additional 36" single swing gate   ]│
  │                                         │
  │  Reason:                                │
  │  [Customer requested at site visit     ]│
  │                                         │
  │  Materials Added / Changed:             │
  │  ┌───────────────────────────────────┐  │
  │  │ Qty │ Description       │ Amount  │  │
  │  │ 2   │ Line Post 1-5/8"  │  $22.00 │  │
  │  │ 15ft│ Top Rail (part)   │  $13.00 │  │
  │  │ 15ft│ Fabric (part roll)│  $25.00 │  │
  │  │ 1   │ Gate 36"x6ft      │  $83.20 │  │
  │  │ 1   │ Gate Labor        │ $100.00 │  │
  │  └───────────────────────────────────┘  │
  │                                         │
  │  Material Cost Delta:     +$  143.20    │
  │  Labor Cost Delta:        +$  100.00    │
  │  Equipment Delta:         +$    0.00    │
  │  TOTAL DELTA:             +$  243.20    │
  │                                         │
  │  [Save Draft] [Submit for Approval]     │
  └──────────────────┬──────────────────────┘
                     │
                     ▼
  Change Order Status: DRAFT
  change_order_number: CO-2024-012-01

APPROVAL ROUTING
──────────────────────────────────────────────
  CO submitted for approval
       │
       ▼
  ┌────────────────────────────────────────────────────────────┐
  │  Who approves?                                              │
  │                                                             │
  │  Internal threshold:                                        │
  │  • $0 – $500 delta  ─── Estimator can approve              │
  │  • $500+ delta      ─── Admin must approve                  │
  │  (threshold configurable in Settings)                       │
  └──────────────────────────────────────────────────────────── ┘
       │
       ├─── Estimator opens CO in notification ────────────────┐
       │                                                       │
       │                                                       ▼
       │                                    ┌─────────────────────────┐
       │                                    │  CO Review Screen        │
       │                                    │                          │
       │                                    │  Description: [text]     │
       │                                    │  Materials: [table]       │
       │                                    │  Delta: +$243.20          │
       │                                    │                          │
       │                                    │  [Approve] [Decline]     │
       │                                    │  [Request More Info]     │
       │                                    └──────────┬──────────────┘
       │                                               │
       │                              ┌────────────────┼────────────────┐
       │                              │                │                │
       │                              ▼                ▼                ▼
       │                           APPROVE          DECLINE        MORE INFO
       │                              │                │                │
       │                              ▼                ▼                ▼
       │                    Update CO status:  Update CO status:  CO stays
       │                    approved            declined           pending
       │                    approved_by=user    Record reason      Send message
       │                    approved_at=NOW()                      to creator
       │                              │
       │                              ▼
       │                    CUSTOMER NOTIFICATION
       │                    ─────────────────────
       │                    Email / In-Person:
       │                    "Your project requires a change.
       │                     Additional cost: $243.20
       │                     Do you approve?"
       │                              │
       │              ┌───────────────┴───────────────┐
       │              │                               │
       │              ▼                               ▼
       │      Customer Approves               Customer Declines
       │              │                               │
       │              ▼                               ▼
       │      CO Status: APPROVED            CO Status: DECLINED
       │      Crew proceeds                  Original scope only
       │              │                      Crew advised
       │              ▼
       │      PROJECT TOTALS UPDATED
       │      ─────────────────────
       │      New Project Total =
       │        Original Estimate Total
       │        + SUM of all approved CO deltas
       │              │
       │              ▼
       │      Invoice updated
       │      Customer receives updated total

═══════════════════════════════════════════════════════════════════════
DATABASE ENTRIES:
  change_orders table row created:
  {
    change_order_number: "CO-2024-012-01",
    project_id: 2,
    estimate_id: 12,
    requested_by: "Customer",
    description: "Add 15ft run...",
    material_cost_delta: 143.20,
    labor_cost_delta: 100.00,
    total_delta: 243.20,
    status: "approved",
    approved_by: 1,
    approved_at: "2024-08-11 14:30:00"
  }

CHANGE ORDER NUMBERING:
  Format: CO-YYYY-[estimate_number]-[sequence]
  Example: CO-2024-012-01 (first CO on estimate 012)
           CO-2024-012-02 (second CO on same estimate)

PROJECT TOTAL QUERY:
  SELECT
    e.total_amount AS original_total,
    COALESCE(SUM(co.total_delta), 0) AS change_order_total,
    e.total_amount + COALESCE(SUM(co.total_delta), 0) AS project_total
  FROM estimates e
  LEFT JOIN change_orders co
    ON co.estimate_id = e.id AND co.status = 'approved'
  WHERE e.project_id = ?
  GROUP BY e.id;
═══════════════════════════════════════════════════════════════════════
```
