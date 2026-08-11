-- Database Maintenance Procedures
-- VACUUM, ANALYZE, archival, cleanup, reindex, and statistics updates.

VACUUM (VERBOSE, ANALYZE) users;
VACUUM (VERBOSE, ANALYZE) projects;
VACUUM (VERBOSE, ANALYZE) fence_specs;
VACUUM (VERBOSE, ANALYZE) estimates;
VACUUM (VERBOSE, ANALYZE) contracts;
VACUUM (VERBOSE, ANALYZE) change_orders;
VACUUM (VERBOSE, ANALYZE) signoffs;
VACUUM (VERBOSE, ANALYZE) notes;
VACUUM (VERBOSE, ANALYZE) inventory;

ANALYZE users;
ANALYZE projects;
ANALYZE fence_specs;
ANALYZE estimates;
ANALYZE contracts;
ANALYZE change_orders;
ANALYZE signoffs;
ANALYZE notes;
ANALYZE inventory;

CREATE OR REPLACE FUNCTION archive_old_completed_projects(p_before_date DATE)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    WITH archived AS (
        UPDATE projects
        SET notes = COALESCE(notes, '') || E'\n[ARCHIVE FLAGGED ' || CURRENT_DATE || ']'
        WHERE status = 'completed'
          AND end_date IS NOT NULL
          AND end_date < p_before_date
        RETURNING project_id
    )
    SELECT COUNT(*) INTO v_count FROM archived;

    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION cleanup_orphaned_records()
RETURNS TABLE(entity_name TEXT, removed_count BIGINT) AS $$
BEGIN
    RETURN QUERY
    WITH deleted_notes AS (
        DELETE FROM notes n
        WHERE n.project_id IS NOT NULL
          AND NOT EXISTS (SELECT 1 FROM projects p WHERE p.project_id = n.project_id)
        RETURNING 1
    )
    SELECT 'notes'::TEXT, COUNT(*)::BIGINT FROM deleted_notes;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION rebuild_estimator_indexes()
RETURNS VOID AS $$
BEGIN
    REINDEX INDEX idx_projects_status;
    REINDEX INDEX idx_projects_estimator;
    REINDEX INDEX idx_estimates_project;
    REINDEX INDEX idx_contracts_project;
    REINDEX INDEX idx_inventory_category;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION refresh_statistics()
RETURNS VOID AS $$
BEGIN
    ANALYZE users;
    ANALYZE projects;
    ANALYZE fence_specs;
    ANALYZE estimates;
    ANALYZE contracts;
    ANALYZE change_orders;
    ANALYZE signoffs;
    ANALYZE notes;
    ANALYZE inventory;
END;
$$ LANGUAGE plpgsql;
