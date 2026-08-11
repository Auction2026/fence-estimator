# WIRE GRID 02 — DATA FLOW
## From Estimate Creation to Completion

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    DATA FLOW — ESTIMATE LIFECYCLE                        ║
╚══════════════════════════════════════════════════════════════════════════╝

USER STARTS NEW ESTIMATE
          │
          ▼
┌─────────────────────┐
│   Step 1: Customer  │  User enters: First Name, Last Name, Phone,
│   Information       │  Email, Service Address, City, State, ZIP
└──────────┬──────────┘
           │ validated by: validation.js
           ▼
┌─────────────────────┐
│   Step 2: Fence     │  User selects: Fence Type, Height, Color,
│   Specifications    │  Total Linear Footage, Number of Gates
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│   Step 3: Materials Calculation (calculations.js)               │
│                                                                  │
│  For chain_link fencing:                                         │
│  • Posts     = CEIL(linearFt / 10) + 1  (every 10 ft)          │
│  • Fabric    = linearFt (1 LF fabric per 1 LF fence)            │
│  • Top Rail  = linearFt / 21 × 21       (21ft sections)         │
│  • Gates     = numGates                  (walk or drive gate)    │
│  • Hardware  = posts × (brace bands + post caps)                 │
│  • Tension   = linearFt × 2             (top & bottom)           │
│                                                                  │
│  Material costs fetched from: API → materials table              │
│  Waste factor applied: +5% to all quantities                     │
└──────────┬──────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────┐
│   Step 4: Pricing Review                                         │
│                                                                  │
│  Material Cost   = SUM(qty × unit_cost)                         │
│  Labor Cost      = linearFt × $8.50/ft + gates × $75            │
│  Equipment Cost  = (optional, manual entry)                      │
│  Permit Cost     = (optional, manual entry)                      │
│  Subtotal        = Materials + Labor + Equipment + Permits       │
│  Discount        = Subtotal × discount_pct%                     │
│  Tax             = (Subtotal - Discount) × 8.75%                │
│  TOTAL           = Subtotal - Discount + Tax                     │
└──────────┬──────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────┐
│   Step 5: Save &    │  POST /api/estimates → Database
│   Generate PDF      │  Estimate number auto-assigned: EST-2026-XXXX
└──────────┬──────────┘
           │
     ┌─────┴──────┐
     │            │
     ▼            ▼
┌─────────┐  ┌──────────────┐
│  EMAIL  │  │  PRINT / PDF  │
│ TO CUST │  │  ESTIMATE     │
└─────────┘  └──────────────┘
```
