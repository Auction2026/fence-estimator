# WIRE GRID 5 – TAB DEPENDENCIES
## Which Tabs Depend on Data from Other Tabs

```
╔══════════════════════════════════════════════════════════════════════╗
║                    TAB DEPENDENCIES MAP                             ║
╚══════════════════════════════════════════════════════════════════════╝

  INDEPENDENT TABS (no dependencies – can use any time)
  ┌─────────────────────────────────────────────────────┐
  │  DASHBOARD    MATERIALS    INVENTORY    SUPPLIERS   │
  │  ANALYTICS    SETTINGS     ADMIN        SITE MAP    │
  └─────────────────────────────────────────────────────┘
                                │
                                │ Provides price data to
                                ▼
  ┌─────────────────────────────────────────────────────┐
  │  NEW ESTIMATE                                       │
  │  (requires: fence type, footage, gate counts)       │
  │  Produces: ESTIMATE RECORD                          │
  └──────────────────────────┬──────────────────────────┘
                             │ Creates
                             ▼
  ┌─────────────────────────────────────────────────────┐
  │  PROJECTS                                           │
  │  (auto-created or manual from estimate)             │
  │  Produces: PROJECT RECORD                           │
  └──────────────────────────┬──────────────────────────┘
                             │ Required by
          ┌──────────────────┼──────────────────────┐
          │                  │                       │
          ▼                  ▼                       ▼
  ┌──────────────┐   ┌──────────────┐      ┌──────────────┐
  │  CONTRACTS   │   │  CHANGE      │      │  SIGN-OFF    │
  │  (needs:     │   │  ORDERS      │      │  (needs:     │
  │  estimate)   │   │  (needs:     │      │  project)    │
  └──────────────┘   │  project)    │      └──────────────┘
                     └──────────────┘

          ┌──────────────────┐
          │  NOTES           │
          │  (needs: project)│
          └──────────────────┘

          ┌──────────────────┐
          │  PHOTOS          │
          │  (needs: project)│
          └──────────────────┘

─────────────────────────────────────────────────────────────
DEPENDENCY RULES
─────────────────────────────────────────────────────────────

  ✅  You CAN:
      - Open any independent tab at any time
      - Create estimates without projects
      - View Materials/Inventory without any estimates

  ⚠️  You NEED:
      - At least 1 saved ESTIMATE to create a CONTRACT
      - At least 1 saved PROJECT to create CHANGE ORDERS
      - At least 1 saved PROJECT to create SIGN-OFF
      - At least 1 saved PROJECT to add NOTES / PHOTOS

  🔒  LOCKED:
      - Estimate items CANNOT change after price is locked
      - Use Change Order to capture scope changes

─────────────────────────────────────────────────────────────
RECOMMENDED ORDER (first use)
─────────────────────────────────────────────────────────────

  1. Admin → Set Company Name, Tax Rate
  2. Settings → Set Markup %, Labor Rate
  3. Inventory → Review/add products (optional)
  4. New Estimate → Create first estimate
  5. Contracts → Generate from estimate
  6. Projects → Track work in progress
  7. Sign-Off → Capture completion signature
  8. Analytics → Review business performance
```
