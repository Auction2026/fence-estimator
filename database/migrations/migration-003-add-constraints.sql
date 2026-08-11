-- Migration 003: Add Additional Constraints
USE fence_estimator;

-- Ensure phone numbers and postal codes are stored cleanly
ALTER TABLE projects
  ADD CONSTRAINT chk_email CHECK (customer_email LIKE '%@%');

-- Ensure prices are non-negative
ALTER TABLE inventory
  ADD CONSTRAINT chk_unit_cost CHECK (unit_cost >= 0),
  ADD CONSTRAINT chk_retail_price CHECK (retail_price >= 0);

ALTER TABLE estimates
  ADD CONSTRAINT chk_total CHECK (total >= 0);

ALTER TABLE contracts
  ADD CONSTRAINT chk_total_price CHECK (total_price >= 0);

INSERT INTO audit_log (action, table_name) VALUES ('MIGRATION', 'migration-003');
