-- ============================================================
-- FENCE DEPOT ESTIMATOR - DATABASE SCHEMA
-- Compatible with PostgreSQL 14+
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id          SERIAL PRIMARY KEY,
    username    VARCHAR(50)  NOT NULL UNIQUE,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20)  NOT NULL DEFAULT 'estimator',  -- admin, estimator, viewer
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    phone       VARCHAR(30),
    email       VARCHAR(100),
    address     TEXT,
    city        VARCHAR(60),
    province    VARCHAR(30),
    postal_code VARCHAR(10),
    notes       TEXT,
    created_by  INTEGER      REFERENCES users(id),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Estimates table
CREATE TABLE IF NOT EXISTS estimates (
    id              SERIAL PRIMARY KEY,
    estimate_number VARCHAR(20)  NOT NULL UNIQUE,
    customer_id     INTEGER      NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    fence_type      VARCHAR(30)  NOT NULL,  -- chain-link, vinyl, wood, ornamental, farm
    height          NUMERIC(5,2) NOT NULL,
    footage         NUMERIC(8,2) NOT NULL,
    color           VARCHAR(50),
    style           VARCHAR(50),
    subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
    labour          NUMERIC(10,2) NOT NULL DEFAULT 0,
    tax_rate        NUMERIC(5,2)  NOT NULL DEFAULT 13,
    tax_amount      NUMERIC(10,2) NOT NULL DEFAULT 0,
    total           NUMERIC(10,2) NOT NULL DEFAULT 0,
    profit_margin   NUMERIC(5,2)  NOT NULL DEFAULT 35,
    status          VARCHAR(20)   NOT NULL DEFAULT 'draft',  -- draft, sent, approved, completed, cancelled
    notes           TEXT,
    created_by      INTEGER       REFERENCES users(id),
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Estimate line items
CREATE TABLE IF NOT EXISTS estimate_items (
    id              SERIAL PRIMARY KEY,
    estimate_id     INTEGER      NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
    plu             VARCHAR(30),
    description     VARCHAR(200) NOT NULL,
    qty             NUMERIC(8,2) NOT NULL DEFAULT 1,
    unit            VARCHAR(20),
    unit_price      NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_price     NUMERIC(10,2) NOT NULL DEFAULT 0,
    sort_order      INTEGER       NOT NULL DEFAULT 0
);

-- Gates table (linked to estimates)
CREATE TABLE IF NOT EXISTS gates (
    id          SERIAL PRIMARY KEY,
    estimate_id INTEGER      NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
    gate_type   VARCHAR(50),  -- single, double, sliding, cantilever
    width       NUMERIC(6,2),
    height      NUMERIC(6,2),
    material    VARCHAR(50),
    operator    BOOLEAN       NOT NULL DEFAULT FALSE,
    unit_price  NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventory (
    id          SERIAL PRIMARY KEY,
    plu         VARCHAR(30)  NOT NULL UNIQUE,
    description VARCHAR(200) NOT NULL,
    department  VARCHAR(100),
    category    VARCHAR(100),
    unit        VARCHAR(20),
    cost_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
    sell_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
    qty_on_hand NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
    updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Audit log
CREATE TABLE IF NOT EXISTS audit_log (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      REFERENCES users(id),
    action      VARCHAR(100) NOT NULL,
    table_name  VARCHAR(50),
    record_id   INTEGER,
    details     JSONB,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_estimates_customer  ON estimates(customer_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status    ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_estimate_items_est  ON estimate_items(estimate_id);
CREATE INDEX IF NOT EXISTS idx_gates_estimate      ON gates(estimate_id);
CREATE INDEX IF NOT EXISTS idx_inventory_plu       ON inventory(plu);
CREATE INDEX IF NOT EXISTS idx_audit_user          ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created       ON audit_log(created_at DESC);
