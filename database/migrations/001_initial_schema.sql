-- ============================================================
-- MIGRATION 001 - Create initial schema
-- Run this first on a fresh database
-- ============================================================
-- Run: psql -U <user> -d <dbname> -f 001_initial_schema.sql
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Verify schema file is available
\echo 'Running migration 001: Initial schema setup'

-- Source the main schema
\i ../schema.sql

\echo 'Migration 001 complete'
