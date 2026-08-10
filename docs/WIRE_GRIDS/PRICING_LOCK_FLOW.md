# Pricing Lock Flow

## Overview

This diagram shows exactly how and when the price lock activates and what it prevents.

```
ESTIMATE CREATED (Tab 9)
       │
       │  At this stage prices CAN still change:
       │  • Material prices can be updated
       │  • Labor rate can be changed
       │  • Markup % can be adjusted
       │  • Any tab 2-8 can be edited
       │
       ▼
Customer reviews estimate
       │
       │
       ▼
┌───────────────────────────────────────────────────────┐
│  CONTRACT CREATED (Tab 10)                            │
│  • Customer accepts estimate                          │
│  • Contract document generated                        │
│  • Customer signature captured                        │
│  • Timestamp recorded: price_locked_at                │
│  • Total locked: total_locked = grand_total           │
└──────────────────────┬────────────────────────────────┘
                       │
                       │  PRICE LOCK ACTIVATES
                       │
                       ▼
┌───────────────────────────────────────────────────────┐
│  PRICE IS NOW LOCKED                                  │
│                                                       │
│  What is LOCKED:                                      │
│  ✅ Grand total (cannot change)                       │
│  ✅ All line-item prices (cannot change)              │
│  ✅ Labor rate applied at lock time                   │
│  ✅ Material costs at lock time                       │
│  ✅ Overhead/profit % at lock time                    │
│                                                       │
│  What can still CHANGE (via Change Order):            │
│  🔄 Scope of work (add/remove sections)               │
│  🔄 Customer-requested additions                      │
│  🔄 Unforeseen site conditions                        │
│  — Each change requires a separate Change Order       │
│  — Each Change Order requires customer approval       │
│  — Change Orders ADD to or SUBTRACT from locked total │
└──────────────────────┬────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
    NO CHANGES                 CHANGE ORDER
    NEEDED                     NEEDED (Tab 11)
          │                         │
          │              ┌──────────┴──────────────┐
          │              │  CHANGE ORDER PROCESS   │
          │              │  1. Describe change      │
          │              │  2. Calculate new cost   │
          │              │  3. Present to customer  │
          │              │  4. Customer approves    │
          │              │  5. New total = locked   │
          │              │     total + change amt   │
          │              └──────────┬───────────────┘
          │                         │
          └────────────┬────────────┘
                       │
                       ▼
              FINAL PROJECT TOTAL
              = Locked Price
              + All Approved Change Orders
```

---

## Price Lock Rules

| Rule | Detail |
|---|---|
| Lock triggers on | Contract signature timestamp |
| Lock applies to | Grand total and all estimate line items |
| To change price | Must create a Change Order |
| Change Order requires | Customer written approval |
| Price increases | Allowed only via signed Change Order |
| Price reductions | Allowed only via signed Change Order |
| Lock can be broken | Only by voiding the contract (requires both parties) |

---

## Why Price Lock Matters

- **Protects the customer** — they know exactly what they agreed to pay.
- **Protects the business** — prevents disputes about the original quoted price.
- **Legal record** — timestamp and locked amount are stored in the database.
- **Change order audit trail** — every price change after lock is documented and approved.
