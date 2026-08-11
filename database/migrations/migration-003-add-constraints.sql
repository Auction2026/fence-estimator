-- ============================================================
-- MIGRATION 003: Add Constraints & Business Rules
-- Run: psql -d fence_estimator -f migration-003-add-constraints.sql
-- ============================================================

\echo 'Running Migration 003: Adding constraints...'

-- Ensure estimate totals are non-negative
ALTER TABLE estimates
    ADD CONSTRAINT chk_estimates_total_non_negative CHECK (total >= 0),
    ADD CONSTRAINT chk_estimates_subtotal_non_negative CHECK (subtotal >= 0),
    ADD CONSTRAINT chk_estimates_tax_rate CHECK (tax_rate >= 0 AND tax_rate < 1),
    ADD CONSTRAINT chk_estimates_markup_pct CHECK (markup_pct >= 0);

-- Ensure inventory prices are positive
ALTER TABLE inventory
    ADD CONSTRAINT chk_inventory_cost_positive CHECK (cost IS NULL OR cost >= 0),
    ADD CONSTRAINT chk_inventory_price_positive CHECK (price IS NULL OR price >= 0);

-- Ensure fence specs heights are reasonable
ALTER TABLE fence_specs
    ADD CONSTRAINT chk_fence_height CHECK (height IS NULL OR (height > 0 AND height <= 30)),
    ADD CONSTRAINT chk_fence_linear_ft CHECK (total_linear_ft IS NULL OR total_linear_ft > 0);

-- Ensure project numbers follow format
-- (format: FE-YYYY-NNNNN)
ALTER TABLE projects
    ADD CONSTRAINT chk_project_number_format
    CHECK (project_number ~ '^FE-[0-9]{4}-[0-9]{5}$' OR project_number ~ '^[A-Z0-9-]+$');

\echo 'Migration 003 complete.'
