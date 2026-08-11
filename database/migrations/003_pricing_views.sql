-- ============================================================
-- MIGRATION 003 - PRICING ADJUSTMENT VIEWS
-- Fence Depot Estimator
-- Run AFTER migration 002
-- ============================================================

-- View: products with calculated pricing
CREATE OR REPLACE VIEW v_products_priced AS
SELECT
    p.plu,
    pc.name              AS category,
    p.name,
    p.unit,
    p.unit_cost,
    p.markup_pct,
    ROUND(p.unit_cost * (1 + p.markup_pct / 100), 2) AS sell_price,
    ROUND(p.unit_cost * (1 + p.markup_pct / 100) * 1.13, 2) AS sell_price_incl_hst,
    p.fence_type,
    p.height_ft,
    p.color,
    p.gauge,
    p.canadian_std,
    p.supplier,
    p.in_stock,
    p.is_active
FROM products p
JOIN product_categories pc ON pc.id = p.category_id
WHERE p.is_active = TRUE
ORDER BY pc.sort_order, p.name;

-- View: estimate totals
CREATE OR REPLACE VIEW v_estimate_totals AS
SELECT
    e.estimate_number,
    e.project_id,
    e.customer_name,
    e.fence_type,
    e.linear_feet,
    e.material_cost,
    e.labor_hours,
    e.labor_rate,
    ROUND(e.labor_hours * e.labor_rate, 2)        AS labor_cost_calc,
    e.labor_cost,
    e.subtotal,
    e.tax_rate,
    e.tax_amount,
    e.total,
    e.profit_margin,
    e.status,
    e.is_locked,
    e.expires_at,
    u.username                                      AS created_by_name,
    e.created_at
FROM estimates e
JOIN users u ON u.id = e.created_by;

-- View: project summary
CREATE OR REPLACE VIEW v_project_summary AS
SELECT
    p.project_id,
    p.customer_name,
    p.city,
    p.province,
    p.status,
    u.username            AS estimator_name,
    COUNT(e.id)           AS estimate_count,
    MAX(e.total)          AS highest_estimate,
    MIN(e.total)          AS lowest_estimate,
    p.created_at
FROM projects p
JOIN users u ON u.id = p.estimator_id
LEFT JOIN estimates e ON e.project_id = p.project_id
GROUP BY p.project_id, p.customer_name, p.city, p.province,
         p.status, u.username, p.created_at;

-- Record completion
INSERT INTO schema_migrations (version, description)
VALUES ('003', 'Pricing views: v_products_priced, v_estimate_totals, v_project_summary')
ON CONFLICT (version) DO NOTHING;
