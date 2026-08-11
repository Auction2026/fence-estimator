# DATABASE RELATIONSHIPS
## Fence Depot Estimator — Entity Relationship Diagram (ERD)

```
═══════════════════════════════════════════════════════════════
                    ENTITY RELATIONSHIP DIAGRAM
═══════════════════════════════════════════════════════════════

  ┌──────────────┐          ┌──────────────────────────────────┐
  │    USERS     │          │           CUSTOMERS              │
  ├──────────────┤          ├──────────────────────────────────┤
  │ id (PK)      │          │ id (PK)                          │
  │ email        │          │ company_name                     │
  │ password_hash│          │ first_name                       │
  │ first_name   │          │ last_name                        │
  │ last_name    │          │ email                            │
  │ role         │          │ phone                            │
  │ is_active    │          │ address_line1                    │
  │ last_login   │          │ city / state / zip               │
  └──────┬───────┘          └────────────────┬─────────────────┘
         │ created_by                        │ customer_id
         │ (FK)                              │ (FK)
         │                                  │
         └──────────────┐  ┌────────────────┘
                        │  │
                        ▼  ▼
                 ┌─────────────────────┐
                 │      PROJECTS       │
                 ├─────────────────────┤
                 │ id (PK)             │
                 │ customer_id (FK)    │
                 │ created_by (FK)     │
                 │ project_number      │ ◄── FE-2026-00001
                 │ name                │
                 │ status              │ ◄── draft/estimate/contract/
                 │ site_address        │      in_progress/complete/archived
                 │ site_city/state/zip │
                 └────────┬────────────┘
                          │ project_id (FK) — used by all below
                          │
        ┌─────────────────┼──────────────────────────────┐
        │                 │                              │
        ▼                 ▼                              ▼
┌──────────────┐  ┌──────────────────┐       ┌──────────────────┐
│ FENCE_SPECS  │  │    ESTIMATES     │       │   PERMITS        │
├──────────────┤  ├──────────────────┤       ├──────────────────┤
│ id (PK)      │  │ id (PK)          │       │ id (PK)          │
│ project_id   │  │ project_id (FK)  │       │ project_id (FK)  │
│ fence_type   │  │ estimate_number  │       │ permit_number    │
│ height       │  │ status           │       │ permit_type      │
│ gauge        │  │ valid_until      │       │ issuing_agency   │
│ total_lf     │  │ subtotal         │       │ status           │
│ gate_count   │  │ tax_rate         │       │ applied_date     │
│ top_rail     │  │ total            │       │ approved_date    │
│ barbed_wire  │  │ price_locked     │       └──────────────────┘
│ privacy_slats│  └────────┬─────────┘
└──────────────┘           │
                           │ estimate_id (FK)
                           ▼
                  ┌──────────────────────────┐
                  │   ESTIMATE_LINE_ITEMS    │
                  ├──────────────────────────┤
                  │ id (PK)                  │
                  │ estimate_id (FK)         │◄── M:1 to ESTIMATES
                  │ product_id               │
                  │ plu                      │◄── links to INVENTORY
                  │ description              │
                  │ qty                      │
                  │ unit_cost                │
                  │ unit_price               │
                  │ total_cost               │
                  │ total_price              │
                  └──────────────────────────┘

  ┌──────────────────────────────────────────────────────────┐
  │                      INVENTORY                           │
  ├──────────────────────────────────────────────────────────┤
  │ id (PK)    plu (UNIQUE)    sku                           │
  │ name       description     department    category        │
  │ unit       cost            price         tax_code        │
  │ on_hand    reorder_point   vendor        is_active       │
  └──────────────────────────────────────────────────────────┘
           ▲ (referenced by plu in estimate_line_items)

  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────┐
  │  CONTRACTS   │  │  CHANGE_ORDERS   │  │   SIGN_OFFS      │
  ├──────────────┤  ├──────────────────┤  ├──────────────────┤
  │ id (PK)      │  │ id (PK)          │  │ id (PK)          │
  │ project_id   │  │ contract_id (FK) │  │ project_id (FK)  │
  │ estimate_id  │  │ project_id (FK)  │  │ signed_by_name   │
  │ contract_no  │  │ co_number        │  │ signed_by_email  │
  │ status       │  │ status           │  │ sign_off_date    │
  │ signed_date  │  │ reason           │  │ completion_pct   │
  │ contract_total│ │ amount           │  │ signature_url    │
  │ deposit_amount│ │ approved_by (FK) │  │ photos (JSONB)   │
  └──────────────┘  └──────────────────┘  └──────────────────┘

  ┌─────────────────────────────────────────────────────────┐
  │             NOTES (Central Hub)                         │
  ├─────────────────────────────────────────────────────────┤
  │ id (PK)  project_id (FK)  created_by (FK)  note_type   │
  │ subject  body             attachments (JSONB) is_pinned │
  └─────────────────────────────────────────────────────────┘

  ┌──────────────┐  ┌─────────────────────────────────────┐
  │    CREW      │  │        PROJECT_CREW                 │
  ├──────────────┤  ├─────────────────────────────────────┤
  │ id (PK)      │  │ id (PK)                             │
  │ name         │  │ project_id (FK)  crew_id (FK)       │
  │ role         │  │ role_on_project  start_date         │
  │ phone/email  │  │ hours_estimated  hours_actual       │
  │ hourly_rate  │  └─────────────────────────────────────┘
  │ is_active    │
  └──────────────┘

  ┌──────────────────────────────────────────────────────┐
  │              AUDIT_LOG                               │
  ├──────────────────────────────────────────────────────┤
  │ id  table_name  record_id  action  changed_by        │
  │ old_data (JSONB)  new_data (JSONB)  changed_at       │
  └──────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════
                    CARDINALITY LEGEND
═══════════════════════════════════════════════════════════════

  ────►  One-to-Many (1:M)
  ◄────  Many-to-One (M:1)
  ◄────► Many-to-Many (M:M) — via junction table (project_crew)

  USERS          1 : M   PROJECTS        (created_by)
  CUSTOMERS      1 : M   PROJECTS        (customer_id)
  PROJECTS       1 : M   ESTIMATES       (project_id)
  PROJECTS       1 : M   FENCE_SPECS     (project_id)
  PROJECTS       1 : M   CONTRACTS       (project_id)
  PROJECTS       1 : M   PERMITS         (project_id)
  PROJECTS       1 : M   NOTES           (project_id)
  PROJECTS       1 : M   SIGN_OFFS       (project_id)
  PROJECTS       M : M   CREW            (via project_crew)
  ESTIMATES      1 : M   ESTIMATE_LINE_ITEMS
  CONTRACTS      1 : M   CHANGE_ORDERS   (contract_id)
  INVENTORY      1 : M   ESTIMATE_LINE_ITEMS (by plu)
```
