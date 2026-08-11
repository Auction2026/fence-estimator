-- Fence Estimator PostgreSQL Schema
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(80) NOT NULL UNIQUE,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'estimator',
  company VARCHAR(120),
  phone VARCHAR(32),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(160) NOT NULL,
  customer_email VARCHAR(160),
  customer_phone VARCHAR(32),
  service_address TEXT NOT NULL,
  city VARCHAR(100),
  state VARCHAR(50),
  zip_code VARCHAR(20),
  estimator_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  start_date DATE,
  target_completion_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fence_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  fence_type VARCHAR(80) NOT NULL,
  height_feet NUMERIC(8,2) NOT NULL,
  material VARCHAR(80) NOT NULL,
  post_type VARCHAR(80),
  gate_count INTEGER NOT NULL DEFAULT 0,
  linear_feet NUMERIC(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  estimate_number VARCHAR(40) NOT NULL UNIQUE,
  materials_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  labor_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  equipment_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  valid_until DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  estimate_id UUID REFERENCES estimates(id),
  contract_number VARCHAR(40) NOT NULL UNIQUE,
  scope_of_work TEXT NOT NULL,
  materials_description TEXT,
  labor_description TEXT,
  contract_total NUMERIC(12,2) NOT NULL,
  price_locked BOOLEAN NOT NULL DEFAULT FALSE,
  customer_signature TEXT,
  estimator_signature TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS change_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id),
  change_order_number VARCHAR(40) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  materials_delta NUMERIC(12,2) NOT NULL DEFAULT 0,
  labor_delta NUMERIC(12,2) NOT NULL DEFAULT 0,
  equipment_delta NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_delta NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_delta NUMERIC(12,2) NOT NULL DEFAULT 0,
  approval_status VARCHAR(30) NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sign_offs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
  sign_off_number VARCHAR(40) NOT NULL UNIQUE,
  completion_date DATE,
  inspection_status VARCHAR(40) NOT NULL DEFAULT 'pending',
  photo_urls TEXT,
  customer_signature TEXT,
  foreman_signature TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
  title VARCHAR(140) NOT NULL,
  category VARCHAR(60) NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku VARCHAR(60) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(60) NOT NULL,
  cost NUMERIC(12,2) NOT NULL,
  retail_price NUMERIC(12,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit VARCHAR(30) NOT NULL DEFAULT 'each',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_estimator_id ON projects(estimator_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_fence_specs_project_id ON fence_specs(project_id);
CREATE INDEX IF NOT EXISTS idx_estimates_project_id ON estimates(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_change_orders_project_id ON change_orders(project_id);
CREATE INDEX IF NOT EXISTS idx_sign_offs_project_id ON sign_offs(project_id);
CREATE INDEX IF NOT EXISTS idx_notes_project_id ON notes(project_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory(category);

ALTER TABLE projects ADD CONSTRAINT chk_project_status CHECK (status IN ('draft','active','completed','cancelled'));
ALTER TABLE estimates ADD CONSTRAINT chk_estimate_status CHECK (status IN ('draft','sent','accepted','rejected','expired'));
ALTER TABLE change_orders ADD CONSTRAINT chk_change_status CHECK (approval_status IN ('pending','approved','rejected'));
ALTER TABLE sign_offs ADD CONSTRAINT chk_inspection_status CHECK (inspection_status IN ('pending','passed','failed'));
