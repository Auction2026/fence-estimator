-- Migration 002 — Payments Table
-- Tracks deposits and progress payments against contracts
CREATE TABLE IF NOT EXISTS payments (
  id            SERIAL PRIMARY KEY,
  contract_id   INTEGER NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  project_id    INTEGER NOT NULL REFERENCES projects(id),
  amount        NUMERIC(12,2) NOT NULL,
  payment_type  VARCHAR(30) DEFAULT 'deposit'
                  CHECK (payment_type IN ('deposit','progress','final','refund')),
  method        VARCHAR(30)   -- 'cash','cheque','etransfer','credit-card'
                  CHECK (method IN ('cash','cheque','etransfer','credit-card','other')),
  reference     VARCHAR(100),  -- cheque number, transaction ID
  notes         TEXT,
  received_at   TIMESTAMP DEFAULT NOW(),
  received_by   INTEGER REFERENCES users(id),
  created_at    TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_contract ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_project  ON payments(project_id);
