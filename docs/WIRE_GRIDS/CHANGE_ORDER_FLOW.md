# WIRE GRID 10: CHANGE ORDER FLOW

```
╔══════════════════════════════════════════════════════╗
║              CHANGE ORDER PROCESS FLOW               ║
╚══════════════════════════════════════════════════════╝

TRIGGER: Customer or contractor requests scope change
         after contract is signed.

 SIGNED CONTRACT
       │
       │ Scope change identified
       ▼
 ┌─────────────────────┐
 │   Create Change     │
 │   Order (CO)        │   Tab: [9] Change Orders
 │                     │
 │  - Select project   │
 │  - Describe change  │
 │  - Enter amount     │
 │  - CO number auto   │
 │    assigned         │
 └──────────┬──────────┘
            │
            ▼
 ┌─────────────────────┐
 │ CO Status: PENDING  │ ◄── Waiting for approval
 └──────────┬──────────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
 APPROVED       REJECTED
     │               │
     │               └──► Note reason, archive CO
     │
     ▼
 ┌─────────────────────┐
 │  Customer Signs CO  │   Tab: [10] Sign-Off
 │                     │
 │  - Customer types   │
 │    full name        │
 │  - Date recorded    │
 │  - CO updated       │
 └──────────┬──────────┘
            │
            ▼
 ┌─────────────────────┐
 │  Work Performed     │
 └──────────┬──────────┘
            │
            ▼
 ┌─────────────────────┐
 │ CO Status: COMPLETE │
 │                     │
 │ Contract amount     │
 │ updated:            │
 │ new_total =         │
 │   original +        │
 │   sum(CO amounts)   │
 └──────────┬──────────┘
            │
            ▼
 INVOICE CUSTOMER for CO amount

DATABASE RECORDS:
  change_orders table:
    contract_id  → links to signed contract
    project_id   → links to project
    co_number    → CO-{timestamp}
    status       → pending → approved → complete
    total_change → dollar amount of change
    approved_by  → manager name
    customer_signed → customer name

NOTES:
  - Multiple COs can exist per contract
  - Each CO must be independently signed
  - COs can be positive (additions) or negative (deductions)
  - All COs are logged in the notes tab
```
