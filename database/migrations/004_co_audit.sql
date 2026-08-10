-- ═══════════════════════════════════════════════════════════════
-- Migration 004 – add change_orders approval audit trail
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE change_orders
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

CREATE TABLE IF NOT EXISTS co_audit_log (
  id         SERIAL PRIMARY KEY,
  co_id      INTEGER NOT NULL REFERENCES change_orders(id) ON DELETE CASCADE,
  action     VARCHAR(30) NOT NULL,
  by_user    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  note       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_coaudit_co ON co_audit_log(co_id);
