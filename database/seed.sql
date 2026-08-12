BEGIN;

INSERT INTO catalog_products (sku, name, category, unit_price, unit_of_measure)
VALUES
  ('CL-001', 'Chain Link Fabric 6 ft', 'Chain Link', 24.00, 'lf'),
  ('CL-002', 'Chain Link Line Post', 'Chain Link', 34.00, 'each'),
  ('WD-101', 'Pressure Treated Fence Board', 'Wood', 11.00, 'each'),
  ('WD-102', '4x4 Treated Post', 'Wood', 24.00, 'each'),
  ('VN-201', 'Vinyl Privacy Panel', 'Vinyl', 41.00, 'panel'),
  ('OR-301', 'Ornamental Section', 'Ornamental', 52.00, 'panel'),
  ('AL-401', 'Aluminum Panel', 'Aluminum', 44.00, 'panel'),
  ('GT-500', 'Single Swing Gate Kit', 'Gate', 180.00, 'kit'),
  ('GT-501', 'Double Drive Gate Kit', 'Gate', 425.00, 'kit'),
  ('SR-900', 'Permit Coordination', 'Service', 195.00, 'job')
ON CONFLICT (sku) DO NOTHING;

INSERT INTO catalog_products (sku, name, category, unit_price, unit_of_measure)
SELECT
  FORMAT('AUTO-%s', gs),
  FORMAT('Generated Catalog Item %s', gs),
  CASE
    WHEN gs % 5 = 0 THEN 'Chain Link'
    WHEN gs % 5 = 1 THEN 'Wood'
    WHEN gs % 5 = 2 THEN 'Vinyl'
    WHEN gs % 5 = 3 THEN 'Ornamental'
    ELSE 'Service'
  END,
  ROUND((15 + (gs * 1.37))::numeric, 2),
  CASE WHEN gs % 4 = 0 THEN 'lf' ELSE 'each' END
FROM generate_series(1, 120) AS gs
ON CONFLICT (sku) DO NOTHING;

COMMIT;
