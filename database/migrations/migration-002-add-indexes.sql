
-- Migration 002: indexes already included in schema.sql for SQLite deployments.
-- Re-run targeted CREATE INDEX statements if applying incrementally.
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_catalog_products_category ON catalog_products(category);
