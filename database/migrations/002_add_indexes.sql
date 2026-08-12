-- Migration 002: Performance indexes and search helpers for Fence Estimator
-- File: /home/runner/work/fence-estimator/fence-estimator/database/migrations/002_add_indexes.sql

-- =============================================================================
-- UP MIGRATION
-- =============================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- idx_customers_user_created: Accelerates customer lookups by owner and newest-first sorting.
CREATE INDEX IF NOT EXISTS idx_customers_user_created ON customers (user_id, created_at DESC);

-- idx_customers_last_first: Speeds alphabetical customer directory browsing.
CREATE INDEX IF NOT EXISTS idx_customers_last_first ON customers (last_name, first_name);

-- idx_customers_state_city: Supports regional segmentation and tax reporting.
CREATE INDEX IF NOT EXISTS idx_customers_state_city ON customers (state, city);

-- idx_projects_customer_status: Supports fetching customer project lists by lifecycle status.
CREATE INDEX IF NOT EXISTS idx_projects_customer_status ON projects (customer_id, status, updated_at DESC);

-- idx_projects_user_status: Speeds estimator dashboards filtered by assigned user and current status.
CREATE INDEX IF NOT EXISTS idx_projects_user_status ON projects (user_id, status, updated_at DESC);

-- idx_projects_dates: Supports calendar and backlog views ordered by start and end date.
CREATE INDEX IF NOT EXISTS idx_projects_dates ON projects (start_date, end_date);

-- idx_estimates_project_version_desc: Finds the latest estimate version for a project quickly.
CREATE INDEX IF NOT EXISTS idx_estimates_project_version_desc ON estimates (project_id, version DESC);

-- idx_estimates_status_created: Supports sent/approved/draft estimate queues.
CREATE INDEX IF NOT EXISTS idx_estimates_status_created ON estimates (status, created_at DESC);

-- idx_estimates_type_total: Improves reporting by fence type and contract size.
CREATE INDEX IF NOT EXISTS idx_estimates_type_total ON estimates (fence_type, grand_total DESC);

-- idx_estimate_items_estimate_category: Optimizes cost bucket rollups inside a single estimate.
CREATE INDEX IF NOT EXISTS idx_estimate_items_estimate_category ON estimate_items (estimate_id, category);

-- idx_estimate_items_sku: Speeds joins from estimate items back to the product catalog.
CREATE INDEX IF NOT EXISTS idx_estimate_items_sku ON estimate_items (sku);

-- idx_gates_estimate_type: Useful when rendering gate summaries per estimate.
CREATE INDEX IF NOT EXISTS idx_gates_estimate_type ON gates (estimate_id, gate_type);

-- idx_contracts_status_created: Supports contract follow-up lists and signature chasing.
CREATE INDEX IF NOT EXISTS idx_contracts_status_created ON contracts (status, created_at DESC);

-- idx_payments_contract_date: Optimizes payment histories and aging calculations.
CREATE INDEX IF NOT EXISTS idx_payments_contract_date ON payments (contract_id, payment_date DESC);

-- idx_products_active_category_name: Improves product picker filtering by category and active flag.
CREATE INDEX IF NOT EXISTS idx_products_active_category_name ON products (active, category, name);

-- idx_products_stock_qty: Supports low-stock inventory views.
CREATE INDEX IF NOT EXISTS idx_products_stock_qty ON products (stock_qty);

-- idx_photos_project_uploaded: Speeds gallery display newest-first per project.
CREATE INDEX IF NOT EXISTS idx_photos_project_uploaded ON photos (project_id, upload_date DESC);

-- idx_audit_log_created_table: Supports audit browsing by time and table.
CREATE INDEX IF NOT EXISTS idx_audit_log_created_table ON audit_log (created_at DESC, table_name);

-- PostgreSQL full-text search indexes.
CREATE INDEX IF NOT EXISTS idx_customers_search_gin ON customers USING GIN (to_tsvector('simple', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(company, '') || ' ' || coalesce(email, '')));
CREATE INDEX IF NOT EXISTS idx_projects_search_gin ON projects USING GIN (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(site_address, '') || ' ' || coalesce(site_city, '') || ' ' || coalesce(notes, '')));
CREATE INDEX IF NOT EXISTS idx_products_search_gin ON products USING GIN (to_tsvector('simple', coalesce(sku, '') || ' ' || coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, '')));

-- MySQL 8+ equivalents:
-- ALTER TABLE customers ADD FULLTEXT INDEX ft_customers_search (first_name, last_name, company, email);
-- ALTER TABLE projects  ADD FULLTEXT INDEX ft_projects_search (name, site_address, site_city, notes);
-- ALTER TABLE products  ADD FULLTEXT INDEX ft_products_search (sku, name, description, category);

INSERT INTO schema_migrations (version, name) VALUES ('002', 'performance indexes and search helpers')
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- =============================================================================
-- DOWN MIGRATION
-- =============================================================================
-- BEGIN;
-- DELETE FROM schema_migrations WHERE version = '002';
-- DROP INDEX IF EXISTS idx_customers_user_created;
-- DROP INDEX IF EXISTS idx_customers_last_first;
-- DROP INDEX IF EXISTS idx_customers_state_city;
-- DROP INDEX IF EXISTS idx_projects_customer_status;
-- DROP INDEX IF EXISTS idx_projects_user_status;
-- DROP INDEX IF EXISTS idx_projects_dates;
-- DROP INDEX IF EXISTS idx_estimates_project_version_desc;
-- DROP INDEX IF EXISTS idx_estimates_status_created;
-- DROP INDEX IF EXISTS idx_estimates_type_total;
-- DROP INDEX IF EXISTS idx_estimate_items_estimate_category;
-- DROP INDEX IF EXISTS idx_estimate_items_sku;
-- DROP INDEX IF EXISTS idx_gates_estimate_type;
-- DROP INDEX IF EXISTS idx_contracts_status_created;
-- DROP INDEX IF EXISTS idx_payments_contract_date;
-- DROP INDEX IF EXISTS idx_products_active_category_name;
-- DROP INDEX IF EXISTS idx_products_stock_qty;
-- DROP INDEX IF EXISTS idx_photos_project_uploaded;
-- DROP INDEX IF EXISTS idx_audit_log_created_table;
-- DROP INDEX IF EXISTS idx_customers_search_gin;
-- DROP INDEX IF EXISTS idx_projects_search_gin;
-- DROP INDEX IF EXISTS idx_products_search_gin;
-- COMMIT;


-- =============================================================================
-- INDEX DESIGN NOTES
-- =============================================================================
-- Foreign key and join-heavy access paths:
--   * customers.user_id      -> owner-specific CRM views
--   * projects.customer_id   -> customer project history
--   * projects.user_id       -> estimator dashboard assignment lists
--   * estimates.project_id   -> latest-estimate lookup by project
--   * estimate_items.estimate_id -> rollup totals and proposal rendering
--   * gates.estimate_id      -> gate summaries by estimate
--   * contracts.estimate_id  -> contract state by estimate version
--   * payments.contract_id   -> collections and ledger views
--   * photos.project_id      -> gallery display and pre-job documentation
--
-- Search index guidance:
--   PostgreSQL uses GIN + to_tsvector for catalog and notes search.
--   MySQL uses FULLTEXT over equivalent string columns.
--   Application search terms should be normalized to plain words, not raw operators,
--   when the database is expected to support both engines.
--
-- Suggested validation queries after applying migration 002:
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
--   AND indexname LIKE 'idx_%'
-- ORDER BY indexname;
--
-- EXPLAIN ANALYZE
-- SELECT *
-- FROM estimates
-- WHERE project_id = 5
-- ORDER BY version DESC
-- LIMIT 1;
--
-- EXPLAIN ANALYZE
-- SELECT *
-- FROM customers
-- WHERE user_id = 2
-- ORDER BY created_at DESC
-- LIMIT 25;
--
-- EXPLAIN ANALYZE
-- SELECT *
-- FROM products
-- WHERE active = TRUE
--   AND category = 'hardware'
-- ORDER BY name
-- LIMIT 50;
--
-- MySQL 8+ equivalent DDL examples:
-- ALTER TABLE customers ADD INDEX idx_customers_user_created (user_id, created_at DESC);
-- ALTER TABLE customers ADD INDEX idx_customers_last_first (last_name, first_name);
-- ALTER TABLE customers ADD INDEX idx_customers_state_city (state, city);
-- ALTER TABLE projects  ADD INDEX idx_projects_customer_status (customer_id, status, updated_at DESC);
-- ALTER TABLE projects  ADD INDEX idx_projects_user_status (user_id, status, updated_at DESC);
-- ALTER TABLE projects  ADD INDEX idx_projects_dates (start_date, end_date);
-- ALTER TABLE estimates ADD INDEX idx_estimates_project_version_desc (project_id, version DESC);
-- ALTER TABLE estimates ADD INDEX idx_estimates_status_created (status, created_at DESC);
-- ALTER TABLE estimates ADD INDEX idx_estimates_type_total (fence_type, grand_total DESC);
-- ALTER TABLE estimate_items ADD INDEX idx_estimate_items_estimate_category (estimate_id, category);
-- ALTER TABLE estimate_items ADD INDEX idx_estimate_items_sku (sku);
-- ALTER TABLE gates ADD INDEX idx_gates_estimate_type (estimate_id, gate_type);
-- ALTER TABLE contracts ADD INDEX idx_contracts_status_created (status, created_at DESC);
-- ALTER TABLE payments ADD INDEX idx_payments_contract_date (contract_id, payment_date DESC);
-- ALTER TABLE products ADD INDEX idx_products_active_category_name (active, category, name);
-- ALTER TABLE products ADD INDEX idx_products_stock_qty (stock_qty);
-- ALTER TABLE photos ADD INDEX idx_photos_project_uploaded (project_id, upload_date DESC);
-- ALTER TABLE audit_log ADD INDEX idx_audit_log_created_table (created_at DESC, table_name);
--
-- Optional PostgreSQL-only expression and filtered indexes for large deployments:
-- CREATE INDEX IF NOT EXISTS idx_customers_email_lower ON customers (lower(email));
-- CREATE INDEX IF NOT EXISTS idx_projects_active_schedule ON projects (start_date, end_date) WHERE status IN ('approved', 'scheduled', 'in-progress');
-- CREATE INDEX IF NOT EXISTS idx_payments_recent_only ON payments (payment_date DESC) WHERE payment_date >= CURRENT_DATE - INTERVAL '365 days';
-- CREATE INDEX IF NOT EXISTS idx_products_active_name_trgm ON products USING GIN (name gin_trgm_ops) WHERE active = TRUE;
--
-- Operational reminders:
--   1. Run ANALYZE after bulk seed loads.
--   2. Revisit low-cardinality indexes if write throughput becomes a bottleneck.
--   3. Validate search behavior separately on PostgreSQL and MySQL because ranking differs.
--   4. Rebuild bloated GIN indexes during scheduled maintenance windows when needed.
--   5. Monitor slow-query logs before adding more specialized indexes.


-- =============================================================================
-- EXTENDED PERFORMANCE PLAYBOOK
-- =============================================================================
-- Read-heavy dashboard patterns that benefit from this migration:
--   * estimator home screen filtered by user and status
--   * customer directory sorted alphabetically or by owner
--   * latest estimate lookup by project
--   * collections board by contract status and payment history
--   * product picker filtered by active category and name
--
-- Write-impact guidance:
--   * High-ingest systems may defer trigram or search indexes until after initial import.
--   * GIN maintenance cost should be measured if product descriptions are updated frequently.
--   * Consider creating large indexes CONCURRENTLY in production change windows.
--
-- PostgreSQL production alternatives:
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_products_active_category_name
--     ON products (active, category, name);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_estimates_project_version_desc
--     ON estimates (project_id, version DESC);
--
-- Additional optional indexes for larger datasets:
-- CREATE INDEX IF NOT EXISTS idx_projects_city_status ON projects (site_city, status);
-- CREATE INDEX IF NOT EXISTS idx_projects_state_status ON projects (site_state, status);
-- CREATE INDEX IF NOT EXISTS idx_estimates_created_month ON estimates (date_trunc('month', created_at));
-- CREATE INDEX IF NOT EXISTS idx_payments_method_contract ON payments (payment_method, contract_id);
-- CREATE INDEX IF NOT EXISTS idx_products_category_stock ON products (category, stock_qty);
-- CREATE INDEX IF NOT EXISTS idx_audit_log_table_created_user ON audit_log (table_name, created_at DESC, user_id);
--
-- Verification checklist:
--   1. Run EXPLAIN on the five most common list queries.
--   2. Confirm no duplicate or conflicting legacy indexes remain.
--   3. Compare seed-load duration before and after optional search indexes.
--   4. Check pg_stat_user_indexes after real traffic to validate usefulness.
--   5. Remove unused indexes during later tuning if write overhead becomes noticeable.
