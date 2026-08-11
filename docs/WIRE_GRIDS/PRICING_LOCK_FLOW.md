# PRICING LOCK FLOW
## Fence Depot Fence Estimator - How Price Locking Works

```
═══════════════════════════════════════════════════════════════════════════
                     PRICING LOCK FLOW DIAGRAM v1.0
═══════════════════════════════════════════════════════════════════════════

PURPOSE OF PRICE LOCKING:
  Prevents accidental changes to estimate prices after the estimate
  has been sent to a customer or approved. Ensures the price your
  customer sees doesn't change unexpectedly.

═══════════════════════════════════════════════════════════════════════════

PHASE 1: UNLOCKED (Initial Estimate Creation)
─────────────────────────────────────────────

  STATUS: DRAFT (Unlocked)
  
  ┌────────────────────────────────────────────────────────────────────┐
  │                    ESTIMATE IS EDITABLE                            │
  │                                                                    │
  │  ✏️  All fields can be changed:                                    │
  │     • Material quantities (can add/remove items)                   │
  │     • Unit prices (can adjust individual item prices)              │
  │     • Labor hours and rates                                        │
  │     • Equipment costs                                              │
  │     • Markup percentage                                            │
  │     • Overhead percentage                                          │
  │     • Discount amount                                              │
  │     • Tax rate                                                     │
  │                                                                    │
  │  Recalculate anytime: [CALCULATE] button always active             │
  │  Save as draft:       [SAVE DRAFT] button                          │
  └───────────────────────────────────┬────────────────────────────────┘
                                      │ Ready to send to customer
                                      ▼
PHASE 2: SENDING ESTIMATE TO CUSTOMER
──────────────────────────────────────

  ┌────────────────────────────────────────────────────────────────────┐
  │  User clicks: [SEND TO CUSTOMER] or [PRINT ESTIMATE]              │
  │                                                                    │
  │  System prompts:                                                   │
  │  ┌────────────────────────────────────────────────────────────┐   │
  │  │ "Would you like to LOCK this estimate?                     │   │
  │  │  Locking prevents accidental price changes after sending.  │   │
  │  │  You can unlock it later if needed.                        │   │
  │  │                                                            │   │
  │  │  [LOCK AND SEND]    [SEND WITHOUT LOCKING]    [CANCEL]    │   │
  │  └────────────────────────────────────────────────────────────┘   │
  └───────────────────────────────────┬────────────────────────────────┘
                         │                           │
              User chooses                 User chooses
              LOCK AND SEND                SEND WITHOUT LOCKING
                         │                           │
                         ▼                           ▼
PHASE 3A: LOCKED                      PHASE 3B: STILL EDITABLE
────────────────────                  ──────────────────────────
                                      
  STATUS: SENT (Locked)                 STATUS: SENT (Unlocked)
  
  ┌──────────────────────────┐         ┌──────────────────────────┐
  │  🔒 ESTIMATE LOCKED      │         │  ⚠️  ESTIMATE EDITABLE    │
  │                          │         │                          │
  │  All price fields show:  │         │  Fields still editable   │
  │  [LOCKED - READ ONLY]    │         │  but warning shown:      │
  │                          │         │  "Estimate was already   │
  │  Cannot change:          │         │   sent to customer"      │
  │  • Quantities            │         └──────────────────────────┘
  │  • Prices                │
  │  • Totals                │
  │                          │
  │  Can still:              │
  │  • Add notes             │
  │  • View the estimate     │
  │  • Print/resend          │
  └───────────┬──────────────┘
              │
              │ Admin can unlock if needed
              ▼
PHASE 4: UNLOCKING (Admin Only)
───────────────────────────────

  Admin clicks: [UNLOCK ESTIMATE]
  
  ┌────────────────────────────────────────────────────────────────────┐
  │  "Are you sure you want to unlock this estimate?                   │
  │   This estimate was sent to the customer on [DATE].                │
  │   Reason for unlocking: [_______________________________]         │
  │                                                                    │
  │   [CONFIRM UNLOCK]    [CANCEL]                                     │
  └────────────────────────────────────────────────────────────────────┘
  
  After unlocking:
  • Estimate becomes editable again
  • Unlock event logged with timestamp, user, and reason
  • Estimator is notified
  • Customer should be notified of any price changes

PHASE 5: PRICE CHANGE AFTER APPROVAL
──────────────────────────────────────

  If customer approved estimate and price must change:
  
  ┌────────────────────────────────────────────────────────────────────┐
  │  DO NOT unlock and edit the original estimate.                     │
  │                                                                    │
  │  INSTEAD: Create a CHANGE ORDER (Tab 10)                           │
  │  • Shows original contract amount                                  │
  │  • Shows the change (addition or credit)                           │
  │  • Shows new contract total                                        │
  │  • Requires customer signature/approval                            │
  └────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                    PRICE LOCK STATUS CODES
═══════════════════════════════════════════════════════════════════════════

  DRAFT    = Not sent, fully editable, no lock
  SENT     = Sent to customer, may be locked or unlocked  
  ACCEPTED = Customer approved, automatically locked
  DECLINED = Customer declined, unlock allowed to revise
  EXPIRED  = Past validity date, locked

═══════════════════════════════════════════════════════════════════════════
                    VISUAL INDICATORS
═══════════════════════════════════════════════════════════════════════════

  🔓 Green unlock icon = Estimate is editable (DRAFT status)
  🔒 Red lock icon     = Estimate is locked (cannot edit prices)
  ⚠️  Yellow warning   = Sent but not locked (editable with caution)
  
  Locked fields show gray background and [LOCKED] text
  Active fields show white background with cursor

═══════════════════════════════════════════════════════════════════════════
```
