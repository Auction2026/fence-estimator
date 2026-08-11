-- Fence Estimator relational schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'estimator',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id BIGSERIAL PRIMARY KEY,
  customer_code VARCHAR(40) UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(180),
  phone VARCHAR(40),
  billing_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  project_code VARCHAR(40) UNIQUE NOT NULL,
  customer_id BIGINT NOT NULL REFERENCES customers(id),
  estimator_id BIGINT REFERENCES users(id),
  name VARCHAR(180) NOT NULL,
  site_address TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  sku VARCHAR(60) UNIQUE NOT NULL,
  category VARCHAR(80) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  unit VARCHAR(20) NOT NULL DEFAULT 'ea',
  unit_cost NUMERIC(12,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id),
  quantity_on_hand NUMERIC(12,2) NOT NULL DEFAULT 0,
  reorder_level NUMERIC(12,2) NOT NULL DEFAULT 0,
  warehouse VARCHAR(80) NOT NULL DEFAULT 'main',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, warehouse)
);

CREATE TABLE IF NOT EXISTS estimates (
  id BIGSERIAL PRIMARY KEY,
  estimate_no VARCHAR(50) UNIQUE NOT NULL,
  project_id BIGINT NOT NULL REFERENCES projects(id),
  version_no INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  tax_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(14,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS estimate_items (
  id BIGSERIAL PRIMARY KEY,
  estimate_id BIGINT NOT NULL REFERENCES estimates(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  line_type VARCHAR(20) NOT NULL DEFAULT 'material',
  description TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL,
  unit_price NUMERIC(12,2) NOT NULL,
  line_total NUMERIC(14,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

CREATE TABLE IF NOT EXISTS change_orders (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT NOT NULL REFERENCES projects(id),
  estimate_id BIGINT REFERENCES estimates(id),
  reason TEXT NOT NULL,
  amount_delta NUMERIC(14,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id BIGINT REFERENCES users(id),
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT NOT NULL,
  action VARCHAR(50) NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
