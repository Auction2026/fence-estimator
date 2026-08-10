# WIRE GRID 8: DATABASE RELATIONSHIPS

```
╔════════════════════════════════════════════════════════════════╗
║               DATABASE TABLE RELATIONSHIPS (ERD)              ║
╚════════════════════════════════════════════════════════════════╝

┌──────────────┐
│    users     │◄──────────────────────────────────────────────┐
│──────────────│                                               │
│ id (PK)      │         created_by / assigned_to FK           │
│ username     │                                               │
│ email        │                                               │
│ password_hash│                                               │
│ role         │                                               │
│ company      │                                               │
└──────────────┘

┌──────────────┐
│   projects   │◄────────────────────────────────────────────┐
│──────────────│                                             │
│ id (PK)      │──────────────────────────────────────┐     │
│ project_num  │                                      │     │
│ status       │◄─── FK: created_by → users.id        │     │
│ customer_name│                                      │     │
│ job_address  │                                      │     │
└──────────────┘                                      │     │
       │ 1:many                                       │     │
       ├──────────────────────────────────────────────│─────│──────┐
       │                                              │     │      │
       ▼                                              │     │      │
┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │     │      │
│ fence_specs  │  │  estimates   │  │  contracts   │ │     │      │
│──────────────│  │──────────────│  │──────────────│ │     │      │
│ id (PK)      │  │ id (PK)      │  │ id (PK)      │ │     │      │
│ project_id FK│  │ project_id FK│  │ project_id FK│ │     │      │
│ fence_type   │  │ estimate_num │  │ contract_num │ │     │      │
│ fence_height │  │ status       │  │ status       │ │     │      │
│ linear_footage│ │ materials_cost│ │ contract_amt │ │     │      │
│ num_gates    │  │ labor_cost   │  │ signed_by    │ │     │      │
│ terrain      │  │ total_amount │  │ signed_date  │ │     │      │
│              │  │ line_items   │  │              │ │     │      │
│              │  │ pricing_locked│ │              │ │     │      │
└──────────────┘  └──────────────┘  └──────┬───────┘ │     │      │
                         │                  │         │     │      │
                         │ FK: fence_spec_id│         │     │      │
                         └──────────────────┘         │     │      │
                                                       │     │      │
                  ┌──────────────┐                     │     │      │
                  │change_orders │◄────────────────────┘     │      │
                  │──────────────│                           │      │
                  │ id (PK)      │   FK: contract_id         │      │
                  │ contract_id FK│  FK: project_id          │      │
                  │ co_number    │                           │      │
                  │ description  │                           │      │
                  │ total_change │                           │      │
                  └──────────────┘                           │      │
                                                             │      │
                  ┌──────────────┐                           │      │
                  │  sign_offs   │◄──────────────────────────┘      │
                  │──────────────│   FK: project_id                 │
                  │ id (PK)      │   FK: contract_id                │
                  │ sign_off_type│                                  │
                  │ signed_by    │                                  │
                  │ signed_date  │                                  │
                  └──────────────┘                                  │
                                                                    │
                  ┌──────────────┐                                  │
                  │    notes     │◄─────────────────────────────────┘
                  │──────────────│   FK: project_id
                  │ id (PK)      │   FK: estimate_id (optional)
                  │ note_type    │   FK: contract_id (optional)
                  │ title        │
                  │ body         │
                  └──────────────┘

                  ┌──────────────┐
                  │  inventory   │  (standalone — linked via SKU in line_items)
                  │──────────────│
                  │ id (PK)      │
                  │ plu (UNIQUE) │
                  │ description  │
                  │ department   │
                  │ cost_price   │
                  │ sell_price   │
                  │ markup_pct   │  (computed column)
                  │ qty_on_hand  │
                  └──────────────┘
```
