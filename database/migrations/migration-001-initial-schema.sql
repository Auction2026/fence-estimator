-- ============================================================
-- Migration 001: Initial Schema
-- database/migrations/migration-001-initial-schema.sql
-- ============================================================
-- Run schema.sql instead of this file for a fresh install.
-- This migration is the initial baseline.

\echo 'Migration 001: Creating initial schema...';

\i ../schema.sql

INSERT INTO audit_log (table_name, action, new_data)
VALUES ('schema', 'INSERT', '{"migration":"001","description":"Initial schema created"}')
ON CONFLICT DO NOTHING;

\echo 'Migration 001: Complete.';
