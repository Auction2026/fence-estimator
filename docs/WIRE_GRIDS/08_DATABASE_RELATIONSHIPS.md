# WIRE GRID 8 – DATABASE RELATIONSHIPS
## How All Database Tables Connect to Each Other

---

```
╔══════════════════════════════════════════════════════════════════╗
║         FENCE ESTIMATOR – DATABASE RELATIONSHIP DIAGRAM         ║
╚══════════════════════════════════════════════════════════════════╝

READING THIS DIAGRAM:
  ──── (solid line) = Required relationship (foreign key)
  ···· (dots)       = Optional relationship
  [1]  = "one" side of relationship
  [*]  = "many" side of relationship

═══════════════════════════════════════════════════════════════════

  ┌──────────────┐
  │    USERS     │ ◄─── Each user is a Fence Depot salesperson
  │──────────────│
  │ id (PK)      │
  │ username     │
  │ email        │
  │ password_hash│
  │ full_name    │
  │ role         │
  └──────┬───────┘
         │ [1]
         │ One user can create many projects
         │ [*]
         ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                        CUSTOMERS                             │
  │──────────────────────────────────────────────────────────────│
  │ id (PK)  first_name  last_name  phone  email  address        │
  └──────────────┬───────────────────────────────────────────────┘
                 │ [1]
                 │ One customer can have many projects
                 │ [*]
                 ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                         PROJECTS                             │  ◄── Central Table
  │──────────────────────────────────────────────────────────────│     Everything links here
  │ id (PK)  estimate_number  customer_id  job_type  status      │
  │ project_date  install_address  sales_rep  notes              │
  └──────────────┬───────────────────────────────────────────────┘
                 │ [1]
                 │ One project has exactly ONE of each below:
                 │ [1]
       ┌──────────┼──────────────────────────────────────────────┐
       │          │                                              │
       ▼          ▼                                              ▼
  ┌──────────┐ ┌──────────────┐                          ┌──────────────┐
  │FENCE_SPECS│ │   LAYOUTS    │                          │  ESTIMATE_   │
  │──────────│ │──────────────│                          │  SUMMARIES   │
  │project_id│ │ project_id   │                          │──────────────│
  │fence_type│ │ total_footage│                          │ project_id   │
  │height_ft │ │ terrain      │                          │ mat_total    │
  │gauge     │ │ canvas_json  │──► LAYOUT_SIDES           │ labor_total  │
  │color     │ │              │    (layout_id, side,     │ equip_total  │
  │gates     │ └──────────────┘     footage)             │ tax_amount   │
  └──────────┘                                           │ total        │
                                                         └──────────────┘
       │
       │ [1] project has many [*] materials:
       ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                        MATERIALS                             │
  │──────────────────────────────────────────────────────────────│
  │ id  project_id  sku  description  qty_needed  unit_cost      │
  │ line_total (calculated automatically)                        │
  └──────────────────────────────────────────────────────────────┘

       │ [1] project has exactly ONE labor record:
       ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                          LABOR                               │
  │──────────────────────────────────────────────────────────────│
  │ id  project_id  crew_size  hourly_rate  hours  total         │
  └──────────────────────────────────────────────────────────────┘

       │ [1] project has many [*] equipment items:
       ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                        EQUIPMENT                             │
  │──────────────────────────────────────────────────────────────│
  │ id  project_id  item_name  days  day_rate  line_total        │
  └──────────────────────────────────────────────────────────────┘

       │ [1] project has exactly ONE contract:
       ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                        CONTRACTS                             │
  │──────────────────────────────────────────────────────────────│
  │ id  project_id  contract_price  deposit  terms               │
  │ signature_data  locked  locked_at                            │
  └──────────────────────────────────────────────────────────────┘

       │ [1] project has many [*] change orders:
       ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                      CHANGE_ORDERS                           │
  │──────────────────────────────────────────────────────────────│
  │ id  project_id  co_number  description  amount  status       │
  │ signed  signature_data                                       │
  └──────────────────────────────────────────────────────────────┘

       │ [1] project has many [*] invoices:
       ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                        INVOICES                              │
  │──────────────────────────────────────────────────────────────│
  │ id  project_id  invoice_number  amount  paid  balance        │
  └──────────────────────────────────────────────────────────────┘

       │ [1] project has many [*] tracking entries:
       ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                      TRACKING_LOG                            │
  │──────────────────────────────────────────────────────────────│
  │ id  project_id  log_date  note  logged_by                    │
  └──────────────────────────────────────────────────────────────┘

       │ [1] project has exactly ONE sign-off:
       ▼
  ┌──────────────────────────────────────────────────────────────┐
  │                        SIGN_OFFS                             │
  │──────────────────────────────────────────────────────────────│
  │ id  project_id  completion_date  final_collected  signature  │
  └──────────────────────────────────────────────────────────────┘


SEPARATE TABLES (not linked to projects):
══════════════════════════════════════════

  ┌──────────────────────────────────────────────────────────────┐
  │                        PRODUCTS                              │
  │  (The price catalog used to calculate materials)             │
  │──────────────────────────────────────────────────────────────│
  │ id  sku  description  department  unit  unit_cost  on_hand  │
  └──────────────────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────────────────┐
  │                      CREW_MEMBERS                            │
  │  (Workers available to assign to projects)                   │
  │──────────────────────────────────────────────────────────────│
  │ id  name  role  hourly_rate  phone  is_active                │
  └──────────────────────────────────────────────────────────────┘
  Connected via PROJECT_CREW bridge table (many-to-many)
```

---

## 📖 KEY RULES

1. **One project = one customer** (but one customer can have many projects)
2. **One project = one contract** (contract holds the locked price)
3. **One project = many materials** (each material is a separate line item)
4. **Products table** is the price catalog – not linked to any specific project
5. **Deleting a project** cascades – removes materials, layout, specs automatically
6. **Deleting a contract** is RESTRICTED – can't delete if invoices exist

---

## ✅ TABLE SUMMARY

| Table | Records | Purpose |
|-------|---------|---------|
| users | ~10 | Salesperson logins |
| customers | ~500+ | Customer records |
| projects | ~500+ | Estimates & jobs |
| fence_specs | 1 per project | Fence specifications |
| materials | 15-25 per project | Materials list |
| contracts | 1 per project | Locked contract |
| change_orders | 0-5 per project | Contract changes |
| products | 175+ | Price catalog |
