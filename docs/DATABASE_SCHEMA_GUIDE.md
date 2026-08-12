# Database Schema Guide

## projects
Stores customer project records and lifecycle state.

## estimates
Stores estimate snapshots by project.

## contracts
Stores generated contract records and signature status.

## Migration Order
1. `database/schema.sql`
2. `database/indexes.sql`
3. `database/seed.sql` (optional)
