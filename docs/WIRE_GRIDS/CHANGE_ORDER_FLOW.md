# Change Order Flow

## Overview

This diagram shows exactly how a change order works after a contract has been signed and the price is locked.

```
CONTRACT SIGNED (Tab 10)
Price is LOCKED
       │
       ▼
Something changes AFTER signing:
  • Customer wants to add a section
  • Customer wants to remove a section
  • Unexpected site condition found
  • Scope was misunderstood
  • Customer requests upgrade/downgrade
       │
       ▼
┌───────────────────────────────────────────────────────┐
│  STEP 1 — Identify the Change (Tab 11)                │
│  • Describe what changed                              │
│  • Who requested it (customer or contractor)          │
│  • Reason for change                                  │
└──────────────────────┬────────────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────────────┐
│  STEP 2 — Calculate New Cost                          │
│  • Calculate cost of added work                       │
│  • Calculate credit for removed work                  │
│  • Calculate net change amount                        │
│  • (+) Addition or (−) Deduction                      │
└──────────────────────┬────────────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────────────┐
│  STEP 3 — Present to Customer                         │
│  • Show change description                            │
│  • Show cost impact                                   │
│  • Show new total (locked total + change)             │
│  • Generate Change Order document                     │
└──────────────────────┬────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
    Customer                  Customer
    DECLINES                  APPROVES
          │                         │
          ▼                         ▼
  Change NOT made            STEP 4 — Signature
  Original scope             • Customer signs
  and price stand            • Approval timestamp
                             • Stored in database
                                     │
                                     ▼
                   ┌─────────────────────────────────────┐
                   │  STEP 5 — Update Project Total      │
                   │                                     │
                   │  New Total =                        │
                   │    Original Locked Price            │
                   │    + Change Order 1 amount          │
                   │    + Change Order 2 amount (if any) │
                   │    + ... all approved orders        │
                   │                                     │
                   │  Each change order is a separate    │
                   │  line in the project record         │
                   └───────────────┬─────────────────────┘
                                   │
                                   ▼
                       Continue with project work
```

---

## Change Order Status Values

| Status | Meaning |
|---|---|
| Draft | Created but not yet sent to customer |
| Pending | Sent to customer, waiting for response |
| Approved | Customer signed, cost added to project |
| Declined | Customer declined, no change to project |
| Voided | Cancelled before customer decision |

---

## Multiple Change Orders

If a project has several changes, each one is tracked separately:

```
Original Contract: $10,000  (locked)
Change Order #1:   +$1,500   (approved — added gate)
Change Order #2:   −$  200   (approved — removed small section)
Change Order #3:   +$  800   (approved — upgraded posts)
─────────────────────────────────────
FINAL PROJECT TOTAL: $12,100
```

All change orders are listed in Tab 11 with individual approval dates and signatures.

---

## Audit Trail

Every change order permanently records:
- Date and time created
- Description of the change
- Dollar amount (positive or negative)
- Who approved it
- Approval date and time
- Running project total after approval
