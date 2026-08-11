# CHANGE ORDER FLOW DIAGRAM
**Fence Estimator Pro** – Change Order Process

```
TRIGGER: Something changes after contract is signed

Examples:
- Customer wants extra gates
- Soil conditions require extra work
- Material costs changed
- Scope expanded or reduced

         │
         ▼
┌─────────────────────────────────────────────────────┐
│  TAB 12: CHANGE ORDERS                              │
│  Click: "+ New Change Order"                        │
└────────────────────────┬────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│  CHANGE ORDER FORM                                  │
│                                                     │
│  CO Number: CO-001 (auto-generated)                 │
│  Date: [today]                                      │
│  Description: [what is changing]                    │
│  Reason: [why it's changing]                        │
│  Material Cost Change: +/- $____                    │
│  Labour Cost Change:   +/- $____                    │
│  Timeline Change: [e.g. +2 days]                    │
│                                                     │
│  AUTO-CALCULATED:                                   │
│  New Contract Total: $X,XXX.XX                      │
│                                                     │
│  Customer Signature: [type name]                    │
└────────────────────────┬────────────────────────────┘
                         │ Click "Save Change Order"
                         ▼
┌─────────────────────────────────────────────────────┐
│  CHANGE ORDER STATUS                                │
│                                                     │
│  IF customer signed:  → status = "approved"  ✅    │
│  IF no signature yet: → status = "pending"   ⏳    │
└────────────────────────┬────────────────────────────┘
                         │
              ┌──────────┴──────────┐
              │ Approved            │ Rejected
              ▼                     ▼
┌─────────────────────┐   ┌─────────────────────────┐
│  Contract total     │   │  Change order status    │
│  updated to new     │   │  = "rejected"           │
│  amount             │   │  Original total stays   │
│                     │   │  Customer discussion    │
│  Both parties have  │   │  needed                 │
│  signed record      │   └─────────────────────────┘
└────────┬────────────┘
         │
         │ Print / Export CO document
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  CHANGE ORDER LOG (Table in Tab 12)                 │
│                                                     │
│  CO# │ Date │ Description │ Mat Δ │ Lab Δ │ Status  │
│  001 │ date │ description │ +$xxx │ +$xxx │ Approved│
│  002 │ date │ description │  $0   │ +$xxx │ Pending │
└─────────────────────────────────────────────────────┘

CALCULATION FORMULA:
originalTotal (from contract)
+ materialDelta
+ labourDelta
= newBaseAmount (before tax)
× (1 + TAX_RATE)
= newTotal (with tax)

All change orders are logged permanently.
Cannot be deleted after approval.
```
