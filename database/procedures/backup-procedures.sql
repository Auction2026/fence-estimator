-- Database Backup Procedures
-- Run these commands to backup the Fence Depot database
-- Full database backup
-- pg_dump -h localhost -U fence_user -d fence_estimator -f backup_$(date +%Y%m%d).sql
-- Custom-format backup
-- pg_dump -h localhost -U fence_user -d fence_estimator -Fc -f backup_$(date +%Y%m%d).dump
-- Schema-only backup
-- pg_dump -h localhost -U fence_user -d fence_estimator --schema-only -f schema_$(date +%Y%m%d).sql

CREATE OR REPLACE FUNCTION backup_project(p_project_id UUID)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'project', row_to_json(p),
        'specs', COALESCE((SELECT json_agg(fs) FROM fence_specs fs WHERE fs.project_id = p.project_id), '[]'::json),
        'estimates', COALESCE((SELECT json_agg(e) FROM estimates e WHERE e.project_id = p.project_id), '[]'::json),
        'contracts', COALESCE((SELECT json_agg(c) FROM contracts c WHERE c.project_id = p.project_id), '[]'::json),
        'change_orders', COALESCE((SELECT json_agg(co) FROM change_orders co WHERE co.project_id = p.project_id), '[]'::json),
        'signoffs', COALESCE((SELECT json_agg(s) FROM signoffs s WHERE s.project_id = p.project_id), '[]'::json),
        'notes', COALESCE((SELECT json_agg(n) FROM notes n WHERE n.project_id = p.project_id), '[]'::json)
    ) INTO v_result
    FROM projects p
    WHERE p.project_id = p_project_id;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION backup_inventory_snapshot()
RETURNS JSON AS $$
DECLARE
    v_snapshot JSON;
BEGIN
    SELECT json_build_object(
        'generated_at', CURRENT_TIMESTAMP,
        'record_count', COUNT(*),
        'items', json_agg(i ORDER BY i.category, i.name)
    )
    INTO v_snapshot
    FROM inventory i;

    RETURN v_snapshot;
END;
$$ LANGUAGE plpgsql;
