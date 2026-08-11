-- ============================================================
-- MIGRATION 001 - INITIAL SCHEMA
-- Fence Depot Estimator
-- Run this FIRST
-- ============================================================

-- Record migration
CREATE TABLE IF NOT EXISTS schema_migrations (
    version     VARCHAR(50) PRIMARY KEY,
    description VARCHAR(500),
    applied_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Apply schema
\i schema.sql

-- Record completion
INSERT INTO schema_migrations (version, description)
VALUES ('001', 'Initial schema - 9 tables: users, projects, fence_specifications, product_categories, products, estimates, estimate_line_items, change_orders, audit_log')
ON CONFLICT (version) DO NOTHING;
