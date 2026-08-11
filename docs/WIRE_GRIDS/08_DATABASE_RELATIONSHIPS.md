# WIRE GRID 08 — DATABASE RELATIONSHIPS
## Entity Relationship Diagram (ERD)

```
╔══════════════════════════════════════════════════════════════════════════╗
║               FENCE ESTIMATOR — DATABASE ERD                             ║
╚══════════════════════════════════════════════════════════════════════════╝

┌─────────────────┐         ┌─────────────────────────────────────────┐
│     users       │         │              materials                   │
│─────────────────│         │─────────────────────────────────────────│
│ id (PK)         │         │ id (PK)                                 │
│ username        │         │ sku (UNIQUE)                            │
│ email           │         │ plu                                     │
│ password_hash   │         │ name                                    │
│ full_name       │         │ category                                │
│ role            │         │ fence_type                              │
│ is_active       │         │ unit_of_measure                         │
│ last_login      │         │ unit_cost                               │
│ created_at      │         │ unit_price                              │
│ updated_at      │         │ markup_pct                              │
└────────┬────────┘         │ gauge, height_ft, length_ft             │
         │                  │ color, coating                          │
    creates/assigns         │ is_active, stock_qty, reorder_point     │
         │                  └───────────────┬─────────────────────────┘
    ┌────┴─────────────────────────┐        │
    │                              │        │
    ▼                              ▼        ▼
┌────────────────┐       ┌─────────────────────────────────────────┐
│   customers    │       │         supplier_materials               │
│────────────────│       │─────────────────────────────────────────│
│ id (PK)        │       │ id (PK)                                 │
│ first_name     │       │ supplier_id (FK→suppliers)              │◄──┐
│ last_name      │       │ material_id (FK→materials)              │   │
│ company_name   │       │ supplier_sku                            │   │
│ email          │       │ supplier_price                          │   │
│ phone          │       │ lead_time_days                          │   │
│ address_line1  │       │ is_preferred                            │   │
│ city,state,zip │       └─────────────────────────────────────────┘   │
│ customer_type  │                                                      │
│ created_by(FK) │       ┌─────────────────────────────────────────┐   │
└────────┬───────┘       │             suppliers                   │───┘
         │               │─────────────────────────────────────────│
   has many              │ id (PK)                                 │
         │               │ supplier_name                           │
    ┌────┴────────┐       │ contact_name, email, phone              │
    │             │       │ account_number, payment_terms           │
    ▼             ▼       │ lead_time_days, is_preferred            │
┌──────────┐ ┌─────────────────────────────────────────┐
│ projects │ │                estimates                │
│──────────│ │─────────────────────────────────────────│
│ id (PK)  │ │ id (PK)                                 │
│ project_ │ │ estimate_number (UNIQUE, auto-generated)│
│  number  │ │ project_id (FK→projects, nullable)      │
│ project_ │ │ customer_id (FK→customers)              │
│  name    │ │ version                                 │
│ customer_│ │ status                                  │
│  id (FK) │ │ fence_type, height_ft, color           │
│ status   │ │ total_linear_ft, num_gates              │
│ fence_   │ │ material_cost, labor_cost               │
│  type    │ │ subtotal, tax_rate, tax_amount          │
│ site_    │ │ discount_pct, discount_amount           │
│  address │ │ total_amount                            │
│ crew_size│ │ price_locked, price_locked_at           │
│ start_dt │ │ valid_until, sent_at, approved_at       │
│ end_dt   │ │ created_by (FK→users)                   │
└──────────┘ └──────────────────┬──────────────────────┘
                                │
                           has many
                                │
                                ▼
                  ┌─────────────────────────────────────────┐
                  │           estimate_items                 │
                  │─────────────────────────────────────────│
                  │ id (PK)                                 │
                  │ estimate_id (FK→estimates)              │
                  │ material_id (FK→materials, nullable)    │
                  │ line_number                             │
                  │ item_type (material/labor/equip/permit) │
                  │ description                             │
                  │ quantity, unit_of_measure               │
                  │ unit_cost, unit_price                   │
                  │ total_cost (GENERATED = qty × unit_cost)│
                  │ total_price (GENERATED = qty × unit_pr) │
                  └─────────────────────────────────────────┘

  settings    audit_log    change_orders   material_price_history
  ─────────   ─────────   ─────────────   ──────────────────────
  key-value   all CRUD     CO# + estimate   price change log
  config      audit trail  change tracking  per material
```
