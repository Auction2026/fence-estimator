# WIRE GRID 10 – CHANGE ORDER FLOW
## How Change Orders Handle Scope Changes After Contract Signing

```
╔══════════════════════════════════════════════════════════════════════╗
║                   CHANGE ORDER FLOW                                 ║
╚══════════════════════════════════════════════════════════════════════╝

─────────────────────────────────────────────────────────────
WHAT IS A CHANGE ORDER?
─────────────────────────────────────────────────────────────

  A Change Order (CO) is a formal document that modifies
  the original contract scope and/or price AFTER the
  contract has been signed.

  Examples:
  • Customer adds 20 more feet of fence
  • Customer upgrades from chain-link to vinyl
  • Gate relocation discovered on-site
  • Additional concrete required due to rocky soil

─────────────────────────────────────────────────────────────
CHANGE ORDER CREATION FLOW
─────────────────────────────────────────────────────────────

  PROJECT IN PROGRESS
          │
          │  Scope change identified
          │
          ▼
  USER: Change Orders tab → "+ New Change Order"
          │
          ▼
  ┌─────────────────────────────────────┐
  │  Fill Change Order Form:            │
  │  • Select Project                   │
  │  • Describe the change              │
  │  • Enter additional amount ($)      │
  └──────────────────┬──────────────────┘
                     │ Save
                     ▼
  ┌─────────────────────────────────────┐
  │  Change Order Created               │
  │  co_num = CO-XXXXX                  │
  │  status = "pending"                 │
  └──────────────────┬──────────────────┘
                     │
                     ▼
  NOTIFY CUSTOMER (manual – email/phone)
          │
     ┌────┴──────┐
     │           │
     ▼           ▼
  APPROVED    REJECTED
     │           │
     │           ▼
     │   status = "rejected"
     │   rejection_reason logged
     │   Scope stays as original
     │
     ▼
  ┌─────────────────────────────────────┐
  │  Manager/Admin clicks "Approve"     │
  │  PUT /api/change-orders/:id         │
  │  { status: "approved" }             │
  │                                     │
  │  DB: approved_by = user_id          │
  │       approved_at = NOW()           │
  │       status = "approved"           │
  │                                     │
  │  Audit log entry created            │
  └──────────────────┬──────────────────┘
                     │
                     ▼
  ┌─────────────────────────────────────┐
  │  Project Total Updated:             │
  │  new_total = original + CO_amount   │
  │                                     │
  │  Contract amended manually or via   │
  │  contract addendum document         │
  └──────────────────┬──────────────────┘
                     │
                     ▼
  WORK CONTINUES with updated scope

─────────────────────────────────────────────────────────────
CHANGE ORDER STATUS FLOW
─────────────────────────────────────────────────────────────

  pending  ──────→  approved  ──────→  (work done)
     │                                     │
     │                                     ▼
     └──→  rejected                   sign-off
     │
     └──→  cancelled

─────────────────────────────────────────────────────────────
MULTIPLE CHANGE ORDERS
─────────────────────────────────────────────────────────────

  One project can have MANY change orders:

  Original Contract:    $5,200.00  (CO-00001 through CO-00005)
  Change Order CO-00001: +$450.00  (extra 20ft)
  Change Order CO-00002: +$850.00  (gate upgrade)
  Change Order CO-00003: -$200.00  (removed corner section)
  ────────────────────────────────────
  FINAL PROJECT TOTAL:  $6,300.00

─────────────────────────────────────────────────────────────
ROLES & PERMISSIONS
─────────────────────────────────────────────────────────────

  Create CO:   estimator, manager, admin
  Approve CO:  manager, admin ONLY
  Reject CO:   manager, admin ONLY
  Delete CO:   admin ONLY
  View CO:     all roles
```
