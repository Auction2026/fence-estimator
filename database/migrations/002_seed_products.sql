-- ============================================================
-- MIGRATION 002 - SEED PRODUCT DATA
-- Fence Depot Estimator
-- Run AFTER migration 001
-- ============================================================

-- Apply seed data
\i ../seed.sql

-- Record completion
INSERT INTO schema_migrations (version, description)
VALUES ('002', 'Seed data - 950+ products across 12 categories: Chain Link, Vinyl/PVC, Wood, Wrought Iron, Guide Rail, Gates, Concrete, Fasteners, Tools, Finishing, Labour, Misc')
ON CONFLICT (version) DO NOTHING;
