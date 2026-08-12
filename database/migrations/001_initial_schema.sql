-- Migration 001: Initial schema creation for Fence Estimator
-- File: /home/runner/work/fence-estimator/fence-estimator/database/migrations/001_initial_schema.sql
-- This migration applies the initial business tables and core triggers.

-- =============================================================================
-- UP MIGRATION
-- =============================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS users_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS customers_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS projects_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS estimates_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS estimate_items_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS gates_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS contracts_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS payments_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS products_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS photos_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS audit_log_id_seq START WITH 1 INCREMENT BY 1;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY DEFAULT nextval('users_id_seq'),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'estimator' CHECK (role IN ('admin', 'estimator', 'crew', 'sales', 'viewer')),
    company VARCHAR(255),
    phone VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (position('@' in email) > 1)
);

CREATE TABLE IF NOT EXISTS customers (
    id BIGINT PRIMARY KEY DEFAULT nextval('customers_id_seq'),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(30),
    address VARCHAR(255),
    city VARCHAR(120),
    state VARCHAR(50),
    zip VARCHAR(20),
    company VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT,
    CONSTRAINT fk_customers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CHECK (email IS NULL OR position('@' in email) > 1)
);

CREATE TABLE IF NOT EXISTS projects (
    id BIGINT PRIMARY KEY DEFAULT nextval('projects_id_seq'),
    customer_id BIGINT NOT NULL,
    user_id BIGINT,
    name VARCHAR(255) NOT NULL,
    site_address VARCHAR(255),
    site_city VARCHAR(120),
    site_state VARCHAR(50),
    site_zip VARCHAR(20),
    project_type VARCHAR(30) NOT NULL DEFAULT 'residential' CHECK (project_type IN ('residential', 'commercial', 'industrial', 'agricultural', 'municipal', 'repair')),
    status VARCHAR(30) NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'site-visit', 'estimating', 'proposal-sent', 'approved', 'scheduled', 'in-progress', 'completed', 'cancelled', 'archived')),
    notes TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS estimates (
    id BIGINT PRIMARY KEY DEFAULT nextval('estimates_id_seq'),
    project_id BIGINT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1 CHECK (version >= 1),
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'internal-review', 'sent', 'approved', 'rejected', 'expired', 'converted')),
    fence_type VARCHAR(40) NOT NULL CHECK (fence_type IN ('chain-link', 'wood', 'vinyl', 'aluminum', 'ornamental-steel', 'composite', 'custom')),
    fence_height NUMERIC(6,2) NOT NULL CHECK (fence_height > 0),
    fence_color VARCHAR(60),
    linear_feet NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (linear_feet >= 0),
    post_count INTEGER NOT NULL DEFAULT 0 CHECK (post_count >= 0),
    materials_total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (materials_total >= 0),
    labor_total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (labor_total >= 0),
    extras_total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (extras_total >= 0),
    tax_rate NUMERIC(6,4) NOT NULL DEFAULT 0 CHECK (tax_rate >= 0),
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    grand_total NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (grand_total >= 0),
    markup_percent NUMERIC(6,2) NOT NULL DEFAULT 0 CHECK (markup_percent >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_estimates_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT uq_estimates_project_version UNIQUE (project_id, version)
);

CREATE TABLE IF NOT EXISTS estimate_items (
    id BIGINT PRIMARY KEY DEFAULT nextval('estimate_items_id_seq'),
    estimate_id BIGINT NOT NULL,
    category VARCHAR(30) NOT NULL CHECK (category IN ('material', 'labor', 'equipment', 'freight', 'permit', 'subcontract', 'discount', 'other')),
    sku VARCHAR(100),
    description VARCHAR(255) NOT NULL,
    quantity NUMERIC(12,2) NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    unit VARCHAR(30) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
    notes TEXT,
    CONSTRAINT fk_estimate_items_estimate FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gates (
    id BIGINT PRIMARY KEY DEFAULT nextval('gates_id_seq'),
    estimate_id BIGINT NOT NULL,
    gate_type VARCHAR(30) NOT NULL CHECK (gate_type IN ('walk', 'double-drive', 'cantilever', 'rolling', 'ornamental', 'custom')),
    width NUMERIC(8,2) NOT NULL CHECK (width > 0),
    height NUMERIC(8,2) NOT NULL CHECK (height > 0),
    hardware_type VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
    unit_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    total_price NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (total_price >= 0),
    CONSTRAINT fk_gates_estimate FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contracts (
    id BIGINT PRIMARY KEY DEFAULT nextval('contracts_id_seq'),
    estimate_id BIGINT NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'declined', 'cancelled', 'closed')),
    terms TEXT,
    signed_date DATE,
    signed_by VARCHAR(255),
    deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (deposit_amount >= 0),
    deposit_paid BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contracts_estimate FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE,
    CONSTRAINT uq_contracts_estimate UNIQUE (estimate_id)
);

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT PRIMARY KEY DEFAULT nextval('payments_id_seq'),
    contract_id BIGINT NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    payment_date DATE NOT NULL,
    payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('cash', 'check', 'credit-card', 'ach', 'wire', 'financing', 'other')),
    reference_number VARCHAR(100),
    notes TEXT,
    CONSTRAINT fk_payments_contract FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY DEFAULT nextval('products_id_seq'),
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(80) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
    cost_price NUMERIC(12,2) NOT NULL CHECK (cost_price >= 0),
    stock_qty INTEGER NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS photos (
    id BIGINT PRIMARY KEY DEFAULT nextval('photos_id_seq'),
    project_id BIGINT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    label VARCHAR(255),
    upload_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT,
    CONSTRAINT fk_photos_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_photos_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT PRIMARY KEY DEFAULT nextval('audit_log_id_seq'),
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSON,
    new_values JSON,
    user_id BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects (customer_id);
CREATE INDEX IF NOT EXISTS idx_estimates_project_id ON estimates (project_id);
CREATE INDEX IF NOT EXISTS idx_estimate_items_estimate_id ON estimate_items (estimate_id);
CREATE INDEX IF NOT EXISTS idx_contracts_estimate_id ON contracts (estimate_id);
CREATE INDEX IF NOT EXISTS idx_payments_contract_id ON payments (contract_id);
CREATE INDEX IF NOT EXISTS idx_products_category_active ON products (category, active);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_record ON audit_log (table_name, record_id);

CREATE TRIGGER trg_users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_projects_set_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_estimates_set_updated_at
BEFORE UPDATE ON estimates
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

INSERT INTO schema_migrations (version, name) VALUES ('001', 'initial schema creation')
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- =============================================================================
-- DOWN MIGRATION
-- =============================================================================
-- Run the statements below manually in reverse deployment workflows.
-- BEGIN;
-- DELETE FROM schema_migrations WHERE version = '001';
-- DROP TABLE IF EXISTS audit_log CASCADE;
-- DROP TABLE IF EXISTS photos CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS payments CASCADE;
-- DROP TABLE IF EXISTS contracts CASCADE;
-- DROP TABLE IF EXISTS gates CASCADE;
-- DROP TABLE IF EXISTS estimate_items CASCADE;
-- DROP TABLE IF EXISTS estimates CASCADE;
-- DROP TABLE IF EXISTS projects CASCADE;
-- DROP TABLE IF EXISTS customers CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP SEQUENCE IF EXISTS audit_log_id_seq;
-- DROP SEQUENCE IF EXISTS photos_id_seq;
-- DROP SEQUENCE IF EXISTS products_id_seq;
-- DROP SEQUENCE IF EXISTS payments_id_seq;
-- DROP SEQUENCE IF EXISTS contracts_id_seq;
-- DROP SEQUENCE IF EXISTS gates_id_seq;
-- DROP SEQUENCE IF EXISTS estimate_items_id_seq;
-- DROP SEQUENCE IF EXISTS estimates_id_seq;
-- DROP SEQUENCE IF EXISTS projects_id_seq;
-- DROP SEQUENCE IF EXISTS customers_id_seq;
-- DROP SEQUENCE IF EXISTS users_id_seq;
-- DROP FUNCTION IF EXISTS set_updated_at();
-- COMMIT;


-- =============================================================================
-- POST-DEPLOYMENT VERIFICATION CHECKLIST
-- =============================================================================
-- Verify tables exist:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
--   AND table_name IN (
--     'users',
--     'customers',
--     'projects',
--     'estimates',
--     'estimate_items',
--     'gates',
--     'contracts',
--     'payments',
--     'products',
--     'photos',
--     'audit_log'
--   )
-- ORDER BY table_name;
--
-- Verify sequences exist and are owned correctly:
-- SELECT sequence_name
-- FROM information_schema.sequences
-- WHERE sequence_schema = 'public'
-- ORDER BY sequence_name;
--
-- Verify updated_at triggers:
-- SELECT event_object_table, trigger_name
-- FROM information_schema.triggers
-- WHERE trigger_name IN (
--     'trg_users_set_updated_at',
--     'trg_projects_set_updated_at',
--     'trg_estimates_set_updated_at'
-- )
-- ORDER BY event_object_table;
--
-- Smoke test insert order:
--   1. Insert a user.
--   2. Insert a customer referencing the user.
--   3. Insert a project referencing the customer.
--   4. Insert an estimate referencing the project.
--   5. Insert estimate_items and gates referencing the estimate.
--   6. Insert a contract referencing the estimate.
--   7. Insert payments referencing the contract.
--   8. Insert photos referencing the project.
--
-- MySQL 8+ adaptation guide:
--   * Convert TIMESTAMPTZ to TIMESTAMP.
--   * Replace nextval('...') defaults with AUTO_INCREMENT definitions.
--   * Replace trigger functions with native CREATE TRIGGER blocks.
--   * Replace ON CONFLICT DO NOTHING with INSERT IGNORE or INSERT ... ON DUPLICATE KEY UPDATE.
--   * Replace JSON casts with native JSON literals.
--
-- Rollback notes:
--   * Drop dependent child tables before parent tables.
--   * Remove triggers before removing trigger functions.
--   * Drop sequences after dropping tables when using owned sequences.
--   * Back up production data before executing any rollback path.
--
-- Object inventory created by this migration:
--   users
--   customers
--   projects
--   estimates
--   estimate_items
--   gates
--   contracts
--   payments
--   products
--   photos
--   audit_log
--   users_id_seq
--   customers_id_seq
--   projects_id_seq
--   estimates_id_seq
--   estimate_items_id_seq
--   gates_id_seq
--   contracts_id_seq
--   payments_id_seq
--   products_id_seq
--   photos_id_seq
--   audit_log_id_seq
--   set_updated_at()
--   trg_users_set_updated_at
--   trg_projects_set_updated_at
--   trg_estimates_set_updated_at


-- =============================================================================
-- DEPLOYMENT TROUBLESHOOTING
-- =============================================================================
-- If table creation fails:
--   * Check whether a table of the same name exists in another schema.
--   * Verify permissions for CREATE TABLE, CREATE SEQUENCE, and CREATE TRIGGER.
--   * Confirm plpgsql is available in the target PostgreSQL database.
--
-- If trigger creation fails:
--   * Ensure set_updated_at() was created successfully.
--   * Confirm the target table has an updated_at column.
--   * Re-run only the trigger section after fixing the root cause.
--
-- If rollback is required in a shared environment:
--   * Pause application writes first.
--   * Export data from child tables before parent tables.
--   * Document migration state in schema_migrations after manual recovery.
--
-- Production rollout reminder:
--   Migration 001 establishes structure only.
--   Product volume, performance tuning, and search indexes belong in later deployment phases.
