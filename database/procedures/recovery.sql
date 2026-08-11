-- SQLite Recovery Procedure for Fence Depot Fence Estimator
--
-- Purpose:
-- 1. Attach a known-good backup database file.
-- 2. Validate backup integrity before replacing live data.
-- 3. Clear live tables in dependency-safe order.
-- 4. Restore every application table from the backup copy.
-- 5. Re-enable foreign keys and verify integrity after restore.
--
-- Usage notes:
-- - Run only during a maintenance window with application writes stopped.
-- - Replace the attached backup path with the desired restore source.
-- - Make a fresh backup of the current live database before restoring.
-- - Restore catalog_products together with operational data so SKU pricing matches historical estimates.

PRAGMA foreign_keys = OFF;
PRAGMA busy_timeout = 5000;

ATTACH DATABASE 'database/backups/fence_estimator_backup.sqlite' AS backup_db;

-- Validate the backup source before proceeding.
PRAGMA backup_db.quick_check;
PRAGMA backup_db.integrity_check;

BEGIN IMMEDIATE TRANSACTION;

-- Clear dependent tables first.
DELETE FROM estimate_items;
DELETE FROM change_orders;
DELETE FROM sign_offs;
DELETE FROM notes;
DELETE FROM contracts;
DELETE FROM estimates;
DELETE FROM fence_specs;
DELETE FROM projects;
DELETE FROM users;
DELETE FROM catalog_products;

-- Restore parent tables before child tables.
INSERT INTO users SELECT * FROM backup_db.users;
INSERT INTO projects SELECT * FROM backup_db.projects;
INSERT INTO fence_specs SELECT * FROM backup_db.fence_specs;
INSERT INTO estimates SELECT * FROM backup_db.estimates;
INSERT INTO estimate_items SELECT * FROM backup_db.estimate_items;
INSERT INTO contracts SELECT * FROM backup_db.contracts;
INSERT INTO change_orders SELECT * FROM backup_db.change_orders;
INSERT INTO sign_offs SELECT * FROM backup_db.sign_offs;
INSERT INTO notes SELECT * FROM backup_db.notes;
INSERT INTO catalog_products SELECT * FROM backup_db.catalog_products;

COMMIT;

-- Re-enable relational enforcement and verify the restored database.
PRAGMA foreign_keys = ON;
PRAGMA foreign_key_check;
PRAGMA quick_check;
PRAGMA integrity_check;

DETACH DATABASE backup_db;

SELECT 'recovery_completed' AS event, datetime('now') AS completed_at;
