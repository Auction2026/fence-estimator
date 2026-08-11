-- ============================================================
-- FENCE DEPOT ESTIMATOR - DATABASE SCHEMA
-- Version: 1.0.0
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    role            VARCHAR(50) DEFAULT 'estimator',   -- admin, estimator, viewer
    is_active       BOOLEAN DEFAULT TRUE,
    last_login      TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- ============================================================
-- CUSTOMERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name    VARCHAR(255),
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(30),
    address_line1   VARCHAR(255),
    address_line2   VARCHAR(255),
    city            VARCHAR(100),
    state           VARCHAR(50),
    zip             VARCHAR(20),
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_customers_email     ON customers(email);
CREATE INDEX idx_customers_last_name ON customers(last_name);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    project_number  VARCHAR(50) UNIQUE NOT NULL,
    name            VARCHAR(255) NOT NULL,
    status          VARCHAR(50) DEFAULT 'draft',  -- draft, estimate, contract, in_progress, complete, cancelled
    site_address    VARCHAR(255),
    site_city       VARCHAR(100),
    site_state      VARCHAR(50),
    site_zip        VARCHAR(20),
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_customer_id ON projects(customer_id);
CREATE INDEX idx_projects_status      ON projects(status);
CREATE INDEX idx_projects_number      ON projects(project_number);

-- ============================================================
-- FENCE SPECIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS fence_specs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    fence_type      VARCHAR(100) NOT NULL,  -- chain-link, wood, vinyl, aluminum, wrought-iron
    height          NUMERIC(5,2),           -- feet
    gauge           VARCHAR(20),
    color           VARCHAR(50),
    total_linear_ft NUMERIC(10,2),
    gate_count      INTEGER DEFAULT 0,
    gate_width_ft   NUMERIC(5,2),
    top_rail        BOOLEAN DEFAULT TRUE,
    bottom_tension  BOOLEAN DEFAULT FALSE,
    barbed_wire     BOOLEAN DEFAULT FALSE,
    privacy_slats   BOOLEAN DEFAULT FALSE,
    post_spacing_ft NUMERIC(5,2) DEFAULT 10,
    post_embed_ft   NUMERIC(5,2) DEFAULT 2,
    concrete_bags   INTEGER DEFAULT 0,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_fence_specs_project ON fence_specs(project_id);

-- ============================================================
-- ESTIMATES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS estimates (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id        UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_by        UUID REFERENCES users(id) ON DELETE SET NULL,
    estimate_number   VARCHAR(50) UNIQUE NOT NULL,
    status            VARCHAR(50) DEFAULT 'draft',  -- draft, sent, accepted, rejected, expired
    valid_until       DATE,
    subtotal          NUMERIC(12,2) DEFAULT 0,
    tax_rate          NUMERIC(5,4) DEFAULT 0.0875,
    tax_amount        NUMERIC(12,2) DEFAULT 0,
    discount_pct      NUMERIC(5,4) DEFAULT 0,
    discount_amount   NUMERIC(12,2) DEFAULT 0,
    total             NUMERIC(12,2) DEFAULT 0,
    labor_cost        NUMERIC(12,2) DEFAULT 0,
    material_cost     NUMERIC(12,2) DEFAULT 0,
    markup_pct        NUMERIC(5,4) DEFAULT 0.35,
    notes             TEXT,
    price_locked      BOOLEAN DEFAULT FALSE,
    price_locked_at   TIMESTAMP,
    sent_at           TIMESTAMP,
    accepted_at       TIMESTAMP,
    created_at        TIMESTAMP DEFAULT NOW(),
    updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_estimates_project ON estimates(project_id);
CREATE INDEX idx_estimates_status  ON estimates(status);
CREATE INDEX idx_estimates_number  ON estimates(estimate_number);

-- ============================================================
-- ESTIMATE LINE ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS estimate_line_items (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estimate_id     UUID REFERENCES estimates(id) ON DELETE CASCADE,
    product_id      UUID,                       -- references inventory
    plu             VARCHAR(50),
    description     VARCHAR(255) NOT NULL,
    category        VARCHAR(100),
    unit            VARCHAR(30),
    qty             NUMERIC(10,2) DEFAULT 1,
    unit_cost       NUMERIC(12,4),
    unit_price      NUMERIC(12,4),
    total_cost      NUMERIC(12,2),
    total_price     NUMERIC(12,2),
    sort_order      INTEGER DEFAULT 0,
    notes           TEXT
);

CREATE INDEX idx_line_items_estimate ON estimate_line_items(estimate_id);

-- ============================================================
-- INVENTORY / PRODUCT CATALOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plu             VARCHAR(50) UNIQUE NOT NULL,
    sku             VARCHAR(100),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    department      VARCHAR(100),
    category        VARCHAR(100),
    unit            VARCHAR(30) DEFAULT 'each',  -- each, lf, sf, ton, bag, roll, box
    cost            NUMERIC(10,4),
    price           NUMERIC(10,4),
    tax_code        VARCHAR(30) DEFAULT 'TAXABLE',
    on_hand         NUMERIC(10,2) DEFAULT 0,
    reorder_point   NUMERIC(10,2) DEFAULT 0,
    vendor          VARCHAR(255),
    vendor_sku      VARCHAR(100),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventory_plu        ON inventory(plu);
CREATE INDEX idx_inventory_department ON inventory(department);
CREATE INDEX idx_inventory_category   ON inventory(category);
CREATE INDEX idx_inventory_name       ON inventory(name);

-- ============================================================
-- CONTRACTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contracts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    estimate_id     UUID REFERENCES estimates(id) ON DELETE SET NULL,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    status          VARCHAR(50) DEFAULT 'pending',  -- pending, signed, in_progress, complete, cancelled
    signed_date     DATE,
    start_date      DATE,
    completion_date DATE,
    contract_total  NUMERIC(12,2),
    deposit_amount  NUMERIC(12,2),
    deposit_paid    BOOLEAN DEFAULT FALSE,
    deposit_date    DATE,
    terms_text      TEXT,
    signature_url   VARCHAR(500),
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contracts_project  ON contracts(project_id);
CREATE INDEX idx_contracts_estimate ON contracts(estimate_id);
CREATE INDEX idx_contracts_status   ON contracts(status);

-- ============================================================
-- CHANGE ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS change_orders (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id     UUID REFERENCES contracts(id) ON DELETE CASCADE,
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    co_number       VARCHAR(50) UNIQUE NOT NULL,
    status          VARCHAR(50) DEFAULT 'pending',  -- pending, approved, rejected, complete
    reason          TEXT,
    description     TEXT,
    amount          NUMERIC(12,2) DEFAULT 0,
    approved_by     UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at     TIMESTAMP,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_change_orders_contract ON change_orders(contract_id);
CREATE INDEX idx_change_orders_project  ON change_orders(project_id);

-- ============================================================
-- SIGN-OFFS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS sign_offs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    signed_by_name  VARCHAR(255),
    signed_by_email VARCHAR(255),
    sign_off_date   DATE,
    completion_pct  NUMERIC(5,2) DEFAULT 100,
    notes           TEXT,
    signature_url   VARCHAR(500),
    photos          JSONB DEFAULT '[]',
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sign_offs_project ON sign_offs(project_id);

-- ============================================================
-- NOTES TABLE (Central Hub)
-- ============================================================
CREATE TABLE IF NOT EXISTS notes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_by      UUID REFERENCES users(id) ON DELETE SET NULL,
    note_type       VARCHAR(50) DEFAULT 'general',  -- general, site, material, labor, customer
    subject         VARCHAR(255),
    body            TEXT,
    attachments     JSONB DEFAULT '[]',
    is_pinned       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_project ON notes(project_id);
CREATE INDEX idx_notes_type    ON notes(note_type);

-- ============================================================
-- CREW TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS crew (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(255) NOT NULL,
    role            VARCHAR(100),   -- foreman, installer, laborer, driver
    phone           VARCHAR(30),
    email           VARCHAR(255),
    hourly_rate     NUMERIC(8,2),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PROJECT CREW ASSIGNMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS project_crew (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    crew_id         UUID REFERENCES crew(id) ON DELETE CASCADE,
    role_on_project VARCHAR(100),
    start_date      DATE,
    end_date        DATE,
    hours_estimated NUMERIC(8,2),
    hours_actual    NUMERIC(8,2),
    notes           TEXT
);

CREATE INDEX idx_project_crew_project ON project_crew(project_id);
CREATE INDEX idx_project_crew_crew    ON project_crew(crew_id);

-- ============================================================
-- PERMITS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS permits (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    permit_number   VARCHAR(100),
    permit_type     VARCHAR(100),
    issuing_agency  VARCHAR(255),
    status          VARCHAR(50) DEFAULT 'not_required',  -- not_required, pending, approved, rejected, expired
    applied_date    DATE,
    approved_date   DATE,
    expiry_date     DATE,
    cost            NUMERIC(10,2) DEFAULT 0,
    notes           TEXT,
    created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_permits_project ON permits(project_id);

-- ============================================================
-- AUDIT LOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id              BIGSERIAL PRIMARY KEY,
    table_name      VARCHAR(100),
    record_id       UUID,
    action          VARCHAR(20),   -- INSERT, UPDATE, DELETE
    changed_by      UUID,
    old_data        JSONB,
    new_data        JSONB,
    changed_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_table    ON audit_log(table_name);
CREATE INDEX idx_audit_record   ON audit_log(record_id);
CREATE INDEX idx_audit_changed  ON audit_log(changed_at);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_estimates_updated_at
    BEFORE UPDATE ON estimates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_contracts_updated_at
    BEFORE UPDATE ON contracts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_inventory_updated_at
    BEFORE UPDATE ON inventory
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_change_orders_updated_at
    BEFORE UPDATE ON change_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
