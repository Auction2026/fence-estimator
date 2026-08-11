
PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'sales' CHECK (role IN ('admin', 'sales', 'operations', 'estimator')),
  full_name TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  property_type TEXT NOT NULL DEFAULT 'residential' CHECK (property_type IN ('residential', 'commercial', 'industrial', 'municipal')),
  created_by_user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_number TEXT NOT NULL UNIQUE,
  customer_id INTEGER NOT NULL,
  salesperson_user_id INTEGER NOT NULL,
  project_name TEXT NOT NULL,
  site_address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'estimating', 'quoted', 'contracted', 'scheduled', 'installed', 'closed')),
  target_install_date TEXT,
  permit_required INTEGER NOT NULL DEFAULT 0 CHECK (permit_required IN (0, 1)),
  utility_locate_required INTEGER NOT NULL DEFAULT 1 CHECK (utility_locate_required IN (0, 1)),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (salesperson_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS fence_specifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL UNIQUE,
  fence_type TEXT NOT NULL CHECK (fence_type IN ('chain-link', 'ornamental', 'vinyl', 'wood', 'privacy')),
  height_ft REAL NOT NULL CHECK (height_ft >= 3 AND height_ft <= 12),
  linear_feet REAL NOT NULL CHECK (linear_feet > 0),
  number_of_posts INTEGER NOT NULL DEFAULT 0 CHECK (number_of_posts >= 0),
  number_of_gates INTEGER NOT NULL DEFAULT 0 CHECK (number_of_gates >= 0),
  color TEXT,
  post_depth_in INTEGER NOT NULL DEFAULT 36 CHECK (post_depth_in BETWEEN 24 AND 72),
  corner_posts INTEGER NOT NULL DEFAULT 0 CHECK (corner_posts >= 0),
  end_posts INTEGER NOT NULL DEFAULT 0 CHECK (end_posts >= 0),
  line_posts INTEGER NOT NULL DEFAULT 0 CHECK (line_posts >= 0),
  markup_percent REAL NOT NULL DEFAULT 35 CHECK (markup_percent >= 0 AND markup_percent <= 200),
  specification_notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS layout_segments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL,
  segment_order INTEGER NOT NULL,
  start_x REAL NOT NULL,
  start_y REAL NOT NULL,
  end_x REAL NOT NULL,
  end_y REAL NOT NULL,
  segment_length_ft REAL NOT NULL CHECK (segment_length_ft >= 0),
  segment_type TEXT NOT NULL DEFAULT 'run' CHECK (segment_type IN ('run', 'gate', 'corner', 'return')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  UNIQUE (project_id, segment_order)
);

CREATE TABLE IF NOT EXISTS estimates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  estimate_number TEXT NOT NULL UNIQUE,
  project_id INTEGER NOT NULL,
  estimator_user_id INTEGER NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1 CHECK (version_number > 0),
  material_cost REAL NOT NULL DEFAULT 0 CHECK (material_cost >= 0),
  labor_cost REAL NOT NULL DEFAULT 0 CHECK (labor_cost >= 0),
  equipment_cost REAL NOT NULL DEFAULT 0 CHECK (equipment_cost >= 0),
  permit_cost REAL NOT NULL DEFAULT 0 CHECK (permit_cost >= 0),
  utility_cost REAL NOT NULL DEFAULT 0 CHECK (utility_cost >= 0),
  subtotal REAL NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  tax_rate REAL NOT NULL DEFAULT 13 CHECK (tax_rate >= 0 AND tax_rate <= 100),
  tax_amount REAL NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
  contingency_rate REAL NOT NULL DEFAULT 10 CHECK (contingency_rate >= 0 AND contingency_rate <= 100),
  contingency_amount REAL NOT NULL DEFAULT 0 CHECK (contingency_amount >= 0),
  total_amount REAL NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'approved', 'revised', 'expired')),
  valid_until TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (estimator_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_number TEXT NOT NULL UNIQUE,
  project_id INTEGER NOT NULL,
  estimate_id INTEGER NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'signed', 'cancelled', 'expired')),
  price_lock_days INTEGER NOT NULL DEFAULT 14 CHECK (price_lock_days BETWEEN 1 AND 365),
  deposit_percent REAL NOT NULL DEFAULT 30 CHECK (deposit_percent >= 0 AND deposit_percent <= 100),
  payment_terms TEXT NOT NULL,
  scope_of_work TEXT NOT NULL,
  customer_signature TEXT,
  signed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (estimate_id) REFERENCES estimates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS change_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  change_order_number TEXT NOT NULL UNIQUE,
  contract_id INTEGER NOT NULL,
  requested_by_user_id INTEGER NOT NULL,
  reason TEXT NOT NULL,
  scope_change TEXT NOT NULL,
  cost_change REAL NOT NULL DEFAULT 0,
  schedule_change_days INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'completed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
  FOREIGN KEY (requested_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS catalog_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT NOT NULL,
  unit_of_measure TEXT NOT NULL,
  unit_cost REAL NOT NULL CHECK (unit_cost >= 0),
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
  lead_time_days INTEGER NOT NULL DEFAULT 0 CHECK (lead_time_days >= 0),
  supplier_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(name);
CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_salesperson_user_id ON projects(salesperson_user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_fence_specifications_project_id ON fence_specifications(project_id);
CREATE INDEX IF NOT EXISTS idx_layout_segments_project_order ON layout_segments(project_id, segment_order);
CREATE INDEX IF NOT EXISTS idx_estimates_project_id ON estimates(project_id);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_change_orders_contract_id ON change_orders(contract_id);
CREATE INDEX IF NOT EXISTS idx_change_orders_status ON change_orders(status);
CREATE INDEX IF NOT EXISTS idx_catalog_products_category ON catalog_products(category);
CREATE INDEX IF NOT EXISTS idx_catalog_products_active ON catalog_products(active);

CREATE TRIGGER IF NOT EXISTS trg_projects_updated_at
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
  UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_fence_specs_updated_at
AFTER UPDATE ON fence_specifications
FOR EACH ROW
BEGIN
  UPDATE fence_specifications SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_estimates_updated_at
AFTER UPDATE ON estimates
FOR EACH ROW
BEGIN
  UPDATE estimates SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_contracts_updated_at
AFTER UPDATE ON contracts
FOR EACH ROW
BEGIN
  UPDATE contracts SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_change_orders_updated_at
AFTER UPDATE ON change_orders
FOR EACH ROW
BEGIN
  UPDATE change_orders SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

COMMIT;
