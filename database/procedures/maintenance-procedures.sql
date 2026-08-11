-- ============================================================
-- MAINTENANCE PROCEDURES
-- ============================================================

-- Function: Purge old audit log entries (keep last N days)
CREATE OR REPLACE PROCEDURE purge_old_audit_log(p_keep_days INTEGER DEFAULT 90)
LANGUAGE plpgsql AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM audit_log
    WHERE changed_at < NOW() - (p_keep_days || ' days')::INTERVAL;

    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RAISE NOTICE 'Purged % audit log entries older than % days.', v_deleted, p_keep_days;
END;
$$;

-- Function: Refresh inventory on-hand from latest POS data
-- (Placeholder: replace with your POS integration logic)
CREATE OR REPLACE PROCEDURE sync_inventory_on_hand()
LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'Inventory sync started at %', NOW();
    -- TODO: Connect to POS system and update on_hand quantities
    RAISE NOTICE 'Inventory sync complete at %', NOW();
END;
$$;

-- Function: Vacuum analyze all major tables
CREATE OR REPLACE PROCEDURE perform_maintenance()
LANGUAGE plpgsql AS $$
BEGIN
    RAISE NOTICE 'Running VACUUM ANALYZE on major tables...';
    VACUUM ANALYZE users;
    VACUUM ANALYZE customers;
    VACUUM ANALYZE projects;
    VACUUM ANALYZE estimates;
    VACUUM ANALYZE estimate_line_items;
    VACUUM ANALYZE inventory;
    VACUUM ANALYZE notes;
    VACUUM ANALYZE audit_log;
    RAISE NOTICE 'Maintenance complete at %', NOW();
END;
$$;

-- View: Active project summary (for admin dashboard)
CREATE OR REPLACE VIEW v_active_projects AS
SELECT
    p.project_number,
    p.name AS project_name,
    p.status,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.phone AS customer_phone,
    e.total AS estimate_total,
    e.status AS estimate_status,
    p.created_at,
    p.updated_at
FROM projects p
LEFT JOIN customers c ON c.id = p.customer_id
LEFT JOIN estimates e ON e.project_id = p.id
WHERE p.status NOT IN ('cancelled', 'archived')
ORDER BY p.updated_at DESC;

COMMENT ON VIEW v_active_projects IS
    'All active projects with customer and estimate info. Used by the admin dashboard.';
