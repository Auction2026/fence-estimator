BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'estimator',
  company VARCHAR(180) NOT NULL,
  phone VARCHAR(40),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(40) NOT NULL UNIQUE,
  estimator_id UUID REFERENCES users(id),
  customer_name VARCHAR(180) NOT NULL,
  customer_email VARCHAR(180) NOT NULL,
  customer_phone VARCHAR(40) NOT NULL,
  address_line TEXT NOT NULL,
  city VARCHAR(120) NOT NULL,
  province VARCHAR(60) NOT NULL,
  postal_code VARCHAR(30) NOT NULL,
  property_size NUMERIC(12, 2) DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  project_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fence_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  fence_type VARCHAR(80) NOT NULL,
  height_feet NUMERIC(6,2) NOT NULL,
  color VARCHAR(80) DEFAULT '',
  grade VARCHAR(80) DEFAULT 'Residential',
  linear_feet NUMERIC(12,2) NOT NULL DEFAULT 0,
  posts INTEGER NOT NULL DEFAULT 0,
  gates INTEGER NOT NULL DEFAULT 0,
  gate_width NUMERIC(6,2) NOT NULL DEFAULT 0,
  terrain VARCHAR(40) DEFAULT 'Flat',
  install_type VARCHAR(40) DEFAULT 'Residential',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_number VARCHAR(40) NOT NULL UNIQUE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  customer_name VARCHAR(180) NOT NULL,
  fence_type VARCHAR(80) NOT NULL,
  height_feet NUMERIC(6,2) NOT NULL DEFAULT 6,
  linear_feet NUMERIC(12,2) NOT NULL DEFAULT 0,
  labor_hours NUMERIC(12,2) NOT NULL DEFAULT 0,
  material_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  labor_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  equipment_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  permit_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  utility_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  contingency NUMERIC(12,2) NOT NULL DEFAULT 0,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number VARCHAR(40) NOT NULL UNIQUE,
  estimate_id UUID REFERENCES estimates(id),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  customer_name VARCHAR(180) NOT NULL,
  scope_of_work TEXT NOT NULL,
  materials_summary TEXT NOT NULL,
  labor_summary TEXT NOT NULL,
  timeline TEXT NOT NULL,
  total_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  deposit_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  warranty TEXT DEFAULT '',
  terms TEXT DEFAULT '',
  price_locked BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS change_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  change_order_number VARCHAR(40) NOT NULL UNIQUE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  reason TEXT DEFAULT '',
  cost_change NUMERIC(12,2) NOT NULL DEFAULT 0,
  timeline_change TEXT DEFAULT '',
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS signoffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  company_rep VARCHAR(120) NOT NULL,
  inspection_passed BOOLEAN NOT NULL DEFAULT FALSE,
  customer_walkthrough BOOLEAN NOT NULL DEFAULT FALSE,
  warranty_explained BOOLEAN NOT NULL DEFAULT FALSE,
  outstanding_items TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL,
  category VARCHAR(80) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit_of_measure VARCHAR(20) NOT NULL DEFAULT 'each',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
