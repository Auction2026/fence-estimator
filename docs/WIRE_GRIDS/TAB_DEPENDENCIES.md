# TAB DEPENDENCIES
## Fence Depot Estimator — Which Tabs Depend on Which Data

```
═══════════════════════════════════════════════════════════════
                    TAB DEPENDENCY MAP
═══════════════════════════════════════════════════════════════

  ┌─────────────────────────────────────────────────────────────┐
  │  DASHBOARD TAB                                              │
  │  No dependencies — reads summary data from all other tabs  │
  │                                                             │
  │  Displays:                                                  │
  │  • Recent estimates (from estimates table)                  │
  │  • Open projects count (from projects table)                │
  │  • Revenue this month (from estimates.total)                │
  │  • Pending quotes (from estimates WHERE status='sent')      │
  └─────────────────────────────────────────────────────────────┘
                          feeds ↓

  ┌─────────────────────────────────────────────────────────────┐
  │  NEW ESTIMATE TAB                                           │
  │  Depends on:                                                │
  │  • INVENTORY_DB (in-memory product catalog)                 │
  │  • Customer record (customers table) — optional             │
  │  • Project record (projects table)                          │
  │                                                             │
  │  Creates:                                                   │
  │  • Customer (if new)                                        │
  │  • Project (if new)                                         │
  │  • Fence spec                                               │
  │  • Estimate + line items                                    │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │  PROJECTS TAB                                               │
  │  Depends on:                                                │
  │  • projects table                                           │
  │  • customers table (for name display)                       │
  │                                                             │
  │  Clicking a project opens that project's:                   │
  │  • Estimates                                                │
  │  • Contract                                                 │
  │  • Notes                                                    │
  │  • Permits                                                  │
  │  • Crew                                                     │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │  MATERIALS & COSTS TAB                                      │
  │  Depends on:                                                │
  │  • inventory table (all active products)                    │
  │  • estimate_line_items (for used quantities)                │
  │                                                             │
  │  Shows:                                                     │
  │  • Material cost breakdown by category                      │
  │  • Price vs cost comparison                                 │
  │  • Markup analysis                                          │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │  SUPPLIERS TAB                                              │
  │  Depends on:                                                │
  │  • inventory.vendor field                                   │
  │                                                             │
  │  Shows:                                                     │
  │  • Vendor/supplier list                                     │
  │  • Products by vendor                                       │
  │  • Contact information                                      │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │  ANALYTICS TAB                                              │
  │  Depends on:                                                │
  │  • estimates (totals, counts, dates)                        │
  │  • projects (status counts)                                 │
  │  • estimate_line_items (popular products)                   │
  │  • contracts (revenue confirmed)                            │
  │                                                             │
  │  Shows:                                                     │
  │  • Revenue chart (monthly)                                  │
  │  • Estimates won/lost ratio                                 │
  │  • Top fence types sold                                     │
  │  • Average estimate value                                   │
  └─────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────────┐
  │  SETTINGS TAB                                               │
  │  Depends on:                                                │
  │  • users table (current user)                               │
  │                                                             │
  │  Allows:                                                    │
  │  • Change name/email/password                               │
  │  • Company info (name, address, logo)                       │
  │  • Default tax rate / markup                                │
  │  • Email settings                                           │
  │  • Notification preferences                                 │
  └─────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════
                    DATA FLOW BETWEEN TABS
═══════════════════════════════════════════════════════════════

  INVENTORY_DB ──────────────────────────────► NEW ESTIMATE
       │                                           │
       │                              creates      │
       ▼                                           ▼
  MATERIALS TAB                             ESTIMATE RECORD
       ▲                                           │
       │ reads                       converts      │
       │                                           ▼
  SUPPLIERS ──────────────────────────────► CONTRACT
                                                   │
                                      triggers     │
                                                   ▼
  PROJECTS ◄──────────────────────────── CHANGE ORDERS
       │
       │ summarizes
       ▼
  DASHBOARD ◄─────────────────────────── ANALYTICS
```
