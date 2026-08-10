# WIRE GRID 6 – CALCULATION FLOW
## How Material Costs & Estimate Totals Are Calculated

```
╔══════════════════════════════════════════════════════════════════════╗
║                   CALCULATION FLOW DIAGRAM                          ║
╚══════════════════════════════════════════════════════════════════════╝

USER INPUTS (Step 2 & 3 of Wizard)
├─ Fence Type (chain-link, wood, vinyl, ornamental, aluminum)
├─ Height (3, 4, 5, 6, 8 ft)
├─ Total Linear Feet
├─ Walk Gates count
└─ Drive Gates count

         │
         ▼ Click "Calculate Materials"
         │
  ┌──────────────────────────────────────┐
  │  calcMaterials() function            │
  │                                      │
  │  1. Calculate posts needed:          │
  │     posts = CEIL(footage / 10) + 1   │
  │                                      │
  │  2. Look up material formulas        │
  │     for selected fence type          │
  │                                      │
  │  3. Calculate quantities:            │
  │     ┌─────────────────────────────┐  │
  │     │ CHAIN LINK:                 │  │
  │     │  mesh rolls = CEIL(ft/50)   │  │
  │     │  top rail   = CEIL(ft/21)   │  │
  │     │  tension wire = CEIL(ft/200)│  │
  │     │  brace bands = posts × 2    │  │
  │     │  concrete = posts × 2 bags  │  │
  │     └─────────────────────────────┘  │
  │     ┌─────────────────────────────┐  │
  │     │ WOOD:                       │  │
  │     │  pickets = CEIL(ft × 2)     │  │
  │     │  rails = CEIL(ft/8) × 2     │  │
  │     │  concrete = posts × 2 bags  │  │
  │     └─────────────────────────────┘  │
  │     (vinyl/ornamental/aluminum       │  
  │      use similar panel formulas)     │
  │                                      │
  │  4. Add gates if walk/drive > 0      │
  │                                      │
  │  5. Return items[] array             │
  └──────────────────────────────────────┘
         │
         ▼
  ┌──────────────────────────────────────┐
  │  calcCosts() function                │
  │                                      │
  │  materials_subtotal = Σ(qty × price) │
  │                                      │
  │  labor = footage × labor_rate/ft     │
  │          (default: $12/ft)           │
  │                                      │
  │  markup = (materials + labor)        │
  │            × markup_pct / 100        │
  │           (default: 20%)             │
  │                                      │
  │  grand_total = materials             │
  │              + labor                 │
  │              + markup                │
  └──────────────────────────────────────┘
         │
         ▼
  ┌──────────────────────────────────────┐
  │  Cost Summary Display                │
  │                                      │
  │  Materials Subtotal:    $X,XXX.XX    │
  │  Labor (XXXft × $XX/ft): $X,XXX.XX  │
  │  Markup (XX%):            $XXX.XX    │
  │  ─────────────────────────────────── │
  │  GRAND TOTAL:           $X,XXX.XX    │
  └──────────────────────────────────────┘

─────────────────────────────────────────────────────────────
EXAMPLE CALCULATION (Chain Link 6ft, 100 linear feet)
─────────────────────────────────────────────────────────────

  Posts:        CEIL(100/10)+1 = 11 posts
  Mesh Rolls:   CEIL(100/50)   = 2 rolls   × $129.99 = $259.98
  Line Posts:   11 each                    × $15.99  = $175.89
  Top Rail:     CEIL(100/21)   = 5 each    × $18.49  = $92.45
  Tension Wire: CEIL(100/200)  = 1 roll    × $24.99  = $24.99
  Brace Bands:  11×2 = 22 each            × $0.89   = $19.58
  Concrete:     11×2 = 22 bags            × $6.49   = $142.78
  ─────────────────────────────────────────────────────────
  Materials Subtotal:                                = $715.67
  Labor: 100ft × $12.00/ft                          = $1,200.00
  Markup: ($715.67 + $1,200) × 20%                  = $383.13
  ─────────────────────────────────────────────────────────
  GRAND TOTAL:                                       = $2,298.80
```
