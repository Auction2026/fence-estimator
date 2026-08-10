# WIRE GRID 6 – CALCULATION FLOW DIAGRAM
## How the Materials and Cost Calculations Work Step-by-Step

---

```
╔══════════════════════════════════════════════════════════════════╗
║         FENCE ESTIMATOR – CALCULATION FLOW DIAGRAM              ║
╚══════════════════════════════════════════════════════════════════╝

INPUTS (from Tabs 2 & 3):
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Fence Type   │  │  Height      │  │   Footage    │  │  Post Space  │
│ Chain Link   │  │  6 feet      │  │  200 feet    │  │  10 feet     │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
        │                │                 │                  │
        └────────────────┴─────────────────┴──────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              MATERIALS CALCULATION ENGINE                        │
│              (materials-calc.js)                                │
│                                                                 │
│  STEP 1: FABRIC                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Rolls Needed = ceil( Footage × 1.05 ÷ 50 )               │ │
│  │ = ceil( 200 × 1.05 ÷ 50 )                                │ │
│  │ = ceil( 210 ÷ 50 )                                       │ │
│  │ = ceil( 4.2 ) = 5 rolls                                  │ │
│  │ SKU: CL-FABRIC-6-11-GAL @ $56.00 × 5 = $280.00           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  STEP 2: LINE POSTS                                             │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Line Posts = ceil( Footage ÷ PostSpacing ) - 1           │ │
│  │ = ceil( 200 ÷ 10 ) - 1                                   │ │
│  │ = 20 - 1 = 19 posts                                      │ │
│  │ SKU: POST-LINE-1.66-GAL @ $11.50 × 19 = $218.50         │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  STEP 3: TERMINAL POSTS (corners + ends)                        │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Terminal Posts = 6 (4 corners + 2 end posts standard)    │ │
│  │ SKU: POST-TERM-2.5-GAL @ $18.50 × 6 = $111.00           │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  STEP 4: TOP RAIL                                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Rail Sticks = ceil( Footage ÷ 21 ) + 1                   │ │
│  │ = ceil( 200 ÷ 21 ) + 1                                   │ │
│  │ = 10 + 1 = 11 sticks (21ft each)                        │ │
│  │ SKU: RAIL-TOP-1.66-GAL @ $16.50 × 11 = $181.50          │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  STEP 5: TENSION WIRE                                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Runs = 2 (for 6ft fence: bottom + mid)                   │ │
│  │ Rolls = ceil( Footage × Runs ÷ 1000 ) + 1               │ │
│  │ = ceil( 200 × 2 ÷ 1000 ) + 1 = 1 + 1 = 2 rolls         │ │
│  │ SKU: WIRE-TENSION-GAL @ $38.00 × 2 = $76.00             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  STEP 6: CONCRETE                                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Total Posts = LinePosts + TermPosts = 19 + 6 = 25        │ │
│  │ Bags = TotalPosts × 2 = 25 × 2 = 50 bags                │ │
│  │ SKU: CONCRETE-80 @ $6.25 × 50 = $312.50                 │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  STEP 7: HARDWARE (caps, bands, clips, tie wire)                │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Line Post Caps:   19 each  @ $0.85   =  $16.15           │ │
│  │ Terminal Caps:     6 each  @ $1.10   =   $6.60           │ │
│  │ Tension Bands:  2 bags(10) @ $5.50   =  $11.00           │ │
│  │ Brace Bands:    4 bags(10) @ $4.25   =  $17.00           │ │
│  │ Rail Ends:      2 bags(10) @ $6.00   =  $12.00           │ │
│  │ Tie Wire:       8 bags    @ $7.50   =  $60.00            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TOTALS CALCULATION                            │
│                                                                 │
│  All materials line totals added up:                            │
│  Materials Subtotal      = $1,302.25                           │
│  Material Markup (20%)   = $  260.45                           │
│  ─────────────────────────────────                             │
│  Materials Total         = $1,562.70                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LABOR CALCULATION (Tab 5)                     │
│                                                                 │
│  Crew Size × Rate × Hours × Markup                             │
│  2 workers × $25/hr × 16 hrs × 1.0 = $800.00                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EQUIPMENT CALCULATION (Tab 6)                 │
│                                                                 │
│  Post Hole Digger: 2 days × $150/day = $300.00                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              ESTIMATE SUMMARY CALCULATION (Tab 7)               │
│                                                                 │
│  Materials:         $1,562.70                                  │
│  Labor:             $  800.00                                  │
│  Equipment:         $  300.00                                  │
│                    ──────────                                  │
│  Subtotal:          $2,662.70                                  │
│  Tax (8.25%):       $  219.67                                  │
│                    ──────────                                  │
│  ESTIMATE TOTAL:    $2,882.37                                  │
│                                                                 │
│  Profit (15%):      $  432.36                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📖 FORMULAS USED

| Calculation | Formula |
|-------------|---------|
| Fabric rolls | `ceil(footage × 1.05 ÷ 50)` |
| Line posts | `ceil(footage ÷ postSpacing) - 1` |
| Terminal posts | `6` (standard: 4 corners + 2 ends) |
| Top rail sticks | `ceil(footage ÷ 21) + 1` |
| Tension wire rolls | `ceil(footage × runs ÷ 1000) + 1` |
| Concrete bags | `(linePosts + termPosts) × 2` |
| Labor total | `crewSize × hourlyRate × hours` |
| With markup | `base × (1 + markupPct ÷ 100)` |
| Tax | `subtotal × taxRate ÷ 100` |
| Grand total | `subtotal + tax` |
| Profit | `grandTotal × profitMarginPct ÷ 100` |
