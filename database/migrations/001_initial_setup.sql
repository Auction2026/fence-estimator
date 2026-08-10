-- ============================================================
-- FENCE DEPOT FENCE ESTIMATOR
-- MIGRATION 001 – Initial Database Setup
-- ============================================================

-- Run schema first
\i '../schema.sql'

-- Run seed data
\i '../seed.sql'

-- Create default admin user
-- (Change password after first login)
INSERT INTO users (username, email, password_hash, full_name, role)
VALUES (
  'admin',
  'admin@fencedepot.com',
  '$2a$10$CHANGETHIS_REPLACE_WITH_BCRYPT_HASH',
  'System Administrator',
  'admin'
) ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- MIGRATION 001 COMPLETE
-- ============================================================
