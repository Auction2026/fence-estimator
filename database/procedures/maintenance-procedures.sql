BEGIN;
SET search_path TO public;
CREATE TABLE IF NOT EXISTS archived_projects (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL,
    archived_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_by TEXT NOT NULL DEFAULT CURRENT_USER,
    archive_reason TEXT NOT NULL,
    original_status VARCHAR(20) NOT NULL,
    project_snapshot JSONB NOT NULL,
    UNIQUE (project_id)
);
CREATE TABLE IF NOT EXISTS maintenance_log (
    id BIGSERIAL PRIMARY KEY,
    action_name VARCHAR(100) NOT NULL,
    action_status VARCHAR(20) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::JSONB,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    executed_by TEXT NOT NULL DEFAULT CURRENT_USER,
    CONSTRAINT maintenance_log_status_check CHECK (action_status IN ('completed', 'failed'))
);
CREATE INDEX IF NOT EXISTS idx_archived_projects_archived_at ON archived_projects (archived_at DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_log_action_name ON maintenance_log (action_name, executed_at DESC);
CREATE OR REPLACE PROCEDURE vacuum_analyze_all()
LANGUAGE plpgsql AS $$
DECLARE v_table TEXT;
BEGIN
    FOREACH v_table IN ARRAY ARRAY['users','projects','fence_specs','estimates','estimate_line_items','contracts','change_orders','sign_offs','notes','inventory'] LOOP
        EXECUTE format('VACUUM (ANALYZE) %I', v_table);
    END LOOP;
    INSERT INTO maintenance_log (action_name, action_status, details) VALUES ('vacuum_analyze_all', 'completed', jsonb_build_object('tables_processed', 10));
END;
$$;
CREATE OR REPLACE PROCEDURE archive_old_projects(days_old INTEGER)
LANGUAGE plpgsql AS $$
DECLARE v_project RECORD; v_cutoff TIMESTAMPTZ;
BEGIN
    IF days_old <= 0 THEN RAISE EXCEPTION 'days_old must be greater than zero'; END IF;
    v_cutoff := NOW() - make_interval(days => days_old);
    FOR v_project IN SELECT p.id, p.status FROM projects p WHERE p.status IN ('completed', 'cancelled') AND p.updated_at < v_cutoff AND NOT EXISTS (SELECT 1 FROM archived_projects ap WHERE ap.project_id = p.id) LOOP
        INSERT INTO archived_projects (project_id, archive_reason, original_status, project_snapshot)
        VALUES (v_project.id, format('Archived by maintenance job after %s days without changes', days_old), v_project.status, build_project_backup_payload(v_project.id));
        DELETE FROM projects WHERE id = v_project.id;
    END LOOP;
    INSERT INTO maintenance_log (action_name, action_status, details) VALUES ('archive_old_projects', 'completed', jsonb_build_object('cutoff_timestamp', v_cutoff, 'days_old', days_old));
END;
$$;
CREATE OR REPLACE PROCEDURE cleanup_orphaned_records()
LANGUAGE plpgsql AS $$
DECLARE v_line_items_deleted INTEGER := 0; v_contracts_deleted INTEGER := 0; v_change_orders_deleted INTEGER := 0; v_notes_deleted INTEGER := 0;
BEGIN
    DELETE FROM estimate_line_items li WHERE NOT EXISTS (SELECT 1 FROM estimates e WHERE e.id = li.estimate_id);
    GET DIAGNOSTICS v_line_items_deleted = ROW_COUNT;
    DELETE FROM contracts c WHERE NOT EXISTS (SELECT 1 FROM projects p WHERE p.id = c.project_id) OR NOT EXISTS (SELECT 1 FROM estimates e WHERE e.id = c.estimate_id);
    GET DIAGNOSTICS v_contracts_deleted = ROW_COUNT;
    DELETE FROM change_orders co WHERE NOT EXISTS (SELECT 1 FROM projects p WHERE p.id = co.project_id) OR (co.estimate_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM estimates e WHERE e.id = co.estimate_id));
    GET DIAGNOSTICS v_change_orders_deleted = ROW_COUNT;
    DELETE FROM notes n WHERE NOT EXISTS (SELECT 1 FROM projects p WHERE p.id = n.project_id) OR NOT EXISTS (SELECT 1 FROM users u WHERE u.id = n.user_id);
    GET DIAGNOSTICS v_notes_deleted = ROW_COUNT;
    INSERT INTO maintenance_log (action_name, action_status, details) VALUES ('cleanup_orphaned_records', 'completed', jsonb_build_object('estimate_line_items_deleted', v_line_items_deleted, 'contracts_deleted', v_contracts_deleted, 'change_orders_deleted', v_change_orders_deleted, 'notes_deleted', v_notes_deleted));
END;
$$;
CREATE OR REPLACE FUNCTION generate_statistics_report()
RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE v_report JSONB;
BEGIN
    v_report := jsonb_build_object(
        'generated_at', NOW(),
        'users', jsonb_build_object('total', (SELECT COUNT(*) FROM users), 'active', (SELECT COUNT(*) FROM users WHERE is_active)),
        'projects', jsonb_build_object('total', (SELECT COUNT(*) FROM projects), 'draft', (SELECT COUNT(*) FROM projects WHERE status = 'draft'), 'active', (SELECT COUNT(*) FROM projects WHERE status = 'active'), 'completed', (SELECT COUNT(*) FROM projects WHERE status = 'completed'), 'cancelled', (SELECT COUNT(*) FROM projects WHERE status = 'cancelled')),
        'inventory', jsonb_build_object('total_skus', (SELECT COUNT(*) FROM inventory), 'active_skus', (SELECT COUNT(*) FROM inventory WHERE is_active), 'low_stock_skus', (SELECT COUNT(*) FROM inventory WHERE quantity_on_hand <= reorder_level), 'inventory_retail_value', (SELECT COALESCE(SUM(quantity_on_hand * unit_price), 0) FROM inventory)),
        'estimates', jsonb_build_object('estimate_count', (SELECT COUNT(*) FROM estimates), 'total_pipeline_value', (SELECT COALESCE(SUM(total_amount), 0) FROM estimates)),
        'archives', jsonb_build_object('archived_projects', (SELECT COUNT(*) FROM archived_projects))
    );
    INSERT INTO maintenance_log (action_name, action_status, details) VALUES ('generate_statistics_report', 'completed', v_report);
    RETURN v_report;
END;
$$;
COMMIT;
