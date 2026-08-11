-- ============================================================
-- MIGRATION 004: Load Seed Data
-- Run AFTER migration 003
-- ============================================================

USE fence_estimator;

-- Execute: mysql -u fence_app -p fence_estimator < seed.sql

-- Verify product count after seeding
SELECT department, COUNT(*) AS product_count
FROM inventory_products
GROUP BY department
ORDER BY department;

SELECT CONCAT('Total products loaded: ', COUNT(*)) AS seed_status
FROM inventory_products;

SELECT 'Migration 004 - seed data loaded' AS status;
