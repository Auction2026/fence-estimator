
-- Maintenance procedures for SQLite deployments
BEGIN TRANSACTION;
ANALYZE;
PRAGMA optimize;
DELETE FROM change_orders WHERE status = 'draft' AND created_at < datetime('now', '-90 days');
UPDATE catalog_products SET active = 0 WHERE supplier_name = '' AND active = 1;
COMMIT;
