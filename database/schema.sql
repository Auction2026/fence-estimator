-- ============================================================
-- FENCE DEPOT FENCE ESTIMATOR
-- DATABASE SCHEMA – PostgreSQL / MySQL Compatible
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  username     VARCHAR(60)  NOT NULL UNIQUE,
  email        VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name    VARCHAR(120),
  role         VARCHAR(30)  NOT NULL DEFAULT 'user',   -- admin | manager | user
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CUSTOMERS
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id           SERIAL PRIMARY KEY,
  first_name   VARCHAR(80)  NOT NULL,
  last_name    VARCHAR(80)  NOT NULL,
  phone        VARCHAR(30),
  email        VARCHAR(120),
  address      VARCHAR(200),
  city         VARCHAR(80),
  state        CHAR(2)      DEFAULT 'TX',
  zip          VARCHAR(10),
  notes        TEXT,
  created_by   INTEGER REFERENCES users(id),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_customers_last ON customers(last_name);
CREATE INDEX idx_customers_email ON customers(email);

-- ============================================================
-- PROJECTS (estimates / jobs)
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id              SERIAL PRIMARY KEY,
  estimate_number VARCHAR(30) NOT NULL UNIQUE,  -- e.g. FD-2026-0001
  customer_id     INTEGER NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  job_type        VARCHAR(40) NOT NULL DEFAULT 'New Install',
  status          VARCHAR(30) NOT NULL DEFAULT 'Estimate',
    -- Estimate | Contract | Active | Complete | Cancelled
  project_date    DATE,
  install_address VARCHAR(200),
  install_city    VARCHAR(80),
  install_state   CHAR(2) DEFAULT 'TX',
  install_zip     VARCHAR(10),
  sales_rep       VARCHAR(80),
  notes           TEXT,
  created_by      INTEGER REFERENCES users(id),
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_projects_customer ON projects(customer_id);
CREATE INDEX idx_projects_status   ON projects(status);

-- ============================================================
-- FENCE SPECIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS fence_specs (
  id              SERIAL PRIMARY KEY,
  project_id      INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  fence_type      VARCHAR(40) NOT NULL,   -- chain-link | wood-privacy | vinyl | ornamental...
  height_ft       DECIMAL(4,1) NOT NULL,
  gauge           VARCHAR(10),
  mesh_size       VARCHAR(10),
  color           VARCHAR(40),
  terminal_post   VARCHAR(10),
  line_post       VARCHAR(10),
  top_rail        VARCHAR(10),
  post_spacing_ft DECIMAL(4,1) DEFAULT 10,
  gates_count     INTEGER      DEFAULT 0,
  gate_width_ft   DECIMAL(4,1),
  barbed_wire     VARCHAR(20)  DEFAULT 'none',
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LAYOUT
-- ============================================================
CREATE TABLE IF NOT EXISTS layouts (
  id              SERIAL PRIMARY KEY,
  project_id      INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  total_footage   DECIMAL(10,2) NOT NULL DEFAULT 0,
  perimeter_notes TEXT,
  terrain         VARCHAR(30) DEFAULT 'flat',
  fence_removal   VARCHAR(40) DEFAULT 'none',
  canvas_json     TEXT,   -- JSON snapshot of drawing canvas
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS layout_sides (
  id          SERIAL PRIMARY KEY,
  layout_id   INTEGER NOT NULL REFERENCES layouts(id) ON DELETE CASCADE,
  side_name   VARCHAR(40),
  footage     DECIMAL(10,2) DEFAULT 0,
  notes       TEXT,
  sort_order  INTEGER DEFAULT 0
);

-- ============================================================
-- MATERIALS LINE ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS materials (
  id           SERIAL PRIMARY KEY,
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  sku          VARCHAR(40) NOT NULL,
  description  VARCHAR(200),
  unit         VARCHAR(30),
  qty_needed   DECIMAL(10,3) NOT NULL DEFAULT 0,
  unit_cost    DECIMAL(10,2) NOT NULL DEFAULT 0,
  line_total   DECIMAL(10,2) GENERATED ALWAYS AS (qty_needed * unit_cost) STORED,
  override_qty DECIMAL(10,3),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_materials_project ON materials(project_id);

-- ============================================================
-- LABOR
-- ============================================================
CREATE TABLE IF NOT EXISTS labor (
  id           SERIAL PRIMARY KEY,
  project_id   INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  crew_size    INTEGER     DEFAULT 2,
  hourly_rate  DECIMAL(8,2) DEFAULT 25,
  hours        DECIMAL(8,2) DEFAULT 8,
  markup_pct   DECIMAL(5,2) DEFAULT 0,
  total        DECIMAL(10,2),
  total_markup DECIMAL(10,2),
  notes        TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- EQUIPMENT
-- ============================================================
CREATE TABLE IF NOT EXISTS equipment (
  id           SERIAL PRIMARY KEY,
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  item_name    VARCHAR(120) NOT NULL,
  days         DECIMAL(5,1) DEFAULT 1,
  day_rate     DECIMAL(8,2) DEFAULT 0,
  line_total   DECIMAL(10,2) GENERATED ALWAYS AS (days * day_rate) STORED,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ESTIMATE SUMMARY
-- ============================================================
CREATE TABLE IF NOT EXISTS estimate_summaries (
  id               SERIAL PRIMARY KEY,
  project_id       INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  materials_total  DECIMAL(12,2) DEFAULT 0,
  labor_total      DECIMAL(12,2) DEFAULT 0,
  equipment_total  DECIMAL(12,2) DEFAULT 0,
  subtotal         DECIMAL(12,2) DEFAULT 0,
  tax_rate_pct     DECIMAL(5,2)  DEFAULT 8.25,
  tax_amount       DECIMAL(12,2) DEFAULT 0,
  profit_margin_pct DECIMAL(5,2) DEFAULT 15,
  total            DECIMAL(12,2) DEFAULT 0,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CONTRACTS
-- ============================================================
CREATE TABLE IF NOT EXISTS contracts (
  id              SERIAL PRIMARY KEY,
  project_id      INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE RESTRICT,
  contract_date   DATE,
  contract_price  DECIMAL(12,2) NOT NULL,
  deposit_amount  DECIMAL(12,2) DEFAULT 0,
  balance_due     DECIMAL(12,2),
  payment_terms   VARCHAR(80),
  start_date      DATE,
  completion_date DATE,
  terms_text      TEXT,
  signature_data  TEXT,   -- base64 PNG of customer signature
  locked          BOOLEAN NOT NULL DEFAULT FALSE,
  locked_at       TIMESTAMP,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CHANGE ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS change_orders (
  id           SERIAL PRIMARY KEY,
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  co_number    INTEGER NOT NULL,  -- 1, 2, 3 ...
  co_date      DATE    NOT NULL DEFAULT CURRENT_DATE,
  description  TEXT    NOT NULL,
  amount       DECIMAL(10,2) NOT NULL DEFAULT 0,
  reason       VARCHAR(80),
  status       VARCHAR(20) NOT NULL DEFAULT 'Pending',  -- Pending | Approved | Rejected
  signed       BOOLEAN NOT NULL DEFAULT FALSE,
  signature_data TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, co_number)
);
CREATE INDEX idx_co_project ON change_orders(project_id);

-- ============================================================
-- INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id           SERIAL PRIMARY KEY,
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  invoice_number VARCHAR(40) NOT NULL UNIQUE,
  invoice_date DATE    NOT NULL DEFAULT CURRENT_DATE,
  amount       DECIMAL(12,2) NOT NULL,
  paid         DECIMAL(12,2) NOT NULL DEFAULT 0,
  balance      DECIMAL(12,2),
  notes        TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SCHEDULE
-- ============================================================
CREATE TABLE IF NOT EXISTS schedules (
  id            SERIAL PRIMARY KEY,
  project_id    INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  start_date    DATE,
  end_date      DATE,
  crew_assigned VARCHAR(200),
  priority      VARCHAR(20) DEFAULT 'Normal',
  notes         TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CREW MEMBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS crew_members (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(120) NOT NULL,
  role         VARCHAR(60),
  hourly_rate  DECIMAL(8,2) DEFAULT 0,
  phone        VARCHAR(30),
  email        VARCHAR(120),
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_crew (
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  crew_id      INTEGER NOT NULL REFERENCES crew_members(id) ON DELETE RESTRICT,
  PRIMARY KEY (project_id, crew_id)
);

-- ============================================================
-- PURCHASE ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS purchase_orders (
  id           SERIAL PRIMARY KEY,
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
  po_number    VARCHAR(40) NOT NULL UNIQUE,
  supplier     VARCHAR(120),
  po_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  total        DECIMAL(12,2) DEFAULT 0,
  status       VARCHAR(30) DEFAULT 'Pending',   -- Pending | Approved | Received
  notes        TEXT,
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROJECT TRACKING LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS tracking_log (
  id           SERIAL PRIMARY KEY,
  project_id   INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  log_date     DATE    NOT NULL DEFAULT CURRENT_DATE,
  note         TEXT    NOT NULL,
  logged_by    VARCHAR(80),
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_tracking_project ON tracking_log(project_id);

-- ============================================================
-- SIGN-OFF
-- ============================================================
CREATE TABLE IF NOT EXISTS sign_offs (
  id               SERIAL PRIMARY KEY,
  project_id       INTEGER NOT NULL UNIQUE REFERENCES projects(id) ON DELETE RESTRICT,
  completion_date  DATE,
  final_collected  DECIMAL(12,2) DEFAULT 0,
  satisfaction     INTEGER CHECK (satisfaction BETWEEN 1 AND 5),
  notes            TEXT,
  signature_data   TEXT,
  completed        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INVENTORY / PRODUCT CATALOG
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id            SERIAL PRIMARY KEY,
  sku           VARCHAR(40)  NOT NULL UNIQUE,
  description   VARCHAR(200) NOT NULL,
  department    VARCHAR(60),
  category      VARCHAR(60),
  unit          VARCHAR(30),
  unit_cost     DECIMAL(10,2) NOT NULL DEFAULT 0,
  retail_price  DECIMAL(10,2),
  on_hand       DECIMAL(10,3) DEFAULT 0,
  reorder_point DECIMAL(10,3) DEFAULT 0,
  supplier      VARCHAR(120),
  upc           VARCHAR(30),
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_products_dept ON products(department);
CREATE INDEX idx_products_sku  ON products(sku);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
