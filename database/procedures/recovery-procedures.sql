
-- Recovery procedures for SQLite deployments
BEGIN TRANSACTION;
-- 1. Restore the latest schema.sql snapshot.
-- 2. Replay seed.sql and transactional backups in chronological order.
-- 3. Validate row counts for projects, estimates, contracts, and change orders.
-- 4. Rebuild indexes with REINDEX; then run ANALYZE.
COMMIT;
