-- ============================================================
-- FENCE ESTIMATOR - DATABASE BACKUP PROCEDURES
-- ============================================================
-- This file contains stored procedures and scripts for
-- backing up, recovering, and maintaining the database.
-- ============================================================

-- ============================================================
-- PROCEDURE: Full database backup to a table snapshot
-- ============================================================

CREATE TABLE IF NOT EXISTS backup_log (
    id          SERIAL PRIMARY KEY,
    backup_type VARCHAR(50) NOT NULL,
    table_name  VARCHAR(100),
    row_count   INTEGER,
    started_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    status      VARCHAR(20) DEFAULT 'running',
    error_msg   TEXT,
    created_by  INTEGER REFERENCES users(id)
);

-- ============================================================
-- PROCEDURE: Log current row counts for monitoring
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_log_row_counts(p_user_id INTEGER DEFAULT NULL)
LANGUAGE plpgsql AS $$
DECLARE
    v_log_id INTEGER;
    v_count  INTEGER;
    v_table  TEXT;
    tables   TEXT[] := ARRAY[
        'users','settings','customers','suppliers','materials',
        'supplier_materials','projects','estimates','estimate_items',
        'audit_log','change_orders','material_price_history'
    ];
BEGIN
    INSERT INTO backup_log (backup_type, created_by)
    VALUES ('row_count_audit', p_user_id)
    RETURNING id INTO v_log_id;

    FOREACH v_table IN ARRAY tables LOOP
        BEGIN
            EXECUTE 'SELECT COUNT(*) FROM ' || v_table INTO v_count;
            INSERT INTO backup_log (backup_type, table_name, row_count, created_by, status)
            VALUES ('row_count', v_table, v_count, p_user_id, 'completed');
        EXCEPTION WHEN undefined_table THEN
            INSERT INTO backup_log (backup_type, table_name, created_by, status, error_msg)
            VALUES ('row_count', v_table, p_user_id, 'skipped', 'table does not exist');
        END;
    END LOOP;

    UPDATE backup_log
    SET status = 'completed', completed_at = NOW()
    WHERE id = v_log_id;

    RAISE NOTICE 'Row count audit complete (log_id=%)', v_log_id;
END;
$$;

-- ============================================================
-- PROCEDURE: Archive old audit logs (keep 1 year)
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_archive_old_audit_logs(p_keep_days INTEGER DEFAULT 365)
LANGUAGE plpgsql AS $$
DECLARE
    v_deleted INTEGER;
    v_cutoff  TIMESTAMP := NOW() - (p_keep_days || ' days')::INTERVAL;
BEGIN
    -- Create archive table if not exists
    CREATE TABLE IF NOT EXISTS audit_log_archive
        AS SELECT * FROM audit_log WHERE 1=0;

    -- Move old records to archive
    WITH moved AS (
        DELETE FROM audit_log
        WHERE changed_at < v_cutoff
        RETURNING *
    )
    INSERT INTO audit_log_archive SELECT * FROM moved;

    GET DIAGNOSTICS v_deleted = ROW_COUNT;

    INSERT INTO backup_log (backup_type, row_count, status, completed_at)
    VALUES ('audit_archive', v_deleted, 'completed', NOW());

    RAISE NOTICE 'Archived % audit log records older than %', v_deleted, v_cutoff;
END;
$$;

-- ============================================================
-- PROCEDURE: Soft-delete cleanup - remove old soft-deleted records
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_cleanup_inactive_materials(p_days_old INTEGER DEFAULT 180)
LANGUAGE plpgsql AS $$
DECLARE
    v_count INTEGER;
BEGIN
    -- Only remove materials that are inactive AND have no estimate line items
    SELECT COUNT(*) INTO v_count
    FROM materials m
    WHERE m.is_active = FALSE
      AND m.updated_at < NOW() - (p_days_old || ' days')::INTERVAL
      AND NOT EXISTS (
          SELECT 1 FROM estimate_items ei WHERE ei.material_id = m.id
      );

    RAISE NOTICE 'Found % inactive materials eligible for cleanup', v_count;
    -- Note: actual DELETE commented out for safety; enable after review
    -- DELETE FROM materials WHERE ...
END;
$$;

-- ============================================================
-- PROCEDURE: Recalculate ALL estimate totals (repair tool)
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_recalculate_all_estimates()
LANGUAGE plpgsql AS $$
DECLARE
    v_est   RECORD;
    v_count INTEGER := 0;
BEGIN
    FOR v_est IN SELECT id FROM estimates WHERE price_locked = FALSE LOOP
        -- Touch an item to fire the recalc trigger (or call directly)
        -- Direct update avoids trigger recursion
        UPDATE estimates e SET
            material_cost = (
                SELECT COALESCE(SUM(total_price),0) FROM estimate_items
                WHERE estimate_id = e.id AND item_type = 'material'
            ),
            labor_cost = (
                SELECT COALESCE(SUM(total_price),0) FROM estimate_items
                WHERE estimate_id = e.id AND item_type = 'labor'
            ),
            equipment_cost = (
                SELECT COALESCE(SUM(total_price),0) FROM estimate_items
                WHERE estimate_id = e.id AND item_type = 'equipment'
            ),
            permit_cost = (
                SELECT COALESCE(SUM(total_price),0) FROM estimate_items
                WHERE estimate_id = e.id AND item_type = 'permit'
            )
        WHERE e.id = v_est.id;

        UPDATE estimates SET
            subtotal        = material_cost + labor_cost + equipment_cost + permit_cost,
            discount_amount = ROUND((material_cost + labor_cost + equipment_cost + permit_cost) * (discount_pct / 100.0), 2),
            tax_amount      = ROUND(((material_cost + labor_cost + equipment_cost + permit_cost)
                                     - ROUND((material_cost + labor_cost + equipment_cost + permit_cost) * (discount_pct / 100.0), 2))
                                    * tax_rate, 2),
            total_amount    = subtotal - discount_amount + tax_amount
        WHERE id = v_est.id;

        v_count := v_count + 1;
    END LOOP;

    RAISE NOTICE 'Recalculated % estimates', v_count;
END;
$$;

-- ============================================================
-- FUNCTION: Get estimate summary stats
-- ============================================================
CREATE OR REPLACE FUNCTION fn_estimate_stats(
    p_start_date DATE DEFAULT DATE_TRUNC('year', CURRENT_DATE)::DATE,
    p_end_date   DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    status          TEXT,
    count           BIGINT,
    total_value     NUMERIC,
    avg_value       NUMERIC,
    min_value       NUMERIC,
    max_value       NUMERIC
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.status::TEXT,
        COUNT(*)::BIGINT,
        ROUND(SUM(e.total_amount), 2),
        ROUND(AVG(e.total_amount), 2),
        ROUND(MIN(e.total_amount), 2),
        ROUND(MAX(e.total_amount), 2)
    FROM estimates e
    WHERE e.created_at::DATE BETWEEN p_start_date AND p_end_date
    GROUP BY e.status
    ORDER BY e.status;
END;
$$;

-- ============================================================
-- FUNCTION: Get monthly revenue
-- ============================================================
CREATE OR REPLACE FUNCTION fn_monthly_revenue(p_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER)
RETURNS TABLE (
    month_num       INTEGER,
    month_name      TEXT,
    estimate_count  BIGINT,
    total_revenue   NUMERIC
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    SELECT
        EXTRACT(MONTH FROM e.approved_at)::INTEGER,
        TO_CHAR(e.approved_at, 'Month')::TEXT,
        COUNT(*)::BIGINT,
        ROUND(SUM(e.total_amount), 2)
    FROM estimates e
    WHERE EXTRACT(YEAR FROM e.approved_at) = p_year
      AND e.status = 'approved'
    GROUP BY EXTRACT(MONTH FROM e.approved_at), TO_CHAR(e.approved_at, 'Month')
    ORDER BY 1;
END;
$$;

-- ============================================================
-- VIEW: Low stock materials alert
-- ============================================================
CREATE OR REPLACE VIEW v_low_stock_alert AS
SELECT
    m.id,
    m.sku,
    m.name,
    m.category,
    m.fence_type,
    m.stock_qty,
    m.reorder_point,
    m.unit_cost,
    s.supplier_name AS preferred_supplier,
    s.phone         AS supplier_phone
FROM materials m
LEFT JOIN supplier_materials sm ON sm.material_id = m.id AND sm.is_preferred = TRUE
LEFT JOIN suppliers s ON s.id = sm.supplier_id
WHERE m.is_active = TRUE
  AND m.stock_qty <= m.reorder_point
ORDER BY m.stock_qty ASC;

-- ============================================================
-- VIEW: Expiring estimates (next 7 days)
-- ============================================================
CREATE OR REPLACE VIEW v_expiring_estimates AS
SELECT
    e.id,
    e.estimate_number,
    e.valid_until,
    e.total_amount,
    e.status,
    c.first_name || ' ' || c.last_name AS customer_name,
    c.phone,
    c.email,
    u.full_name AS created_by_name
FROM estimates e
JOIN customers c ON c.id = e.customer_id
LEFT JOIN users u ON u.id = e.created_by
WHERE e.status IN ('draft','sent')
  AND e.valid_until BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY e.valid_until ASC;

-- ============================================================
-- PROCEDURES COMPLETE
-- ============================================================
