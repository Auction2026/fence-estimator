# Tab Dependencies

## Overview

This diagram shows which tabs must be completed before you can use other tabs.

```
TAB 1 — Project Information
  │   REQUIRED FIRST — all other tabs depend on this
  │
  ├──► TAB 2 — Fence Specifications
  │      │   Requires: Tab 1
  │      │
  │      └──► TAB 3 — Layout / Measurements
  │                │   Requires: Tabs 1 & 2
  │                │
  │                └──► TAB 4 — Material Takeoff
  │                       │   Requires: Tabs 1, 2 & 3
  │                       │   (Auto-calculated from 2 & 3)
  │                       │
  │                       ├──► TAB 5 — Labor Costs
  │                       │     Requires: Tab 4 complete
  │                       │
  │                       ├──► TAB 6 — Equipment Costs
  │                       │     Requires: Tab 4 complete
  │                       │
  │                       └──► TAB 7 — Permit Costs
  │                              Requires: Tab 4 complete
  │
  └──► TAB 8 — Markup & Overhead
         │   Requires: Tabs 4, 5, 6 & 7 complete
         │
         └──► TAB 9 — Estimate Summary
                │   Requires: All cost tabs (4–8)
                │   READ-ONLY — shows totals
                │
                └──► TAB 10 — Contract
                       │   Requires: Tab 9 (estimate finalized)
                       │   PRICE LOCK activates here
                       │
                       ├──► TAB 11 — Change Orders
                       │     Requires: Tab 10 signed
                       │     Available only AFTER contract
                       │
                       ├──► TAB 12 — Scheduling
                       │     Requires: Tab 10 signed
                       │
                       ├──► TAB 13 — Material Orders
                       │     Requires: Tab 10 signed
                       │
                       ├──► TAB 14 — Progress Tracking
                       │     Requires: Tab 12 (schedule set)
                       │
                       ├──► TAB 15 — Invoicing
                       │     Requires: Tab 14 (work in progress)
                       │
                       ├──► TAB 16 — Sign-Off
                       │     Requires: Tab 14 (work complete)
                       │
                       └──► TAB 17 — Mapping
                              Available at any time after Tab 3
```

---

## Dependency Summary Table

| Tab | Name | Requires These Tabs First |
|---|---|---|
| 1 | Project Information | None (start here) |
| 2 | Fence Specifications | 1 |
| 3 | Layout / Measurements | 1, 2 |
| 4 | Material Takeoff | 1, 2, 3 |
| 5 | Labor Costs | 4 |
| 6 | Equipment Costs | 4 |
| 7 | Permit Costs | 4 |
| 8 | Markup & Overhead | 4, 5, 6, 7 |
| 9 | Estimate Summary | 4, 5, 6, 7, 8 |
| 10 | Contract | 9 |
| 11 | Change Orders | 10 |
| 12 | Scheduling | 10 |
| 13 | Material Orders | 10 |
| 14 | Progress Tracking | 12 |
| 15 | Invoicing | 14 |
| 16 | Sign-Off | 14 |
| 17 | Mapping | 3 |
