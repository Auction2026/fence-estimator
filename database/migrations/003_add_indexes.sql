-- ============================================================
-- MIGRATION 003: Add Indexes for Performance
-- Run AFTER migration 002
-- ============================================================

USE fence_estimator;

-- Additional composite indexes for reporting queries
CREATE INDEX IF NOT EXISTS idx_estimates_created_status
    ON estimates (created_at, status);

CREATE INDEX IF NOT EXISTS idx_projects_status_date
    ON projects (status, start_date);

CREATE INDEX IF NOT EXISTS idx_lineitems_estimate_sort
    ON estimate_line_items (estimate_id, sort_order);

CREATE INDEX IF NOT EXISTS idx_products_price
    ON inventory_products (sell_price);

SELECT 'Migration 003 - indexes created' AS status;
