# WIRE GRID 5: TAB DEPENDENCIES

```
╔═══════════════════════════════════════════════════════╗
║     TAB DEPENDENCIES & DATA RELATIONSHIPS             ║
╚═══════════════════════════════════════════════════════╝

Core Data Producers:
  [2] NEW ESTIMATE ──────────────────────────────────────────┐
      Creates: estimates[], projects[]                       │
                                                             │
  [6] INVENTORY ─────────────────────────────────────────────┤
      Creates: inventory[]                                   │
                                                             │
  [4] MATERIALS ─────────────────────────────────────────────┤
      Creates: state.materials[]                             │
                                                             │
  [5] PRICING ───────────────────────────────────────────────┤
      Creates: state.pricingSettings{}                       │
                                                             ▼
Core Data Consumers:                                    state{}
  [1] DASHBOARD ─── reads estimates[] → stats             (localStorage)
  [3] PROJECTS ──── reads/updates estimates[] → grid      │
  [8] CONTRACTS ─── reads estimates[status=signed]        │
  [9] CHANGE ORDERS reads estimates[] → project dropdown  │
  [10] SIGN-OFF ─── reads estimates[] → sign dropdown     │
  [14] ANALYTICS ── reads estimates[] → charts            │
  [15] REPORTS ──── reads estimates[] → print views       │

Tool Tabs (independent):
  [12] MAP TOOL    ── no state dependency (Google Maps embed)
  [13] DRAWING     ── no state dependency (canvas only)

Config Tabs:
  [17] SETTINGS ───── writes apiUrl, companySettings
       └── affects ALL tabs (via API connection)

Crew Tab:
  [16] CREW ─────── reads/writes state.crew[]
       └── used in [2] NEW ESTIMATE labor section

Supplier Tab:
  [7] SUPPLIERS ─── reads/writes state.suppliers[]
       └── referenced in [6] INVENTORY preferred_supplier

Notes Tab:
  [11] NOTES ─────── reads/writes notes[]
       └── can reference any project_id

DEPENDENCY MATRIX:
  Tab       | Needs Estimate | Needs Inventory | Needs Settings
  ─────────────────────────────────────────────────────────────
  Dashboard |      ✓         |                 |
  Projects  |      ✓         |                 |
  Materials |                |        ✓        |
  Pricing   |                |                 |      ✓
  Inventory |                |        ✓        |
  Suppliers |                |        ✓        |
  Contracts |      ✓         |                 |
  ChangeOrdr|      ✓         |                 |
  Sign-Off  |      ✓         |                 |
  Notes     |      ✓         |                 |
  Analytics |      ✓         |                 |
  Reports   |      ✓         |        ✓        |
  Crew      |                |                 |
  Settings  |                |                 |      ✓
```
