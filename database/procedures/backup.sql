-- SQLite Backup Procedure for Fence Depot Fence Estimator
--
-- Purpose:
-- 1. Confirm the database is healthy before backup.
-- 2. Flush write-ahead log content back into the main database file.
-- 3. Create a compact backup snapshot using VACUUM INTO.
-- 4. Re-check integrity after the backup artifact is created.
--
-- Usage notes:
-- - Run from the sqlite3 CLI while connected to the live database.
-- - Replace the backup path with a timestamped file in your backup folder.
-- - Keep at least one off-server copy of the resulting backup file.
-- - Prefer running backups during low-write windows.
-- - If the database is busy, retry after write activity settles.
--
-- Example CLI invocation:
-- sqlite3 database/fence_estimator.sqlite ".read database/procedures/backup.sql"

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA busy_timeout = 5000;
PRAGMA wal_autocheckpoint = 1000;

-- Verify the live database before creating the snapshot.
PRAGMA quick_check;
PRAGMA integrity_check;

-- Flush WAL content and optimize statistics before backup.
PRAGMA wal_checkpoint(FULL);
PRAGMA optimize;
ANALYZE;

-- Optionally reclaim free pages before the backup copy is written.
VACUUM;

-- Create the backup copy.
-- Update this path to match your retention policy and timestamp format.
VACUUM INTO 'database/backups/fence_estimator_backup.sqlite';

-- Validate the database state after the backup command completes.
PRAGMA quick_check;
PRAGMA integrity_check;

-- Record a human-readable completion timestamp in the session output.
SELECT 'backup_completed' AS event, datetime('now') AS completed_at;

-- Optional informational queries.
SELECT name AS table_name FROM sqlite_master WHERE type = 'table' ORDER BY name;
SELECT COUNT(*) AS catalog_product_count FROM catalog_products;
SELECT COUNT(*) AS active_project_count FROM projects WHERE status IN ('scheduled', 'in_progress');
