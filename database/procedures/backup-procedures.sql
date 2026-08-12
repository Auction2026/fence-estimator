-- ============================================================
-- FENCE DEPOT ESTIMATOR - Database Stored Procedures
-- database/procedures/backup-procedures.sql
-- ============================================================

-- ---- 1. Full data backup to JSON ----
CREATE OR REPLACE FUNCTION backup_project_to_json(p_project_id INTEGER)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'backup_at',     NOW(),
    'project',       row_to_json(p)::jsonb,
    'customer',      (SELECT row_to_json(c)::jsonb FROM customers c WHERE c.id = p.customer_id),
    'estimates',     (SELECT jsonb_agg(row_to_json(e)) FROM estimates e WHERE e.project_id = p.id),
    'contracts',     (SELECT jsonb_agg(row_to_json(ct)) FROM contracts ct WHERE ct.project_id = p.id),
    'permits',       (SELECT jsonb_agg(row_to_json(pm)) FROM permits pm WHERE pm.project_id = p.id),
    'change_orders', (SELECT jsonb_agg(row_to_json(co)) FROM change_orders co WHERE co.project_id = p.id),
    'extras',        (SELECT jsonb_agg(row_to_json(ex)) FROM extras ex WHERE ex.project_id = p.id),
    'notes',         (SELECT jsonb_agg(row_to_json(n))  FROM notes n  WHERE n.project_id  = p.id)
  )
  INTO result
  FROM projects p
  WHERE p.id = p_project_id;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ---- 2. Purge old audit log entries ----
CREATE OR REPLACE FUNCTION purge_old_audit_log(p_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM audit_log
  WHERE changed_at < NOW() - (p_days || ' days')::INTERVAL;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ---- 3. Archive completed projects ----
CREATE TABLE IF NOT EXISTS archived_projects (
  id              SERIAL PRIMARY KEY,
  original_id     INTEGER,
  project_data    JSONB,
  archived_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_by     INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE OR REPLACE PROCEDURE archive_project(p_project_id INTEGER, p_user_id INTEGER DEFAULT NULL)
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO archived_projects (original_id, project_data, archived_by)
  VALUES (p_project_id, backup_project_to_json(p_project_id), p_user_id);

  UPDATE projects SET status = 'completed' WHERE id = p_project_id;

  RAISE NOTICE 'Project % archived successfully', p_project_id;
END;
$$;

-- ---- 4. Database statistics function ----
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS TABLE (
  stat_name  TEXT,
  stat_value TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 'Total Projects'::TEXT,     COUNT(*)::TEXT FROM projects
  UNION ALL
  SELECT 'Active Projects',          COUNT(*)::TEXT FROM projects WHERE status = 'active'
  UNION ALL
  SELECT 'Total Customers',          COUNT(*)::TEXT FROM customers
  UNION ALL
  SELECT 'Total Estimates',          COUNT(*)::TEXT FROM estimates
  UNION ALL
  SELECT 'Total Estimate Value',     '$' || to_char(COALESCE(SUM(grand_total),0),'FM999,999,990.00') FROM estimates
  UNION ALL
  SELECT 'Total Products',           COUNT(*)::TEXT FROM products WHERE is_active = TRUE
  UNION ALL
  SELECT 'Pending Change Orders',    COUNT(*)::TEXT FROM change_orders WHERE status = 'pending'
  UNION ALL
  SELECT 'Audit Log Entries',        COUNT(*)::TEXT FROM audit_log;
END;
$$ LANGUAGE plpgsql;

-- ---- 5. Generate project summary report ----
CREATE OR REPLACE FUNCTION generate_monthly_report(p_year INTEGER, p_month INTEGER)
RETURNS TABLE (
  report_item    TEXT,
  report_value   TEXT
) AS $$
DECLARE
  start_date DATE;
  end_date   DATE;
BEGIN
  start_date := make_date(p_year, p_month, 1);
  end_date   := start_date + INTERVAL '1 month';

  RETURN QUERY
  SELECT 'Month/Year'::TEXT, to_char(start_date, 'Month YYYY')::TEXT
  UNION ALL
  SELECT 'New Projects', COUNT(*)::TEXT
    FROM projects WHERE created_at >= start_date AND created_at < end_date
  UNION ALL
  SELECT 'New Estimates', COUNT(*)::TEXT
    FROM estimates WHERE created_at >= start_date AND created_at < end_date
  UNION ALL
  SELECT 'Estimate Revenue', '$' || to_char(COALESCE(SUM(grand_total),0),'FM999,999,990.00')
    FROM estimates WHERE created_at >= start_date AND created_at < end_date
  UNION ALL
  SELECT 'Approved Change Orders', COUNT(*)::TEXT
    FROM change_orders WHERE status = 'approved' AND approved_at >= start_date AND approved_at < end_date
  UNION ALL
  SELECT 'Change Order Value', '$' || to_char(COALESCE(SUM(amount),0),'FM999,999,990.00')
    FROM change_orders WHERE status = 'approved' AND approved_at >= start_date AND approved_at < end_date;
END;
$$ LANGUAGE plpgsql;

-- ---- 6. Health check procedure ----
CREATE OR REPLACE FUNCTION database_health_check()
RETURNS JSONB AS $$
BEGIN
  RETURN jsonb_build_object(
    'status',       'healthy',
    'timestamp',    NOW(),
    'version',      current_setting('server_version'),
    'tables_ok',    (
      SELECT COUNT(*) = 9 FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users','customers','projects','estimates','contracts','permits','change_orders','products','notes')
    )
  );
END;
$$ LANGUAGE plpgsql;
