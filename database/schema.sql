-- ═══════════════════════════════════════════════════════════════
-- FENCE DEPOT ESTIMATOR PRO – database/schema.sql
-- Complete PostgreSQL schema: 9 tables + indexes + constraints
-- ═══════════════════════════════════════════════════════════════

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ────────────────────────────────────────────────────────
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  uuid          UUID         DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(200) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(30)  NOT NULL DEFAULT 'estimator'
                  CHECK (role IN ('admin','manager','estimator','viewer')),
  active        BOOLEAN      NOT NULL DEFAULT TRUE,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email  ON users(email);
CREATE INDEX idx_users_role   ON users(role);

-- ── INVENTORY ────────────────────────────────────────────────────
CREATE TABLE inventory (
  id           SERIAL PRIMARY KEY,
  plu          VARCHAR(40)  UNIQUE NOT NULL,
  description  VARCHAR(200) NOT NULL,
  department   VARCHAR(80)  NOT NULL,
  unit         VARCHAR(30)  NOT NULL DEFAULT 'Each',
  cost         NUMERIC(10,2) NOT NULL DEFAULT 0,
  price        NUMERIC(10,2) NOT NULL DEFAULT 0,
  on_hand      INTEGER      NOT NULL DEFAULT 0,
  reorder_point INTEGER     NOT NULL DEFAULT 5,
  upc          VARCHAR(20),
  supplier_id  INTEGER,
  active       BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_inv_plu   ON inventory(plu);
CREATE INDEX idx_inv_dept  ON inventory(department);

-- ── SUPPLIERS ────────────────────────────────────────────────────
CREATE TABLE suppliers (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  contact_name  VARCHAR(120),
  phone         VARCHAR(30),
  email         VARCHAR(200),
  address       VARCHAR(300),
  lead_days     INTEGER NOT NULL DEFAULT 7,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE inventory ADD CONSTRAINT fk_inv_supplier
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL;

-- ── PROJECTS ─────────────────────────────────────────────────────
CREATE TABLE projects (
  id            SERIAL PRIMARY KEY,
  customer_name VARCHAR(200) NOT NULL,
  phone         VARCHAR(30),
  email         VARCHAR(200),
  address       VARCHAR(300),
  city          VARCHAR(100),
  state         CHAR(2),
  zip           VARCHAR(10),
  fence_type    VARCHAR(50)  NOT NULL,
  height_ft     INTEGER      NOT NULL,
  linear_ft     NUMERIC(10,1) NOT NULL,
  color         VARCHAR(80),
  walk_gates    INTEGER NOT NULL DEFAULT 0,
  drive_gates   INTEGER NOT NULL DEFAULT 0,
  status        VARCHAR(30)  NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','in-progress','complete','cancelled','on-hold')),
  start_date    DATE,
  end_date      DATE,
  notes         TEXT,
  created_by    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_proj_status  ON projects(status);
CREATE INDEX idx_proj_created ON projects(created_at);

-- ── ESTIMATES ────────────────────────────────────────────────────
CREATE TABLE estimates (
  id              SERIAL PRIMARY KEY,
  estimate_num    VARCHAR(30) UNIQUE NOT NULL DEFAULT 'EST-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(NEXTVAL('estimates_id_seq')::TEXT, 5,'0'),
  project_id      INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  customer_name   VARCHAR(200) NOT NULL,
  phone           VARCHAR(30),
  email           VARCHAR(200),
  fence_type      VARCHAR(50)  NOT NULL,
  height_ft       INTEGER      NOT NULL,
  linear_ft       NUMERIC(10,1) NOT NULL,
  color           VARCHAR(80),
  walk_gates      INTEGER NOT NULL DEFAULT 0,
  drive_gates     INTEGER NOT NULL DEFAULT 0,
  materials_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  labor_total     NUMERIC(12,2) NOT NULL DEFAULT 0,
  markup_amount   NUMERIC(12,2) NOT NULL DEFAULT 0,
  grand_total     NUMERIC(12,2) NOT NULL DEFAULT 0,
  markup_pct      NUMERIC(5,2)  NOT NULL DEFAULT 20,
  labor_rate      NUMERIC(8,2)  NOT NULL DEFAULT 12,
  status          VARCHAR(30)  NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','sent','approved','rejected','expired')),
  valid_days      INTEGER NOT NULL DEFAULT 30,
  price_locked    BOOLEAN NOT NULL DEFAULT FALSE,
  locked_at       TIMESTAMPTZ,
  notes           TEXT,
  created_by      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_est_status    ON estimates(status);
CREATE INDEX idx_est_customer  ON estimates(customer_name);

-- ── ESTIMATE LINE ITEMS ───────────────────────────────────────────
CREATE TABLE estimate_items (
  id           SERIAL PRIMARY KEY,
  estimate_id  INTEGER NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  plu          VARCHAR(40) NOT NULL,
  description  VARCHAR(200) NOT NULL,
  quantity     NUMERIC(10,2) NOT NULL,
  unit         VARCHAR(30) NOT NULL DEFAULT 'Each',
  unit_price   NUMERIC(10,2) NOT NULL,
  line_total   NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  locked_price NUMERIC(10,2),
  sort_order   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX idx_estitem_estimate ON estimate_items(estimate_id);

-- ── CONTRACTS ────────────────────────────────────────────────────
CREATE TABLE contracts (
  id             SERIAL PRIMARY KEY,
  contract_num   VARCHAR(30) UNIQUE NOT NULL,
  estimate_id    INTEGER REFERENCES estimates(id) ON DELETE SET NULL,
  project_id     INTEGER REFERENCES projects(id)  ON DELETE SET NULL,
  customer_name  VARCHAR(200) NOT NULL,
  total          NUMERIC(12,2) NOT NULL,
  payment_terms  VARCHAR(50) NOT NULL DEFAULT '50/50',
  status         VARCHAR(30) NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft','sent','signed','cancelled')),
  signed_at      TIMESTAMPTZ,
  signed_by      VARCHAR(200),
  notes          TEXT,
  created_by     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── CHANGE ORDERS ─────────────────────────────────────────────────
CREATE TABLE change_orders (
  id           SERIAL PRIMARY KEY,
  co_num       VARCHAR(30) UNIQUE NOT NULL,
  project_id   INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  contract_id  INTEGER REFERENCES contracts(id) ON DELETE SET NULL,
  description  TEXT NOT NULL,
  amount       NUMERIC(12,2) NOT NULL,
  status       VARCHAR(30) NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending','approved','rejected','cancelled')),
  approved_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  approved_at  TIMESTAMPTZ,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_co_project ON change_orders(project_id);

-- ── SIGN-OFFS ─────────────────────────────────────────────────────
CREATE TABLE sign_offs (
  id           SERIAL PRIMARY KEY,
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  signed_by    VARCHAR(200) NOT NULL,
  signature    TEXT NOT NULL,
  comments     TEXT,
  signed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── NOTES ─────────────────────────────────────────────────────────
CREATE TABLE notes (
  id         SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── UPDATE TRIGGER ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated     BEFORE UPDATE ON users     FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_inventory_updated BEFORE UPDATE ON inventory  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_projects_updated  BEFORE UPDATE ON projects   FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_estimates_updated BEFORE UPDATE ON estimates  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
