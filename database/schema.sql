-- ============================================================
-- FENCE DEPOT FENCE ESTIMATOR
-- database/schema.sql — Complete Database Schema
-- Engine: PostgreSQL 14+
-- Tables: users, projects, fence_specs, estimates, contracts,
--         change_orders, sign_offs, notes, inventory
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE 1: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    username      VARCHAR(50)  NOT NULL UNIQUE,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'estimator'
                  CHECK (role IN ('admin','estimator','crew')),
    company       VARCHAR(100) NOT NULL,
    phone         VARCHAR(20),
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email    ON users (email);
CREATE INDEX idx_users_username ON users (username);

-- ============================================================
-- TABLE 2: projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_number  VARCHAR(30)  NOT NULL UNIQUE,
    status          VARCHAR(20)  NOT NULL DEFAULT 'open'
                    CHECK (status IN ('open','pending','signed','in_progress','complete','cancelled')),
    customer_name   VARCHAR(150) NOT NULL,
    customer_phone  VARCHAR(30),
    customer_email  VARCHAR(150),
    job_address     VARCHAR(255) NOT NULL,
    job_city        VARCHAR(80),
    job_state       CHAR(2),
    job_zip         VARCHAR(10),
    notes           TEXT,
    created_by      UUID         REFERENCES users(id) ON DELETE SET NULL,
    assigned_to     UUID         REFERENCES users(id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_status      ON projects (status);
CREATE INDEX idx_projects_customer    ON projects (customer_name);
CREATE INDEX idx_projects_created_by  ON projects (created_by);

-- ============================================================
-- TABLE 3: fence_specs
-- ============================================================
CREATE TABLE IF NOT EXISTS fence_specs (
    id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID         NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    fence_type      VARCHAR(50)  NOT NULL,
    fence_height    NUMERIC(5,2) NOT NULL,
    color_finish    VARCHAR(50),
    linear_footage  NUMERIC(10,2) NOT NULL CHECK (linear_footage > 0),
    num_gates       INTEGER       NOT NULL DEFAULT 0,
    terrain         VARCHAR(30)   NOT NULL DEFAULT 'flat'
                    CHECK (terrain IN ('flat','slight_slope','steep_slope','rocky')),
    special_notes   TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fence_specs_project ON fence_specs (project_id);

-- ============================================================
-- TABLE 4: estimates
-- ============================================================
CREATE TABLE IF NOT EXISTS estimates (
    id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id        UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    fence_spec_id     UUID          REFERENCES fence_specs(id) ON DELETE SET NULL,
    estimate_number   VARCHAR(30)   NOT NULL UNIQUE,
    status            VARCHAR(20)   NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft','sent','approved','rejected','expired')),
    materials_cost    NUMERIC(12,2) NOT NULL DEFAULT 0,
    labor_cost        NUMERIC(12,2) NOT NULL DEFAULT 0,
    overhead_cost     NUMERIC(12,2) NOT NULL DEFAULT 0,
    markup_pct        NUMERIC(5,2)  NOT NULL DEFAULT 35.00,
    tax_rate          NUMERIC(5,2)  NOT NULL DEFAULT 8.25,
    tax_amount        NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_amount   NUMERIC(12,2) NOT NULL DEFAULT 0,
    subtotal          NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount      NUMERIC(12,2) NOT NULL DEFAULT 0,
    valid_until       DATE,
    notes             TEXT,
    line_items        JSONB,
    pricing_locked    BOOLEAN       NOT NULL DEFAULT FALSE,
    pricing_locked_at TIMESTAMPTZ,
    created_by        UUID          REFERENCES users(id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_estimates_project    ON estimates (project_id);
CREATE INDEX idx_estimates_status     ON estimates (status);
CREATE INDEX idx_estimates_number     ON estimates (estimate_number);

-- ============================================================
-- TABLE 5: contracts
-- ============================================================
CREATE TABLE IF NOT EXISTS contracts (
    id                  UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id          UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    estimate_id         UUID          REFERENCES estimates(id) ON DELETE SET NULL,
    contract_number     VARCHAR(30)   NOT NULL UNIQUE,
    status              VARCHAR(20)   NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','signed','cancelled','complete')),
    contract_amount     NUMERIC(12,2) NOT NULL,
    deposit_required    NUMERIC(12,2) NOT NULL DEFAULT 0,
    deposit_received    NUMERIC(12,2) NOT NULL DEFAULT 0,
    deposit_date        DATE,
    start_date          DATE,
    estimated_end_date  DATE,
    actual_end_date     DATE,
    payment_terms       VARCHAR(100),
    contract_body       TEXT,
    special_conditions  TEXT,
    signed_by_customer  VARCHAR(150),
    signed_date         DATE,
    signed_by_company   VARCHAR(150),
    created_by          UUID          REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contracts_project  ON contracts (project_id);
CREATE INDEX idx_contracts_status   ON contracts (status);

-- ============================================================
-- TABLE 6: change_orders
-- ============================================================
CREATE TABLE IF NOT EXISTS change_orders (
    id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id       UUID          NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    project_id        UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    co_number         VARCHAR(30)   NOT NULL UNIQUE,
    status            VARCHAR(20)   NOT NULL DEFAULT 'pending'
                      CHECK (status IN ('pending','approved','rejected','complete')),
    description       TEXT          NOT NULL,
    reason            TEXT,
    materials_change  NUMERIC(12,2) NOT NULL DEFAULT 0,
    labor_change      NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_change      NUMERIC(12,2) NOT NULL DEFAULT 0,
    approved_by       VARCHAR(150),
    approved_date     DATE,
    customer_signed   VARCHAR(150),
    customer_sign_date DATE,
    created_by        UUID          REFERENCES users(id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_co_contract  ON change_orders (contract_id);
CREATE INDEX idx_co_project   ON change_orders (project_id);

-- ============================================================
-- TABLE 7: sign_offs
-- ============================================================
CREATE TABLE IF NOT EXISTS sign_offs (
    id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id        UUID          NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contract_id       UUID          REFERENCES contracts(id) ON DELETE SET NULL,
    sign_off_type     VARCHAR(30)   NOT NULL DEFAULT 'completion'
                      CHECK (sign_off_type IN ('completion','inspection','change_order','deposit')),
    signed_by         VARCHAR(150)  NOT NULL,
    signed_date       DATE          NOT NULL,
    signature_data    TEXT,
    notes             TEXT,
    attachments       JSONB,
    created_by        UUID          REFERENCES users(id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_signoffs_project  ON sign_offs (project_id);

-- ============================================================
-- TABLE 8: notes (Central Hub)
-- ============================================================
CREATE TABLE IF NOT EXISTS notes (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id  UUID         REFERENCES projects(id)  ON DELETE CASCADE,
    estimate_id UUID         REFERENCES estimates(id) ON DELETE CASCADE,
    contract_id UUID         REFERENCES contracts(id) ON DELETE CASCADE,
    note_type   VARCHAR(30)  NOT NULL DEFAULT 'general'
                CHECK (note_type IN ('general','site','customer','materials','labor','billing','follow_up')),
    title       VARCHAR(200),
    body        TEXT          NOT NULL,
    is_pinned   BOOLEAN       NOT NULL DEFAULT FALSE,
    created_by  UUID          REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notes_project  ON notes (project_id);
CREATE INDEX idx_notes_estimate ON notes (estimate_id);

-- ============================================================
-- TABLE 9: inventory
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
    id              UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    plu             VARCHAR(50)   NOT NULL UNIQUE,
    sku             VARCHAR(50),
    description     VARCHAR(255)  NOT NULL,
    department      VARCHAR(100),
    category        VARCHAR(100),
    uom             VARCHAR(20)   NOT NULL DEFAULT 'EA',
    cost_price      NUMERIC(12,4) NOT NULL DEFAULT 0,
    sell_price      NUMERIC(12,4) NOT NULL DEFAULT 0,
    markup_pct      NUMERIC(5,2)  GENERATED ALWAYS AS
                    (CASE WHEN cost_price > 0
                     THEN ROUND(((sell_price - cost_price) / cost_price) * 100, 2)
                     ELSE 0 END) STORED,
    qty_on_hand     NUMERIC(12,2) NOT NULL DEFAULT 0,
    qty_on_order    NUMERIC(12,2) NOT NULL DEFAULT 0,
    reorder_point   NUMERIC(12,2) NOT NULL DEFAULT 0,
    preferred_supplier VARCHAR(100),
    supplier_sku    VARCHAR(50),
    is_active       BOOLEAN       NOT NULL DEFAULT TRUE,
    notes           TEXT,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_plu        ON inventory (plu);
CREATE INDEX idx_inventory_dept       ON inventory (department);
CREATE INDEX idx_inventory_active     ON inventory (is_active);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['users','projects','estimates','contracts','change_orders','notes','inventory']
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at()', t);
  END LOOP;
END;
$$;

-- ============================================================
-- VIEWS
-- ============================================================

CREATE OR REPLACE VIEW v_project_summary AS
SELECT
    p.id,
    p.project_number,
    p.status,
    p.customer_name,
    p.job_address,
    p.job_city,
    p.job_state,
    fs.fence_type,
    fs.fence_height,
    fs.linear_footage,
    e.estimate_number,
    e.total_amount AS estimate_total,
    c.contract_number,
    c.contract_amount,
    p.created_at
FROM projects p
LEFT JOIN fence_specs fs ON fs.project_id = p.id
LEFT JOIN estimates e    ON e.project_id  = p.id AND e.status = 'approved'
LEFT JOIN contracts c    ON c.project_id  = p.id AND c.status IN ('signed','complete');

CREATE OR REPLACE VIEW v_monthly_revenue AS
SELECT
    DATE_TRUNC('month', c.updated_at) AS month,
    COUNT(*)                           AS jobs,
    SUM(c.contract_amount)             AS revenue
FROM contracts c
WHERE c.status IN ('signed','complete')
GROUP BY 1
ORDER BY 1;
