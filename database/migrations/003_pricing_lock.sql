-- ═══════════════════════════════════════════════════════════════
-- Migration 003 – add pricing lock columns to estimates
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE estimates
  ADD COLUMN IF NOT EXISTS price_locked BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS locked_at    TIMESTAMPTZ;

-- Index to quickly find locked estimates
CREATE INDEX IF NOT EXISTS idx_est_locked ON estimates(price_locked) WHERE price_locked = TRUE;
