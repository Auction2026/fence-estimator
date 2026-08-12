-- Fence Estimator Stored Procedures and Functions
-- File: /home/runner/work/fence-estimator/fence-estimator/database/procedures.sql
-- PostgreSQL 14+ executable definitions with MySQL 8+ adaptation notes where syntax differs.

-- =============================================================================
-- HELPER FUNCTIONS
-- =============================================================================
CREATE OR REPLACE FUNCTION format_currency(p_amount NUMERIC)
RETURNS TEXT AS $$
BEGIN
    RETURN '$' || trim(to_char(COALESCE(p_amount, 0), 'FM999,999,999,990.00'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_tax_rate(p_state VARCHAR, p_zip VARCHAR DEFAULT NULL)
RETURNS NUMERIC(6,4) AS $$
BEGIN
    CASE UPPER(COALESCE(p_state, ''))
        WHEN 'TN' THEN RETURN 0.0925;
        WHEN 'KY' THEN RETURN 0.0600;
        WHEN 'AL' THEN RETURN 0.0800;
        WHEN 'GA' THEN RETURN 0.0800;
        WHEN 'NC' THEN RETURN 0.0725;
        ELSE RETURN 0.0700;
    END CASE;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION calculate_markup(p_cost NUMERIC, p_markup_percent NUMERIC)
RETURNS NUMERIC(12,2) AS $$
BEGIN
    RETURN ROUND(COALESCE(p_cost, 0) * (1 + (COALESCE(p_markup_percent, 0) / 100.0)), 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =============================================================================
-- CALCULATE ESTIMATE TOTAL
-- =============================================================================
CREATE OR REPLACE PROCEDURE calculate_estimate_total(p_estimate_id BIGINT)
LANGUAGE plpgsql
AS $$
DECLARE
    v_materials_total NUMERIC(12,2);
    v_labor_total NUMERIC(12,2);
    v_extras_total NUMERIC(12,2);
    v_gate_total NUMERIC(12,2);
    v_tax_rate NUMERIC(6,4);
    v_subtotal NUMERIC(12,2);
    v_tax_amount NUMERIC(12,2);
    v_grand_total NUMERIC(12,2);
    v_state VARCHAR(50);
BEGIN
    SELECT p.site_state
    INTO v_state
    FROM estimates e
    JOIN projects p ON p.id = e.project_id
    WHERE e.id = p_estimate_id;

    SELECT COALESCE(SUM(total_price), 0)
    INTO v_materials_total
    FROM estimate_items
    WHERE estimate_id = p_estimate_id
      AND category = 'material';

    SELECT COALESCE(SUM(total_price), 0)
    INTO v_labor_total
    FROM estimate_items
    WHERE estimate_id = p_estimate_id
      AND category = 'labor';

    SELECT COALESCE(SUM(total_price), 0)
    INTO v_extras_total
    FROM estimate_items
    WHERE estimate_id = p_estimate_id
      AND category IN ('equipment', 'freight', 'permit', 'subcontract', 'discount', 'other');

    SELECT COALESCE(SUM(total_price), 0)
    INTO v_gate_total
    FROM gates
    WHERE estimate_id = p_estimate_id;

    v_materials_total := ROUND(v_materials_total + v_gate_total, 2);
    v_tax_rate := get_tax_rate(v_state, NULL);
    v_subtotal := ROUND(v_materials_total + v_labor_total + v_extras_total, 2);
    v_tax_amount := ROUND(v_subtotal * v_tax_rate, 2);
    v_grand_total := ROUND(v_subtotal + v_tax_amount, 2);

    UPDATE estimates
    SET materials_total = v_materials_total,
        labor_total = v_labor_total,
        extras_total = v_extras_total,
        tax_rate = v_tax_rate,
        tax_amount = v_tax_amount,
        subtotal = v_subtotal,
        grand_total = v_grand_total
    WHERE id = p_estimate_id;
END;
$$;

-- =============================================================================
-- PROJECT SUMMARY
-- =============================================================================
CREATE OR REPLACE FUNCTION get_project_summary(p_project_id BIGINT)
RETURNS TABLE (
    project_id BIGINT,
    project_name VARCHAR,
    project_status VARCHAR,
    customer_name TEXT,
    estimate_count BIGINT,
    latest_estimate_version INTEGER,
    latest_estimate_total NUMERIC(12,2),
    contract_status VARCHAR,
    amount_paid NUMERIC(12,2),
    balance_due NUMERIC(12,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH latest_estimate AS (
        SELECT e.*
        FROM estimates e
        WHERE e.project_id = p_project_id
        ORDER BY e.version DESC
        LIMIT 1
    ), payment_totals AS (
        SELECT ct.id AS contract_id, COALESCE(SUM(pm.amount), 0) AS amount_paid
        FROM contracts ct
        LEFT JOIN payments pm ON pm.contract_id = ct.id
        GROUP BY ct.id
    )
    SELECT
        p.id,
        p.name,
        p.status,
        c.first_name || ' ' || c.last_name,
        (SELECT COUNT(*) FROM estimates e WHERE e.project_id = p.id),
        le.version,
        le.grand_total,
        ct.status,
        COALESCE(pt.amount_paid, 0),
        GREATEST(COALESCE(le.grand_total, 0) - COALESCE(pt.amount_paid, 0), 0)
    FROM projects p
    JOIN customers c ON c.id = p.customer_id
    LEFT JOIN latest_estimate le ON TRUE
    LEFT JOIN contracts ct ON ct.estimate_id = le.id
    LEFT JOIN payment_totals pt ON pt.contract_id = ct.id
    WHERE p.id = p_project_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- ARCHIVE OLD PROJECTS
-- =============================================================================
CREATE OR REPLACE PROCEDURE archive_old_projects(p_months_old INTEGER DEFAULT 24)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE projects
    SET status = 'archived',
        updated_at = CURRENT_TIMESTAMP
    WHERE status IN ('completed', 'cancelled')
      AND COALESCE(end_date, start_date, created_at::date) < (CURRENT_DATE - make_interval(months => p_months_old));
END;
$$;

-- =============================================================================
-- CLONE ESTIMATE
-- =============================================================================
CREATE OR REPLACE FUNCTION clone_estimate(p_source_estimate_id BIGINT, p_created_by BIGINT DEFAULT NULL)
RETURNS BIGINT AS $$
DECLARE
    v_new_estimate_id BIGINT;
    v_project_id BIGINT;
    v_next_version INTEGER;
BEGIN
    SELECT project_id
    INTO v_project_id
    FROM estimates
    WHERE id = p_source_estimate_id;

    IF v_project_id IS NULL THEN
        RAISE EXCEPTION 'Estimate % not found', p_source_estimate_id;
    END IF;

    SELECT COALESCE(MAX(version), 0) + 1
    INTO v_next_version
    FROM estimates
    WHERE project_id = v_project_id;

    INSERT INTO estimates (
        project_id, version, status, fence_type, fence_height, fence_color, linear_feet, post_count,
        materials_total, labor_total, extras_total, tax_rate, tax_amount, subtotal, grand_total, markup_percent
    )
    SELECT
        project_id, v_next_version, 'draft', fence_type, fence_height, fence_color, linear_feet, post_count,
        materials_total, labor_total, extras_total, tax_rate, tax_amount, subtotal, grand_total, markup_percent
    FROM estimates
    WHERE id = p_source_estimate_id
    RETURNING id INTO v_new_estimate_id;

    INSERT INTO estimate_items (estimate_id, category, sku, description, quantity, unit, unit_price, total_price, notes)
    SELECT v_new_estimate_id, category, sku, description, quantity, unit, unit_price, total_price, notes
    FROM estimate_items
    WHERE estimate_id = p_source_estimate_id;

    INSERT INTO gates (estimate_id, gate_type, width, height, hardware_type, quantity, unit_price, total_price)
    SELECT v_new_estimate_id, gate_type, width, height, hardware_type, quantity, unit_price, total_price
    FROM gates
    WHERE estimate_id = p_source_estimate_id;

    CALL calculate_estimate_total(v_new_estimate_id);

    IF p_created_by IS NOT NULL THEN
        INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, user_id, created_at)
        VALUES ('estimates', v_new_estimate_id, 'INSERT', NULL, json_build_object('source_estimate_id', p_source_estimate_id, 'cloned', true), p_created_by, CURRENT_TIMESTAMP);
    END IF;

    RETURN v_new_estimate_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- OPTIONAL RECALCULATION TRIGGER
-- =============================================================================
CREATE OR REPLACE FUNCTION recalculate_estimate_total_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_estimate_id BIGINT;
BEGIN
    v_estimate_id := COALESCE(NEW.estimate_id, OLD.estimate_id);
    CALL calculate_estimate_total(v_estimate_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_estimate_items_recalc ON estimate_items;
CREATE TRIGGER trg_estimate_items_recalc
AFTER INSERT OR UPDATE OR DELETE ON estimate_items
FOR EACH ROW
EXECUTE FUNCTION recalculate_estimate_total_trigger();

DROP TRIGGER IF EXISTS trg_gates_recalc ON gates;
CREATE TRIGGER trg_gates_recalc
AFTER INSERT OR UPDATE OR DELETE ON gates
FOR EACH ROW
EXECUTE FUNCTION recalculate_estimate_total_trigger();

-- =============================================================================
-- EVENT / JOB SCHEDULING NOTES
-- =============================================================================
-- PostgreSQL example using pg_cron (install extension separately):
-- SELECT cron.schedule('auto-archive-old-projects', '0 2 * * *', $$CALL archive_old_projects(18);$$);
-- MySQL 8+ event scheduler equivalent:
-- SET GLOBAL event_scheduler = ON;
-- CREATE EVENT IF NOT EXISTS ev_auto_archive_old_drafts
-- ON SCHEDULE EVERY 1 DAY
-- STARTS CURRENT_TIMESTAMP + INTERVAL 1 DAY
-- DO
--   CALL archive_old_projects(18);


-- =============================================================================
-- MYSQL 8+ ADAPTATION REFERENCE (COMMENTED EXAMPLES)
-- =============================================================================
-- The statements below are intentionally commented so this file remains executable in PostgreSQL.
-- They provide ready-to-convert equivalents for teams running MySQL 8+.
--
-- DELIMITER $$
-- CREATE FUNCTION format_currency_mysql(p_amount DECIMAL(12,2))
-- RETURNS VARCHAR(32)
-- DETERMINISTIC
-- BEGIN
--     RETURN CONCAT('$', FORMAT(IFNULL(p_amount, 0), 2));
-- END$$
-- DELIMITER ;
--
-- DELIMITER $$
-- CREATE FUNCTION get_tax_rate_mysql(p_state VARCHAR(50), p_zip VARCHAR(20))
-- RETURNS DECIMAL(6,4)
-- DETERMINISTIC
-- BEGIN
--     CASE UPPER(IFNULL(p_state, ''))
--         WHEN 'TN' THEN RETURN 0.0925;
--         WHEN 'KY' THEN RETURN 0.0600;
--         WHEN 'AL' THEN RETURN 0.0800;
--         WHEN 'GA' THEN RETURN 0.0800;
--         WHEN 'NC' THEN RETURN 0.0725;
--         ELSE RETURN 0.0700;
--     END CASE;
-- END$$
-- DELIMITER ;
--
-- DELIMITER $$
-- CREATE FUNCTION calculate_markup_mysql(p_cost DECIMAL(12,2), p_markup_percent DECIMAL(6,2))
-- RETURNS DECIMAL(12,2)
-- DETERMINISTIC
-- BEGIN
--     RETURN ROUND(IFNULL(p_cost, 0) * (1 + (IFNULL(p_markup_percent, 0) / 100.0)), 2);
-- END$$
-- DELIMITER ;
--
-- DELIMITER $$
-- CREATE PROCEDURE calculate_estimate_total_mysql(IN p_estimate_id BIGINT)
-- BEGIN
--     DECLARE v_materials_total DECIMAL(12,2) DEFAULT 0;
--     DECLARE v_labor_total DECIMAL(12,2) DEFAULT 0;
--     DECLARE v_extras_total DECIMAL(12,2) DEFAULT 0;
--     DECLARE v_gate_total DECIMAL(12,2) DEFAULT 0;
--     DECLARE v_tax_rate DECIMAL(6,4) DEFAULT 0;
--     DECLARE v_subtotal DECIMAL(12,2) DEFAULT 0;
--     DECLARE v_tax_amount DECIMAL(12,2) DEFAULT 0;
--     DECLARE v_grand_total DECIMAL(12,2) DEFAULT 0;
--     DECLARE v_state VARCHAR(50);
--
--     SELECT p.site_state
--     INTO v_state
--     FROM estimates e
--     JOIN projects p ON p.id = e.project_id
--     WHERE e.id = p_estimate_id;
--
--     SELECT IFNULL(SUM(total_price), 0)
--     INTO v_materials_total
--     FROM estimate_items
--     WHERE estimate_id = p_estimate_id
--       AND category = 'material';
--
--     SELECT IFNULL(SUM(total_price), 0)
--     INTO v_labor_total
--     FROM estimate_items
--     WHERE estimate_id = p_estimate_id
--       AND category = 'labor';
--
--     SELECT IFNULL(SUM(total_price), 0)
--     INTO v_extras_total
--     FROM estimate_items
--     WHERE estimate_id = p_estimate_id
--       AND category IN ('equipment', 'freight', 'permit', 'subcontract', 'discount', 'other');
--
--     SELECT IFNULL(SUM(total_price), 0)
--     INTO v_gate_total
--     FROM gates
--     WHERE estimate_id = p_estimate_id;
--
--     SET v_materials_total = ROUND(v_materials_total + v_gate_total, 2);
--     SET v_tax_rate = get_tax_rate_mysql(v_state, NULL);
--     SET v_subtotal = ROUND(v_materials_total + v_labor_total + v_extras_total, 2);
--     SET v_tax_amount = ROUND(v_subtotal * v_tax_rate, 2);
--     SET v_grand_total = ROUND(v_subtotal + v_tax_amount, 2);
--
--     UPDATE estimates
--     SET materials_total = v_materials_total,
--         labor_total = v_labor_total,
--         extras_total = v_extras_total,
--         tax_rate = v_tax_rate,
--         tax_amount = v_tax_amount,
--         subtotal = v_subtotal,
--         grand_total = v_grand_total
--     WHERE id = p_estimate_id;
-- END$$
-- DELIMITER ;
--
-- DELIMITER $$
-- CREATE PROCEDURE archive_old_projects_mysql(IN p_months_old INT)
-- BEGIN
--     UPDATE projects
--     SET status = 'archived',
--         updated_at = CURRENT_TIMESTAMP
--     WHERE status IN ('completed', 'cancelled')
--       AND COALESCE(end_date, start_date, DATE(created_at)) < DATE_SUB(CURRENT_DATE, INTERVAL p_months_old MONTH);
-- END$$
-- DELIMITER ;
--
-- DELIMITER $$
-- CREATE EVENT IF NOT EXISTS ev_auto_archive_old_drafts
-- ON SCHEDULE EVERY 1 DAY
-- DO
--     CALL archive_old_projects_mysql(18)$$
-- DELIMITER ;
--
-- Suggested procedure smoke tests:
-- CALL calculate_estimate_total(1);
-- SELECT * FROM get_project_summary(1);
-- CALL archive_old_projects(18);
-- SELECT clone_estimate(1, 2);
--
-- Operational safeguards:
--   1. Wrap clone_estimate calls in application transactions when immediately editing the new version.
--   2. Re-run total calculation after any manual SQL update to estimate_items or gates.
--   3. Treat get_tax_rate as a default helper and replace it with jurisdiction-specific logic if required.
--   4. Archive routines should be scheduled during off-hours if large status updates trigger downstream jobs.
--   5. Audit-log writes from clone_estimate can be expanded to include version metadata if your UI depends on it.


-- =============================================================================
-- PROCEDURE BEHAVIOR NOTES
-- =============================================================================
-- calculate_estimate_total:
--   * Rebuilds totals from estimate_items and gates.
--   * Treats gate totals as material totals for reporting simplicity.
--   * Applies tax to the entire subtotal using get_tax_rate().
--
-- get_project_summary:
--   * Returns one row for the requested project.
--   * Uses the latest estimate version as the active commercial baseline.
--   * Combines contract and payment data for quick dashboard access.
--
-- archive_old_projects:
--   * Only archives completed or cancelled projects.
--   * Leaves active sales and production projects untouched.
--   * Uses end_date, then start_date, then created_at as a fallback aging key.
--
-- clone_estimate:
--   * Creates the next estimate version automatically.
--   * Copies estimate_items and gates from the source estimate.
--   * Recalculates totals after the clone is created.
--   * Optionally records the clone action to audit_log.
--
-- Suggested manual QA script:
--   BEGIN;
--   SELECT clone_estimate(2, 1) AS new_estimate_id;
--   SELECT * FROM estimates WHERE project_id = 2 ORDER BY version DESC;
--   ROLLBACK;
--
--   BEGIN;
--   UPDATE estimate_items SET quantity = quantity + 1 WHERE id = 1;
--   SELECT id, materials_total, subtotal, grand_total FROM estimates WHERE id = 1;
--   ROLLBACK;
--
--   BEGIN;
--   CALL archive_old_projects(1);
--   SELECT id, status FROM projects WHERE status = 'archived';
--   ROLLBACK;
--
-- Extension ideas:
--   * add create_change_order_from_estimate(source_estimate_id)
--   * add calculate_material_requirements(estimate_id)
--   * add sync_estimate_item_prices_from_catalog(estimate_id)
--   * add generate_contract_terms(estimate_id, template_name)
--   * add close_contract_when_paid(contract_id)
