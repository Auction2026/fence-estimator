# PRICING LOCK FLOW
## Fence Depot Estimator — How Price Locking Works

```
═══════════════════════════════════════════════════════════════
                    PRICE LOCK MECHANISM
═══════════════════════════════════════════════════════════════

  WHY PRICE LOCKING EXISTS:
  • Protects the customer — price won't increase after agreement
  • Protects the company — price won't be changed after quote
  • Creates a clean audit trail for legal/dispute purposes

──────────────────────────────────────────────────────────────

  STEP 1: ESTIMATE CREATED (NOT LOCKED)
  ──────────────────────────────────────
  estimates.price_locked = FALSE
  estimates.status = 'draft' | 'sent'

  Estimator CAN:
  ✅ Edit any line item (qty, price, description)
  ✅ Add new line items
  ✅ Remove line items
  ✅ Change tax rate or markup
  ✅ Apply discounts
  ✅ Change valid_until date

──────────────────────────────────────────────────────────────

  STEP 2: CUSTOMER ACCEPTS (PRICE LOCK TRIGGERED)
  ──────────────────────────────────────────────────
  estimates.status       = 'accepted'
  estimates.price_locked = TRUE
  estimates.price_locked_at = NOW()
  estimates.accepted_at  = NOW()

  After locking, estimator CANNOT:
  ❌ Change line item prices
  ❌ Change total amount
  ❌ Change tax rate

  After locking, estimator CAN:
  ✅ Generate PDF
  ✅ Create contract from estimate
  ✅ Add notes (notes table — separate from estimate)

──────────────────────────────────────────────────────────────

  STEP 3: CONTRACT CREATED FROM LOCKED ESTIMATE
  ────────────────────────────────────────────────
  contracts.estimate_id     = estimate.id
  contracts.contract_total  = estimate.total  (copied, immutable)
  contracts.status          = 'pending'

  The contract total is the FINAL price.
  Changes to scope go through CHANGE ORDERS.

──────────────────────────────────────────────────────────────

  STEP 4: CHANGE ORDER PROCESS (if scope changes)
  ────────────────────────────────────────────────
  Customer requests additional work
       │
       ▼
  Estimator creates Change Order:
    change_orders.co_number = "CO-001"
    change_orders.reason    = "Customer added 20ft section"
    change_orders.amount    = $850.00
    change_orders.status    = 'pending'
       │
       ▼
  Customer approves / rejects
       │ approved
       ▼
  change_orders.status     = 'approved'
  change_orders.approved_by = user.id
  change_orders.approved_at = NOW()
       │
       ▼
  NEW contract total = original + change order amount
  (This is tracked separately — original contract is NOT modified)

──────────────────────────────────────────────────────────────

  PRICE LOCK DATA MODEL
  ──────────────────────
  ┌────────────────────────────────────────────────────────┐
  │  estimates                                             │
  │  ────────                                              │
  │  price_locked      BOOLEAN   DEFAULT FALSE             │
  │  price_locked_at   TIMESTAMP                           │
  │  accepted_at       TIMESTAMP                           │
  │                                                        │
  │  Business rule enforced in backend:                    │
  │  if (estimate.price_locked && request changes price):  │
  │      return 403 Forbidden                              │
  └────────────────────────────────────────────────────────┘

──────────────────────────────────────────────────────────────

  AUDIT TRAIL
  ───────────
  Every price change is recorded in audit_log:
  {
    table_name: "estimates",
    record_id:  "uuid...",
    action:     "UPDATE",
    changed_by: "user-uuid...",
    old_data:   { total: 5500.00, price_locked: false },
    new_data:   { total: 5500.00, price_locked: true },
    changed_at: "2026-08-11T14:30:00Z"
  }
```
