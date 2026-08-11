-- SQLite Maintenance Procedure for Fence Depot Fence Estimator
--
-- Purpose:
-- 1. Check database integrity and foreign key consistency.
-- 2. Refresh planner statistics with ANALYZE.
-- 3. Rebuild indexes when needed.
-- 4. Compact the database file with VACUUM.
-- 5. Emit simple operational counts for review.
--
-- Usage notes:
-- - Run regularly from sqlite3 or as part of scheduled maintenance.
-- - During busy systems, run VACUUM during off-hours because it rewrites the file.
-- - If WAL mode is enabled, checkpoint before vacuuming to minimize file growth.

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA busy_timeout = 5000;

-- Health checks.
PRAGMA foreign_key_check;
PRAGMA quick_check;
PRAGMA integrity_check;

-- Planner and storage maintenance.
ANALYZE;
PRAGMA optimize;
REINDEX;
PRAGMA wal_checkpoint(TRUNCATE);
VACUUM;

-- Refresh analysis after compaction.
ANALYZE;
PRAGMA optimize;

-- Basic operational visibility.
SELECT 'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'fence_specs', COUNT(*) FROM fence_specs
UNION ALL SELECT 'estimates', COUNT(*) FROM estimates
UNION ALL SELECT 'estimate_items', COUNT(*) FROM estimate_items
UNION ALL SELECT 'contracts', COUNT(*) FROM contracts
UNION ALL SELECT 'change_orders', COUNT(*) FROM change_orders
UNION ALL SELECT 'sign_offs', COUNT(*) FROM sign_offs
UNION ALL SELECT 'notes', COUNT(*) FROM notes
UNION ALL SELECT 'catalog_products', COUNT(*) FROM catalog_products;

SELECT 'maintenance_completed' AS event, datetime('now') AS completed_at;
