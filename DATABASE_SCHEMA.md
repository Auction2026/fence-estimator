# Database Schema
Tables: users, projects, fence_specs, estimates, contracts, change_orders, signoff, notes, inventory.

Relationships:
- projects.created_by -> users.id
- fence_specs.project_id -> projects.id
- estimates.project_id -> projects.id
- contracts.project_id -> projects.id
- change_orders.contract_id -> contracts.id
- notes.project_id -> projects.id

See `/database/schema.sql` for constraints and indexes.
