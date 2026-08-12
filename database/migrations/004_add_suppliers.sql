-- Migration 004 — Suppliers & Purchase Orders
CREATE TABLE IF NOT EXISTS suppliers (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  contact     VARCHAR(100),
  phone       VARCHAR(20),
  email       VARCHAR(150),
  address     VARCHAR(255),
  city        VARCHAR(100),
  province    CHAR(2),
  notes       TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id           SERIAL PRIMARY KEY,
  po_number    VARCHAR(25) UNIQUE NOT NULL,
  supplier_id  INTEGER REFERENCES suppliers(id),
  project_id   INTEGER REFERENCES projects(id),
  status       VARCHAR(20) DEFAULT 'draft'
                 CHECK (status IN ('draft','sent','received','partial','cancelled')),
  order_date   DATE DEFAULT CURRENT_DATE,
  expected_at  DATE,
  received_at  TIMESTAMP,
  total_amount NUMERIC(12,2),
  notes        TEXT,
  created_by   INTEGER REFERENCES users(id),
  created_at   TIMESTAMP DEFAULT NOW()
);
