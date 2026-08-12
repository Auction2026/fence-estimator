-- ============================================================
-- Migration 002: Add Indexes for Performance
-- database/migrations/migration-002-add-indexes.sql
-- ============================================================

\echo 'Migration 002: Adding performance indexes...';

-- Full-text search index on products
CREATE INDEX IF NOT EXISTS idx_products_fts ON products
  USING GIN (to_tsvector('english', coalesce(name,'') || ' ' || coalesce(description,'') || ' ' || coalesce(sku,'')));

-- Index on projects updated_at for recent project queries
CREATE INDEX IF NOT EXISTS idx_projects_updated ON projects(updated_at DESC);

-- Index on estimates grand_total for reporting
CREATE INDEX IF NOT EXISTS idx_estimates_total ON estimates(grand_total DESC);

-- Index on notes category
CREATE INDEX IF NOT EXISTS idx_notes_category ON notes(category);

\echo 'Migration 002: Complete.';
