INSERT INTO users (name, email, password_hash, role)
VALUES ('Demo Estimator', 'demo@fencedepot.local', 'sha256-demo-password-placeholder', 'admin');

INSERT INTO projects (name, customer_name, address, city, province, postal_code, fence_type, status, linear_feet, notes)
VALUES ('Fence Depot Demo Project', 'Sample Customer', '100 Yard Line Road', 'Toronto', 'ON', 'A1A 1A1', 'chain-link', 'draft', 120, 'Starter seed project');

INSERT INTO project_tabs (project_id, tab_key, payload_json)
VALUES
  (1, 'project', '{"name":"Fence Depot Demo Project","customerName":"Sample Customer"}'),
  (1, 'estimate', '{"fenceType":"chain-link","linearFeet":120,"heightFeet":6,"gates":1}');

INSERT INTO catalog_products (sku, name, category, unit, price)
VALUES
  ('CL-MESH-048', 'Chain Link Mesh 48"', 'Chain Link', 'roll', 148.50),
  ('CL-POST-LN-2-3-8', 'Line Post 2 3/8"', 'Posts', 'ea', 36.20),
  ('CONC-30KG', 'Concrete Mix 30kg', 'Concrete', 'bag', 8.25);

WITH RECURSIVE seq(n) AS (
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM seq WHERE n < 950
)
INSERT INTO catalog_products (sku, name, category, unit, price)
SELECT
  'SKU-' || printf('%04d', n),
  'Fence Product ' || n,
  CASE n % 5
    WHEN 0 THEN 'Chain Link'
    WHEN 1 THEN 'Wood'
    WHEN 2 THEN 'Vinyl'
    WHEN 3 THEN 'Hardware'
    ELSE 'Concrete'
  END,
  CASE WHEN n % 3 = 0 THEN 'ea' WHEN n % 3 = 1 THEN 'roll' ELSE 'bag' END,
  round(9.5 + (n * 0.37), 2)
FROM seq;
