# Database Schema Reference
**Fence Estimator Pro** – All Tables and Columns

## Tables

### users
| Column | Type | Notes |
|--------|------|-------|
| id | CHAR(36) | UUID Primary Key |
| username | VARCHAR(255) | Unique |
| email | VARCHAR(255) | Unique |
| password_hash | VARCHAR(255) | bcrypt |
| role | ENUM | admin, estimator, crew |
| company | VARCHAR(255) | |
| phone | VARCHAR(20) | |
| active | TINYINT | 1=active |

### projects
| Column | Type | Notes |
|--------|------|-------|
| id | CHAR(36) | UUID PK |
| project_id | VARCHAR(50) | Unique key e.g. PROJ-2026-001 |
| customer_name | VARCHAR(255) | |
| customer_email | VARCHAR(255) | |
| customer_phone | VARCHAR(20) | |
| address | VARCHAR(255) | |
| city | VARCHAR(100) | |
| province | VARCHAR(100) | |
| postal_code | VARCHAR(10) | |
| status | ENUM | draft, estimate, contract, active, completed |

### fence_specs
| Column | Type | Notes |
|--------|------|-------|
| project_id | VARCHAR(50) | FK → projects |
| fence_type | VARCHAR(50) | chain-link, wood, vinyl, etc |
| height | INT | feet |
| linear_feet | INT | total footage |
| number_posts | INT | |
| number_gates | INT | |
| gate_type | VARCHAR(50) | none, walk-single, drive-double |
| barbed_wire | TINYINT | boolean |

### estimates
| Column | Type | Notes |
|--------|------|-------|
| estimate_number | VARCHAR(50) | EST-2026-0001 |
| project_id | VARCHAR(50) | FK |
| material_cost | DECIMAL(12,2) | |
| labour_cost | DECIMAL(12,2) | |
| equipment_cost | DECIMAL(12,2) | |
| subtotal | DECIMAL(14,2) | |
| tax | DECIMAL(12,2) | 13% |
| total | DECIMAL(14,2) | |

### contracts
| Column | Type | Notes |
|--------|------|-------|
| contract_number | VARCHAR(50) | CON-2026-0001 |
| project_id | VARCHAR(50) | FK |
| total_price | DECIMAL(14,2) | Locked value |
| price_locked | TINYINT | 1=locked |
| customer_signature | TEXT | Typed name |
| company_signature | TEXT | Typed name |

### inventory
| Column | Type | Notes |
|--------|------|-------|
| sku | VARCHAR(100) | Unique product code |
| name | VARCHAR(255) | |
| category | VARCHAR(100) | chain-link, wood, etc |
| unit_cost | DECIMAL(12,2) | Cost to us |
| retail_price | DECIMAL(12,2) | Price to customer |
| quantity | INT | Stock level |
| supplier | VARCHAR(255) | |

See `database/schema.sql` for complete definitions including all indexes and constraints.
