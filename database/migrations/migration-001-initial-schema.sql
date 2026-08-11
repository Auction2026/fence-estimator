-- Migration: 001
-- Date: 2026-08-11
-- Description: Initial schema creation for Fence Depot Estimator.

-- Fence Depot Estimator Database Schema
-- PostgreSQL 14+
-- Complete relational schema for projects, estimates, contracts, closeout, and inventory.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS project_number_seq START 1000;
CREATE SEQUENCE IF NOT EXISTS estimate_number_seq START 5000;
CREATE SEQUENCE IF NOT EXISTS contract_number_seq START 7000;
CREATE SEQUENCE IF NOT EXISTS change_order_number_seq START 9000;
CREATE SEQUENCE IF NOT EXISTS signoff_number_seq START 3000;

CREATE OR REPLACE FUNCTION assign_project_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.project_number IS NULL OR btrim(NEW.project_number) = '' THEN
        NEW.project_number := 'PRJ-' || to_char(CURRENT_DATE, 'YYYYMMDD') || '-' || lpad(nextval('project_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION assign_estimate_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.estimate_number IS NULL OR btrim(NEW.estimate_number) = '' THEN
        NEW.estimate_number := 'EST-' || to_char(CURRENT_DATE, 'YYYYMMDD') || '-' || lpad(nextval('estimate_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION assign_contract_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.contract_number IS NULL OR btrim(NEW.contract_number) = '' THEN
        NEW.contract_number := 'CON-' || to_char(CURRENT_DATE, 'YYYYMMDD') || '-' || lpad(nextval('contract_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION assign_change_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.change_order_number IS NULL OR btrim(NEW.change_order_number) = '' THEN
        NEW.change_order_number := 'CO-' || to_char(CURRENT_DATE, 'YYYYMMDD') || '-' || lpad(nextval('change_order_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION assign_signoff_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.signoff_number IS NULL OR btrim(NEW.signoff_number) = '' THEN
        NEW.signoff_number := 'SO-' || to_char(CURRENT_DATE, 'YYYYMMDD') || '-' || lpad(nextval('signoff_number_seq')::text, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Users Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'estimator',
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    company VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_users_role CHECK (role IN (admin, estimator, installer, viewer)),
    CONSTRAINT chk_users_email_format CHECK (position('@' in email) > 1)
);

-- 2. Projects Table
CREATE TABLE projects (
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_number VARCHAR(30) NOT NULL UNIQUE,
    customer_first_name VARCHAR(50) NOT NULL,
    customer_last_name VARCHAR(50) NOT NULL,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(20),
    customer_company VARCHAR(100),
    address_street VARCHAR(200) NOT NULL,
    address_city VARCHAR(100) NOT NULL,
    address_state VARCHAR(50) NOT NULL,
    address_zip VARCHAR(15) NOT NULL,
    property_type VARCHAR(30) NOT NULL DEFAULT 'residential',
    project_type VARCHAR(30) NOT NULL DEFAULT 'new_installation',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    estimator_id UUID NOT NULL,
    notes TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_estimator FOREIGN KEY (estimator_id) REFERENCES users(user_id) ON UPDATE CASCADE,
    CONSTRAINT chk_projects_status CHECK (status IN ('draft', 'estimate', 'contract', 'active', 'completed', 'cancelled')), 
    CONSTRAINT chk_projects_property_type CHECK (property_type IN ('residential', 'commercial', 'industrial', 'municipal', 'agricultural', 'hoa', 'other')), 
    CONSTRAINT chk_projects_project_type CHECK (project_type IN ('new_installation', 'replacement', 'repair', 'gate_upgrade', 'temporary', 'other')), 
    CONSTRAINT chk_projects_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- 3. Fence Specifications Table
CREATE TABLE fence_specs (
    spec_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL,
    fence_type VARCHAR(20) NOT NULL,
    height_feet NUMERIC(4,2) NOT NULL,
    color VARCHAR(50),
    linear_feet NUMERIC(10,2) NOT NULL,
    number_of_posts INTEGER NOT NULL DEFAULT 0,
    number_of_gates INTEGER NOT NULL DEFAULT 0,
    gate_type VARCHAR(30),
    materials_grade VARCHAR(20) NOT NULL DEFAULT 'standard',
    post_spacing NUMERIC(5,2) NOT NULL DEFAULT 8.00,
    post_diameter NUMERIC(5,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fence_specs_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT chk_fence_specs_type CHECK (fence_type IN ('chain_link', 'wood', 'vinyl', 'wrought_iron')), 
    CONSTRAINT chk_fence_specs_grade CHECK (materials_grade IN ('standard', 'premium', 'commercial')), 
    CONSTRAINT chk_fence_specs_gate_type CHECK (gate_type IS NULL OR gate_type IN ('single_walk', 'double_drive', 'cantilever', 'sliding', 'ornamental', 'privacy', 'custom', 'none')), 
    CONSTRAINT chk_fence_specs_height CHECK (height_feet > 0 AND height_feet <= 12),
    CONSTRAINT chk_fence_specs_linear_feet CHECK (linear_feet > 0),
    CONSTRAINT chk_fence_specs_post_count CHECK (number_of_posts >= 0),
    CONSTRAINT chk_fence_specs_gate_count CHECK (number_of_gates >= 0),
    CONSTRAINT chk_fence_specs_post_spacing CHECK (post_spacing >= 4 AND post_spacing <= 12),
    CONSTRAINT chk_fence_specs_post_diameter CHECK (post_diameter IS NULL OR post_diameter > 0)
);

-- 4. Estimates Table
CREATE TABLE estimates (
    estimate_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    estimate_number VARCHAR(30) NOT NULL UNIQUE,
    project_id UUID NOT NULL,
    spec_id UUID NOT NULL,
    materials_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    labor_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    equipment_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    concrete_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    permit_cost NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    contingency_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5,4) NOT NULL DEFAULT 0.0000,
    valid_until DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_estimates_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_estimates_spec FOREIGN KEY (spec_id) REFERENCES fence_specs(spec_id) ON DELETE RESTRICT,
    CONSTRAINT fk_estimates_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON UPDATE CASCADE,
    CONSTRAINT chk_estimates_status CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')), 
    CONSTRAINT chk_estimates_materials_cost CHECK (materials_cost >= 0),
    CONSTRAINT chk_estimates_labor_cost CHECK (labor_cost >= 0),
    CONSTRAINT chk_estimates_equipment_cost CHECK (equipment_cost >= 0),
    CONSTRAINT chk_estimates_concrete_cost CHECK (concrete_cost >= 0),
    CONSTRAINT chk_estimates_permit_cost CHECK (permit_cost >= 0),
    CONSTRAINT chk_estimates_contingency_amount CHECK (contingency_amount >= 0),
    CONSTRAINT chk_estimates_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_estimates_tax_amount CHECK (tax_amount >= 0),
    CONSTRAINT chk_estimates_total_amount CHECK (total_amount >= subtotal),
    CONSTRAINT chk_estimates_tax_rate CHECK (tax_rate >= 0 AND tax_rate <= 1)
);

-- 5. Contracts Table
CREATE TABLE contracts (
    contract_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_number VARCHAR(30) NOT NULL UNIQUE,
    estimate_id UUID NOT NULL,
    project_id UUID NOT NULL,
    scope_of_work TEXT NOT NULL,
    materials_description TEXT,
    labor_description TEXT,
    total_price NUMERIC(12,2) NOT NULL,
    price_locked BOOLEAN NOT NULL DEFAULT true,
    deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    deposit_paid BOOLEAN NOT NULL DEFAULT false,
    balance_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    payment_terms TEXT,
    warranty_period VARCHAR(50),
    warranty_terms TEXT,
    customer_signature TEXT,
    customer_signed_at TIMESTAMP,
    contractor_signature TEXT,
    contractor_signed_at TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contracts_estimate FOREIGN KEY (estimate_id) REFERENCES estimates(estimate_id) ON DELETE RESTRICT,
    CONSTRAINT fk_contracts_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT chk_contracts_status CHECK (status IN ('draft', 'pending_signature', 'active', 'completed', 'cancelled', 'void')), 
    CONSTRAINT chk_contracts_total_price CHECK (total_price >= 0),
    CONSTRAINT chk_contracts_deposit_amount CHECK (deposit_amount >= 0),
    CONSTRAINT chk_contracts_balance_amount CHECK (balance_amount >= 0),
    CONSTRAINT chk_contracts_deposit_not_over_total CHECK (deposit_amount <= total_price),
    CONSTRAINT chk_contracts_balance_matches CHECK (balance_amount = total_price - deposit_amount)
);

-- 6. Change Orders Table
CREATE TABLE change_orders (
    change_order_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    change_order_number VARCHAR(30) NOT NULL UNIQUE,
    contract_id UUID NOT NULL,
    project_id UUID NOT NULL,
    description TEXT NOT NULL,
    reason TEXT,
    materials_change NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    labor_change NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total_change NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    timeline_change_days INTEGER NOT NULL DEFAULT 0,
    customer_approved BOOLEAN NOT NULL DEFAULT false,
    customer_approved_at TIMESTAMP,
    customer_signature TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_by UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_change_orders_contract FOREIGN KEY (contract_id) REFERENCES contracts(contract_id) ON DELETE CASCADE,
    CONSTRAINT fk_change_orders_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_change_orders_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON UPDATE CASCADE,
    CONSTRAINT chk_change_orders_status CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')), 
    CONSTRAINT chk_change_orders_materials_change CHECK (materials_change >= 0),
    CONSTRAINT chk_change_orders_labor_change CHECK (labor_change >= 0),
    CONSTRAINT chk_change_orders_total_change CHECK (total_change = materials_change + labor_change),
    CONSTRAINT chk_change_orders_timeline_change CHECK (timeline_change_days >= 0),
    CONSTRAINT chk_change_orders_approval_timestamp CHECK (customer_approved = false OR customer_approved_at IS NOT NULL)
);

-- 7. SignOffs Table
CREATE TABLE signoffs (
    signoff_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signoff_number VARCHAR(30) NOT NULL UNIQUE,
    project_id UUID NOT NULL,
    completion_date DATE NOT NULL,
    inspection_passed BOOLEAN NOT NULL DEFAULT false,
    walkthrough_completed BOOLEAN NOT NULL DEFAULT false,
    warranty_explained BOOLEAN NOT NULL DEFAULT false,
    outstanding_items TEXT,
    punch_list TEXT,
    customer_satisfied BOOLEAN NOT NULL DEFAULT false,
    customer_signature TEXT,
    customer_signed_at TIMESTAMP,
    contractor_signature TEXT,
    contractor_signed_at TIMESTAMP,
    photos_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_signoffs_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT chk_signoffs_status CHECK (status IN ('draft', 'pending_customer', 'signed', 'archived')), 
    CONSTRAINT chk_signoffs_photos_count CHECK (photos_count >= 0),
    CONSTRAINT chk_signoffs_customer_signature_time CHECK (customer_signature IS NULL OR customer_signed_at IS NOT NULL),
    CONSTRAINT chk_signoffs_contractor_signature_time CHECK (contractor_signature IS NULL OR contractor_signed_at IS NOT NULL)
);

-- 8. Notes Table
CREATE TABLE notes (
    note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    content TEXT NOT NULL,
    created_by UUID NOT NULL,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    tags VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notes_project FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    CONSTRAINT fk_notes_created_by FOREIGN KEY (created_by) REFERENCES users(user_id) ON UPDATE CASCADE,
    CONSTRAINT chk_notes_category CHECK (category IN ('general', 'customer', 'installation', 'finance', 'legal', 'safety'))
);

-- 9. Inventory Table
CREATE TABLE inventory (
    inventory_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50) NOT NULL,
    fence_type VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    unit_cost NUMERIC(10,2) NOT NULL,
    retail_price NUMERIC(10,2) NOT NULL,
    quantity_on_hand INTEGER NOT NULL DEFAULT 0,
    reorder_level INTEGER NOT NULL DEFAULT 10,
    supplier VARCHAR(100),
    supplier_sku VARCHAR(50),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_inventory_fence_type CHECK (fence_type IN ('chain_link', 'wood', 'vinyl', 'wrought_iron', 'concrete', 'hardware', 'multi_use')), 
    CONSTRAINT chk_inventory_unit_cost CHECK (unit_cost >= 0),
    CONSTRAINT chk_inventory_retail_price CHECK (retail_price >= 0),
    CONSTRAINT chk_inventory_quantity_on_hand CHECK (quantity_on_hand >= 0),
    CONSTRAINT chk_inventory_reorder_level CHECK (reorder_level >= 0)
);

COMMENT ON TABLE users IS
    'Application users who access the estimator platform.';
COMMENT ON COLUMN users.user_id IS
    'users.user_id stores user id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.username IS
    'users.username stores username data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.email IS
    'users.email stores email data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.password_hash IS
    'users.password_hash stores password hash data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.role IS
    'users.role stores role data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.first_name IS
    'users.first_name stores first name data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.last_name IS
    'users.last_name stores last name data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.company IS
    'users.company stores company data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.phone IS
    'users.phone stores phone data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.is_active IS
    'users.is_active stores is active data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.last_login IS
    'users.last_login stores last login data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.created_at IS
    'users.created_at stores created at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN users.updated_at IS
    'users.updated_at stores updated at data for the Fence Depot Estimator workflow.';

COMMENT ON TABLE projects IS
    'Customer jobs tracked from first estimate through closeout.';
COMMENT ON COLUMN projects.project_id IS
    'projects.project_id stores project id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.project_number IS
    'projects.project_number stores project number data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.customer_first_name IS
    'projects.customer_first_name stores customer first name data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.customer_last_name IS
    'projects.customer_last_name stores customer last name data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.customer_email IS
    'projects.customer_email stores customer email data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.customer_phone IS
    'projects.customer_phone stores customer phone data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.customer_company IS
    'projects.customer_company stores customer company data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.address_street IS
    'projects.address_street stores address street data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.address_city IS
    'projects.address_city stores address city data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.address_state IS
    'projects.address_state stores address state data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.address_zip IS
    'projects.address_zip stores address zip data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.property_type IS
    'projects.property_type stores property type data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.project_type IS
    'projects.project_type stores project type data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.status IS
    'projects.status stores status data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.estimator_id IS
    'projects.estimator_id stores estimator id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.notes IS
    'projects.notes stores notes data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.start_date IS
    'projects.start_date stores start date data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.end_date IS
    'projects.end_date stores end date data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.created_at IS
    'projects.created_at stores created at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN projects.updated_at IS
    'projects.updated_at stores updated at data for the Fence Depot Estimator workflow.';

COMMENT ON TABLE fence_specs IS
    'Fence configuration and dimensional records for each project.';
COMMENT ON COLUMN fence_specs.spec_id IS
    'fence_specs.spec_id stores spec id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.project_id IS
    'fence_specs.project_id stores project id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.fence_type IS
    'fence_specs.fence_type stores fence type data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.height_feet IS
    'fence_specs.height_feet stores height feet data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.color IS
    'fence_specs.color stores color data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.linear_feet IS
    'fence_specs.linear_feet stores linear feet data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.number_of_posts IS
    'fence_specs.number_of_posts stores number of posts data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.number_of_gates IS
    'fence_specs.number_of_gates stores number of gates data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.gate_type IS
    'fence_specs.gate_type stores gate type data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.materials_grade IS
    'fence_specs.materials_grade stores materials grade data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.post_spacing IS
    'fence_specs.post_spacing stores post spacing data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.post_diameter IS
    'fence_specs.post_diameter stores post diameter data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.created_at IS
    'fence_specs.created_at stores created at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN fence_specs.updated_at IS
    'fence_specs.updated_at stores updated at data for the Fence Depot Estimator workflow.';

COMMENT ON TABLE estimates IS
    'Pricing records linked to a project and specification version.';
COMMENT ON COLUMN estimates.estimate_id IS
    'estimates.estimate_id stores estimate id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.estimate_number IS
    'estimates.estimate_number stores estimate number data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.project_id IS
    'estimates.project_id stores project id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.spec_id IS
    'estimates.spec_id stores spec id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.materials_cost IS
    'estimates.materials_cost stores materials cost data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.labor_cost IS
    'estimates.labor_cost stores labor cost data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.equipment_cost IS
    'estimates.equipment_cost stores equipment cost data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.concrete_cost IS
    'estimates.concrete_cost stores concrete cost data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.permit_cost IS
    'estimates.permit_cost stores permit cost data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.contingency_amount IS
    'estimates.contingency_amount stores contingency amount data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.subtotal IS
    'estimates.subtotal stores subtotal data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.tax_amount IS
    'estimates.tax_amount stores tax amount data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.total_amount IS
    'estimates.total_amount stores total amount data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.tax_rate IS
    'estimates.tax_rate stores tax rate data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.valid_until IS
    'estimates.valid_until stores valid until data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.status IS
    'estimates.status stores status data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.created_by IS
    'estimates.created_by stores created by data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.created_at IS
    'estimates.created_at stores created at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN estimates.updated_at IS
    'estimates.updated_at stores updated at data for the Fence Depot Estimator workflow.';

COMMENT ON TABLE contracts IS
    'Accepted commercial terms produced from estimates.';
COMMENT ON COLUMN contracts.contract_id IS
    'contracts.contract_id stores contract id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.contract_number IS
    'contracts.contract_number stores contract number data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.estimate_id IS
    'contracts.estimate_id stores estimate id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.project_id IS
    'contracts.project_id stores project id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.scope_of_work IS
    'contracts.scope_of_work stores scope of work data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.materials_description IS
    'contracts.materials_description stores materials description data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.labor_description IS
    'contracts.labor_description stores labor description data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.total_price IS
    'contracts.total_price stores total price data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.price_locked IS
    'contracts.price_locked stores price locked data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.deposit_amount IS
    'contracts.deposit_amount stores deposit amount data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.deposit_paid IS
    'contracts.deposit_paid stores deposit paid data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.balance_amount IS
    'contracts.balance_amount stores balance amount data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.payment_terms IS
    'contracts.payment_terms stores payment terms data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.warranty_period IS
    'contracts.warranty_period stores warranty period data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.warranty_terms IS
    'contracts.warranty_terms stores warranty terms data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.customer_signature IS
    'contracts.customer_signature stores customer signature data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.customer_signed_at IS
    'contracts.customer_signed_at stores customer signed at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.contractor_signature IS
    'contracts.contractor_signature stores contractor signature data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.contractor_signed_at IS
    'contracts.contractor_signed_at stores contractor signed at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.status IS
    'contracts.status stores status data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.created_at IS
    'contracts.created_at stores created at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN contracts.updated_at IS
    'contracts.updated_at stores updated at data for the Fence Depot Estimator workflow.';

COMMENT ON TABLE change_orders IS
    'Approved or pending changes that adjust contract scope.';
COMMENT ON COLUMN change_orders.change_order_id IS
    'change_orders.change_order_id stores change order id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.change_order_number IS
    'change_orders.change_order_number stores change order number data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.contract_id IS
    'change_orders.contract_id stores contract id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.project_id IS
    'change_orders.project_id stores project id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.description IS
    'change_orders.description stores description data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.reason IS
    'change_orders.reason stores reason data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.materials_change IS
    'change_orders.materials_change stores materials change data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.labor_change IS
    'change_orders.labor_change stores labor change data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.total_change IS
    'change_orders.total_change stores total change data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.timeline_change_days IS
    'change_orders.timeline_change_days stores timeline change days data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.customer_approved IS
    'change_orders.customer_approved stores customer approved data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.customer_approved_at IS
    'change_orders.customer_approved_at stores customer approved at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.customer_signature IS
    'change_orders.customer_signature stores customer signature data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.status IS
    'change_orders.status stores status data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.created_by IS
    'change_orders.created_by stores created by data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.created_at IS
    'change_orders.created_at stores created at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN change_orders.updated_at IS
    'change_orders.updated_at stores updated at data for the Fence Depot Estimator workflow.';

COMMENT ON TABLE signoffs IS
    'Closeout paperwork and final customer acceptance records.';
COMMENT ON COLUMN signoffs.signoff_id IS
    'signoffs.signoff_id stores signoff id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.signoff_number IS
    'signoffs.signoff_number stores signoff number data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.project_id IS
    'signoffs.project_id stores project id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.completion_date IS
    'signoffs.completion_date stores completion date data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.inspection_passed IS
    'signoffs.inspection_passed stores inspection passed data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.walkthrough_completed IS
    'signoffs.walkthrough_completed stores walkthrough completed data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.warranty_explained IS
    'signoffs.warranty_explained stores warranty explained data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.outstanding_items IS
    'signoffs.outstanding_items stores outstanding items data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.punch_list IS
    'signoffs.punch_list stores punch list data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.customer_satisfied IS
    'signoffs.customer_satisfied stores customer satisfied data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.customer_signature IS
    'signoffs.customer_signature stores customer signature data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.customer_signed_at IS
    'signoffs.customer_signed_at stores customer signed at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.contractor_signature IS
    'signoffs.contractor_signature stores contractor signature data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.contractor_signed_at IS
    'signoffs.contractor_signed_at stores contractor signed at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.photos_count IS
    'signoffs.photos_count stores photos count data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.status IS
    'signoffs.status stores status data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.created_at IS
    'signoffs.created_at stores created at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN signoffs.updated_at IS
    'signoffs.updated_at stores updated at data for the Fence Depot Estimator workflow.';

COMMENT ON TABLE notes IS
    'Internal notes that may be project-specific or global.';
COMMENT ON COLUMN notes.note_id IS
    'notes.note_id stores note id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN notes.project_id IS
    'notes.project_id stores project id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN notes.title IS
    'notes.title stores title data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN notes.category IS
    'notes.category stores category data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN notes.content IS
    'notes.content stores content data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN notes.created_by IS
    'notes.created_by stores created by data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN notes.is_pinned IS
    'notes.is_pinned stores is pinned data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN notes.tags IS
    'notes.tags stores tags data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN notes.created_at IS
    'notes.created_at stores created at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN notes.updated_at IS
    'notes.updated_at stores updated at data for the Fence Depot Estimator workflow.';

COMMENT ON TABLE inventory IS
    'Product catalog and stock data used by estimating and purchasing.';
COMMENT ON COLUMN inventory.inventory_id IS
    'inventory.inventory_id stores inventory id data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.sku IS
    'inventory.sku stores sku data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.name IS
    'inventory.name stores name data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.category IS
    'inventory.category stores category data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.subcategory IS
    'inventory.subcategory stores subcategory data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.fence_type IS
    'inventory.fence_type stores fence type data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.unit IS
    'inventory.unit stores unit data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.unit_cost IS
    'inventory.unit_cost stores unit cost data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.retail_price IS
    'inventory.retail_price stores retail price data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.quantity_on_hand IS
    'inventory.quantity_on_hand stores quantity on hand data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.reorder_level IS
    'inventory.reorder_level stores reorder level data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.supplier IS
    'inventory.supplier stores supplier data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.supplier_sku IS
    'inventory.supplier_sku stores supplier sku data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.description IS
    'inventory.description stores description data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.is_active IS
    'inventory.is_active stores is active data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.created_at IS
    'inventory.created_at stores created at data for the Fence Depot Estimator workflow.';
COMMENT ON COLUMN inventory.updated_at IS
    'inventory.updated_at stores updated at data for the Fence Depot Estimator workflow.';

-- Indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_estimator ON projects(estimator_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_project_number ON projects(project_number);
CREATE INDEX idx_fence_specs_project ON fence_specs(project_id);
CREATE INDEX idx_fence_specs_type ON fence_specs(fence_type);
CREATE INDEX idx_fence_specs_created_at ON fence_specs(created_at);
CREATE INDEX idx_estimates_project ON estimates(project_id);
CREATE INDEX idx_estimates_spec ON estimates(spec_id);
CREATE INDEX idx_estimates_status ON estimates(status);
CREATE INDEX idx_estimates_created_at ON estimates(created_at);
CREATE INDEX idx_contracts_project ON contracts(project_id);
CREATE INDEX idx_contracts_estimate ON contracts(estimate_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_created_at ON contracts(created_at);
CREATE INDEX idx_change_orders_contract ON change_orders(contract_id);
CREATE INDEX idx_change_orders_project ON change_orders(project_id);
CREATE INDEX idx_change_orders_status ON change_orders(status);
CREATE INDEX idx_change_orders_created_at ON change_orders(created_at);
CREATE INDEX idx_signoffs_project ON signoffs(project_id);
CREATE INDEX idx_signoffs_status ON signoffs(status);
CREATE INDEX idx_signoffs_created_at ON signoffs(created_at);
CREATE INDEX idx_notes_project ON notes(project_id);
CREATE INDEX idx_notes_created_by ON notes(created_by);
CREATE INDEX idx_notes_category ON notes(category);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_subcategory ON inventory(subcategory);
CREATE INDEX idx_inventory_fence_type ON inventory(fence_type);
CREATE INDEX idx_inventory_quantity ON inventory(quantity_on_hand);
CREATE INDEX idx_inventory_created_at ON inventory(created_at);

-- Triggers
CREATE TRIGGER trg_projects_assign_number BEFORE INSERT ON projects FOR EACH ROW EXECUTE FUNCTION assign_project_number();
CREATE TRIGGER trg_estimates_assign_number BEFORE INSERT ON estimates FOR EACH ROW EXECUTE FUNCTION assign_estimate_number();
CREATE TRIGGER trg_contracts_assign_number BEFORE INSERT ON contracts FOR EACH ROW EXECUTE FUNCTION assign_contract_number();
CREATE TRIGGER trg_change_orders_assign_number BEFORE INSERT ON change_orders FOR EACH ROW EXECUTE FUNCTION assign_change_order_number();
CREATE TRIGGER trg_signoffs_assign_number BEFORE INSERT ON signoffs FOR EACH ROW EXECUTE FUNCTION assign_signoff_number();
CREATE TRIGGER trg_users_set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_projects_set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_fence_specs_set_updated_at BEFORE UPDATE ON fence_specs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_estimates_set_updated_at BEFORE UPDATE ON estimates FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_contracts_set_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_change_orders_set_updated_at BEFORE UPDATE ON change_orders FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_signoffs_set_updated_at BEFORE UPDATE ON signoffs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_notes_set_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_inventory_set_updated_at BEFORE UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION set_updated_at();
