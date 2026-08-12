-- ============================================================
-- Stored Procedures / Functions
-- Fence Depot Estimator
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE OR REPLACE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_estimates_updated_at
    BEFORE UPDATE ON estimates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function: Get estimate total with tax
CREATE OR REPLACE FUNCTION get_estimate_total(p_estimate_id INTEGER)
RETURNS NUMERIC AS $$
DECLARE
    v_subtotal NUMERIC;
    v_labour   NUMERIC;
    v_tax_rate NUMERIC;
    v_total    NUMERIC;
BEGIN
    SELECT subtotal, labour, tax_rate
    INTO v_subtotal, v_labour, v_tax_rate
    FROM estimates
    WHERE id = p_estimate_id;

    v_total := (v_subtotal + v_labour) * (1 + v_tax_rate / 100);
    RETURN ROUND(v_total, 2);
END;
$$ LANGUAGE plpgsql;

-- Function: Get customer estimate count
CREATE OR REPLACE FUNCTION get_customer_estimate_count(p_customer_id INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM estimates WHERE customer_id = p_customer_id);
END;
$$ LANGUAGE plpgsql;
