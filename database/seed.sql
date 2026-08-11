-- Seed baseline users and 952 products.

INSERT INTO users (username, email, password_hash, role)
VALUES ('admin', 'admin@fencedepot.local', '$2b$10$exampleplaceholderhash', 'admin')
ON CONFLICT (username) DO NOTHING;

INSERT INTO products (sku, category, product_name, unit, unit_cost)
SELECT
  'SKU-' || LPAD(gs::text, 4, '0'),
  CASE
    WHEN gs % 6 = 0 THEN 'Mesh'
    WHEN gs % 6 = 1 THEN 'Posts'
    WHEN gs % 6 = 2 THEN 'Gates'
    WHEN gs % 6 = 3 THEN 'Fittings'
    WHEN gs % 6 = 4 THEN 'Concrete'
    ELSE 'Accessories'
  END,
  'Fence Product ' || gs,
  CASE WHEN gs % 10 = 0 THEN 'roll' ELSE 'ea' END,
  ROUND((12 + (gs % 120) * 0.85)::numeric, 2)
FROM generate_series(1, 952) AS gs
ON CONFLICT (sku) DO NOTHING;
