-- Migration 003: Add pricing_locked fields to estimates
-- (Already included in schema.sql — this is a rollback-safe migration)
ALTER TABLE estimates
  ADD COLUMN IF NOT EXISTS pricing_locked    BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS pricing_locked_at TIMESTAMPTZ;

COMMENT ON COLUMN estimates.pricing_locked IS 'When true, line_items and costs cannot be changed.';
COMMENT ON COLUMN estimates.pricing_locked_at IS 'Timestamp when the estimate was price-locked.';
