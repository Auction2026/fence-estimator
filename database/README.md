# Fence Depot Fence Estimator Database

This folder contains the SQLite database assets for the **Fence Depot Fence Estimator** web application.

## Structure

- `schema.sql` - complete schema with tables, indexes, and validation triggers.
- `seed.sql` - catalog seed data with 129 fence-related products for estimating.
- `migrations/001_initial_schema.sql` - creates the base tables.
- `migrations/002_indexes.sql` - adds query-performance indexes.
- `migrations/003_constraints.sql` - adds validation and timestamp triggers used as SQLite-friendly constraints/default helpers.
- `migrations/004_seed_products.sql` - inserts the catalog product data.
- `procedures/backup.sql` - backup workflow using `VACUUM INTO` and integrity checks.
- `procedures/recovery.sql` - restore workflow from a backup database file.
- `procedures/maintenance.sql` - routine optimization and integrity checks.

## Tables

1. `users` - application accounts and roles.
2. `projects` - customer jobs, lead records, and lifecycle status.
3. `fence_specs` - per-project fence configuration details.
4. `estimates` - estimate summaries and pricing totals.
5. `estimate_items` - estimate line items.
6. `contracts` - signed contract details and schedule dates.
7. `change_orders` - post-contract scope and pricing changes.
8. `sign_offs` - captured signatures and approvals.
9. `notes` - internal project notes by user and category.
10. `catalog_products` - reusable materials catalog for quote generation.

## Notes

- Foreign keys are enabled throughout the schema.
- Financial triggers validate estimate and change-order totals.
- `projects.updated_at` and `estimates.updated_at` are auto-touched by triggers.
- Seed data uses `INSERT OR IGNORE` so it can be re-run safely.
