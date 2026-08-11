
# Tab Dependencies

```text
[1] Project Info
   ├── feeds customer identity to [8] Estimate, [9] Contract, [13] Sign-Off
   └── feeds location data to [6] Permits, [7] Utilities, [17] Mapping

[2] Fence Specs
   ├── required by [8] Estimate
   ├── referenced by [9] Contract
   └── influences [11] Crew planning

[3] Layout
   └── required by [8] Estimate for footage and segment totals

[4] Installation
   └── required by [8] Estimate for labor/equipment assumptions

[5] Drawings
   └── referenced by [9] Contract and [13] Sign-Off

[6] Permits
   └── optional cost input to [8] Estimate and compliance input to [11]/[13]

[7] Utilities
   └── optional cost/risk input to [8] Estimate and execution input to [11]

[8] Estimate
   ├── depends on [2] Fence Specs
   ├── depends on [3] Layout
   ├── depends on [4] Installation
   ├── may include [6] Permit cost and [7] Utility cost
   └── depends on [16] Catalog pricing

[9] Contract
   └── depends on [8] Estimate being approved and price-locked

[10] Extras
   └── may add optional line items before finalizing [8] or [9]

[11] Crew
   └── depends on [2], [3], [4], and contracted scope from [9]

[12] Change Orders
   └── depends on locked scope in [9] and current project state

[13] Sign-Off
   └── depends on [9] Contract and completed field execution

[14] Notes
   └── supports every tab with reusable or project-specific context

[15] Admin
   └── governs user permissions affecting access to all tabs

[16] Catalog
   └── supplies material and pricing data to [8] Estimate and [10] Extras

[17] Mapping
   └── depends on address data from [1] Project Info
```
