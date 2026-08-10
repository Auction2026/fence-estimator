-- ============================================================
-- FENCE DEPOT FENCE ESTIMATOR
-- BACKUP PROCEDURE
-- ============================================================

-- PostgreSQL backup command (run from command line):
-- pg_dump -U postgres fence_estimator > backup_$(date +%Y%m%d).sql

-- Restore:
-- psql -U postgres fence_estimator < backup_YYYYMMDD.sql

-- Scheduled backup script (Linux cron):
-- 0 2 * * * pg_dump -U postgres fence_estimator > /backups/fence_estimator_$(date +\%Y\%m\%d).sql

-- ============================================================
-- VERIFY BACKUP INTEGRITY
-- ============================================================
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname || '.' || tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname || '.' || tablename) DESC;
