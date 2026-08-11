# TAB DEPENDENCIES DIAGRAM
**Fence Estimator Pro** – Which Tabs Depend on Which

```
TAB 1: Project Info ◄─────────────── Required for ALL tabs
(Customer, Address, Date)             (project context)
         │
         └──► TAB 2: Fence Specs ◄── Required for TAB 8 (Estimate)
              (Type, Height, LF)      Must be filled first

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INDEPENDENT TABS (no prerequisites):
├── TAB 3:  Layout Diagram    (can draw anytime)
├── TAB 5:  Shop Drawings     (upload anytime)
├── TAB 6:  Permits           (fill anytime)
├── TAB 7:  Utilities         (fill anytime)
├── TAB 14: Notes             (add anytime)
├── TAB 16: Product Catalog   (browse anytime)
└── TAB 17: Mapping           (use anytime)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEPENDENT TAB CHAIN:
                                  TAB 2 (Specs)
                                      │
                                      ▼
                               TAB 8: Estimate
                                      │
                                      ▼
                               TAB 9: Contract ──── 🔒 PRICE LOCKED
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
             TAB 10: Extras   TAB 11: Crew      TAB 4: Tasks
                    │                 │                 │
                    └────────────────►│◄────────────────┘
                                      │
                                      ▼
                             TAB 12: Change Orders
                             (if contract exists)
                                      │
                                      ▼
                              TAB 13: Sign-Off
                              (project complete)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ADMIN ONLY:
└── TAB 15: Admin Dashboard (role = 'admin' required)

DATA FLOW BETWEEN TABS:
Tab 1 data ──► Tab 8 (customer name, address in header)
Tab 2 data ──► Tab 8 (specs for calculation)
Tab 8 data ──► Tab 9 (total price, scope of work)
Tab 9 data ──► Tab 12 (base total for change orders)
Tab 8+12   ──► Tab 13 (final total for sign-off)
```
