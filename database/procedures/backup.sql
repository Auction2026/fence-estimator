-- ═══════════════════════════════════════════════════════════════
-- FENCE DEPOT ESTIMATOR PRO – procedures/backup.sql
-- Utility stored procedures: backup, recovery, maintenance
-- ═══════════════════════════════════════════════════════════════

-- ── FULL DATA EXPORT HELPER ───────────────────────────────────────
-- Usage: SELECT * FROM fn_export_project_summary();
CREATE OR REPLACE FUNCTION fn_export_project_summary()
RETURNS TABLE(
  project_id     INT,
  customer_name  TEXT,
  fence_type     TEXT,
  linear_ft      NUMERIC,
  status         TEXT,
  grand_total    NUMERIC,
  created_at     TIMESTAMPTZ
) AS $$
  SELECT p.id, p.customer_name, p.fence_type, p.linear_ft, p.status,
         COALESCE(e.grand_total, 0), p.created_at
  FROM   projects p
  LEFT JOIN estimates e ON e.project_id = p.id
  ORDER BY p.created_at DESC;
$$ LANGUAGE sql STABLE;

-- ── SOFT DELETE / ARCHIVE PROJECT ────────────────────────────────
CREATE OR REPLACE PROCEDURE sp_archive_project(p_id INT)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE projects SET status = 'cancelled' WHERE id = p_id;
  RAISE NOTICE 'Project % archived', p_id;
END;
$$;

-- ── RECALCULATE ESTIMATE TOTALS ───────────────────────────────────
CREATE OR REPLACE PROCEDURE sp_recalc_estimate(p_est_id INT)
LANGUAGE plpgsql AS $$
DECLARE
  v_mat  NUMERIC(12,2);
  v_labor NUMERIC(12,2);
  v_markup NUMERIC(12,2);
BEGIN
  SELECT COALESCE(SUM(line_total),0) INTO v_mat
  FROM   estimate_items WHERE estimate_id = p_est_id;

  SELECT labor_rate * linear_ft,
         (v_mat + labor_rate * linear_ft) * markup_pct / 100
  INTO   v_labor, v_markup
  FROM   estimates WHERE id = p_est_id;

  UPDATE estimates
  SET    materials_total = v_mat,
         labor_total     = v_labor,
         markup_amount   = v_markup,
         grand_total     = v_mat + v_labor + v_markup,
         updated_at      = NOW()
  WHERE  id = p_est_id;

  RAISE NOTICE 'Estimate % recalculated: mat=% labor=% markup=% total=%',
    p_est_id, v_mat, v_labor, v_markup, v_mat + v_labor + v_markup;
END;
$$;

-- ── PURGE OLD DRAFT ESTIMATES (> 90 days) ────────────────────────
CREATE OR REPLACE PROCEDURE sp_purge_old_drafts()
LANGUAGE plpgsql AS $$
DECLARE
  v_count INT;
BEGIN
  DELETE FROM estimates
  WHERE  status = 'draft'
    AND  created_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RAISE NOTICE 'Purged % stale draft estimates', v_count;
END;
$$;

-- ── LOW STOCK REPORT ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION fn_low_stock_report()
RETURNS TABLE(plu TEXT, description TEXT, on_hand INT, reorder_point INT, department TEXT)
AS $$
  SELECT plu::TEXT, description::TEXT, on_hand, reorder_point, department::TEXT
  FROM   inventory
  WHERE  on_hand <= reorder_point
    AND  active = TRUE
  ORDER BY (on_hand - reorder_point) ASC;
$$ LANGUAGE sql STABLE;
