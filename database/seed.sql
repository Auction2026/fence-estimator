-- ============================================================
-- FENCE DEPOT ESTIMATOR - SEED DATA
-- 950+ Products | Canadian Standards Compliant
-- Run AFTER schema.sql
-- ============================================================

-- ============================================================
-- PRODUCT CATEGORIES
-- ============================================================
INSERT INTO product_categories (code, name, description, sort_order) VALUES
  ('CHAIN-LINK',    'Chain Link',           'CAN/CGSB-138.3-2019 compliant chain link components',  10),
  ('VINYL-PVC',     'Vinyl / PVC',          'Homeland Vinyl Products only',                          20),
  ('WOOD',          'Wood Fencing',         'CSA O141 Grade #2 minimum pressure-treated',            30),
  ('WROUGHT-IRON',  'Wrought Iron',         'Cloutier Direct inventory only',                        40),
  ('GUIDE-RAIL',    'Guide Rail',           'OPSD 02.16.04 highway-standard guide rail',             50),
  ('GATES',         'Gates & Hardware',     'All fence types - gate assemblies and hardware',        60),
  ('CONCRETE',      'Concrete & Footings',  'CSA A3000 minimum 20 MPa for all footings',            70),
  ('FASTENERS',     'Fasteners & Hardware', 'CSA G40.8 galvanized steel fasteners',                 80),
  ('TOOLS',         'Tools & Equipment',    'Installation tools and equipment',                      90),
  ('FINISHING',     'Finishing & Paint',    'Primers, paints, sealants, and coatings',              100),
  ('LABOUR',        'Labour Rates',         'Canadian wage rates and crew codes',                   110),
  ('MISC',          'Miscellaneous',        'Sundry items, consumables, and site supplies',         120)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- DEFAULT ADMIN USER (change password immediately)
-- ============================================================
INSERT INTO users (username, email, password_hash, role, company) VALUES
  ('admin', 'admin@fencedepot.ca',
   '$2a$10$placeholder_hash_change_on_first_login',
   'admin', 'Fence Depot')
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- HELPER: resolve category id by code
-- (PostgreSQL — adjust for MySQL if needed)
-- ============================================================
-- We use a WITH clause per batch for readability.

-- ============================================================
-- CHAIN LINK — FABRIC / MESH (PLU 001-100)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, height_ft, color, gauge, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'Chain Link', v.ht, v.color, v.gauge, 'CAN/CGSB-138.3-2019', 'Master Halco Canada'
FROM cat, (VALUES
  ('CL-MESH-3GAL-9',   'Chain Link Fabric 3ft Galvanized 9GA',           'roll', 45.00,  3.00, 'Galvanized', '9GA'),
  ('CL-MESH-4GAL-9',   'Chain Link Fabric 4ft Galvanized 9GA',           'roll', 58.00,  4.00, 'Galvanized', '9GA'),
  ('CL-MESH-5GAL-9',   'Chain Link Fabric 5ft Galvanized 9GA',           'roll', 72.00,  5.00, 'Galvanized', '9GA'),
  ('CL-MESH-6GAL-9',   'Chain Link Fabric 6ft Galvanized 9GA',           'roll', 86.00,  6.00, 'Galvanized', '9GA'),
  ('CL-MESH-8GAL-9',   'Chain Link Fabric 8ft Galvanized 9GA',           'roll', 112.00, 8.00, 'Galvanized', '9GA'),
  ('CL-MESH-10GAL-9',  'Chain Link Fabric 10ft Galvanized 9GA',          'roll', 140.00,10.00, 'Galvanized', '9GA'),
  ('CL-MESH-3GRN-9',   'Chain Link Fabric 3ft Green Vinyl-Coated 9GA',   'roll', 55.00,  3.00, 'Green',      '9GA'),
  ('CL-MESH-4GRN-9',   'Chain Link Fabric 4ft Green Vinyl-Coated 9GA',   'roll', 70.00,  4.00, 'Green',      '9GA'),
  ('CL-MESH-5GRN-9',   'Chain Link Fabric 5ft Green Vinyl-Coated 9GA',   'roll', 88.00,  5.00, 'Green',      '9GA'),
  ('CL-MESH-6GRN-9',   'Chain Link Fabric 6ft Green Vinyl-Coated 9GA',   'roll', 105.00, 6.00, 'Green',      '9GA'),
  ('CL-MESH-8GRN-9',   'Chain Link Fabric 8ft Green Vinyl-Coated 9GA',   'roll', 136.00, 8.00, 'Green',      '9GA'),
  ('CL-MESH-3BLK-9',   'Chain Link Fabric 3ft Black Vinyl-Coated 9GA',   'roll', 58.00,  3.00, 'Black',      '9GA'),
  ('CL-MESH-4BLK-9',   'Chain Link Fabric 4ft Black Vinyl-Coated 9GA',   'roll', 73.00,  4.00, 'Black',      '9GA'),
  ('CL-MESH-5BLK-9',   'Chain Link Fabric 5ft Black Vinyl-Coated 9GA',   'roll', 92.00,  5.00, 'Black',      '9GA'),
  ('CL-MESH-6BLK-9',   'Chain Link Fabric 6ft Black Vinyl-Coated 9GA',   'roll', 110.00, 6.00, 'Black',      '9GA'),
  ('CL-MESH-8BLK-9',   'Chain Link Fabric 8ft Black Vinyl-Coated 9GA',   'roll', 143.00, 8.00, 'Black',      '9GA'),
  ('CL-MESH-10BLK-9',  'Chain Link Fabric 10ft Black Vinyl-Coated 9GA',  'roll', 178.00,10.00, 'Black',      '9GA'),
  ('CL-MESH-3BRN-9',   'Chain Link Fabric 3ft Brown Vinyl-Coated 9GA',   'roll', 58.00,  3.00, 'Brown',      '9GA'),
  ('CL-MESH-4BRN-9',   'Chain Link Fabric 4ft Brown Vinyl-Coated 9GA',   'roll', 73.00,  4.00, 'Brown',      '9GA'),
  ('CL-MESH-5BRN-9',   'Chain Link Fabric 5ft Brown Vinyl-Coated 9GA',   'roll', 92.00,  5.00, 'Brown',      '9GA'),
  ('CL-MESH-6BRN-9',   'Chain Link Fabric 6ft Brown Vinyl-Coated 9GA',   'roll', 110.00, 6.00, 'Brown',      '9GA'),
  ('CL-MESH-8BRN-9',   'Chain Link Fabric 8ft Brown Vinyl-Coated 9GA',   'roll', 143.00, 8.00, 'Brown',      '9GA'),
  ('CL-MESH-3GAL-11',  'Chain Link Fabric 3ft Galvanized 11GA',          'roll', 38.00,  3.00, 'Galvanized', '11GA'),
  ('CL-MESH-4GAL-11',  'Chain Link Fabric 4ft Galvanized 11GA',          'roll', 50.00,  4.00, 'Galvanized', '11GA'),
  ('CL-MESH-5GAL-11',  'Chain Link Fabric 5ft Galvanized 11GA',          'roll', 62.00,  5.00, 'Galvanized', '11GA'),
  ('CL-MESH-6GAL-11',  'Chain Link Fabric 6ft Galvanized 11GA',          'roll', 75.00,  6.00, 'Galvanized', '11GA')
) AS v(plu, name, unit, unit_cost, ht, color, gauge)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- CHAIN LINK — LINE POSTS (PLU 101-180)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, height_ft, color, diameter_in, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, 'each', v.unit_cost, 'Chain Link', v.ht, v.color, v.dia, 'CAN/CGSB-138.3-2019 / CSA G40.21', 'Master Halco Canada'
FROM cat, (VALUES
  ('CL-LPOST-1.5-6.5-GAL',  'Line Post 1.5in OD x 6ft6in Galvanized',       38.00,  4.00, 'Galvanized', 1.5),
  ('CL-LPOST-1.5-8-GAL',    'Line Post 1.5in OD x 8ft Galvanized',          45.00,  5.00, 'Galvanized', 1.5),
  ('CL-LPOST-1.5-6.5-GRN',  'Line Post 1.5in OD x 6ft6in Green',            44.00,  4.00, 'Green',      1.5),
  ('CL-LPOST-1.5-8-GRN',    'Line Post 1.5in OD x 8ft Green',               52.00,  5.00, 'Green',      1.5),
  ('CL-LPOST-1.5-6.5-BLK',  'Line Post 1.5in OD x 6ft6in Black',            46.00,  4.00, 'Black',      1.5),
  ('CL-LPOST-1.5-8-BLK',    'Line Post 1.5in OD x 8ft Black',               54.00,  5.00, 'Black',      1.5),
  ('CL-LPOST-1.875-7-GAL',  'Line Post 1.875in OD x 7ft Galvanized',        52.00,  5.00, 'Galvanized', 1.875),
  ('CL-LPOST-1.875-8-GAL',  'Line Post 1.875in OD x 8ft Galvanized',        61.00,  6.00, 'Galvanized', 1.875),
  ('CL-LPOST-1.875-10-GAL', 'Line Post 1.875in OD x 10ft Galvanized',       76.00,  8.00, 'Galvanized', 1.875),
  ('CL-LPOST-1.875-7-BLK',  'Line Post 1.875in OD x 7ft Black',             60.00,  5.00, 'Black',      1.875),
  ('CL-LPOST-1.875-8-BLK',  'Line Post 1.875in OD x 8ft Black',             70.00,  6.00, 'Black',      1.875),
  ('CL-LPOST-1.875-10-BLK', 'Line Post 1.875in OD x 10ft Black',            87.00,  8.00, 'Black',      1.875),
  ('CL-LPOST-2.375-8-GAL',  'Line Post 2.375in OD x 8ft Galvanized',        80.00,  6.00, 'Galvanized', 2.375),
  ('CL-LPOST-2.375-10-GAL', 'Line Post 2.375in OD x 10ft Galvanized',       98.00,  8.00, 'Galvanized', 2.375),
  ('CL-LPOST-2.375-12-GAL', 'Line Post 2.375in OD x 12ft Galvanized',      118.00, 10.00, 'Galvanized', 2.375),
  ('CL-LPOST-2.875-10-GAL', 'Line Post 2.875in OD x 10ft Galvanized',      125.00,  8.00, 'Galvanized', 2.875),
  ('CL-LPOST-2.875-12-GAL', 'Line Post 2.875in OD x 12ft Galvanized',      148.00, 10.00, 'Galvanized', 2.875)
) AS v(plu, name, unit_cost, ht, color, dia)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- CHAIN LINK — TERMINAL POSTS (PLU 181-240)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, height_ft, color, diameter_in, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, 'each', v.unit_cost, 'Chain Link', v.ht, v.color, v.dia, 'CAN/CGSB-138.3-2019', 'Master Halco Canada'
FROM cat, (VALUES
  ('CL-TPOST-1.875-7-GAL',  'Terminal Post 1.875in OD x 7ft Galvanized',    65.00,  4.00, 'Galvanized', 1.875),
  ('CL-TPOST-1.875-8-GAL',  'Terminal Post 1.875in OD x 8ft Galvanized',    77.00,  5.00, 'Galvanized', 1.875),
  ('CL-TPOST-1.875-9-GAL',  'Terminal Post 1.875in OD x 9ft Galvanized',    89.00,  6.00, 'Galvanized', 1.875),
  ('CL-TPOST-1.875-11-GAL', 'Terminal Post 1.875in OD x 11ft Galvanized',  108.00,  8.00, 'Galvanized', 1.875),
  ('CL-TPOST-1.875-7-BLK',  'Terminal Post 1.875in OD x 7ft Black',         74.00,  4.00, 'Black',      1.875),
  ('CL-TPOST-1.875-8-BLK',  'Terminal Post 1.875in OD x 8ft Black',         88.00,  5.00, 'Black',      1.875),
  ('CL-TPOST-1.875-9-BLK',  'Terminal Post 1.875in OD x 9ft Black',        101.00,  6.00, 'Black',      1.875),
  ('CL-TPOST-2.375-8-GAL',  'Terminal Post 2.375in OD x 8ft Galvanized',   98.00,  5.00, 'Galvanized', 2.375),
  ('CL-TPOST-2.375-9-GAL',  'Terminal Post 2.375in OD x 9ft Galvanized',  114.00,  6.00, 'Galvanized', 2.375),
  ('CL-TPOST-2.375-11-GAL', 'Terminal Post 2.375in OD x 11ft Galvanized', 138.00,  8.00, 'Galvanized', 2.375),
  ('CL-TPOST-2.875-9-GAL',  'Terminal Post 2.875in OD x 9ft Galvanized',  145.00,  6.00, 'Galvanized', 2.875),
  ('CL-TPOST-2.875-11-GAL', 'Terminal Post 2.875in OD x 11ft Galvanized', 174.00,  8.00, 'Galvanized', 2.875),
  ('CL-TPOST-4-10-GAL',     'Terminal Post 4in OD x 10ft Galvanized',     220.00,  8.00, 'Galvanized', 4.000),
  ('CL-TPOST-4-12-GAL',     'Terminal Post 4in OD x 12ft Galvanized',     264.00, 10.00, 'Galvanized', 4.000)
) AS v(plu, name, unit_cost, ht, color, dia)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- CHAIN LINK — TOP RAIL (PLU 241-280)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, diameter_in, length_ft, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'Chain Link', v.color, v.dia, v.len, 'CAN/CGSB-138.3-2019', 'Master Halco Canada'
FROM cat, (VALUES
  ('CL-RAIL-1.25-21-GAL',  'Top Rail 1.25in OD x 21ft Galvanized',        'each', 22.00, 'Galvanized', 1.25, 21.0),
  ('CL-RAIL-1.25-21-GRN',  'Top Rail 1.25in OD x 21ft Green',             'each', 26.00, 'Green',      1.25, 21.0),
  ('CL-RAIL-1.25-21-BLK',  'Top Rail 1.25in OD x 21ft Black',             'each', 27.50, 'Black',      1.25, 21.0),
  ('CL-RAIL-1.5-21-GAL',   'Top Rail 1.5in OD x 21ft Galvanized',         'each', 28.00, 'Galvanized', 1.50, 21.0),
  ('CL-RAIL-1.5-21-BLK',   'Top Rail 1.5in OD x 21ft Black',              'each', 33.00, 'Black',      1.50, 21.0),
  ('CL-RAIL-1.625-21-GAL', 'Top Rail 1.625in OD x 21ft Galvanized',       'each', 31.00, 'Galvanized', 1.625,21.0),
  ('CL-RAIL-1.875-21-GAL', 'Top Rail 1.875in OD x 21ft Galvanized',       'each', 39.00, 'Galvanized', 1.875,21.0),
  ('CL-RAIL-COUPLER-GAL',  'Top Rail Coupler Galvanized',                  'each',  2.50, 'Galvanized', 1.25,  0.0),
  ('CL-RAIL-COUPLER-BLK',  'Top Rail Coupler Black',                       'each',  3.00, 'Black',      1.25,  0.0),
  ('CL-RAIL-ENDCAP-GAL',   'Top Rail End Cap Galvanized',                  'each',  1.50, 'Galvanized', 1.25,  0.0),
  ('CL-RAIL-ENDCAP-BLK',   'Top Rail End Cap Black',                       'each',  1.80, 'Black',      1.25,  0.0)
) AS v(plu, name, unit, unit_cost, color, dia, len)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- CHAIN LINK — TENSION BANDS, BARS, TIE WIRE (PLU 281-360)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'Chain Link', v.color, 'CAN/CGSB-138.3-2019 / CSA G40.8', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('CL-TBAND-1.5-GAL',    'Tension Band 1.5in Galvanized',         'each',  0.85, 'Galvanized'),
  ('CL-TBAND-1.875-GAL',  'Tension Band 1.875in Galvanized',       'each',  0.95, 'Galvanized'),
  ('CL-TBAND-2.375-GAL',  'Tension Band 2.375in Galvanized',       'each',  1.20, 'Galvanized'),
  ('CL-TBAND-2.875-GAL',  'Tension Band 2.875in Galvanized',       'each',  1.50, 'Galvanized'),
  ('CL-TBAND-1.875-BLK',  'Tension Band 1.875in Black',            'each',  1.10, 'Black'),
  ('CL-TBAND-2.375-BLK',  'Tension Band 2.375in Black',            'each',  1.40, 'Black'),
  ('CL-TBAR-3-GAL',       'Tension Bar 3ft Galvanized',            'each',  4.50, 'Galvanized'),
  ('CL-TBAR-4-GAL',       'Tension Bar 4ft Galvanized',            'each',  5.50, 'Galvanized'),
  ('CL-TBAR-5-GAL',       'Tension Bar 5ft Galvanized',            'each',  6.50, 'Galvanized'),
  ('CL-TBAR-6-GAL',       'Tension Bar 6ft Galvanized',            'each',  7.50, 'Galvanized'),
  ('CL-TBAR-8-GAL',       'Tension Bar 8ft Galvanized',            'each',  9.50, 'Galvanized'),
  ('CL-TBAR-10-GAL',      'Tension Bar 10ft Galvanized',           'each', 11.50, 'Galvanized'),
  ('CL-TBAR-3-BLK',       'Tension Bar 3ft Black',                 'each',  5.50, 'Black'),
  ('CL-TBAR-4-BLK',       'Tension Bar 4ft Black',                 'each',  6.50, 'Black'),
  ('CL-TBAR-5-BLK',       'Tension Bar 5ft Black',                 'each',  7.50, 'Black'),
  ('CL-TBAR-6-BLK',       'Tension Bar 6ft Black',                 'each',  8.75, 'Black'),
  ('CL-TWIRE-9GA-GAL',    'Tie Wire 9GA Galvanized (per lb)',       'lb',    2.80, 'Galvanized'),
  ('CL-TWIRE-9GA-BLK',    'Tie Wire 9GA Black Vinyl-Coated (per lb)','lb',  3.40, 'Black'),
  ('CL-TWIRE-11GA-GAL',   'Tie Wire 11GA Galvanized (per lb)',      'lb',    2.50, 'Galvanized'),
  ('CL-BWIRE-9GA-GAL',    'Barbed Wire 9GA Galvanized (per roll 200ft)', 'roll', 48.00, 'Galvanized'),
  ('CL-BWIRE-9GA-BLK',    'Barbed Wire 9GA Black Vinyl-Coated',    'roll', 58.00, 'Black'),
  ('CL-PCAP-1.5-GAL',     'Post Cap 1.5in Galvanized Slip-On',     'each',  1.20, 'Galvanized'),
  ('CL-PCAP-1.875-GAL',   'Post Cap 1.875in Galvanized Slip-On',   'each',  1.40, 'Galvanized'),
  ('CL-PCAP-2.375-GAL',   'Post Cap 2.375in Galvanized Slip-On',   'each',  1.75, 'Galvanized'),
  ('CL-PCAP-2.875-GAL',   'Post Cap 2.875in Galvanized Slip-On',   'each',  2.20, 'Galvanized'),
  ('CL-PCAP-4-GAL',       'Post Cap 4in Galvanized Slip-On',       'each',  3.00, 'Galvanized'),
  ('CL-PCAP-1.875-BLK',   'Post Cap 1.875in Black',                'each',  1.65, 'Black'),
  ('CL-PCAP-2.375-BLK',   'Post Cap 2.375in Black',                'each',  2.00, 'Black'),
  ('CL-PSLEEVE-1.5',      'Post Sleeve 1.5in Concrete Mounting',   'each',  5.50, 'Galvanized'),
  ('CL-PSLEEVE-1.875',    'Post Sleeve 1.875in Concrete Mounting', 'each',  7.00, 'Galvanized'),
  ('CL-PSLEEVE-2.375',    'Post Sleeve 2.375in Concrete Mounting', 'each',  9.00, 'Galvanized'),
  ('CL-RAILCUP-1.25-GAL', 'Rail Cup / Loop Cap 1.25in Galvanized', 'each',  2.20, 'Galvanized'),
  ('CL-RAILCUP-1.25-BLK', 'Rail Cup / Loop Cap 1.25in Black',      'each',  2.60, 'Black'),
  ('CL-BRACE-1.875-GAL',  'Brace Band 1.875in Galvanized',         'each',  1.05, 'Galvanized'),
  ('CL-BRACE-2.375-GAL',  'Brace Band 2.375in Galvanized',         'each',  1.30, 'Galvanized'),
  ('CL-BRACE-1.875-BLK',  'Brace Band 1.875in Black',              'each',  1.25, 'Black'),
  ('CL-HOGRING-9GA',      'Hog Rings 9GA (per box 100)',            'box',   8.50, 'Galvanized')
) AS v(plu, name, unit, unit_cost, color)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- CHAIN LINK — GATES (PLU 361-420)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'GATES')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, 'each', v.unit_cost, 'Chain Link', v.color, 'CAN/CGSB-138.3-2019', 'Master Halco Canada'
FROM cat, (VALUES
  ('CL-GATE-3X4-GAL',   'Chain Link Swing Gate 3ft x 4ft Galvanized',     180.00, 'Galvanized'),
  ('CL-GATE-4X4-GAL',   'Chain Link Swing Gate 4ft x 4ft Galvanized',     220.00, 'Galvanized'),
  ('CL-GATE-4X5-GAL',   'Chain Link Swing Gate 4ft x 5ft Galvanized',     248.00, 'Galvanized'),
  ('CL-GATE-4X6-GAL',   'Chain Link Swing Gate 4ft x 6ft Galvanized',     275.00, 'Galvanized'),
  ('CL-GATE-5X4-GAL',   'Chain Link Swing Gate 5ft x 4ft Galvanized',     240.00, 'Galvanized'),
  ('CL-GATE-6X4-GAL',   'Chain Link Swing Gate 6ft x 4ft Galvanized',     295.00, 'Galvanized'),
  ('CL-GATE-6X6-GAL',   'Chain Link Swing Gate 6ft x 6ft Galvanized',     340.00, 'Galvanized'),
  ('CL-GATE-8X4-GAL',   'Chain Link Swing Gate 8ft x 4ft Galvanized',     360.00, 'Galvanized'),
  ('CL-GATE-10X4-GAL',  'Chain Link Swing Gate 10ft x 4ft Galvanized',    430.00, 'Galvanized'),
  ('CL-GATE-12X4-GAL',  'Chain Link Swing Gate 12ft x 4ft Galvanized',    510.00, 'Galvanized'),
  ('CL-GATE-3X4-BLK',   'Chain Link Swing Gate 3ft x 4ft Black',          210.00, 'Black'),
  ('CL-GATE-4X4-BLK',   'Chain Link Swing Gate 4ft x 4ft Black',          255.00, 'Black'),
  ('CL-GATE-4X5-BLK',   'Chain Link Swing Gate 4ft x 5ft Black',          288.00, 'Black'),
  ('CL-GATE-4X6-BLK',   'Chain Link Swing Gate 4ft x 6ft Black',          320.00, 'Black'),
  ('CL-GATE-6X6-BLK',   'Chain Link Swing Gate 6ft x 6ft Black',          395.00, 'Black'),
  ('CL-GATE-DBL-8X4-GAL','Chain Link Double Gate 8ft x 4ft Galvanized',   520.00, 'Galvanized'),
  ('CL-GATE-DBL-10X4-GAL','Chain Link Double Gate 10ft x 4ft Galvanized', 620.00, 'Galvanized'),
  ('CL-GATE-DBL-12X4-GAL','Chain Link Double Gate 12ft x 4ft Galvanized', 720.00, 'Galvanized'),
  ('CL-GATE-DBL-16X4-GAL','Chain Link Double Gate 16ft x 4ft Galvanized', 920.00, 'Galvanized'),
  ('CL-GATE-HINGE-STD',  'Gate Hinge Standard Chain Link',                  8.50, 'Galvanized'),
  ('CL-GATE-HINGE-HVY',  'Gate Hinge Heavy-Duty Chain Link',               14.00, 'Galvanized'),
  ('CL-GATE-LATCH-STD',  'Gate Latch Standard Gravity Type',               12.00, 'Galvanized'),
  ('CL-GATE-LATCH-HVY',  'Gate Latch Heavy-Duty with Padlock Eye',         18.00, 'Galvanized'),
  ('CL-GATE-CHAIN',      'Gate Safety Chain',                                5.50, 'Galvanized'),
  ('CL-GATE-FORK-LATCH', 'Gate Fork Latch w/ Slide',                       22.00, 'Galvanized'),
  ('CL-GATE-CANE-BOLT',  'Gate Cane Bolt (for double gates)',               28.00, 'Galvanized')
) AS v(plu, name, unit_cost, color)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- VINYL / PVC — HOMELAND VINYL PRODUCTS (PLU 421-550)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'VINYL-PVC')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, supplier_sku, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'Vinyl', v.color, v.ssku, 'Homeland Vinyl Products'
FROM cat, (VALUES
  ('HVP-POST-4X4-8-WHT',  'Vinyl Post 4x4 x 8ft White',                  'each',  45.00, 'White', 'HVP-4x4-8-W'),
  ('HVP-POST-4X4-8-TAN',  'Vinyl Post 4x4 x 8ft Tan/Almond',             'each',  45.00, 'Tan',   'HVP-4x4-8-T'),
  ('HVP-POST-4X4-8-GRY',  'Vinyl Post 4x4 x 8ft Gray',                   'each',  45.00, 'Gray',  'HVP-4x4-8-G'),
  ('HVP-POST-4X4-8-BRN',  'Vinyl Post 4x4 x 8ft Brown',                  'each',  45.00, 'Brown', 'HVP-4x4-8-B'),
  ('HVP-POST-4X4-10-WHT', 'Vinyl Post 4x4 x 10ft White',                 'each',  56.00, 'White', 'HVP-4x4-10-W'),
  ('HVP-POST-5X5-10-WHT', 'Vinyl Post 5x5 x 10ft White (Heavy-Duty)',    'each',  78.00, 'White', 'HVP-5x5-10-W'),
  ('HVP-POST-6X6-10-WHT', 'Vinyl Post 6x6 x 10ft White (Commercial)',    'each', 110.00, 'White', 'HVP-6x6-10-W'),
  ('HVP-CAP-4X4-WHT',     'Vinyl Post Cap 4x4 White',                    'each',   4.50, 'White', 'HVP-CAP-4x4-W'),
  ('HVP-CAP-4X4-TAN',     'Vinyl Post Cap 4x4 Tan',                      'each',   4.50, 'Tan',   'HVP-CAP-4x4-T'),
  ('HVP-CAP-5X5-WHT',     'Vinyl Post Cap 5x5 White',                    'each',   6.00, 'White', 'HVP-CAP-5x5-W'),
  ('HVP-SLEEVE-4X4',      'Vinyl Post Sleeve 4x4 Concrete Adapter',      'each',   8.00, 'White', 'HVP-SLEEVE-4x4'),
  ('HVP-RAIL-2X4-8-WHT',  'Vinyl Rail 2x4 x 8ft White',                  'each',  18.00, 'White', 'HVP-2x4-8-W'),
  ('HVP-RAIL-2X4-8-TAN',  'Vinyl Rail 2x4 x 8ft Tan',                    'each',  18.00, 'Tan',   'HVP-2x4-8-T'),
  ('HVP-RAIL-2X4-8-GRY',  'Vinyl Rail 2x4 x 8ft Gray',                   'each',  18.00, 'Gray',  'HVP-2x4-8-G'),
  ('HVP-RAIL-2X4-8-BRN',  'Vinyl Rail 2x4 x 8ft Brown',                  'each',  18.00, 'Brown', 'HVP-2x4-8-B'),
  ('HVP-RAIL-2X6-8-WHT',  'Vinyl Rail 2x6 x 8ft White (Heavy)',          'each',  24.00, 'White', 'HVP-2x6-8-W'),
  ('HVP-BRACKET-SS-2.5',  'Vinyl Stainless Bracket 2.5in (post-to-rail)','each',   3.20, 'S/S',   'HVP-BRACKET-SS-2.5'),
  ('HVP-BOARD-PRI-60-WHT','Vinyl Privacy Board 5.625in x 60in White',    'each',   6.50, 'White', 'HVP-BOARD-PRIVACY-60-W'),
  ('HVP-BOARD-PRI-60-TAN','Vinyl Privacy Board 5.625in x 60in Tan',      'each',   6.50, 'Tan',   'HVP-BOARD-PRIVACY-60-T'),
  ('HVP-BOARD-PRI-60-GRY','Vinyl Privacy Board 5.625in x 60in Gray',     'each',   6.50, 'Gray',  'HVP-BOARD-PRIVACY-60-G'),
  ('HVP-BOARD-PRI-60-BRN','Vinyl Privacy Board 5.625in x 60in Brown',    'each',   6.50, 'Brown', 'HVP-BOARD-PRIVACY-60-B'),
  ('HVP-BOARD-SEMI-60-WHT','Vinyl Semi-Privacy Board 5.625in x 60in White','each', 6.50, 'White', 'HVP-BOARD-SEMI-60-W'),
  ('HVP-BOARD-PIC-60-WHT','Vinyl Picket Board 3.5in x 60in White',       'each',   4.80, 'White', 'HVP-BOARD-PICKET-60-W'),
  ('HVP-BOARD-PIC-60-TAN','Vinyl Picket Board 3.5in x 60in Tan',         'each',   4.80, 'Tan',   'HVP-BOARD-PICKET-60-T'),
  ('HVP-GATE-4X5-WHT',    'Vinyl Gate 4ft x 5ft White Privacy',          'each', 385.00, 'White', 'HVP-GATE-4x5-W'),
  ('HVP-GATE-4X5-TAN',    'Vinyl Gate 4ft x 5ft Tan Privacy',            'each', 385.00, 'Tan',   'HVP-GATE-4x5-T'),
  ('HVP-GATE-5X5-WHT',    'Vinyl Gate 5ft x 5ft White Privacy',          'each', 430.00, 'White', 'HVP-GATE-5x5-W'),
  ('HVP-GATE-6X5-WHT',    'Vinyl Gate 6ft x 5ft White Privacy',          'each', 490.00, 'White', 'HVP-GATE-6x5-W'),
  ('HVP-GATE-DBL-8X5-WHT','Vinyl Double Gate 8ft x 5ft White',           'each', 720.00, 'White', 'HVP-GATE-DBL-8x5-W'),
  ('HVP-HINGE-SS',        'Vinyl Gate Hinge S/S Adjustable',             'each',  18.00, 'S/S',   'HVP-HINGE-SS-ADJ'),
  ('HVP-LATCH-AUTO',      'Vinyl Gate Latch Auto-Close',                 'each',  24.00, 'White', 'HVP-LATCH-AUTO'),
  ('HVP-HANDLE-SS',       'Vinyl Gate Handle Stainless Steel',           'each',  16.00, 'S/S',   'HVP-HANDLE-SS'),
  ('HVP-BOLT-SS-3/4X3',   'Vinyl S/S Bolt 3/4in x 3in',                 'each',   0.85, 'S/S',   'HVP-BOLT-SS-3/4x3'),
  ('HVP-SCREW-SS-3.5',    'Vinyl S/S Screw 3.5in',                       'each',   0.45, 'S/S',   'HVP-SCREW-SS-3.5'),
  ('HVP-PLUG-VINYL',      'Vinyl Screw Cover Plug',                      'each',   0.18, 'White', 'HVP-PLUG-VINYL'),
  ('HVP-NUT-SS-3/4',      'Vinyl S/S Nut 3/4in',                         'each',   0.40, 'S/S',   'HVP-NUT-SS-3/4'),
  ('HVP-WASHER-SS-3/4',   'Vinyl S/S Washer 3/4in',                      'each',   0.35, 'S/S',   'HVP-WASHER-SS-3/4')
) AS v(plu, name, unit, unit_cost, color, ssku)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- WOOD FENCING — CSA O141 (PLU 551-680)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'WOOD')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'Wood', 'Natural', 'CSA O141 Grade #2', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('WD-POST-4X4-8-PT',   'Wood Post 4x4 x 8ft Pressure-Treated',      'each',  18.50),
  ('WD-POST-4X4-10-PT',  'Wood Post 4x4 x 10ft Pressure-Treated',     'each',  23.00),
  ('WD-POST-6X6-8-PT',   'Wood Post 6x6 x 8ft Pressure-Treated',      'each',  38.00),
  ('WD-POST-6X6-10-PT',  'Wood Post 6x6 x 10ft Pressure-Treated',     'each',  47.00),
  ('WD-POST-4X4-8-CED',  'Wood Post 4x4 x 8ft Cedar (Premium)',       'each',  32.00),
  ('WD-POST-6X6-8-CED',  'Wood Post 6x6 x 8ft Cedar (Premium)',       'each',  62.00),
  ('WD-RAIL-2X4-8-PT',   'Wood Rail 2x4 x 8ft Pressure-Treated',     'each',   7.50),
  ('WD-RAIL-2X6-8-PT',   'Wood Rail 2x6 x 8ft Pressure-Treated',     'each',  10.50),
  ('WD-RAIL-2X4-8-CED',  'Wood Rail 2x4 x 8ft Cedar',                'each',  14.00),
  ('WD-RAIL-2X6-8-CED',  'Wood Rail 2x6 x 8ft Cedar',                'each',  19.00),
  ('WD-BOARD-1X5.625-60-PT','Wood Privacy Board 1x5.625in x 60in PT','each',   5.50),
  ('WD-BOARD-1X5.625-60-CED','Wood Privacy Board 1x5.625in x 60in Cedar','each',10.00),
  ('WD-BOARD-1X3.5-60-PT','Wood Picket Board 1x3.5in x 60in PT',    'each',   3.50),
  ('WD-BOARD-1X3.5-60-CED','Wood Picket Board 1x3.5in x 60in Cedar','each',   6.50),
  ('WD-PCAP-4X4',        'Wood Post Cap 4x4 Decorative',             'each',   6.00),
  ('WD-PCAP-6X6',        'Wood Post Cap 6x6 Decorative',             'each',   9.00),
  ('WD-GATE-3X5-PT',     'Wood Swing Gate 3ft x 5ft PT',             'each', 220.00),
  ('WD-GATE-4X5-PT',     'Wood Swing Gate 4ft x 5ft PT',             'each', 265.00),
  ('WD-GATE-5X5-PT',     'Wood Swing Gate 5ft x 5ft PT',             'each', 310.00),
  ('WD-GATE-6X5-PT',     'Wood Swing Gate 6ft x 5ft PT',             'each', 360.00),
  ('WD-GATE-DBL-8X5-PT', 'Wood Double Gate 8ft x 5ft PT',           'each', 560.00),
  ('WD-GATE-DBL-10X5-PT','Wood Double Gate 10ft x 5ft PT',          'each', 680.00),
  ('WD-HINGE-4IN-GAL',   'Wood Gate Hinge 4in Galvanized',          'each',  12.00),
  ('WD-HINGE-6IN-GAL',   'Wood Gate Hinge 6in Galvanized',          'each',  18.00),
  ('WD-LATCH-GAL',       'Wood Gate Latch Galvanized',               'each',  14.00),
  ('WD-LATCH-SELF-CLOSE','Wood Gate Latch Self-Closing',             'each',  28.00),
  ('WD-SCREW-3.5-SS',    'Deck Screw 3.5in SS Coated (per lb)',     'lb',     8.50),
  ('WD-NAIL-2.5-GAL',    'Galvanized Nail 2.5in Ring Shank (per lb)','lb',   5.50),
  ('WD-LAGBOLT-0.75X4',  'Lag Bolt 3/4in x 4in Galvanized',        'each',   1.40),
  ('WD-BOLT-0.75X4',     'Carriage Bolt 3/4in x 4in Galvanized',   'each',   1.20),
  ('WD-WASHER-0.75',     'Washer 3/4in Galvanized',                  'each',   0.25),
  ('WD-NUT-0.75',        'Nut 3/4in Galvanized',                     'each',   0.30),
  ('WD-STAIN-5GAL',      'Wood Stain/Sealer 5 Gallon (Exterior)',   'pail',  95.00),
  ('WD-PAINT-5GAL',      'Wood Exterior Paint 5 Gallon',            'pail',  88.00),
  ('WD-DIAG-BRACE-KIT',  'Wood Gate Diagonal Brace Kit',            'each',  22.00)
) AS v(plu, name, unit, unit_cost)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- WROUGHT IRON — CLOUTIER DIRECT (PLU 681-760)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'WROUGHT-IRON')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, supplier_sku, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'Wrought Iron', v.ssku, 'Cloutier Direct'
FROM cat, (VALUES
  ('CD-POST-1.5-6.5',      'Cloutier Wrought Iron Post 1.5sq x 6.5ft',     'each',  95.00, 'CD-POST-1.5-6.5'),
  ('CD-POST-1.75-6.5',     'Cloutier Wrought Iron Terminal Post 1.75sq x 6.5ft','each',115.00,'CD-POST-1.75-6.5'),
  ('CD-POST-2-6.5',        'Cloutier Wrought Iron Gate Post 2sq x 6.5ft',  'each', 145.00, 'CD-POST-2-6.5'),
  ('CD-POST-1.5-9',        'Cloutier Wrought Iron Post 1.5sq x 9ft (6ft fence)','each',125.00,'CD-POST-1.5-9'),
  ('CD-CAP-SPEAR',         'Cloutier Decorative Finial Cap Spear-Point',   'each',   9.50, 'CD-CAP-SPEAR'),
  ('CD-CAP-BALL',          'Cloutier Decorative Cap Ball-Top',             'each',  11.00, 'CD-CAP-BALL'),
  ('CD-CAP-FLEUR',         'Cloutier Decorative Cap Fleur-de-Lis',        'each',  16.00, 'CD-CAP-FLEUR'),
  ('CD-SLEEVE-1.5',        'Cloutier Post Concrete Sleeve 1.5in',         'each',   8.50, 'CD-SLEEVE-1.5'),
  ('CD-RAIL-0.75SQ-8',     'Cloutier Rail 0.75sq Tube x 8ft',             'each',  24.00, 'CD-RAIL-0.75-SQ'),
  ('CD-PICKET-SPEAR-36',   'Cloutier Picket Spear-Point 0.75sq x 36in',   'each',   8.50, 'CD-PICKET-SPEAR-36'),
  ('CD-PICKET-SPEAR-48',   'Cloutier Picket Spear-Point 0.75sq x 48in',   'each',  10.50, 'CD-PICKET-SPEAR-48'),
  ('CD-PICKET-SPEAR-60',   'Cloutier Picket Spear-Point 0.75sq x 60in',   'each',  12.50, 'CD-PICKET-SPEAR-60'),
  ('CD-PICKET-BALL-48',    'Cloutier Picket Ball-Top 0.75sq x 48in',      'each',  11.00, 'CD-PICKET-BALL-48'),
  ('CD-PICKET-FLAT-48',    'Cloutier Picket Flat-Top 0.75sq x 48in',      'each',   9.50, 'CD-PICKET-FLAT-48'),
  ('CD-SCROLL-STD',        'Cloutier Scroll Work Ornamental Standard',    'each',  28.00, 'CD-SCROLL-STD'),
  ('CD-SCROLL-LRG',        'Cloutier Scroll Work Ornamental Large',       'each',  42.00, 'CD-SCROLL-LRG'),
  ('CD-GATE-4X4-SPEAR',    'Cloutier Gate 4ft x 4ft Spear-Top',          'each', 620.00, 'CD-GATE-FRAME-4x4'),
  ('CD-GATE-4X5-SPEAR',    'Cloutier Gate 4ft x 5ft Spear-Top',          'each', 720.00, 'CD-GATE-FRAME-4x5'),
  ('CD-GATE-5X5-SPEAR',    'Cloutier Gate 5ft x 5ft Spear-Top',          'each', 820.00, 'CD-GATE-FRAME-5x5'),
  ('CD-GATE-DBL-8X4',      'Cloutier Double Gate 8ft x 4ft Ornamental',  'each',1200.00, 'CD-GATE-DBL-8x4'),
  ('CD-GATE-DBL-10X5',     'Cloutier Double Gate 10ft x 5ft Ornamental','each', 1550.00, 'CD-GATE-DBL-10x5'),
  ('CD-HINGE-3-ORN',       'Cloutier Ornamental Hinge 3in Adjustable',   'each',  28.00, 'CD-HINGE-3-ORN'),
  ('CD-HINGE-4-ORN',       'Cloutier Ornamental Hinge 4in Heavy-Duty',   'each',  38.00, 'CD-HINGE-4-ORN'),
  ('CD-LATCH-ORN',         'Cloutier Ornamental Gate Latch',              'each',  42.00, 'CD-LATCH-ORN'),
  ('CD-BOLT-LAG-0.5X3',    'Cloutier Lag Bolt 0.5in x 3in Galvanized',   'each',   1.20, 'CD-BOLT-LAG-1/2x3'),
  ('CD-ANCHOR-0.5',        'Cloutier Concrete Anchor 0.5in',             'each',   2.80, 'CD-ANCHOR-1/2'),
  ('CD-BRACKET-WELD',      'Cloutier Weld-On Bracket Galvanized',        'each',   5.50, 'CD-BRACKET-WELD'),
  ('CD-PRIMER-EPOXY-1GAL', 'Epoxy Rust-Preventative Primer 1 Gallon',   'gallon', 48.00, 'CD-PRIMER-EPX'),
  ('CD-PAINT-BLACK-1GAL',  'Exterior Wrought Iron Paint Black 1 Gallon', 'gallon', 38.00, 'CD-PAINT-BLK'),
  ('CD-PAINT-BRONZE-1GAL', 'Exterior Wrought Iron Paint Bronze 1 Gallon','gallon', 38.00, 'CD-PAINT-BRZ'),
  ('CD-TOUCHUP-BLACK',     'Wrought Iron Touch-Up Spray Can Black',       'can',   12.00, 'CD-TOUCHUP-BLK'),
  ('CD-CLEARCOAT-1GAL',    'Wrought Iron Clear Coat UV 1 Gallon',        'gallon', 42.00, 'CD-CLEARCOAT')
) AS v(plu, name, unit, unit_cost, ssku)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- GUIDE RAIL — OPSD 02.16.04 (PLU 761-820)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'GUIDE-RAIL')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'Guide Rail', 'OPSD 02.16.04', 'Provincial Supply OPSD'
FROM cat, (VALUES
  ('GR-POST-W6X9',        'Guide Rail Steel Post W6x9 (OPSD 20ft spacing)','each', 280.00),
  ('GR-POST-TERMINAL',    'Guide Rail End Post Terminal Energy-Absorbing',  'each', 750.00),
  ('GR-POST-TRANSITION',  'Guide Rail Transition Post Height Change',       'each', 420.00),
  ('GR-POST-GROUND',      'Guide Rail Ground-Level Support Post',           'each', 185.00),
  ('GR-RAIL-WBEAM-20',    'W-Beam Rail W10x49 x 20ft OPSD',                'each', 380.00),
  ('GR-RAIL-WBEAM-12',    'W-Beam Rail W10x49 x 12ft OPSD (short span)',   'each', 230.00),
  ('GR-BACKUP-0.5',       'Guide Rail Back-Up Plate 0.5in Steel',           'each',  68.00),
  ('GR-BOLT-1X5-GR5',     'Guide Rail Bolt 1in x 5in Grade 5 OPSD',        'each',   4.50),
  ('GR-WASHER-1-HARD',    'Guide Rail Washer 1in Hardened OPSD',            'each',   1.20),
  ('GR-NUT-1-LOCK',       'Guide Rail Lock Nut 1in Grade 5 OPSD',          'each',   1.80),
  ('GR-COTTER-SAFETY',    'Guide Rail Cotter Pin Safety OPSD',              'each',   0.65),
  ('GR-REFLECTOR-YLW',    'Guide Rail Reflector Yellow OPSD',               'each',   8.50),
  ('GR-REFLECTOR-WHT',    'Guide Rail Reflector White OPSD',                'each',   8.50),
  ('GR-PAINT-HIVIZ-1GAL', 'Guide Rail High-Visibility Paint 1 Gallon OPSD','gallon', 52.00),
  ('GR-GALV-COAT-QT',     'Guide Rail Galvanized Touch-Up Coating Quart',  'quart',  28.00),
  ('GR-REBAR-4-20',       'Rebar #4 Diameter x 20ft OPSD',                 'each',  32.00),
  ('GR-END-TREAT-ABSORB', 'Guide Rail End Treatment Energy-Absorbing Sys', 'each',2200.00)
) AS v(plu, name, unit, unit_cost)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- CONCRETE & FOOTINGS (PLU 821-870)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CONCRETE')
INSERT INTO products (plu, category_id, name, unit, unit_cost, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'CSA A3000', v.sup
FROM cat, (VALUES
  ('CON-READYMIX-20MPA',  'Ready-Mix Concrete 20 MPa (CSA A3000 min)',  'cy',   185.00, 'Local Certified'),
  ('CON-READYMIX-25MPA',  'Ready-Mix Concrete 25 MPa (CSA A3000)',      'cy',   200.00, 'Local Certified'),
  ('CON-READYMIX-30MPA',  'Ready-Mix Concrete 30 MPa (OPSD/WI)',        'cy',   218.00, 'Local Certified'),
  ('CON-BAGGED-30KG',     'Bagged Concrete Mix 30kg (approx 0.015 CY)','bag',     8.50, 'Local Building'),
  ('CON-BAGGED-30KG-QST', 'Bagged Quick-Set Concrete Mix 30kg',         'bag',    12.00, 'Local Building'),
  ('CON-STONE-DUST-TON',  'Stone Dust/Crusher Dust per Tonne',          'tonne',  45.00, 'Local Aggregate'),
  ('CON-GRAVEL-TON',      'Gravel Drainage Layer per Tonne',            'tonne',  40.00, 'Local Aggregate'),
  ('CON-EPOXY-PT',        'Concrete Epoxy Bonding Agent Pint',          'pint',   22.00, 'Local Building'),
  ('CON-ANCHOR-0.5',      'Concrete Expansion Anchor 0.5in',            'each',    2.40, 'Local Building'),
  ('CON-ANCHOR-0.75',     'Concrete Expansion Anchor 0.75in',           'each',    3.60, 'Local Building'),
  ('CON-DRILL-RENTAL',    'Rotary Hammer Drill Rental (day)',            'day',    65.00, 'Equipment Rental'),
  ('CON-POSTHOLE-DIG',    'Post Hole Digger Auger Rental (day)',         'day',    85.00, 'Equipment Rental'),
  ('CON-MIXER-RENTAL',    'Concrete Mixer Rental (day)',                 'day',    95.00, 'Equipment Rental'),
  ('CON-VIBRATOR-RENTAL', 'Concrete Vibrator Rental (day)',              'day',    55.00, 'Equipment Rental'),
  ('CON-WATERPROOF-QT',   'Concrete Waterproofing Sealer Quart',        'quart',  18.00, 'Local Building'),
  ('CON-RELEASE-GAL',     'Concrete Form Release Agent 1 Gallon',       'gallon', 24.00, 'Local Building')
) AS v(plu, name, unit, unit_cost, sup)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- FASTENERS — CSA G40.8 (PLU 871-940)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'FASTENERS')
INSERT INTO products (plu, category_id, name, unit, unit_cost, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'CSA G40.8', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('FST-LAGBOLT-0.5X3-GAL',  'Lag Bolt 0.5in x 3in Galvanized (each)',    'each',  0.65),
  ('FST-LAGBOLT-0.5X4-GAL',  'Lag Bolt 0.5in x 4in Galvanized (each)',    'each',  0.75),
  ('FST-LAGBOLT-0.75X3-GAL', 'Lag Bolt 0.75in x 3in Galvanized (each)',   'each',  0.90),
  ('FST-LAGBOLT-0.75X4-GAL', 'Lag Bolt 0.75in x 4in Galvanized (each)',   'each',  1.10),
  ('FST-CARBOLT-0.5X2-GAL',  'Carriage Bolt 0.5in x 2in Galvanized',      'each',  0.55),
  ('FST-CARBOLT-0.5X3-GAL',  'Carriage Bolt 0.5in x 3in Galvanized',      'each',  0.65),
  ('FST-CARBOLT-0.75X3-GAL', 'Carriage Bolt 0.75in x 3in Galvanized',     'each',  0.80),
  ('FST-CARBOLT-0.75X4-GAL', 'Carriage Bolt 0.75in x 4in Galvanized',     'each',  0.95),
  ('FST-CARBOLT-1X5-GR5',    'Carriage Bolt 1in x 5in Grade 5 (OPSD)',    'each',  2.80),
  ('FST-NUT-0.5-GAL',        'Hex Nut 0.5in Galvanized',                   'each',  0.18),
  ('FST-NUT-0.75-GAL',       'Hex Nut 0.75in Galvanized',                  'each',  0.28),
  ('FST-NUT-1-LOCK',         'Lock Nut 1in Grade 5',                       'each',  0.85),
  ('FST-WASHER-0.5-GAL',     'Flat Washer 0.5in Galvanized',               'each',  0.12),
  ('FST-WASHER-0.75-GAL',    'Flat Washer 0.75in Galvanized',              'each',  0.18),
  ('FST-WASHER-1-HARD',      'Hardened Washer 1in OPSD',                   'each',  0.55),
  ('FST-SCREW-2.5-GAL',      'Galvanized Screw 2.5in (per lb ~200)',       'lb',    6.50),
  ('FST-NAIL-2-GAL',         'Galvanized Nail 2in (per lb)',               'lb',    4.20),
  ('FST-NAIL-3.5-GAL',       'Galvanized Nail 3.5in Ring Shank (per lb)', 'lb',    5.00),
  ('FST-COTTER-0.1875X2',    'Cotter Pin 3/16in x 2in Galvanized',        'each',  0.30),
  ('FST-POSTBASE-BOLT',      'Post Base Plate Bolt Kit (4 bolts, nuts, washers)','set', 8.50),
  ('FST-ANCHOR-SET',         'Expansion Anchor Set 4-Pack for Post Base', 'set',  12.00),
  ('FST-POSTBASE-PLATE',     'Post Base Plate Heavy-Duty L-Bracket',      'each',  14.00)
) AS v(plu, name, unit, unit_cost)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- LABOUR RATES (PLU 941-970)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'LABOUR')
INSERT INTO products (plu, category_id, name, unit, unit_cost, markup_pct, canadian_std, description)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 0.00, 'Canadian Labour Standards', v.desc
FROM cat, (VALUES
  ('LAB-INST-STD',     'Labour Installation Standard Rate',         'hour',  30.00, 'Standard crew installation per hour - 2-person crew'),
  ('LAB-INST-PREM',    'Labour Installation Premium Rate',          'hour',  42.00, 'Premium/specialized installation per hour'),
  ('LAB-INST-OVERTIME','Labour Installation Overtime Rate',         'hour',  45.00, 'Overtime rate (after 8 hrs or weekend)'),
  ('LAB-SUP-STD',      'Labour Supervisor Standard Rate',           'hour',  52.00, 'Crew supervisor - site management'),
  ('LAB-DEMO-STD',     'Labour Demolition/Removal Standard',        'hour',  28.00, 'Existing fence removal'),
  ('LAB-CONC-STD',     'Labour Concrete Pour & Finish Standard',    'hour',  35.00, 'Concrete placement and finishing'),
  ('LAB-WELD-STD',     'Labour Welding Standard Rate',              'hour',  65.00, 'Certified welder - wrought iron/metal'),
  ('LAB-WELD-CERT',    'Labour Welding Certified Premium',          'hour',  85.00, 'CWB certified welder'),
  ('LAB-GATE-AUTO',    'Labour Automated Gate Installation',        'hour',  75.00, 'Automated gate and electrical work'),
  ('LAB-SURVEY',       'Labour Site Survey & Measurement',          'hour',  55.00, 'Professional site survey and layout'),
  ('LAB-CLEANUP',      'Labour Site Cleanup & Disposal',            'hour',  25.00, 'Post-installation cleanup'),
  ('LAB-TRAVEL-50',    'Labour Travel (within 50km)',               'trip',  45.00, 'Travel allowance up to 50km radius'),
  ('LAB-TRAVEL-100',   'Labour Travel (50-100km)',                  'trip',  90.00, 'Travel allowance 50-100km radius'),
  ('LAB-TRAVEL-150',   'Labour Travel (100-150km)',                 'trip', 145.00, 'Travel allowance 100-150km radius')
) AS v(plu, name, unit, unit_cost, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- TOOLS & EQUIPMENT (PLU 971-1010)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'TOOLS')
INSERT INTO products (plu, category_id, name, unit, unit_cost, description)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, v.desc
FROM cat, (VALUES
  ('TOOL-STRETCHER',    'Fence Fabric Stretcher Rental',          'day',  45.00, 'Come-along fence stretcher tool'),
  ('TOOL-PULLER-COME',  'Come-Along Cable Puller 2-Ton Rental',   'day',  35.00, 'Cable puller for tension'),
  ('TOOL-LEVELASER',    'Laser Level Rental',                     'day',  40.00, 'For post alignment'),
  ('TOOL-TRANSIT',      'Builders Transit/Level Rental',          'day',  65.00, 'Grade and alignment setup'),
  ('TOOL-GRINDER',      'Angle Grinder Rental',                   'day',  28.00, 'Metal cutting and grinding'),
  ('TOOL-CUTOFF',       'Cut-Off Saw Rental',                     'day',  55.00, 'Metal post cutting'),
  ('TOOL-WELDER',       'MIG Welder Rental',                      'day',  95.00, 'For wrought iron welding'),
  ('TOOL-POSTDRIVER',   'Post Driver (Hydraulic) Rental',         'day', 220.00, 'Hydraulic post driver for soil'),
  ('TOOL-POWERWASH',    'Power Washer Rental',                    'day',  65.00, 'Site cleanup and surface prep'),
  ('TOOL-TRAILER',      'Equipment Trailer Rental',               'day',  75.00, 'For transporting materials'),
  ('TOOL-WINCH',        'Electric Winch 4000lb Rental',           'day',  55.00, 'Heavy lifting'),
  ('TOOL-TRENCHER',     'Trencher Rental for Line Runs',          'day', 185.00, 'Trench for underground conduit'),
  ('TOOL-COMPACT',      'Plate Compactor Rental',                 'day',  75.00, 'Soil compaction for footings'),
  ('TOOL-SAFETY-KIT',   'Safety Equipment Kit (hard hat,vest,glasses)','set', 38.00, 'PPE for installation crew')
) AS v(plu, name, unit, unit_cost, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- FINISHING & PAINT (PLU 1011-1050)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'FINISHING')
INSERT INTO products (plu, category_id, name, unit, unit_cost, description)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, v.desc
FROM cat, (VALUES
  ('FIN-PRIMER-GALV-1',    'Galvanized Metal Primer 1 Gallon',        'gallon', 38.00, 'Adhesion primer for galvanized steel'),
  ('FIN-PRIMER-RUST-1',    'Rust Inhibiting Primer 1 Gallon',         'gallon', 42.00, 'Rust-preventative epoxy primer'),
  ('FIN-PAINT-BLK-1',      'Exterior Metal Paint Black 1 Gallon',     'gallon', 36.00, 'Oil-based exterior black paint'),
  ('FIN-PAINT-BRZ-1',      'Exterior Metal Paint Bronze 1 Gallon',    'gallon', 36.00, 'Oil-based exterior bronze paint'),
  ('FIN-PAINT-WHT-1',      'Exterior Metal Paint White 1 Gallon',     'gallon', 36.00, 'Exterior white paint'),
  ('FIN-PAINT-GRN-1',      'Exterior Metal Paint Hunter Green 1 Gallon','gallon',36.00,'Exterior hunter green paint'),
  ('FIN-SPRAY-BLK',        'Black Spray Touch-Up Paint Can 12oz',     'can',    14.00, 'Field touch-up black'),
  ('FIN-SPRAY-GAL',        'Galvanized Cold Galvanize Spray 12oz',    'can',    16.00, 'Cold galvanize for field repairs'),
  ('FIN-STAIN-CLEAR-1',    'Clear Exterior Wood Stain 1 Gallon',      'gallon', 38.00, 'Transparent UV wood stain'),
  ('FIN-STAIN-CEDAR-1',    'Cedar Tone Exterior Wood Stain 1 Gallon', 'gallon', 40.00, 'Cedar-toned wood stain'),
  ('FIN-STAIN-REDWOOD-1',  'Redwood Tone Exterior Wood Stain 1 Gallon','gallon',40.00,'Redwood-toned wood stain'),
  ('FIN-SEALER-WOOD-1',    'Wood Waterproof Sealer 1 Gallon',         'gallon', 42.00, 'Waterproof sealer for pressure-treated'),
  ('FIN-CAULK-POLY-10OZ',  'Polyurethane Caulk 10oz Tube',           'tube',   12.00, 'Weatherproof gap sealer'),
  ('FIN-TAPE-FLASH-50FT',  'Flashing Tape 4in x 50ft Roll',          'roll',   28.00, 'Moisture-control flashing tape'),
  ('FIN-SEALANT-SIL-10OZ', 'Silicone Sealant 10oz Tube',             'tube',   10.00, 'Clear silicone for PVC'),
  ('FIN-BRUSH-3IN',        'Paint Brush 3in High-Quality',            'each',   12.00, 'For primer and paint application'),
  ('FIN-ROLLER-SET',       'Roller and Tray Set 9in',                 'set',    15.00, 'For large surface painting'),
  ('FIN-TARP-10X12',       'Heavy-Duty Tarp 10ft x 12ft',            'each',   22.00, 'Drop cloth and material cover')
) AS v(plu, name, unit, unit_cost, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- MISCELLANEOUS / SITE SUPPLIES (PLU 1051-1100)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'MISC')
INSERT INTO products (plu, category_id, name, unit, unit_cost, description)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, v.desc
FROM cat, (VALUES
  ('MISC-PERMIT-RES',     'Building Permit - Residential Fence (avg)', 'each',  95.00, 'Average residential fence permit'),
  ('MISC-PERMIT-COMM',    'Building Permit - Commercial Fence (avg)',  'each', 245.00, 'Average commercial fence permit'),
  ('MISC-SURVEY-BASIC',   'Property Survey Mark-Up (basic)',           'each', 280.00, 'Locate and mark property lines'),
  ('MISC-LOCATE-UTIL',    'Underground Utility Locate (Ontario One Call)','each',0.00, 'Mandatory free service - Ontario One Call'),
  ('MISC-DISPOSE-YARD',   'Debris Disposal per Yard (pickup & dump)',  'yard',  48.00, 'Old fence material removal'),
  ('MISC-DUMPSTER-7D',    'Dumpster Bin Rental 7 Days 10CY',          'rental',285.00,'Bin for debris'),
  ('MISC-PORTAPOTTY-WK',  'Portable Toilet Rental per Week',          'week',  125.00,'Site sanitation'),
  ('MISC-DELIVERY-LOCAL', 'Material Delivery Local (within 25km)',    'each',  95.00, 'Delivery charge local area'),
  ('MISC-DELIVERY-DIST',  'Material Delivery Distance (25-100km)',    'each',  185.00,'Delivery charge distance'),
  ('MISC-PAINT-MARK',     'Paint Marking Spray Can (layout)',         'can',    9.50, 'Ground marking for post locations'),
  ('MISC-STRING-LINE',    'Mason String Line 250ft',                  'roll',   8.50, 'Alignment string line'),
  ('MISC-STAKES-12PK',    'Layout Stakes 12-Pack',                    'pack',   7.50, 'For post layout'),
  ('MISC-DEADBOLT-GATE',  'Gate Deadbolt Lock (padlock-ready)',       'each',  38.00, 'Security gate lock'),
  ('MISC-PADLOCK-SS',     'Padlock Stainless Steel 1.5in',            'each',  28.00, 'Gate security padlock'),
  ('MISC-NUMADDR-4IN',    'Address Numbers 4in (per digit)',          'each',   8.50, 'Address marking'),
  ('MISC-SIGN-PRIVATE',   'Private Property Sign',                    'each',  14.00, 'Property posting sign'),
  ('MISC-SIGN-CCTV',      'CCTV Security Warning Sign',               'each',  12.00, 'Security notice sign'),
  ('MISC-PHOTO-DOC',      'Photo Documentation Service',              'each',  45.00, 'Before/after photo set for project file')
) AS v(plu, name, unit, unit_cost, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- ADDITIONAL CHAIN LINK ACCESSORIES (PLU 1101-1200)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'Chain Link', v.color, 'CAN/CGSB-138.3-2019', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('CL-SLAT-POLY-STD-GRN', 'Chain Link Privacy Slat Polyethylene Standard Green', 'slat',  0.55, 'Green'),
  ('CL-SLAT-POLY-STD-BLK', 'Chain Link Privacy Slat Polyethylene Standard Black', 'slat',  0.55, 'Black'),
  ('CL-SLAT-POLY-STD-BRN', 'Chain Link Privacy Slat Polyethylene Standard Brown', 'slat',  0.55, 'Brown'),
  ('CL-SLAT-WOOD-GRN',     'Chain Link Privacy Slat Wood-Tone Green',             'slat',  0.75, 'Green'),
  ('CL-SLAT-ALUM-BLK',     'Chain Link Privacy Slat Aluminum Black',              'slat',  1.20, 'Black'),
  ('CL-BBWIRE-TOP',        'Barbed Wire Top Guard 3-Strand (per 100ft)',           'set',  68.00, 'Galvanized'),
  ('CL-RAZORWIRE-TOP',     'Razor Wire / Concertina Top Guard (per 30ft)',        'coil',  85.00, 'Galvanized'),
  ('CL-TOEPLATE-6IN',      'Toe Plate 6in Galvanized (anti-climb bottom)',        'each',   3.50, 'Galvanized'),
  ('CL-WINDSCREEN-5FT',    'Windscreen Privacy Fabric 5ft Green (per 10ft)',      'roll',  28.00, 'Green'),
  ('CL-WINDSCREEN-6FT',    'Windscreen Privacy Fabric 6ft Green (per 10ft)',      'roll',  33.00, 'Green'),
  ('CL-WINDSCREEN-5FT-BLK','Windscreen Privacy Fabric 5ft Black (per 10ft)',     'roll',  28.00, 'Black'),
  ('CL-DUTCHMAN-BRACKET',  'Dutchman / Deadman Anchor Bracket',                   'each',  12.00, 'Galvanized'),
  ('CL-STRETCHBAR-MID-6',  'Stretcher Bar Middle Brace 6ft',                      'each',   8.50, 'Galvanized'),
  ('CL-FENCE-STRETCHER',   'Fabric Stretcher Tool (purchase)',                    'each',  95.00, 'N/A'),
  ('CL-CRIMP-SLEEVE',      'Crimp Sleeve for Tie Wire (per 50)',                  'pack',   4.50, 'Galvanized'),
  ('CL-CONNECTOR-CLAMP',   'Post-to-Rail Clamp Connector',                        'each',   2.80, 'Galvanized'),
  ('CL-ALUM-SLEEVE-1.5',   'Aluminum Sleeve 1.5in for Post Splice',              'each',   5.50, 'Aluminum'),
  ('CL-CORNERBAND-1.875',  'Corner Band 1.875in 3-Way',                           'each',   4.20, 'Galvanized'),
  ('CL-SLIDEGATE-6X6',     'Chain Link Sliding Gate 6ft x 6ft Galvanized',       'each', 780.00, 'Galvanized'),
  ('CL-SLIDEGATE-10X6',    'Chain Link Sliding Gate 10ft x 6ft Galvanized',      'each',1050.00, 'Galvanized'),
  ('CL-SLIDEGATE-12X6',    'Chain Link Sliding Gate 12ft x 6ft Galvanized',      'each',1250.00, 'Galvanized'),
  ('CL-SLIDEGATE-16X6',    'Chain Link Sliding Gate 16ft x 6ft Galvanized',      'each',1600.00, 'Galvanized'),
  ('CL-CANTILEVER-10X6',   'Chain Link Cantilever Gate 10ft x 6ft Galvanized',   'each',1850.00, 'Galvanized'),
  ('CL-CANTILEVER-20X6',   'Chain Link Cantilever Gate 20ft x 6ft Galvanized',   'each',2800.00, 'Galvanized'),
  ('CL-GATE-OPENER-SWING', 'Automated Gate Opener Swing Style 110V',             'each', 680.00, 'N/A'),
  ('CL-GATE-OPENER-SLIDE', 'Automated Gate Opener Slide Style 110V',             'each', 920.00, 'N/A'),
  ('CL-GATE-KEYPAD',       'Keypad Entry for Automated Gate',                    'each', 185.00, 'N/A'),
  ('CL-GATE-INTERCOM',     'Intercom & Video System for Gate',                   'each', 680.00, 'N/A'),
  ('CL-GATE-LOOP',         'Vehicle Detection Loop for Automated Gate',          'each', 320.00, 'N/A'),
  ('CL-GATE-PHOTO-EYE',    'Photo Eye Safety Sensor for Automated Gate (pair)',  'pair', 145.00, 'N/A')
) AS v(plu, name, unit, unit_cost, color)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- ADDITIONAL VINYL/WOOD/WROUGHT IRON ACCESSORIES (PLU 1201-1300)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'VINYL-PVC')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, supplier_sku, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'Vinyl', v.color, v.ssku, 'Homeland Vinyl Products'
FROM cat, (VALUES
  ('HVP-LATTICE-4X8-WHT',  'Vinyl Lattice 4ft x 8ft White Diagonal',    'each',  38.00, 'White', 'HVP-LAT-4x8-W'),
  ('HVP-LATTICE-4X8-TAN',  'Vinyl Lattice 4ft x 8ft Tan',               'each',  38.00, 'Tan',   'HVP-LAT-4x8-T'),
  ('HVP-TRELLIS-2X8-WHT',  'Vinyl Trellis 2ft x 8ft White',             'each',  28.00, 'White', 'HVP-TREL-2x8-W'),
  ('HVP-FENCE-TOPPER-WHT', 'Vinyl Fence Topper Decorative 8ft White',   'each',  32.00, 'White', 'HVP-TOPPER-8-W'),
  ('HVP-POST-EXT-4X4',     'Vinyl Post Extension 4x4 (for taller fence)','each', 22.00, 'White', 'HVP-EXT-4x4'),
  ('HVP-PANEL-PRI-6X8-WHT','Vinyl Privacy Panel 6ft x 8ft White',       'each', 185.00, 'White', 'HVP-PANEL-PRI-6x8-W'),
  ('HVP-PANEL-PRI-5X8-WHT','Vinyl Privacy Panel 5ft x 8ft White',       'each', 155.00, 'White', 'HVP-PANEL-PRI-5x8-W'),
  ('HVP-PANEL-SEMI-6X8-WHT','Vinyl Semi-Privacy Panel 6ft x 8ft White', 'each', 145.00, 'White', 'HVP-PANEL-SEMI-6x8-W'),
  ('HVP-PANEL-PIC-4X8-WHT','Vinyl Picket Panel 4ft x 8ft White',        'each', 110.00, 'White', 'HVP-PANEL-PIC-4x8-W'),
  ('HVP-RAIL-BRACKET-2X4', 'Vinyl Rail Bracket 2x4 Stainless',          'each',   3.50, 'S/S',   'HVP-BRACKET-2X4'),
  ('HVP-GATE-3X4-WHT',     'Vinyl Gate 3ft x 4ft White Picket',         'each', 310.00, 'White', 'HVP-GATE-3x4-PIC-W'),
  ('HVP-GATE-4X4-PIC-WHT', 'Vinyl Gate 4ft x 4ft White Picket Style',   'each', 345.00, 'White', 'HVP-GATE-4x4-PIC-W'),
  ('HVP-GATE-4X6-PRI-WHT', 'Vinyl Gate 4ft x 6ft White Privacy',        'each', 520.00, 'White', 'HVP-GATE-4x6-PRI-W'),
  ('HVP-GATE-DBL-10X5-WHT','Vinyl Double Gate 10ft x 5ft White',        'each', 920.00, 'White', 'HVP-GATE-DBL-10x5-W')
) AS v(plu, name, unit, unit_cost, color, ssku)
ON CONFLICT (plu) DO NOTHING;

-- Additional wood accessories
WITH cat AS (SELECT id FROM product_categories WHERE code = 'WOOD')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'Wood', 'CSA O141', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('WD-LATTICE-4X8-CED',   'Cedar Lattice 4ft x 8ft',                'each',  42.00),
  ('WD-TRELLIS-2X8-CED',   'Cedar Trellis 2ft x 8ft',                'each',  32.00),
  ('WD-KICKBOARD-1X6-8',   'Pressure-Treated Kickboard 1x6 x 8ft PT','each',   8.50),
  ('WD-POSTPROTECT',       'Post Armor / Post Protector 4x4 Ground Sleeve','each',12.00),
  ('WD-JOIST-HANGER-2X6',  'Galvanized Joist Hanger 2x6 for Rail',  'each',   2.80),
  ('WD-POSTBASE-ADJ',      'Adjustable Post Base 4x4 Galvanized',    'each',  18.00),
  ('WD-PANEL-PRI-6X8-PT',  'Pre-Built Privacy Panel 6ft x 8ft PT',  'each', 145.00),
  ('WD-PANEL-PRI-5X8-PT',  'Pre-Built Privacy Panel 5ft x 8ft PT',  'each', 120.00),
  ('WD-PANEL-SEMI-6X8-PT', 'Pre-Built Semi-Privacy Panel 6ft x 8ft PT','each',115.00),
  ('WD-BACKER-RAIL-2X4',   'Backer Rail 2x4 x 8ft Cedar',           'each',  12.00)
) AS v(plu, name, unit, unit_cost)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- INTERIOR INSTALLATION MOUNTING HARDWARE (PLU 1301-1350)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'FASTENERS')
INSERT INTO products (plu, category_id, name, unit, unit_cost, canadian_std, description)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'CSA A3000 / CSA G40.8', v.desc
FROM cat, (VALUES
  ('MOUNT-POSTBASE-CONC',  'Post Base Plate Bolt-On to Concrete (4x4)',   'each',  24.00, 'Heavy steel L-bracket for concrete slab'),
  ('MOUNT-POSTBASE-WOOD',  'Post Base Plate Bolt-On to Wood (4x4)',       'each',  18.00, 'Heavy-duty angle bracket for wood framing'),
  ('MOUNT-POSTBASE-6X6',   'Post Base Plate 6x6 Heavy-Duty',              'each',  38.00, 'Commercial 6x6 post base'),
  ('MOUNT-EXPANCHOR-0.5',  'Expansion Anchor 0.5in Dia Concrete',         'each',   2.80, 'Per-post concrete anchor bolt'),
  ('MOUNT-LAGBOLT-0.75X4', 'Lag Bolt 0.75in x 4in for Wood Framing',     'each',   1.20, 'Post base to wood structure'),
  ('MOUNT-EPOXY-ANCHOR',   'Epoxy Anchor Compound Tube (10fl oz)',        'tube',  22.00, 'High-strength anchor epoxy'),
  ('MOUNT-SHIMSET',        'Post Leveling Shim Set (plastic, 20pc)',      'set',    8.00, 'For plumb post installation'),
  ('MOUNT-DUAL-CLAMP',     'Dual-Post Mounting Clamp Heavy Bracket Set',  'set',  32.00, 'For dual post installations'),
  ('MOUNT-LAGBOLT-0.75X3.5','Lag Bolt 0.75in x 3.5in Galvanized',       'each',   1.05, 'Standard wood frame attachment')
) AS v(plu, name, unit, unit_cost, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- POOL ENCLOSURE (CSA B95.1) — SAFETY FENCING (PLU 1351-1400)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.unit_cost, 'Chain Link', v.color, 'CSA B95.1 Pool Enclosure Standard', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('POOL-MESH-4BLK-11',    'Pool Enclosure Chain Link 4ft Black 11GA',  'roll',  78.00, 'Black'),
  ('POOL-MESH-4GRN-11',    'Pool Enclosure Chain Link 4ft Green 11GA',  'roll',  74.00, 'Green'),
  ('POOL-LPOST-1.5-6-BLK', 'Pool Enclosure Line Post 1.5in x 6ft Black','each',  42.00, 'Black'),
  ('POOL-TPOST-1.875-6-BLK','Pool Enclosure Terminal Post 1.875in x 6ft Black','each',56.00,'Black'),
  ('POOL-RAIL-1.25-21-BLK','Pool Enclosure Top Rail 1.25in Black',      'each',  27.50, 'Black'),
  ('POOL-GATE-4X4-SELF-BLK','Pool Self-Closing Gate 4ft x 4ft Black CSA B95.1','each',385.00,'Black'),
  ('POOL-GATE-SELF-HINGE', 'Pool Gate Self-Closing Hinge CSA B95.1',    'each',  42.00, 'Black'),
  ('POOL-GATE-SELF-LATCH', 'Pool Gate Self-Latching Latch CSA B95.1',   'each',  48.00, 'Black'),
  ('POOL-GATE-ALARM',      'Pool Gate Alarm Sensor CSA B95.1',          'each',  85.00, 'Black'),
  ('POOL-SIGN-CSA',        'Pool Safety Fence Sign CSA B95.1 Compliant','each',  16.00, 'N/A')
) AS v(plu, name, unit, unit_cost, color)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- VERIFY COUNT
-- ============================================================
-- SELECT COUNT(*) AS total_products FROM products;
-- Expected: 950+

COMMIT;

-- ============================================================
-- EXTENDED CHAIN LINK PRODUCT VARIANTS (PLU 1401-1550)
-- Heights: 3ft / 4ft / 5ft / 6ft / 8ft / 10ft / 12ft
-- Colors: Galvanized / Black / Green / Brown
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, height_ft, color, gauge, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, 'roll', v.uc, 'Chain Link', v.ht, v.color, v.gauge,
       'CAN/CGSB-138.3-2019', 'Master Halco Canada'
FROM cat, (VALUES
  ('CL-MESH-12GAL-9',  'Chain Link Fabric 12ft Galvanized 9GA',         168.00, 12.00,'Galvanized','9GA'),
  ('CL-MESH-12BLK-9',  'Chain Link Fabric 12ft Black Vinyl-Coated 9GA', 210.00, 12.00,'Black','9GA'),
  ('CL-MESH-3GAL-6',   'Chain Link Fabric 3ft Galvanized 6GA (Heavy)',   62.00,  3.00,'Galvanized','6GA'),
  ('CL-MESH-4GAL-6',   'Chain Link Fabric 4ft Galvanized 6GA (Heavy)',   80.00,  4.00,'Galvanized','6GA'),
  ('CL-MESH-5GAL-6',   'Chain Link Fabric 5ft Galvanized 6GA (Heavy)',   99.00,  5.00,'Galvanized','6GA'),
  ('CL-MESH-6GAL-6',   'Chain Link Fabric 6ft Galvanized 6GA (Heavy)',  118.00,  6.00,'Galvanized','6GA'),
  ('CL-MESH-8GAL-6',   'Chain Link Fabric 8ft Galvanized 6GA (Heavy)',  153.00,  8.00,'Galvanized','6GA'),
  ('CL-MESH-10GAL-6',  'Chain Link Fabric 10ft Galvanized 6GA (Heavy)', 190.00, 10.00,'Galvanized','6GA'),
  ('CL-MESH-12GAL-6',  'Chain Link Fabric 12ft Galvanized 6GA (Heavy)', 228.00, 12.00,'Galvanized','6GA'),
  ('CL-MESH-4GAL-9-1', 'Chain Link Fabric 4ft Galvanized 9GA 1in Mesh', 68.00,  4.00,'Galvanized','9GA'),
  ('CL-MESH-5GAL-9-1', 'Chain Link Fabric 5ft Galvanized 9GA 1in Mesh', 84.00,  5.00,'Galvanized','9GA'),
  ('CL-MESH-6GAL-9-1', 'Chain Link Fabric 6ft Galvanized 9GA 1in Mesh', 98.00,  6.00,'Galvanized','9GA'),
  ('CL-MESH-4BLK-9-1', 'Chain Link Fabric 4ft Black 9GA 1in Mesh (Pool)',82.00, 4.00,'Black','9GA'),
  ('CL-MESH-5BLK-9-1', 'Chain Link Fabric 5ft Black 9GA 1in Mesh (Pool)',100.00,5.00,'Black','9GA')
) AS v(plu, name, uc, ht, color, gauge)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- EXTENDED LINE & TERMINAL POSTS — MORE SIZES (PLU 1551-1620)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, diameter_in, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, 'each', v.uc, 'Chain Link', v.color, v.dia,
       'CAN/CGSB-138.3-2019 / CSA G40.21', 'Master Halco Canada'
FROM cat, (VALUES
  ('CL-LPOST-1.5-4-GAL',   'Line Post 1.5in OD x 4ft Galvanized',      28.00,'Galvanized',1.5),
  ('CL-LPOST-1.5-5-GAL',   'Line Post 1.5in OD x 5ft Galvanized',      33.00,'Galvanized',1.5),
  ('CL-LPOST-1.875-5-GAL', 'Line Post 1.875in OD x 5ft Galvanized',    40.00,'Galvanized',1.875),
  ('CL-LPOST-1.875-6-GAL', 'Line Post 1.875in OD x 6ft Galvanized',    46.00,'Galvanized',1.875),
  ('CL-LPOST-2.375-6-GAL', 'Line Post 2.375in OD x 6ft Galvanized',    62.00,'Galvanized',2.375),
  ('CL-LPOST-2.875-8-GAL', 'Line Post 2.875in OD x 8ft Galvanized',   100.00,'Galvanized',2.875),
  ('CL-LPOST-4-10-GAL',    'Line Post 4in OD x 10ft Galvanized',       188.00,'Galvanized',4.0),
  ('CL-LPOST-4-12-GAL',    'Line Post 4in OD x 12ft Galvanized',       225.00,'Galvanized',4.0),
  ('CL-LPOST-1.5-4-BLK',   'Line Post 1.5in OD x 4ft Black',           33.00,'Black',1.5),
  ('CL-LPOST-1.5-5-BLK',   'Line Post 1.5in OD x 5ft Black',           38.00,'Black',1.5),
  ('CL-LPOST-2.375-8-BLK', 'Line Post 2.375in OD x 8ft Black',         92.00,'Black',2.375),
  ('CL-LPOST-2.875-10-BLK','Line Post 2.875in OD x 10ft Black',        140.00,'Black',2.875),
  ('CL-TPOST-1.5-5-GAL',   'Terminal Post 1.5in OD x 5ft Galvanized',  48.00,'Galvanized',1.5),
  ('CL-TPOST-1.5-7-GAL',   'Terminal Post 1.5in OD x 7ft Galvanized',  60.00,'Galvanized',1.5),
  ('CL-TPOST-2.875-8-GAL', 'Terminal Post 2.875in OD x 8ft Galvanized',138.00,'Galvanized',2.875),
  ('CL-TPOST-4-10-GAL',    'Terminal Post 4in OD x 10ft Galvanized',   245.00,'Galvanized',4.0)
) AS v(plu, name, uc, color, dia)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- RESIDENTIAL FENCE PACKAGE KITS (PLU 1621-1680)
-- Pre-priced complete kits for common jobs
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, description, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, 'kit', v.uc, v.ft, v.desc, 'CAN/CGSB-138.3-2019', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('KIT-CL-100LF-4-GAL', 'Chain Link Kit 100LF x 4ft Galvanized (complete)', 920.00,  'Chain Link','Complete kit: posts, fabric, rail, hardware (no concrete) 4ft x 100ft galvanized'),
  ('KIT-CL-100LF-5-GAL', 'Chain Link Kit 100LF x 5ft Galvanized (complete)', 1100.00, 'Chain Link','Complete kit: posts, fabric, rail, hardware (no concrete) 5ft x 100ft galvanized'),
  ('KIT-CL-100LF-6-GAL', 'Chain Link Kit 100LF x 6ft Galvanized (complete)', 1280.00, 'Chain Link','Complete kit: posts, fabric, rail, hardware (no concrete) 6ft x 100ft galvanized'),
  ('KIT-CL-100LF-4-BLK', 'Chain Link Kit 100LF x 4ft Black (complete)',      1080.00, 'Chain Link','Complete kit: posts, fabric, rail, hardware (no concrete) 4ft x 100ft black'),
  ('KIT-CL-100LF-5-BLK', 'Chain Link Kit 100LF x 5ft Black (complete)',      1280.00, 'Chain Link','Complete kit: posts, fabric, rail, hardware (no concrete) 5ft x 100ft black'),
  ('KIT-CL-100LF-6-BLK', 'Chain Link Kit 100LF x 6ft Black (complete)',      1480.00, 'Chain Link','Complete kit: posts, fabric, rail, hardware (no concrete) 6ft x 100ft black')
) AS v(plu, name, uc, ft, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- WOOD FENCE KITS (PLU 1681-1710)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'WOOD')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, description, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, 'kit', v.uc, 'Wood', v.desc, 'CSA O141 Grade #2', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('KIT-WD-100LF-5-PT',  'Wood Privacy Fence Kit 100LF x 5ft PT (no concrete)',  1450.00, 'Complete materials kit 5ft privacy PT wood 100 linear feet including posts, rails, boards, hardware'),
  ('KIT-WD-100LF-6-PT',  'Wood Privacy Fence Kit 100LF x 6ft PT (no concrete)',  1680.00, 'Complete materials kit 6ft privacy PT wood 100 linear feet including posts, rails, boards, hardware'),
  ('KIT-WD-100LF-5-CED', 'Wood Privacy Fence Kit 100LF x 5ft Cedar Premium',     2400.00, 'Complete materials kit 5ft privacy cedar 100 linear feet including posts, rails, boards, hardware'),
  ('KIT-VN-100LF-5-WHT', 'Vinyl Privacy Fence Kit 100LF x 5ft White Homeland',   3200.00, 'Complete Homeland Vinyl kit 5ft privacy 100 linear feet all components')
) AS v(plu, name, uc, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- LABOUR PACKAGES (PLU 1711-1760)
-- Labour bundled per fence type per 100LF
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'LABOUR')
INSERT INTO products (plu, category_id, name, unit, unit_cost, markup_pct, description)
SELECT v.plu, cat.id, v.name, 'per 100LF', v.uc, 0.00, v.desc
FROM cat, (VALUES
  ('LAB-PKG-CL-4-RES',   'Labour Package Chain Link 4ft Residential (per 100LF)',   375.00,  '2-person crew, ~12.5hrs @ $30/hr for 4ft chain link installation per 100LF'),
  ('LAB-PKG-CL-5-RES',   'Labour Package Chain Link 5ft Residential (per 100LF)',   420.00,  '2-person crew, ~14hrs @ $30/hr for 5ft chain link installation per 100LF'),
  ('LAB-PKG-CL-6-RES',   'Labour Package Chain Link 6ft Residential (per 100LF)',   465.00,  '2-person crew, ~15.5hrs @ $30/hr for 6ft chain link installation per 100LF'),
  ('LAB-PKG-CL-4-COMM',  'Labour Package Chain Link 4ft Commercial (per 100LF)',    510.00,  '2-person crew commercial rate for 4ft chain link per 100LF'),
  ('LAB-PKG-CL-6-COMM',  'Labour Package Chain Link 6ft Commercial (per 100LF)',    600.00,  '2-person crew commercial rate for 6ft chain link per 100LF'),
  ('LAB-PKG-WD-5-RES',   'Labour Package Wood 5ft Privacy Residential (per 100LF)', 540.00, '2-person crew, ~18hrs @ $30/hr for 5ft wood privacy per 100LF'),
  ('LAB-PKG-WD-6-RES',   'Labour Package Wood 6ft Privacy Residential (per 100LF)', 600.00, '2-person crew, ~20hrs @ $30/hr for 6ft wood privacy per 100LF'),
  ('LAB-PKG-VN-5-RES',   'Labour Package Vinyl 5ft Privacy Residential (per 100LF)',480.00,  '2-person crew, ~16hrs @ $30/hr for 5ft vinyl privacy per 100LF'),
  ('LAB-PKG-WI-4-RES',   'Labour Package Wrought Iron 4ft Residential (per 100LF)', 780.00, 'Specialist crew, ~13hrs @ $60/hr for wrought iron per 100LF'),
  ('LAB-PKG-DEMO-ANY',   'Labour Package Fence Removal (per 100LF)',                 270.00, '2-person crew for removal of existing fence per 100LF'),
  ('LAB-PKG-POST-INSTALL','Labour Post Hole Digging + Set per post',                  22.00, 'Per post: dig hole + set in concrete + plumb')
) AS v(plu, name, uc, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- HARDWARE EXPANSION — MORE FASTENERS & BRACKETS (PLU 1761-1860)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'FASTENERS')
INSERT INTO products (plu, category_id, name, unit, unit_cost, canadian_std)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'CSA G40.8 / CSA G40.20'
FROM cat, (VALUES
  ('FST-SWAGEFITTING-0.5',  'Swage Fitting 0.5in for Cable Fence',        'each',   3.50),
  ('FST-TURNBUCKLE-0.5',    'Turnbuckle 0.5in Galvanized',                'each',   6.50),
  ('FST-WIREROPE-3/16',     'Wire Rope 3/16in Galvanized (per ft)',       'ft',     1.20),
  ('FST-WIREROPE-1/4',      'Wire Rope 1/4in Galvanized (per ft)',        'ft',     1.85),
  ('FST-EYEBOLT-0.5X4',     'Eye Bolt 0.5in x 4in Galvanized',           'each',   2.80),
  ('FST-UBOLT-1.875',       'U-Bolt 1.875in Galvanized (for post clamp)', 'each',   3.20),
  ('FST-UBOLT-2.375',       'U-Bolt 2.375in Galvanized',                  'each',   4.00),
  ('FST-PLATENUT-0.5',      'Plate Nut 0.5in Galvanized',                 'each',   0.45),
  ('FST-LOCKTITE-MED',      'Threadlocker Medium Strength 0.5oz',         'tube',   9.00),
  ('FST-WIRECLIP-J-1.5',    'J-Clip Wire Clip 1.5in (per 100)',           'box',   12.00),
  ('FST-RAILENDSTOP-1.25',  'Rail End Stop 1.25in Galvanized',            'each',   1.80),
  ('FST-RAILENDSTOP-1.5',   'Rail End Stop 1.5in Galvanized',             'each',   2.10),
  ('FST-POSTANCHOR-DRIV',   'Drive Anchor Post Anchor 3/4in x 36in',     'each',  18.00),
  ('FST-GRIPFIST-1.5',      'Grip Fist / Deadman Anchor 1.5in',          'each',  16.00),
  ('FST-CABLECLAMP-3/16',   'Cable Clamp 3/16in (for wire rope)',         'each',   1.10),
  ('FST-CABLECLAMP-1/4',    'Cable Clamp 1/4in (for wire rope)',          'each',   1.40),
  ('FST-WIRETIE-SS-9IN',    'Stainless Wire Tie 9in (per 100)',           'box',   14.00),
  ('FST-WIRETIE-GAL-9IN',   'Galvanized Wire Tie 9in (per 100)',          'box',    8.50),
  ('FST-HEXBOLT-0.5X5',     'Hex Bolt 0.5in x 5in Grade 5 Galvanized',  'each',   1.10),
  ('FST-HEXBOLT-0.5X6',     'Hex Bolt 0.5in x 6in Grade 5 Galvanized',  'each',   1.30),
  ('FST-HEXBOLT-0.75X5',    'Hex Bolt 0.75in x 5in Grade 5 Galvanized', 'each',   1.65),
  ('FST-HEXBOLT-0.75X6',    'Hex Bolt 0.75in x 6in Grade 5 Galvanized', 'each',   1.90),
  ('FST-FLANGE-NUT-0.5',    'Flange Nut 0.5in Grade 5 Galvanized',       'each',   0.35),
  ('FST-FLANGE-NUT-0.75',   'Flange Nut 0.75in Grade 5 Galvanized',      'each',   0.55),
  ('FST-SPRINGCLIP-1.25',   'Spring Clip 1.25in for top rail',            'each',   0.95),
  ('FST-SPRINGCLIP-1.5',    'Spring Clip 1.5in for top rail',             'each',   1.05)
) AS v(plu, name, unit, uc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- VINYL FENCE ACCESSORIES EXPANSION (PLU 1861-1940)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'VINYL-PVC')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, supplier_sku, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'Vinyl', v.color, v.ssku, 'Homeland Vinyl Products'
FROM cat, (VALUES
  ('HVP-POST-4X4-8-BRK',   'Vinyl Post 4x4 x 8ft Bark/Weatherwood',      'each',  45.00, 'Bark',  'HVP-4x4-8-BRK'),
  ('HVP-POST-4X4-8-SAG',   'Vinyl Post 4x4 x 8ft Sage Green',             'each',  45.00, 'Sage',  'HVP-4x4-8-SAG'),
  ('HVP-POST-4X4-8-SLT',   'Vinyl Post 4x4 x 8ft Slate',                  'each',  45.00, 'Slate', 'HVP-4x4-8-SLT'),
  ('HVP-BOARD-PRI-72-WHT', 'Vinyl Privacy Board 5.625in x 72in White',   'each',   8.00, 'White', 'HVP-BOARD-PRIVACY-72-W'),
  ('HVP-BOARD-PRI-72-TAN', 'Vinyl Privacy Board 5.625in x 72in Tan',     'each',   8.00, 'Tan',   'HVP-BOARD-PRIVACY-72-T'),
  ('HVP-BOARD-PRI-48-WHT', 'Vinyl Privacy Board 5.625in x 48in White',   'each',   5.20, 'White', 'HVP-BOARD-PRIVACY-48-W'),
  ('HVP-BOARD-PIC-48-WHT', 'Vinyl Picket Board 3.5in x 48in White',      'each',   3.80, 'White', 'HVP-BOARD-PICKET-48-W'),
  ('HVP-BOARD-PIC-72-WHT', 'Vinyl Picket Board 3.5in x 72in White',      'each',   6.00, 'White', 'HVP-BOARD-PICKET-72-W'),
  ('HVP-RAIL-2X4-10-WHT',  'Vinyl Rail 2x4 x 10ft White',                'each',  22.00, 'White', 'HVP-2x4-10-W'),
  ('HVP-RAIL-2X6-10-WHT',  'Vinyl Rail 2x6 x 10ft White (Heavy)',        'each',  28.00, 'White', 'HVP-2x6-10-W'),
  ('HVP-POST-ALUM-INSERT', 'Aluminum Post Insert for Vinyl Post 4x4',    'each',  18.00, 'N/A',   'HVP-ALUM-INSERT-4x4'),
  ('HVP-GATE-3X6-WHT',     'Vinyl Gate 3ft x 6ft White Privacy',         'each', 520.00, 'White', 'HVP-GATE-3x6-W'),
  ('HVP-GATE-4X6-WHT-2',   'Vinyl Gate 4ft x 6ft White Privacy Premium', 'each', 565.00, 'White', 'HVP-GATE-4x6-PRI-W2'),
  ('HVP-GATE-6X6-WHT',     'Vinyl Gate 6ft x 6ft White Privacy',         'each', 620.00, 'White', 'HVP-GATE-6x6-W'),
  ('HVP-GATE-DBL-12X5-WHT','Vinyl Double Gate 12ft x 5ft White',         'each',1100.00, 'White', 'HVP-GATE-DBL-12x5-W'),
  ('HVP-LATCH-KEYPAD',     'Vinyl Gate Keypad Latch Combination Lock',   'each',  88.00, 'White', 'HVP-LATCH-KEYPAD'),
  ('HVP-POST-4X4-8-GRN',   'Vinyl Post 4x4 x 8ft Hunter Green',          'each',  45.00, 'Green', 'HVP-4x4-8-GRN'),
  ('HVP-BOARD-PRI-60-GRN', 'Vinyl Privacy Board 5.625in x 60in Green',  'each',   6.50, 'Green', 'HVP-BOARD-PRIVACY-60-GRN')
) AS v(plu, name, unit, uc, color, ssku)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- WOOD FENCE EXPANSION (PLU 1941-2000)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'WOOD')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'Wood', 'CSA O141', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('WD-POST-4X4-12-PT',    'Wood Post 4x4 x 12ft Pressure-Treated',     'each',  28.00),
  ('WD-POST-6X6-12-PT',    'Wood Post 6x6 x 12ft Pressure-Treated',     'each',  58.00),
  ('WD-RAIL-2X4-10-PT',    'Wood Rail 2x4 x 10ft Pressure-Treated',     'each',   9.50),
  ('WD-RAIL-2X6-10-PT',    'Wood Rail 2x6 x 10ft Pressure-Treated',     'each',  13.00),
  ('WD-RAIL-2X8-8-PT',     'Wood Rail 2x8 x 8ft Pressure-Treated',      'each',  14.00),
  ('WD-RAIL-2X8-10-PT',    'Wood Rail 2x8 x 10ft Pressure-Treated',     'each',  17.50),
  ('WD-BOARD-1X4-48-PT',   'Wood Picket Board 1x4 x 48in PT',           'each',   2.80),
  ('WD-BOARD-1X4-60-PT',   'Wood Picket Board 1x4 x 60in PT',           'each',   3.40),
  ('WD-BOARD-1X6-72-PT',   'Wood Privacy Board 1x6 x 72in PT',          'each',   7.20),
  ('WD-BOARD-1X6-48-CED',  'Wood Privacy Board 1x6 x 48in Cedar',       'each',   8.50),
  ('WD-BOARD-1X6-72-CED',  'Wood Privacy Board 1x6 x 72in Cedar',       'each',  13.00),
  ('WD-LATTICE-2X8-CED',   'Cedar Lattice 2ft x 8ft (finer weave)',      'each',  26.00),
  ('WD-LATTICE-4X8-PT',    'PT Lattice 4ft x 8ft',                      'each',  28.00),
  ('WD-GATE-3X4-PT',       'Wood Swing Gate 3ft x 4ft PT',              'each', 195.00),
  ('WD-GATE-3X6-PT',       'Wood Swing Gate 3ft x 6ft PT',              'each', 255.00),
  ('WD-GATE-4X6-PT',       'Wood Swing Gate 4ft x 6ft PT',              'each', 305.00),
  ('WD-GATE-5X5-CED',      'Wood Swing Gate 5ft x 5ft Cedar Premium',   'each', 490.00),
  ('WD-GATE-6X6-CED',      'Wood Swing Gate 6ft x 6ft Cedar Premium',   'each', 560.00),
  ('WD-GATE-DBL-12X5-PT',  'Wood Double Gate 12ft x 5ft PT',            'each', 780.00),
  ('WD-GATE-DBL-16X5-PT',  'Wood Double Gate 16ft x 5ft PT',            'each', 950.00),
  ('WD-ACORN-CAP-4X4',     'Wood Acorn Decorative Post Cap 4x4',        'each',   9.50),
  ('WD-ACORN-CAP-6X6',     'Wood Acorn Decorative Post Cap 6x6',        'each',  13.00),
  ('WD-FLAT-CAP-4X4',      'Wood Flat Post Cap 4x4 Pressure-Treated',   'each',   5.50),
  ('WD-FLAT-CAP-6X6',      'Wood Flat Post Cap 6x6 Pressure-Treated',   'each',   7.50),
  ('WD-HINGE-6IN-SS',      'Wood Gate Hinge 6in Stainless Steel',       'each',  28.00),
  ('WD-HINGE-8IN-GAL',     'Wood Gate Hinge 8in Galvanized Heavy-Duty', 'each',  32.00),
  ('WD-LATCH-SELF-LOCK',   'Wood Gate Latch Self-Closing w/ Lock',      'each',  45.00),
  ('WD-STAIN-1GAL-CLR',    'Clear Wood Stain 1 Gallon',                 'gallon',22.00),
  ('WD-STAIN-5GAL-CED',    'Cedar Tone Wood Stain 5 Gallon',            'pail',  95.00),
  ('WD-PRESERV-GAL',       'Wood Preservative End-Cut Treatment 1 Gal', 'gallon',28.00)
) AS v(plu, name, unit, uc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- WROUGHT IRON EXPANSION (PLU 2001-2060)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'WROUGHT-IRON')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, supplier_sku, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'Wrought Iron', v.ssku, 'Cloutier Direct'
FROM cat, (VALUES
  ('CD-POST-1.5-8',      'Cloutier Wrought Iron Post 1.5sq x 8ft',        'each', 118.00,'CD-POST-1.5-8'),
  ('CD-POST-1.75-8',     'Cloutier Terminal Post 1.75sq x 8ft',           'each', 142.00,'CD-POST-1.75-8'),
  ('CD-POST-2-8',        'Cloutier Gate Post 2sq x 8ft',                  'each', 178.00,'CD-POST-2-8'),
  ('CD-POST-2.5-10',     'Cloutier Heavy Post 2.5sq x 10ft Commercial',   'each', 245.00,'CD-POST-2.5-10'),
  ('CD-RAIL-1SQ-8',      'Cloutier Rail 1sq Tube x 8ft Heavy',            'each',  32.00,'CD-RAIL-1-SQ'),
  ('CD-PICKET-FLAT-36',  'Cloutier Picket Flat-Top 0.75sq x 36in',        'each',   8.00,'CD-PICKET-FLAT-36'),
  ('CD-PICKET-FLAT-60',  'Cloutier Picket Flat-Top 0.75sq x 60in',        'each',  11.50,'CD-PICKET-FLAT-60'),
  ('CD-PICKET-BALL-36',  'Cloutier Picket Ball-Top 0.75sq x 36in',        'each',   9.00,'CD-PICKET-BALL-36'),
  ('CD-PICKET-BALL-60',  'Cloutier Picket Ball-Top 0.75sq x 60in',        'each',  13.00,'CD-PICKET-BALL-60'),
  ('CD-PICKET-ARROW-48', 'Cloutier Picket Arrow-Top 0.75sq x 48in',       'each',  11.00,'CD-PICKET-ARROW-48'),
  ('CD-PANEL-3X4-SPEAR', 'Cloutier Panel 3ft x 4ft Pre-Assembled Spear',  'each', 245.00,'CD-PANEL-3x4-SPEAR'),
  ('CD-PANEL-4X4-SPEAR', 'Cloutier Panel 4ft x 4ft Pre-Assembled Spear',  'each', 295.00,'CD-PANEL-4x4-SPEAR'),
  ('CD-PANEL-4X5-SPEAR', 'Cloutier Panel 4ft x 5ft Pre-Assembled Spear',  'each', 340.00,'CD-PANEL-4x5-SPEAR'),
  ('CD-PANEL-4X6-SPEAR', 'Cloutier Panel 4ft x 6ft Pre-Assembled Spear',  'each', 390.00,'CD-PANEL-4x6-SPEAR'),
  ('CD-PANEL-6X4-BALL',  'Cloutier Panel 6ft x 4ft Pre-Assembled Ball',   'each', 380.00,'CD-PANEL-6x4-BALL'),
  ('CD-GATE-3X4-FLAT',   'Cloutier Gate 3ft x 4ft Flat-Top',             'each', 520.00,'CD-GATE-3x4-FLAT'),
  ('CD-GATE-4X4-FLAT',   'Cloutier Gate 4ft x 4ft Flat-Top',             'each', 580.00,'CD-GATE-4x4-FLAT'),
  ('CD-GATE-6X5-SPEAR',  'Cloutier Gate 6ft x 5ft Spear-Top',            'each', 920.00,'CD-GATE-6x5-SPEAR'),
  ('CD-GATE-DBL-12X4',   'Cloutier Double Gate 12ft x 4ft Ornamental',   'each',1650.00,'CD-GATE-DBL-12x4'),
  ('CD-HINGE-5-HDWELD',  'Cloutier Weld-On Hinge 5in Heavy-Duty',        'each',  52.00,'CD-HINGE-5-WELD'),
  ('CD-LATCH-PADLOCK',   'Cloutier Padlock-Ready Gate Latch',            'each',  58.00,'CD-LATCH-PADLOCK'),
  ('CD-CAP-BALL-CAST',   'Cloutier Cast Iron Ball Cap Decorative',       'each',  18.00,'CD-CAP-BALL-CAST'),
  ('CD-CAP-PYRAMID',     'Cloutier Pyramid Cap Decorative',              'each',  14.00,'CD-CAP-PYRAMID'),
  ('CD-SCROLL-XLG',      'Cloutier Scroll Work Extra-Large',             'each',  58.00,'CD-SCROLL-XLG'),
  ('CD-MEDALLION-ORN',   'Cloutier Ornamental Medallion Center',        'each',  75.00,'CD-MEDALLION'),
  ('CD-PRIMER-RUSTX-1',  'Rust-X Primer Spray 16oz for Wrought Iron',   'can',   18.00,'CD-PRIMER-SPRAY'),
  ('CD-GALV-COMPOUND',   'Cold Galvanize Compound 1lb',                  'can',   28.00,'CD-GALV-COMPOUND'),
  ('CD-PAINT-ORN-QT',    'Ornamental Wrought Iron Paint Quart Black',   'quart', 22.00,'CD-PAINT-QT-BLK'),
  ('CD-VARNISH-CLEAR-1', 'Wrought Iron Clear Protective Varnish 1 Gal', 'gallon',46.00,'CD-VARNISH-CLR'),
  ('CD-ANCHOR-0.75',     'Cloutier Heavy Anchor 0.75in Concrete',        'each',   4.20,'CD-ANCHOR-3/4')
) AS v(plu, name, unit, uc, ssku)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- MISC EXPANSION — SIGNAGE, SECURITY, SPECIALTY (PLU 2061-2150)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'MISC')
INSERT INTO products (plu, category_id, name, unit, unit_cost, description)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, v.desc
FROM cat, (VALUES
  ('MISC-SIGN-NO-TRESS',  'No Trespassing Sign (12in x 18in)',            'each',  16.00, 'Property signage'),
  ('MISC-SIGN-ELEC-FENCE','Electric Fence Warning Sign',                  'each',  12.00, 'Safety warning'),
  ('MISC-SIGN-GUARD-DOG', 'Guard Dog Sign',                               'each',  14.00, 'Security sign'),
  ('MISC-SIGN-PRIVATE-NO','Private Property No Entry Sign',               'each',  14.00, 'Property sign'),
  ('MISC-LATCH-COMBO',    'Combination Padlock 4-digit Weatherproof',     'each',  32.00, 'Security gate lock'),
  ('MISC-LATCH-KEYED',    'Keyed Padlock Weatherproof Heavy-Duty',        'each',  28.00, 'Security gate lock'),
  ('MISC-ELEC-FENCE-KIT', 'Electric Fence Energizer Kit 1-Acre (optional)','each',185.00,'Security enhancement'),
  ('MISC-SOLARPANEL-GATE','Solar Panel Kit for Automated Gate 20W',       'each', 220.00, 'Off-grid gate power'),
  ('MISC-BATTERY-12V',    'Backup Battery 12V 18Ah for Gate Opener',      'each',  65.00, 'Gate backup power'),
  ('MISC-INTERCOM-WIRED', 'Wired Intercom System Gate to House',          'each', 380.00, 'Entry communication'),
  ('MISC-CAMERA-PTZ',     'PTZ Security Camera for Gate Area',            'each', 450.00, 'Gate surveillance'),
  ('MISC-SENSOR-MOTION',  'Motion Sensor Flood Light for Gate',           'each',  95.00, 'Security lighting'),
  ('MISC-PERMIT-POOL',    'Pool Enclosure Permit (CSA B95.1) avg cost',   'each', 195.00, 'Pool fence permit'),
  ('MISC-PERMIT-COMM',    'Commercial Fence Permit (large project) avg',  'each', 480.00, 'Large commercial permit'),
  ('MISC-INSPECT-FEE',    'Municipal Inspection Fee (avg)',                'each', 120.00, 'Post-installation inspection'),
  ('MISC-ENGINEERING',    'Engineering Stamp for Commercial Fence (avg)', 'each', 850.00, 'Required for commercial/industrial'),
  ('MISC-SURVEY-FULL',    'Full Property Survey (professional)',           'each',1200.00, 'Licensed surveyor'),
  ('MISC-POSTHOLE-FILL',  'Post Hole Filler (non-concrete for frost)',    'bag',    8.00, 'Fast-set foam filler'),
  ('MISC-ANTI-FREEZE',    'Anti-Freeze Concrete Admixture (winter pour)', 'each',  22.00, 'Cold weather poring'),
  ('MISC-HEATBLANKET',    'Concrete Curing Heat Blanket (winter)',        'each',  85.00, 'Winter concrete curing')
) AS v(plu, name, unit, uc, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- GUIDE RAIL EXPANSION (PLU 2151-2200)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'GUIDE-RAIL')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'Guide Rail', 'OPSD 02.16.04', 'Provincial Supply OPSD'
FROM cat, (VALUES
  ('GR-RAIL-WBEAM-25',    'W-Beam Rail W10x49 x 25ft OPSD',             'each', 475.00),
  ('GR-BEAM-BEAM-CONN',   'W-Beam Beam-to-Beam Splice Connector',        'each',  85.00),
  ('GR-END-ANCHOR',       'Guide Rail Ground Anchor Assembly',           'each', 320.00),
  ('GR-BOLT-0.75X4-GR8',  'Grade 8 Bolt 0.75in x 4in for Backup',      'each',   2.20),
  ('GR-PAINT-HIVIZ-5GAL', 'High-Visibility Paint 5 Gallon OPSD',       'pail',  220.00),
  ('GR-DELINEATOR-POST',  'Delineator Post Orange OPSD Compliant',      'each',  22.00),
  ('GR-DELINEATOR-TOP',   'Delineator Top Reflector OPSD Yellow',       'each',  12.00),
  ('GR-CRASH-CUSHION',    'Crash Cushion Attenuator OPSD End (CAT-350)','each',8500.00),
  ('GR-GALV-SPRAY-1GAL',  'Zinc-Rich Galvanize Spray Paint 1 Gallon',  'gallon',48.00),
  ('GR-INSP-REPORT',      'OPSD Compliance Inspection Report (fee)',     'each', 380.00)
) AS v(plu, name, unit, uc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- CONCRETE EXPANSION — MORE TYPES & ACCESSORIES (PLU 2201-2250)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CONCRETE')
INSERT INTO products (plu, category_id, name, unit, unit_cost, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'CSA A3000', v.sup
FROM cat, (VALUES
  ('CON-REBAR-3-20',    'Rebar #3 x 20ft (CSA standard)',                'each',  18.00, 'Local Steel'),
  ('CON-REBAR-4-20',    'Rebar #4 x 20ft (CSA standard)',                'each',  28.00, 'Local Steel'),
  ('CON-REBAR-5-20',    'Rebar #5 x 20ft (CSA standard)',                'each',  42.00, 'Local Steel'),
  ('CON-WIRE-MESH-4X4', 'Concrete Wire Mesh 4x4in x 10ft Roll',         'roll',  85.00, 'Local Steel'),
  ('CON-FORM-TUBE-8',   'Concrete Form Tube 8in dia x 4ft Sonotube',    'each',  16.00, 'Local Building'),
  ('CON-FORM-TUBE-12',  'Concrete Form Tube 12in dia x 4ft Sonotube',   'each',  28.00, 'Local Building'),
  ('CON-FORM-TUBE-16',  'Concrete Form Tube 16in dia x 4ft Sonotube',   'each',  42.00, 'Local Building'),
  ('CON-ADDITIVE-ACC',  'Concrete Accelerator Admixture 1L',             'each',  18.00, 'Local Building'),
  ('CON-ADDITIVE-FIBE', 'Concrete Fiber Reinforcement 1kg',              'each',  24.00, 'Local Building'),
  ('CON-LEVEL-COMPOUND','Self-Leveling Concrete Compound 25kg',          'bag',   42.00, 'Local Building'),
  ('CON-ANCHOR-EPOXY-M','Epoxy Anchor Mortar (for heavy post bases)',    'each',  38.00, 'Local Building'),
  ('CON-STONEBASE-QT',  'Gravel Base Compacted 1/4in Clear (per ton)',  'tonne', 52.00, 'Local Aggregate'),
  ('CON-FILL-SAND-TON', 'Fill Sand per Tonne (post hole backfill)',      'tonne', 38.00, 'Local Aggregate'),
  ('CON-CLEANOUT-RND',  'Round Concrete Form Cleaner Tool',              'each',  12.00, 'Local Building'),
  ('CON-FLOAT-BULL',    'Bull Float Concrete Finishing Tool (rental)',   'day',   28.00, 'Equipment Rental')
) AS v(plu, name, unit, uc, sup)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- FINISHING EXPANSION (PLU 2251-2300)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'FINISHING')
INSERT INTO products (plu, category_id, name, unit, unit_cost, description)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, v.desc
FROM cat, (VALUES
  ('FIN-RUST-CONVERT-QT','Rust Converter 1 Quart (neutralizes rust)',   'quart', 24.00, 'Converts rust to stable compound'),
  ('FIN-RUST-CONVERT-1', 'Rust Converter 1 Gallon',                    'gallon',82.00, 'Converts rust to stable compound'),
  ('FIN-PRIMER-ZINC-1',  'Zinc Chromate Primer 1 Gallon',              'gallon',52.00, 'Corrosion-resistant primer'),
  ('FIN-PAINT-GRN-5',    'Exterior Metal Paint Hunter Green 5 Gallon', 'pail',  168.00,'Green fence paint bulk'),
  ('FIN-PAINT-BLK-5',    'Exterior Metal Paint Black 5 Gallon',        'pail',  162.00,'Black fence paint bulk'),
  ('FIN-PAINT-WHT-5',    'Exterior Metal Paint White 5 Gallon',        'pail',  162.00,'White fence paint bulk'),
  ('FIN-SPRAY-GRN',      'Green Spray Touch-Up Paint Can 12oz',        'can',   14.00, 'Field touch-up green'),
  ('FIN-SPRAY-BRN',      'Brown Spray Touch-Up Paint Can 12oz',        'can',   14.00, 'Field touch-up brown'),
  ('FIN-SPRAY-WHT',      'White Spray Touch-Up Paint Can 12oz',        'can',   14.00, 'Field touch-up white'),
  ('FIN-WOODTREAT-5GAL', 'Wood Treatment Preservative 5 Gallon PT',   'pail',   95.00,'Wood preservation bulk'),
  ('FIN-SEALANT-EXT-5',  'Exterior Silicone Sealant Bulk 5-Pack',      'pack',  48.00, 'Bulk sealant for large jobs'),
  ('FIN-PAINT-PRIMER-5', 'Metal Primer 5 Gallon (bulk job)',           'pail',  175.00,'Bulk primer for large metal jobs'),
  ('FIN-CLEANSOLVENT-1', 'Metal Cleaning Solvent 1 Gallon',            'gallon',32.00, 'Pre-paint degreaser'),
  ('FIN-BRUSHSET-PRO',   'Professional Paint Brush Set (4 sizes)',     'set',   38.00, 'For fence painting crew'),
  ('FIN-AIRLESSPRIMER',  'Airless Sprayer for Primer/Paint (rental)',  'day',  145.00, 'For large painting jobs')
) AS v(plu, name, unit, uc, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- VERIFY FINAL PRODUCT COUNT
-- ============================================================
-- SELECT COUNT(*) AS total_products FROM products;
-- Expected: 950+

COMMIT;

-- ============================================================
-- STEEL POST CAPS, ACCESSORIES, SPECIALTY ITEMS (PLU 2301-2450)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'Chain Link', v.color,
       'CAN/CGSB-138.3-2019', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('CL-PCAP-4-BLK',      'Post Cap 4in Black Vinyl-Coated',             'each',  3.50,'Black'),
  ('CL-PCAP-3.5-GAL',    'Post Cap 3.5in OD Galvanized',                'each',  2.60,'Galvanized'),
  ('CL-PCAP-2.875-BLK',  'Post Cap 2.875in Black',                      'each',  2.65,'Black'),
  ('CL-PCAP-1.5-BLK',    'Post Cap 1.5in Black',                        'each',  1.40,'Black'),
  ('CL-PCAP-1.5-GRN',    'Post Cap 1.5in Green',                        'each',  1.45,'Green'),
  ('CL-PCAP-1.875-GRN',  'Post Cap 1.875in Green',                      'each',  1.60,'Green'),
  ('CL-TBAND-1.5-BLK',   'Tension Band 1.5in Black Vinyl-Coated',       'each',  0.95,'Black'),
  ('CL-TBAND-1.5-GRN',   'Tension Band 1.5in Green Vinyl-Coated',       'each',  0.98,'Green'),
  ('CL-TBAND-1.875-GRN', 'Tension Band 1.875in Green',                  'each',  1.15,'Green'),
  ('CL-TBAND-2.375-BLK', 'Tension Band 2.375in Black',                  'each',  1.45,'Black'),
  ('CL-TBAR-3-BRN',      'Tension Bar 3ft Brown',                       'each',  5.80,'Brown'),
  ('CL-TBAR-4-BRN',      'Tension Bar 4ft Brown',                       'each',  6.80,'Brown'),
  ('CL-TBAR-5-BRN',      'Tension Bar 5ft Brown',                       'each',  7.90,'Brown'),
  ('CL-TBAR-6-BRN',      'Tension Bar 6ft Brown',                       'each',  9.10,'Brown'),
  ('CL-TBAR-5-GRN',      'Tension Bar 5ft Green',                       'each',  7.50,'Green'),
  ('CL-TBAR-6-GRN',      'Tension Bar 6ft Green',                       'each',  8.75,'Green'),
  ('CL-RAILCUP-1.5-GAL', 'Rail Cup / Loop Cap 1.5in Galvanized',        'each',  2.40,'Galvanized'),
  ('CL-RAILCUP-1.5-BLK', 'Rail Cup / Loop Cap 1.5in Black',             'each',  2.80,'Black'),
  ('CL-BRACE-1.5-GAL',   'Brace Band 1.5in Galvanized',                 'each',  0.95,'Galvanized'),
  ('CL-BRACE-2.875-GAL', 'Brace Band 2.875in Galvanized',               'each',  1.55,'Galvanized'),
  ('CL-BRACE-1.5-BLK',   'Brace Band 1.5in Black',                      'each',  1.15,'Black'),
  ('CL-BRACE-1.875-BLK', 'Brace Band 1.875in Black',                    'each',  1.28,'Black'),
  ('CL-CONNECTOR-BLK',   'Post-to-Rail Clamp Connector Black',          'each',  3.00,'Black'),
  ('CL-CORNERBAND-2.375','Corner Band 2.375in 3-Way Galvanized',        'each',  5.20,'Galvanized'),
  ('CL-ALUM-SLEEVE-1.875','Aluminum Splice Sleeve 1.875in',             'each',  6.20,'Aluminum'),
  ('CL-PSLEEVE-2.875',   'Post Sleeve 2.875in Concrete Mounting',       'each', 11.00,'Galvanized'),
  ('CL-PSLEEVE-4',       'Post Sleeve 4in Concrete Mounting',           'each', 14.00,'Galvanized'),
  ('CL-DUTCHMAN-1.875',  'Dutchman Clamp 1.875in for Brace',           'each', 15.00,'Galvanized'),
  ('CL-STRETCHBAR-6-BLK','Stretcher Bar Middle 6ft Black',              'each',  9.80,'Black'),
  ('CL-STRETCHBAR-5-BLK','Stretcher Bar Middle 5ft Black',              'each',  9.00,'Black')
) AS v(plu, name, unit, uc, color)
ON CONFLICT (plu) DO NOTHING;

-- Chain Link Gate accessories expansion
WITH cat AS (SELECT id FROM product_categories WHERE code = 'GATES')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, 'each', v.uc, 'Chain Link', v.color,
       'CAN/CGSB-138.3-2019', 'Master Halco Canada'
FROM cat, (VALUES
  ('CL-GATE-3X6-GAL',    'Chain Link Swing Gate 3ft x 6ft Galvanized',    295.00,'Galvanized'),
  ('CL-GATE-4X8-GAL',    'Chain Link Swing Gate 4ft x 8ft Galvanized',    410.00,'Galvanized'),
  ('CL-GATE-5X6-GAL',    'Chain Link Swing Gate 5ft x 6ft Galvanized',    368.00,'Galvanized'),
  ('CL-GATE-6X8-GAL',    'Chain Link Swing Gate 6ft x 8ft Galvanized',    480.00,'Galvanized'),
  ('CL-GATE-3X5-BLK',    'Chain Link Swing Gate 3ft x 5ft Black',         248.00,'Black'),
  ('CL-GATE-5X5-BLK',    'Chain Link Swing Gate 5ft x 5ft Black',         358.00,'Black'),
  ('CL-GATE-3X3-GAL',    'Chain Link Swing Gate 3ft x 3ft Galvanized',    155.00,'Galvanized'),
  ('CL-GATE-DBL-8X6-GAL','Chain Link Double Gate 8ft x 6ft Galvanized',   640.00,'Galvanized'),
  ('CL-GATE-DBL-12X5-GAL','Chain Link Double Gate 12ft x 5ft Galvanized', 820.00,'Galvanized'),
  ('CL-GATE-DBL-14X6-GAL','Chain Link Double Gate 14ft x 6ft Galvanized', 960.00,'Galvanized'),
  ('CL-GATE-DBL-20X6-GAL','Chain Link Double Gate 20ft x 6ft Galvanized',1180.00,'Galvanized'),
  ('CL-GATE-HINGE-BLK',  'Gate Hinge Black Chain Link',                    10.00,'Black'),
  ('CL-GATE-LATCH-BLK',  'Gate Latch Black Heavy-Duty',                    20.00,'Black'),
  ('CL-GATE-CLOSER-SPR', 'Gate Closer Spring Heavy-Duty',                  32.00,'Galvanized'),
  ('CL-GATE-STOP-GROUND','Gate Ground Stop (to hold gate open)',            18.00,'Galvanized'),
  ('CL-GATE-BUMPER',     'Gate Rubber Bumper / Stop',                       6.50,'Black')
) AS v(plu, name, uc, color)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- TOOLS EXPANSION (PLU 2451-2510)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'TOOLS')
INSERT INTO products (plu, category_id, name, unit, unit_cost, description)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, v.desc
FROM cat, (VALUES
  ('TOOL-TAPEMEAS-200',   'Measuring Tape 200ft (for layout)',           'each',  38.00,'Heavy-duty 200ft measuring tape'),
  ('TOOL-LEVEL-4FT',      '4ft Carpenter Level (for posts)',             'each',  42.00,'Aluminum level for plumb posts'),
  ('TOOL-LEVEL-6FT',      '6ft Mason Level',                            'each',  55.00,'Long level for fence line alignment'),
  ('TOOL-PLUMBOB',        'Plumb Bob with Line 8oz',                    'each',   8.00,'Post plumb verification'),
  ('TOOL-DIGBAR-5FT',     'Digging Bar / Breaker Bar 5ft',              'each',  65.00,'Manual post hole digging'),
  ('TOOL-CLAMSHELL',      'Clamshell Post Hole Digger',                 'each',  45.00,'Manual clam-shell digger'),
  ('TOOL-CROWBAR-4FT',    'Crowbar 4ft Pry Bar',                        'each',  28.00,'Post removal tool'),
  ('TOOL-SLEDGE-10LB',    'Sledge Hammer 10lb',                         'each',  55.00,'Post driving and compaction'),
  ('TOOL-HAMMER-CLAW',    'Claw Hammer 20oz Framing',                   'each',  32.00,'General installation'),
  ('TOOL-DRILL-IMPACT',   'Impact Driver 18V Kit w/ Bits (purchase)',   'each', 285.00,'Screw driving for wood/vinyl'),
  ('TOOL-DRILL-HAMMER',   'Rotary Hammer Drill 1in SDS (purchase)',     'each', 380.00,'Concrete drilling for anchors'),
  ('TOOL-GRINDER-DISC',   'Cutting Disc 4.5in for Angle Grinder 5pk',  'pack',  12.00,'Metal cutting consumable'),
  ('TOOL-GRINDER-FLAP',   'Flap Disc 4.5in for Angle Grinder 4pk',     'pack',  18.00,'Metal grinding consumable'),
  ('TOOL-SAW-RECIPRO',    'Reciprocating Saw Blade Metal 6pc',          'pack',  22.00,'Metal cutting blades'),
  ('TOOL-CHAINSAW-BAR',   'Safety Glasses ANSI Z87 6-Pack',             'pack',  18.00,'Eye protection for crew'),
  ('TOOL-GLOVES-WORK',    'Work Gloves Heavy-Duty Leather 12-Pair',     'pack',  65.00,'Hand protection'),
  ('TOOL-BOOTS-SAFETY',   'Safety Boots CSA Grade 1 (per pair)',        'pair', 165.00,'CSA-certified safety footwear'),
  ('TOOL-HARDHAT-CREW',   'Hard Hat CSA Z94.1 (each)',                  'each',  22.00,'Head protection CSA certified'),
  ('TOOL-VEST-HIVIZ',     'High-Visibility Safety Vest CSA Z96 (each)', 'each',  18.00,'Traffic zone safety'),
  ('TOOL-FIRSTAID-KIT',   'First Aid Kit CSA Standard 10-Person',       'each',  65.00,'Workplace first aid requirement')
) AS v(plu, name, unit, uc, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- SPECIALTY PRODUCTS — ELECTRIC FENCE, CABLE, DEER FENCE
-- (PLU 2511-2600)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'MISC')
INSERT INTO products (plu, category_id, name, unit, unit_cost, description)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, v.desc
FROM cat, (VALUES
  ('SPEC-DEER-MESH-4',    'Deer / Wildlife Fence Mesh 4ft Black Poly',  'roll',  88.00,'Heavy-duty deer fence 50 meter roll'),
  ('SPEC-DEER-MESH-6',    'Deer / Wildlife Fence Mesh 6ft Black Poly',  'roll', 118.00,'Heavy-duty deer fence 50 meter roll'),
  ('SPEC-DEER-MESH-8',    'Deer / Wildlife Fence Mesh 8ft Black Poly',  'roll', 148.00,'Heavy-duty deer fence 50 meter roll'),
  ('SPEC-ELEC-ENERGIZER', 'Electric Fence Energizer 2J (1km range)',    'each', 285.00,'Agriculture/security electric fence'),
  ('SPEC-ELEC-WIRE-9GA',  'Electric Fence Wire 9GA Galvanized (per roll)','roll',62.00,'17-gauge poly wire 400m roll'),
  ('SPEC-ELEC-INSULATOR', 'Electric Fence Insulator Screw-In (per 50)', 'pack',  18.00,'For post-mounted electric wire'),
  ('SPEC-ELEC-GROUND',    'Electric Fence Ground Rod 6ft Galvanized',   'each',  22.00,'Earthing rod for energizer'),
  ('SPEC-ELEC-TESTER',    'Electric Fence Voltage Tester',              'each',  45.00,'Field tester for fence voltage'),
  ('SPEC-CABLE-GALV-6MM', 'Steel Cable 6mm Galvanized (per meter)',     'm',      4.20,'For cable fence runs'),
  ('SPEC-CABLE-GALV-8MM', 'Steel Cable 8mm Galvanized (per meter)',     'm',      6.80,'Heavy cable fence runs'),
  ('SPEC-CABLE-GALV-10MM','Steel Cable 10mm Galvanized (per meter)',    'm',      9.50,'Very heavy cable fence'),
  ('SPEC-CABLE-TURNBUCKLE','Cable Turnbuckle 3/8in for Tensioning',     'each',  14.00,'Cable fence tensioner'),
  ('SPEC-CABLE-THIMBLE',  'Cable Thimble 6mm for Loop End',             'each',   2.50,'Protect cable at fittings'),
  ('SPEC-SNOW-FENCE-4',   'Orange Snow Fence / Construction Fence 4ft','roll',   45.00,'Temporary barrier, 100ft roll'),
  ('SPEC-SNOW-FENCE-STKE','Snow Fence Stakes 5ft (per 10)',             'pack',  18.00,'Plastic stakes for snow fence'),
  ('SPEC-TEMP-FENCE-POST','Temporary Fence Base Block Rubber',          'each',  22.00,'Weighted base for construction fence'),
  ('SPEC-TEMP-PANEL',     'Temporary Construction Fence Panel 6x10ft', 'each',  68.00,'Rental-style construction panel'),
  ('SPEC-SILT-FENCE-3',   'Silt Fence / Erosion Control 3ft x 50ft',  'roll',  42.00,'Environmental protection'),
  ('SPEC-SOUND-BARRIER',  'Sound Barrier Panel 8ft x 12ft (Acoustifence)','each',285.00,'Noise reduction fence panel'),
  ('SPEC-PRIVACY-HEDGE',  'Artificial Hedge Privacy Insert 20ft x 4ft','each',  185.00,'Green hedge privacy insert for chain link')
) AS v(plu, name, unit, uc, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- POOL ENCLOSURE EXPANSION — CSA B95.1 (PLU 2601-2650)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'Chain Link', v.color,
       'CSA B95.1 Pool Enclosure Standard', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('POOL-GATE-3X4-BLK',   'Pool Self-Closing Gate 3ft x 4ft Black CSA B95.1','each',340.00,'Black'),
  ('POOL-GATE-5X4-BLK',   'Pool Self-Closing Gate 5ft x 4ft Black CSA B95.1','each',420.00,'Black'),
  ('POOL-GATE-DBL-6X4-BLK','Pool Self-Close Double Gate 6ft x 4ft Black',    'each',680.00,'Black'),
  ('POOL-LPOST-1.875-6-BLK','Pool Terminal Post 1.875in x 6ft Black',         'each', 62.00,'Black'),
  ('POOL-TPOST-2.375-6-BLK','Pool Terminal Post 2.375in x 6ft Black',         'each', 88.00,'Black'),
  ('POOL-MESH-6GRN-11',   'Pool Enclosure Chain Link 6ft Green 11GA',         'roll', 98.00,'Green'),
  ('POOL-MESH-4BLK-11-1', 'Pool Enclosure Chain Link 4ft Black 11GA 1in Mesh','roll', 92.00,'Black'),
  ('POOL-TWIRE-BLK',      'Pool Enclosure Tension Wire Black',                'each',  7.50,'Black'),
  ('POOL-GATE-ALARM-LOUD','Pool Gate Alarm Loud 120dB CSA B95.1',             'each', 110.00,'N/A'),
  ('POOL-SIGN-MULTI',     'Pool Safety Multi-Language Sign CSA B95.1',        'each',  22.00,'N/A')
) AS v(plu, name, unit, uc, color)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- LABOUR EXPANSION — MORE RATE CODES (PLU 2651-2700)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'LABOUR')
INSERT INTO products (plu, category_id, name, unit, unit_cost, markup_pct, description)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 0.00, v.desc
FROM cat, (VALUES
  ('LAB-FOREMAN-STD',    'Labour Foreman Rate Standard',                'hour',  55.00,'Project foreman rate'),
  ('LAB-APPRENTICE',     'Labour Apprentice Rate',                      'hour',  22.00,'Apprentice fence installer'),
  ('LAB-CONCRETE-PUMP',  'Labour Concrete Pump Operator',               'hour',  48.00,'Concrete pump operation'),
  ('LAB-CRANE-OP',       'Labour Crane Operator (commercial)',          'hour',  95.00,'CWB certified crane operator'),
  ('LAB-WELDING-SS',     'Labour Stainless Steel Welding',              'hour',  92.00,'SS welding specialist'),
  ('LAB-SURVEY-LICENSED','Labour Licensed Surveyor (field time)',       'hour', 125.00,'Licensed Ontario surveyor'),
  ('LAB-INSTALL-GATE-AUTO','Labour Automated Gate Full Install',        'each', 480.00,'Complete automated gate installation'),
  ('LAB-INSTALL-GATE-MAN','Labour Manual Gate Install',                 'each',  95.00,'Manual gate hang and adjust'),
  ('LAB-CLEANUP-HAUL',   'Labour Debris Haul + Landfill Fee',          'each', 185.00,'Per truckload of old fence debris'),
  ('LAB-WINTER-PREMIUM', 'Labour Winter Premium (Oct-Apr)',             'hour',   8.00,'Additional per hour winter surcharge'),
  ('LAB-NIGHT-PREMIUM',  'Labour Night/Evening Premium',               'hour',  12.00,'Additional per hour after 6pm'),
  ('LAB-WEEKEND-PREMIUM','Labour Weekend Rate Premium',                 'hour',  15.00,'Additional per hour Saturday/Sunday'),
  ('LAB-FLAGMAN',        'Labour Traffic Control Flagman (commercial)', 'hour',  28.00,'Required for road-adjacent work'),
  ('LAB-EQUIP-OP',       'Labour Equipment Operator (skid steer etc)', 'hour',  65.00,'Equipment operation on site'),
  ('LAB-RESTORE-LAND',   'Labour Landscape Restoration post-fence',    'hour',  32.00,'Grading and seed after install')
) AS v(plu, name, unit, uc, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- MISC ADMIN / PROJECT COSTS (PLU 2701-2750)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'MISC')
INSERT INTO products (plu, category_id, name, unit, unit_cost, description)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, v.desc
FROM cat, (VALUES
  ('ADMIN-ESTIMATE-FEE',  'Estimate Preparation Fee (if not contracted)','each',  85.00,'Non-refundable estimate fee'),
  ('ADMIN-DEPOSIT-RECPT', 'Contract Deposit Receipt (30% of total)',     'each',   0.00,'30% deposit at signing'),
  ('ADMIN-INSURANCE-WCB', 'WCB Premium Allocation per $100 wages',       'each',   6.50,'Ontario WSIB rate'),
  ('ADMIN-OVERHEAD-PCT',  'Overhead Allocation (15% of subtotal)',       'each',   0.00,'Applied as percentage'),
  ('ADMIN-BOND-PERFORM',  'Performance Bond (commercial projects)',      'each', 850.00,'Bond for commercial contracts'),
  ('ADMIN-WARRANTY-1YR',  'Extended Warranty 1 Year Labour',             'each', 195.00,'1 year labour warranty package'),
  ('ADMIN-MAINTENANCE-1', 'Annual Maintenance Contract (per year)',      'each', 380.00,'Annual fence inspection + minor repair'),
  ('ADMIN-FUEL-SURCHARGE','Fuel Surcharge (equipment intensive jobs)',   'each',  65.00,'Variable fuel cost surcharge'),
  ('ADMIN-RUSH-PREMIUM',  'Rush Job Premium (within 48hrs start)',       'pct',  15.00,'15% premium for urgent projects'),
  ('ADMIN-SNOW-REMOVAL',  'Snow Removal from Work Area (winter)',        'each',  95.00,'Site clearing in winter conditions')
) AS v(plu, name, unit, uc, desc)
ON CONFLICT (plu) DO NOTHING;

COMMIT;

-- ============================================================
-- CHAIN LINK MESH — ADDITIONAL WIDTHS & GAUGES (PLU 2751-2850)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, height_ft, color, gauge, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, 'roll', v.uc, 'Chain Link', v.ht, v.color, v.gauge,
       'CAN/CGSB-138.3-2019', 'Master Halco Canada'
FROM cat, (VALUES
  ('CL-MESH-3.5GAL-9',   'Chain Link Fabric 3.5ft Galvanized 9GA',      52.00, 3.5,'Galvanized','9GA'),
  ('CL-MESH-4.5GAL-9',   'Chain Link Fabric 4.5ft Galvanized 9GA',      65.00, 4.5,'Galvanized','9GA'),
  ('CL-MESH-7GAL-9',     'Chain Link Fabric 7ft Galvanized 9GA',        99.00, 7.0,'Galvanized','9GA'),
  ('CL-MESH-9GAL-9',     'Chain Link Fabric 9ft Galvanized 9GA',       126.00, 9.0,'Galvanized','9GA'),
  ('CL-MESH-3.5BLK-9',   'Chain Link Fabric 3.5ft Black 9GA',           61.00, 3.5,'Black','9GA'),
  ('CL-MESH-4.5BLK-9',   'Chain Link Fabric 4.5ft Black 9GA',           76.00, 4.5,'Black','9GA'),
  ('CL-MESH-7BLK-9',     'Chain Link Fabric 7ft Black 9GA',            115.00, 7.0,'Black','9GA'),
  ('CL-MESH-9BLK-9',     'Chain Link Fabric 9ft Black 9GA',            146.00, 9.0,'Black','9GA'),
  ('CL-MESH-3.5GRN-9',   'Chain Link Fabric 3.5ft Green 9GA',           60.00, 3.5,'Green','9GA'),
  ('CL-MESH-4.5GRN-9',   'Chain Link Fabric 4.5ft Green 9GA',           75.00, 4.5,'Green','9GA'),
  ('CL-MESH-7GRN-9',     'Chain Link Fabric 7ft Green 9GA',            112.00, 7.0,'Green','9GA'),
  ('CL-MESH-3GAL-11-HG', 'Chain Link Fabric 3ft Galvanized 11.5GA',     35.00, 3.0,'Galvanized','11.5GA'),
  ('CL-MESH-4GAL-11-HG', 'Chain Link Fabric 4ft Galvanized 11.5GA',     46.00, 4.0,'Galvanized','11.5GA'),
  ('CL-MESH-5GAL-11-HG', 'Chain Link Fabric 5ft Galvanized 11.5GA',     58.00, 5.0,'Galvanized','11.5GA'),
  ('CL-MESH-6GAL-11-HG', 'Chain Link Fabric 6ft Galvanized 11.5GA',     70.00, 6.0,'Galvanized','11.5GA'),
  ('CL-MESH-4GAL-6-1',   'Chain Link Fabric 4ft Galvanized 6GA 1in Mesh',92.00,4.0,'Galvanized','6GA'),
  ('CL-MESH-5GAL-6-1',   'Chain Link Fabric 5ft Galvanized 6GA 1in Mesh',115.00,5.0,'Galvanized','6GA'),
  ('CL-MESH-4BLK-6-1',   'Chain Link Fabric 4ft Black 6GA 1in Mesh (Security)',108.00,4.0,'Black','6GA'),
  ('CL-MESH-5BLK-6-1',   'Chain Link Fabric 5ft Black 6GA 1in Mesh (Security)',135.00,5.0,'Black','6GA'),
  ('CL-MESH-6BLK-6',     'Chain Link Fabric 6ft Black 6GA (Security)',  130.00, 6.0,'Black','6GA'),
  ('CL-MESH-8BLK-6',     'Chain Link Fabric 8ft Black 6GA (High-Security)',168.00,8.0,'Black','6GA'),
  ('CL-MESH-10BLK-6',    'Chain Link Fabric 10ft Black 6GA (High-Security)',210.00,10.0,'Black','6GA'),
  ('CL-MESH-12BLK-6',    'Chain Link Fabric 12ft Black 6GA (High-Security)',252.00,12.0,'Black','6GA')
) AS v(plu, name, uc, ht, color, gauge)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- CHAIN LINK POSTS — ADDITIONAL GALVANIZED SIZES (PLU 2851-2920)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, diameter_in, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, 'each', v.uc, 'Chain Link', 'Galvanized', v.dia,
       'CAN/CGSB-138.3-2019', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('CL-LPOST-1.5-7-GAL',   'Line Post 1.5in OD x 7ft Galvanized',      40.00,1.5),
  ('CL-LPOST-1.5-9-GAL',   'Line Post 1.5in OD x 9ft Galvanized',      50.00,1.5),
  ('CL-LPOST-1.5-10-GAL',  'Line Post 1.5in OD x 10ft Galvanized',     55.00,1.5),
  ('CL-LPOST-1.875-4-GAL', 'Line Post 1.875in OD x 4ft Galvanized',    34.00,1.875),
  ('CL-LPOST-1.875-11-GAL','Line Post 1.875in OD x 11ft Galvanized',   82.00,1.875),
  ('CL-LPOST-1.875-12-GAL','Line Post 1.875in OD x 12ft Galvanized',   92.00,1.875),
  ('CL-LPOST-2.375-7-GAL', 'Line Post 2.375in OD x 7ft Galvanized',    72.00,2.375),
  ('CL-LPOST-2.375-9-GAL', 'Line Post 2.375in OD x 9ft Galvanized',    88.00,2.375),
  ('CL-LPOST-2.375-11-GAL','Line Post 2.375in OD x 11ft Galvanized',  108.00,2.375),
  ('CL-LPOST-2.875-6-GAL', 'Line Post 2.875in OD x 6ft Galvanized',    80.00,2.875),
  ('CL-LPOST-2.875-7-GAL', 'Line Post 2.875in OD x 7ft Galvanized',    92.00,2.875),
  ('CL-LPOST-2.875-9-GAL', 'Line Post 2.875in OD x 9ft Galvanized',   112.00,2.875),
  ('CL-LPOST-2.875-11-GAL','Line Post 2.875in OD x 11ft Galvanized',  136.00,2.875),
  ('CL-TPOST-1.875-6-GAL', 'Terminal Post 1.875in OD x 6ft Galvanized', 58.00,1.875),
  ('CL-TPOST-1.875-10-GAL','Terminal Post 1.875in OD x 10ft Galvanized',98.00,1.875),
  ('CL-TPOST-1.875-12-GAL','Terminal Post 1.875in OD x 12ft Galvanized',118.00,1.875),
  ('CL-TPOST-2.375-7-GAL', 'Terminal Post 2.375in OD x 7ft Galvanized', 92.00,2.375),
  ('CL-TPOST-2.375-10-GAL','Terminal Post 2.375in OD x 10ft Galvanized',124.00,2.375),
  ('CL-TPOST-2.375-12-GAL','Terminal Post 2.375in OD x 12ft Galvanized',148.00,2.375),
  ('CL-TPOST-2.875-7-GAL', 'Terminal Post 2.875in OD x 7ft Galvanized',128.00,2.875),
  ('CL-TPOST-2.875-9-GAL', 'Terminal Post 2.875in OD x 9ft Galvanized',158.00,2.875),
  ('CL-TPOST-4-8-GAL',     'Terminal Post 4in OD x 8ft Galvanized',    198.00,4.0),
  ('CL-TPOST-4-9-GAL',     'Terminal Post 4in OD x 9ft Galvanized',    222.00,4.0)
) AS v(plu, name, uc, dia)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- VINYL FENCE — HOMELAND COLORS/SIZES EXPANSION (PLU 2921-2990)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'VINYL-PVC')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, supplier_sku, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'Vinyl', v.color, v.ssku, 'Homeland Vinyl Products'
FROM cat, (VALUES
  ('HVP-POST-5X5-8-WHT',  'Vinyl Post 5x5 x 8ft White',                'each',  68.00,'White','HVP-5x5-8-W'),
  ('HVP-POST-5X5-10-TAN', 'Vinyl Post 5x5 x 10ft Tan',                 'each',  78.00,'Tan',  'HVP-5x5-10-T'),
  ('HVP-POST-6X6-8-WHT',  'Vinyl Post 6x6 x 8ft White',                'each',  95.00,'White','HVP-6x6-8-W'),
  ('HVP-POST-4X4-10-TAN', 'Vinyl Post 4x4 x 10ft Tan',                 'each',  56.00,'Tan',  'HVP-4x4-10-T'),
  ('HVP-POST-4X4-10-GRY', 'Vinyl Post 4x4 x 10ft Gray',                'each',  56.00,'Gray', 'HVP-4x4-10-G'),
  ('HVP-POST-4X4-10-BRN', 'Vinyl Post 4x4 x 10ft Brown',               'each',  56.00,'Brown','HVP-4x4-10-B'),
  ('HVP-RAIL-2X4-8-BRN',  'Vinyl Rail 2x4 x 8ft Brown',                'each',  18.00,'Brown','HVP-2x4-8-B'),
  ('HVP-RAIL-2X4-10-TAN', 'Vinyl Rail 2x4 x 10ft Tan',                 'each',  22.00,'Tan',  'HVP-2x4-10-T'),
  ('HVP-RAIL-2X4-10-GRY', 'Vinyl Rail 2x4 x 10ft Gray',                'each',  22.00,'Gray', 'HVP-2x4-10-G'),
  ('HVP-RAIL-2X4-10-BRN', 'Vinyl Rail 2x4 x 10ft Brown',               'each',  22.00,'Brown','HVP-2x4-10-B'),
  ('HVP-BOARD-PRI-60-BRK','Vinyl Privacy Board 5.625in x 60in Bark',   'each',   6.50,'Bark', 'HVP-BOARD-PRIVACY-60-BRK'),
  ('HVP-BOARD-PRI-60-SAG','Vinyl Privacy Board 5.625in x 60in Sage',   'each',   6.50,'Sage', 'HVP-BOARD-PRIVACY-60-SAG'),
  ('HVP-BOARD-PRI-60-SLT','Vinyl Privacy Board 5.625in x 60in Slate',  'each',   6.50,'Slate','HVP-BOARD-PRIVACY-60-SLT'),
  ('HVP-BOARD-SEMI-60-TAN','Vinyl Semi-Privacy Board 5.625in x 60in Tan','each', 6.50,'Tan',  'HVP-BOARD-SEMI-60-T'),
  ('HVP-BOARD-SEMI-60-GRY','Vinyl Semi-Privacy Board 5.625in x 60in Gray','each',6.50,'Gray', 'HVP-BOARD-SEMI-60-G'),
  ('HVP-BOARD-SEMI-60-BRN','Vinyl Semi-Privacy Board 5.625in x 60in Brown','each',6.50,'Brown','HVP-BOARD-SEMI-60-B'),
  ('HVP-BOARD-PIC-60-GRY','Vinyl Picket 3.5in x 60in Gray',            'each',   4.80,'Gray', 'HVP-BOARD-PICKET-60-G'),
  ('HVP-BOARD-PIC-60-BRN','Vinyl Picket 3.5in x 60in Brown',           'each',   4.80,'Brown','HVP-BOARD-PICKET-60-B'),
  ('HVP-CAP-4X4-GRY',     'Vinyl Post Cap 4x4 Gray',                   'each',   4.50,'Gray', 'HVP-CAP-4x4-G'),
  ('HVP-CAP-4X4-BRN',     'Vinyl Post Cap 4x4 Brown',                  'each',   4.50,'Brown','HVP-CAP-4x4-B'),
  ('HVP-CAP-5X5-TAN',     'Vinyl Post Cap 5x5 Tan',                    'each',   6.00,'Tan',  'HVP-CAP-5x5-T'),
  ('HVP-GATE-4X5-GRY',    'Vinyl Gate 4ft x 5ft Gray Privacy',         'each', 385.00,'Gray', 'HVP-GATE-4x5-G'),
  ('HVP-GATE-4X5-BRN',    'Vinyl Gate 4ft x 5ft Brown Privacy',        'each', 385.00,'Brown','HVP-GATE-4x5-B'),
  ('HVP-GATE-DBL-8X5-TAN','Vinyl Double Gate 8ft x 5ft Tan',           'each', 720.00,'Tan',  'HVP-GATE-DBL-8x5-T'),
  ('HVP-GATE-DBL-8X5-GRY','Vinyl Double Gate 8ft x 5ft Gray',          'each', 720.00,'Gray', 'HVP-GATE-DBL-8x5-G'),
  ('HVP-PANEL-SEMI-5X8-WHT','Vinyl Semi-Privacy Panel 5ft x 8ft White','each', 130.00,'White','HVP-PANEL-SEMI-5x8-W'),
  ('HVP-PANEL-PIC-3X8-WHT','Vinyl Picket Panel 3ft x 8ft White',       'each',  95.00,'White','HVP-PANEL-PIC-3x8-W')
) AS v(plu, name, unit, uc, color, ssku)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- ADDITIONAL FASTENERS — BULK PACKS (PLU 2991-3050)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'FASTENERS')
INSERT INTO products (plu, category_id, name, unit, unit_cost, canadian_std)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'CSA G40.8'
FROM cat, (VALUES
  ('FST-LAGBOLT-0.5X3-50',  'Lag Bolt 0.5in x 3in Galvanized (Box 50)', 'box',  28.00),
  ('FST-LAGBOLT-0.5X4-50',  'Lag Bolt 0.5in x 4in Galvanized (Box 50)', 'box',  32.00),
  ('FST-LAGBOLT-0.75X3-25', 'Lag Bolt 0.75in x 3in Galvanized (Box 25)','box',  20.00),
  ('FST-LAGBOLT-0.75X4-25', 'Lag Bolt 0.75in x 4in Galvanized (Box 25)','box',  24.00),
  ('FST-CARBOLT-0.5X3-50',  'Carriage Bolt 0.5in x 3in Galvanized (Box 50)','box',28.00),
  ('FST-CARBOLT-0.75X3-25', 'Carriage Bolt 0.75in x 3in Galvanized (Box 25)','box',18.00),
  ('FST-NUT-0.5-100',       'Hex Nut 0.5in Galvanized (Box 100)',       'box',  15.00),
  ('FST-NUT-0.75-100',      'Hex Nut 0.75in Galvanized (Box 100)',      'box',  22.00),
  ('FST-WASHER-0.5-100',    'Flat Washer 0.5in Galvanized (Box 100)',   'box',  10.00),
  ('FST-WASHER-0.75-100',   'Flat Washer 0.75in Galvanized (Box 100)', 'box',  15.00),
  ('FST-SCREW-2.5-5LB',     'Galvanized Screw 2.5in (5lb box)',         'box',  30.00),
  ('FST-NAIL-3.5-5LB',      'Galvanized Ring Shank Nail 3.5in (5lb)',  'box',  22.00),
  ('FST-NAIL-2-5LB',        'Galvanized Common Nail 2in (5lb)',         'box',  18.00),
  ('FST-RIVET-POP-3/16-100','Pop Rivet 3/16in Aluminum (Box 100)',     'box',   8.50),
  ('FST-WOODSCREW-SS-3-100','Stainless Wood Screw 3in #10 (Box 100)',   'box',  18.00),
  ('FST-WOODSCREW-SS-3.5-100','Stainless Wood Screw 3.5in #10 (Box 100)','box', 22.00),
  ('FST-CONC-SCREW-3-25',   'Concrete Screw 3/16in x 3in Tapcon (25)', 'box',  18.00),
  ('FST-CONC-SCREW-4-25',   'Concrete Screw 3/16in x 4in Tapcon (25)', 'box',  22.00),
  ('FST-PINCHBOLT-KIT',     'Pinch Bolt Kit for Brace Assembly',       'set',   8.50),
  ('FST-SCREWCUP-100',      'Screw Cup Washers SS (Box 100)',           'box',  12.00)
) AS v(plu, name, unit, uc)
ON CONFLICT (plu) DO NOTHING;

COMMIT;

-- ============================================================
-- FINISHING BATCH — MORE WOOD STAINS & METAL PAINTS (PLU 3051-3100)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'FINISHING')
INSERT INTO products (plu, category_id, name, unit, unit_cost, description)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, v.desc
FROM cat, (VALUES
  ('FIN-STAIN-DARK-1',      'Dark Walnut Wood Stain 1 Gallon Exterior',    'gallon', 40.00,'Dark walnut exterior wood stain'),
  ('FIN-STAIN-GREY-1',      'Driftwood Grey Wood Stain 1 Gallon',          'gallon', 40.00,'Gray tone exterior wood stain'),
  ('FIN-STAIN-TEAK-1',      'Teak Wood Stain 1 Gallon Exterior',           'gallon', 40.00,'Teak oil-based stain'),
  ('FIN-PAINT-BROWN-1',     'Exterior Metal Paint Espresso Brown 1 Gallon','gallon', 36.00,'Brown metal fence paint'),
  ('FIN-PAINT-GREY-1',      'Exterior Metal Paint Charcoal Grey 1 Gallon', 'gallon', 36.00,'Charcoal grey metal paint'),
  ('FIN-PAINT-GREEN-DARK-1','Exterior Metal Paint Dark Green 1 Gallon',    'gallon', 36.00,'Dark green metal paint'),
  ('FIN-WOOD-OIL-1',        'Teak Oil Wood Finish 1 Litre',                'litre',  28.00,'Penetrating wood oil finish'),
  ('FIN-WOOD-WAX-1',        'Exterior Wood Wax 1 Litre',                   'litre',  32.00,'Beeswax wood protector'),
  ('FIN-ANTIGRAFFITI-1',    'Anti-Graffiti Coating 1 Gallon',              'gallon', 62.00,'For commercial fence panels'),
  ('FIN-RUSTPATCH-8OZ',     'Rust Patch Filler 8oz Tube',                  'tube',   14.00,'Rust repair and spot treatment'),
  ('FIN-CAULK-SILICONE-WHT','White Silicone Caulk 10oz (Vinyl fences)',   'tube',   10.00,'White sealant for vinyl'),
  ('FIN-CAULK-CLEAR',       'Clear Silicone Caulk 10oz',                   'tube',   10.00,'Clear weatherproof caulk'),
  ('FIN-TAPE-BUTYL-50',     'Butyl Tape Self-Sealing 1in x 50ft',          'roll',   22.00,'Waterproof sealing tape'),
  ('FIN-MESH-REPAIR-KIT',   'Chain Link Mesh Repair Kit (patch)',           'each',   18.00,'Spot repair for chain link mesh'),
  ('FIN-WOOD-REPAIR-KIT',   'Wood Fence Board Repair Kit',                  'each',   24.00,'Board filler and patch kit'),
  ('FIN-VINYL-REPAIR-KIT',  'Vinyl Fence Repair Kit (adhesive + fill)',    'each',   28.00,'Crack and chip repair for vinyl')
) AS v(plu, name, unit, uc, desc)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- WROUGHT IRON — REPLACEMENT PARTS & HARDWARE (PLU 3101-3150)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'WROUGHT-IRON')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, supplier_sku, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'Wrought Iron', v.ssku, 'Cloutier Direct'
FROM cat, (VALUES
  ('CD-PICKET-SPEAR-72',   'Cloutier Picket Spear-Point 0.75sq x 72in',  'each',  15.00,'CD-PICKET-SPEAR-72'),
  ('CD-PICKET-FLAT-72',    'Cloutier Picket Flat-Top 0.75sq x 72in',     'each',  14.00,'CD-PICKET-FLAT-72'),
  ('CD-PICKET-BALL-72',    'Cloutier Picket Ball-Top 0.75sq x 72in',     'each',  16.00,'CD-PICKET-BALL-72'),
  ('CD-RAIL-0.75SQ-10',    'Cloutier Rail 0.75sq Tube x 10ft',           'each',  30.00,'CD-RAIL-0.75SQ-10'),
  ('CD-RAIL-0.75SQ-12',    'Cloutier Rail 0.75sq Tube x 12ft',           'each',  36.00,'CD-RAIL-0.75SQ-12'),
  ('CD-RAIL-1SQ-10',       'Cloutier Rail 1sq Tube x 10ft Heavy',        'each',  40.00,'CD-RAIL-1SQ-10'),
  ('CD-POST-1.5-10',       'Cloutier Wrought Iron Post 1.5sq x 10ft',    'each', 145.00,'CD-POST-1.5-10'),
  ('CD-POST-1.75-10',      'Cloutier Terminal Post 1.75sq x 10ft',       'each', 178.00,'CD-POST-1.75-10'),
  ('CD-PANEL-3X5-SPEAR',   'Cloutier Panel 3ft x 5ft Pre-Assembled Spear','each',285.00,'CD-PANEL-3x5-SPEAR'),
  ('CD-PANEL-5X4-SPEAR',   'Cloutier Panel 5ft x 4ft Pre-Assembled Spear','each',340.00,'CD-PANEL-5x4-SPEAR'),
  ('CD-PANEL-6X5-BALL',    'Cloutier Panel 6ft x 5ft Pre-Assembled Ball','each', 420.00,'CD-PANEL-6x5-BALL'),
  ('CD-GATE-5X4-BALL',     'Cloutier Gate 5ft x 4ft Ball-Top',           'each', 680.00,'CD-GATE-5x4-BALL'),
  ('CD-GATE-6X4-FLAT',     'Cloutier Gate 6ft x 4ft Flat-Top',           'each', 720.00,'CD-GATE-6x4-FLAT'),
  ('CD-GATE-DBL-14X5',     'Cloutier Double Gate 14ft x 5ft Ornamental', 'each',1850.00,'CD-GATE-DBL-14x5'),
  ('CD-GATE-DBL-16X5',     'Cloutier Double Gate 16ft x 5ft Ornamental', 'each',2200.00,'CD-GATE-DBL-16x5'),
  ('CD-HINGE-BUTT-4IN',    'Cloutier Butt Hinge 4in Galvanized',         'each',  24.00,'CD-HINGE-BUTT-4'),
  ('CD-LATCH-SLIDE',       'Cloutier Slide Bolt Latch',                   'each',  38.00,'CD-LATCH-SLIDE'),
  ('CD-POST-BASE-1.5',     'Cloutier Post Base Plate 1.5sq for Concrete','each',  22.00,'CD-BASE-1.5'),
  ('CD-POST-BASE-2',       'Cloutier Post Base Plate 2sq for Concrete',  'each',  30.00,'CD-BASE-2')
) AS v(plu, name, unit, uc, ssku)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- MISC FINAL BATCH — SUNDRIES (PLU 3151-3200)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'MISC')
INSERT INTO products (plu, category_id, name, unit, unit_cost, description)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, v.desc
FROM cat, (VALUES
  ('MISC-REFLECTOR-POST',   'Post Reflector White (for night visibility)', 'each',  5.50,'Highway style post reflectors'),
  ('MISC-MARKER-BALL',      'Aerial Marker Ball for Cable Fence',          'each', 18.00,'Orange ball for cable visibility'),
  ('MISC-NUMBERING-PIN',    'Pin Flag Numbered 1-100 Set',                 'set',  28.00,'Post layout numbering flags'),
  ('MISC-WHEEL-MEASURE',    'Measuring Wheel 400ft',                       'each', 55.00,'Distance measurement tool'),
  ('MISC-BLUEPRINT-SET',    'Site Blueprint Print-Out (large format)',     'each', 22.00,'Site plan printing per sheet'),
  ('MISC-TIEBACK-WIRE',     'Tie-Back Wire Assembly for Unstable Soil',   'each', 35.00,'Anchoring for soft ground'),
  ('MISC-HELICAL-PIER',     'Helical Pier Post Anchor 4ft (no dig)',      'each', 85.00,'Screw-in post anchor no concrete'),
  ('MISC-SANDBAG-50LB',     'Sandbag 50lb for Temporary Weight',          'each', 12.00,'Ballast for temporary fence bases'),
  ('MISC-DRAINPIPE-4IN',    'Drainage Pipe 4in x 10ft Perforated',        'each', 28.00,'French drain adjacent to fence'),
  ('MISC-DEADMAN-ANCHOR',   'Deadman Anchor Plate 12in x 12in',           'each', 38.00,'Anchor plate for soft or sandy soil'),
  ('MISC-GROUND-SPIKE-5',   'Ground Spike 5ft for Tube Posts',            'each', 22.00,'Drive-in spike anchor no concrete'),
  ('MISC-GROUND-SPIKE-7',   'Ground Spike 7ft for Heavy Posts',           'each', 32.00,'Heavy drive-in spike anchor'),
  ('MISC-CAUTION-TAPE',     'Caution/Do Not Enter Tape 1000ft',           'roll',  8.50,'Site safety tape'),
  ('MISC-ORANGE-CONE',      'Traffic Cone 28in Orange (each)',             'each', 22.00,'Site traffic control cone'),
  ('MISC-BARRICADE-TAPE',   'Yellow Barricade Tape 1000ft',               'roll',  6.50,'Hazard/barricade marking tape'),
  ('MISC-WATER-LEVEL-50',   'Water Level 50ft Hose',                      'each', 18.00,'For leveling post tops'),
  ('MISC-CHALK-LINE-100',   'Chalk Line Reel 100ft Blue',                 'each', 12.00,'Fence line layout chalk'),
  ('MISC-TRANSIT-TRIPOD',   'Survey Tripod for Level/Transit (rental)',   'day',  28.00,'For professional layout'),
  ('MISC-TEMPLATE-POST',    'Post Template Frame for Spacing',            'each', 22.00,'Ensures consistent post spacing'),
  ('MISC-GUIDE-BRACKET',    'Post Alignment Guide Bracket Set',           'set',  32.00,'Keeps posts aligned during pour')
) AS v(plu, name, unit, uc, desc)
ON CONFLICT (plu) DO NOTHING;

COMMIT;

-- ============================================================
-- FINAL BATCH — REACHING 950+ PRODUCTS (PLU 3201-3250)
-- ============================================================
WITH cat AS (SELECT id FROM product_categories WHERE code = 'CHAIN-LINK')
INSERT INTO products (plu, category_id, name, unit, unit_cost, fence_type, color, canadian_std, supplier)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'Chain Link', v.color,
       'CAN/CGSB-138.3-2019', 'Canadian Fence Supply'
FROM cat, (VALUES
  ('CL-WIRE-9GA-200FT',   'Wire Galvanized 9GA x 200ft (coil)',         'coil',  22.00,'Galvanized'),
  ('CL-WIRE-11GA-200FT',  'Wire Galvanized 11GA x 200ft (coil)',        'coil',  16.00,'Galvanized'),
  ('CL-PCAP-1.5-DOME-G',  'Post Cap 1.5in Dome Style Galvanized',      'each',   1.60,'Galvanized'),
  ('CL-PCAP-1.875-DOME-G','Post Cap 1.875in Dome Style Galvanized',    'each',   1.80,'Galvanized'),
  ('CL-PCAP-2.375-DOME-G','Post Cap 2.375in Dome Style Galvanized',    'each',   2.20,'Galvanized'),
  ('CL-GATE-4X3-GAL',     'Chain Link Swing Gate 4ft x 3ft Galvanized','each', 165.00,'Galvanized'),
  ('CL-GATE-4X7-GAL',     'Chain Link Swing Gate 4ft x 7ft Galvanized','each', 320.00,'Galvanized'),
  ('CL-GATE-4X8-BLK',     'Chain Link Swing Gate 4ft x 8ft Black',     'each', 460.00,'Black'),
  ('CL-GATE-6X4-BLK',     'Chain Link Swing Gate 6ft x 4ft Black',     'each', 345.00,'Black'),
  ('CL-GATE-6X5-BLK',     'Chain Link Swing Gate 6ft x 5ft Black',     'each', 405.00,'Black'),
  ('CL-MESH-3BRN-11',     'Chain Link Fabric 3ft Brown 11GA',           'roll',  48.00,'Brown'),
  ('CL-MESH-4BRN-11',     'Chain Link Fabric 4ft Brown 11GA',           'roll',  62.00,'Brown'),
  ('CL-MESH-5BRN-11',     'Chain Link Fabric 5ft Brown 11GA',           'roll',  76.00,'Brown'),
  ('CL-MESH-6BRN-11',     'Chain Link Fabric 6ft Brown 11GA',           'roll',  90.00,'Brown'),
  ('CL-SLAT-ALUM-GRN',    'Chain Link Privacy Slat Aluminum Green',    'slat',   1.10,'Green'),
  ('CL-WINDSCREEN-8FT',   'Windscreen Privacy Fabric 8ft Green 10ft',  'roll',  42.00,'Green'),
  ('CL-WINDSCREEN-BLK-6', 'Windscreen Privacy Fabric 6ft Black 10ft',  'roll',  33.00,'Black'),
  ('CL-WINDSCREEN-BLK-8', 'Windscreen Privacy Fabric 8ft Black 10ft',  'roll',  42.00,'Black')
) AS v(plu, name, unit, uc, color)
ON CONFLICT (plu) DO NOTHING;

WITH cat AS (SELECT id FROM product_categories WHERE code = 'FASTENERS')
INSERT INTO products (plu, category_id, name, unit, unit_cost, canadian_std)
SELECT v.plu, cat.id, v.name, v.unit, v.uc, 'CSA G40.8'
FROM cat, (VALUES
  ('FST-BOLT-ANCHOR-0.5X3','Anchor Bolt J-Hook 0.5in x 3in Galvanized',   'each',  2.20),
  ('FST-BOLT-ANCHOR-0.75X4','Anchor Bolt J-Hook 0.75in x 4in Galvanized', 'each',  3.40),
  ('FST-NUT-SS-0.5',        'Stainless Steel Nut 0.5in A2-70',             'each',  0.40),
  ('FST-NUT-SS-0.75',       'Stainless Steel Nut 0.75in A2-70',            'each',  0.60),
  ('FST-WASHER-SS-0.5',     'Stainless Steel Washer 0.5in A2',             'each',  0.22),
  ('FST-WASHER-SS-0.75',    'Stainless Steel Washer 0.75in A2',            'each',  0.35),
  ('FST-BOLT-SS-0.5X3',     'Stainless Steel Bolt 0.5in x 3in A2-70',    'each',  0.95),
  ('FST-BOLT-SS-0.75X3',    'Stainless Steel Bolt 0.75in x 3in A2-70',   'each',  1.40),
  ('FST-MASONRY-NAIL-3',    'Masonry Cut Nail 3in Galvanized (per lb)',   'lb',    5.50),
  ('FST-SPIRAL-NAIL-3.5',   'Spiral Shank Nail 3.5in Galvanized (per lb)','lb',   5.80)
) AS v(plu, name, unit, uc)
ON CONFLICT (plu) DO NOTHING;

COMMIT;
