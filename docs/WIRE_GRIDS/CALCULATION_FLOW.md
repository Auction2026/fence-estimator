# CALCULATION FLOW
## Fence Depot Fence Estimator - How Estimates are Calculated

```
═══════════════════════════════════════════════════════════════════════════
                     CALCULATION FLOW DIAGRAM v1.0
═══════════════════════════════════════════════════════════════════════════

INPUTS (from Tab 3: Fence Specifications)
  │
  │  fenceType: "chain-link"
  │  height: 6         (feet)
  │  gauge: "11.5"     (wire gauge)
  │  linearFeet: 200   (total fence run)
  │  gates: 2          (number of gates)
  │  gateSizes: ["4ft", "4ft"]
  │  terrain: "flat"
  │
  ▼
╔═════════════════════════════════════════════════════════════════════════╗
║              MATERIAL QUANTITY CALCULATIONS (calculations.js)           ║
╚═════════════════════════════════════════════════════════════════════════╝
  │
  ├── FABRIC CALCULATION
  │   Formula:  linearFeet ÷ 50 = rolls needed (round up)
  │   Example:  200 ÷ 50 = 4 rolls of 6ft × 50ft chain link
  │   Gate adj: Subtract gate widths from fabric needed
  │   Result:   4 rolls
  │
  ├── LINE POSTS CALCULATION
  │   Formula:  (linearFeet ÷ 10) - 1 = line posts (subtract terminals)
  │   Example:  (200 ÷ 10) - 1 = 19 line posts
  │   Gate adj: Posts at gate locations are terminal posts
  │   Result:   19 line posts, 6ft height
  │
  ├── TERMINAL POSTS CALCULATION
  │   Formula:  corners + ends + (gates × 2) = terminal posts
  │   Example:  2 corners + 2 ends + (2 gates × 2) = 8 terminal posts
  │   Sizes:    End post = height + 2ft, Corner post = height + 2ft
  │   Result:   8 terminal posts, 8ft height
  │
  ├── TOP RAIL CALCULATION
  │   Formula:  linearFeet ÷ 21 = rails needed (round up)
  │   Example:  200 ÷ 21 = 9.5 → 10 top rails
  │   Gate adj: Gates do not need top rail
  │   Result:   10 rails × 21ft
  │
  ├── TENSION WIRE CALCULATION
  │   Formula:  (linearFeet × 2 strands) ÷ 1000 = rolls (1000ft/roll)
  │   Example:  (200 × 2) ÷ 1000 = 0.4 → 1 roll
  │   Result:   1 roll tension wire
  │
  ├── HARDWARE CALCULATION
  │   Brace Bands:     terminal posts × 2 per post = qty
  │   Tension Bands:   terminal posts × height (1 per ft) = qty
  │   Rail Ends:       terminal posts × 2 per post = qty
  │   Loop Caps:       line posts × 1 each = qty
  │   Dome Caps:       terminal posts × 1 each = qty
  │
  ├── TIE WIRE / HOG RINGS
  │   Formula:  linearFeet × 2 = tie wire segments needed
  │   Packaged:  250 per box → boxes needed = ceil(qty ÷ 250)
  │
  └── CONCRETE CALCULATION
      Formula:  total posts × 2 bags per post = bags needed
      Example:  (19 + 8) × 2 = 54 bags of 80lb concrete

  │
  ▼
╔═════════════════════════════════════════════════════════════════════════╗
║              PRICE LOOKUP (from Inventory Database - Tab 16)           ║
╚═════════════════════════════════════════════════════════════════════════╝
  │
  │  For each material item:
  │  1. Find matching product in inventory by category + specs
  │  2. Get unit price
  │  3. Calculate: quantity × unit_price = item_total
  │
  │  EXAMPLE:
  │  Item:           6ft × 50ft Chain Link Fabric (11.5ga, galvanized)
  │  Inventory SKU:  CL-6-11.5GA
  │  Unit Price:     $85.00/roll
  │  Quantity:       4 rolls
  │  Item Total:     4 × $85.00 = $340.00
  │
  ▼
╔═════════════════════════════════════════════════════════════════════════╗
║              COST SUMMATION (calculations.js - calculateTotal)         ║
╚═════════════════════════════════════════════════════════════════════════╝
  │
  │  MATERIALS SUBTOTAL = Sum of all material item totals
  │
  │  LABOR CALCULATION (Tab 5 inputs):
  │  laborTotal = crewSize × hoursEstimated × hourlyRate
  │  + additionalLaborItems
  │
  │  EQUIPMENT CALCULATION (Tab 6 inputs):
  │  equipmentTotal = Sum of all equipment line items
  │
  │  JOB SUBTOTAL = materials + labor + equipment
  │
  ▼
╔═════════════════════════════════════════════════════════════════════════╗
║              PRICING ADJUSTMENTS (Tab 7 - Pricing)                     ║
╚═════════════════════════════════════════════════════════════════════════╝
  │
  │  MARKUP APPLICATION:
  │  markedUpMaterials = materialsSubtotal × (1 + markupPercent/100)
  │
  │  OVERHEAD APPLICATION:
  │  overhead = jobSubtotal × overheadPercent/100
  │
  │  DISCOUNT APPLICATION (if any):
  │  discountAmount = jobSubtotal × discountPercent/100
  │  discountedTotal = jobSubtotal - discountAmount
  │
  │  ADJUSTED SUBTOTAL = markedUpMaterials + labor + equipment + overhead - discount
  │
  ▼
╔═════════════════════════════════════════════════════════════════════════╗
║              TAX CALCULATION (calculations.js - calculateTax)          ║
╚═════════════════════════════════════════════════════════════════════════╝
  │
  │  TAX RATE:   From Tab 7 (e.g., 8.5%)
  │  TAX AMOUNT: adjustedSubtotal × (taxRate / 100)
  │  Example:    $3,500 × 0.085 = $297.50
  │
  ▼
╔═════════════════════════════════════════════════════════════════════════╗
║              FINAL TOTAL                                               ║
╚═════════════════════════════════════════════════════════════════════════╝
  │
  │  FINAL TOTAL = adjustedSubtotal + taxAmount
  │
  │  EXAMPLE COMPLETE ESTIMATE:
  │  ┌─────────────────────────────────────────────┐
  │  │ Materials (marked up):         $2,650.00    │
  │  │ Labor (3 crew × 16hrs × $45):  $2,160.00   │
  │  │ Equipment:                       $350.00    │
  │  │ Overhead (10%):                  $516.00    │
  │  │ Discount:                         $0.00     │
  │  │ ─────────────────────────────────────────── │
  │  │ Subtotal:                      $5,676.00    │
  │  │ Tax (8.5%):                      $482.46    │
  │  │ ─────────────────────────────────────────── │
  │  │ TOTAL:                         $6,158.46    │
  │  └─────────────────────────────────────────────┘
  │
  ▼
ESTIMATE COMPLETE → Save to database → Print/Email to customer

═══════════════════════════════════════════════════════════════════════════
                    CALCULATION ACCURACY NOTES
═══════════════════════════════════════════════════════════════════════════

• All quantities are ROUNDED UP (never round down on materials)
• Add 5-10% waste factor is recommended for fabric and tie wire
• Terrain adjustments: slopes may need 10-15% more posts
• The system calculates minimums - estimator should review and adjust
• Gate hardware must be added manually in the materials list

═══════════════════════════════════════════════════════════════════════════
```
