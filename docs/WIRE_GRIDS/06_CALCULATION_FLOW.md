# WIRE GRID 06 — CALCULATION FLOW
## Material Quantity & Pricing Engine

```
╔══════════════════════════════════════════════════════════════════════════╗
║               FENCE MATERIAL CALCULATION ENGINE FLOW                     ║
╚══════════════════════════════════════════════════════════════════════════╝

USER INPUT
═══════════
fence_type   = "chain_link"
height_ft    = 6
color        = "galvanized"
linear_ft    = 200
num_gates    = 2  (1 walk gate 4ft, 1 drive gate 16ft)
waste_pct    = 5%

                    │
                    ▼
┌───────────────────────────────────────────────────────────────┐
│              STEP 1: LOOKUP MATERIAL PRICES                    │
│                                                                │
│  SELECT * FROM materials                                       │
│  WHERE fence_type = 'chain_link'                              │
│  AND   height_ft  = 6                                         │
│  AND   is_active  = TRUE                                      │
│                                                                │
│  Result: 60+ matching SKUs with unit_cost, unit_price         │
└───────────────────┬───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────────────┐
│              STEP 2: CALCULATE QUANTITIES                      │
│                                                                │
│  FABRIC (mesh):                                                │
│    qty = linear_ft × 1.0 × (1 + waste_pct)                   │
│        = 200 × 1.0 × 1.05 = 210 LF                           │
│                                                                │
│  LINE POSTS (1-5/8" × 10ft tall):                             │
│    qty = CEIL(linear_ft / 10) + 1                             │
│        = CEIL(200/10) + 1 = 21 posts                          │
│                                                                │
│  TERMINAL POSTS (end/corner/gate):                            │
│    qty = 2 (ends) + corners + (gates × 2)                     │
│        = 2 + 0 + (2 × 2) = 6 terminal posts                  │
│                                                                │
│  TOP RAIL (1-5/8" × 21ft sections):                           │
│    qty = CEIL(linear_ft / 21)                                 │
│        = CEIL(200/21) = 10 rails                              │
│                                                                │
│  BRACE BANDS (10 per terminal post):                          │
│    qty = terminal_posts × 10 / 10 = 6 packs                  │
│                                                                │
│  TENSION WIRE (top + bottom):                                  │
│    qty = linear_ft × 2 = 400 LF                               │
│                                                                │
│  TENSION BAR (2 per terminal post):                           │
│    qty = terminal_posts × 2 = 12                              │
│                                                                │
│  TIE WIRE (100 pack):                                         │
│    qty = CEIL(linear_ft / 20) = 10 packs                      │
│                                                                │
│  POST CAPS: qty = line_posts = 21                             │
│  RAIL CUPS: qty = line_posts = 21                             │
└───────────────────┬───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────────────┐
│              STEP 3: GATE MATERIALS                            │
│                                                                │
│  Walk Gate 4ft × 6ft:                                         │
│    • SKU: CL-GATE-SGL-4-6 × 1 EA = $85.00 cost               │
│    • Hinges: 1 PR × $10.50                                    │
│    • Latch:  1 EA × $5.50                                     │
│                                                                │
│  Drive Gate 16ft × 6ft:                                       │
│    • SKU: CL-GATE-DBL-16-6 × 1 EA = $280.00 cost             │
│    • Hinges: 2 PR × $10.50                                    │
│    • Latch:  1 EA × $7.00 (pull latch)                        │
└───────────────────┬───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────────────┐
│              STEP 4: LABOR CALCULATION                         │
│                                                                │
│  Labor Rate  = $8.50 per linear foot                          │
│  Linear Feet = 200                                            │
│  Gate Labor  = $75.00 per gate × 2 = $150.00                 │
│                                                                │
│  Labor Total = (200 × $8.50) + $150.00                        │
│              = $1,700.00 + $150.00 = $1,850.00                │
└───────────────────┬───────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────────────────────┐
│              STEP 5: PRICE ROLLUP                              │
│                                                                │
│  Material Cost  = Σ (qty × unit_cost) per line item           │
│  Material Price = Σ (qty × unit_price) per line item          │
│  Labor Cost     = $1,850.00                                   │
│                                                                │
│  Subtotal       = Material Price + Labor Cost                 │
│  Discount (0%)  = $0.00                                       │
│  Tax (8.75%)    = Subtotal × 0.0875                           │
│  TOTAL          = Subtotal + Tax                              │
│                                                                │
│  Margin %       = ((Total - Material Cost - Labor) / Total)   │
│                 × 100                                          │
└───────────────────────────────────────────────────────────────┘
```
