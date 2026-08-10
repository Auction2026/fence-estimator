# Database Schema Summary

## Core tables
- `users`: estimator and admin accounts.
- `sessions`: session token records.
- `projects`: top-level customer and jobsite records.
- `project_tabs`: JSON payload per project tab (`project`, `specs`, `layout`, `installation`, `shop-drawings`, `permits`, `utilities`, `estimate`, `contract`, `extras`, `crew-breakdown`, `change-order`, `sign-off`, `notes`, `admin`, `catalog`, `mapping`).
- `estimates`: saved estimate headers plus serialized calculation breakdowns.
- `contracts`: contract records tied to projects and optional estimate revisions.
- `catalog_products`: material catalog with starter and generated seed rows.
- `audit_logs`: minimal operational trail.

## Catalog seeding
`database/seed.sql` inserts three hand-picked products and then generates 950 additional catalog rows with a recursive CTE so the repository contains the requested large seed set without storing thousands of repetitive lines.
