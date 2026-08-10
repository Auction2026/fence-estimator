# WIRE GRID 4 – PROJECT LIFECYCLE
## From First Call to Final Payment

---

```
╔══════════════════════════════════════════════════════════════════╗
║         FENCE ESTIMATOR – PROJECT LIFECYCLE DIAGRAM             ║
╚══════════════════════════════════════════════════════════════════╝

CUSTOMER CALLS/CONTACTS FENCE DEPOT
              │
              ▼
     ┌────────────────────┐
     │  STATUS: LEAD      │
     │  (Not in system)   │
     └────────────────────┘
              │
              │  Sales rep opens the estimator
              ▼
     ┌────────────────────────────────────────┐
     │  STATUS: ESTIMATE                       │
     │  • Create project (Tab 1)              │
     │  • Enter fence specs (Tab 2)           │
     │  • Measure footage (Tab 3)             │
     │  • Calculate materials (Tab 4)         │
     │  • Add labor & equipment (Tabs 5-6)    │
     │  • Build estimate (Tab 7)              │
     │  • ESTIMATE PRINTED AND GIVEN TO       │
     │    CUSTOMER                            │
     └────────────────────────────────────────┘
              │
              │          ┌──────────────────────┐
              │ Customer  │                      │
              │ approves  │   Customer declines  │
              ▼           │   → Project archived │
     ┌────────────────────┐ ←──────────────────  │
     │  STATUS: CONTRACT  │                      │
     │  • Lock contract   │                      │
     │    (Tab 8)         │                      │
     │  • Price FROZEN    │                      │
     │  • Collect deposit │                      │
     │  • Sign contract   │                      │
     │  • Set dates       │                      │
     └────────────────────┘
              │
              │  ┌─────────────────────────────────┐
              │  │ OPTIONAL: Change Order           │
              │  │ (If customer wants changes)      │
              │  │ Tab 9 → CO approved → price adj. │
              │  └─────────────────────────────────┘
              │
              ▼
     ┌────────────────────────────────────────┐
     │  STATUS: ACTIVE / IN PROGRESS          │
     │  • Schedule crew (Tab 11)              │
     │  • Assign crew members (Tab 12)        │
     │  • Generate supplier PO (Tab 13)       │
     │  • Materials delivered                 │
     │  • Installation begins                 │
     │  • Log daily progress (Tab 14)         │
     │  • %-complete updated daily            │
     └────────────────────────────────────────┘
              │
              │  ┌─────────────────────────────────┐
              │  │ DURING PROJECT: More Change Orders│
              │  │ (If needed for scope changes)    │
              │  └─────────────────────────────────┘
              │
              ▼
     ┌────────────────────────────────────────┐
     │  STATUS: COMPLETE                       │
     │  • Installation finished               │
     │  • Customer walkthrough               │
     │  • Customer signs off (Tab 15)        │
     │  • Collect final payment              │
     │  • Generate final invoice (Tab 10)    │
     │  • Print completion reports (Tab 16)  │
     │  • Project marked COMPLETE            │
     └────────────────────────────────────────┘
              │
              ▼
     ┌────────────────────────────────────────┐
     │  POST-COMPLETION                        │
     │  • Data archived in database           │
     │  • Available for reporting             │
     │  • Customer satisfaction recorded     │
     │  • Available for future reference     │
     └────────────────────────────────────────┘


══════════════════════════════════════════════════════════════════
                    PROJECT STATUS FLOW
══════════════════════════════════════════════════════════════════

  Estimate ──► Contract ──► Active ──► Complete
       │                                  │
       │                                  └── Archived
       │
       └── Declined ──► Archived


══════════════════════════════════════════════════════════════════
                    MONEY FLOW TIMELINE
══════════════════════════════════════════════════════════════════

  Day 0:      Estimate given to customer    $0 collected
  Day 1-5:    Customer approves contract
  Day 1-5:    DEPOSIT collected             50% collected
              (e.g., $2,500 of $5,000 total)
  Day 5-15:   Materials ordered and delivered
  Day 5-20:   Installation in progress
  Day 15-25:  Installation complete
  Day 25:     Final walkthrough
  Day 25:     FINAL PAYMENT collected      100% collected
              (remaining 50% = $2,500)
  Day 26+:    Project archived


══════════════════════════════════════════════════════════════════
            WHAT CAN CHANGE vs. WHAT IS LOCKED
══════════════════════════════════════════════════════════════════

  BEFORE Contract Lock (Tabs 1-7):
  ┌─────────────────────────────────────────────┐
  │  ✅ Can change ANYTHING:                    │
  │  • Customer information                     │
  │  • Fence specifications                     │
  │  • Footage                                  │
  │  • Materials list                           │
  │  • Labor costs                              │
  │  • Prices                                   │
  │  • EVERYTHING is editable                   │
  └─────────────────────────────────────────────┘

  AFTER Contract Lock (Tab 8 signed):
  ┌─────────────────────────────────────────────┐
  │  🔒 CONTRACT PRICE IS FROZEN               │
  │                                             │
  │  ✅ CAN still update:                       │
  │  • Schedule and dates                       │
  │  • Crew assignments                         │
  │  • Progress tracking notes                 │
  │  • Invoice payments received               │
  │                                             │
  │  ❌ CANNOT change without Change Order:     │
  │  • Contract price                           │
  │  • Scope of work                            │
  │  • Fence specifications                     │
  │  • Materials list                           │
  └─────────────────────────────────────────────┘
```

---

## ✅ PROJECT STATUS DEFINITIONS

| Status | Meaning | Next Step |
|--------|---------|-----------|
| **Estimate** | Pricing calculated, not yet approved | Present to customer |
| **Contract** | Customer approved, price locked | Schedule & order materials |
| **Active** | Installation in progress | Daily progress updates |
| **Complete** | Installation done, signed off | Archive, final invoice |
| **Cancelled** | Project cancelled | Archive |
| **Declined** | Customer declined estimate | Archive or re-quote |
