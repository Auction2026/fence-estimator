# WIRE GRID 6: CALCULATION FLOW

```
╔═══════════════════════════════════════════════════════╗
║          ESTIMATE COST CALCULATION ENGINE             ║
╚═══════════════════════════════════════════════════════╝

INPUTS:
  ┌────────────────────────────────────────────────────┐
  │  fenceType:    chain-link / wood-privacy / vinyl / …│
  │  fenceHeight:  3 / 4 / 5 / 6 / 8 / 10 / 12 ft     │
  │  fenceFootage: [user-entered linear feet]           │
  │  numGates:     [user-entered count]                 │
  │  terrain:      flat / slight_slope / steep_slope    │
  │  crewSize:     2 / 3 / 4 persons                   │
  │  estimatedDays:[user-entered]                       │
  │  laborRate:    [$/hr per person]                    │
  │  hoursPerDay:  [hours per work day]                 │
  └────────────────────────────────────────────────────┘
             │
             ▼
  ┌────────────────────────────────────────────────────┐
  │         FENCE_PRICING LOOKUP TABLE                  │
  │  FENCE_PRICING[fenceType] → { material, labor }    │
  │                                                     │
  │  chain-link:   material=$4.50/ft  labor=$3.25/ft   │
  │  wood-privacy: material=$8.00/ft  labor=$5.00/ft   │
  │  vinyl:        material=$12.00/ft labor=$4.50/ft   │
  │  ornamental:   material=$18.00/ft labor=$7.00/ft   │
  │  … etc                                             │
  └────────────────────────────────────────────────────┘
             │
             ▼
  MATERIALS CALCULATION:
  ┌────────────────────────────────────────────────────┐
  │  posts    = CEIL(footage / 10) + 1                 │
  │  panels   = CEIL(footage / 8)                      │
  │  matCost  = footage × price.material               │
  │  gateCost = numGates × $120                        │
  │  miscCost = footage × $0.35                        │
  │  ─────────────────────────────────────────────     │
  │  MATERIALS SUBTOTAL = matCost + gateCost + misc    │
  └────────────────────────────────────────────────────┘
             │
             ▼
  LABOR CALCULATION:
  ┌────────────────────────────────────────────────────┐
  │  totalHours = crewSize × estimatedDays × hoursPerDay│
  │  laborCost  = totalHours × laborRate               │
  └────────────────────────────────────────────────────┘
             │
             ▼
  PRICING & MARKUP:
  ┌────────────────────────────────────────────────────┐
  │  subtotal  = matCost + gateCost + misc + laborCost │
  │  markup    = subtotal × markupPct (default 35%)    │
  │  taxAmount = (subtotal + markup) × taxRate (8.25%) │
  │  discount  = [user-applied discount]               │
  │  ─────────────────────────────────────────────     │
  │  TOTAL = subtotal + markup + taxAmount - discount  │
  └────────────────────────────────────────────────────┘
             │
             ▼
  OUTPUT: Estimate record with
    { materials_cost, labor_cost, overhead_cost,
      tax_amount, discount_amount, subtotal, total_amount }
```
