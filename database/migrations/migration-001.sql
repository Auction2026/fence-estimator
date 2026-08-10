BEGIN TRANSACTION;

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'estimator',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  fence_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  linear_feet REAL NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_tabs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  tab_key TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, tab_key)
);

CREATE TABLE IF NOT EXISTS estimates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  fence_type TEXT NOT NULL,
  linear_feet REAL NOT NULL,
  height_feet REAL NOT NULL,
  gates INTEGER NOT NULL DEFAULT 0,
  tear_out_feet REAL NOT NULL DEFAULT 0,
  labour_rate REAL NOT NULL,
  overhead_rate REAL NOT NULL,
  profit_rate REAL NOT NULL,
  subtotal REAL NOT NULL,
  overhead REAL NOT NULL,
  profit REAL NOT NULL,
  total REAL NOT NULL,
  breakdown_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  estimate_id INTEGER REFERENCES estimates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  total REAL NOT NULL,
  payment_terms TEXT,
  scope TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS catalog_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  unit TEXT NOT NULL,
  price REAL NOT NULL,
  taxable INTEGER NOT NULL DEFAULT 1,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id INTEGER,
  action TEXT NOT NULL,
  payload_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_tabs_project_key ON project_tabs(project_id, tab_key);
CREATE INDEX IF NOT EXISTS idx_estimates_project ON estimates(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_project ON contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_catalog_category ON catalog_products(category);

INSERT INTO audit_logs (entity_type, entity_id, action, payload_json)
VALUES ('migration', 1, 'migration-001-applied', '{"description":"Initial fence estimator schema"}');

COMMIT;
