-- ============================================================
-- MIGRATION 004: Seed Product Data
-- Run: psql -d fence_estimator -f migration-004-seed-products.sql
-- ============================================================

\echo 'Running Migration 004: Seeding product catalog...'

\i ../seed.sql

\echo 'Migration 004 complete.'
\echo 'Verifying product count...'
SELECT COUNT(*) AS total_products FROM inventory;
