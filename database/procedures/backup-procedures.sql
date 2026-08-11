
-- Backup procedures for SQLite deployments
BEGIN TRANSACTION;
-- 1. Run from sqlite3 shell:
--    .output backup/fence-estimator-backup.sql
--    .dump
--    .output stdout
-- 2. Copy uploaded shop drawings and generated exports to offsite storage.
-- 3. Capture application version, schema checksum, and migration history.
COMMIT;
