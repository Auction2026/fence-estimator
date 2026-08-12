-- ============================================================
-- FENCE DEPOT ESTIMATOR - Database Schema
-- database/schema.sql
-- Compatible: PostgreSQL 14+ / MySQL 8+
-- ============================================================

-- ---- USERS TABLE ----
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(80)  NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100),
  last_name     VARCHAR(100),
  role          VARCHAR(20)  NOT NULL DEFAULT 'estimator'
                CHECK (role IN ('admin','estimator','viewer')),
  is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
  last_login    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email    ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ---- CUSTOMERS TABLE ----
CREATE TABLE IF NOT EXISTS customers (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  company      VARCHAR(200),
  email        VARCHAR(255),
  phone        VARCHAR(30),
  address      VARCHAR(255),
  city         VARCHAR(100),
  state        CHAR(2),
  zip          VARCHAR(10),
  property_type VARCHAR(30) DEFAULT 'residential'
               CHECK (property_type IN ('residential','commercial','industrial','agricultural')),
  notes        TEXT,
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_customers_name  ON customers(name);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ---- PROJECTS TABLE ----
CREATE TABLE IF NOT EXISTS projects (
  id            SERIAL PRIMARY KEY,
  project_code  VARCHAR(30) UNIQUE,
  customer_id   INTEGER REFERENCES customers(id) ON DELETE CASCADE,
  created_by    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  assigned_to   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status        VARCHAR(30) NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','active','estimating','contracted','in_progress','completed','cancelled')),
  fence_type    VARCHAR(40),
  fence_height  NUMERIC(5,2),
  linear_feet   NUMERIC(10,2),
  color         VARCHAR(50),
  gates         INTEGER DEFAULT 0,
  corners       INTEGER DEFAULT 0,
  grade         VARCHAR(20) DEFAULT 'residential',
  remove_existing BOOLEAN DEFAULT FALSE,
  demolition    BOOLEAN DEFAULT FALSE,
  notes         TEXT,
  layout_data   JSONB,
  map_data      JSONB,
  installation_data JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_projects_customer ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_status   ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created  ON projects(created_at DESC);

-- ---- ESTIMATES TABLE ----
CREATE TABLE IF NOT EXISTS estimates (
  id                 SERIAL PRIMARY KEY,
  project_id         INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version            INTEGER NOT NULL DEFAULT 1,
  status             VARCHAR(20) DEFAULT 'draft'
                     CHECK (status IN ('draft','approved','sent','declined')),
  material_subtotal  NUMERIC(12,2) DEFAULT 0,
  material_markup    NUMERIC(12,2) DEFAULT 0,
  material_tax       NUMERIC(12,2) DEFAULT 0,
  labor_total        NUMERIC(12,2) DEFAULT 0,
  equipment_total    NUMERIC(12,2) DEFAULT 0,
  extras_total       NUMERIC(12,2) DEFAULT 0,
  before_tax         NUMERIC(12,2) DEFAULT 0,
  tax_total          NUMERIC(12,2) DEFAULT 0,
  grand_total        NUMERIC(12,2) DEFAULT 0,
  per_linear_foot    NUMERIC(10,2) DEFAULT 0,
  markup_pct         NUMERIC(5,2)  DEFAULT 30,
  tax_rate_pct       NUMERIC(5,2)  DEFAULT 8,
  valid_until        DATE,
  estimate_data      JSONB,
  created_by         INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, version)
);
CREATE INDEX IF NOT EXISTS idx_estimates_project ON estimates(project_id);

-- ---- CONTRACTS TABLE ----
CREATE TABLE IF NOT EXISTS contracts (
  id               SERIAL PRIMARY KEY,
  project_id       INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  estimate_id      INTEGER REFERENCES estimates(id) ON DELETE SET NULL,
  status           VARCHAR(20) DEFAULT 'pending'
                   CHECK (status IN ('pending','signed','locked','voided')),
  locked_total     NUMERIC(12,2),
  customer_sig     TEXT,
  contractor_sig   TEXT,
  signed_at        TIMESTAMPTZ,
  locked_at        TIMESTAMPTZ,
  terms_text       TEXT,
  deposit_amount   NUMERIC(12,2) DEFAULT 0,
  deposit_paid_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contracts_project ON contracts(project_id);

-- ---- PERMITS TABLE ----
CREATE TABLE IF NOT EXISTS permits (
  id              SERIAL PRIMARY KEY,
  project_id      INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  permit_type     VARCHAR(100),
  permit_number   VARCHAR(80),
  status          VARCHAR(30) DEFAULT 'Not Required',
  applied_date    DATE,
  approved_date   DATE,
  expires_date    DATE,
  fee             NUMERIC(10,2) DEFAULT 0,
  inspection_1    DATE,
  inspection_2    DATE,
  final_inspect   DATE,
  hoa_required    BOOLEAN DEFAULT FALSE,
  hoa_status      VARCHAR(30) DEFAULT 'Not Required',
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---- CHANGE_ORDERS TABLE ----
CREATE TABLE IF NOT EXISTS change_orders (
  id              SERIAL PRIMARY KEY,
  project_id      INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  co_number       VARCHAR(20),
  description     VARCHAR(500) NOT NULL,
  reason          TEXT,
  amount          NUMERIC(12,2) NOT NULL DEFAULT 0,
  status          VARCHAR(20) DEFAULT 'pending'
                  CHECK (status IN ('pending','approved','denied')),
  requested_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at     TIMESTAMPTZ,
  denied_at       TIMESTAMPTZ,
  approved_by     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_co_project ON change_orders(project_id);

-- ---- EXTRAS TABLE ----
CREATE TABLE IF NOT EXISTS extras (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name        VARCHAR(255) NOT NULL,
  qty         NUMERIC(10,2) DEFAULT 1,
  unit        VARCHAR(30)  DEFAULT 'Each',
  rate        NUMERIC(10,2) DEFAULT 0,
  line_total  NUMERIC(12,2) GENERATED ALWAYS AS (qty * rate) STORED,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---- PRODUCTS TABLE ----
CREATE TABLE IF NOT EXISTS products (
  id            SERIAL PRIMARY KEY,
  sku           VARCHAR(60)  NOT NULL UNIQUE,
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  department    VARCHAR(80),
  category      VARCHAR(80),
  unit          VARCHAR(20)  DEFAULT 'EA',
  price         NUMERIC(10,2) NOT NULL DEFAULT 0,
  cost          NUMERIC(10,2) DEFAULT 0,
  qty_on_hand   NUMERIC(12,2) DEFAULT 0,
  reorder_point NUMERIC(12,2) DEFAULT 0,
  is_active     BOOLEAN      DEFAULT TRUE,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_sku        ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_name       ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_department ON products(department);

-- ---- NOTES TABLE ----
CREATE TABLE IF NOT EXISTS notes (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  category    VARCHAR(50) DEFAULT 'General',
  title       VARCHAR(255),
  body        TEXT NOT NULL,
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  edited_at   TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_notes_project ON notes(project_id);

-- ---- AUDIT_LOG TABLE ----
CREATE TABLE IF NOT EXISTS audit_log (
  id          BIGSERIAL PRIMARY KEY,
  table_name  VARCHAR(60),
  record_id   INTEGER,
  action      VARCHAR(10) CHECK (action IN ('INSERT','UPDATE','DELETE')),
  changed_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  old_data    JSONB,
  new_data    JSONB,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_table  ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_user   ON audit_log(changed_by);
CREATE INDEX IF NOT EXISTS idx_audit_time   ON audit_log(changed_at DESC);

-- ---- UPDATED_AT TRIGGER FUNCTION ----
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','customers','projects','estimates','contracts','permits','change_orders','products'] LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON %1$s;
       CREATE TRIGGER trg_%1$s_updated_at
       BEFORE UPDATE ON %1$s
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      t
    );
  END LOOP;
END;
$$;
