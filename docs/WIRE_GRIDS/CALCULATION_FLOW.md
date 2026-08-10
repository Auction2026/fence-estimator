# Calculation Flow Diagram

## Overview

This diagram shows how all costs are calculated step by step to arrive at the final project estimate total.

```
INPUTS (from Tabs 2 & 3)
│
├── Fence Type (chain link / wood / vinyl / ornamental)
├── Fence Height (4 ft / 5 ft / 6 ft / 8 ft)
├── Total Linear Footage
├── Gate Count & Sizes
└── Post Spacing

          │
          ▼
┌──────────────────────────────────────────────────┐
│  MATERIAL TAKEOFF ENGINE (Tab 4)                 │
│                                                  │
│  For each fence section:                         │
│    Posts needed    = footage ÷ post spacing      │
│    Rails needed    = footage × rails per section │
│    Mesh/Pickets    = footage × coverage factor   │
│    Tension wire    = footage × wire runs         │
│    Hardware        = posts × fittings per post   │
│    Gate hardware   = gate count × gate kit       │
│    Concrete        = posts × bags per post       │
│                                                  │
│  Each item quantity × inventory price            │
│  = Material line-item cost                       │
│                                                  │
│  Sum of all line items = MATERIAL SUBTOTAL       │
└─────────────────────┬────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
┌──────────────────┐   ┌──────────────────────────┐
│  LABOR (Tab 5)   │   │  EQUIPMENT (Tab 6)        │
│                  │   │                            │
│  Hours = footage │   │  Equipment rental / day    │
│    × labor rate  │   │  × estimated days          │
│    per fence type│   │  + Fuel cost               │
│                  │   │  + Delivery charge         │
│  LABOR SUBTOTAL  │   │  EQUIPMENT SUBTOTAL        │
└────────┬─────────┘   └────────────┬───────────────┘
         │                          │
         └──────────┬───────────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │  PERMIT & INSPECTION     │
         │  (Tab 7)                 │
         │  Permit fee (flat)       │
         │  + Inspection fee (flat) │
         │  PERMIT SUBTOTAL         │
         └──────────┬───────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────┐
│  COST SUMMARY                                     │
│                                                   │
│  Material Subtotal         = $X,XXX.XX            │
│  Labor Subtotal            = $X,XXX.XX            │
│  Equipment Subtotal        = $  XXX.XX            │
│  Permit Subtotal           = $  XXX.XX            │
│  ─────────────────────────────────────────────    │
│  DIRECT COST TOTAL         = $XX,XXX.XX           │
└──────────────────────┬────────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────────┐
│  MARKUP & OVERHEAD (Tab 8)                        │
│                                                   │
│  Overhead %   × Direct Cost Total = $X,XXX.XX     │
│  Profit %     × Direct Cost Total = $X,XXX.XX     │
│  Contingency% × Direct Cost Total = $   XXX.XX    │
│  ─────────────────────────────────────────────    │
│  TOTAL MARKUP                     = $X,XXX.XX     │
└──────────────────────┬────────────────────────────┘
                       │
                       ▼
┌───────────────────────────────────────────────────┐
│  ESTIMATE TOTAL (Tab 9)                           │
│                                                   │
│  Direct Cost Total  +  Total Markup               │
│  = PROJECT ESTIMATE TOTAL    = $XX,XXX.XX         │
│                                                   │
│  Sales Tax (if applicable)   = $X,XXX.XX          │
│  ─────────────────────────────────────────────    │
│  GRAND TOTAL                 = $XX,XXX.XX         │
└───────────────────────────────────────────────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  Price Lock Applied   │
           │  when contract signed │
           └───────────────────────┘
```

---

## Formulas Reference

| Calculation | Formula |
|---|---|
| Posts needed | `linear_footage / post_spacing` (round up) |
| Mesh rolls | `linear_footage / 50` (50 ft rolls) |
| Concrete bags | `post_count * 2` (2 bags per post) |
| Labor hours | `linear_footage * labor_hours_per_foot` |
| Labor cost | `labor_hours * hourly_rate` |
| Overhead cost | `direct_cost * (overhead_pct / 100)` |
| Profit | `direct_cost * (profit_pct / 100)` |
| Grand total | `direct_cost + overhead + profit + contingency + tax` |
