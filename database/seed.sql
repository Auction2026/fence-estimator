-- ============================================================
-- FENCE DEPOT ESTIMATOR - Seed Data
-- database/seed.sql
-- Inserts a default admin user, product catalog (100+ SKUs)
-- Run AFTER schema.sql
-- ============================================================

-- ---- ADMIN USER (password: Admin123!) ----
-- bcrypt hash of 'Admin123!' with salt rounds=12
INSERT INTO users (username, email, password_hash, first_name, last_name, role)
VALUES ('admin', 'admin@fencedepot.com',
        '$2b$12$Ow1R8zGNbMzQpKs7R3Nl3eJFNqS2x1g4w6R1dP5eUoXfYkLVHbKp2',
        'Admin', 'User', 'admin')
ON CONFLICT (username) DO NOTHING;

-- ---- PRODUCT CATALOG ----
-- CHAIN LINK FABRIC
INSERT INTO products (sku, name, department, category, unit, price, cost) VALUES
  ('CL-1HF-2IN-11GA-36',  '1-3/4" Mesh 11ga Galvanized Fabric 36"',        'Chain Link', 'Fabric',    'LF',  0.52, 0.38),
  ('CL-2IN-11GA-36',      '2" Mesh 11ga Galvanized Fabric 36"',             'Chain Link', 'Fabric',    'LF',  0.48, 0.35),
  ('CL-2IN-11GA-48',      '2" Mesh 11ga Galvanized Fabric 48"',             'Chain Link', 'Fabric',    'LF',  0.62, 0.45),
  ('CL-2IN-11GA-60',      '2" Mesh 11ga Galvanized Fabric 60"',             'Chain Link', 'Fabric',    'LF',  0.75, 0.55),
  ('CL-2IN-11GA-72',      '2" Mesh 11ga Galvanized Fabric 72"',             'Chain Link', 'Fabric',    'LF',  0.88, 0.64),
  ('CL-2IN-11GA-96',      '2" Mesh 11ga Galvanized Fabric 96"',             'Chain Link', 'Fabric',    'LF',  1.15, 0.84),
  ('CL-2IN-11GA-120',     '2" Mesh 11ga Galvanized Fabric 120"',            'Chain Link', 'Fabric',    'LF',  1.42, 1.03),
  ('CL-2IN-9GA-72',       '2" Mesh 9ga Galvanized Fabric 72"',              'Chain Link', 'Fabric',    'LF',  1.12, 0.82),
  ('CL-2IN-6GA-72',       '2" Mesh 6ga Galvanized Fabric 72"',              'Chain Link', 'Fabric',    'LF',  1.58, 1.15),
  ('CL-2IN-BLK-11GA-48',  '2" Mesh 11ga Black Vinyl Fabric 48"',            'Chain Link', 'Fabric',    'LF',  0.85, 0.62),
  ('CL-2IN-BLK-11GA-60',  '2" Mesh 11ga Black Vinyl Fabric 60"',            'Chain Link', 'Fabric',    'LF',  1.02, 0.74),
  ('CL-2IN-BLK-11GA-72',  '2" Mesh 11ga Black Vinyl Fabric 72"',            'Chain Link', 'Fabric',    'LF',  1.18, 0.86),
-- CHAIN LINK POSTS
  ('CL-LP-1-5/8-60',      '1-5/8" Line Post 60" Galvanized',                'Chain Link', 'Posts',     'EA',  9.50, 6.95),
  ('CL-LP-1-5/8-84',      '1-5/8" Line Post 84" Galvanized',                'Chain Link', 'Posts',     'EA', 12.75, 9.35),
  ('CL-LP-2IN-60',        '2" Line Post 60" Galvanized',                    'Chain Link', 'Posts',     'EA', 14.50,10.60),
  ('CL-LP-2IN-84',        '2" Line Post 84" Galvanized',                    'Chain Link', 'Posts',     'EA', 18.75,13.70),
  ('CL-LP-2IN-120',       '2" Line Post 120" Galvanized',                   'Chain Link', 'Posts',     'EA', 24.50,17.90),
  ('CL-EP-2IN-84',        '2" End/Corner Post 84"',                         'Chain Link', 'Posts',     'EA', 22.00,16.10),
  ('CL-EP-2-1/2-84',      '2-1/2" End/Corner Post 84"',                     'Chain Link', 'Posts',     'EA', 28.50,20.85),
  ('CL-EP-4IN-84',        '4" Line Post Commercial 84"',                    'Chain Link', 'Posts',     'EA', 52.00,38.00),
-- CHAIN LINK RAILS
  ('CL-RAIL-1-3/8-21',    '1-3/8" Top Rail 21ft',                          'Chain Link', 'Rails',     'EA', 16.00,11.70),
  ('CL-RAIL-1-5/8-21',    '1-5/8" Top Rail 21ft',                          'Chain Link', 'Rails',     'EA', 22.00,16.10),
  ('CL-RAIL-2IN-21',      '2" Top Rail 21ft',                              'Chain Link', 'Rails',     'EA', 30.00,22.00),
  ('CL-RAIL-2-1/2-21',    '2-1/2" Top Rail 21ft Commercial',               'Chain Link', 'Rails',     'EA', 42.00,30.70),
-- CHAIN LINK TENSION WIRE
  ('CL-TW-9GA-1320',      '9ga Tension Wire 1320ft (200lb spool)',          'Chain Link', 'Wire',      'RL', 85.00,62.00),
  ('CL-TW-12GA-1320',     '12ga Tension Wire 1320ft',                      'Chain Link', 'Wire',      'RL', 52.00,38.00),
  ('CL-BW-15GA-1320',     'Barbed Wire 2-strand 1320ft',                   'Chain Link', 'Wire',      'RL', 38.00,27.80),
-- CHAIN LINK HARDWARE
  ('CL-BB-1-5/8',         'Brace Band 1-5/8"',                             'Chain Link', 'Hardware',  'EA',  0.65, 0.48),
  ('CL-BB-2IN',           'Brace Band 2"',                                 'Chain Link', 'Hardware',  'EA',  0.80, 0.59),
  ('CL-BB-2-1/2',         'Brace Band 2-1/2"',                             'Chain Link', 'Hardware',  'EA',  1.05, 0.77),
  ('CL-CB-1-5/8',         'Carriage Bolt 5/16x1-1/4 (100pk)',              'Chain Link', 'Hardware',  'BX',  8.50, 6.20),
  ('CL-CAP-1-5/8',        'Post Cap 1-5/8"',                               'Chain Link', 'Hardware',  'EA',  0.45, 0.33),
  ('CL-CAP-2IN',          'Post Cap 2"',                                   'Chain Link', 'Hardware',  'EA',  0.55, 0.40),
  ('CL-CAP-2-1/2',        'Post Cap 2-1/2"',                               'Chain Link', 'Hardware',  'EA',  0.75, 0.55),
  ('CL-TIES-9GA-100',     'Tie Wire 9ga (100pk)',                          'Chain Link', 'Hardware',  'BX',  6.25, 4.56),
  ('CL-TENSION-BAR',      'Tension Bar 48"',                               'Chain Link', 'Hardware',  'EA',  2.85, 2.10),
  ('CL-TENSION-BAR-72',   'Tension Bar 72"',                               'Chain Link', 'Hardware',  'EA',  4.20, 3.10),
-- CHAIN LINK GATES (walk gates)
  ('CL-WG-36X48-11GA',    '36"x48" Walk Gate Chain Link 11ga',            'Chain Link', 'Gates',     'EA',115.00,84.00),
  ('CL-WG-36X60-11GA',    '36"x60" Walk Gate Chain Link 11ga',            'Chain Link', 'Gates',     'EA',135.00,98.70),
  ('CL-WG-48X72-11GA',    '48"x72" Walk Gate Chain Link 11ga',            'Chain Link', 'Gates',     'EA',165.00,120.50),
  ('CL-DG-10FT-72-11GA',  '10ft Double Drive Gate CL 72" 11ga',           'Chain Link', 'Gates',     'EA',395.00,288.00),
  ('CL-DG-12FT-72-11GA',  '12ft Double Drive Gate CL 72" 11ga',           'Chain Link', 'Gates',     'EA',450.00,328.00),
  ('CL-DG-16FT-72-11GA',  '16ft Double Drive Gate CL 72" 11ga',           'Chain Link', 'Gates',     'EA',580.00,423.00),
-- WOOD
  ('WD-BOA-6X6-6',        '1x6 Dog-Ear Cedar Board 6ft',                  'Wood',       'Privacy',   'EA',  3.45, 2.52),
  ('WD-BOA-6X8-8',        '1x6 Dog-Ear Cedar Board 8ft',                  'Wood',       'Privacy',   'EA',  4.20, 3.07),
  ('WD-POST-4X4-8-CED',   '4x4 Cedar Post 8ft',                           'Wood',       'Posts',     'EA', 18.50,13.50),
  ('WD-POST-4X4-10-CED',  '4x4 Cedar Post 10ft',                          'Wood',       'Posts',     'EA', 22.00,16.10),
  ('WD-POST-6X6-8-CED',   '6x6 Cedar Post 8ft',                           'Wood',       'Posts',     'EA', 34.00,24.80),
  ('WD-RAIL-2X4-8',       '2x4 Pressure Treated Rail 8ft',                'Wood',       'Rails',     'EA',  6.50, 4.75),
  ('WD-RAIL-2X4-16',      '2x4 Pressure Treated Rail 16ft',               'Wood',       'Rails',     'EA', 12.00, 8.76),
  ('WD-RAIL-2X3-8',       '2x3 Pressure Treated Rail 8ft',                'Wood',       'Rails',     'EA',  5.25, 3.84),
  ('WD-STAIN-TW-1G',      'Thompson Water Seal 1 Gallon',                 'Wood',       'Stain',     'GL', 32.00,23.40),
  ('WD-STAIN-CED-1G',     'Cedar Tone Wood Stain 1 Gallon',               'Wood',       'Stain',     'GL', 42.00,30.70),
  ('WD-SCREWS-3IN-1LB',   'Deck Screws 3" 1lb Box',                       'Wood',       'Hardware',  'BX',  9.50, 6.95),
  ('WD-SCREWS-1.5-1LB',   'Deck Screws 1-1/2" 1lb Box',                   'Wood',       'Hardware',  'BX',  8.50, 6.20),
  ('WD-NAIB-16D-5LB',     '16d Galvanized Nails 5lb Box',                 'Wood',       'Hardware',  'BX', 12.00, 8.76),
-- VINYL / PVC
  ('VN-PNL-PRIV-6-WHT',   'Vinyl Privacy Panel 6ft White',                'Vinyl',      'Panels',    'EA', 38.00,27.80),
  ('VN-PNL-PRIV-5-WHT',   'Vinyl Privacy Panel 5ft White',                'Vinyl',      'Panels',    'EA', 32.00,23.40),
  ('VN-PNL-PRIV-6-TAN',   'Vinyl Privacy Panel 6ft Tan/Sand',             'Vinyl',      'Panels',    'EA', 40.00,29.20),
  ('VN-POST-5X5-60',      '5x5 Vinyl Post 60"',                           'Vinyl',      'Posts',     'EA', 38.50,28.10),
  ('VN-POST-5X5-72',      '5x5 Vinyl Post 72"',                           'Vinyl',      'Posts',     'EA', 45.00,32.90),
  ('VN-POST-5X5-96',      '5x5 Vinyl Post 96"',                           'Vinyl',      'Posts',     'EA', 58.00,42.40),
  ('VN-CAP-5X5-FLAT',     'Vinyl Post Cap 5x5 Flat',                      'Vinyl',      'Caps',      'EA',  5.50, 4.02),
  ('VN-CAP-5X5-ACM',      'Vinyl Post Cap 5x5 Acme',                      'Vinyl',      'Caps',      'EA',  7.25, 5.30),
  ('VN-RAIL-2X4-8',       'Vinyl Rail 2x4 x 8ft',                         'Vinyl',      'Rails',     'EA', 14.50,10.60),
  ('VN-GATE-4FT-WHT',     'Vinyl Gate 4ft Single White',                  'Vinyl',      'Gates',     'EA',185.00,135.00),
  ('VN-GATE-6FT-WHT',     'Vinyl Gate 6ft Double White',                  'Vinyl',      'Gates',     'EA',295.00,215.00),
-- ALUMINUM
  ('AL-PNL-FLAT-4-BLK',   'Aluminum Flat Top Panel 4ft Black',            'Aluminum',   'Panels',    'EA', 58.00,42.40),
  ('AL-PNL-FLAT-6-BLK',   'Aluminum Flat Top Panel 6ft Black',            'Aluminum',   'Panels',    'EA', 78.00,57.00),
  ('AL-PNL-SPEAR-4-BLK',  'Aluminum Spear Top Panel 4ft Black',           'Aluminum',   'Panels',    'EA', 68.00,49.60),
  ('AL-PNL-SPEAR-6-BLK',  'Aluminum Spear Top Panel 6ft Black',           'Aluminum',   'Panels',    'EA', 88.00,64.20),
  ('AL-POST-2X2-72',      '2x2 Aluminum Post 72" Black',                  'Aluminum',   'Posts',     'EA', 28.00,20.40),
  ('AL-POST-2X2-84',      '2x2 Aluminum Post 84" Black',                  'Aluminum',   'Posts',     'EA', 32.00,23.40),
  ('AL-POST-2X2-96',      '2x2 Aluminum Post 96" Black',                  'Aluminum',   'Posts',     'EA', 38.00,27.80),
  ('AL-POST-3X3-84',      '3x3 Heavy Duty Aluminum Post 84"',             'Aluminum',   'Posts',     'EA', 52.00,38.00),
  ('AL-GATE-4X4-BLK',     'Aluminum Single Gate 4ft Black',               'Aluminum',   'Gates',     'EA',225.00,164.00),
  ('AL-GATE-10FT-BLK',    'Aluminum Double Drive Gate 10ft Black',         'Aluminum',   'Gates',     'EA',485.00,354.00),
-- HARDWARE / CONCRETE
  ('HW-CONC-QSET-50',     'Quikrete Fast-Set Concrete 50lb',              'Hardware',   'Concrete',  'BG',  7.25, 5.30),
  ('HW-CONC-QSET-60',     'Quikrete Fast-Set Concrete 60lb',              'Hardware',   'Concrete',  'BG',  8.50, 6.20),
  ('HW-CONC-SACK-80',     'Sakrete Gray Concrete 80lb',                   'Hardware',   'Concrete',  'BG', 10.50, 7.67),
  ('HW-STAPLE-1.75-5LB',  'Fence Staples 1-3/4" 5lb',                    'Hardware',   'Fasteners', 'BX', 18.00,13.15),
  ('HW-STAPGUN-MAN',      'Manual Fence Staple Gun',                      'Hardware',   'Tools',     'EA', 42.00,30.70),
  ('HW-CARR-3/8-50PK',    'Carriage Bolts 3/8x1.5" (50pk)',               'Hardware',   'Fasteners', 'BX', 14.50,10.60),
  ('HW-NUT-3/8-100PK',    'Hex Nuts 3/8" (100pk)',                        'Hardware',   'Fasteners', 'BX',  6.50, 4.75),
  ('HW-HINGE-6IN-HDG',    '6" Heavy Duty Gate Hinge Galv (pr)',           'Hardware',   'Hinges',    'PR', 22.00,16.10),
  ('HW-HINGE-4IN-HDG',    '4" Gate Hinge Galv (pr)',                      'Hardware',   'Hinges',    'PR', 14.50,10.60),
  ('HW-LATCH-FORK',       'Fork Latch Gate Latch Galv',                   'Hardware',   'Latches',   'EA',  8.50, 6.20),
  ('HW-LATCH-CANE',       'Cane Bolt Gate Latch',                         'Hardware',   'Latches',   'EA', 32.00,23.40),
  ('HW-LOCK-PADLK-1.75',  'Padlock 1-3/4" Brass',                         'Hardware',   'Locks',     'EA', 14.00,10.20),
  ('HW-LOCK-COMBO-4DG',   'Combination Padlock 4-Digit',                  'Hardware',   'Locks',     'EA', 18.00,13.15),
-- GATE OPENERS
  ('GT-OPENER-SS-500',    'Mighty Mule Single Swing Opener SS-500',       'Gate Openers','Electric', 'EA',695.00,507.00),
  ('GT-OPENER-DC-2000',   'LiftMaster Double Swing 2000 AC/DC',           'Gate Openers','Electric', 'EA',1295.00,946.00),
  ('GT-OPENER-SL-1200',   'Viking Slide Gate Opener SL-1200 1200lb',      'Gate Openers','Electric', 'EA',1195.00,872.00),
  ('GT-KEYPAD-WIRELESS',  'Wireless Keypad Gate Opener Accessory',        'Gate Openers','Access',   'EA', 95.00,69.00),
  ('GT-REMOTE-2BTN',      'Remote Control 2-Button for Gate Opener',      'Gate Openers','Access',   'EA', 38.00,27.80),
-- PRIVACY SLATS
  ('PS-CL-4FT-WHT',       'Privacy Slats Chain Link 4ft White 6pk',       'Slats',      'Privacy',   'PK', 12.50, 9.13),
  ('PS-CL-4FT-TAN',       'Privacy Slats Chain Link 4ft Tan 6pk',         'Slats',      'Privacy',   'PK', 13.25, 9.68),
  ('PS-CL-6FT-BLK',       'Privacy Slats Chain Link 6ft Black 6pk',       'Slats',      'Privacy',   'PK', 16.50,12.05),
  ('PS-WINDSCREEN-4FT',   'Wind Screen Fabric 4ft Green (per 10ft)',       'Slats',      'Windscreen','EA',  8.50, 6.20),
  ('PS-WINDSCREEN-6FT',   'Wind Screen Fabric 6ft Green (per 10ft)',       'Slats',      'Windscreen','EA', 11.00, 8.03)
ON CONFLICT (sku) DO UPDATE SET
  name     = EXCLUDED.name,
  price    = EXCLUDED.price,
  cost     = EXCLUDED.cost,
  updated_at = NOW();

-- ---- SAMPLE PROJECT ----
INSERT INTO customers (name, company, email, phone, address, city, state, zip, property_type)
VALUES ('Sample Customer', 'ABC Corp', 'sample@example.com', '(555) 000-1234',
        '100 Demo Lane', 'Austin', 'TX', '78701', 'residential')
ON CONFLICT DO NOTHING;
