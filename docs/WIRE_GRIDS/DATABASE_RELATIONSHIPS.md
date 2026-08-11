# DIAGRAM 8: DATABASE RELATIONSHIPS
## Fence Depot Fence Estimator — Entity Relationship Diagram (ERD)

```
═══════════════════════════════════════════════════════════════════════
                   DATABASE RELATIONSHIP DIAGRAM
                   (All 9 Tables + Foreign Keys)
═══════════════════════════════════════════════════════════════════════

┌──────────────────────────┐
│         users            │
├──────────────────────────┤
│ PK  id                   │
│     username             │
│     email                │
│     password_hash        │
│     role (admin/est/crew)│
│     first_name           │
│     last_name            │
│     company              │
│     phone                │
│     is_active            │
│     last_login           │
│     created_at           │
│     updated_at           │
└────────────┬─────────────┘
             │
             │ FK: created_by
             ├──────────────────────────────────┐
             │                                  │
             │ FK: estimator_id                 │
             ├──────────────────────────────────┐
             │                                  │
             │ FK: created_by / locked_by       │
             ▼                                  │
┌──────────────────────────┐                    │
│       customers          │                    │
├──────────────────────────┤                    │
│ PK  id                   │                    │
│     first_name           │                    │
│     last_name            │                    │
│     email                │                    │
│     phone                │                    │
│     address              │                    │
│     city                 │                    │
│     province             │                    │
│     postal_code          │                    │
│     notes                │                    │
│ FK  created_by → users.id│                    │
│     created_at           │                    │
└────────────┬─────────────┘                    │
             │ 1                                │
             │                                  │
             │ MANY                             │
             ▼                                  ▼
┌──────────────────────────┐       ┌────────────────────────┐
│        projects          │       │       estimates         │
├──────────────────────────┤       ├────────────────────────┤
│ PK  id                   │       │ PK  id                  │
│     project_number       │       │     estimate_number     │
│ FK  customer_id→customers│       │ FK  project_id→projects │
│ FK  estimator_id→users   │       │ FK  customer_id→customers│
│     project_name         │       │ FK  created_by→users    │
│     site_address         │       │ FK  pricing_locked_by   │
│     status               │       │     fence_type          │
│     start_date           │       │     linear_feet         │
│     completion_date      │◄──────┤     material_cost       │
│     notes                │  1:M  │     labor_cost          │
└────────────┬─────────────┘       │     subtotal            │
             │                     │     markup_percent      │
             │ 1:M                 │     tax_percent         │
             ▼                     │     total_amount        │
┌──────────────────────────┐       │     status              │
│   fence_specifications   │       │     pricing_locked      │
├──────────────────────────┤       │     valid_until         │
│ PK  id                   │       └──────────┬─────────────┘
│ FK  project_id→projects  │                  │
│     section_label        │                  │ 1:M
│     fence_type           │                  ▼
│     height_feet          │       ┌────────────────────────┐
│     linear_feet          │       │   estimate_line_items   │
│     number_posts         │       ├────────────────────────┤
│     post_spacing         │       │ PK  id                  │
│     gate_type            │       │ FK  estimate_id→estims  │
│     number_gates         │       │     product_plu         │
│     barbed_wire          │       │     product_name        │
│     installation_type    │       │     department          │
│     terrain              │       │     unit_of_measure     │
│     special_notes        │       │     quantity            │
└──────────────────────────┘       │     unit_cost           │
                                   │     unit_sell           │
                                   │     line_total          │
                                   │     sort_order          │
                                   └──────────┬─────────────┘
                                              │
                                              │ product_plu (soft ref)
                                              │
                                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      inventory_products                           │
├──────────────────────────────────────────────────────────────────┤
│ PK  id           plu (unique)      description                    │
│     department   unit_of_measure   cost_price    sell_price       │
│     on_hand_qty  reorder_point     vendor_name   is_active        │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                       change_orders                               │
├──────────────────────────────────────────────────────────────────┤
│ PK  id              change_order_number                           │
│ FK  project_id  →  projects.id                                   │
│ FK  estimate_id →  estimates.id                                   │
│ FK  approved_by →  users.id                                       │
│ FK  created_by  →  users.id                                       │
│     description     reason                                        │
│     material_cost_delta    labor_cost_delta    total_delta         │
│     status (draft/pending/approved/declined)                      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         audit_log                                 │
├──────────────────────────────────────────────────────────────────┤
│ PK  id (BIGINT)    user_id (FK→users)                            │
│     action         table_name      record_id                      │
│     old_values     new_values      ip_address                     │
│     user_agent     created_at                                     │
└──────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════
RELATIONSHIP SUMMARY:
  users          1 ──────── M   customers          (created_by)
  users          1 ──────── M   projects           (estimator_id)
  users          1 ──────── M   estimates          (created_by)
  customers      1 ──────── M   projects           (customer_id)
  customers      1 ──────── M   estimates          (customer_id)
  projects       1 ──────── M   fence_specs        (project_id)
  projects       1 ──────── M   estimates          (project_id)
  projects       1 ──────── M   change_orders      (project_id)
  estimates      1 ──────── M   estimate_line_items (estimate_id)
  estimates      1 ──────── M   change_orders      (estimate_id)
  inventory_prods 1 ── soft─ M  estimate_line_items (plu reference)

CARDINALITY:
  One customer can have many projects
  One project can have many estimates (revisions)
  One estimate can have many line items
  One project can have many change orders
═══════════════════════════════════════════════════════════════════════
```
