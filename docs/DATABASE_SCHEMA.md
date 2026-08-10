# Database Schema

## Overview
The PostgreSQL schema supports user management, projects, fence specifications, estimates, contracts, change orders, sign-offs, project notes, and inventory.

## `users`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | Primary key |
| username | VARCHAR(50) | Unique, 3-50 chars |
| email | VARCHAR(255) | Unique |
| password_hash | TEXT | Bcrypt or equivalent hash |
| role | VARCHAR(20) | `admin`, `estimator`, `crew` |
| company | VARCHAR(255) | Required |
| phone | VARCHAR(25) | Optional |
| created_at | TIMESTAMPTZ | Default `NOW()` |
| updated_at | TIMESTAMPTZ | Auto-updated by trigger |

## `projects`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | Primary key |
| project_id | VARCHAR(30) | Business identifier, unique |
| customer_name | VARCHAR(150) | Required |
| customer_email | VARCHAR(255) | Optional |
| customer_phone | VARCHAR(25) | Optional |
| address | VARCHAR(255) | Required |
| city | VARCHAR(120) | Required |
| province | VARCHAR(50) | Required |
| postal_code | VARCHAR(20) | Required |
| property_notes | TEXT | Optional |
| estimator_id | BIGINT | FK to `users.id` |
| status | project_status | `draft`, `estimate`, `contract`, `active`, `completed` |
| created_at | TIMESTAMPTZ | Default `NOW()` |
| updated_at | TIMESTAMPTZ | Auto-updated by trigger |

## `fence_specs`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | Primary key |
| project_id | BIGINT | FK to `projects.id` |
| fence_type | VARCHAR(100) | Required |
| height | NUMERIC(6,2) | Required, > 0 |
| color | VARCHAR(50) | Optional |
| material | VARCHAR(100) | Required |
| total_footage | NUMERIC(10,2) | Required |
| gate_count | INTEGER | Default 0 |
| gate_sizes | JSONB | JSON array of gate descriptors |
| notes | TEXT | Optional |
| created_at | TIMESTAMPTZ | Default `NOW()` |

## `estimates`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | Primary key |
| project_id | BIGINT | FK to `projects.id` |
| estimate_number | VARCHAR(30) | Unique |
| material_cost | NUMERIC(12,2) | Default `0.00` |
| labor_cost | NUMERIC(12,2) | Default `0.00` |
| equipment_cost | NUMERIC(12,2) | Default `0.00` |
| overhead_cost | NUMERIC(12,2) | Default `0.00` |
| tax_rate | NUMERIC(6,4) | 0 to 1 |
| tax_amount | NUMERIC(12,2) | Stored computed tax |
| total_amount | NUMERIC(12,2) | Stored grand total |
| status | estimate_status | `draft`, `sent`, `accepted`, `rejected`, `expired`, `converted` |
| valid_until | DATE | Optional |
| created_at | TIMESTAMPTZ | Default `NOW()` |
| updated_at | TIMESTAMPTZ | Auto-updated by trigger |

## `contracts`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | Primary key |
| estimate_id | BIGINT | FK to `estimates.id` |
| project_id | BIGINT | FK to `projects.id` |
| contract_number | VARCHAR(30) | Unique |
| locked_price | NUMERIC(12,2) | Immutable base contract value |
| signed_at | TIMESTAMPTZ | Optional |
| signed_by | VARCHAR(150) | Optional |
| terms_text | TEXT | Required |
| status | contract_status | `pending`, `signed`, `active`, `completed`, `cancelled` |
| created_at | TIMESTAMPTZ | Default `NOW()` |

## `change_orders`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | Primary key |
| contract_id | BIGINT | FK to `contracts.id` |
| order_number | VARCHAR(30) | Unique |
| description | TEXT | Required |
| cost_adjustment | NUMERIC(12,2) | Positive or negative delta |
| approved_by | VARCHAR(150) | Optional |
| approved_at | TIMESTAMPTZ | Optional |
| status | change_order_status | `pending`, `approved`, `rejected`, `implemented` |
| created_at | TIMESTAMPTZ | Default `NOW()` |

## `sign_offs`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | Primary key |
| project_id | BIGINT | FK to `projects.id` |
| signed_by | VARCHAR(150) | Required |
| signature_data | TEXT | Captured signature payload |
| notes | TEXT | Optional |
| signed_at | TIMESTAMPTZ | Default `NOW()` |

## `project_notes`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | Primary key |
| project_id | BIGINT | FK to `projects.id` |
| author_id | BIGINT | FK to `users.id` |
| note_text | TEXT | Required |
| created_at | TIMESTAMPTZ | Default `NOW()` |

## `inventory`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | Primary key |
| sku | VARCHAR(40) | Unique |
| name | VARCHAR(200) | Required |
| category | VARCHAR(80) | Required |
| unit | VARCHAR(30) | `roll`, `pack`, `each`, `length`, etc. |
| unit_price | NUMERIC(12,2) | Non-negative |
| qty_on_hand | INTEGER | Current stock |
| reorder_point | INTEGER | Replenishment threshold |
| supplier | VARCHAR(150) | Optional |
| updated_at | TIMESTAMPTZ | Default `NOW()` |

## Relationships
- One `users` record can own many `projects`.
- One `projects` record can have one or more `fence_specs` rows.
- One `projects` record can have many `estimates`.
- One `estimates` row can be converted into one or more `contracts` revisions if needed.
- One `contracts` row can have many `change_orders`.
- One `projects` row can have many `sign_offs` and `project_notes`.
- `project_notes.author_id` links note authors back to `users`.

## Important constraints
- Business identifiers are unique on `project_id`, `estimate_number`, `contract_number`, `order_number`, and `sku`.
- Trigger-managed `updated_at` fields keep `users`, `projects`, and `estimates` current.
- JSON validation ensures `gate_sizes` is always an array.
- Numeric check constraints prevent negative prices, quantities, and reorder thresholds.
