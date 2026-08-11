-- ============================================================
-- FENCE ESTIMATOR - DATABASE SCHEMA
-- Version: 1.0.0
-- Description: Complete schema for the Fence Estimator system
-- Tables: 9 (customers, projects, estimates, estimate_items,
--         materials, suppliers, supplier_materials, users, settings)
-- ============================================================

-- Use PostgreSQL syntax; compatible with MySQL 8+ with minor tweaks

-- ============================================================
-- DROP ORDER (reverse dependency)
-- ============================================================
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS estimate_items CASCADE;
DROP TABLE IF EXISTS estimates CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS supplier_materials CASCADE;
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================
-- TABLE 1: users
-- ============================================================
CREATE TABLE users (
    id               SERIAL PRIMARY KEY,
    username         VARCHAR(100) NOT NULL UNIQUE,
    email            VARCHAR(255) NOT NULL UNIQUE,
    password_hash    VARCHAR(255) NOT NULL,
    full_name        VARCHAR(255),
    role             VARCHAR(50)  NOT NULL DEFAULT 'estimator'
                         CHECK (role IN ('admin','estimator','viewer')),
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login       TIMESTAMP,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Application users who create and manage estimates';

-- ============================================================
-- TABLE 2: settings
-- ============================================================
CREATE TABLE settings (
    id               SERIAL PRIMARY KEY,
    setting_key      VARCHAR(100) NOT NULL UNIQUE,
    setting_value    TEXT,
    setting_group    VARCHAR(100) NOT NULL DEFAULT 'general',
    description      VARCHAR(500),
    updated_by       INTEGER REFERENCES users(id),
    updated_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE settings IS 'Application-wide configuration settings';

-- ============================================================
-- TABLE 3: customers
-- ============================================================
CREATE TABLE customers (
    id               SERIAL PRIMARY KEY,
    first_name       VARCHAR(100) NOT NULL,
    last_name        VARCHAR(100) NOT NULL,
    company_name     VARCHAR(255),
    email            VARCHAR(255),
    phone            VARCHAR(30),
    address_line1    VARCHAR(255),
    address_line2    VARCHAR(255),
    city             VARCHAR(100),
    state            VARCHAR(50),
    zip_code         VARCHAR(20),
    notes            TEXT,
    customer_type    VARCHAR(50)  NOT NULL DEFAULT 'residential'
                         CHECK (customer_type IN ('residential','commercial','government','hoa')),
    created_by       INTEGER REFERENCES users(id),
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_last_name ON customers(last_name);
CREATE INDEX idx_customers_email     ON customers(email);
CREATE INDEX idx_customers_zip       ON customers(zip_code);

COMMENT ON TABLE customers IS 'Customers who request fence estimates or projects';

-- ============================================================
-- TABLE 4: suppliers
-- ============================================================
CREATE TABLE suppliers (
    id               SERIAL PRIMARY KEY,
    supplier_name    VARCHAR(255) NOT NULL,
    contact_name     VARCHAR(255),
    email            VARCHAR(255),
    phone            VARCHAR(30),
    address_line1    VARCHAR(255),
    city             VARCHAR(100),
    state            VARCHAR(50),
    zip_code         VARCHAR(20),
    account_number   VARCHAR(100),
    payment_terms    VARCHAR(100),
    lead_time_days   INTEGER      DEFAULT 3,
    is_preferred     BOOLEAN      NOT NULL DEFAULT FALSE,
    notes            TEXT,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE suppliers IS 'Fence material suppliers and vendors';

-- ============================================================
-- TABLE 5: materials
-- ============================================================
CREATE TABLE materials (
    id               SERIAL PRIMARY KEY,
    sku              VARCHAR(100) NOT NULL UNIQUE,
    plu              VARCHAR(50),
    name             VARCHAR(255) NOT NULL,
    description      TEXT,
    category         VARCHAR(100) NOT NULL,
    subcategory      VARCHAR(100),
    department       VARCHAR(100),
    unit_of_measure  VARCHAR(30)  NOT NULL DEFAULT 'EA',
    unit_cost        NUMERIC(10,4) NOT NULL DEFAULT 0,
    unit_price       NUMERIC(10,4) NOT NULL DEFAULT 0,
    markup_pct       NUMERIC(5,2)  NOT NULL DEFAULT 30.00,
    weight_lbs       NUMERIC(8,3),
    gauge            VARCHAR(20),
    diameter_inches  NUMERIC(6,3),
    height_ft        NUMERIC(6,2),
    length_ft        NUMERIC(6,2),
    width_ft         NUMERIC(6,2),
    color            VARCHAR(50),
    coating          VARCHAR(100),
    material_type    VARCHAR(50),
    fence_type       VARCHAR(50),
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,
    min_order_qty    INTEGER      DEFAULT 1,
    stock_qty        INTEGER      DEFAULT 0,
    reorder_point    INTEGER      DEFAULT 10,
    notes            TEXT,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_materials_sku        ON materials(sku);
CREATE INDEX idx_materials_category   ON materials(category);
CREATE INDEX idx_materials_fence_type ON materials(fence_type);
CREATE INDEX idx_materials_is_active  ON materials(is_active);

COMMENT ON TABLE materials IS 'Fence materials inventory catalog with full POS data';

-- ============================================================
-- TABLE 6: supplier_materials  (junction table)
-- ============================================================
CREATE TABLE supplier_materials (
    id               SERIAL PRIMARY KEY,
    supplier_id      INTEGER NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    material_id      INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    supplier_sku     VARCHAR(100),
    supplier_price   NUMERIC(10,4),
    lead_time_days   INTEGER,
    is_preferred     BOOLEAN NOT NULL DEFAULT FALSE,
    last_quoted_at   TIMESTAMP,
    notes            TEXT,
    UNIQUE (supplier_id, material_id)
);

CREATE INDEX idx_sup_mat_supplier ON supplier_materials(supplier_id);
CREATE INDEX idx_sup_mat_material ON supplier_materials(material_id);

COMMENT ON TABLE supplier_materials IS 'Which suppliers carry which materials and at what price';

-- ============================================================
-- TABLE 7: projects
-- ============================================================
CREATE TABLE projects (
    id               SERIAL PRIMARY KEY,
    project_number   VARCHAR(50)  NOT NULL UNIQUE,
    project_name     VARCHAR(255) NOT NULL,
    customer_id      INTEGER NOT NULL REFERENCES customers(id),
    status           VARCHAR(50)  NOT NULL DEFAULT 'new'
                         CHECK (status IN ('new','estimating','estimate_sent','approved',
                                           'scheduled','in_progress','completed','cancelled')),
    fence_type       VARCHAR(100),
    total_linear_ft  NUMERIC(10,2),
    site_address     VARCHAR(255),
    site_city        VARCHAR(100),
    site_state       VARCHAR(50),
    site_zip         VARCHAR(20),
    start_date       DATE,
    completion_date  DATE,
    crew_size        INTEGER,
    permit_required  BOOLEAN  DEFAULT FALSE,
    permit_number    VARCHAR(100),
    notes            TEXT,
    created_by       INTEGER REFERENCES users(id),
    assigned_to      INTEGER REFERENCES users(id),
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_customer  ON projects(customer_id);
CREATE INDEX idx_projects_status    ON projects(status);
CREATE INDEX idx_projects_number    ON projects(project_number);

COMMENT ON TABLE projects IS 'Fence installation projects linked to customers';

-- ============================================================
-- TABLE 8: estimates
-- ============================================================
CREATE TABLE estimates (
    id               SERIAL PRIMARY KEY,
    estimate_number  VARCHAR(50)  NOT NULL UNIQUE,
    project_id       INTEGER REFERENCES projects(id),
    customer_id      INTEGER NOT NULL REFERENCES customers(id),
    version          INTEGER NOT NULL DEFAULT 1,
    status           VARCHAR(50)  NOT NULL DEFAULT 'draft'
                         CHECK (status IN ('draft','sent','approved','rejected','expired')),
    fence_type       VARCHAR(100) NOT NULL,
    fence_height_ft  NUMERIC(5,2),
    fence_color      VARCHAR(50),
    total_linear_ft  NUMERIC(10,2) NOT NULL DEFAULT 0,
    num_gates        INTEGER       DEFAULT 0,
    -- Cost breakdown
    material_cost    NUMERIC(12,2) NOT NULL DEFAULT 0,
    labor_cost       NUMERIC(12,2) NOT NULL DEFAULT 0,
    equipment_cost   NUMERIC(12,2) NOT NULL DEFAULT 0,
    permit_cost      NUMERIC(12,2) NOT NULL DEFAULT 0,
    subtotal         NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_rate         NUMERIC(5,4)  NOT NULL DEFAULT 0.0875,
    tax_amount       NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_pct     NUMERIC(5,2)  NOT NULL DEFAULT 0,
    discount_amount  NUMERIC(12,2) NOT NULL DEFAULT 0,
    total_amount     NUMERIC(12,2) NOT NULL DEFAULT 0,
    -- Pricing lock
    price_locked     BOOLEAN       NOT NULL DEFAULT FALSE,
    price_locked_at  TIMESTAMP,
    price_locked_by  INTEGER REFERENCES users(id),
    -- Notes & validity
    notes            TEXT,
    terms_conditions TEXT,
    valid_until      DATE,
    sent_at          TIMESTAMP,
    approved_at      TIMESTAMP,
    created_by       INTEGER REFERENCES users(id),
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_estimates_customer ON estimates(customer_id);
CREATE INDEX idx_estimates_project  ON estimates(project_id);
CREATE INDEX idx_estimates_status   ON estimates(status);
CREATE INDEX idx_estimates_number   ON estimates(estimate_number);

COMMENT ON TABLE estimates IS 'Fence installation estimates with full cost breakdown';

-- ============================================================
-- TABLE 9: estimate_items  (line items)
-- ============================================================
CREATE TABLE estimate_items (
    id               SERIAL PRIMARY KEY,
    estimate_id      INTEGER NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
    material_id      INTEGER REFERENCES materials(id),
    line_number      INTEGER NOT NULL DEFAULT 1,
    item_type        VARCHAR(50) NOT NULL DEFAULT 'material'
                         CHECK (item_type IN ('material','labor','equipment','permit','misc')),
    description      VARCHAR(500) NOT NULL,
    quantity         NUMERIC(10,3) NOT NULL DEFAULT 1,
    unit_of_measure  VARCHAR(30)   NOT NULL DEFAULT 'EA',
    unit_cost        NUMERIC(10,4) NOT NULL DEFAULT 0,
    unit_price       NUMERIC(10,4) NOT NULL DEFAULT 0,
    total_cost       NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED,
    total_price      NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    notes            TEXT,
    created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_est_items_estimate ON estimate_items(estimate_id);
CREATE INDEX idx_est_items_material ON estimate_items(material_id);

COMMENT ON TABLE estimate_items IS 'Line items for each estimate (materials, labor, etc.)';

-- ============================================================
-- TABLE 10: audit_log
-- ============================================================
CREATE TABLE audit_log (
    id               BIGSERIAL PRIMARY KEY,
    table_name       VARCHAR(100) NOT NULL,
    record_id        INTEGER      NOT NULL,
    action           VARCHAR(20)  NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
    old_values       JSONB,
    new_values       JSONB,
    changed_by       INTEGER REFERENCES users(id),
    changed_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    ip_address       INET,
    user_agent       VARCHAR(500)
);

CREATE INDEX idx_audit_table  ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_user   ON audit_log(changed_by);
CREATE INDEX idx_audit_time   ON audit_log(changed_at);

COMMENT ON TABLE audit_log IS 'Full audit trail for all data changes';

-- ============================================================
-- VIEWS
-- ============================================================

CREATE OR REPLACE VIEW v_estimate_summary AS
SELECT
    e.id,
    e.estimate_number,
    e.version,
    e.status,
    e.fence_type,
    e.fence_height_ft,
    e.total_linear_ft,
    e.num_gates,
    e.material_cost,
    e.labor_cost,
    e.subtotal,
    e.tax_amount,
    e.total_amount,
    e.price_locked,
    e.valid_until,
    e.created_at,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.email AS customer_email,
    c.phone AS customer_phone,
    p.project_number,
    p.project_name,
    u.full_name AS created_by_name
FROM estimates e
JOIN customers c ON c.id = e.customer_id
LEFT JOIN projects p ON p.id = e.project_id
LEFT JOIN users u ON u.id = e.created_by;

CREATE OR REPLACE VIEW v_project_summary AS
SELECT
    p.id,
    p.project_number,
    p.project_name,
    p.status,
    p.fence_type,
    p.total_linear_ft,
    p.start_date,
    p.completion_date,
    p.site_address || ', ' || p.site_city || ', ' || p.site_state AS site_full_address,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.phone AS customer_phone,
    c.email AS customer_email,
    u.full_name AS assigned_to_name,
    (SELECT COUNT(*) FROM estimates e WHERE e.project_id = p.id) AS estimate_count,
    (SELECT MAX(e.total_amount) FROM estimates e
     WHERE e.project_id = p.id AND e.status = 'approved') AS approved_amount
FROM projects p
JOIN customers c ON c.id = p.customer_id
LEFT JOIN users u ON u.id = p.assigned_to;

CREATE OR REPLACE VIEW v_materials_with_suppliers AS
SELECT
    m.id,
    m.sku,
    m.plu,
    m.name,
    m.category,
    m.fence_type,
    m.unit_of_measure,
    m.unit_cost,
    m.unit_price,
    m.markup_pct,
    m.gauge,
    m.height_ft,
    m.length_ft,
    m.color,
    m.stock_qty,
    m.is_active,
    s.supplier_name AS preferred_supplier,
    sm.supplier_price AS supplier_cost,
    sm.lead_time_days
FROM materials m
LEFT JOIN supplier_materials sm ON sm.material_id = m.id AND sm.is_preferred = TRUE
LEFT JOIN suppliers s ON s.id = sm.supplier_id;

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at columns
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_estimates_updated_at
    BEFORE UPDATE ON estimates
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_materials_updated_at
    BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- Auto-generate estimate number: EST-YYYY-NNNN
CREATE OR REPLACE FUNCTION fn_generate_estimate_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_year   TEXT;
    v_seq    INTEGER;
    v_number TEXT;
BEGIN
    IF NEW.estimate_number IS NULL OR NEW.estimate_number = '' THEN
        v_year := TO_CHAR(NOW(), 'YYYY');
        SELECT COALESCE(MAX(CAST(SPLIT_PART(estimate_number, '-', 3) AS INTEGER)), 0) + 1
        INTO v_seq
        FROM estimates
        WHERE estimate_number LIKE 'EST-' || v_year || '-%';
        v_number := 'EST-' || v_year || '-' || LPAD(v_seq::TEXT, 4, '0');
        NEW.estimate_number := v_number;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_estimates_number
    BEFORE INSERT ON estimates
    FOR EACH ROW EXECUTE FUNCTION fn_generate_estimate_number();

-- Auto-generate project number: PRJ-YYYY-NNNN
CREATE OR REPLACE FUNCTION fn_generate_project_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_year   TEXT;
    v_seq    INTEGER;
    v_number TEXT;
BEGIN
    IF NEW.project_number IS NULL OR NEW.project_number = '' THEN
        v_year := TO_CHAR(NOW(), 'YYYY');
        SELECT COALESCE(MAX(CAST(SPLIT_PART(project_number, '-', 3) AS INTEGER)), 0) + 1
        INTO v_seq
        FROM projects
        WHERE project_number LIKE 'PRJ-' || v_year || '-%';
        v_number := 'PRJ-' || v_year || '-' || LPAD(v_seq::TEXT, 4, '0');
        NEW.project_number := v_number;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_projects_number
    BEFORE INSERT ON projects
    FOR EACH ROW EXECUTE FUNCTION fn_generate_project_number();

-- Recalculate estimate totals whenever items change
CREATE OR REPLACE FUNCTION fn_recalculate_estimate()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_estimate_id INTEGER;
    v_mat_cost    NUMERIC(12,2);
    v_lab_cost    NUMERIC(12,2);
    v_equ_cost    NUMERIC(12,2);
    v_per_cost    NUMERIC(12,2);
    v_subtotal    NUMERIC(12,2);
    v_tax_rate    NUMERIC(5,4);
    v_tax_amt     NUMERIC(12,2);
    v_disc_pct    NUMERIC(5,2);
    v_disc_amt    NUMERIC(12,2);
    v_total       NUMERIC(12,2);
BEGIN
    v_estimate_id := COALESCE(NEW.estimate_id, OLD.estimate_id);

    SELECT
        COALESCE(SUM(CASE WHEN item_type = 'material'  THEN total_price ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN item_type = 'labor'     THEN total_price ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN item_type = 'equipment' THEN total_price ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN item_type = 'permit'    THEN total_price ELSE 0 END), 0)
    INTO v_mat_cost, v_lab_cost, v_equ_cost, v_per_cost
    FROM estimate_items
    WHERE estimate_id = v_estimate_id;

    v_subtotal := v_mat_cost + v_lab_cost + v_equ_cost + v_per_cost;

    SELECT tax_rate, discount_pct
    INTO v_tax_rate, v_disc_pct
    FROM estimates WHERE id = v_estimate_id;

    v_disc_amt := ROUND(v_subtotal * (v_disc_pct / 100.0), 2);
    v_tax_amt  := ROUND((v_subtotal - v_disc_amt) * v_tax_rate, 2);
    v_total    := v_subtotal - v_disc_amt + v_tax_amt;

    UPDATE estimates SET
        material_cost   = v_mat_cost,
        labor_cost      = v_lab_cost,
        equipment_cost  = v_equ_cost,
        permit_cost     = v_per_cost,
        subtotal        = v_subtotal,
        tax_amount      = v_tax_amt,
        discount_amount = v_disc_amt,
        total_amount    = v_total
    WHERE id = v_estimate_id;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_estimate_items_recalc
    AFTER INSERT OR UPDATE OR DELETE ON estimate_items
    FOR EACH ROW EXECUTE FUNCTION fn_recalculate_estimate();

-- ============================================================
-- DEFAULT SETTINGS
-- ============================================================
INSERT INTO settings (setting_key, setting_value, setting_group, description) VALUES
    ('company_name',          'ABC Fence Company',          'company',   'Company display name'),
    ('company_phone',         '(555) 123-4567',             'company',   'Main company phone'),
    ('company_email',         'info@abcfence.com',          'company',   'Main company email'),
    ('company_address',       '123 Main St, Houston TX',    'company',   'Company address for estimates'),
    ('company_license',       'LIC-12345',                  'company',   'Contractor license number'),
    ('default_tax_rate',      '0.0875',                     'pricing',   'Default sales tax rate (8.75%)'),
    ('default_markup',        '30.00',                      'pricing',   'Default material markup percentage'),
    ('labor_rate_per_ft',     '8.50',                       'pricing',   'Default labor cost per linear foot'),
    ('labor_rate_gate',       '75.00',                      'pricing',   'Labor cost per gate installation'),
    ('default_waste_pct',     '5.00',                       'pricing',   'Default material waste percentage'),
    ('estimate_valid_days',   '30',                         'estimates', 'Days until estimate expires'),
    ('estimate_terms',        'Payment due upon completion','estimates', 'Default payment terms'),
    ('auto_save_interval',    '60',                         'app',       'Auto-save interval in seconds'),
    ('currency_symbol',       '$',                          'app',       'Currency symbol'),
    ('date_format',           'MM/DD/YYYY',                 'app',       'Display date format');

-- ============================================================
-- SCHEMA COMPLETE
-- ============================================================
