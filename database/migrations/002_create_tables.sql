-- ============================================================
-- MIGRATION 002: Run Schema (all 9 tables)
-- Run AFTER migration 001
-- ============================================================

USE fence_estimator;

-- Load schema from schema.sql
-- Execute: mysql -u fence_app -p fence_estimator < schema.sql

SELECT 'Migration 002 - schema tables created' AS status;
SHOW TABLES;
