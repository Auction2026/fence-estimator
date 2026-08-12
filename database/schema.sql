-- =============================================================
-- FENCE DEPOT ESTIMATOR — Database Schema
-- Version: 1.0.0
-- Compatible: PostgreSQL 14+ / MySQL 8+
-- =============================================================

-- Drop existing tables (reverse dependency order)
DROP TABLE IF EXISTS contract_signatures CASCADE;
DROP TABLE IF EXISTS contracts           CASCADE;
DROP TABLE IF EXISTS estimate_items      CASCADE;
DROP TABLE IF EXISTS estimates           CASCADE;
DROP TABLE IF EXISTS project_photos      CASCADE;
DROP TABLE IF EXISTS projects            CASCADE;
DROP TABLE IF EXISTS inventory           CASCADE;
DROP TABLE IF EXISTS users               CASCADE;
DROP TABLE IF EXISTS provinces           CASCADE;
DROP TABLE IF EXISTS fence_types         CASCADE;

-- =============================================================
-- LOOKUP TABLES
-- =============================================================

CREATE TABLE fence_types (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(30)  NOT NULL UNIQUE,    -- 'chain-link', 'wood', 'aluminum', 'vinyl'
  label       VARCHAR(100) NOT NULL,
  description TEXT,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE provinces (
  code  CHAR(2) PRIMARY KEY,
  name  VARCHAR(50) NOT NULL
);

-- =============================================================
-- USERS
-- =============================================================

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50)  NOT NULL UNIQUE,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(75),
  last_name     VARCHAR(75),
  phone         VARCHAR(20),
  role          VARCHAR(20)  NOT NULL DEFAULT 'estimator'
                  CHECK (role IN ('admin','estimator','crew','viewer')),
  company       VARCHAR(150),
  active        BOOLEAN DEFAULT TRUE,
  last_login    TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- =============================================================
-- INVENTORY
-- =============================================================

CREATE TABLE inventory (
  id           SERIAL PRIMARY KEY,
  plu          VARCHAR(30)   NOT NULL UNIQUE,   -- point-of-lookup / SKU
  description  VARCHAR(255)  NOT NULL,
  dept         VARCHAR(100),                     -- 'Chain Link Fabric', 'Commercial Fitting', …
  sub_dept     VARCHAR(100),
  height_ft    NUMERIC(5,2),                     -- fence height this item fits (NULL = n/a)
  gauge        VARCHAR(10),                      -- wire gauge, e.g. '11.5'
  length_ft    NUMERIC(7,2),                     -- roll/rail length in feet
  color        VARCHAR(50),
  unit         VARCHAR(30) DEFAULT 'Each',        -- 'Roll', '50 ft Roll', 'Each', 'lb'
  price        NUMERIC(10,2) NOT NULL DEFAULT 0,
  cost         NUMERIC(10,2),                    -- purchase cost (optional)
  qty_on_hand  INTEGER DEFAULT 0,
  qty_min      INTEGER DEFAULT 0,               -- reorder point
  active       BOOLEAN DEFAULT TRUE,
  notes        TEXT,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventory_dept   ON inventory(dept);
CREATE INDEX idx_inventory_height ON inventory(height_ft);
CREATE INDEX idx_inventory_active ON inventory(active);

-- =============================================================
-- PROJECTS
-- =============================================================

CREATE TABLE projects (
  id              SERIAL PRIMARY KEY,
  project_id      VARCHAR(20)  NOT NULL UNIQUE,  -- e.g. FDE-2026-0001
  customer_name   VARCHAR(150) NOT NULL,
  customer_email  VARCHAR(150) NOT NULL,
  customer_phone  VARCHAR(20)  NOT NULL,
  alt_phone       VARCHAR(20),
  address         VARCHAR(255) NOT NULL,
  city            VARCHAR(100) NOT NULL,
  province        CHAR(2)      REFERENCES provinces(code),
  postal_code     VARCHAR(10),
  property_notes  TEXT,
  status          VARCHAR(20)  NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft','estimate','contract','active','completed','cancelled')),
  estimator_id    INTEGER REFERENCES users(id),
  source          VARCHAR(50),                   -- 'walk-in', 'referral', 'online', …
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_status    ON projects(status);
CREATE INDEX idx_projects_estimator ON projects(estimator_id);
CREATE INDEX idx_projects_created   ON projects(created_at DESC);

-- =============================================================
-- PROJECT PHOTOS
-- =============================================================

CREATE TABLE project_photos (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_path   VARCHAR(500) NOT NULL,
  caption     VARCHAR(255),
  taken_at    TIMESTAMP,
  uploaded_by INTEGER REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- ESTIMATES
-- =============================================================

CREATE TABLE estimates (
  id              SERIAL PRIMARY KEY,
  estimate_id     VARCHAR(25)  NOT NULL UNIQUE,  -- e.g. FDE-2026-0001-E1
  project_id      INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  version         INTEGER NOT NULL DEFAULT 1,
  fence_type      VARCHAR(30)  REFERENCES fence_types(code),
  height_ft       NUMERIC(4,1),
  color           VARCHAR(50),
  footage         NUMERIC(8,1),
  gate_count      INTEGER DEFAULT 0,
  labor_included  BOOLEAN DEFAULT TRUE,
  tax_rate        NUMERIC(5,4) DEFAULT 0.0500,
  subtotal        NUMERIC(12,2) DEFAULT 0,
  tax_amount      NUMERIC(12,2) DEFAULT 0,
  labour_amount   NUMERIC(12,2) DEFAULT 0,
  total           NUMERIC(12,2) DEFAULT 0,
  status          VARCHAR(20) DEFAULT 'draft'
                    CHECK (status IN ('draft','sent','accepted','declined','expired')),
  notes           TEXT,
  valid_until     DATE,
  sent_at         TIMESTAMP,
  created_by      INTEGER REFERENCES users(id),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_estimates_project ON estimates(project_id);
CREATE INDEX idx_estimates_status  ON estimates(status);

-- =============================================================
-- ESTIMATE LINE ITEMS
-- =============================================================

CREATE TABLE estimate_items (
  id           SERIAL PRIMARY KEY,
  estimate_id  INTEGER NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  line_number  INTEGER NOT NULL,
  inventory_id INTEGER REFERENCES inventory(id),
  plu          VARCHAR(30),
  description  VARCHAR(255) NOT NULL,
  category     VARCHAR(50),
  quantity     NUMERIC(10,3) NOT NULL,
  unit         VARCHAR(30),
  unit_price   NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price  NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes        VARCHAR(500),
  UNIQUE(estimate_id, line_number)
);

CREATE INDEX idx_estimate_items_estimate ON estimate_items(estimate_id);

-- =============================================================
-- CONTRACTS
-- =============================================================

CREATE TABLE contracts (
  id             SERIAL PRIMARY KEY,
  contract_id    VARCHAR(25)  NOT NULL UNIQUE,  -- e.g. FDE-2026-0001-C1
  project_id     INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  estimate_id    INTEGER REFERENCES estimates(id),
  deposit_pct    NUMERIC(5,2) DEFAULT 30.00,
  deposit_amount NUMERIC(12,2),
  total_amount   NUMERIC(12,2) NOT NULL,
  start_date     DATE,
  end_date       DATE,
  warranty_years INTEGER DEFAULT 1,
  terms          TEXT,
  status         VARCHAR(20) DEFAULT 'draft'
                   CHECK (status IN ('draft','sent','signed','active','completed','cancelled')),
  sent_at        TIMESTAMP,
  created_by     INTEGER REFERENCES users(id),
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contracts_project ON contracts(project_id);
CREATE INDEX idx_contracts_status  ON contracts(status);

-- =============================================================
-- CONTRACT SIGNATURES
-- =============================================================

CREATE TABLE contract_signatures (
  id            SERIAL PRIMARY KEY,
  contract_id   INTEGER NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  signer_name   VARCHAR(150) NOT NULL,
  signer_email  VARCHAR(150),
  signer_role   VARCHAR(30) DEFAULT 'customer',  -- 'customer' | 'company'
  signature_svg TEXT,
  ip_address    VARCHAR(45),
  signed_at     TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- TRIGGER: auto-update updated_at
-- =============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','inventory','projects','estimates','contracts'] LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      t, t
    );
  END LOOP;
END $$;

-- =============================================================
-- VIEWS
-- =============================================================

CREATE OR REPLACE VIEW v_project_summary AS
SELECT
  p.id,
  p.project_id,
  p.customer_name,
  p.customer_email,
  p.city,
  p.province,
  p.status,
  p.created_at,
  COALESCE(u.first_name || ' ' || u.last_name, u.username) AS estimator,
  e.estimate_id,
  e.total          AS estimate_total,
  e.status         AS estimate_status,
  c.contract_id,
  c.total_amount   AS contract_total,
  c.status         AS contract_status
FROM projects p
LEFT JOIN users     u ON u.id = p.estimator_id
LEFT JOIN estimates e ON e.project_id = p.id AND e.version = (
  SELECT MAX(e2.version) FROM estimates e2 WHERE e2.project_id = p.id
)
LEFT JOIN contracts c ON c.project_id = p.id;

COMMENT ON VIEW v_project_summary IS 'One row per project with latest estimate and contract details';
