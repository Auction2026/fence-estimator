-- ============================================================
-- Migration 003: Add Constraints
-- database/migrations/migration-003-add-constraints.sql
-- ============================================================

\echo 'Migration 003: Adding data constraints...';

-- Ensure estimate grand_total is non-negative
ALTER TABLE estimates ADD CONSTRAINT chk_estimates_total_positive
  CHECK (grand_total >= 0);

-- Ensure change order amount can be negative (credits) but within range
ALTER TABLE change_orders ADD CONSTRAINT chk_co_amount_range
  CHECK (amount >= -999999 AND amount <= 999999);

-- Ensure product price is non-negative
ALTER TABLE products ADD CONSTRAINT chk_product_price_positive
  CHECK (price >= 0);

-- Ensure permit fee is non-negative
ALTER TABLE permits ADD CONSTRAINT chk_permit_fee_positive
  CHECK (fee >= 0);

-- Unique project code
ALTER TABLE projects DROP CONSTRAINT IF EXISTS uq_project_code;
ALTER TABLE projects ADD CONSTRAINT uq_project_code UNIQUE (project_code);

\echo 'Migration 003: Complete.';
