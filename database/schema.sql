CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_status') THEN
        CREATE TYPE project_status AS ENUM ('draft', 'estimate', 'contract', 'active', 'completed');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estimate_status') THEN
        CREATE TYPE estimate_status AS ENUM ('draft', 'sent', 'accepted', 'rejected', 'expired', 'converted');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contract_status') THEN
        CREATE TYPE contract_status AS ENUM ('pending', 'signed', 'active', 'completed', 'cancelled');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'change_order_status') THEN
        CREATE TYPE change_order_status AS ENUM ('pending', 'approved', 'rejected', 'implemented');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'estimator',
    company VARCHAR(255) NOT NULL,
    phone VARCHAR(25),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_username_unique UNIQUE (username),
    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_role_check CHECK (role IN ('admin', 'estimator', 'crew')),
    CONSTRAINT users_username_length_check CHECK (char_length(username) BETWEEN 3 AND 50),
    CONSTRAINT users_email_format_check CHECK (position('@' IN email) > 1)
);

CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(30) NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(25),
    address VARCHAR(255) NOT NULL,
    city VARCHAR(120) NOT NULL,
    province VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    property_notes TEXT,
    estimator_id BIGINT NOT NULL,
    status project_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT projects_project_id_unique UNIQUE (project_id),
    CONSTRAINT projects_estimator_fk FOREIGN KEY (estimator_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS fence_specs (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    fence_type VARCHAR(100) NOT NULL,
    height NUMERIC(6,2) NOT NULL,
    color VARCHAR(50),
    material VARCHAR(100) NOT NULL,
    total_footage NUMERIC(10,2) NOT NULL,
    gate_count INTEGER NOT NULL DEFAULT 0,
    gate_sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fence_specs_project_fk FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fence_specs_height_check CHECK (height > 0),
    CONSTRAINT fence_specs_total_footage_check CHECK (total_footage >= 0),
    CONSTRAINT fence_specs_gate_count_check CHECK (gate_count >= 0),
    CONSTRAINT fence_specs_gate_sizes_is_array CHECK (jsonb_typeof(gate_sizes) = 'array')
);

CREATE TABLE IF NOT EXISTS estimates (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    estimate_number VARCHAR(30) NOT NULL,
    material_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    labor_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    equipment_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    overhead_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(6,4) NOT NULL DEFAULT 0.0000,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status estimate_status NOT NULL DEFAULT 'draft',
    valid_until DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT estimates_estimate_number_unique UNIQUE (estimate_number),
    CONSTRAINT estimates_project_fk FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT estimates_material_cost_check CHECK (material_cost >= 0),
    CONSTRAINT estimates_labor_cost_check CHECK (labor_cost >= 0),
    CONSTRAINT estimates_equipment_cost_check CHECK (equipment_cost >= 0),
    CONSTRAINT estimates_overhead_cost_check CHECK (overhead_cost >= 0),
    CONSTRAINT estimates_tax_rate_check CHECK (tax_rate >= 0 AND tax_rate <= 1),
    CONSTRAINT estimates_tax_amount_check CHECK (tax_amount >= 0),
    CONSTRAINT estimates_total_amount_check CHECK (total_amount >= 0)
);

CREATE TABLE IF NOT EXISTS contracts (
    id BIGSERIAL PRIMARY KEY,
    estimate_id BIGINT NOT NULL,
    project_id BIGINT NOT NULL,
    contract_number VARCHAR(30) NOT NULL,
    locked_price NUMERIC(12,2) NOT NULL,
    signed_at TIMESTAMPTZ,
    signed_by VARCHAR(150),
    terms_text TEXT NOT NULL,
    status contract_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT contracts_contract_number_unique UNIQUE (contract_number),
    CONSTRAINT contracts_estimate_fk FOREIGN KEY (estimate_id)
        REFERENCES estimates(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT contracts_project_fk FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT contracts_locked_price_check CHECK (locked_price >= 0)
);

CREATE TABLE IF NOT EXISTS change_orders (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL,
    order_number VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    cost_adjustment NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    approved_by VARCHAR(150),
    approved_at TIMESTAMPTZ,
    status change_order_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT change_orders_order_number_unique UNIQUE (order_number),
    CONSTRAINT change_orders_contract_fk FOREIGN KEY (contract_id)
        REFERENCES contracts(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sign_offs (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    signed_by VARCHAR(150) NOT NULL,
    signature_data TEXT NOT NULL,
    notes TEXT,
    signed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT sign_offs_project_fk FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS project_notes (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT project_notes_project_fk FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT project_notes_author_fk FOREIGN KEY (author_id)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS inventory (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(40) NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(80) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    qty_on_hand INTEGER NOT NULL DEFAULT 0,
    reorder_point INTEGER NOT NULL DEFAULT 0,
    supplier VARCHAR(150),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT inventory_sku_unique UNIQUE (sku),
    CONSTRAINT inventory_unit_price_check CHECK (unit_price >= 0),
    CONSTRAINT inventory_qty_on_hand_check CHECK (qty_on_hand >= 0),
    CONSTRAINT inventory_reorder_point_check CHECK (reorder_point >= 0)
);

CREATE INDEX IF NOT EXISTS idx_projects_estimator_id ON projects (estimator_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fence_specs_project_id ON fence_specs (project_id);
CREATE INDEX IF NOT EXISTS idx_estimates_project_id ON estimates (project_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates (status);
CREATE INDEX IF NOT EXISTS idx_estimates_valid_until ON estimates (valid_until);
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON contracts (project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_estimate_id ON contracts (estimate_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts (status);
CREATE INDEX IF NOT EXISTS idx_change_orders_contract_id ON change_orders (contract_id);
CREATE INDEX IF NOT EXISTS idx_change_orders_status ON change_orders (status);
CREATE INDEX IF NOT EXISTS idx_sign_offs_project_id ON sign_offs (project_id);
CREATE INDEX IF NOT EXISTS idx_project_notes_project_id ON project_notes (project_id);
CREATE INDEX IF NOT EXISTS idx_project_notes_author_id ON project_notes (author_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory (category);
CREATE INDEX IF NOT EXISTS idx_inventory_supplier ON inventory (supplier);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_estimates_updated_at ON estimates;
CREATE TRIGGER trg_estimates_updated_at
BEFORE UPDATE ON estimates
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
