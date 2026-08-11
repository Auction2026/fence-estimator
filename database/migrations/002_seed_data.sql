-- ============================================================
-- MIGRATION 002 - Seed initial data
-- Run after 001_initial_schema.sql
-- ============================================================
\echo 'Running migration 002: Seeding initial data'

\i ../seed.sql

\echo 'Migration 002 complete'
