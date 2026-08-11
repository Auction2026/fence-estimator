-- ============================================================
-- FENCE DEPOT ESTIMATOR - DATABASE SCHEMA
-- PostgreSQL 14+ / MySQL 8+ Compatible
-- Canadian Standards Compliant
-- ============================================================

-- Enable UUID generation (PostgreSQL)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE 1: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(100) NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(50)  NOT NULL DEFAULT 'estimator'
                        CHECK (role IN ('admin', 'estimator', 'crew', 'viewer')),
    company         VARCHAR(255) NOT NULL,
    phone           VARCHAR(30),
    is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
    last_login      TIMESTAMP,
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email    ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users (username);
CREATE INDEX IF NOT EXISTS idx_users_role     ON users (role);

-- ============================================================
-- TABLE 2: projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id              SERIAL PRIMARY KEY,
    project_id      VARCHAR(50)  NOT NULL UNIQUE,   -- e.g. FD-2026-00001
    customer_name   VARCHAR(255) NOT NULL,
    customer_email  VARCHAR(255) NOT NULL,
    customer_phone  VARCHAR(30)  NOT NULL,
    address         VARCHAR(500) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    province        CHAR(2)      NOT NULL,
    postal_code     VARCHAR(10)  NOT NULL,
    property_size   VARCHAR(100),
    project_notes   TEXT,
    estimator_id    INT          NOT NULL REFERENCES users (id),
    status          VARCHAR(50)  NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','estimate','contract','active','completed','cancelled')),
    created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_project_id    ON projects (project_id);
CREATE INDEX IF NOT EXISTS idx_projects_estimator_id  ON projects (estimator_id);
CREATE INDEX IF NOT EXISTS idx_projects_status        ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_customer_name ON projects (customer_name);

-- ============================================================
-- TABLE 3: fence_specifications
-- ============================================================
CREATE TABLE IF NOT EXISTS fence_specifications (
    id                  SERIAL PRIMARY KEY,
    project_id          VARCHAR(50) NOT NULL REFERENCES projects (project_id),
    fence_type          VARCHAR(50) NOT NULL
                            CHECK (fence_type IN ('Chain Link','Wood','Vinyl','Wrought Iron',
                                                   'Composite','Metal','PVC','Aluminum','Guide Rail')),
    height_ft           DECIMAL(5,2) NOT NULL,
    color               VARCHAR(100),
    post_gauge          DECIMAL(5,2),
    post_diameter_in    DECIMAL(5,3),
    gate_type           VARCHAR(50) DEFAULT 'None'
                            CHECK (gate_type IN ('Swing','Sliding','Double Swing',
                                                  'Cantilever','Barrier','None')),
    barbed_wire         BOOLEAN NOT NULL DEFAULT FALSE,
    installation_type   VARCHAR(50) NOT NULL DEFAULT 'Residential'
                            CHECK (installation_type IN ('Residential','Commercial','Industrial','Specialty')),
    linear_feet         DECIMAL(10,2) NOT NULL,
    number_posts        INT          NOT NULL,
    number_gates        INT          NOT NULL DEFAULT 0,
    special_requirements TEXT,
    canadian_standard   VARCHAR(100),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_fencespec_project ON fence_specifications (project_id);

-- ============================================================
-- TABLE 4: product_categories
-- ============================================================
CREATE TABLE IF NOT EXISTS product_categories (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(50) NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id   INT REFERENCES product_categories (id),
    sort_order  INT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- TABLE 5: products  (master inventory / price list)
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id              SERIAL PRIMARY KEY,
    plu             VARCHAR(50)    NOT NULL UNIQUE,      -- Point-of-Lookup / SKU
    category_id     INT            NOT NULL REFERENCES product_categories (id),
    name            VARCHAR(500)   NOT NULL,
    description     TEXT,
    unit            VARCHAR(30)    NOT NULL DEFAULT 'each',
    unit_cost       DECIMAL(12,4)  NOT NULL DEFAULT 0,
    markup_pct      DECIMAL(6,2)   NOT NULL DEFAULT 35.00,
    sell_price      DECIMAL(12,4)  GENERATED ALWAYS AS
                        (ROUND(unit_cost * (1 + markup_pct / 100), 4)) STORED,
    fence_type      VARCHAR(50),
    height_ft       DECIMAL(5,2),
    color           VARCHAR(100),
    gauge           VARCHAR(20),
    diameter_in     DECIMAL(6,3),
    length_ft       DECIMAL(7,2),
    material        VARCHAR(100),
    canadian_std    VARCHAR(150),
    supplier        VARCHAR(150),
    supplier_sku    VARCHAR(100),
    in_stock        BOOLEAN NOT NULL DEFAULT TRUE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_plu         ON products (plu);
CREATE INDEX IF NOT EXISTS idx_products_category    ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_fence_type  ON products (fence_type);
CREATE INDEX IF NOT EXISTS idx_products_name        ON products (name);

-- ============================================================
-- TABLE 6: estimates
-- ============================================================
CREATE TABLE IF NOT EXISTS estimates (
    id              SERIAL PRIMARY KEY,
    estimate_number VARCHAR(50)   NOT NULL UNIQUE,   -- e.g. EST-2026-00001
    project_id      VARCHAR(50)   NOT NULL REFERENCES projects (project_id),
    customer_name   VARCHAR(255)  NOT NULL,
    fence_type      VARCHAR(50)   NOT NULL,
    linear_feet     DECIMAL(10,2) NOT NULL,
    height_ft       DECIMAL(5,2),
    material_cost   DECIMAL(12,2) NOT NULL,
    labor_hours     DECIMAL(8,2),
    labor_rate      DECIMAL(8,2)  NOT NULL DEFAULT 30.00,
    labor_cost      DECIMAL(12,2),
    subtotal        DECIMAL(12,2) NOT NULL,
    tax_rate        DECIMAL(6,4)  NOT NULL DEFAULT 0.1300,
    tax_amount      DECIMAL(12,2),
    total           DECIMAL(12,2) NOT NULL,
    profit_margin   DECIMAL(6,2)  NOT NULL DEFAULT 35.00,
    is_locked       BOOLEAN       NOT NULL DEFAULT FALSE,
    locked_at       TIMESTAMP,
    locked_by       INT REFERENCES users (id),
    status          VARCHAR(50)   NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','sent','approved','rejected','expired')),
    valid_days      INT           NOT NULL DEFAULT 30,
    expires_at      TIMESTAMP,
    notes           TEXT,
    created_by      INT           NOT NULL REFERENCES users (id),
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_estimates_number     ON estimates (estimate_number);
CREATE INDEX IF NOT EXISTS idx_estimates_project    ON estimates (project_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status     ON estimates (status);
CREATE INDEX IF NOT EXISTS idx_estimates_created_by ON estimates (created_by);

-- ============================================================
-- TABLE 7: estimate_line_items
-- ============================================================
CREATE TABLE IF NOT EXISTS estimate_line_items (
    id              SERIAL PRIMARY KEY,
    estimate_number VARCHAR(50)   NOT NULL REFERENCES estimates (estimate_number),
    product_plu     VARCHAR(50)   REFERENCES products (plu),
    description     VARCHAR(500)  NOT NULL,
    quantity        DECIMAL(10,3) NOT NULL,
    unit            VARCHAR(30)   NOT NULL DEFAULT 'each',
    unit_cost       DECIMAL(12,4) NOT NULL,
    markup_pct      DECIMAL(6,2)  NOT NULL DEFAULT 35.00,
    line_total      DECIMAL(12,2) NOT NULL,
    sort_order      INT           NOT NULL DEFAULT 0,
    is_optional     BOOLEAN       NOT NULL DEFAULT FALSE,
    notes           TEXT
);

CREATE INDEX IF NOT EXISTS idx_line_items_estimate ON estimate_line_items (estimate_number);
CREATE INDEX IF NOT EXISTS idx_line_items_product  ON estimate_line_items (product_plu);

-- ============================================================
-- TABLE 8: change_orders
-- ============================================================
CREATE TABLE IF NOT EXISTS change_orders (
    id              SERIAL PRIMARY KEY,
    co_number       VARCHAR(50)   NOT NULL UNIQUE,   -- e.g. CO-2026-00001
    estimate_number VARCHAR(50)   NOT NULL REFERENCES estimates (estimate_number),
    project_id      VARCHAR(50)   NOT NULL REFERENCES projects (project_id),
    description     TEXT          NOT NULL,
    reason          TEXT,
    cost_delta      DECIMAL(12,2) NOT NULL DEFAULT 0,
    labor_delta     DECIMAL(12,2) NOT NULL DEFAULT 0,
    status          VARCHAR(50)   NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','approved','rejected','cancelled')),
    requested_by    INT           NOT NULL REFERENCES users (id),
    approved_by     INT REFERENCES users (id),
    approved_at     TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_co_estimate ON change_orders (estimate_number);
CREATE INDEX IF NOT EXISTS idx_co_project  ON change_orders (project_id);

-- ============================================================
-- TABLE 9: audit_log
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id          SERIAL PRIMARY KEY,
    table_name  VARCHAR(100) NOT NULL,
    record_id   VARCHAR(100) NOT NULL,
    action      VARCHAR(20)  NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
    old_values  JSONB,
    new_values  JSONB,
    user_id     INT REFERENCES users (id),
    ip_address  VARCHAR(45),
    user_agent  VARCHAR(500),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_table     ON audit_log (table_name);
CREATE INDEX IF NOT EXISTS idx_audit_record    ON audit_log (record_id);
CREATE INDEX IF NOT EXISTS idx_audit_user      ON audit_log (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created   ON audit_log (created_at);
