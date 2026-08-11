# WIRE GRID 05 — TAB DEPENDENCIES
## How the 8 Application Tabs Interact

```
╔══════════════════════════════════════════════════════════════════════════╗
║                    8 TAB DEPENDENCIES & DATA FLOW                        ║
╚══════════════════════════════════════════════════════════════════════════╝

                         ┌─────────────────────┐
                         │      SETTINGS TAB    │
                         │                      │
                         │  • Company Name      │
                         │  • Tax Rate          │ ◄─── Affects ALL tabs
                         │  • Markup %          │
                         │  • Labor Rate        │
                         │  • Default Terms     │
                         └──────────┬──────────┘
                                    │ provides defaults to
                    ┌───────────────┼────────────────────┐
                    │               │                    │
                    ▼               ▼                    ▼
       ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
       │  INVENTORY TAB │  │  SUPPLIERS TAB │  │  NEW ESTIMATE  │
       │                │  │                │  │      TAB       │
       │  • Materials   │  │  • Suppliers   │  │                │
       │  • SKUs        │◄─┤  • Pricing     │  │  5-Step Wizard │
       │  • Stock qty   │  │  • Lead times  │  │                │
       │  • Costs       │  └────────────────┘  │  Uses:         │
       └───────┬────────┘                      │  • Materials   │
               │                               │  • Calc Engine │
               │ materials data                │  • Customers   │
               ▼                               └───────┬────────┘
       ┌─────────────────────────────────────────────────────┐
       │              CALCULATIONS ENGINE (js)               │
       │                                                      │
       │  Input: fence_type, height, linear_ft, num_gates    │
       │  Output: qty per material × unit_price = line items │
       └─────────────────────┬───────────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │    MATERIALS & COSTS  │
                  │         TAB           │
                  │                      │
                  │  • View all materials │
                  │  • Edit prices       │
                  │  • Bulk price update │
                  └──────────┬───────────┘
                             │
               ┌─────────────┼─────────────┐
               ▼             ▼             ▼
     ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
     │  PROJECTS TAB│ │  DASHBOARD  │ │ ANALYTICS TAB│
     │              │ │     TAB     │ │              │
     │  • Project   │ │             │ │  Charts:     │
     │    tracking  │ │  • KPIs     │ │  • Revenue   │
     │  • Status    │ │  • Alerts   │ │  • Job types │
     │  • Crew      │ │  • Recent   │ │  • Margins   │
     └──────────────┘ └─────────────┘ └──────────────┘

DATA DEPENDENCY KEY:
═══════════════════
Settings  → All tabs (company info, tax, markup)
Materials → New Estimate, Materials & Costs, Inventory
Suppliers → Materials (pricing source)
Estimates → Projects, Dashboard, Analytics
Projects  → Dashboard, Analytics
```
