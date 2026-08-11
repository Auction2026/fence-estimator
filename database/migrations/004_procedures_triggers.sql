-- ============================================================
-- MIGRATION 004 - STORED PROCEDURES & TRIGGERS
-- Fence Depot Estimator
-- Run AFTER migration 003
-- ============================================================

-- ============================================================
-- TRIGGER: auto-update updated_at on all tables
-- ============================================================
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_estimates_updated_at
    BEFORE UPDATE ON estimates
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE OR REPLACE TRIGGER trg_change_orders_updated_at
    BEFORE UPDATE ON change_orders
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ============================================================
-- FUNCTION: generate_project_id()
-- Returns next sequential project ID: FD-YYYY-#####
-- ============================================================
CREATE OR REPLACE FUNCTION fn_generate_project_id()
RETURNS VARCHAR(20) LANGUAGE plpgsql AS $$
DECLARE
    v_year   INT  := EXTRACT(YEAR FROM CURRENT_DATE);
    v_seq    INT;
    v_result VARCHAR(20);
BEGIN
    SELECT COALESCE(MAX(
        NULLIF(REGEXP_REPLACE(project_id, '[^0-9]', '', 'g'), '')::INT
    ), 0) + 1
    INTO v_seq
    FROM projects
    WHERE project_id LIKE 'FD-' || v_year || '-%';

    v_result := 'FD-' || v_year || '-' || LPAD(v_seq::TEXT, 5, '0');
    RETURN v_result;
END;
$$;

-- ============================================================
-- FUNCTION: generate_estimate_number()
-- Returns next sequential estimate: EST-YYYY-#####
-- ============================================================
CREATE OR REPLACE FUNCTION fn_generate_estimate_number()
RETURNS VARCHAR(20) LANGUAGE plpgsql AS $$
DECLARE
    v_year   INT  := EXTRACT(YEAR FROM CURRENT_DATE);
    v_seq    INT;
    v_result VARCHAR(20);
BEGIN
    SELECT COALESCE(MAX(
        NULLIF(REGEXP_REPLACE(estimate_number, '[^0-9]', '', 'g'), '')::INT
    ), 0) + 1
    INTO v_seq
    FROM estimates
    WHERE estimate_number LIKE 'EST-' || v_year || '-%';

    v_result := 'EST-' || v_year || '-' || LPAD(v_seq::TEXT, 5, '0');
    RETURN v_result;
END;
$$;

-- ============================================================
-- FUNCTION: calculate_estimate_total()
-- Recalculates estimate totals from line items
-- ============================================================
CREATE OR REPLACE FUNCTION fn_calculate_estimate_total(p_estimate_number VARCHAR(50))
RETURNS TABLE (
    material_cost DECIMAL(12,2),
    subtotal      DECIMAL(12,2),
    tax_amount    DECIMAL(12,2),
    total         DECIMAL(12,2)
) LANGUAGE plpgsql AS $$
DECLARE
    v_material  DECIMAL(12,2);
    v_labor     DECIMAL(12,2);
    v_subtotal  DECIMAL(12,2);
    v_tax_rate  DECIMAL(6,4);
    v_tax       DECIMAL(12,2);
    v_total     DECIMAL(12,2);
BEGIN
    SELECT COALESCE(SUM(eli.line_total), 0)
    INTO v_material
    FROM estimate_line_items eli
    JOIN products p ON p.plu = eli.product_plu
    JOIN product_categories pc ON pc.id = p.category_id
    WHERE eli.estimate_number = p_estimate_number
      AND pc.code != 'LABOUR';

    SELECT COALESCE(SUM(eli.line_total), 0)
    INTO v_labor
    FROM estimate_line_items eli
    JOIN products p ON p.plu = eli.product_plu
    JOIN product_categories pc ON pc.id = p.category_id
    WHERE eli.estimate_number = p_estimate_number
      AND pc.code = 'LABOUR';

    SELECT e.tax_rate
    INTO v_tax_rate
    FROM estimates e
    WHERE e.estimate_number = p_estimate_number;

    v_subtotal := v_material + v_labor;
    v_tax      := ROUND(v_subtotal * v_tax_rate, 2);
    v_total    := v_subtotal + v_tax;

    RETURN QUERY SELECT v_material, v_subtotal, v_tax, v_total;
END;
$$;

-- ============================================================
-- PROCEDURE: lock_estimate()
-- Locks an estimate and records who locked it
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_lock_estimate(
    p_estimate_number VARCHAR(50),
    p_user_id         INT
) LANGUAGE plpgsql AS $$
BEGIN
    UPDATE estimates
    SET is_locked = TRUE,
        locked_at = CURRENT_TIMESTAMP,
        locked_by = p_user_id,
        updated_at = CURRENT_TIMESTAMP
    WHERE estimate_number = p_estimate_number
      AND is_locked = FALSE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Estimate % not found or already locked', p_estimate_number;
    END IF;

    INSERT INTO audit_log (table_name, record_id, action, new_values, user_id)
    VALUES ('estimates', p_estimate_number, 'UPDATE',
            jsonb_build_object('is_locked', true, 'locked_at', CURRENT_TIMESTAMP),
            p_user_id);
END;
$$;

-- ============================================================
-- PROCEDURE: archive_old_estimates()
-- Marks estimates expired after valid_days
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_archive_expired_estimates()
LANGUAGE plpgsql AS $$
BEGIN
    UPDATE estimates
    SET status = 'expired',
        updated_at = CURRENT_TIMESTAMP
    WHERE status IN ('draft', 'sent')
      AND expires_at IS NOT NULL
      AND expires_at < CURRENT_TIMESTAMP;
END;
$$;

-- ============================================================
-- PROCEDURE: backup_products()
-- Creates a snapshot table for products at a point in time
-- ============================================================
CREATE OR REPLACE PROCEDURE sp_snapshot_products(p_label VARCHAR(100))
LANGUAGE plpgsql AS $$
DECLARE
    v_table_name VARCHAR(100);
BEGIN
    v_table_name := 'products_snapshot_' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD_HH24MI');

    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I AS
        SELECT %L AS snapshot_label, CURRENT_TIMESTAMP AS snapshotted_at, p.*
        FROM products p
    ', v_table_name, p_label);

    RAISE NOTICE 'Product snapshot created: %', v_table_name;
END;
$$;

-- Record completion
INSERT INTO schema_migrations (version, description)
VALUES ('004', 'Stored procedures and triggers: auto-updated_at, project/estimate ID generators, estimate total calculator, lock_estimate, archive_expired, snapshot_products')
ON CONFLICT (version) DO NOTHING;
