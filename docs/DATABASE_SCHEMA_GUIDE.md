# Database Schema Guide

## Core tables
- `users`: application users and roles.
- `projects`: customer and site-level project records.
- `fence_specs`: fence-specific design and estimating inputs.
- `estimates`: pricing snapshots.
- `contracts`: locked commercial agreements.
- `change_orders`: approved contract deltas.
- `signoffs`: project completion acknowledgements.
- `notes`: reusable or project-specific notes.
- `catalog_products`: product and service pricing catalog.

## Supporting SQL files
- `database/schema.sql`: base tables.
- `database/indexes.sql`: query indexes.
- `database/procedures.sql`: updated-at triggers.
- `database/seed.sql`: starter product catalog data plus generated sample rows.
- `database/migrations/*.sql`: ordered migration entry points.
