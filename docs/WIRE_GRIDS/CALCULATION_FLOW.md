# CALCULATION FLOW DIAGRAM
**Fence Estimator Pro** – How Estimates Are Calculated

```
INPUT (from Tab 2: Fence Specifications)
│
├── fenceType    (chain-link, wood, vinyl, etc.)
├── height       (4, 5, 6, 8, 10, 12 ft)
├── linearFeet   (total linear footage)
├── numberPosts  (or auto-calculated)
├── numberGates  (quantity)
├── gateType     (walk-single, drive-double, etc.)
├── barbedWire   (boolean)
├── privacySlats (boolean)
├── tensionWire  (boolean)
├── soilType     (normal, clay, rocky, frozen)
└── installationType (residential, commercial, industrial)
                    │
                    ▼
        ┌───────────────────────┐
        │   MATERIAL COST       │
        │                       │
        │ fenceMaterial =       │
        │  LF × rate × height   │
        │  multiplier           │
        │                       │
        │ postMaterial =        │
        │  posts × post_cost    │
        │                       │
        │ concreteCost =        │
        │  posts × $12.50       │
        │                       │
        │ gateCost =            │
        │  gates × gate_price   │
        │                       │
        │ + optional addons     │
        └──────────┬────────────┘
                   │
        ┌──────────▼────────────┐
        │   LABOUR COST         │
        │                       │
        │ hours = LF ×          │
        │  (labourRate/hr)      │
        │  × soilMultiplier     │
        │  × installMultiplier  │
        │                       │
        │ labourCost =          │
        │  hours × $65/hr       │
        └──────────┬────────────┘
                   │
        ┌──────────▼────────────┐
        │   EQUIPMENT COST      │
        │                       │
        │ days = hours ÷ 8      │
        │                       │
        │ equipCost =           │
        │  days × $350/day      │
        └──────────┬────────────┘
                   │
        ┌──────────▼────────────┐
        │   ADJUSTMENTS         │
        │                       │
        │ + permitCost          │
        │ + contingency %       │
        │ - discount $          │
        └──────────┬────────────┘
                   │
        ┌──────────▼────────────┐
        │   TAX                 │
        │                       │
        │ subtotal = all above  │
        │ tax = subtotal × 13%  │
        │ TOTAL = subtotal + tax│
        └──────────┬────────────┘
                   │
OUTPUT ◄───────────┘

Line Items displayed in Tab 8 Estimate table
TOTAL locked into Contract (Tab 9)
```

## Key Rate Tables

### Material Rates (per linear foot)
| Fence Type | Material $/LF | Labour $/LF |
|-----------|--------------|------------|
| Chain Link | $8.50 | $5.00 |
| Wood | $14.00 | $7.50 |
| Vinyl | $18.00 | $6.00 |
| Wrought Iron | $28.00 | $9.00 |
| Aluminum | $22.00 | $7.00 |

### Height Multipliers (base = 6ft = 1.00)
| Height | Multiplier |
|--------|-----------|
| 4 ft | 0.75× |
| 6 ft | 1.00× |
| 8 ft | 1.30× |
| 10 ft | 1.55× |
