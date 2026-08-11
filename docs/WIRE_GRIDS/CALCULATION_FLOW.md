# DIAGRAM 6: CALCULATION FLOW
## Fence Depot Fence Estimator — Materials Calculation Engine

```
═══════════════════════════════════════════════════════════════════════
                   CALCULATION FLOW DIAGRAM
               How Materials & Costs Are Calculated
═══════════════════════════════════════════════════════════════════════

INPUT VALUES
─────────────────────────────
  • fenceType    (Chain Link / Wood / Vinyl / Aluminum)
  • height       (4ft / 5ft / 6ft / 8ft)
  • linearFeet   (total run, e.g., 200 ft)
  • postSpacing  (10ft chain link / 8ft wood default)
  • numberGates  (count of gate openings)
  • installType  (Residential / Commercial)
  • options      (barbed wire, privacy slats, remove old)
         │
         ▼
  ┌──────────────────────────────────────────────────────────┐
  │          calculateAndRenderMaterials()                   │
  └──────────────────────────────────────────────────────────┘
         │
         ├──── 1. POST COUNT CALCULATION
         │     ─────────────────────────
         │     totalPosts = Math.ceil(linearFeet / postSpacing) + 1
         │     terminalPosts = 2 + (gateCount * 2)  [corners+gates]
         │     linePosts = totalPosts - terminalPosts
         │
         ├──── 2. FABRIC / PANEL CALCULATION
         │     ─────────────────────────────
         │     [Chain Link]
         │       rollsNeeded = Math.ceil(linearFeet / 50)
         │       fabric = findMesh(height)  ← INVENTORY_DB lookup
         │       ▼ returns PLU code + price for matching roll
         │
         │     [Wood]
         │       picketsNeeded = Math.ceil(linearFeet * 12 / 6)
         │       ▼ (one 6" picket per 6 inches of run)
         │
         │     [Vinyl]
         │       panelsNeeded = Math.ceil(linearFeet / 8)
         │       ▼ (one 8ft panel per 8 linear feet)
         │
         ├──── 3. TOP RAIL CALCULATION (Chain Link)
         │     ────────────────────────────────────
         │     railsNeeded = Math.ceil(linearFeet / 21)
         │     ▼ (21ft rail sections)
         │
         ├──── 4. TENSION WIRE
         │     ──────────────
         │     rolls = findTensionWire(linearFeet)
         │     ▼ 1 roll per 100 linear feet
         │
         ├──── 5. HARDWARE / FITTINGS
         │     ────────────────────────
         │     braceBands = findBraceBand(postDiameter)
         │     ▼ 2 per line post, 3 per terminal post
         │     railEnds = totalPosts * 2
         │     postCaps = totalPosts
         │     tensionBands = terminalPosts * (height + 1)
         │     carriage bolts = (tensionBands + brace bands) count
         │
         ├──── 6. CONCRETE
         │     ──────────
         │     bagsPerPost = 2  (for residential)
         │     totalBags = totalPosts * bagsPerPost
         │
         ├──── 7. GATES (if any)
         │     ────────────────
         │     For each gate:
         │       gateUnit = lookup gate by size (36"/42"/48"/60")
         │       gatePosts = 2 (already in terminal post count)
         │       gateHinges = 1 pair
         │       gateLatch = 1
         │
         ├──── 8. OPTIONAL EXTRAS
         │     ─────────────────
         │     [Barbed Wire]
         │       barbedWireRolls = Math.ceil(linearFeet / 1320)
         │       extensionArms = totalPosts
         │
         │     [Privacy Slats]
         │       slatRolls = Math.ceil(linearFeet / 50)
         │
         │     [Removal]
         │       removalLF = linearFeet (add labor line item)
         │
         └──── 9. PRICE EACH LINE ITEM
               ─────────────────────────
               for each material:
                 price = invByPlu(plu).sell_price
                 lineTotal = quantity * price
               materialSubtotal = SUM(all lineTotals)

COST ASSEMBLY
─────────────────────────────
  materialCost    = SUM(all line items)
  laborHours      = linearFeet / laborFactor[fenceType]
                    (Chain Link: 10ft/hr, Wood: 8ft/hr, Vinyl: 9ft/hr)
  laborCost       = laborHours * laborRate  (default $65/hr)
  equipmentCost   = 0 (add manually if auger/machine used)
  disposalCost    = 0 (add if removing old fence)
  subtotal        = materialCost + laborCost + equipmentCost + disposalCost
  markupAmount    = subtotal * (markupPercent / 100)  (default 20%)
  taxableAmount   = subtotal + markupAmount
  taxAmount       = taxableAmount * (taxPercent / 100) (default 5% GST)
  TOTAL           = taxableAmount + taxAmount
  depositRequired = TOTAL * 0.50  (50% deposit)

RENDERED OUTPUT
────────────────────────────────────────────────────────────────────
  ┌──────────────────────────────────────────────────────────────┐
  │  MATERIALS LIST TABLE                                         │
  │  Qty │ PLU          │ Description           │ Unit  │ Total  │
  │  ─── │ ──────────── │ ───────────────────── │ ───── │ ────── │
  │    2 │ CL-F-0348-50 │ Chain Link Fabric 48" │ $89.00│$178.00 │
  │   14 │ CL-PL-163-06 │ Line Post 1-5/8" 6ft  │ $11.00│$154.00 │
  │    4 │ CL-PT-238-08 │ Terminal Post 2-3/8"  │ $29.00│$116.00 │
  │    7 │ CL-TR-138-21 │ Top Rail 1-3/8" 21ft  │ $18.00│$126.00 │
  │   28 │ CL-HW-BB-163 │ Brace Bands 1-5/8"    │  $0.59│ $16.52 │
  │    3 │ CON-QT-80    │ Concrete 80lb bag      │  $8.45│ $25.35 │
  │  ... │ ...          │ ...                    │   ... │    ... │
  ├──────────────────────────────────────────────────────────────┤
  │                              Materials Subtotal: $ XXXX.XX   │
  │                              Labor (X hrs @ $65): $ XXXX.XX  │
  │                              Subtotal:            $ XXXX.XX  │
  │                              Markup (20%):        $  XXX.XX  │
  │                              GST (5%):            $  XXX.XX  │
  │                              TOTAL:               $ XXXX.XX  │
  │                              50% Deposit:         $ XXXX.XX  │
  └──────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════
```
