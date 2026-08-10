CREATE OR REPLACE FUNCTION get_project_summary(p_project_id BIGINT)
RETURNS TABLE (
    project_pk BIGINT,
    project_code VARCHAR,
    customer_name VARCHAR,
    status project_status,
    estimator_name VARCHAR,
    total_footage NUMERIC,
    latest_estimate_total NUMERIC,
    locked_contract_price NUMERIC,
    approved_change_order_total NUMERIC,
    note_count BIGINT,
    signed_off_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    WITH latest_estimate AS (
        SELECT e.project_id, e.total_amount
        FROM estimates e
        WHERE e.project_id = p_project_id
        ORDER BY e.created_at DESC
        LIMIT 1
    ),
    contract_totals AS (
        SELECT c.project_id,
               c.locked_price,
               COALESCE(SUM(CASE WHEN co.status IN ('approved', 'implemented') THEN co.cost_adjustment ELSE 0 END), 0) AS approved_change_order_total
        FROM contracts c
        LEFT JOIN change_orders co ON co.contract_id = c.id
        WHERE c.project_id = p_project_id
        GROUP BY c.project_id, c.locked_price
        ORDER BY c.project_id
    ),
    sign_off AS (
        SELECT so.project_id, MAX(so.signed_at) AS signed_off_at
        FROM sign_offs so
        WHERE so.project_id = p_project_id
        GROUP BY so.project_id
    )
    SELECT
        p.id,
        p.project_id,
        p.customer_name,
        p.status,
        u.username,
        COALESCE(fs.total_footage, 0),
        COALESCE(le.total_amount, 0),
        COALESCE(ct.locked_price, 0),
        COALESCE(ct.approved_change_order_total, 0),
        COALESCE((SELECT COUNT(*) FROM project_notes pn WHERE pn.project_id = p.id), 0),
        so.signed_off_at
    FROM projects p
    JOIN users u ON u.id = p.estimator_id
    LEFT JOIN fence_specs fs ON fs.project_id = p.id
    LEFT JOIN latest_estimate le ON le.project_id = p.id
    LEFT JOIN contract_totals ct ON ct.project_id = p.id
    LEFT JOIN sign_off so ON so.project_id = p.id
    WHERE p.id = p_project_id;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION calculate_estimate_total(p_estimate_id BIGINT)
RETURNS NUMERIC(12,2) AS $$
DECLARE
    v_material NUMERIC(12,2);
    v_labor NUMERIC(12,2);
    v_equipment NUMERIC(12,2);
    v_overhead NUMERIC(12,2);
    v_tax_rate NUMERIC(6,4);
    v_subtotal NUMERIC(12,2);
    v_tax NUMERIC(12,2);
    v_total NUMERIC(12,2);
BEGIN
    SELECT material_cost, labor_cost, equipment_cost, overhead_cost, tax_rate
    INTO v_material, v_labor, v_equipment, v_overhead, v_tax_rate
    FROM estimates
    WHERE id = p_estimate_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Estimate % not found', p_estimate_id;
    END IF;

    v_subtotal := COALESCE(v_material, 0) + COALESCE(v_labor, 0) + COALESCE(v_equipment, 0) + COALESCE(v_overhead, 0);
    v_tax := ROUND(v_subtotal * COALESCE(v_tax_rate, 0), 2);
    v_total := ROUND(v_subtotal + v_tax, 2);

    UPDATE estimates
    SET tax_amount = v_tax,
        total_amount = v_total,
        updated_at = NOW()
    WHERE id = p_estimate_id;

    RETURN v_total;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION lock_contract_price(p_contract_id BIGINT)
RETURNS NUMERIC(12,2) AS $$
DECLARE
    v_locked_price NUMERIC(12,2);
    v_estimate_id BIGINT;
    v_estimate_total NUMERIC(12,2);
BEGIN
    SELECT estimate_id, locked_price
    INTO v_estimate_id, v_locked_price
    FROM contracts
    WHERE id = p_contract_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Contract % not found', p_contract_id;
    END IF;

    SELECT total_amount
    INTO v_estimate_total
    FROM estimates
    WHERE id = v_estimate_id;

    IF v_estimate_total IS NULL THEN
        RAISE EXCEPTION 'Estimate total missing for contract %', p_contract_id;
    END IF;

    UPDATE contracts
    SET locked_price = v_estimate_total,
        status = CASE WHEN status = 'pending' THEN 'signed' ELSE status END,
        signed_at = COALESCE(signed_at, NOW())
    WHERE id = p_contract_id;

    RETURN v_estimate_total;
END;
$$ LANGUAGE plpgsql;
