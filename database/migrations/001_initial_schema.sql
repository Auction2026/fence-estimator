-- Migration 001: Initial Schema
-- Create all application tables for Fence Depot Fence Estimator.

PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;
-- ---------------------------------------------------------------------
-- Table: users
-- Stores application users such as estimators, admins, project managers,
-- office staff, and installers who add internal notes or sign-off records.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    username        TEXT    NOT NULL,
    email           TEXT    NOT NULL,
    password_hash   TEXT    NOT NULL,
    role            TEXT    NOT NULL DEFAULT 'estimator'
                          CHECK (role IN ('admin', 'estimator', 'sales', 'project_manager', 'installer', 'viewer')),
    company         TEXT,
    phone           TEXT,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    UNIQUE (username),
    UNIQUE (email)
);

-- ---------------------------------------------------------------------
-- Table: projects
-- Each project represents a customer opportunity or active fence job.
-- Statuses support the sales and fulfillment workflow from lead to close.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER NOT NULL,
    customer_name   TEXT    NOT NULL,
    customer_email  TEXT,
    customer_phone  TEXT,
    address         TEXT    NOT NULL,
    city            TEXT    NOT NULL,
    state           TEXT    NOT NULL,
    zip             TEXT    NOT NULL,
    project_name    TEXT    NOT NULL,
    status          TEXT    NOT NULL DEFAULT 'lead'
                          CHECK (status IN ('lead', 'site_visit', 'estimating', 'estimate_sent', 'contract_pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------
-- Table: fence_specs
-- One specification record per project describing the fence configuration.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fence_specs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER NOT NULL,
    fence_type      TEXT    NOT NULL,
    height          REAL    NOT NULL CHECK (height > 0),
    color           TEXT,
    gauge           TEXT,
    coating         TEXT,
    linear_feet     REAL    NOT NULL CHECK (linear_feet >= 0),
    gates_count     INTEGER NOT NULL DEFAULT 0 CHECK (gates_count >= 0),
    gate_sizes      TEXT,
    terrain         TEXT,
    notes           TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    UNIQUE (project_id)
);

-- ---------------------------------------------------------------------
-- Table: estimates
-- Financial summary for one estimate version tied to a project.
-- Multiple estimate rows can be stored when revisions are required.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS estimates (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER NOT NULL,
    materials_cost  NUMERIC NOT NULL DEFAULT 0 CHECK (materials_cost >= 0),
    labor_cost      NUMERIC NOT NULL DEFAULT 0 CHECK (labor_cost >= 0),
    equipment_cost  NUMERIC NOT NULL DEFAULT 0 CHECK (equipment_cost >= 0),
    subtotal        NUMERIC NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    tax_rate        NUMERIC NOT NULL DEFAULT 0 CHECK (tax_rate >= 0 AND tax_rate <= 1),
    tax_amount      NUMERIC NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total           NUMERIC NOT NULL DEFAULT 0 CHECK (total >= 0),
    status          TEXT    NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft', 'review', 'sent', 'approved', 'rejected', 'expired', 'converted')),
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Table: estimate_items
-- Detailed line items rolled up into an estimate record.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS estimate_items (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    estimate_id     INTEGER NOT NULL,
    category        TEXT    NOT NULL,
    description     TEXT    NOT NULL,
    quantity        NUMERIC NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    unit            TEXT    NOT NULL,
    unit_cost       NUMERIC NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
    total_cost      NUMERIC NOT NULL DEFAULT 0 CHECK (total_cost >= 0),
    FOREIGN KEY (estimate_id) REFERENCES estimates(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Table: contracts
-- Contract data created from an accepted estimate.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contracts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER NOT NULL,
    estimate_id     INTEGER NOT NULL,
    contract_number TEXT    NOT NULL,
    terms           TEXT    NOT NULL,
    payment_schedule TEXT   NOT NULL,
    start_date      TEXT,
    completion_date TEXT,
    status          TEXT    NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft', 'sent', 'signed', 'active', 'completed', 'terminated', 'void')),
    signed_at       TEXT,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (estimate_id) REFERENCES estimates(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    UNIQUE (contract_number),
    CHECK (completion_date IS NULL OR start_date IS NULL OR completion_date >= start_date)
);

-- ---------------------------------------------------------------------
-- Table: change_orders
-- Approved or pending changes to the active contract scope and price.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS change_orders (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER NOT NULL,
    contract_id     INTEGER NOT NULL,
    co_number       TEXT    NOT NULL,
    description     TEXT    NOT NULL,
    materials_cost  NUMERIC NOT NULL DEFAULT 0 CHECK (materials_cost >= 0),
    labor_cost      NUMERIC NOT NULL DEFAULT 0 CHECK (labor_cost >= 0),
    total_cost      NUMERIC NOT NULL DEFAULT 0 CHECK (total_cost >= 0),
    status          TEXT    NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'void')),
    approved_at     TEXT,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    UNIQUE (co_number)
);

-- ---------------------------------------------------------------------
-- Table: sign_offs
-- Captures customer signatures or internal approvals for milestones.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sign_offs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER NOT NULL,
    type            TEXT    NOT NULL
                          CHECK (type IN ('estimate_acceptance', 'contract_signature', 'change_order_approval', 'completion_acknowledgement', 'warranty_acknowledgement', 'site_ready_confirmation')),
    signature_data  TEXT    NOT NULL,
    signed_by       TEXT    NOT NULL,
    signed_at       TEXT    NOT NULL DEFAULT (datetime('now')),
    notes           TEXT,
    FOREIGN KEY (project_id) REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Table: notes
-- Free-form notes attached to a project and authored by a user.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER NOT NULL,
    user_id         INTEGER NOT NULL,
    category        TEXT    NOT NULL DEFAULT 'general'
                          CHECK (category IN ('general', 'site_visit', 'customer_call', 'installation', 'billing', 'change_order', 'warranty')),
    content         TEXT    NOT NULL,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (project_id) REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------
-- Table: catalog_products
-- Central fence material catalog used for estimating line items.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS catalog_products (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    sku             TEXT    NOT NULL,
    name            TEXT    NOT NULL,
    category        TEXT    NOT NULL,
    subcategory     TEXT    NOT NULL,
    unit            TEXT    NOT NULL,
    cost            NUMERIC NOT NULL DEFAULT 0 CHECK (cost >= 0),
    price           NUMERIC NOT NULL DEFAULT 0 CHECK (price >= 0),
    description     TEXT,
    UNIQUE (sku)
);

COMMIT;
