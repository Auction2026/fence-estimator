# CALCULATION FLOW
## Fence Depot Estimator — How Estimates Are Calculated

```
═══════════════════════════════════════════════════════════════
                CHAIN LINK FENCE CALCULATION EXAMPLE
                Linear Footage: 200ft | Height: 6ft
═══════════════════════════════════════════════════════════════

INPUT:
  fence_type = "chain-link-9g-galv"
  height     = 6        (feet)
  linear_ft  = 200      (feet)
  post_spacing = 10     (feet)
  gate_count = 1        (4ft walk gate)
  barbed_wire = false
  top_rail    = true
  privacy_slats = false

──────────────────────────────────────────────────────────────

STEP 1 — FABRIC CALCULATION
──────────────────────────────────────────────────────────────
  Roll length = 50ft
  Rolls needed = CEILING(linear_ft / 50)
               = CEILING(200 / 50)
               = 4 rolls

  PLU lookup:  CL-9G-6H-50  → $87.00 each
  Fabric cost: 4 × $87.00 = $348.00

──────────────────────────────────────────────────────────────

STEP 2 — POST CALCULATION
──────────────────────────────────────────────────────────────
  Post type:
    Line posts  → every 10ft
    End/Corner  → at every start, end, corner (estimate 4)
    Gate posts  → 2 per gate (larger diameter)

  Line posts  = FLOOR(linear_ft / post_spacing) - gate_count
              = FLOOR(200 / 10) - 1 = 19 line posts

  Gate posts  = gate_count × 2 = 2 gate posts (2-3/8" dia)

  Line post embed = height × 0.33 = 6 × 0.33 = ~2ft embed
  Line post length = height + embed = 6 + 2 = 8ft
    → PLU: CL-LP-178-8 → $21.00 each

  Terminal/End posts = 4 (estimate for corners + ends)
    → PLU: CL-TP-238-8 → $36.00 each

  Gate posts (2-3/8"): 2 × $36.00

  Post cost:
    19 × $21.00 = $399.00  (line)
     4 × $36.00 = $144.00  (terminal)
     2 × $36.00 = $72.00   (gate)
  Total posts = $615.00

──────────────────────────────────────────────────────────────

STEP 3 — TOP RAIL CALCULATION
──────────────────────────────────────────────────────────────
  Rail sections = 21ft each
  Rails needed  = CEILING(linear_ft / 21)
                = CEILING(200 / 21) = 10 rails

  PLU: CL-TR-178-21 → $25.50 each
  Rail cost: 10 × $25.50 = $255.00

──────────────────────────────────────────────────────────────

STEP 4 — TENSION WIRE (bottom)
──────────────────────────────────────────────────────────────
  Tension wire coil = 1000ft
  Coils needed = CEILING(linear_ft / 1000)
               = 1 coil

  PLU: CL-TW-9G-1000 → $63.00 each
  Tension wire = $63.00

──────────────────────────────────────────────────────────────

STEP 5 — CONCRETE CALCULATION
──────────────────────────────────────────────────────────────
  Total posts = 19 + 4 + 2 = 25 posts
  Bags per post = 2 (80lb bags)
  Total bags = 25 × 2 = 50 bags

  PLU: CON-QUICKCRETE-80 → $16.50 each
  Concrete cost: 50 × $16.50 = $825.00

──────────────────────────────────────────────────────────────

STEP 6 — HARDWARE / FITTINGS
──────────────────────────────────────────────────────────────
  Brace bands (per terminal post × 2 bands):  4×2 = 8 @ $0.95 = $7.60
  Tension bands (per terminal × 3):          4×3 = 12 @ $1.05 = $12.60
  Tension bars (per terminal end):           4 × $3.35 = $13.40
  Post caps (all line posts):                19 × $1.10 = $20.90
  Loop caps (top rail ends):                 8 × $1.30 = $10.40
  Rail couplings:                            10 × $2.20 = $22.00
  Tie wires (1 box per 50ft):               4 × $9.00 = $36.00
  Hardware total:                            $122.90

──────────────────────────────────────────────────────────────

STEP 7 — GATE
──────────────────────────────────────────────────────────────
  PLU: CL-SWG-6-4 (4ft × 6ft walk gate) → $165.00
  Gate hardware: fork latch + hinges      → $47.00
  Gate subtotal: $212.00

──────────────────────────────────────────────────────────────

STEP 8 — LABOR
──────────────────────────────────────────────────────────────
  Install labor: 200 LF × $12.00/LF = $2,400.00
  Gate install:  1 gate × $125.00   = $125.00
  Labor total:   $2,525.00

──────────────────────────────────────────────────────────────

STEP 9 — SUMMARY
──────────────────────────────────────────────────────────────
  Material Cost:
    Fabric:        $  348.00
    Posts:         $  615.00
    Top Rail:      $  255.00
    Tension Wire:  $   63.00
    Concrete:      $  825.00
    Hardware:      $  122.90
    Gate:          $  212.00
    ─────────────────────────
    Materials:     $2,440.90

  Labor:           $2,525.00

  ─────────────────────────
  Subtotal:        $4,965.90
  Markup (35%):    $1,738.07
  ─────────────────────────
  Pre-tax Total:   $6,703.97
  Tax (8.75%):     $  586.60
  ═════════════════════════
  CUSTOMER TOTAL:  $7,290.57

  Per Linear Foot: $7,290.57 / 200 = $36.45/LF
```
