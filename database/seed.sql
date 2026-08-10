-- ============================================================
-- FENCE DEPOT FENCE ESTIMATOR
-- SEED DATA – Products / Inventory (950+ SKUs)
-- ============================================================

-- First, clear existing data (for re-seeding)
-- DELETE FROM products;

-- ============================================================
-- CHAIN LINK FABRIC
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('CL-FABRIC-3-11-GAL',  'Chain Link Fabric 3ft 11ga Galvanized 50ft Roll',   'Chain Link', 'Fabric', 'Roll',  32.50,  42.99),
('CL-FABRIC-4-11-GAL',  'Chain Link Fabric 4ft 11ga Galvanized 50ft Roll',   'Chain Link', 'Fabric', 'Roll',  42.50,  55.99),
('CL-FABRIC-5-11-GAL',  'Chain Link Fabric 5ft 11ga Galvanized 50ft Roll',   'Chain Link', 'Fabric', 'Roll',  48.75,  63.99),
('CL-FABRIC-6-11-GAL',  'Chain Link Fabric 6ft 11ga Galvanized 50ft Roll',   'Chain Link', 'Fabric', 'Roll',  56.00,  72.99),
('CL-FABRIC-8-11-GAL',  'Chain Link Fabric 8ft 11ga Galvanized 50ft Roll',   'Chain Link', 'Fabric', 'Roll',  72.00,  93.99),
('CL-FABRIC-10-11-GAL', 'Chain Link Fabric 10ft 11ga Galvanized 50ft Roll',  'Chain Link', 'Fabric', 'Roll',  88.00, 114.99),
('CL-FABRIC-12-11-GAL', 'Chain Link Fabric 12ft 11ga Galvanized 50ft Roll',  'Chain Link', 'Fabric', 'Roll', 104.00, 134.99),
('CL-FABRIC-3-9-GAL',   'Chain Link Fabric 3ft 9ga Galvanized 50ft Roll',    'Chain Link', 'Fabric', 'Roll',  41.00,  53.99),
('CL-FABRIC-4-9-GAL',   'Chain Link Fabric 4ft 9ga Galvanized 50ft Roll',    'Chain Link', 'Fabric', 'Roll',  54.00,  70.99),
('CL-FABRIC-5-9-GAL',   'Chain Link Fabric 5ft 9ga Galvanized 50ft Roll',    'Chain Link', 'Fabric', 'Roll',  62.00,  80.99),
('CL-FABRIC-6-9-GAL',   'Chain Link Fabric 6ft 9ga Galvanized 50ft Roll',    'Chain Link', 'Fabric', 'Roll',  72.00,  93.99),
('CL-FABRIC-4-11-BLK',  'Chain Link Fabric 4ft 11ga Black Vinyl 50ft Roll',  'Chain Link', 'Fabric', 'Roll',  58.00,  75.99),
('CL-FABRIC-5-11-BLK',  'Chain Link Fabric 5ft 11ga Black Vinyl 50ft Roll',  'Chain Link', 'Fabric', 'Roll',  68.00,  88.99),
('CL-FABRIC-6-11-BLK',  'Chain Link Fabric 6ft 11ga Black Vinyl 50ft Roll',  'Chain Link', 'Fabric', 'Roll',  78.50, 101.99),
('CL-FABRIC-8-11-BLK',  'Chain Link Fabric 8ft 11ga Black Vinyl 50ft Roll',  'Chain Link', 'Fabric', 'Roll', 102.00, 132.99),
('CL-FABRIC-4-11-GRN',  'Chain Link Fabric 4ft 11ga Green Vinyl 50ft Roll',  'Chain Link', 'Fabric', 'Roll',  56.00,  72.99),
('CL-FABRIC-6-11-GRN',  'Chain Link Fabric 6ft 11ga Green Vinyl 50ft Roll',  'Chain Link', 'Fabric', 'Roll',  76.50,  99.99),
('CL-FABRIC-4-11-BRN',  'Chain Link Fabric 4ft 11ga Brown Vinyl 50ft Roll',  'Chain Link', 'Fabric', 'Roll',  56.00,  72.99),
('CL-FABRIC-6-11-BRN',  'Chain Link Fabric 6ft 11ga Brown Vinyl 50ft Roll',  'Chain Link', 'Fabric', 'Roll',  76.50,  99.99),
('CL-FABRIC-6-11.5-GAL','Chain Link Fabric 6ft 11.5ga Galvanized 50ft Roll', 'Chain Link', 'Fabric', 'Roll',  48.00,  62.99);

-- ============================================================
-- TERMINAL POSTS
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('POST-TERM-2.5-GAL',  'Terminal Post 2-1/2" x 8ft Galvanized',  'Chain Link', 'Posts', 'Each',  18.50,  24.99),
('POST-TERM-2.5-10-GAL','Terminal Post 2-1/2" x 10ft Galvanized', 'Chain Link', 'Posts', 'Each',  22.00,  28.99),
('POST-TERM-3-GAL',    'Terminal Post 3" x 8ft Galvanized',      'Chain Link', 'Posts', 'Each',  24.00,  31.99),
('POST-TERM-3-10-GAL', 'Terminal Post 3" x 10ft Galvanized',     'Chain Link', 'Posts', 'Each',  28.00,  36.99),
('POST-TERM-4-GAL',    'Terminal Post 4" x 8ft Galvanized',      'Chain Link', 'Posts', 'Each',  32.00,  41.99),
('POST-TERM-4-10-GAL', 'Terminal Post 4" x 10ft Galvanized',     'Chain Link', 'Posts', 'Each',  38.00,  49.99),
('POST-TERM-2.5-BLK',  'Terminal Post 2-1/2" x 8ft Black',       'Chain Link', 'Posts', 'Each',  22.00,  28.99),
('POST-TERM-3-BLK',    'Terminal Post 3" x 8ft Black',           'Chain Link', 'Posts', 'Each',  28.50,  37.99),
('POST-TERM-4-BLK',    'Terminal Post 4" x 8ft Black',           'Chain Link', 'Posts', 'Each',  38.00,  49.99);

-- ============================================================
-- LINE POSTS
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('POST-LINE-1.66-GAL',  'Line Post 1-5/8" x 8ft Galvanized',    'Chain Link', 'Posts', 'Each',  11.50,  14.99),
('POST-LINE-1.66-10-GAL','Line Post 1-5/8" x 10ft Galvanized',  'Chain Link', 'Posts', 'Each',  13.50,  17.99),
('POST-LINE-2-GAL',     'Line Post 2" x 8ft Galvanized',        'Chain Link', 'Posts', 'Each',  14.75,  19.99),
('POST-LINE-2-10-GAL',  'Line Post 2" x 10ft Galvanized',       'Chain Link', 'Posts', 'Each',  17.25,  22.99),
('POST-LINE-2.5-GAL',   'Line Post 2-1/2" x 8ft Galvanized',   'Chain Link', 'Posts', 'Each',  18.00,  23.99),
('POST-LINE-2.5-10-GAL','Line Post 2-1/2" x 10ft Galvanized',  'Chain Link', 'Posts', 'Each',  21.00,  27.99),
('POST-LINE-1.66-BLK',  'Line Post 1-5/8" x 8ft Black',        'Chain Link', 'Posts', 'Each',  14.00,  18.99),
('POST-LINE-2-BLK',     'Line Post 2" x 8ft Black',            'Chain Link', 'Posts', 'Each',  18.25,  24.99),
('POST-LINE-2.5-BLK',   'Line Post 2-1/2" x 8ft Black',        'Chain Link', 'Posts', 'Each',  22.00,  28.99);

-- ============================================================
-- TOP RAIL
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('RAIL-TOP-1.66-GAL',   'Top Rail 1-5/8" Galvanized 21ft Stick',  'Chain Link', 'Rail', 'Stick', 16.50,  21.99),
('RAIL-TOP-2-GAL',      'Top Rail 2" Galvanized 21ft Stick',      'Chain Link', 'Rail', 'Stick', 21.00,  27.99),
('RAIL-TOP-1.66-BLK',   'Top Rail 1-5/8" Black 21ft Stick',       'Chain Link', 'Rail', 'Stick', 20.00,  25.99),
('RAIL-TOP-2-BLK',      'Top Rail 2" Black 21ft Stick',           'Chain Link', 'Rail', 'Stick', 25.50,  33.99),
('RAIL-MID-1.66-GAL',   'Mid Rail 1-5/8" Galvanized 21ft Stick',  'Chain Link', 'Rail', 'Stick', 16.50,  21.99),
('RAIL-MID-2-GAL',      'Mid Rail 2" Galvanized 21ft Stick',      'Chain Link', 'Rail', 'Stick', 21.00,  27.99);

-- ============================================================
-- TENSION WIRE
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('WIRE-TENSION-GAL',    'Tension Wire 12.5ga Galvanized 1000ft Roll',    'Chain Link', 'Wire', 'Roll',  38.00,  49.99),
('WIRE-TENSION-BLK',    'Tension Wire 12.5ga Black Vinyl 1000ft Roll',   'Chain Link', 'Wire', 'Roll',  45.00,  58.99),
('WIRE-TENSION-GRN',    'Tension Wire 12.5ga Green Vinyl 1000ft Roll',   'Chain Link', 'Wire', 'Roll',  45.00,  58.99),
('WIRE-BARBED',         'Barbed Wire 12.5ga 2pt 1320ft Roll',            'Chain Link', 'Wire', 'Roll',  48.00,  62.99),
('WIRE-BARBED-4PT',     'Barbed Wire 12.5ga 4pt 1320ft Roll',            'Chain Link', 'Wire', 'Roll',  52.00,  67.99);

-- ============================================================
-- TIE WIRE
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('WIRE-TIE-GAL',        'Tie Wire Galvanized Bag/100',  'Chain Link', 'Hardware', 'Bag',   7.50,   9.99),
('WIRE-TIE-BLK',        'Tie Wire Black Vinyl Bag/100', 'Chain Link', 'Hardware', 'Bag',   8.50,  11.99);

-- ============================================================
-- POST CAPS
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('CAP-LINE-GAL',        'Line Post Cap 1-5/8" Galvanized',         'Chain Link', 'Hardware', 'Each',  0.85,   1.49),
('CAP-LINE-BLK',        'Line Post Cap 1-5/8" Black',              'Chain Link', 'Hardware', 'Each',  0.95,   1.59),
('CAP-TERM-GAL',        'Terminal Post Cap 2-1/2" Galvanized',     'Chain Link', 'Hardware', 'Each',  1.10,   1.79),
('CAP-TERM-BLK',        'Terminal Post Cap 2-1/2" Black',          'Chain Link', 'Hardware', 'Each',  1.25,   1.99),
('CAP-TERM-3-GAL',      'Terminal Post Cap 3" Galvanized',         'Chain Link', 'Hardware', 'Each',  1.30,   2.09),
('CAP-RAIL-GAL',        'Top Rail End Cap Galvanized',             'Chain Link', 'Hardware', 'Each',  0.65,   0.99);

-- ============================================================
-- TENSION & BRACE BANDS
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('BAND-TENSION-GAL',    'Tension Band Galvanized Bag/10',           'Chain Link', 'Hardware', 'Bag',   5.50,   7.99),
('BAND-TENSION-BLK',    'Tension Band Black Bag/10',                'Chain Link', 'Hardware', 'Bag',   6.75,   9.49),
('BAND-BRACE-GAL',      'Brace Band 2-1/2" Galvanized Bag/10',     'Chain Link', 'Hardware', 'Bag',   4.25,   5.99),
('BAND-BRACE-3-GAL',    'Brace Band 3" Galvanized Bag/10',         'Chain Link', 'Hardware', 'Bag',   5.00,   6.99),
('BAND-BRACE-4-GAL',    'Brace Band 4" Galvanized Bag/10',         'Chain Link', 'Hardware', 'Bag',   6.50,   8.99);

-- ============================================================
-- RAIL ENDS
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('RAIL-END-GAL',        'Rail End 1-5/8" Galvanized Bag/10',       'Chain Link', 'Hardware', 'Bag',   6.00,   7.99),
('RAIL-END-BLK',        'Rail End 1-5/8" Black Bag/10',            'Chain Link', 'Hardware', 'Bag',   7.25,   9.99),
('RAIL-END-2-GAL',      'Rail End 2" Galvanized Bag/10',           'Chain Link', 'Hardware', 'Bag',   7.00,   9.49);

-- ============================================================
-- LOOP CAPS
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('LOOP-CAP-1.66-GAL',   'Loop Cap 1-5/8" Galvanized Each',         'Chain Link', 'Hardware', 'Each',  1.10,   1.59),
('LOOP-CAP-1.66-BLK',   'Loop Cap 1-5/8" Black Each',              'Chain Link', 'Hardware', 'Each',  1.25,   1.79),
('LOOP-CAP-2-GAL',      'Loop Cap 2" Galvanized Each',             'Chain Link', 'Hardware', 'Each',  1.35,   1.99);

-- ============================================================
-- CONCRETE
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('CONCRETE-80',         'Concrete Mix 80lb Bag',        'Concrete', 'Mix', 'Bag',   6.25,   8.99),
('CONCRETE-60',         'Concrete Mix 60lb Bag',        'Concrete', 'Mix', 'Bag',   5.25,   7.49),
('CONCRETE-50',         'Concrete Mix 50lb Bag',        'Concrete', 'Mix', 'Bag',   4.75,   6.99),
('RAPID-SET-50',        'Rapid Set Concrete 50lb Bag',  'Concrete', 'Mix', 'Bag',   8.50,  11.99);

-- ============================================================
-- WALK GATES – CHAIN LINK
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('GATE-WALK-3-GAL',     'Walk Gate 3ft x 4ft Galvanized',          'Chain Link', 'Gates', 'Each',  72.00,  94.99),
('GATE-WALK-4-GAL',     'Walk Gate 4ft x 4ft Galvanized',          'Chain Link', 'Gates', 'Each',  85.00, 109.99),
('GATE-WALK-4-6-GAL',   'Walk Gate 4ft x 6ft Galvanized',          'Chain Link', 'Gates', 'Each',  98.00, 127.99),
('GATE-WALK-5-GAL',     'Walk Gate 5ft x 4ft Galvanized',          'Chain Link', 'Gates', 'Each',  95.00, 123.99),
('GATE-WALK-3-BLK',     'Walk Gate 3ft x 4ft Black',               'Chain Link', 'Gates', 'Each',  96.00, 124.99),
('GATE-WALK-4-BLK',     'Walk Gate 4ft x 4ft Black',               'Chain Link', 'Gates', 'Each', 110.00, 142.99),
('GATE-WALK-4-6-BLK',   'Walk Gate 4ft x 6ft Black',               'Chain Link', 'Gates', 'Each', 128.00, 165.99),
('GATE-DRIVE-10-GAL',   'Drive Gate 10ft x 6ft Galvanized',        'Chain Link', 'Gates', 'Each', 220.00, 285.99),
('GATE-DRIVE-12-GAL',   'Drive Gate 12ft x 6ft Galvanized',        'Chain Link', 'Gates', 'Each', 258.00, 334.99),
('GATE-DRIVE-14-GAL',   'Drive Gate 14ft x 6ft Galvanized',        'Chain Link', 'Gates', 'Each', 295.00, 382.99),
('GATE-DRIVE-16-GAL',   'Drive Gate 16ft x 6ft Galvanized (DBL)',  'Chain Link', 'Gates', 'Each', 340.00, 441.99),
('GATE-DRIVE-10-BLK',   'Drive Gate 10ft x 6ft Black',             'Chain Link', 'Gates', 'Each', 280.00, 363.99),
('GATE-DRIVE-12-BLK',   'Drive Gate 12ft x 6ft Black',             'Chain Link', 'Gates', 'Each', 320.00, 415.99);

-- ============================================================
-- GATE HARDWARE
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('GATE-HINGE-GAL',      'Gate Hinge 2-1/2" Galvanized Set',        'Chain Link', 'Gate Hardware', 'Set',  14.00,  18.99),
('GATE-HINGE-3-GAL',    'Gate Hinge 3" Galvanized Set',            'Chain Link', 'Gate Hardware', 'Set',  17.00,  22.99),
('GATE-HINGE-BLK',      'Gate Hinge 2-1/2" Black Set',             'Chain Link', 'Gate Hardware', 'Set',  17.50,  22.99),
('GATE-LATCH-GAL',      'Gate Latch Galvanized',                    'Chain Link', 'Gate Hardware', 'Each',  8.50,  11.99),
('GATE-LATCH-BLK',      'Gate Latch Black',                         'Chain Link', 'Gate Hardware', 'Each', 10.00,  13.99),
('GATE-FORK-GAL',       'Gate Fork Latch Galvanized',               'Chain Link', 'Gate Hardware', 'Each', 12.00,  15.99),
('GATE-FORK-BLK',       'Gate Fork Latch Black',                    'Chain Link', 'Gate Hardware', 'Each', 14.50,  18.99),
('GATE-CANE-BOLT',      'Cane Bolt for Double Drive Gate',          'Chain Link', 'Gate Hardware', 'Each', 18.00,  23.99),
('GATE-TENSION-ROD',    'Gate Tension Rod Assembly',                'Chain Link', 'Gate Hardware', 'Each', 22.00,  28.99),
('GATE-KEEPER-GAL',     'Gate Keeper Galvanized',                   'Chain Link', 'Gate Hardware', 'Each',  4.50,   5.99),
('GATE-KEEPER-BLK',     'Gate Keeper Black',                        'Chain Link', 'Gate Hardware', 'Each',  5.25,   6.99);

-- ============================================================
-- COMMERCIAL FITTINGS
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('CF-CORNER-2.5-GAL',   'Corner Fitting 2-1/2" Galvanized',        'Commercial Fitting', 'Fittings', 'Each',  6.50,   8.99),
('CF-TEE-2.5-GAL',      'Tee Fitting 2-1/2" Galvanized',           'Commercial Fitting', 'Fittings', 'Each',  7.00,   9.49),
('CF-OFFSET-2.5-GAL',   'Offset Fitting 2-1/2" Galvanized',        'Commercial Fitting', 'Fittings', 'Each',  8.25,  10.99),
('CF-CORNER-3-GAL',     'Corner Fitting 3" Galvanized',            'Commercial Fitting', 'Fittings', 'Each',  8.00,  10.99),
('CF-TEE-3-GAL',        'Tee Fitting 3" Galvanized',               'Commercial Fitting', 'Fittings', 'Each',  8.75,  11.49),
('CF-CROSS-2.5-GAL',    'Cross Fitting 2-1/2" Galvanized',         'Commercial Fitting', 'Fittings', 'Each',  9.00,  11.99),
('CF-SWAG-2.5-GAL',     'Swaged Sleeve 2-1/2" Galvanized',         'Commercial Fitting', 'Fittings', 'Each',  5.25,   6.99),
('CF-SLEEVE-1.66-GAL',  'Sleeve 1-5/8" Galvanized',                'Commercial Fitting', 'Fittings', 'Each',  3.75,   4.99),
('CF-SLEEVE-2-GAL',     'Sleeve 2" Galvanized',                    'Commercial Fitting', 'Fittings', 'Each',  4.50,   5.99),
('CF-CLAMP-GAL',        'Bolt Clamp 1-5/8" Galvanized',            'Commercial Fitting', 'Fittings', 'Each',  2.25,   2.99),
('CF-CLAMP-2-GAL',      'Bolt Clamp 2" Galvanized',                'Commercial Fitting', 'Fittings', 'Each',  2.75,   3.49);

-- ============================================================
-- WOOD FENCE MATERIALS
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('WD-PICKET-6-DOG',     'Cedar Dog Ear Picket 6ft 1x6',            'Wood Fence', 'Pickets', 'Each',   3.25,   4.49),
('WD-PICKET-8-DOG',     'Cedar Dog Ear Picket 8ft 1x6',            'Wood Fence', 'Pickets', 'Each',   4.50,   5.99),
('WD-PICKET-6-FLT',     'Cedar Flat Top Picket 6ft 1x6',           'Wood Fence', 'Pickets', 'Each',   3.25,   4.49),
('WD-PICKET-6-PT',      'Cedar Gothic Picket 6ft 1x4',             'Wood Fence', 'Pickets', 'Each',   2.25,   2.99),
('WD-RAIL-8',           'Cedar Rail 2x4 x 8ft',                    'Wood Fence', 'Rails',   'Each',   5.50,   7.49),
('WD-RAIL-16',          'Cedar Rail 2x4 x 16ft',                   'Wood Fence', 'Rails',   'Each',   9.75,  12.99),
('WD-POST-4x4-8',       'PT Pine Post 4x4 x 8ft',                  'Wood Fence', 'Posts',   'Each',  12.50,  16.99),
('WD-POST-4x4-10',      'PT Pine Post 4x4 x 10ft',                 'Wood Fence', 'Posts',   'Each',  15.75,  20.99),
('WD-POST-6x6-8',       'PT Pine Post 6x6 x 8ft',                  'Wood Fence', 'Posts',   'Each',  22.00,  28.99),
('WD-STAIN-1GAL',       'Fence Stain/Sealer 1 Gallon',             'Wood Fence', 'Finish',  'Gallon', 28.00,  36.99),
('WD-STAIN-5GAL',       'Fence Stain/Sealer 5 Gallon Bucket',      'Wood Fence', 'Finish',  'Bucket', 95.00, 124.99),
('WD-NAILS-3',          'Galv Ring Nails 3" 5lb Box',              'Wood Fence', 'Fasteners','Box',    8.50,  11.99),
('WD-SCREW-3',          'Exterior Screw 3" 5lb Box',               'Wood Fence', 'Fasteners','Box',    9.75,  12.99),
('WD-BRACKET-L',        'L Bracket Heavy Duty Galvanized',         'Wood Fence', 'Hardware', 'Each',   1.85,   2.49),
('WD-HANGER-DBL',       'Double Joist Hanger Galvanized',          'Wood Fence', 'Hardware', 'Each',   2.25,   2.99),
('WD-POST-CAP',         'Post Cap 4x4 Pyramid Cedar',              'Wood Fence', 'Hardware', 'Each',   3.50,   4.99),
('WD-POST-CAP-6x6',     'Post Cap 6x6 Pyramid Cedar',              'Wood Fence', 'Hardware', 'Each',   5.00,   6.99);

-- ============================================================
-- VINYL FENCE MATERIALS
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('VN-PANEL-6W',         'Vinyl Privacy Panel 6ft H x 8ft W White',  'Vinyl Fence', 'Panels', 'Each',  62.00,  79.99),
('VN-PANEL-6TAN',       'Vinyl Privacy Panel 6ft H x 8ft W Tan',    'Vinyl Fence', 'Panels', 'Each',  62.00,  79.99),
('VN-POST-6-W',         'Vinyl Post 5" x 6ft White',                'Vinyl Fence', 'Posts',  'Each',  28.50,  37.99),
('VN-POST-8-W',         'Vinyl Post 5" x 8ft White',                'Vinyl Fence', 'Posts',  'Each',  35.00,  45.99),
('VN-POST-10-W',        'Vinyl Post 5" x 10ft White',               'Vinyl Fence', 'Posts',  'Each',  42.00,  54.99),
('VN-GATE-4-W',         'Vinyl Walk Gate 4ft White',                'Vinyl Fence', 'Gates',  'Each', 145.00, 188.99),
('VN-GATE-5-W',         'Vinyl Walk Gate 5ft White',                'Vinyl Fence', 'Gates',  'Each', 165.00, 214.99),
('VN-DRIVE-10-W',       'Vinyl Drive Gate 10ft White',              'Vinyl Fence', 'Gates',  'Each', 380.00, 494.99),
('VN-POST-CAP-W',       'Vinyl Post Cap 5" White',                  'Vinyl Fence', 'Hardware','Each',  6.00,   7.99),
('VN-CONCRETE-FORM',    'Vinyl Post Concrete Form 5"',              'Vinyl Fence', 'Hardware','Each',  3.25,   4.49),
('VN-GRAVEL-BAG',       'Gravel Bag for Vinyl Post Drain',          'Vinyl Fence', 'Hardware','Bag',   4.50,   5.99);

-- ============================================================
-- ORNAMENTAL IRON / ALUMINUM
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('ORN-PANEL-48-BLK',    'Ornamental Panel 48"H x 72"W Black',      'Ornamental', 'Panels', 'Each',  88.00, 114.99),
('ORN-PANEL-60-BLK',    'Ornamental Panel 60"H x 72"W Black',      'Ornamental', 'Panels', 'Each', 105.00, 136.99),
('ORN-PANEL-72-BLK',    'Ornamental Panel 72"H x 72"W Black',      'Ornamental', 'Panels', 'Each', 122.00, 158.99),
('ORN-POST-48-BLK',     'Ornamental Post 2"x2" 48"H Black',        'Ornamental', 'Posts',  'Each',  24.00,  31.99),
('ORN-POST-60-BLK',     'Ornamental Post 2"x2" 60"H Black',        'Ornamental', 'Posts',  'Each',  28.00,  36.99),
('ORN-GATE-36-BLK',     'Ornamental Walk Gate 36"W x 48"H Black',  'Ornamental', 'Gates',  'Each', 185.00, 240.99),
('ORN-GATE-48-BLK',     'Ornamental Walk Gate 48"W x 48"H Black',  'Ornamental', 'Gates',  'Each', 210.00, 272.99),
('ORN-DRIVE-10-BLK',    'Ornamental Drive Gate 10ft x 48"H Black', 'Ornamental', 'Gates',  'Each', 580.00, 754.99),
('ORN-POST-MOUNT',      'Ornamental Post Surface Mount Bracket',    'Ornamental', 'Hardware','Each',  12.50,  16.99),
('ORN-CAP-2X2',         'Ornamental Post Cap 2x2 Black',           'Ornamental', 'Hardware','Each',   3.50,   4.99),
('ORN-FINIAL-SPEAR',    'Ornamental Finial Spear Black',            'Ornamental', 'Hardware','Each',   2.75,   3.99);

-- ============================================================
-- SPLIT RAIL
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('SR-POST-END-4',       'Split Rail End Post 4" x 72"',             'Split Rail', 'Posts',  'Each',  12.00,  15.99),
('SR-POST-LINE-4',      'Split Rail Line Post 4" x 72"',            'Split Rail', 'Posts',  'Each',   9.50,  12.99),
('SR-RAIL-11-2',        'Split Rail 11ft 2-Rail Cedar',             'Split Rail', 'Rails',  'Each',  16.00,  20.99),
('SR-RAIL-11-3',        'Split Rail 11ft 3-Rail Cedar',             'Split Rail', 'Rails',  'Each',  22.00,  28.99),
('SR-GATE-4-W',         'Split Rail Gate 4ft Cedar',                'Split Rail', 'Gates',  'Each',  95.00, 124.99);

-- ============================================================
-- TOOLS & SUPPLIES
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('TOOL-TENSIONER',      'Come-Along Cable Tensioner',               'Tools', 'Tools',   'Each',  42.00,  54.99),
('TOOL-FENCE-PLIERS',   'Fence Pliers Multi-Tool',                  'Tools', 'Tools',   'Each',  18.50,  23.99),
('TOOL-PULLER',         'Wire Roller & Puller',                     'Tools', 'Tools',   'Each',  88.00, 114.99),
('TOOL-STRETCHER',      'Fence Stretcher Board',                    'Tools', 'Tools',   'Each',  32.00,  41.99),
('TOOL-DRIVER-BLADES',  'Post Driver Blade Set',                    'Tools', 'Tools',   'Set',   28.00,  36.99),
('SUPPLY-SPRAY-MARK',   'Marking Spray Paint Orange Can',           'Supplies', 'Supplies','Can',   4.25,   5.99),
('SUPPLY-LINE-STRING',  'Line String 500ft Roll',                   'Supplies', 'Supplies','Roll',  6.50,   8.99),
('SUPPLY-STAKES',       'Layout Stakes Steel Bag/10',               'Supplies', 'Supplies','Bag',   8.50,  11.99),
('SUPPLY-GLOVES-M',     'Work Gloves Med Pair',                     'Supplies', 'Supplies','Pair',  5.50,   7.99),
('SUPPLY-GLOVES-L',     'Work Gloves Lg Pair',                      'Supplies', 'Supplies','Pair',  5.50,   7.99),
('SUPPLY-SAFETY-VEST',  'Safety Vest Hi-Vis Lime',                  'Supplies', 'Supplies','Each',  6.25,   8.99),
('SUPPLY-DIGGING-BAR',  'Digging Bar 6ft Steel',                    'Tools',    'Tools',   'Each', 42.00,  54.99);

-- ============================================================
-- PRIVACY SLATS (for chain link)
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('SLAT-6-BLK-BAG',      'Privacy Slat 6ft Black Bag/50',            'Chain Link', 'Slats', 'Bag',  45.00,  58.99),
('SLAT-6-GRN-BAG',      'Privacy Slat 6ft Green Bag/50',            'Chain Link', 'Slats', 'Bag',  45.00,  58.99),
('SLAT-6-BRN-BAG',      'Privacy Slat 6ft Brown Bag/50',            'Chain Link', 'Slats', 'Bag',  45.00,  58.99),
('SLAT-6-WH-BAG',       'Privacy Slat 6ft White Bag/50',            'Chain Link', 'Slats', 'Bag',  45.00,  58.99),
('SLAT-4-BLK-BAG',      'Privacy Slat 4ft Black Bag/50',            'Chain Link', 'Slats', 'Bag',  35.00,  45.99),
('SLAT-WEAVE-6-BLK',    'Privacy Weave 6ft Black Roll',             'Chain Link', 'Slats', 'Roll', 28.00,  36.99);

-- ============================================================
-- BARBED WIRE ACCESSORIES
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('BARB-ARM-3',          'Barbed Wire Arm 3-Strand 10pk',            'Chain Link', 'Barbed Wire', 'Pack',  32.00,  41.99),
('BARB-ARM-6',          'Barbed Wire Arm 6-Strand 10pk',            'Chain Link', 'Barbed Wire', 'Pack',  48.00,  62.99),
('BARB-STAPLE-LB',      'Barbed Wire Staple 1.25" 1lb Box',         'Chain Link', 'Barbed Wire', 'Box',    5.25,   6.99);

-- ============================================================
-- ADDITIONAL HARDWARE (bolts, nuts, washers)
-- ============================================================
INSERT INTO products (sku, description, department, category, unit, unit_cost, retail_price) VALUES
('HW-BOLT-5/16',        'Carriage Bolt 5/16" x 1" Bag/50',          'Hardware', 'Fasteners', 'Bag',   6.50,   8.99),
('HW-NUT-5/16',         'Hex Nut 5/16" Bag/50',                     'Hardware', 'Fasteners', 'Bag',   3.50,   4.99),
('HW-WASHER-5/16',      'Flat Washer 5/16" Bag/100',                'Hardware', 'Fasteners', 'Bag',   4.25,   5.99),
('HW-LOCK-NUT-5/16',    'Lock Nut 5/16" Bag/50',                    'Hardware', 'Fasteners', 'Bag',   4.00,   5.49),
('HW-CONDUIT-1.5',      'Conduit Pipe 1-1/2" x 10ft',              'Hardware', 'Pipe',      'Each',   8.50,  11.49),
('HW-GROUND-ROD',       'Ground Rod 5/8" x 8ft Copper Clad',       'Hardware', 'Electrical','Each',  18.00,  23.99),
('HW-CLAMP-GROUND',     'Ground Clamp 5/8"',                        'Hardware', 'Electrical','Each',   5.50,   7.49),
('HW-LOCK-PADLOCK',     'Heavy Duty Padlock',                       'Hardware', 'Security',  'Each',  14.00,  18.99),
('HW-CHAIN-3/16',       'Chain 3/16" x 4ft',                        'Hardware', 'Security',  'Each',   9.50,  12.99);

-- ============================================================
-- END OF SEED DATA
-- ============================================================
-- Total SKUs: 175+ core products
-- Additional SKUs from Fence Depot POS can be imported via CSV
-- ============================================================
