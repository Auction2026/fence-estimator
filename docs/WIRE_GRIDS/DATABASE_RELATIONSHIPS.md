# WIRE GRID 8 – DATABASE RELATIONSHIPS
## Entity-Relationship Diagram (ERD)

```
╔══════════════════════════════════════════════════════════════════════╗
║               DATABASE RELATIONSHIPS (ERD)                          ║
╚══════════════════════════════════════════════════════════════════════╝

┌─────────────┐         ┌─────────────────┐
│   USERS     │         │    SUPPLIERS    │
├─────────────┤         ├─────────────────┤
│ id (PK)     │         │ id (PK)         │
│ name        │         │ name            │
│ email       │         │ contact_name    │
│ password    │         │ phone           │
│ role        │         │ email           │
│ active      │         │ lead_days       │
└──────┬──────┘         └────────┬────────┘
       │                         │
       │ created_by              │ supplier_id
       │                         │
       │              ┌──────────▼──────────┐
       │              │     INVENTORY       │
       │              ├─────────────────────┤
       │              │ id (PK)             │
       │              │ plu (UNIQUE)        │
       │              │ description         │
       │              │ department          │
       │              │ unit                │
       │              │ cost / price        │
       │              │ on_hand             │
       │              │ reorder_point       │
       │              │ supplier_id (FK) ───┘
       │              └─────────────────────┘
       │
       ├──────────────────────────────────────────┐
       │                                          │
       ▼                                          ▼
┌──────────────────┐               ┌──────────────────────┐
│    PROJECTS      │               │      ESTIMATES       │
├──────────────────┤               ├──────────────────────┤
│ id (PK)          │◄──────────────│ project_id (FK)      │
│ customer_name    │               │ id (PK)              │
│ phone/email      │               │ estimate_num (UNIQUE)│
│ address          │               │ customer_name        │
│ fence_type       │               │ fence_type           │
│ height_ft        │               │ linear_ft            │
│ linear_ft        │               │ materials_total      │
│ status           │               │ labor_total          │
│ created_by (FK)──┤               │ markup_amount        │
└──────┬───────────┘               │ grand_total          │
       │                           │ price_locked         │
       │                           │ created_by (FK)──────┤
       │                           └──────────┬───────────┘
       │                                      │
       │                            ┌─────────▼──────────┐
       │                            │   ESTIMATE_ITEMS   │
       │                            ├────────────────────┤
       │                            │ id (PK)            │
       │                            │ estimate_id (FK)   │
       │                            │ plu                │
       │                            │ description        │
       │                            │ quantity           │
       │                            │ unit_price         │
       │                            │ line_total (CALC)  │
       │                            └────────────────────┘
       │
       ├──────────────────────────────────────────────────┐
       │                          │                        │
       ▼                          ▼                        ▼
┌────────────────┐   ┌──────────────────┐   ┌────────────────────┐
│   CONTRACTS    │   │  CHANGE_ORDERS   │   │    SIGN_OFFS       │
├────────────────┤   ├──────────────────┤   ├────────────────────┤
│ id (PK)        │   │ id (PK)          │   │ id (PK)            │
│ contract_num   │   │ co_num           │   │ project_id (FK)    │
│ estimate_id(FK)│   │ project_id (FK)  │   │ signed_by          │
│ project_id (FK)│   │ contract_id (FK) │   │ signature          │
│ customer_name  │   │ description      │   │ signed_at          │
│ total          │   │ amount           │   └────────────────────┘
│ payment_terms  │   │ status           │
│ status         │   │ approved_by (FK) │   ┌────────────────────┐
│ signed_at      │   └──────────────────┘   │      NOTES         │
└────────────────┘                          ├────────────────────┤
                                            │ id (PK)            │
                                            │ project_id (FK)    │
                                            │ body               │
                                            │ created_by (FK)    │
                                            └────────────────────┘

─────────────────────────────────────────────────────────────
CARDINALITY SUMMARY
─────────────────────────────────────────────────────────────

  users         → estimates      : 1 user creates many estimates
  users         → projects       : 1 user creates many projects
  projects      → estimates      : 1 project has many estimates
  estimates     → estimate_items : 1 estimate has many items (lines)
  estimates     → contracts      : 1 estimate generates 1 contract
  projects      → change_orders  : 1 project has many change orders
  projects      → sign_offs      : 1 project has 1 sign-off
  projects      → notes          : 1 project has many notes
  suppliers     → inventory      : 1 supplier supplies many items
```
