
# Database Schema

This schema describes the target PostgreSQL design for Fence Depot. It is optimized for estimate traceability, price locking, change-order auditability, and project lifecycle reporting.

## Entity Relationship Summary
- `users` 1→N `projects`
- `projects` 1→1 `fence_specs`
- `projects` 1→N `estimates`
- `estimates` 1→N `estimate_line_items`
- `estimate_line_items` N→1 `inventory`
- `projects` 1→N `contracts`
- `projects` 1→N `change_orders`
- `projects` 1→N `notes`
- `projects` 1→N `sign_offs`

---

## 1. users
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK, default `gen_random_uuid()` |
| email | citext | unique, not null |
| password_hash | text | not null |
| first_name | text | not null |
| last_name | text | not null |
| role | text | not null, check in (`admin`,`estimator`,`crew`,`manager`) |
| phone | text | nullable |
| is_active | boolean | default true |
| last_login_at | timestamptz | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

## 2. projects
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| project_number | text | unique, not null |
| owner_user_id | uuid | FK → users.id, not null |
| customer_name | text | not null |
| customer_email | citext | nullable |
| customer_phone | text | nullable |
| address_line_1 | text | not null |
| address_line_2 | text | nullable |
| city | text | not null |
| province_state | text | not null |
| postal_code | text | not null |
| country | text | default `CA` |
| status | text | not null, check in (`draft`,`active`,`estimated`,`contracted`,`in_progress`,`completed`,`cancelled`,`on_hold`) |
| project_notes | text | nullable |
| price_locked_estimate_id | uuid | nullable, FK → estimates.id |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

## 3. fence_specs
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| project_id | uuid | unique, FK → projects.id, not null |
| fence_type | text | not null |
| height_inches | integer | not null |
| color | text | nullable |
| post_gauge | numeric(6,2) | nullable |
| post_diameter_inches | numeric(6,2) | nullable |
| gate_type | text | nullable |
| linear_feet | numeric(10,2) | not null |
| number_posts | integer | not null |
| number_gates | integer | default 0 |
| installation_type | text | not null |
| special_requirements | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

## 4. inventory
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| sku | text | unique, not null |
| name | text | not null |
| category | text | not null |
| unit | text | not null |
| unit_cost | numeric(12,2) | not null |
| sell_price | numeric(12,2) | nullable |
| taxable | boolean | default true |
| active | boolean | default true |
| vendor_name | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

## 5. estimates
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| estimate_number | text | unique, not null |
| project_id | uuid | FK → projects.id, not null |
| created_by | uuid | FK → users.id, not null |
| revision_no | integer | default 1 |
| material_cost | numeric(12,2) | not null |
| labor_cost | numeric(12,2) | not null |
| overhead_percent | numeric(6,2) | default 0 |
| markup_percent | numeric(6,2) | default 0 |
| tax_percent | numeric(6,2) | default 0 |
| subtotal | numeric(12,2) | not null |
| total | numeric(12,2) | not null |
| is_locked | boolean | default false |
| locked_at | timestamptz | nullable |
| locked_by | uuid | FK → users.id, nullable |
| status | text | default `draft` |
| notes | text | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

## 6. estimate_line_items
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| estimate_id | uuid | FK → estimates.id, not null |
| inventory_id | uuid | FK → inventory.id, nullable |
| item_type | text | not null |
| description | text | not null |
| quantity | numeric(12,2) | not null |
| unit | text | not null |
| unit_cost | numeric(12,2) | not null |
| extended_cost | numeric(12,2) | not null |
| sort_order | integer | default 0 |
| created_at | timestamptz | default now() |

## 7. contracts
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| contract_number | text | unique, not null |
| project_id | uuid | FK → projects.id, not null |
| estimate_id | uuid | FK → estimates.id, not null |
| customer_name | text | not null |
| scope_of_work | text | not null |
| total_price | numeric(12,2) | not null |
| deposit_amount | numeric(12,2) | default 0 |
| warranty_terms | text | nullable |
| payment_terms | text | nullable |
| status | text | default `draft` |
| signed_at | timestamptz | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

## 8. change_orders
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| change_order_number | text | unique, not null |
| project_id | uuid | FK → projects.id, not null |
| contract_id | uuid | FK → contracts.id, not null |
| created_by | uuid | FK → users.id, not null |
| description | text | not null |
| reason | text | nullable |
| cost_impact | numeric(12,2) | not null |
| schedule_impact_days | integer | default 0 |
| status | text | default `pending` |
| approved_by | uuid | FK → users.id, nullable |
| approved_at | timestamptz | nullable |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

## 9. notes
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| project_id | uuid | FK → projects.id, not null |
| created_by | uuid | FK → users.id, not null |
| title | text | not null |
| category | text | not null |
| content | text | not null |
| pinned | boolean | default false |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

## 10. sign_offs
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| project_id | uuid | FK → projects.id, not null |
| contract_id | uuid | FK → contracts.id, not null |
| completed_at | timestamptz | nullable |
| fence_inspection_passed | boolean | default false |
| customer_walkthrough | boolean | default false |
| warranty_explained | boolean | default false |
| outstanding_items | text | nullable |
| follow_up_needed | boolean | default false |
| customer_signature | text | nullable |
| company_rep | text | nullable |
| status | text | default `pending` |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

---

## ERD Description
1. `users` own and manage projects.
2. `projects` are the central record for every customer job.
3. `fence_specs` attach one detailed design profile to each project.
4. `estimates` capture one or more pricing revisions per project.
5. `estimate_line_items` preserve the exact material/labor composition of each estimate.
6. `inventory` stores the source pricing and SKU references used by line items.
7. `contracts` are created from locked estimates.
8. `change_orders` track post-lock changes with approval audit data.
9. `notes` provide project-specific or operational commentary.
10. `sign_offs` close the project with inspection and completion records.

---

## Recommended Indexes
- `users(email)` unique
- `projects(project_number)` unique
- `projects(owner_user_id, status)`
- `projects(updated_at desc)`
- `fence_specs(project_id)` unique
- `inventory(sku)` unique
- `inventory(category, active)`
- `estimates(project_id, created_at desc)`
- `estimates(is_locked, locked_at)`
- `estimate_line_items(estimate_id, sort_order)`
- `contracts(project_id, created_at desc)`
- `change_orders(project_id, status, created_at desc)`
- `notes(project_id, created_at desc)`
- `sign_offs(project_id, status)`

---

## Common Queries

### 1. List active projects
```sql
SELECT project_number, customer_name, status, updated_at
FROM projects
WHERE status IN ('active', 'estimated', 'contracted', 'in_progress')
ORDER BY updated_at DESC;
```

### 2. Load one project with fence specs
```sql
SELECT p.*, fs.*
FROM projects p
LEFT JOIN fence_specs fs ON fs.project_id = p.id
WHERE p.id = $1;
```

### 3. Get the latest estimate for a project
```sql
SELECT *
FROM estimates
WHERE project_id = $1
ORDER BY created_at DESC
LIMIT 1;
```

### 4. Expand estimate line items with inventory metadata
```sql
SELECT eli.description, eli.quantity, eli.unit_cost, eli.extended_cost, i.sku, i.category
FROM estimate_line_items eli
LEFT JOIN inventory i ON i.id = eli.inventory_id
WHERE eli.estimate_id = $1
ORDER BY eli.sort_order ASC;
```

### 5. Find approved change orders
```sql
SELECT change_order_number, description, cost_impact, approved_at
FROM change_orders
WHERE project_id = $1
  AND status = 'approved'
ORDER BY approved_at DESC;
```

### 6. Calculate contracted total plus approved changes
```sql
SELECT c.total_price + COALESCE(SUM(co.cost_impact), 0) AS final_project_total
FROM contracts c
LEFT JOIN change_orders co
  ON co.contract_id = c.id
 AND co.status = 'approved'
WHERE c.project_id = $1
GROUP BY c.total_price;
```
