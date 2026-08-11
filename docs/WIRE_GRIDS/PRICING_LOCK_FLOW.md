# DIAGRAM 9: PRICING LOCK FLOW
## Fence Depot Fence Estimator — Estimate Pricing Lock System

```
═══════════════════════════════════════════════════════════════════════
                    PRICING LOCK FLOW DIAGRAM
          Protects Approved Estimates from Accidental Changes
═══════════════════════════════════════════════════════════════════════

ESTIMATE CREATED (Draft)
────────────────────────
  Estimate Status: DRAFT
  pricing_locked = 0 (FALSE)
  All fields editable
       │
       ▼
  ┌─────────────────────────────────────────┐
  │  ESTIMATE IS EDITABLE                   │
  │                                         │
  │  Estimator can change:                  │
  │  ✏️  All line items                      │
  │  ✏️  Labor hours and rate                │
  │  ✏️  Markup percentage                   │
  │  ✏️  Discount amount                     │
  │  ✏️  Equipment and disposal costs        │
  │  ✏️  All customer information            │
  │  ✏️  Notes and special requirements      │
  └──────────────────┬──────────────────────┘
                     │
          Estimate sent to customer
                     │
                     ▼
  Estimate Status: SENT (optional state)
       │
       ▼
  Customer Reviews Estimate
       │
       ├─── Customer wants changes ─────────────────────► Edit estimate
       │                                                  (pricing_locked=0)
       │
       └─── Customer APPROVES ──────────────────────────────────────┐
                                                                    │
                                                                    ▼
ESTIMATE APPROVED — PRICING LOCK TRIGGERED
───────────────────────────────────────────
  Admin / Estimator clicks [Approve Estimate]
       │
       ▼
  ┌────────────────────────────────────────────────────────────┐
  │  System Action:                                             │
  │  UPDATE estimates SET                                       │
  │    status = 'approved',                                     │
  │    pricing_locked = 1,                                      │
  │    pricing_locked_at = NOW(),                               │
  │    pricing_locked_by = current_user_id                      │
  │  WHERE id = estimate_id;                                    │
  │                                                             │
  │  + Insert audit_log entry:                                  │
  │    action = 'ESTIMATE_APPROVED'                             │
  │    record_id = estimate_id                                  │
  │    user_id = approver_id                                    │
  └──────────────────────────────────────────────────────────── ┘
       │
       ▼
  ┌─────────────────────────────────────────┐
  │  ESTIMATE IS LOCKED                     │
  │                                         │
  │  🔒 All pricing fields read-only:        │
  │  ❌  Cannot change line item prices      │
  │  ❌  Cannot change labor rate            │
  │  ❌  Cannot change markup %              │
  │  ❌  Cannot add/remove line items        │
  │  ❌  Cannot change total amount          │
  │                                         │
  │  ✅  CAN still edit:                     │
  │  ✏️  Project notes                       │
  │  ✏️  Schedule / dates                    │
  │  ✏️  Crew assignment                     │
  │  ✏️  Status (in_progress, completed)     │
  └──────────────────┬──────────────────────┘
                     │
         Scope change needed?
                     │
                     ├─── YES ──────────────────────────────────────┐
                     │                                               │
                     │                                               ▼
                     │                              CREATE CHANGE ORDER
                     │                              ────────────────────
                     │                              (does NOT unlock estimate)
                     │                              change_orders table:
                     │                              • Document what changed
                     │                              • Calculate delta cost
                     │                              • Get approval
                     │                              • Separate from estimate
                     │
                     └─── UNLOCK NEEDED ─────────────────────────────┐
                                                                     │
UNLOCK FLOW (Admin Only)                                             │
────────────────────────                                             ▼
  User (admin role) clicks [Unlock Pricing]
       │
       ▼
  System checks: req.user.role === 'admin' ?
       │
       ├─── NO (estimator/crew) ──────────────────────► 403 Forbidden
       │                                                 "Admin only"
       │
       └─── YES (admin) ──────────────────────────────────────────────┐
                                                                      │
                                                                      ▼
            Confirm dialog:
            "Are you sure? Unlocking allows price changes
             to an approved estimate. This is audited."
                     │
                     ├─── Cancel ──────────────────────────► No change
                     │
                     └─── Confirm ──────────────────────────────────────┐
                                                                        │
                                                                        ▼
                          UPDATE estimates SET
                            pricing_locked = 0,
                            status = 'estimate'   (back to editable)
                          WHERE id = estimate_id;

                          + audit_log entry:
                            action = 'PRICING_UNLOCKED'
                            user_id = admin_id
                            note = reason for unlock
                                                                        │
                                                                        ▼
                          Estimate editable again
                          Re-approval required to lock again

═══════════════════════════════════════════════════════════════════════
AUDIT TRAIL FOR PRICING LOCK EVENTS:
  Action                  │ Who          │ When logged
  ────────────────────────┼──────────────┼──────────────────────
  ESTIMATE_SENT           │ Estimator    │ When emailed/printed
  ESTIMATE_APPROVED       │ Admin/Est.   │ When customer says yes
  PRICING_LOCKED          │ System       │ Automatically on approve
  PRICING_UNLOCKED        │ Admin only   │ Manual action
  ESTIMATE_REVISED        │ Estimator    │ After unlock + edit
  RE_APPROVED             │ Admin/Est.   │ New approval

DATABASE FIELDS:
  estimates.pricing_locked      (TINYINT 0/1)
  estimates.pricing_locked_at   (DATETIME)
  estimates.pricing_locked_by   (FK→users.id)
═══════════════════════════════════════════════════════════════════════
```
