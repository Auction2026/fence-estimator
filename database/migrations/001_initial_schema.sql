-- ============================================================
-- Migration 001: Initial Schema
-- Run: 2026-01-01
-- ============================================================
-- This migration creates the initial schema.
-- Run schema.sql first, then seed.sql.
-- ============================================================

-- Track migrations
CREATE TABLE IF NOT EXISTS migrations (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    run_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

INSERT INTO migrations (name) VALUES ('001_initial_schema')
ON CONFLICT (name) DO NOTHING;
