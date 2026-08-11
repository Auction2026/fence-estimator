-- ============================================================
-- MIGRATION 001: Initial Schema
-- Run: psql -d fence_estimator -f migration-001-initial-schema.sql
-- ============================================================

\echo 'Running Migration 001: Initial Schema...'

-- Run the full schema file
\i ../schema.sql

\echo 'Migration 001 complete.'
