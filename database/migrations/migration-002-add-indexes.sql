-- ============================================================
-- MIGRATION 002: Add Indexes for Performance
-- Run: psql -d fence_estimator -f migration-002-add-indexes.sql
-- ============================================================

\echo 'Running Migration 002: Adding performance indexes...'

-- Full-text search index on inventory name + description
CREATE INDEX IF NOT EXISTS idx_inventory_fts
    ON inventory USING GIN(
        to_tsvector('english', name) || to_tsvector('english', COALESCE(description, ''))
    );

-- Composite index for estimate lookups
CREATE INDEX IF NOT EXISTS idx_estimates_project_status
    ON estimates(project_id, status);

-- Composite index for project lookups by customer
CREATE INDEX IF NOT EXISTS idx_projects_customer_status
    ON projects(customer_id, status);

-- Composite for notes pinned / project
CREATE INDEX IF NOT EXISTS idx_notes_project_pinned
    ON notes(project_id, is_pinned);

-- Composite for audit log lookups
CREATE INDEX IF NOT EXISTS idx_audit_table_record
    ON audit_log(table_name, record_id);

\echo 'Migration 002 complete.'
