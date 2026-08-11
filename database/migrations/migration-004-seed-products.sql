-- Migration 004: Seed Product Catalog
-- Source: ../seed.sql (Runs the full seed file)
USE fence_estimator;
SOURCE ../seed.sql;

INSERT INTO audit_log (action, table_name) VALUES ('MIGRATION', 'migration-004');
