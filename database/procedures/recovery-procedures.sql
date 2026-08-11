-- ============================================================
-- RECOVERY PROCEDURES
-- ============================================================

-- Function: Verify database integrity after restore
CREATE OR REPLACE FUNCTION verify_db_integrity()
RETURNS TABLE(check_name TEXT, status TEXT, detail TEXT) AS $$
BEGIN
    -- Check: inventory has products
    RETURN QUERY
    SELECT 'inventory_count'::TEXT,
           CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END,
           'Products found: ' || COUNT(*)::TEXT
    FROM inventory;

    -- Check: No orphaned line items
    RETURN QUERY
    SELECT 'orphaned_line_items'::TEXT,
           CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END,
           'Orphaned items: ' || COUNT(*)::TEXT
    FROM estimate_line_items eli
    LEFT JOIN estimates e ON e.id = eli.estimate_id
    WHERE e.id IS NULL;

    -- Check: No orphaned estimates
    RETURN QUERY
    SELECT 'orphaned_estimates'::TEXT,
           CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END,
           'Orphaned estimates: ' || COUNT(*)::TEXT
    FROM estimates est
    LEFT JOIN projects p ON p.id = est.project_id
    WHERE p.id IS NULL;

    -- Check: Admin user exists
    RETURN QUERY
    SELECT 'admin_user_exists'::TEXT,
           CASE WHEN COUNT(*) > 0 THEN 'PASS' ELSE 'FAIL' END,
           'Admin users: ' || COUNT(*)::TEXT
    FROM users WHERE role = 'admin';
END;
$$ LANGUAGE plpgsql;

-- Procedure: Reset estimate sequence numbering
CREATE OR REPLACE PROCEDURE reset_estimate_sequence(p_year INTEGER DEFAULT NULL)
LANGUAGE plpgsql AS $$
DECLARE
    v_year INTEGER := COALESCE(p_year, EXTRACT(YEAR FROM NOW())::INTEGER);
BEGIN
    RAISE NOTICE 'Estimate sequence reset for year %', v_year;
    -- In production integrate with your sequence/numbering logic
END;
$$;
