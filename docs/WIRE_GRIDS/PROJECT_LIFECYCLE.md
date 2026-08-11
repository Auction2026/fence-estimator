# PROJECT LIFECYCLE DIAGRAM
**Fence Estimator Pro** – Project Status Flow

```
                    ┌──────────┐
                    │  START   │
                    └────┬─────┘
                         │ Create New Project
                         ▼
                    ┌──────────┐
                    │  DRAFT   │
                    │ Tab 1+2  │
                    └────┬─────┘
                         │ Click "Calculate Estimate"
                         ▼
                    ┌──────────┐
                    │ ESTIMATE │
                    │  Tab 8   │
                    └────┬─────┘
                         │
              ┌──────────┴──────────┐
              │ Accepted            │ Rejected
              ▼                     ▼
        ┌──────────┐         ┌──────────────┐
        │ CONTRACT │         │  ARCHIVE /   │
        │  Tab 9   │         │  REVISE      │
        │ LOCKED 🔒│         └──────────────┘
        └────┬─────┘
             │ Signed by both parties
             ▼
        ┌──────────┐
        │  ACTIVE  │
        │ Work in  │
        │ Progress │
        └────┬─────┘
             │
    ┌────────┴────────┐
    │ Change needed?  │
    │ (Yes)           │ (No)
    ▼                 │
┌──────────┐         │
│  CHANGE  │         │
│  ORDER   │         │
│  Tab 12  │         │
│ Approved │         │
└────┬─────┘         │
     │ Return to     │
     └──── ACTIVE ───┘
                      │ Fence installation done
                      ▼
                ┌──────────┐
                │  SIGN-   │
                │  OFF     │
                │  Tab 13  │
                └────┬─────┘
                     │ Both parties sign
                     ▼
                ┌──────────┐
                │ COMPLETE │
                │    ✅    │
                └──────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATUS REFERENCE:

draft      → Project created, no estimate yet
estimate   → Estimate calculated, pending approval  
contract   → Contract signed, price locked 🔒
active     → Installation in progress
completed  → Sign-off complete ✅
```
