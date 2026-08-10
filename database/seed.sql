INSERT INTO inventory (sku, name, category, uom, unit_cost, quantity_on_hand)
SELECT
  CONCAT('SKU-', LPAD(g::text, 4, '0')),
  CONCAT('Fence Product ', g),
  CASE WHEN g % 5 = 0 THEN 'hardware' WHEN g % 5 = 1 THEN 'mesh' WHEN g % 5 = 2 THEN 'posts' WHEN g % 5 = 3 THEN 'concrete' ELSE 'tools' END,
  'each',
  ROUND((5 + (g % 37) * 1.13)::numeric, 2),
  50 + (g % 200)
FROM generate_series(1, 950) AS g;

INSERT INTO notes (project_id, tab_key, body, created_by)
SELECT 1, 'labor-rates', 'Residential chainlink: $12/ft; Commercial chainlink: $18/ft', 1
WHERE EXISTS (SELECT 1 FROM users WHERE id = 1) AND EXISTS (SELECT 1 FROM projects WHERE id = 1);

-- Equipment costs
-- auger_hourly_rate: 65
-- truck_hourly_rate: 45

-- Permit samples
-- urban: $150
-- suburban: $100
-- rural: $65
