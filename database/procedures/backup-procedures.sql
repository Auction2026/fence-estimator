-- ============================================================
-- BACKUP PROCEDURES
-- ============================================================

-- Function: Create a logical backup record
CREATE OR REPLACE FUNCTION create_backup_record(
    p_backup_name TEXT,
    p_created_by UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    RAISE NOTICE 'Backup record created: % at %', p_backup_name, NOW();
    -- In production, this would call pg_dump via a system call or scheduled job
    -- Example pg_dump command (run from shell, not inside psql):
    -- pg_dump -U postgres -d fence_estimator -F c -f /backups/<name>.dump
END;
$$ LANGUAGE plpgsql;

-- Stored procedure: Archive completed projects older than N days
CREATE OR REPLACE PROCEDURE archive_old_projects(p_days_old INTEGER DEFAULT 365)
LANGUAGE plpgsql AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM projects
    WHERE status = 'complete'
      AND updated_at < NOW() - (p_days_old || ' days')::INTERVAL;

    RAISE NOTICE 'Archiving % completed projects older than % days...', v_count, p_days_old;

    UPDATE projects
    SET status = 'archived'
    WHERE status = 'complete'
      AND updated_at < NOW() - (p_days_old || ' days')::INTERVAL;

    RAISE NOTICE 'Archive complete.';
END;
$$;

-- View: backup-ready summary counts
CREATE OR REPLACE VIEW v_backup_summary AS
SELECT
    'users'         AS table_name, COUNT(*) AS row_count FROM users
UNION ALL SELECT 'customers',      COUNT(*) FROM customers
UNION ALL SELECT 'projects',       COUNT(*) FROM projects
UNION ALL SELECT 'estimates',      COUNT(*) FROM estimates
UNION ALL SELECT 'line_items',     COUNT(*) FROM estimate_line_items
UNION ALL SELECT 'inventory',      COUNT(*) FROM inventory
UNION ALL SELECT 'contracts',      COUNT(*) FROM contracts
UNION ALL SELECT 'change_orders',  COUNT(*) FROM change_orders
UNION ALL SELECT 'notes',          COUNT(*) FROM notes
UNION ALL SELECT 'crew',           COUNT(*) FROM crew
UNION ALL SELECT 'permits',        COUNT(*) FROM permits
UNION ALL SELECT 'sign_offs',      COUNT(*) FROM sign_offs
UNION ALL SELECT 'audit_log',      COUNT(*) FROM audit_log;

COMMENT ON VIEW v_backup_summary IS
    'Row counts for all major tables. Use before/after backup to verify integrity.';
