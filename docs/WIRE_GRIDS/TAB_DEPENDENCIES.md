# DIAGRAM 5: TAB DEPENDENCIES
## Fence Depot Fence Estimator — 8-Tab Application Map

```
═══════════════════════════════════════════════════════════════════════
                    TAB DEPENDENCY DIAGRAM
                   (index.html Application)
═══════════════════════════════════════════════════════════════════════

NAVIGATION BAR
──────────────────────────────────────────────────────────────────────
  [📊 Dashboard] [📝 New Estimate] [📁 Projects] [📦 Inventory]
  [💰 Materials] [🏭 Suppliers]   [📈 Analytics] [⚙️ Settings]

TAB 1: DASHBOARD
─────────────────
  ┌──────────────────────────────────────────┐
  │  🎯 Today's Overview                     │
  │  • Estimates this week: 5                │
  │  • Active projects: 3                    │
  │  • Revenue pipeline: $24,500             │
  │                                          │
  │  📊 Recent Activity Feed                 │
  │  • EST-001 Sent to John Smith            │
  │  • Project #003 In Progress              │
  │                                          │
  │  ⚡ Quick Actions                         │
  │  • [+ New Estimate]  [+ New Customer]    │
  │  • [View Calendar]   [Reports]           │
  └──────────────────────────────────────────┘
       Feeds data TO: All other tabs
       Receives data FROM: All other tabs

TAB 2: NEW ESTIMATE ← MAIN FUNCTION
──────────────────────────────────────
  ┌──────────────────────────────────────────┐
  │  5-Step Wizard                           │
  │  Step 1 → Step 2 → Step 3 → Step 4 → 5  │
  │                                          │
  │  Dependencies:                           │
  │  • INVENTORY_DB (built-in 61 SKUs)       │
  │  • estimateState object                  │
  │  • localStorage (customer/sequence)      │
  │  • calculateAndRenderMaterials()         │
  │  • findMesh(), findTensionWire()         │
  │  • invByPlu() price lookup               │
  │                                          │
  │  Outputs TO:                             │
  │  • Projects Tab (when saved)             │
  │  • PDF (when generated)                  │
  │  • Email (when sent)                     │
  └──────────────────────────────────────────┘
       Reads FROM: Inventory Tab (product prices)
       Writes TO: Projects Tab, Analytics Tab

TAB 3: PROJECTS
─────────────────
  ┌──────────────────────────────────────────┐
  │  Project List                            │
  │  ┌──────────────────────────────┐        │
  │  │ #  │ Customer │ Status│ Total│        │
  │  │ 001│ J.Smith  │Active │$5,200│        │
  │  │ 002│ M.Jones  │ Done  │$3,800│        │
  │  └──────────────────────────────┘        │
  │                                          │
  │  Filters: [Status ▼] [Date ▼] [Search]   │
  │  Actions: [View] [Edit] [Change Order]   │
  └──────────────────────────────────────────┘
       Reads FROM: New Estimate (source data)
       Writes TO: Analytics Tab (revenue data)

TAB 4: INVENTORY
─────────────────
  ┌──────────────────────────────────────────┐
  │  Product Catalog (61+ SKUs)              │
  │  ┌──────────────────────────────┐        │
  │  │PLU     │Description   │Price │        │
  │  │CL-F-03 │Chain Link 4' │$89.00│        │
  │  │CL-PL-16│Line Post 6ft │$11.00│        │
  │  └──────────────────────────────┘        │
  │                                          │
  │  Departments:                            │
  │  • Chain Link      • Commercial Fitting  │
  │  • Wood Fence      • Vinyl Fence         │
  │  • Aluminum Fence  • Privacy Slat        │
  │  • Installation    • Labor               │
  │                                          │
  │  Actions: [Edit Price] [Add Product]     │
  │           [Import CSV] [Export]          │
  └──────────────────────────────────────────┘
       Reads FROM: database/seed.sql (initial load)
       Writes TO: New Estimate (price lookup)

TAB 5: MATERIALS & COSTS
─────────────────────────
  ┌──────────────────────────────────────────┐
  │  Cost Configuration                      │
  │                                          │
  │  Labor Rates:                            │
  │  • Standard:  $65/hr                     │
  │  • Overtime:  $97.50/hr                  │
  │  • Chain Link: 1hr/10ft                  │
  │  • Wood:       1hr/8ft                   │
  │                                          │
  │  Markup Settings:                        │
  │  • Default Markup: 20%                   │
  │  • Minimum Margin: 15%                   │
  │                                          │
  │  Tax Settings:                           │
  │  • GST Rate: 5%                          │
  │  • PST Rate: 0% (Alberta)                │
  └──────────────────────────────────────────┘
       Writes TO: New Estimate (default rates)
       Reads FROM: Settings Tab (config)

TAB 6: SUPPLIERS
─────────────────
  ┌──────────────────────────────────────────┐
  │  Supplier Directory                      │
  │  • Vendor Name & Contact                 │
  │  • Products Supplied                     │
  │  • Lead Times                            │
  │  • Pricing Tiers                         │
  │  • Order History                         │
  └──────────────────────────────────────────┘
       Reads FROM: Inventory Tab (products)
       Independent of estimate generation

TAB 7: ANALYTICS
─────────────────
  ┌──────────────────────────────────────────┐
  │  Business Reports                        │
  │  • Revenue by Month (chart)              │
  │  • Estimates vs Closed (ratio)           │
  │  • Top Fence Types (pie chart)           │
  │  • Average Estimate Value                │
  │  • Crew Productivity                     │
  └──────────────────────────────────────────┘
       Reads FROM: Projects Tab, Estimates data
       Writes TO: Dashboard (summary cards)

TAB 8: SETTINGS
─────────────────
  ┌──────────────────────────────────────────┐
  │  Application Configuration               │
  │  • Company Name & Logo                   │
  │  • Default Labor Rate                    │
  │  • Default Markup %                      │
  │  • Tax Rate                              │
  │  • Email Template                        │
  │  • User Management                       │
  │  • Backup / Export                       │
  └──────────────────────────────────────────┘
       Writes TO: All tabs (via shared config)

═══════════════════════════════════════════════════════════════════════
TAB DEPENDENCY MAP:
  Dashboard ◄──── All Tabs
  New Estimate ◄── Inventory, Materials, Settings
  Projects ◄────── New Estimate
  Inventory ◄───── Database seed, Settings
  Materials ◄───── Settings
  Suppliers ◄───── Inventory
  Analytics ◄───── Projects, Estimates
  Settings ──────► All Tabs
═══════════════════════════════════════════════════════════════════════
```
