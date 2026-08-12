-- Fence Estimator Index Strategy
-- File: /home/runner/work/fence-estimator/fence-estimator/database/indexes.sql
-- Reference indexes for PostgreSQL 14+ with MySQL 8+ notes where relevant.

-- =============================================================================
-- CORE LOOKUP INDEXES
-- =============================================================================
-- Supports unique login and email validation lookups.
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique_cover ON users (username);

-- Supports unique login and email validation lookups.
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique_cover ON users (email);

-- Speeds CRM lists by last name, first name.
CREATE INDEX IF NOT EXISTS idx_customers_last_first_created ON customers (last_name, first_name, created_at DESC);

-- Filters customers by assigned estimator/owner.
CREATE INDEX IF NOT EXISTS idx_customers_user_city ON customers (user_id, city, last_name);

-- Supports email-based customer search and de-duplication.
CREATE INDEX IF NOT EXISTS idx_customers_email_lookup ON customers (email);

-- Retrieves all projects for a customer ordered by most recent update.
CREATE INDEX IF NOT EXISTS idx_projects_customer_updated ON projects (customer_id, updated_at DESC);

-- Supports estimator dashboard filters.
CREATE INDEX IF NOT EXISTS idx_projects_user_status_updated ON projects (user_id, status, updated_at DESC);

-- Optimizes project scheduling calendar queries.
CREATE INDEX IF NOT EXISTS idx_projects_status_dates ON projects (status, start_date, end_date);

-- Locates latest estimate version quickly.
CREATE INDEX IF NOT EXISTS idx_estimates_project_version_latest ON estimates (project_id, version DESC);

-- Supports estimate pipeline reporting.
CREATE INDEX IF NOT EXISTS idx_estimates_status_type_created ON estimates (status, fence_type, created_at DESC);

-- Useful for large-estimate reporting and margin screens.
CREATE INDEX IF NOT EXISTS idx_estimates_total_desc ON estimates (grand_total DESC, subtotal DESC);

-- Supports cost breakdown rendering per estimate.
CREATE INDEX IF NOT EXISTS idx_estimate_items_estimate_category_total ON estimate_items (estimate_id, category, total_price DESC);

-- Speeds product cross-reference from estimate items.
CREATE INDEX IF NOT EXISTS idx_estimate_items_sku_lookup ON estimate_items (sku);

-- Supports gate summary rendering.
CREATE INDEX IF NOT EXISTS idx_gates_estimate_gate_type ON gates (estimate_id, gate_type);

-- Speeds contract status queues.
CREATE INDEX IF NOT EXISTS idx_contracts_status_signed_date ON contracts (status, signed_date DESC);

-- Retrieves payment history by contract and date.
CREATE INDEX IF NOT EXISTS idx_payments_contract_date_desc ON payments (contract_id, payment_date DESC);

-- Supports payment reconciliation by method and date.
CREATE INDEX IF NOT EXISTS idx_payments_method_date ON payments (payment_method, payment_date DESC);

-- Product picker filter on active items by category then name.
CREATE INDEX IF NOT EXISTS idx_products_active_category_name_cover ON products (active, category, name);

-- Helps low-stock reports and reorder suggestions.
CREATE INDEX IF NOT EXISTS idx_products_stock_active ON products (active, stock_qty);

-- Gallery retrieval per project newest-first.
CREATE INDEX IF NOT EXISTS idx_photos_project_uploaded_desc ON photos (project_id, upload_date DESC);

-- Audit browsing by entity timeline.
CREATE INDEX IF NOT EXISTS idx_audit_table_record_created ON audit_log (table_name, record_id, created_at DESC);

-- Audit browsing by actor timeline.
CREATE INDEX IF NOT EXISTS idx_audit_user_created ON audit_log (user_id, created_at DESC);

-- =============================================================================
-- COMPOSITE / COVERING INDEXES
-- =============================================================================
-- PostgreSQL INCLUDE columns act as covering indexes for list screens.
CREATE INDEX IF NOT EXISTS idx_projects_customer_status_cover
ON projects (customer_id, status)
INCLUDE (name, site_city, site_state, updated_at);

CREATE INDEX IF NOT EXISTS idx_estimates_project_cover
ON estimates (project_id, version DESC)
INCLUDE (status, fence_type, grand_total, updated_at);

CREATE INDEX IF NOT EXISTS idx_products_category_cover
ON products (category, active, name)
INCLUDE (sku, unit_price, stock_qty);

CREATE INDEX IF NOT EXISTS idx_contracts_estimate_cover
ON contracts (estimate_id, status)
INCLUDE (signed_date, deposit_amount, deposit_paid);

CREATE INDEX IF NOT EXISTS idx_payments_contract_cover
ON payments (contract_id, payment_date DESC)
INCLUDE (amount, payment_method, reference_number);

-- MySQL 8+ does not support INCLUDE columns directly; use wider composite BTREE indexes instead.

-- =============================================================================
-- PARTIAL / FILTERED INDEXES (POSTGRESQL)
-- =============================================================================
-- Active draft estimates are frequently revisited by estimators.
CREATE INDEX IF NOT EXISTS idx_estimates_draft_only ON estimates (project_id, updated_at DESC) WHERE status = 'draft';

-- Approved and sent contracts are high-priority for collections and scheduling.
CREATE INDEX IF NOT EXISTS idx_contracts_open_only ON contracts (status, created_at DESC) WHERE status IN ('sent', 'signed');

-- Current sellable products only.
CREATE INDEX IF NOT EXISTS idx_products_active_only ON products (category, name) WHERE active = TRUE;

-- Photos recent activity feed.
CREATE INDEX IF NOT EXISTS idx_photos_recent_only ON photos (upload_date DESC) WHERE upload_date >= CURRENT_DATE - INTERVAL '90 days';

-- MySQL 8+ alternative: emulate partial indexes with generated columns or broader composite indexes.

-- =============================================================================
-- FULL-TEXT / SEARCH INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_customers_search_text ON customers USING GIN (to_tsvector('simple', coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' || coalesce(company, '') || ' ' || coalesce(email, '') || ' ' || coalesce(phone, '')));

CREATE INDEX IF NOT EXISTS idx_projects_search_text ON projects USING GIN (to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(site_address, '') || ' ' || coalesce(site_city, '') || ' ' || coalesce(site_state, '') || ' ' || coalesce(notes, '')));

CREATE INDEX IF NOT EXISTS idx_products_search_text ON products USING GIN (to_tsvector('simple', coalesce(sku, '') || ' ' || coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(category, '')));

-- MySQL 8+ equivalents:
-- ALTER TABLE customers ADD FULLTEXT INDEX ft_customers_search_text (first_name, last_name, company, email, phone);
-- ALTER TABLE projects  ADD FULLTEXT INDEX ft_projects_search_text (name, site_address, site_city, site_state, notes);
-- ALTER TABLE products  ADD FULLTEXT INDEX ft_products_search_text (sku, name, description, category);

-- =============================================================================
-- OPTIONAL TRIGRAM INDEXES (POSTGRESQL)
-- =============================================================================
-- Requires: CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_sku_trgm ON products USING GIN (sku gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_customers_company_trgm ON customers USING GIN (company gin_trgm_ops);

-- =============================================================================
-- MAINTENANCE NOTES
-- =============================================================================
-- Run ANALYZE after large seed loads to refresh planner statistics.
-- Rebuild or drop rarely used optional indexes in smaller deployments if write throughput matters more than read speed.
-- Review partial index predicates if business status names change in the application.


-- =============================================================================
-- MYSQL 8+ INDEX REFERENCE
-- =============================================================================
-- The following statements mirror the PostgreSQL strategy using MySQL 8+ syntax.
-- ALTER TABLE users ADD UNIQUE INDEX idx_users_username_unique_cover (username);
-- ALTER TABLE users ADD UNIQUE INDEX idx_users_email_unique_cover (email);
-- ALTER TABLE customers ADD INDEX idx_customers_last_first_created (last_name, first_name, created_at DESC);
-- ALTER TABLE customers ADD INDEX idx_customers_user_city (user_id, city, last_name);
-- ALTER TABLE customers ADD INDEX idx_customers_email_lookup (email);
-- ALTER TABLE projects ADD INDEX idx_projects_customer_updated (customer_id, updated_at DESC);
-- ALTER TABLE projects ADD INDEX idx_projects_user_status_updated (user_id, status, updated_at DESC);
-- ALTER TABLE projects ADD INDEX idx_projects_status_dates (status, start_date, end_date);
-- ALTER TABLE estimates ADD INDEX idx_estimates_project_version_latest (project_id, version DESC);
-- ALTER TABLE estimates ADD INDEX idx_estimates_status_type_created (status, fence_type, created_at DESC);
-- ALTER TABLE estimates ADD INDEX idx_estimates_total_desc (grand_total DESC, subtotal DESC);
-- ALTER TABLE estimate_items ADD INDEX idx_estimate_items_estimate_category_total (estimate_id, category, total_price DESC);
-- ALTER TABLE estimate_items ADD INDEX idx_estimate_items_sku_lookup (sku);
-- ALTER TABLE gates ADD INDEX idx_gates_estimate_gate_type (estimate_id, gate_type);
-- ALTER TABLE contracts ADD INDEX idx_contracts_status_signed_date (status, signed_date DESC);
-- ALTER TABLE payments ADD INDEX idx_payments_contract_date_desc (contract_id, payment_date DESC);
-- ALTER TABLE payments ADD INDEX idx_payments_method_date (payment_method, payment_date DESC);
-- ALTER TABLE products ADD INDEX idx_products_active_category_name_cover (active, category, name);
-- ALTER TABLE products ADD INDEX idx_products_stock_active (active, stock_qty);
-- ALTER TABLE photos ADD INDEX idx_photos_project_uploaded_desc (project_id, upload_date DESC);
-- ALTER TABLE audit_log ADD INDEX idx_audit_table_record_created (table_name, record_id, created_at DESC);
-- ALTER TABLE audit_log ADD INDEX idx_audit_user_created (user_id, created_at DESC);
--
-- =============================================================================
-- QUERY PATTERN GUIDE
-- =============================================================================
-- Customer directory:
--   SELECT * FROM customers
--   WHERE user_id = ?
--   ORDER BY last_name, first_name;
--   Uses idx_customers_last_first_created or idx_customers_user_city depending on filter.
--
-- Project history by customer:
--   SELECT * FROM projects
--   WHERE customer_id = ?
--   ORDER BY updated_at DESC;
--   Uses idx_projects_customer_updated.
--
-- Latest estimate by project:
--   SELECT * FROM estimates
--   WHERE project_id = ?
--   ORDER BY version DESC
--   LIMIT 1;
--   Uses idx_estimates_project_version_latest or idx_estimates_project_cover.
--
-- Open balances:
--   SELECT * FROM v_contract_collections
--   WHERE open_balance > 0;
--   Benefits from idx_contracts_open_only and idx_payments_contract_date_desc.
--
-- Product picker:
--   SELECT sku, name, unit_price
--   FROM products
--   WHERE active = TRUE
--     AND category = 'hardware'
--   ORDER BY name;
--   Uses idx_products_active_only or idx_products_category_cover.
--
-- Audit timeline:
--   SELECT * FROM audit_log
--   WHERE table_name = 'projects' AND record_id = ?
--   ORDER BY created_at DESC;
--   Uses idx_audit_table_record_created.
--
-- =============================================================================
-- CAPACITY PLANNING NOTES
-- =============================================================================
-- 1. GIN and trigram indexes accelerate search but increase write amplification.
-- 2. Partial indexes are ideal when status distributions are highly skewed.
-- 3. INCLUDE columns reduce heap visits on PostgreSQL list screens.
-- 4. Low-stock and recent-photo filtered indexes are most useful in medium or large deployments.
-- 5. Review index bloat after bulk imports or repeated reseeding in development.


-- =============================================================================
-- RUNTIME OBSERVABILITY NOTES
-- =============================================================================
-- PostgreSQL monitoring query:
-- SELECT
--     schemaname,
--     relname AS table_name,
--     indexrelname AS index_name,
--     idx_scan,
--     idx_tup_read,
--     idx_tup_fetch
-- FROM pg_stat_user_indexes
-- ORDER BY idx_scan DESC, index_name;
--
-- Bloat watch reminder:
--   Rebuild large GIN indexes if update churn on products or projects becomes significant.
--
-- Pruning guidance for smaller installations:
--   * Keep unique and foreign-key-supporting indexes.
--   * Keep project/estimate latest-version indexes.
--   * Defer trigram indexes until fuzzy search becomes a real requirement.
--   * Defer recent-photo and low-stock filtered indexes if tables remain small.
--
-- Security and privacy note:
--   Avoid indexing oversized freeform sensitive data fields unless the application truly searches them.
--   The current strategy indexes operational text needed for quoting and lookup workflows only.
