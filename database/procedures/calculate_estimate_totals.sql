-- Procedure: Recalculate and update estimate totals from line_items JSONB
CREATE OR REPLACE FUNCTION calculate_estimate_totals(p_estimate_id UUID)
RETURNS VOID AS $$
DECLARE
  v_materials NUMERIC := 0;
  v_labor     NUMERIC := 0;
  v_markup    NUMERIC;
  v_tax       NUMERIC;
  v_subtotal  NUMERIC;
  v_total     NUMERIC;
  v_markup_pct NUMERIC;
  v_tax_rate   NUMERIC;
  v_discount   NUMERIC;
BEGIN
  SELECT
      COALESCE(SUM((item->>'cost')::NUMERIC * (item->>'qty')::NUMERIC), 0),
      markup_pct,
      tax_rate,
      discount_amount
  INTO v_materials, v_markup_pct, v_tax_rate, v_discount
  FROM estimates,
       jsonb_array_elements(COALESCE(line_items, '[]')) AS item
  WHERE id = p_estimate_id
  GROUP BY markup_pct, tax_rate, discount_amount;

  -- If no rows matched, initialize
  IF NOT FOUND THEN
    SELECT markup_pct, tax_rate, discount_amount
    INTO v_markup_pct, v_tax_rate, v_discount
    FROM estimates WHERE id = p_estimate_id;
    v_materials := 0;
  END IF;

  v_markup   := v_materials * (COALESCE(v_markup_pct,35) / 100.0);
  v_subtotal := v_materials + v_labor + v_markup - COALESCE(v_discount, 0);
  v_tax      := v_subtotal * (COALESCE(v_tax_rate, 8.25) / 100.0);
  v_total    := v_subtotal + v_tax;

  UPDATE estimates SET
    materials_cost = v_materials,
    labor_cost     = v_labor,
    overhead_cost  = v_markup,
    subtotal       = v_subtotal,
    tax_amount     = v_tax,
    total_amount   = v_total,
    updated_at     = NOW()
  WHERE id = p_estimate_id;
END;
$$ LANGUAGE plpgsql;
