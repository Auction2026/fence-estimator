-- ============================================================
-- MIGRATION 001: Create Database & Users
-- Run first - as MySQL root / DBA
-- ============================================================

CREATE DATABASE IF NOT EXISTS fence_estimator
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'fence_app'@'localhost' IDENTIFIED BY 'CHANGE_ME_BEFORE_USE';
-- ⚠️  IMPORTANT: Replace 'CHANGE_ME_BEFORE_USE' with a strong, unique password
--               before running this migration. Do NOT use a default or shared password.
GRANT ALL PRIVILEGES ON fence_estimator.* TO 'fence_app'@'localhost';
FLUSH PRIVILEGES;

SELECT 'Migration 001 complete - database and user created' AS status;
