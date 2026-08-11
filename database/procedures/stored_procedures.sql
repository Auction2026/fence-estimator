-- ============================================================
-- PROCEDURE: sp_backup_estimates
-- Backup all estimates to archive table before purge
-- ============================================================

DELIMITER $$

USE fence_estimator$$

CREATE PROCEDURE IF NOT EXISTS sp_backup_estimates(IN cutoff_date DATE)
BEGIN
    CREATE TABLE IF NOT EXISTS estimates_archive LIKE estimates;

    INSERT INTO estimates_archive
    SELECT * FROM estimates
    WHERE created_at < cutoff_date
      AND status IN ('approved', 'declined', 'expired');

    SELECT CONCAT('Archived ', ROW_COUNT(), ' estimates to estimates_archive') AS result;
END$$

-- ============================================================
-- PROCEDURE: sp_recalculate_estimate_totals
-- Recomputes subtotal/tax/total for a given estimate
-- ============================================================

CREATE PROCEDURE IF NOT EXISTS sp_recalculate_estimate_totals(IN p_estimate_id INT UNSIGNED)
BEGIN
    DECLARE v_material_cost  DECIMAL(10,2) DEFAULT 0;
    DECLARE v_labor_cost     DECIMAL(10,2) DEFAULT 0;
    DECLARE v_markup_pct     DECIMAL(5,2)  DEFAULT 0;
    DECLARE v_tax_pct        DECIMAL(5,2)  DEFAULT 0;
    DECLARE v_subtotal       DECIMAL(10,2) DEFAULT 0;
    DECLARE v_markup_amt     DECIMAL(10,2) DEFAULT 0;
    DECLARE v_tax_amt        DECIMAL(10,2) DEFAULT 0;
    DECLARE v_total          DECIMAL(10,2) DEFAULT 0;

    -- Sum line items
    SELECT COALESCE(SUM(line_total), 0)
    INTO v_material_cost
    FROM estimate_line_items
    WHERE estimate_id = p_estimate_id;

    -- Get current rates
    SELECT markup_percent, tax_percent, labor_cost
    INTO v_markup_pct, v_tax_pct, v_labor_cost
    FROM estimates
    WHERE id = p_estimate_id;

    SET v_subtotal   = v_material_cost + v_labor_cost;
    SET v_markup_amt = v_subtotal * (v_markup_pct / 100);
    SET v_tax_amt    = (v_subtotal + v_markup_amt) * (v_tax_pct / 100);
    SET v_total      = v_subtotal + v_markup_amt + v_tax_amt;

    UPDATE estimates
    SET material_cost = v_material_cost,
        subtotal      = v_subtotal,
        markup_amount = v_markup_amt,
        tax_amount    = v_tax_amt,
        total_amount  = v_total,
        updated_at    = NOW()
    WHERE id = p_estimate_id;

    SELECT v_total AS new_total;
END$$

-- ============================================================
-- PROCEDURE: sp_maintenance_cleanup
-- Remove orphaned records, update stats
-- ============================================================

CREATE PROCEDURE IF NOT EXISTS sp_maintenance_cleanup()
BEGIN
    -- Remove orphaned line items
    DELETE FROM estimate_line_items eli
    WHERE NOT EXISTS (SELECT 1 FROM estimates e WHERE e.id = eli.estimate_id);

    -- Remove draft estimates older than 90 days
    DELETE FROM estimates
    WHERE status = 'draft'
      AND created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

    -- Analyze tables for optimizer
    ANALYZE TABLE estimates, estimate_line_items, inventory_products, projects;

    SELECT 'Maintenance cleanup complete' AS status, NOW() AS run_time;
END$$

DELIMITER ;

SELECT 'Procedures created successfully' AS status;
