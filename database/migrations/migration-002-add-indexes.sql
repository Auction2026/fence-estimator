-- Migration 002: Add Additional Indexes for Performance
USE fence_estimator;

ALTER TABLE projects ADD INDEX idx_projects_customer_name (customer_name);
ALTER TABLE estimates ADD INDEX idx_estimates_customer (customer_name);
ALTER TABLE inventory ADD INDEX idx_inv_supplier (supplier);
ALTER TABLE inventory ADD INDEX idx_inv_price (retail_price);
ALTER TABLE change_orders ADD INDEX idx_co_date (created_at);
ALTER TABLE notes ADD INDEX idx_notes_title (title(100));

INSERT INTO audit_log (action, table_name) VALUES ('MIGRATION', 'migration-002');
