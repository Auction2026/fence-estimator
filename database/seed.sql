-- ============================================================
-- FENCE DEPOT FENCE ESTIMATOR
-- database/seed.sql — Seed Data
-- Includes: admin user, sample projects/estimates, 950+ products
-- ============================================================

-- ============================================================
-- SEED: users
-- password_hash is bcrypt of 'admin123' (cost 10)
-- ============================================================
INSERT INTO users (id, username, email, password_hash, role, company) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin',     'admin@fencedepot.com',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',     'Fence Depot'),
  ('00000000-0000-0000-0000-000000000002', 'estimator', 'est@fencedepot.com',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'estimator', 'Fence Depot'),
  ('00000000-0000-0000-0000-000000000003', 'crew1',     'crew1@fencedepot.com',     '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'crew',      'Fence Depot')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: sample projects
-- ============================================================
INSERT INTO projects (id, project_number, status, customer_name, customer_phone, customer_email, job_address, job_city, job_state, job_zip, created_by) VALUES
  ('10000000-0000-0000-0000-000000000001','PRJ-2024-0001','signed',  'John & Mary Smith','(512)555-1001','jsmith@email.com',   '1234 Oak Ln',     'Austin',     'TX','78701','00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002','PRJ-2024-0002','open',    'Robert Johnson',   '(512)555-1002','rjohnson@email.com', '5678 Elm St',     'Round Rock', 'TX','78664','00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000003','PRJ-2024-0003','complete','Linda Williams',   '(512)555-1003','lwilliams@email.com','9012 Pine Rd',    'Cedar Park', 'TX','78613','00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000004','PRJ-2024-0004','open',    'Michael Brown',    '(512)555-1004','mbrown@email.com',   '3456 Maple Ave',  'Georgetown', 'TX','78626','00000000-0000-0000-0000-000000000002'),
  ('10000000-0000-0000-0000-000000000005','PRJ-2024-0005','pending', 'Susan Davis',      '(512)555-1005','sdavis@email.com',   '7890 Cedar Blvd', 'Pflugerville','TX','78660','00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: fence_specs
-- ============================================================
INSERT INTO fence_specs (project_id, fence_type, fence_height, color_finish, linear_footage, num_gates, terrain) VALUES
  ('10000000-0000-0000-0000-000000000001','chain-link',   6, 'Black',     250, 2, 'flat'),
  ('10000000-0000-0000-0000-000000000002','wood-privacy',  6, 'Natural',  180, 1, 'flat'),
  ('10000000-0000-0000-0000-000000000003','vinyl',         6, 'White',    320, 3, 'slight_slope'),
  ('10000000-0000-0000-0000-000000000004','ornamental',    4, 'Black',    150, 2, 'flat'),
  ('10000000-0000-0000-0000-000000000005','chain-link',    4, 'Galvanized',500,4, 'flat')
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED: inventory (950+ products)
-- Chain Link — 200 items
-- ============================================================
INSERT INTO inventory (plu, sku, description, department, category, uom, cost_price, sell_price, qty_on_hand, reorder_point) VALUES
-- Chain Link Fabric
  ('CL-F-2-6-G',   'CLF-200-6-G',  'Chain Link Fabric 2" mesh 11ga 6ft Galvanized 50ft roll',         'Chain Link', 'Fabric',   'Roll', 89.50,  134.95, 45, 10),
  ('CL-F-2-6-B',   'CLF-200-6-B',  'Chain Link Fabric 2" mesh 11ga 6ft Black vinyl coated 50ft',      'Chain Link', 'Fabric',   'Roll', 99.50,  149.95, 30, 8),
  ('CL-F-2-4-G',   'CLF-200-4-G',  'Chain Link Fabric 2" mesh 11ga 4ft Galvanized 50ft roll',         'Chain Link', 'Fabric',   'Roll', 69.50,  104.95, 40, 10),
  ('CL-F-2-4-B',   'CLF-200-4-B',  'Chain Link Fabric 2" mesh 11ga 4ft Black vinyl coated 50ft',      'Chain Link', 'Fabric',   'Roll', 79.50,  119.95, 25, 8),
  ('CL-F-2-5-G',   'CLF-200-5-G',  'Chain Link Fabric 2" mesh 11ga 5ft Galvanized 50ft roll',         'Chain Link', 'Fabric',   'Roll', 79.50,  119.95, 35, 10),
  ('CL-F-2-8-G',   'CLF-200-8-G',  'Chain Link Fabric 2" mesh 9ga 8ft Galvanized 50ft roll',          'Chain Link', 'Fabric',   'Roll',119.50,  179.95, 20, 5),
  ('CL-F-2-10-G',  'CLF-200-10-G', 'Chain Link Fabric 2" mesh 9ga 10ft Galvanized 50ft roll',         'Chain Link', 'Fabric',   'Roll',149.50,  224.95, 10, 3),
  ('CL-F-2-12-G',  'CLF-200-12-G', 'Chain Link Fabric 2" mesh 9ga 12ft Galvanized 50ft roll',         'Chain Link', 'Fabric',   'Roll',179.50,  269.95, 8,  2),
-- Line Posts
  ('CL-LP-238-6-G','CLP-238-6-G',  'Line Post 2-3/8" x 6ft Galvanized',                              'Chain Link', 'Posts',    'Each', 12.75,  19.50,  200, 50),
  ('CL-LP-238-4-G','CLP-238-4-G',  'Line Post 2-3/8" x 4ft Galvanized',                              'Chain Link', 'Posts',    'Each',  9.50,  14.95,  150, 50),
  ('CL-LP-238-8-G','CLP-238-8-G',  'Line Post 2-3/8" x 8ft Galvanized',                              'Chain Link', 'Posts',    'Each', 16.50,  24.95,  100, 30),
  ('CL-LP-238-10-G','CLP-238-10-G','Line Post 2-3/8" x 10ft Galvanized',                             'Chain Link', 'Posts',    'Each', 21.50,  32.95,  80,  20),
  ('CL-LP-238-6-B','CLP-238-6-B',  'Line Post 2-3/8" x 6ft Black powder coated',                     'Chain Link', 'Posts',    'Each', 17.50,  26.95,  80,  20),
-- Terminal / Corner Posts
  ('CL-TP-278-6-G','CTP-278-6-G',  'Terminal Post 2-7/8" x 6ft Galvanized',                          'Chain Link', 'Posts',    'Each', 18.50,  27.95,  120, 30),
  ('CL-TP-278-4-G','CTP-278-4-G',  'Terminal Post 2-7/8" x 4ft Galvanized',                          'Chain Link', 'Posts',    'Each', 14.50,  21.95,  100, 30),
  ('CL-TP-278-8-G','CTP-278-8-G',  'Terminal Post 2-7/8" x 8ft Galvanized',                          'Chain Link', 'Posts',    'Each', 23.50,  35.95,  80,  20),
  ('CL-TP-278-6-B','CTP-278-6-B',  'Terminal Post 2-7/8" x 6ft Black powder coated',                 'Chain Link', 'Posts',    'Each', 24.50,  36.95,  60,  15),
-- Top Rail
  ('CL-TR-158-21-G','CTR-158-21-G','Top Rail 1-5/8" x 21ft Galvanized',                              'Chain Link', 'Rail',     'Each', 14.75,  22.50,  150, 40),
  ('CL-TR-158-21-B','CTR-158-21-B','Top Rail 1-5/8" x 21ft Black vinyl coated',                      'Chain Link', 'Rail',     'Each', 18.75,  28.50,  80,  20),
  ('CL-TR-158-10-G','CTR-158-10-G','Top Rail 1-5/8" x 10.5ft Galvanized',                            'Chain Link', 'Rail',     'Each',  7.75,  11.95,  200, 50),
-- Commercial/Heavy Line Posts
  ('CL-LP-237-G',  'CLP-237-6-G',  'Line Post 2-3/7" Heavy Commercial 6ft Galvanized',               'Commercial Fitting','Posts','Each',22.50,  33.95,  60,  15),
  ('CL-LP-4-G',    'CLP-400-6-G',  'Line Post 4" x 6ft Heavy Duty Galvanized',                       'Commercial Fitting','Posts','Each',45.00,  67.50,  30,  10),
  ('CL-LP-4-10-G', 'CLP-400-10-G', 'Line Post 4" x 10ft Heavy Duty Galvanized',                      'Commercial Fitting','Posts','Each',65.00,  97.50,  20,  5),
-- Fittings
  ('CL-FT-BC-G',   'CFT-BC-G',     'Brace Band 2-3/8" Galvanized',                                   'Chain Link', 'Fittings', 'Each',  0.85,   1.50,  500, 100),
  ('CL-FT-PB-G',   'CFT-PB-G',     'Post Brace 1-5/8" Galvanized',                                   'Chain Link', 'Fittings', 'Each',  1.25,   2.25,  400, 100),
  ('CL-FT-TW-G',   'CFT-TW-G',     'Tension Wire 12.5ga Galvanized 1000ft',                          'Chain Link', 'Fittings', 'Coil', 45.00,  67.50,  30,  10),
  ('CL-FT-TW-B',   'CFT-TW-B',     'Tension Wire 12.5ga Black coated 1000ft',                        'Chain Link', 'Fittings', 'Coil', 55.00,  82.50,  20,  5),
  ('CL-FT-RB-G',   'CFT-RB-G',     'Rail Band 1-5/8" Galvanized',                                    'Chain Link', 'Fittings', 'Each',  0.65,   1.10,  600, 150),
  ('CL-FT-CB-G',   'CFT-CB-G',     'Carriage Bolt 5/16"x1" Galvanized',                              'Chain Link', 'Fittings', 'Box',   8.50,  12.95,  60,  20),
  ('CL-FT-TE-G',   'CFT-TE-G',     'Tension Bar Galvanized 6ft',                                     'Chain Link', 'Fittings', 'Each',  3.50,   5.95,  200, 50),
  ('CL-FT-TC-G',   'CFT-TC-G',     'Tie Wire 12ga Galvanized Box 1lb',                               'Chain Link', 'Fittings', 'Box',   6.50,   9.95,  100, 30),
  ('CL-FT-PC-G',   'CFT-PC-G',     'Post Cap 2-3/8" Galvanized',                                     'Chain Link', 'Fittings', 'Each',  0.95,   1.75,  400, 100),
  ('CL-FT-PC-B',   'CFT-PC-B',     'Post Cap 2-3/8" Black',                                          'Chain Link', 'Fittings', 'Each',  1.15,   2.10,  300, 75),
  ('CL-FT-PC-278', 'CFT-PC-278',   'Post Cap 2-7/8" Galvanized',                                     'Chain Link', 'Fittings', 'Each',  1.25,   2.25,  300, 75),
-- Gates
  ('CL-GT-SG-4-G', 'CGT-SG-4-G',  'Single Walk Gate 4ft wide x 4ft tall Galvanized frame',          'Chain Link', 'Gates',    'Each', 65.00,  99.95,  20,  5),
  ('CL-GT-SG-4-6-G','CGT-SG-46-G','Single Walk Gate 4ft wide x 6ft tall Galvanized frame',           'Chain Link', 'Gates',    'Each', 79.00, 119.95,  20,  5),
  ('CL-GT-SG-4-6-B','CGT-SG-46-B','Single Walk Gate 4ft wide x 6ft tall Black frame',               'Chain Link', 'Gates',    'Each', 95.00, 142.95,  15,  4),
  ('CL-GT-SG-3-4-G','CGT-SG-34-G','Single Walk Gate 3ft wide x 4ft tall Galvanized',                'Chain Link', 'Gates',    'Each', 55.00,  82.95,  25,  5),
  ('CL-GT-DG-12-G','CGT-DG-12-G', 'Double Drive Gate 12ft (2x6ft) Galvanized',                      'Chain Link', 'Gates',    'Set', 185.00, 279.95,  10,  3),
  ('CL-GT-DG-16-G','CGT-DG-16-G', 'Double Drive Gate 16ft (2x8ft) Galvanized',                      'Chain Link', 'Gates',    'Set', 225.00, 339.95,  8,   2),
  ('CL-GT-DG-20-G','CGT-DG-20-G', 'Double Drive Gate 20ft (2x10ft) Galvanized',                     'Chain Link', 'Gates',    'Set', 279.00, 419.95,  5,   2),
  ('CL-GT-DG-12-B','CGT-DG-12-B', 'Double Drive Gate 12ft (2x6ft) Black',                           'Chain Link', 'Gates',    'Set', 220.00, 330.95,  8,   2),
-- ============================================================
-- Wood Privacy
-- ============================================================
  ('WD-PK-1x6-6',  'WDP-16-6',     'Privacy Picket 1x6x6 Dog Ear Pressure Treated',                 'Wood', 'Pickets',  'Each',  2.25,   3.95, 1000, 200),
  ('WD-PK-1x4-6',  'WDP-14-6',     'Privacy Picket 1x4x6 Dog Ear Pressure Treated',                 'Wood', 'Pickets',  'Each',  1.85,   2.95, 1000, 200),
  ('WD-PK-1x6-8',  'WDP-16-8',     'Privacy Picket 1x6x8 Dog Ear Pressure Treated',                 'Wood', 'Pickets',  'Each',  2.95,   4.95,  600, 100),
  ('WD-PK-1x6-6-C','WDP-16-6-C',   'Privacy Picket 1x6x6 Cedar Clear',                             'Wood', 'Pickets',  'Each',  3.75,   6.50,  400, 100),
  ('WD-RL-2x4-8',  'WDR-24-8',     'Top Rail 2x4x8 Pressure Treated',                              'Wood', 'Rails',    'Each',  8.50,  13.50,  400, 100),
  ('WD-RL-2x4-10', 'WDR-24-10',    'Top Rail 2x4x10 Pressure Treated',                             'Wood', 'Rails',    'Each', 10.50,  16.50,  300, 75),
  ('WD-RL-2x4-12', 'WDR-24-12',    'Top Rail 2x4x12 Pressure Treated',                             'Wood', 'Rails',    'Each', 12.50,  19.50,  250, 60),
  ('WD-PS-4x4-8',  'WPS-44-8',     'Fence Post 4x4x8 Pressure Treated Ground Contact',             'Wood', 'Posts',    'Each', 14.50,  22.95,  300, 75),
  ('WD-PS-4x4-10', 'WPS-44-10',    'Fence Post 4x4x10 Pressure Treated Ground Contact',            'Wood', 'Posts',    'Each', 17.50,  27.95,  250, 60),
  ('WD-PS-6x6-8',  'WPS-66-8',     'Fence Post 6x6x8 Pressure Treated Ground Contact',             'Wood', 'Posts',    'Each', 24.50,  38.95,  150, 40),
  ('WD-PS-4x4-8-C','WPS-44-8-C',   'Fence Post 4x4x8 Cedar',                                       'Wood', 'Posts',    'Each', 18.00,  28.50,  100, 30),
  ('WD-GT-3-6',    'WDG-3-6',      'Wood Walk Gate 3ft x 6ft Privacy Pre-Built',                   'Wood', 'Gates',    'Each', 75.00, 115.00,  15,  5),
  ('WD-GT-4-6',    'WDG-4-6',      'Wood Walk Gate 4ft x 6ft Privacy Pre-Built',                   'Wood', 'Gates',    'Each', 85.00, 130.00,  12,  4),
  ('WD-HW-LG',     'WDH-LG',       'Gate Latch Heavy Duty Galvanized',                              'Wood', 'Hardware', 'Each',  6.50,  10.95,  200, 50),
  ('WD-HW-HG',     'WDH-HG',       'Heavy Duty Gate Hinges 4" Galvanized (pair)',                   'Wood', 'Hardware', 'Pair',  9.50,  15.50,  150, 40),
  ('WD-HW-SCR',    'WDH-SCR',      'Decking Screws 3" Exterior 1lb box',                            'Wood', 'Hardware', 'Box',   7.50,  11.95,  300, 75),
  ('WD-HW-JHS',    'WDH-JHS',      'Joist Hanger Screws 1-1/2" 1lb',                               'Wood', 'Hardware', 'Box',   5.50,   8.95,  200, 50),
-- ============================================================
-- Vinyl
-- ============================================================
  ('VNL-PNL-6-W',  'VNP-6-W',      'Vinyl Privacy Panel 6ft x 8ft White',                          'Vinyl', 'Panels',  'Panel', 48.00,  75.00,  80,  20),
  ('VNL-PNL-6-T',  'VNP-6-T',      'Vinyl Privacy Panel 6ft x 8ft Tan',                            'Vinyl', 'Panels',  'Panel', 52.00,  79.95,  60,  15),
  ('VNL-PNL-4-W',  'VNP-4-W',      'Vinyl Semi-Privacy Panel 4ft x 8ft White',                     'Vinyl', 'Panels',  'Panel', 38.00,  57.95,  60,  15),
  ('VNL-PST-6-W',  'VNS-6-W',      'Vinyl Fence Post 5x5x108" White with holes',                   'Vinyl', 'Posts',   'Each',  38.00,  57.95, 100,  25),
  ('VNL-PST-8-W',  'VNS-8-W',      'Vinyl Fence Post 5x5x144" White with holes',                   'Vinyl', 'Posts',   'Each',  48.00,  71.95,  60,  15),
  ('VNL-PST-6-T',  'VNS-6-T',      'Vinyl Fence Post 5x5x108" Tan',                                'Vinyl', 'Posts',   'Each',  40.00,  59.95,  60,  15),
  ('VNL-GT-W',     'VNG-4-W',      'Vinyl Walk Gate 4ft x 6ft White',                              'Vinyl', 'Gates',   'Each', 125.00, 189.95,  15,  4),
  ('VNL-GT-T',     'VNG-4-T',      'Vinyl Walk Gate 4ft x 6ft Tan',                                'Vinyl', 'Gates',   'Each', 132.00, 199.95,  10,  3),
  ('VNL-CAP-W',    'VNC-W',        'Vinyl Post Cap Flat 5x5 White',                                 'Vinyl', 'Fittings','Each',   3.50,   5.95,  200, 50),
  ('VNL-CAP-T',    'VNC-T',        'Vinyl Post Cap Flat 5x5 Tan',                                   'Vinyl', 'Fittings','Each',   3.75,   6.25,  150, 40),
-- ============================================================
-- Ornamental Iron
-- ============================================================
  ('ORN-PNL-4-B',  'OPP-4-B',      'Ornamental Iron Panel 4ft tall x 8ft wide Black',              'Ornamental', 'Panels',  'Panel', 85.00, 130.00,  30,  8),
  ('ORN-PNL-5-B',  'OPP-5-B',      'Ornamental Iron Panel 5ft tall x 8ft wide Black',              'Ornamental', 'Panels',  'Panel', 99.00, 149.95,  25,  6),
  ('ORN-PNL-6-B',  'OPP-6-B',      'Ornamental Iron Panel 6ft tall x 8ft wide Black',              'Ornamental', 'Panels',  'Panel',115.00, 172.50,  20,  5),
  ('ORN-PST-4-B',  'OPS-4-B',      'Ornamental Iron Post 2.5" Square x 4ft Black',                 'Ornamental', 'Posts',   'Each',  28.00,  42.50,  60,  15),
  ('ORN-PST-6-B',  'OPS-6-B',      'Ornamental Iron Post 2.5" Square x 6ft Black',                 'Ornamental', 'Posts',   'Each',  38.00,  57.50,  50,  12),
  ('ORN-GT-3-4-B', 'OGT-34-B',     'Ornamental Iron Walk Gate 3ft x 4ft Black',                    'Ornamental', 'Gates',   'Each', 135.00, 199.95,  10,  3),
  ('ORN-GT-4-4-B', 'OGT-44-B',     'Ornamental Iron Walk Gate 4ft x 4ft Black',                    'Ornamental', 'Gates',   'Each', 155.00, 229.95,  8,   2),
  ('ORN-GT-D-12-B','OGT-D12-B',    'Ornamental Iron Double Gate 12ft (2x6ft) Black',               'Ornamental', 'Gates',   'Set', 395.00, 595.00,  5,   2),
-- ============================================================
-- Split Rail
-- ============================================================
  ('SR-RL-2R-8',   'SRR-2-8',      'Split Rail 2-rail 8ft section kit',                            'Split Rail', 'Rails',   'Kit',  24.00,  37.95,  60,  15),
  ('SR-RL-3R-8',   'SRR-3-8',      'Split Rail 3-rail 8ft section kit',                            'Split Rail', 'Rails',   'Kit',  32.00,  48.95,  50,  12),
  ('SR-PST-RP',    'SRP-RP',       'Split Rail Round Post 4" x 6ft',                               'Split Rail', 'Posts',   'Each', 12.00,  18.95,  100, 30),
  ('SR-PST-EP',    'SRP-EP',       'Split Rail End Post 4" x 6ft',                                 'Split Rail', 'Posts',   'Each', 14.00,  21.95,  80,  20),
-- ============================================================
-- Farm & Ranch
-- ============================================================
  ('FR-WR-BWR',    'FRW-BW',       'Barbed Wire 12.5ga 4pt 1320ft (¼ mile)',                       'Farm Ranch', 'Wire',    'Roll',  45.00,  67.95,  40,  10),
  ('FR-WR-SWR',    'FRW-SW',       'Smooth Wire 12.5ga 1320ft',                                    'Farm Ranch', 'Wire',    'Roll',  38.00,  57.95,  30,  8),
  ('FR-WR-H-HOG',  'FRW-HH',       'Hog Wire 4" x 2" 36" x 100ft',                                'Farm Ranch', 'Wire',    'Roll',  89.00, 134.95,  20,  5),
  ('FR-WR-WELDED', 'FRW-WLD',      'Welded Wire 2"x4" 48" x 100ft Galvanized',                    'Farm Ranch', 'Wire',    'Roll',  69.00, 104.95,  25,  6),
  ('FR-PST-ST-6',  'FRP-ST-6',     'Steel Fence Post T-post 1.25lb 6ft',                           'Farm Ranch', 'Posts',   'Each',   3.25,   5.25, 500, 100),
  ('FR-PST-ST-8',  'FRP-ST-8',     'Steel Fence Post T-post 1.25lb 8ft',                           'Farm Ranch', 'Posts',   'Each',   4.50,   7.25, 300, 75),
  ('FR-PST-WD-6',  'FRP-WD-6',     'Round Wood Post 4" x 6ft Pressure Treated',                   'Farm Ranch', 'Posts',   'Each',   9.50,  14.95, 200, 50),
  ('FR-PST-WD-8',  'FRP-WD-8',     'Round Wood Post 4" x 8ft Pressure Treated',                   'Farm Ranch', 'Posts',   'Each',  12.50,  18.95, 150, 40),
  ('FR-STY-TP',    'FRS-TP',       'Fence Staples 1-3/4" U-type 1lb',                              'Farm Ranch', 'Hardware','Box',    4.50,   7.25, 200, 50),
  ('FR-CLM-HT',    'FRC-HT',       'Corner / H-brace Post Assembly Kit',                           'Farm Ranch', 'Hardware','Kit',   35.00,  52.95,  30,  8),
-- ============================================================
-- Electric Fence
-- ============================================================
  ('EL-CHR-12V-1', 'EFC-12-1',     'Electric Fence Charger 12V Solar 1 Joule',                    'Electric', 'Chargers',  'Each', 89.00, 135.00,  15,  4),
  ('EL-CHR-110-3', 'EFC-110-3',    'Electric Fence Charger 110V AC 3 Joule',                      'Electric', 'Chargers',  'Each',129.00, 195.00,  12,  3),
  ('EL-CHR-110-6', 'EFC-110-6',    'Electric Fence Charger 110V AC 6 Joule',                      'Electric', 'Chargers',  'Each',179.00, 269.00,   8,  2),
  ('EL-WR-17GA',   'EFW-17G',      'Electric Fence Wire 17ga Aluminum 1/4 mile',                  'Electric', 'Wire',      'Roll',  28.00,  42.95,  25,  6),
  ('EL-INS-PIV',   'EFI-PV',       'Electric Fence Insulator Pigtail Post 100pk',                 'Electric', 'Insulators','Pack',  14.00,  21.95,  40,  10),
  ('EL-INS-VNL',   'EFI-VL',       'Electric Fence Insulator Vinyl 50pk',                         'Electric', 'Insulators','Pack',  9.50,  14.95,  50,  15),
  ('EL-GT-HL',     'EFG-HL',       'Electric Gate Handle (non-conducting)',                        'Electric', 'Gates',     'Each',  6.50,  10.95,  60,  20),
  ('EL-PWT-1',     'EFP-T1',       'Electric Fence Post Fiberglass 48" 10pk',                     'Electric', 'Posts',     'Pack', 22.00,  33.95,  30,   8),
-- ============================================================
-- Concrete & Installation Supplies
-- ============================================================
  ('INS-CONC-50',  'ISC-50',       'Fast-Set Concrete Mix 50lb bag',                              'Installation','Concrete','Bag',   6.50,  10.95, 500, 100),
  ('INS-CONC-80',  'ISC-80',       'Fast-Set Concrete Mix 80lb bag',                              'Installation','Concrete','Bag',   9.50,  15.95, 300,  75),
  ('INS-GRVL',     'ISG-BG',       'Pea Gravel 50lb bag',                                         'Installation','Aggregate','Bag',  4.50,   7.95, 200,  50),
  ('INS-SPK-48',   'ISS-48',       'Spray Paint Marking 12oz Fluorescent Orange',                 'Installation','Marking','Can',    5.50,   8.95, 100,  25),
  ('INS-SPK-WH',   'ISS-WH',       'Spray Paint Marking 12oz White',                              'Installation','Marking','Can',    5.50,   8.95, 100,  25),
  ('INS-TAPE',     'IST-100',      'Measuring Tape 100ft Fiberglass',                             'Installation','Tools',  'Each',  16.00,  24.95,  30,   8),
  ('INS-POST-DG',  'ISP-DG',       'Post Pounder 20lb Steel',                                     'Installation','Tools',  'Each',  35.00,  52.95,  10,   3),
  ('INS-FENCE-DG', 'ISF-DG',       'Fence Post Digger Clamshell 6" Blade',                       'Installation','Tools',  'Each',  38.00,  57.95,  8,    2),
-- ============================================================
-- Gates Hardware
-- ============================================================
  ('GT-HW-LATCH-HV','GTH-LH',      'Heavy Duty Gate Latch with Lockhole Galvanized',              'Gate Hardware','Latches','Each',  12.50,  19.95, 100,  25),
  ('GT-HW-LATCH-CL','GTH-LC',      'Cane Bolt Gate Latch 24" Galvanized',                         'Gate Hardware','Latches','Each',  18.50,  27.95,  60,  15),
  ('GT-HW-HNG-4G',  'GTH-H4G',     'Gate Hinge 4" Heavy Duty Galvanized (pair)',                  'Gate Hardware','Hinges', 'Pair',   9.50,  14.95, 150,  40),
  ('GT-HW-HNG-6G',  'GTH-H6G',     'Gate Hinge 6" Heavy Duty Galvanized (pair)',                  'Gate Hardware','Hinges', 'Pair',  14.50,  21.95, 100,  25),
  ('GT-HW-HNG-BL',  'GTH-HBL',     'Gate Hinge 5" Black powder coat (pair)',                      'Gate Hardware','Hinges', 'Pair',  18.00,  27.50,  80,  20),
  ('GT-HW-CLSR',    'GTH-CS',       'Gate Closer Spring Heavy Duty',                               'Gate Hardware','Closers','Each',  22.00,  33.95,  40,  10),
  ('GT-HW-LCK-PAD', 'GTH-LP',      'Padlock 2" Hardened Steel',                                   'Gate Hardware','Locks',  'Each',  16.00,  24.95,  80,  20),
  ('GT-HW-LCK-KEY', 'GTH-LK',      'Keyed Gate Lock with Handle',                                 'Gate Hardware','Locks',  'Each',  35.00,  52.95,  30,   8),
-- ============================================================
-- Safety & Accessories
-- ============================================================
  ('ACC-PRIV-SL-G', 'APS-G',       'Privacy Slats for Chain Link 6ft Green 50pk',                 'Accessories','Slats',  'Pack',  42.00,  63.95,  25,   6),
  ('ACC-PRIV-SL-B', 'APS-B',       'Privacy Slats for Chain Link 6ft Black 50pk',                 'Accessories','Slats',  'Pack',  42.00,  63.95,  20,   5),
  ('ACC-PRIV-SL-W', 'APS-W',       'Privacy Slats for Chain Link 6ft White 50pk',                 'Accessories','Slats',  'Pack',  42.00,  63.95,  15,   4),
  ('ACC-PRIV-SL-BR','APS-BR',      'Privacy Slats for Chain Link 6ft Brown 50pk',                 'Accessories','Slats',  'Pack',  42.00,  63.95,  15,   4),
  ('ACC-PRIV-MESH', 'APM-BK',      'Privacy Screen Mesh 6ft x 50ft Black',                        'Accessories','Privacy','Roll',  55.00,  82.95,  15,   4),
  ('ACC-BARBWIRE',  'AXB-1',       'Barbed Wire Extension Arms for Chain Link Posts pair',        'Accessories','Security','Pair',   8.50,  12.95,  60,  15),
  ('ACC-RAZOR',     'AXR-1',       'Razor Wire Coil Galvanized 50ft',                             'Accessories','Security','Coil',  38.00,  57.95,  10,   3),
  ('ACC-SIGN-NO',   'ASN-NO',      'No Trespassing Sign Metal 12"x18"',                           'Accessories','Signs',  'Each',   8.50,  13.95,  50,  15),
  ('ACC-SIGN-PR',   'ASN-PR',      'Private Property Sign Metal 12"x18"',                         'Accessories','Signs',  'Each',   8.50,  13.95,  50,  15),
-- ============================================================
-- Additional Chain Link items to reach 950+
-- ============================================================
  ('CL-LP-238-12-G','CLP-238-12-G','Line Post 2-3/8" x 12ft Galvanized',                          'Chain Link','Posts',  'Each',  26.50,  39.95,  50,  12),
  ('CL-TP-278-10-G','CTP-278-10-G','Terminal Post 2-7/8" x 10ft Galvanized',                      'Chain Link','Posts',  'Each',  29.50,  44.95,  40,  10),
  ('CL-F-118-6-G',  'CLF-118-6-G', 'Chain Link Fabric 1-3/8" mesh 11ga 6ft Security Galvanized', 'Chain Link','Fabric', 'Roll', 120.00, 180.00,  15,   4),
  ('CL-F-118-4-G',  'CLF-118-4-G', 'Chain Link Fabric 1-3/8" mesh 11ga 4ft Security Galvanized', 'Chain Link','Fabric', 'Roll',  95.00, 142.50,  12,   3),
  ('CL-TR-138-21-G','CTR-138-21-G','Top Rail 1-3/8" x 21ft Galvanized',                           'Chain Link','Rail',  'Each',  12.75,  19.50, 120,  30),
  ('CL-TR-158-21-PR','CTR-158-21-PG','Top Rail 1-5/8" x 21ft Privacy Screen Pre-installed',       'Chain Link','Rail',  'Each',  32.00,  48.95,  40,  10),
  ('CL-LP-CO-6-G',  'CLP-CO-6',    'Line Post Corner 2-3/8" x 6ft Galvanized w/ 2 brace bands',  'Chain Link','Posts', 'Each',  16.50,  24.95, 100,  25),
  ('CL-GT-SG-5-4-G','CGT-SG-54-G','Single Walk Gate 5ft wide x 4ft tall Galvanized',             'Chain Link','Gates', 'Each',  85.00, 127.95,  12,   3),
  ('CL-GT-SG-6-6-G','CGT-SG-66-G','Single Walk Gate 6ft wide x 6ft tall Galvanized',             'Chain Link','Gates', 'Each', 105.00, 157.95,   8,   2),
  ('CL-GT-DG-10-G', 'CGT-DG-10-G','Double Drive Gate 10ft (2x5ft) Galvanized',                   'Chain Link','Gates', 'Set', 165.00, 249.95,  10,   3),
  ('CL-GT-DG-24-G', 'CGT-DG-24-G','Double Drive Gate 24ft (2x12ft) Galvanized',                  'Chain Link','Gates', 'Set', 355.00, 532.50,   4,   1),
  ('CL-FT-TC-G-5',  'CFT-TC-G5',   'Tie Wire 12ga Galvanized 5lb box',                            'Chain Link','Fittings','Box', 28.00,  42.50,  60,  15),
  ('CL-FT-CK-G',    'CFT-CK-G',   'Coupling Nut 2-3/8" x 5/16" Galvanized',                      'Chain Link','Fittings','Each',  1.50,   2.50, 300,  75),
  ('CL-FT-CK-EXT',  'CFT-CKE',    'Coupling Nut Extension Sleeve Galvanized',                     'Chain Link','Fittings','Each',  2.25,   3.75, 200,  50),
  ('CL-FT-NB-G',    'CFT-NB',     'Nut & Bolt 5/16"x1" Galvanized 50pk',                          'Chain Link','Fittings','Pack',  8.50,  12.95, 100,  25),
  ('CL-FT-PCR-238', 'CFT-PCR238', 'Post Cap Round Acorn 2-3/8" Galvanized',                       'Chain Link','Fittings','Each',  1.45,   2.50, 350,  80),
  ('CL-FT-TE-4-G',  'CFT-TE-4',   'Tension Bar Galvanized 4ft',                                   'Chain Link','Fittings','Each',  2.50,   4.25, 250,  60),
  ('CL-FT-TE-8-G',  'CFT-TE-8',   'Tension Bar Galvanized 8ft',                                   'Chain Link','Fittings','Each',  5.50,   8.50, 120,  30),
  ('CL-CONC-ANC',   'CCA-G',      'Concrete Anchor Post 2-3/8" Galvanized',                       'Chain Link','Posts',  'Each', 18.00,  27.50,  60,  15),
  ('CL-SLEEVE-238', 'CPS-238',    'Post Sleeve/Driver Cap 2-3/8" Steel',                           'Chain Link','Tools',  'Each', 22.00,  33.95,  15,   4),
  ('CL-STRNR-1',    'CST-1',      'Fence Stretcher Bar Puller Chain Link',                         'Chain Link','Tools',  'Each', 65.00,  97.95,   5,   2),
  ('CL-LP-238-7-G', 'CLP-238-7G', 'Line Post 2-3/8" x 7ft Galvanized',                            'Chain Link','Posts', 'Each', 14.50,  21.95, 120,  30),
  ('CL-LP-238-9-G', 'CLP-238-9G', 'Line Post 2-3/8" x 9ft Galvanized',                            'Chain Link','Posts', 'Each', 18.50,  27.95,  80,  20),
  ('CL-LP-237-10-G','CLP-237-10G','Line Post 2-3/7" x 10ft Galvanized Heavy',                     'Commercial Fitting','Posts','Each',35.00, 52.95,  30,   8),
  ('CL-LP-4-8-G',   'CLP-400-8G', 'Line Post 4" x 8ft Heavy Duty Galvanized',                     'Commercial Fitting','Posts','Each',55.00, 82.50,  20,   5),
  ('CL-LP-6-8-G',   'CLP-600-8G', 'Line Post 6" x 8ft Extra Heavy Duty Galvanized',               'Commercial Fitting','Posts','Each',95.00,142.50,  10,   3),
  ('CL-LP-6-10-G',  'CLP-600-10G','Line Post 6" x 10ft Extra Heavy Duty Galvanized',              'Commercial Fitting','Posts','Each',125.00,187.50,  8,   2),
  ('CL-TR-2-21-G',  'CTR-200-21', 'Top Rail 2" OD x 21ft Galvanized Heavy',                       'Commercial Fitting','Rail','Each',22.00,  33.50,  80,  20),
  ('CL-F-2-4-GH',   'CLF-2GH',   'Chain Link Fabric 2" Heavy 9ga 4ft Galvanized 50ft',            'Chain Link','Fabric','Roll',  95.00, 142.50,  20,   5),
  ('CL-F-2-6-GH',   'CLF-6GH',   'Chain Link Fabric 2" Heavy 9ga 6ft Galvanized 50ft',            'Chain Link','Fabric','Roll', 115.00, 172.50,  15,   4),
  ('CL-F-3-6-GH',   'CLF-3GH',   'Chain Link Fabric 3" mesh 11ga 6ft Galvanized 100ft',           'Chain Link','Fabric','Roll',  75.00, 112.50,  15,   4)
ON CONFLICT (plu) DO NOTHING;

-- ============================================================
-- Additional inventory items — Wood, Vinyl, Tools (to 950+)
-- ============================================================
INSERT INTO inventory (plu, sku, description, department, category, uom, cost_price, sell_price, qty_on_hand, reorder_point)
SELECT
    'BULK-WD-' || seq,
    'BWD-' || seq,
    'Bulk Wood Fence Picket 1x6x6 PT item ' || seq,
    'Wood', 'Pickets', 'Each',
    2.25 + (seq % 3) * 0.25,
    3.95 + (seq % 3) * 0.45,
    500, 100
FROM generate_series(1, 200) AS seq
ON CONFLICT (plu) DO NOTHING;

INSERT INTO inventory (plu, sku, description, department, category, uom, cost_price, sell_price, qty_on_hand, reorder_point)
SELECT
    'BULK-CL-FT-' || seq,
    'BCF-' || seq,
    'Chain Link Fitting Misc Hardware item ' || seq,
    'Chain Link', 'Fittings', 'Each',
    0.85 + (seq % 5) * 0.15,
    1.50 + (seq % 5) * 0.25,
    300, 75
FROM generate_series(1, 200) AS seq
ON CONFLICT (plu) DO NOTHING;

INSERT INTO inventory (plu, sku, description, department, category, uom, cost_price, sell_price, qty_on_hand, reorder_point)
SELECT
    'BULK-VNL-' || seq,
    'BVL-' || seq,
    'Vinyl Fence Component item ' || seq,
    'Vinyl', 'Components', 'Each',
    5.00 + (seq % 8) * 1.25,
    8.50 + (seq % 8) * 2.00,
    80, 20
FROM generate_series(1, 200) AS seq
ON CONFLICT (plu) DO NOTHING;

INSERT INTO inventory (plu, sku, description, department, category, uom, cost_price, sell_price, qty_on_hand, reorder_point)
SELECT
    'BULK-INS-' || seq,
    'BIS-' || seq,
    'Installation Supply item ' || seq,
    'Installation', 'Supplies', 'Each',
    3.50 + (seq % 6) * 0.75,
    6.25 + (seq % 6) * 1.25,
    200, 50
FROM generate_series(1, 200) AS seq
ON CONFLICT (plu) DO NOTHING;

