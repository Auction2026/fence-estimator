BEGIN;
SET search_path TO public;

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(32) PRIMARY KEY,
    description TEXT NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT users_role_check CHECK (role IN ('admin', 'estimator', 'viewer'))
);

CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(25),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state CHAR(2) NOT NULL,
    zip VARCHAR(10) NOT NULL,
    project_date DATE NOT NULL DEFAULT CURRENT_DATE,
    project_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT projects_status_check CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    CONSTRAINT projects_state_check CHECK (state ~ '^[A-Z]{2}$'),
    CONSTRAINT projects_zip_check CHECK (zip ~ '^\\d{5}(-\\d{4})?$'),
    CONSTRAINT projects_customer_email_check CHECK (customer_email IS NULL OR customer_email ~* '^[A-Z0-9._%+\\-]+@[A-Z0-9.\\-]+\\.[A-Z]{2,}$'),
    CONSTRAINT projects_customer_phone_check CHECK (customer_phone IS NULL OR customer_phone ~ '^\\+?[0-9(). -]{7,20}$')
);

CREATE TABLE IF NOT EXISTS fence_specs (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    fence_type VARCHAR(20) NOT NULL,
    height_feet NUMERIC(5,2) NOT NULL,
    color VARCHAR(50),
    gauge VARCHAR(20),
    total_footage NUMERIC(10,2) NOT NULL DEFAULT 0,
    num_gates INTEGER NOT NULL DEFAULT 0,
    gate_width NUMERIC(6,2),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fence_specs_type_check CHECK (fence_type IN ('chain-link', 'wood', 'vinyl', 'ornamental')),
    CONSTRAINT fence_specs_total_footage_nonnegative CHECK (total_footage >= 0),
    CONSTRAINT fence_specs_num_gates_nonnegative CHECK (num_gates >= 0),
    CONSTRAINT fence_specs_gate_width_check CHECK ((num_gates = 0 AND gate_width IS NULL) OR (num_gates > 0 AND gate_width IS NOT NULL AND gate_width > 0))
);

CREATE TABLE IF NOT EXISTS estimates (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    materials_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    labor_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
    overhead_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
    markup_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_pct NUMERIC(5,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    locked_at TIMESTAMPTZ,
    locked_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT estimates_costs_nonnegative CHECK (materials_cost >= 0 AND labor_cost >= 0 AND subtotal >= 0 AND total_amount >= 0),
    CONSTRAINT estimates_overhead_pct_check CHECK (overhead_pct >= 0 AND overhead_pct <= 100),
    CONSTRAINT estimates_tax_pct_check CHECK (tax_pct >= 0 AND tax_pct <= 100),
    CONSTRAINT estimates_lock_consistency CHECK ((is_locked = FALSE AND locked_at IS NULL AND locked_by IS NULL) OR is_locked = TRUE)
);

CREATE TABLE IF NOT EXISTS inventory (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(64) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_cost NUMERIC(12,2) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    quantity_on_hand NUMERIC(12,3) NOT NULL DEFAULT 0,
    reorder_level NUMERIC(12,3) NOT NULL DEFAULT 0,
    supplier VARCHAR(150),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT inventory_unit_price_nonnegative CHECK (unit_price >= 0),
    CONSTRAINT inventory_margin_check CHECK (unit_price >= unit_cost),
    CONSTRAINT inventory_quantity_on_hand_nonnegative CHECK (quantity_on_hand >= 0),
    CONSTRAINT inventory_reorder_level_nonnegative CHECK (reorder_level >= 0)
);

CREATE TABLE IF NOT EXISTS estimate_line_items (
    id BIGSERIAL PRIMARY KEY,
    estimate_id BIGINT NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES inventory(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    quantity NUMERIC(12,3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_price NUMERIC(12,2) NOT NULL,
    line_total NUMERIC(14,2) GENERATED ALWAYS AS (ROUND(quantity * unit_price, 2)) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT estimate_line_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT estimate_line_items_unit_price_nonnegative CHECK (unit_price >= 0)
);

CREATE TABLE IF NOT EXISTS contracts (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    estimate_id BIGINT NOT NULL REFERENCES estimates(id) ON DELETE RESTRICT,
    contract_number VARCHAR(50) NOT NULL,
    contract_date DATE NOT NULL DEFAULT CURRENT_DATE,
    terms_text TEXT NOT NULL,
    customer_signature TEXT,
    customer_signed_at TIMESTAMPTZ,
    company_signature TEXT,
    company_signed_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT contracts_contract_number_key UNIQUE (contract_number),
    CONSTRAINT contracts_status_check CHECK (status IN ('draft', 'sent', 'signed', 'cancelled')),
    CONSTRAINT contracts_customer_signature_check CHECK ((customer_signature IS NULL AND customer_signed_at IS NULL) OR (customer_signature IS NOT NULL AND customer_signed_at IS NOT NULL)),
    CONSTRAINT contracts_company_signature_check CHECK ((company_signature IS NULL AND company_signed_at IS NULL) OR (company_signature IS NOT NULL AND company_signed_at IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS change_orders (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    estimate_id BIGINT REFERENCES estimates(id) ON DELETE SET NULL,
    change_order_number VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    reason TEXT,
    cost_change NUMERIC(12,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    requested_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    approved_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT change_orders_status_check CHECK (status IN ('pending', 'approved', 'rejected')),
    CONSTRAINT change_orders_number_per_project_key UNIQUE (project_id, change_order_number),
    CONSTRAINT change_orders_approval_check CHECK (status <> 'approved' OR approved_by IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS sign_offs (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    inspection_type VARCHAR(50) NOT NULL,
    inspector_name VARCHAR(150) NOT NULL,
    inspection_date DATE NOT NULL,
    passed BOOLEAN NOT NULL,
    notes TEXT,
    signature TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    category VARCHAR(20) NOT NULL,
    note_text TEXT NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT notes_category_check CHECK (category IN ('general', 'permit', 'utility', 'installation', 'customer'))
);


INSERT INTO schema_migrations (version, description) VALUES ('001', 'Initial Fence Depot schema') ON CONFLICT (version) DO NOTHING;

COMMIT;
