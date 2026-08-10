CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'estimator',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  project_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(120) NOT NULL,
  address TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  created_by BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE fence_specs (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  fence_type VARCHAR(80) NOT NULL,
  height_ft NUMERIC(6,2) NOT NULL CHECK (height_ft > 0),
  linear_feet NUMERIC(12,2) NOT NULL CHECK (linear_feet > 0),
  color VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE estimates (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  fence_specs_id BIGINT REFERENCES fence_specs(id),
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  overhead NUMERIC(12,2) NOT NULL DEFAULT 0,
  margin NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE contracts (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  estimate_id BIGINT NOT NULL REFERENCES estimates(id),
  terms TEXT,
  total_amount NUMERIC(12,2) NOT NULL,
  price_locked BOOLEAN NOT NULL DEFAULT TRUE,
  signed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE change_orders (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_id BIGINT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  delta_amount NUMERIC(12,2) NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE signoff (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  customer_name VARCHAR(120) NOT NULL,
  signature TEXT NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE notes (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tab_key VARCHAR(40) NOT NULL,
  body TEXT NOT NULL,
  created_by BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE inventory (
  id BIGSERIAL PRIMARY KEY,
  sku VARCHAR(60) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(80) NOT NULL,
  uom VARCHAR(20) NOT NULL DEFAULT 'each',
  unit_cost NUMERIC(12,2) NOT NULL CHECK (unit_cost >= 0),
  quantity_on_hand NUMERIC(12,2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_created_by ON projects(created_by);
CREATE INDEX idx_fence_specs_project_id ON fence_specs(project_id);
CREATE INDEX idx_estimates_project_id ON estimates(project_id);
CREATE INDEX idx_contracts_project_id ON contracts(project_id);
CREATE INDEX idx_change_orders_project_id ON change_orders(project_id);
CREATE INDEX idx_notes_project_id ON notes(project_id);
CREATE INDEX idx_inventory_category ON inventory(category);
