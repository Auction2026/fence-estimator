-- ============================================================
-- FENCE DEPOT FENCE ESTIMATOR - SEED DATA
-- 950+ Products: Chain Link, Wood, Vinyl, Posts, Hardware, Gates
-- Run AFTER schema.sql
-- ============================================================

USE fence_estimator;

-- ============================================================
-- SEED: Default Admin User
-- Password: FenceDepot2024! (change immediately after setup)
-- ============================================================
INSERT INTO users (username, email, password_hash, role, first_name, last_name, company) VALUES
('admin',    'admin@fencedepot.ca',    '$2b$10$XKp8OqzxKx3j7n9s1eO0.eKnkZXqDYqsQ5LQF3bEt0nU4K2dS5T6i', 'admin',     'Admin',   'User',    'Fence Depot'),
('estimator','estimator@fencedepot.ca','$2b$10$XKp8OqzxKx3j7n9s1eO0.eKnkZXqDYqsQ5LQF3bEt0nU4K2dS5T6i', 'estimator', 'John',    'Smith',   'Fence Depot');

-- ============================================================
-- SEED: inventory_products - PART 1: CHAIN LINK FABRIC
-- Department: Chain Link
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('CL-F-0348-50', 'Chain Link Fabric 3-1/2" Mesh 48" x 50ft Galvanized',         'Chain Link', 'ROLL', 68.50,  89.00,  25.000),
('CL-F-0348-100','Chain Link Fabric 3-1/2" Mesh 48" x 100ft Galvanized',         'Chain Link', 'ROLL', 132.00, 172.00, 15.000),
('CL-F-0360-50', 'Chain Link Fabric 3-1/2" Mesh 60" x 50ft Galvanized',          'Chain Link', 'ROLL', 84.00,  109.00, 20.000),
('CL-F-0360-100','Chain Link Fabric 3-1/2" Mesh 60" x 100ft Galvanized',         'Chain Link', 'ROLL', 162.00, 211.00, 12.000),
('CL-F-0372-50', 'Chain Link Fabric 3-1/2" Mesh 72" x 50ft Galvanized',          'Chain Link', 'ROLL', 99.00,  129.00, 18.000),
('CL-F-0372-100','Chain Link Fabric 3-1/2" Mesh 72" x 100ft Galvanized',         'Chain Link', 'ROLL', 192.00, 250.00, 10.000),
('CL-F-0396-50', 'Chain Link Fabric 3-1/2" Mesh 96" x 50ft Galvanized',          'Chain Link', 'ROLL', 129.00, 168.00, 8.000),
('CL-F-0348-50B','Chain Link Fabric 3-1/2" Mesh 48" x 50ft Black Vinyl Coated',  'Chain Link', 'ROLL', 89.00,  116.00, 20.000),
('CL-F-0360-50B','Chain Link Fabric 3-1/2" Mesh 60" x 50ft Black Vinyl Coated',  'Chain Link', 'ROLL', 109.00, 142.00, 15.000),
('CL-F-0372-50B','Chain Link Fabric 3-1/2" Mesh 72" x 50ft Black Vinyl Coated',  'Chain Link', 'ROLL', 129.00, 168.00, 12.000),
('CL-F-0348-50G','Chain Link Fabric 3-1/2" Mesh 48" x 50ft Green Vinyl Coated',  'Chain Link', 'ROLL', 89.00,  116.00, 10.000),
('CL-F-0360-50G','Chain Link Fabric 3-1/2" Mesh 60" x 50ft Green Vinyl Coated',  'Chain Link', 'ROLL', 109.00, 142.00, 8.000),
('CL-F-0248-50', 'Chain Link Fabric 2" Mesh 48" x 50ft Galvanized',              'Chain Link', 'ROLL', 79.00,  103.00, 15.000),
('CL-F-0260-50', 'Chain Link Fabric 2" Mesh 60" x 50ft Galvanized',              'Chain Link', 'ROLL', 96.00,  125.00, 12.000),
('CL-F-0272-50', 'Chain Link Fabric 2" Mesh 72" x 50ft Galvanized',              'Chain Link', 'ROLL', 115.00, 150.00, 8.000),
('CL-F-1548-50', 'Chain Link Fabric 1-3/4" Mesh 48" x 50ft Galvanized (Sec)',    'Chain Link', 'ROLL', 109.00, 142.00, 5.000),
('CL-F-0248-50B','Chain Link Fabric 2" Mesh 48" x 50ft Black Vinyl Coated',      'Chain Link', 'ROLL', 99.00,  129.00, 8.000),
('CL-F-0260-50B','Chain Link Fabric 2" Mesh 60" x 50ft Black Vinyl Coated',      'Chain Link', 'ROLL', 120.00, 156.00, 6.000),
-- Security mesh
('CL-F-1148-50', 'Chain Link Fabric 1" Mesh 48" x 50ft Security Grade Galv.',    'Chain Link', 'ROLL', 139.00, 181.00, 4.000),
('CL-F-1160-50', 'Chain Link Fabric 1" Mesh 60" x 50ft Security Grade Galv.',    'Chain Link', 'ROLL', 169.00, 220.00, 3.000);

-- ============================================================
-- SEED: inventory_products - PART 2: CHAIN LINK POSTS (LINE)
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('CL-PL-163-06', 'Chain Link Line Post 1-5/8" OD 6ft Galvanized',                'Chain Link', 'EA',   8.50,   11.00,  200.000),
('CL-PL-163-08', 'Chain Link Line Post 1-5/8" OD 8ft Galvanized',                'Chain Link', 'EA',   11.00,  14.00,  150.000),
('CL-PL-163-10', 'Chain Link Line Post 1-5/8" OD 10ft Galvanized',               'Chain Link', 'EA',   14.00,  18.00,  100.000),
('CL-PL-163-12', 'Chain Link Line Post 1-5/8" OD 12ft Galvanized',               'Chain Link', 'EA',   17.00,  22.00,  60.000),
('CL-PL-190-08', 'Chain Link Line Post 1-7/8" OD 8ft Galvanized',                'Chain Link', 'EA',   13.00,  17.00,  120.000),
('CL-PL-190-10', 'Chain Link Line Post 1-7/8" OD 10ft Galvanized',               'Chain Link', 'EA',   16.00,  21.00,  80.000),
('CL-PL-190-12', 'Chain Link Line Post 1-7/8" OD 12ft Galvanized',               'Chain Link', 'EA',   20.00,  26.00,  50.000),
('CL-PL-238-08', 'Chain Link Line Post 2-3/8" OD 8ft Galvanized',                'Chain Link', 'EA',   18.00,  23.00,  100.000),
('CL-PL-238-10', 'Chain Link Line Post 2-3/8" OD 10ft Galvanized',               'Chain Link', 'EA',   22.00,  29.00,  70.000),
('CL-PL-238-12', 'Chain Link Line Post 2-3/8" OD 12ft Galvanized',               'Chain Link', 'EA',   27.00,  35.00,  40.000),
('CL-PL-238-14', 'Chain Link Line Post 2-3/8" OD 14ft Galvanized',               'Chain Link', 'EA',   32.00,  42.00,  25.000),
('CL-PL-238-16', 'Chain Link Line Post 2-3/8" OD 16ft Galvanized',               'Chain Link', 'EA',   37.00,  48.00,  15.000),
('CL-PL-288-10', 'Chain Link Line Post 2-7/8" OD 10ft Galvanized',               'Chain Link', 'EA',   28.00,  36.00,  50.000),
('CL-PL-288-12', 'Chain Link Line Post 2-7/8" OD 12ft Galvanized',               'Chain Link', 'EA',   34.00,  44.00,  35.000),
('CL-PL-338-10', 'Chain Link Line Post 3-3/8" OD 10ft Galvanized (Comm.)',        'Chain Link', 'EA',   38.00,  49.00,  30.000),
('CL-PL-338-12', 'Chain Link Line Post 3-3/8" OD 12ft Galvanized (Comm.)',        'Chain Link', 'EA',   46.00,  60.00,  20.000),
('CL-PL-400-10', 'Chain Link Line Post 4" OD 10ft Galvanized (Industrial)',       'Chain Link', 'EA',   52.00,  68.00,  15.000),
('CL-PL-400-12', 'Chain Link Line Post 4" OD 12ft Galvanized (Industrial)',       'Chain Link', 'EA',   63.00,  82.00,  10.000),
-- Black vinyl coated posts
('CL-PL-163-08B','Chain Link Line Post 1-5/8" OD 8ft Black Vinyl Coated',        'Chain Link', 'EA',   14.00,  18.00,  60.000),
('CL-PL-190-08B','Chain Link Line Post 1-7/8" OD 8ft Black Vinyl Coated',        'Chain Link', 'EA',   18.00,  23.00,  40.000),
('CL-PL-238-08B','Chain Link Line Post 2-3/8" OD 8ft Black Vinyl Coated',        'Chain Link', 'EA',   24.00,  31.00,  30.000),
('CL-PL-238-10B','Chain Link Line Post 2-3/8" OD 10ft Black Vinyl Coated',       'Chain Link', 'EA',   29.00,  38.00,  20.000);

-- ============================================================
-- SEED: inventory_products - PART 3: CHAIN LINK TERMINAL POSTS
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('CL-PT-238-08', 'Chain Link Terminal Post 2-3/8" OD 8ft Galvanized',            'Chain Link', 'EA',   22.00,  29.00,  80.000),
('CL-PT-238-10', 'Chain Link Terminal Post 2-3/8" OD 10ft Galvanized',           'Chain Link', 'EA',   27.00,  35.00,  60.000),
('CL-PT-238-12', 'Chain Link Terminal Post 2-3/8" OD 12ft Galvanized',           'Chain Link', 'EA',   33.00,  43.00,  40.000),
('CL-PT-288-10', 'Chain Link Terminal Post 2-7/8" OD 10ft Galvanized',           'Chain Link', 'EA',   35.00,  46.00,  30.000),
('CL-PT-288-12', 'Chain Link Terminal Post 2-7/8" OD 12ft Galvanized',           'Chain Link', 'EA',   42.00,  55.00,  20.000),
('CL-PT-338-10', 'Chain Link Terminal Post 3-3/8" OD 10ft Galvanized (Comm.)',   'Chain Link', 'EA',   48.00,  62.00,  15.000),
('CL-PT-400-12', 'Chain Link Terminal Post 4" OD 12ft Galvanized (Industrial)',  'Chain Link', 'EA',   68.00,  88.00,  10.000),
('CL-PT-238-08B','Chain Link Terminal Post 2-3/8" OD 8ft Black Vinyl Coated',    'Chain Link', 'EA',   28.00,  36.00,  25.000),
('CL-PT-238-10B','Chain Link Terminal Post 2-3/8" OD 10ft Black Vinyl Coated',   'Chain Link', 'EA',   34.00,  44.00,  15.000);

-- ============================================================
-- SEED: inventory_products - PART 4: CHAIN LINK TOP RAIL
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('CL-TR-138-21', 'Chain Link Top Rail 1-3/8" OD 21ft Galvanized',                'Chain Link', 'EA',   14.00,  18.00,  150.000),
('CL-TR-163-21', 'Chain Link Top Rail 1-5/8" OD 21ft Galvanized',                'Chain Link', 'EA',   17.00,  22.00,  120.000),
('CL-TR-190-21', 'Chain Link Top Rail 1-7/8" OD 21ft Galvanized',                'Chain Link', 'EA',   21.00,  27.00,  80.000),
('CL-TR-238-21', 'Chain Link Top Rail 2-3/8" OD 21ft Galvanized',                'Chain Link', 'EA',   27.00,  35.00,  60.000),
('CL-TR-138-21B','Chain Link Top Rail 1-3/8" OD 21ft Black Vinyl Coated',        'Chain Link', 'EA',   19.00,  25.00,  60.000),
('CL-TR-163-21B','Chain Link Top Rail 1-5/8" OD 21ft Black Vinyl Coated',        'Chain Link', 'EA',   22.00,  29.00,  40.000),
('CL-TR-190-21B','Chain Link Top Rail 1-7/8" OD 21ft Black Vinyl Coated',        'Chain Link', 'EA',   27.00,  35.00,  25.000),
('CL-TR-138-21G','Chain Link Top Rail 1-3/8" OD 21ft Green Vinyl Coated',        'Chain Link', 'EA',   19.00,  25.00,  20.000);

-- ============================================================
-- SEED: inventory_products - PART 5: CHAIN LINK HARDWARE (FITTINGS)
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('CL-HW-BB-163', 'Brace Band 1-5/8" Galvanized (each)',                          'Commercial Fitting', 'EA',  0.45,  0.59, 1000.000),
('CL-HW-BB-190', 'Brace Band 1-7/8" Galvanized (each)',                          'Commercial Fitting', 'EA',  0.50,  0.65, 800.000),
('CL-HW-BB-238', 'Brace Band 2-3/8" Galvanized (each)',                          'Commercial Fitting', 'EA',  0.65,  0.85, 600.000),
('CL-HW-BB-288', 'Brace Band 2-7/8" Galvanized (each)',                          'Commercial Fitting', 'EA',  0.85,  1.10, 400.000),
('CL-HW-BB-338', 'Brace Band 3-3/8" Galvanized (each)',                          'Commercial Fitting', 'EA',  1.10,  1.43, 200.000),
('CL-HW-BB-400', 'Brace Band 4" Galvanized (each)',                               'Commercial Fitting', 'EA',  1.35,  1.76, 150.000),
('CL-HW-RB-163', 'Rail End / Loop Cap 1-5/8" Galvanized',                        'Commercial Fitting', 'EA',  0.55,  0.72, 500.000),
('CL-HW-RB-190', 'Rail End / Loop Cap 1-7/8" Galvanized',                        'Commercial Fitting', 'EA',  0.65,  0.85, 400.000),
('CL-HW-RB-238', 'Rail End / Loop Cap 2-3/8" Galvanized',                        'Commercial Fitting', 'EA',  0.80,  1.04, 300.000),
('CL-HW-PC-163', 'Post Cap 1-5/8" Mushroom Galvanized',                          'Commercial Fitting', 'EA',  0.40,  0.52, 500.000),
('CL-HW-PC-190', 'Post Cap 1-7/8" Mushroom Galvanized',                          'Commercial Fitting', 'EA',  0.45,  0.59, 400.000),
('CL-HW-PC-238', 'Post Cap 2-3/8" Mushroom Galvanized',                          'Commercial Fitting', 'EA',  0.55,  0.72, 350.000),
('CL-HW-PC-288', 'Post Cap 2-7/8" Mushroom Galvanized',                          'Commercial Fitting', 'EA',  0.70,  0.91, 250.000),
('CL-HW-TW-12',  'Tension Wire 12-1/2 GA Galvanized - 100ft',                    'Chain Link', 'ROLL', 8.50,  11.00, 100.000),
('CL-HW-TW-9',   'Tension Wire 9 GA Galvanized - 100ft',                         'Chain Link', 'ROLL', 14.00, 18.00, 60.000),
('CL-HW-TB-163', 'Tension Bar 1-5/8" OD Fitting Galvanized',                     'Commercial Fitting', 'EA',  2.50,  3.25, 200.000),
('CL-HW-TB-190', 'Tension Bar 1-7/8" OD Fitting Galvanized',                     'Commercial Fitting', 'EA',  3.00,  3.90, 150.000),
('CL-HW-TB-238', 'Tension Bar 2-3/8" OD Fitting Galvanized',                     'Commercial Fitting', 'EA',  3.75,  4.88, 100.000),
('CL-HW-TC-163', 'Tension Band 1-5/8" Galvanized',                               'Commercial Fitting', 'EA',  0.65,  0.85, 600.000),
('CL-HW-TC-190', 'Tension Band 1-7/8" Galvanized',                               'Commercial Fitting', 'EA',  0.75,  0.98, 500.000),
('CL-HW-TC-238', 'Tension Band 2-3/8" Galvanized',                               'Commercial Fitting', 'EA',  0.90,  1.17, 400.000),
('CL-HW-TC-288', 'Tension Band 2-7/8" Galvanized',                               'Commercial Fitting', 'EA',  1.10,  1.43, 300.000),
('CL-HW-CL-S',   'Fence Tie Wire 12GA Galvanized Spool - 1 lb',                  'Chain Link', 'EA',   3.50,  4.55, 200.000),
('CL-HW-CL-L',   'Fence Tie Wire 12GA Galvanized Spool - 5 lb',                  'Chain Link', 'EA',   15.00, 19.50, 100.000),
('CL-HW-CB-38',  'Carriage Bolt 3/8" x 1-1/2" Galvanized (50 pack)',             'Commercial Fitting', 'PK',  6.50,  8.45, 100.000),
('CL-HW-NU-38',  'Hex Nut 3/8" Galvanized (100 pack)',                           'Commercial Fitting', 'PK',  4.50,  5.85, 100.000),
('CL-HW-CC-38',  'Carriage Bolt Cup 3/8" Galvanized Coupling Nut',               'Commercial Fitting', 'EA',  0.85,  1.10, 500.000),
('CL-HW-SR-238', 'Sleeves - Rail Swage 1-3/8" x 1-5/8" (connector)',             'Commercial Fitting', 'EA',  1.20,  1.56, 300.000),
('CL-HW-HC-S',   'Hog Rings Galvanized Box 100 ct',                              'Commercial Fitting', 'BX',  5.50,  7.15, 80.000),
('CL-HW-AA-38',  'Aluminum Tie Wire 12GA 1 lb Spool',                            'Commercial Fitting', 'EA',  4.50,  5.85, 60.000);

-- ============================================================
-- SEED: inventory_products - PART 6: BARBED WIRE
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('BW-2PT-12-1320','Barbed Wire 2-Point 12.5GA Galvanized 1320ft (Quarter Mile)', 'Chain Link', 'ROLL', 32.00, 41.60, 40.000),
('BW-4PT-12-1320','Barbed Wire 4-Point 12.5GA Galvanized 1320ft (Quarter Mile)', 'Chain Link', 'ROLL', 38.00, 49.40, 30.000),
('BW-2PT-14-1320','Barbed Wire 2-Point 14GA Galvanized 1320ft',                  'Chain Link', 'ROLL', 26.00, 33.80, 20.000),
('BW-ARM-163',   'Barbed Wire Arm / Extension Arm 1-5/8" (3-strand)',            'Commercial Fitting', 'EA',  2.80,  3.64, 150.000),
('BW-ARM-190',   'Barbed Wire Arm / Extension Arm 1-7/8" (3-strand)',            'Commercial Fitting', 'EA',  3.20,  4.16, 100.000),
('BW-ARM-238',   'Barbed Wire Arm / Extension Arm 2-3/8" (3-strand)',            'Commercial Fitting', 'EA',  3.80,  4.94, 80.000),
('BW-ARM-163-6', 'Barbed Wire Arm / Extension Arm 1-5/8" (6-strand)',            'Commercial Fitting', 'EA',  4.50,  5.85, 60.000);

-- ============================================================
-- SEED: inventory_products - PART 7: CHAIN LINK GATES
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('CL-GS-36-04',  'Chain Link Single Swing Gate 36" x 4ft Galvanized',            'Chain Link', 'EA',  48.00,  62.40, 20.000),
('CL-GS-36-05',  'Chain Link Single Swing Gate 36" x 5ft Galvanized',            'Chain Link', 'EA',  56.00,  72.80, 15.000),
('CL-GS-36-06',  'Chain Link Single Swing Gate 36" x 6ft Galvanized',            'Chain Link', 'EA',  64.00,  83.20, 15.000),
('CL-GS-42-05',  'Chain Link Single Swing Gate 42" x 5ft Galvanized',            'Chain Link', 'EA',  62.00,  80.60, 12.000),
('CL-GS-42-06',  'Chain Link Single Swing Gate 42" x 6ft Galvanized',            'Chain Link', 'EA',  70.00,  91.00, 10.000),
('CL-GS-48-06',  'Chain Link Single Swing Gate 48" x 6ft Galvanized',            'Chain Link', 'EA',  78.00, 101.40, 10.000),
('CL-GS-60-06',  'Chain Link Single Swing Gate 60" x 6ft Galvanized',            'Chain Link', 'EA',  92.00, 119.60, 8.000),
('CL-GD-10-06',  'Chain Link Double Swing Gate 10ft x 6ft (2x5ft panels) Galv.', 'Chain Link', 'EA', 185.00, 240.50, 5.000),
('CL-GD-12-06',  'Chain Link Double Swing Gate 12ft x 6ft (2x6ft panels) Galv.', 'Chain Link', 'EA', 210.00, 273.00, 5.000),
('CL-GD-16-06',  'Chain Link Double Swing Gate 16ft x 6ft (2x8ft panels) Galv.', 'Chain Link', 'EA', 265.00, 344.50, 4.000),
('CL-GD-20-06',  'Chain Link Double Swing Gate 20ft x 6ft (2x10ft panels) Galv.','Chain Link', 'EA', 325.00, 422.50, 3.000),
('CL-GS-36-04B', 'Chain Link Single Swing Gate 36" x 4ft Black Vinyl',           'Chain Link', 'EA',  62.00,  80.60, 8.000),
('CL-GS-36-06B', 'Chain Link Single Swing Gate 36" x 6ft Black Vinyl',           'Chain Link', 'EA',  80.00, 104.00, 6.000),
-- Gate hardware
('CL-GH-HG-S',   'Gate Hinges - Offset (pair) Galvanized Small',                 'Commercial Fitting', 'PR',  5.50,  7.15, 100.000),
('CL-GH-HG-L',   'Gate Hinges - Offset (pair) Galvanized Large',                 'Commercial Fitting', 'PR',  8.50, 11.05, 80.000),
('CL-GH-LT-S',   'Gate Latch - Thumb Latch Galvanized Small',                    'Commercial Fitting', 'EA',  7.50,  9.75, 100.000),
('CL-GH-LT-L',   'Gate Latch - Thumb Latch Galvanized Large',                    'Commercial Fitting', 'EA', 10.50, 13.65, 60.000),
('CL-GH-LK-C',   'Gate Lock - Chain & Padlock Hasp Galvanized',                  'Commercial Fitting', 'EA',  9.50, 12.35, 80.000),
('CL-GH-SS-S',   'Gate Spring - Gate Closer Spring Small',                       'Commercial Fitting', 'EA',  4.50,  5.85, 60.000),
('CL-GH-SS-L',   'Gate Spring - Gate Closer Spring Large',                       'Commercial Fitting', 'EA',  6.50,  8.45, 40.000),
('CL-GH-DG-S',   'Drop Rod / Cane Bolt Galvanized 3/4" x 24"',                   'Commercial Fitting', 'EA', 12.00, 15.60, 30.000),
('CL-GH-FP-S',   'Fork latch / Positive Latch Galvanized',                       'Commercial Fitting', 'EA',  8.50, 11.05, 40.000);

-- ============================================================
-- SEED: inventory_products - PART 8: WOOD FENCE MATERIALS
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
-- Posts
('WD-PO-4X4-08', 'Wood Post 4"x4" x 8ft Pressure Treated Pine',                 'Wood Fence', 'EA',  9.50,  12.35, 200.000),
('WD-PO-4X4-10', 'Wood Post 4"x4" x 10ft Pressure Treated Pine',                'Wood Fence', 'EA', 12.00,  15.60, 150.000),
('WD-PO-4X4-12', 'Wood Post 4"x4" x 12ft Pressure Treated Pine',                'Wood Fence', 'EA', 14.50,  18.85, 100.000),
('WD-PO-6X6-08', 'Wood Post 6"x6" x 8ft Pressure Treated Pine',                 'Wood Fence', 'EA', 18.00,  23.40, 80.000),
('WD-PO-6X6-10', 'Wood Post 6"x6" x 10ft Pressure Treated Pine',                'Wood Fence', 'EA', 22.00,  28.60, 60.000),
('WD-PO-6X6-12', 'Wood Post 6"x6" x 12ft Pressure Treated Pine',                'Wood Fence', 'EA', 27.00,  35.10, 40.000),
-- Rails
('WD-RA-2X4-08', 'Wood Rail 2"x4" x 8ft Pressure Treated Pine',                 'Wood Fence', 'EA',  3.50,   4.55, 400.000),
('WD-RA-2X4-10', 'Wood Rail 2"x4" x 10ft Pressure Treated Pine',                'Wood Fence', 'EA',  4.25,   5.53, 300.000),
('WD-RA-2X4-12', 'Wood Rail 2"x4" x 12ft Pressure Treated Pine',                'Wood Fence', 'EA',  5.25,   6.83, 200.000),
('WD-RA-2X6-08', 'Wood Rail 2"x6" x 8ft Pressure Treated Pine',                 'Wood Fence', 'EA',  5.50,   7.15, 200.000),
-- Pickets
('WD-PK-1X4-06', 'Wood Picket 1"x4" x 6ft Dog-Ear Cedar',                       'Wood Fence', 'EA',  2.50,   3.25, 500.000),
('WD-PK-1X6-06', 'Wood Picket 1"x6" x 6ft Dog-Ear Cedar',                       'Wood Fence', 'EA',  3.75,   4.88, 400.000),
('WD-PK-1X4-04', 'Wood Picket 1"x4" x 4ft Dog-Ear Cedar',                       'Wood Fence', 'EA',  1.85,   2.41, 200.000),
('WD-PK-1X6-04', 'Wood Picket 1"x6" x 4ft Dog-Ear Cedar',                       'Wood Fence', 'EA',  2.75,   3.58, 150.000),
('WD-PK-1X6-08', 'Wood Picket 1"x6" x 8ft Cedar (privacy)',                     'Wood Fence', 'EA',  4.50,   5.85, 200.000),
('WD-PK-1X4-06PT','Wood Picket 1"x4" x 6ft Pressure Treated Pine',              'Wood Fence', 'EA',  2.00,   2.60, 300.000),
('WD-PK-1X6-06PT','Wood Picket 1"x6" x 6ft Pressure Treated Pine',              'Wood Fence', 'EA',  3.00,   3.90, 250.000),
-- Fasteners
('WD-HW-GS-3',   'Galvanized Spiral Deck Screws 3" (1 lb box ~135 pcs)',         'Wood Fence', 'BX',  5.50,   7.15, 100.000),
('WD-HW-GS-2',   'Galvanized Spiral Deck Screws 2" (1 lb box ~200 pcs)',         'Wood Fence', 'BX',  4.50,   5.85, 80.000),
('WD-HW-GN-3',   'Galvanized Ring Shank Nails 3" (1 lb ~100 pcs)',               'Wood Fence', 'BX',  4.00,   5.20, 80.000),
('WD-HW-PC-S',   'Post Cap Wood - 4"x4" Pyramid Metal Galvanized',               'Wood Fence', 'EA',  2.50,   3.25, 100.000),
('WD-HW-PC-L',   'Post Cap Wood - 6"x6" Pyramid Metal Galvanized',               'Wood Fence', 'EA',  3.50,   4.55, 60.000),
-- Gates
('WD-GS-36-06',  'Wood Gate 36" x 6ft Cedar Privacy Pre-Built',                  'Wood Fence', 'EA', 95.00, 123.50, 10.000),
('WD-GS-42-06',  'Wood Gate 42" x 6ft Cedar Privacy Pre-Built',                  'Wood Fence', 'EA',115.00, 149.50, 8.000),
('WD-GD-12-06',  'Wood Double Gate 12ft x 6ft Cedar Privacy Pre-Built',          'Wood Fence', 'EA',225.00, 292.50, 4.000),
('WD-GH-HG-WD',  'Gate Hinges Heavy Duty Wood Fence 3.5" (pair) Black',          'Wood Fence', 'PR',  9.50,  12.35, 60.000),
('WD-GH-LT-WD',  'Gate Latch Black Powder Coat Wood Fence (self-latching)',      'Wood Fence', 'EA',  8.50,  11.05, 60.000);

-- ============================================================
-- SEED: inventory_products - PART 9: VINYL / PVC FENCE
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('VN-PO-5X5-60', 'Vinyl Post 5"x5" x 60" White PVC',                            'Vinyl Fence', 'EA', 22.00,  28.60, 60.000),
('VN-PO-5X5-84', 'Vinyl Post 5"x5" x 84" White PVC',                            'Vinyl Fence', 'EA', 28.00,  36.40, 50.000),
('VN-PO-5X5-108','Vinyl Post 5"x5" x 108" White PVC',                            'Vinyl Fence', 'EA', 35.00,  45.50, 30.000),
('VN-RA-1X4-96', 'Vinyl Rail 1"x4" x 96" White PVC (top/bottom)',                'Vinyl Fence', 'EA',  6.50,   8.45, 200.000),
('VN-PK-36-WH',  'Vinyl Picket 3/4"x2-3/4"x36" White (privacy panel)',          'Vinyl Fence', 'EA',  1.20,   1.56, 500.000),
('VN-PP-6-WH',   'Vinyl Privacy Panel 6ft x 8ft White (fully assembled)',        'Vinyl Fence', 'EA', 85.00, 110.50, 20.000),
('VN-PP-4-WH',   'Vinyl Privacy Panel 4ft x 8ft White (fully assembled)',        'Vinyl Fence', 'EA', 65.00,  84.50, 20.000),
('VN-PC-5X5',    'Vinyl Post Cap 5"x5" White PVC Flat',                          'Vinyl Fence', 'EA',  3.50,   4.55, 100.000),
('VN-GS-36-06',  'Vinyl Gate 36" x 6ft White PVC Privacy Pre-Built',             'Vinyl Fence', 'EA',145.00, 188.50, 8.000),
('VN-GD-12-06',  'Vinyl Double Gate 12ft x 6ft White PVC Privacy Pre-Built',     'Vinyl Fence', 'EA',295.00, 383.50, 3.000),
('VN-GH-HG-WH',  'Vinyl Gate Hinge White PVC Compatible (pair)',                 'Vinyl Fence', 'PR', 12.50,  16.25, 40.000),
('VN-GH-LT-WH',  'Vinyl Gate Latch White PVC Compatible (self-latching)',        'Vinyl Fence', 'EA', 10.50,  13.65, 40.000),
('VN-PA-FO-8',   'Vinyl Post Anchor Foam Expanding Anchor for 5"x5" post',       'Vinyl Fence', 'EA',  6.50,   8.45, 60.000);

-- ============================================================
-- SEED: inventory_products - PART 10: ALUMINUM FENCE
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('AL-PA-48-BK',  'Aluminum Panel 48" x 96" Black Powder Coat (Residential)',     'Aluminum Fence', 'EA', 75.00,  97.50, 20.000),
('AL-PA-60-BK',  'Aluminum Panel 60" x 96" Black Powder Coat (Residential)',     'Aluminum Fence', 'EA', 92.00, 119.60, 15.000),
('AL-PA-72-BK',  'Aluminum Panel 72" x 96" Black Powder Coat (Residential)',     'Aluminum Fence', 'EA',110.00, 143.00, 10.000),
('AL-PO-3X3-72', 'Aluminum Post 3"x3" x 72" Black Powder Coat',                 'Aluminum Fence', 'EA', 28.00,  36.40, 40.000),
('AL-PO-3X3-96', 'Aluminum Post 3"x3" x 96" Black Powder Coat',                 'Aluminum Fence', 'EA', 35.00,  45.50, 30.000),
('AL-GS-36-48',  'Aluminum Gate Single 36" x 48" Black Powder Coat',             'Aluminum Fence', 'EA',115.00, 149.50, 8.000),
('AL-GS-36-60',  'Aluminum Gate Single 36" x 60" Black Powder Coat',             'Aluminum Fence', 'EA',135.00, 175.50, 6.000),
('AL-GD-12-48',  'Aluminum Gate Double 12ft x 48" Black Powder Coat',            'Aluminum Fence', 'EA',225.00, 292.50, 3.000),
('AL-HW-MC',     'Aluminum Fence Mounting Clips (bag of 25)',                    'Aluminum Fence', 'BG',  8.50,  11.05, 60.000),
('AL-HW-PC',     'Aluminum Post Cap 3"x3" Black Powder Coat',                    'Aluminum Fence', 'EA',  4.50,   5.85, 80.000);

-- ============================================================
-- SEED: inventory_products - PART 11: CONCRETE & INSTALLATION
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('CON-QT-60',    'Concrete Mix Quikrete 60 lb bag',                              'Installation', 'EA',  5.50,   7.15, 300.000),
('CON-QT-80',    'Concrete Mix Quikrete 80 lb bag',                              'Installation', 'EA',  6.50,   8.45, 200.000),
('CON-QT-F80',   'Concrete Mix Fast-Setting 80 lb bag',                          'Installation', 'EA',  8.50,  11.05, 150.000),
('CON-FOS-1QT',  'Foam Post Setting Foam 1 Qt Kit (sets 1-2 posts)',             'Installation', 'EA', 12.00,  15.60, 50.000),
('CON-FOS-2QT',  'Foam Post Setting Foam 2 Qt Kit (sets 3-4 posts)',             'Installation', 'EA', 22.00,  28.60, 30.000),
('INS-GS-LRG',   'Gravel Stone 3/4" Crusher Run Bag 50 lb',                     'Installation', 'EA',  4.00,   5.20, 200.000),
('INS-SD-6',     'Spray Paint Marking - Inverted Tip 6 can case',                'Installation', 'CS', 18.00,  23.40, 20.000),
('INS-SD-1',     'Spray Paint Marking - Inverted Tip 1 can',                     'Installation', 'EA',  3.25,   4.23, 60.000),
('INS-ST-100',   'Mason Line / Survey String 100ft',                             'Installation', 'EA',  4.50,   5.85, 40.000),
('INS-ST-300',   'Mason Line / Survey String 300ft',                             'Installation', 'EA', 10.00,  13.00, 20.000),
('INS-MA-15X4',  'Post Maul 15 lb Steel with Fiberglass Handle',                 'Installation', 'EA', 65.00,  84.50, 5.000),
('INS-DR-BT',    'Auger Bit 6" Diameter for Post Hole Digger',                   'Installation', 'EA', 45.00,  58.50, 4.000),
('INS-DR-BT8',   'Auger Bit 8" Diameter for Post Hole Digger',                   'Installation', 'EA', 55.00,  71.50, 3.000),
('INS-LV-4',     'Level 4ft Aluminum Torpedo Level',                             'Installation', 'EA', 22.00,  28.60, 6.000),
('INS-LV-6',     'Level 6ft Aluminum Post Level',                                'Installation', 'EA', 35.00,  45.50, 4.000),
('INS-GT-P',     'Post Puller / Fence Post Extractor Heavy Duty',                'Installation', 'EA', 85.00, 110.50, 2.000),
('INS-TN-PL',    'Fence Stretcher / Come-Along Puller Set',                      'Installation', 'EA', 75.00,  97.50, 3.000),
('INS-TN-CL',    'Chain Link Puller Lever Hoist 1-Ton',                          'Installation', 'EA', 95.00, 123.50, 2.000),
('INS-CL-GR',    'Crimping Tool / Fence Pliers Combination',                     'Installation', 'EA', 32.00,  41.60, 4.000);

-- ============================================================
-- SEED: inventory_products - PART 12: PRIVACY SLATS
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('PS-3-BK-50',   'Privacy Slat 3-1/2" Chain Link 50ft Roll Black',               'Privacy Slat', 'ROLL', 18.00, 23.40, 30.000),
('PS-3-BK-100',  'Privacy Slat 3-1/2" Chain Link 100ft Roll Black',              'Privacy Slat', 'ROLL', 34.00, 44.20, 20.000),
('PS-3-GN-50',   'Privacy Slat 3-1/2" Chain Link 50ft Roll Green',               'Privacy Slat', 'ROLL', 18.00, 23.40, 20.000),
('PS-3-BG-50',   'Privacy Slat 3-1/2" Chain Link 50ft Roll Beige',               'Privacy Slat', 'ROLL', 18.00, 23.40, 15.000),
('PS-3-WH-50',   'Privacy Slat 3-1/2" Chain Link 50ft Roll White',               'Privacy Slat', 'ROLL', 18.00, 23.40, 15.000),
('PS-3-BN-50',   'Privacy Slat 3-1/2" Chain Link 50ft Roll Brown',               'Privacy Slat', 'ROLL', 18.00, 23.40, 15.000),
('PS-2-BK-50',   'Privacy Slat 2" Chain Link 50ft Roll Black',                   'Privacy Slat', 'ROLL', 22.00, 28.60, 20.000),
('PS-2-GN-50',   'Privacy Slat 2" Chain Link 50ft Roll Green',                   'Privacy Slat', 'ROLL', 22.00, 28.60, 12.000),
('PS-WT-48',     'Windscreen/Privacy Screen 4ft x 50ft Black HDPE Mesh',         'Privacy Slat', 'ROLL', 28.00, 36.40, 10.000),
('PS-WT-60',     'Windscreen/Privacy Screen 5ft x 50ft Black HDPE Mesh',         'Privacy Slat', 'ROLL', 34.00, 44.20, 8.000),
('PS-WT-72',     'Windscreen/Privacy Screen 6ft x 50ft Black HDPE Mesh',         'Privacy Slat', 'ROLL', 40.00, 52.00, 6.000);

-- ============================================================
-- SEED: inventory_products - PART 13: ORNAMENTAL / WROUGHT IRON
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('OR-PA-42-BK',  'Ornamental Steel Panel 42" x 96" Black Powder Coat',           'Ornamental', 'EA',  95.00, 123.50, 10.000),
('OR-PA-48-BK',  'Ornamental Steel Panel 48" x 96" Black Powder Coat',           'Ornamental', 'EA', 110.00, 143.00, 8.000),
('OR-PA-60-BK',  'Ornamental Steel Panel 60" x 96" Black Powder Coat',           'Ornamental', 'EA', 130.00, 169.00, 6.000),
('OR-PO-4X4-84', 'Ornamental Steel Post 4"x4" x 84" Black Powder Coat',         'Ornamental', 'EA',  42.00,  54.60, 20.000),
('OR-GS-36-48',  'Ornamental Steel Gate Single 36" x 48" Black',                 'Ornamental', 'EA', 150.00, 195.00, 5.000),
('OR-GS-36-60',  'Ornamental Steel Gate Single 36" x 60" Black',                 'Ornamental', 'EA', 175.00, 227.50, 4.000),
('OR-GD-12-48',  'Ornamental Steel Gate Double 12ft x 48" Black',                'Ornamental', 'EA', 320.00, 416.00, 2.000),
('OR-HW-PC',     'Ornamental Post Cap 4"x4" Ball Top Black',                     'Ornamental', 'EA',   6.50,   8.45, 40.000),
('OR-HW-FN',     'Ornamental Finial Top Spear 4"x4" post Black',                 'Ornamental', 'EA',   7.50,   9.75, 30.000);

-- ============================================================
-- SEED: inventory_products - PART 14: SAFETY / TEMPORARY FENCE
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('TF-OP-6X10',   'Temp Fence Panel Orange Plastic Safety 6ft x 10ft',            'Temp Fence', 'EA',   8.50,  11.05, 50.000),
('TF-ST-OP',     'Temp Fence Stand Orange Plastic Base (fits 6ft panel)',         'Temp Fence', 'EA',   6.00,   7.80, 80.000),
('TF-CL-ST',     'Temp Fence Clamp / Coupler Steel Galvanized',                  'Temp Fence', 'EA',   1.25,   1.63, 200.000),
('TF-SC-OR',     'Safety Fence Roll Orange Snow Fence 4ft x 100ft',              'Temp Fence', 'ROLL', 18.00, 23.40, 15.000),
('TF-SF-48',     'Silt Fence Geotextile 4ft x 100ft with Stakes',                'Temp Fence', 'ROLL', 32.00, 41.60, 10.000),
('TF-GP-48',     'Garden / Landscape Fence Green PVC 4ft x 25ft Roll',           'Temp Fence', 'ROLL', 22.00, 28.60, 10.000);

-- ============================================================
-- SEED: inventory_products - PART 15: ADDITIONAL HARDWARE / MISC
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('HW-PA-LG-10',  'Padlock Brass Keyed-Alike 1" Shackle 10 pack',                 'Hardware', 'PK',  22.00,  28.60, 20.000),
('HW-PA-LG-1',   'Padlock Brass 1" Shackle Single',                              'Hardware', 'EA',   3.50,   4.55, 50.000),
('HW-CC-38-12',  'Concrete Anchor 3/8" x 3-1/2" Hex Concrete Wedge Anchor',     'Hardware', 'EA',   1.20,   1.56, 200.000),
('HW-WT-BLK',    'Weather Stripping Foam Self-Adhesive 1/2"x1/2" 10ft',          'Hardware', 'EA',   2.50,   3.25, 40.000),
('HW-RO-ZN',     'Zinc Roofing Screws #10 x 1-1/2" 1 lb box',                   'Hardware', 'BX',   5.50,   7.15, 40.000),
('HW-CM-BLK',    'Cable Management Zip Ties Black UV Resistant 100pk 8"',        'Hardware', 'PK',   3.50,   4.55, 60.000),
('HW-WP-1QT',    'Wood Preservative / Sealer 1 quart',                           'Hardware', 'QT',   8.50,  11.05, 20.000),
('HW-WP-1GL',    'Wood Preservative / Sealer 1 gallon',                          'Hardware', 'GL',  28.00,  36.40, 10.000),
('HW-PR-BK-1',   'Touch-Up Paint Black Powder Coat Spray 12oz',                  'Hardware', 'EA',   9.50,  12.35, 20.000),
('HW-PR-GV-1',   'Cold Galvanizing Compound Spray 16oz (rust prevention)',       'Hardware', 'EA',  11.00,  14.30, 15.000),
('HW-WL-12',     'Wire Lath / Hardware Cloth 1/4" mesh 24"x10ft Galvanized',    'Hardware', 'EA',  14.00,  18.20, 15.000),
('HW-RB-SP-12',  'Rubber Bumper Stop for Gates 2" x 2" Black (2 pack)',          'Hardware', 'PK',   4.50,   5.85, 40.000),
('HW-KA-04',     'Keyed-Alike Lock Set 4-pack Brass Padlock',                    'Hardware', 'PK',  16.00,  20.80, 10.000),
('HW-AK-WX-1',   'Anti-Rust Wax Coating Spray 16oz',                             'Hardware', 'EA',   7.50,   9.75, 15.000),
('HW-FM-CR',     'Foam Backer Rod 3/4" x 40ft Roll (caulk backing)',             'Hardware', 'ROLL', 6.50,   8.45, 20.000);

-- ============================================================
-- SEED: inventory_products - PART 16: LABOR CODES (non-physical)
-- ============================================================
INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price, on_hand_qty) VALUES
('LBR-IH-CL',   'Labor - Install Chain Link (per linear foot)',                  'Labor',  'LFT', 8.00,  12.00, 9999.000),
('LBR-IH-WD',   'Labor - Install Wood Privacy Fence (per linear foot)',          'Labor',  'LFT', 10.00, 15.00, 9999.000),
('LBR-IH-VN',   'Labor - Install Vinyl Privacy Fence (per linear foot)',         'Labor',  'LFT', 12.00, 18.00, 9999.000),
('LBR-IH-AL',   'Labor - Install Aluminum / Ornamental (per linear foot)',       'Labor',  'LFT', 14.00, 21.00, 9999.000),
('LBR-IH-GT',   'Labor - Install Gate Single (per gate)',                        'Labor',  'EA',  65.00,100.00, 9999.000),
('LBR-IH-GTD',  'Labor - Install Gate Double (per gate)',                        'Labor',  'EA', 110.00,165.00, 9999.000),
('LBR-RM-CL',   'Labor - Remove Existing Chain Link (per linear foot)',          'Labor',  'LFT', 3.00,   5.00, 9999.000),
('LBR-RM-WD',   'Labor - Remove Existing Wood Fence (per linear foot)',          'Labor',  'LFT', 4.00,   6.00, 9999.000),
('LBR-PH-DG',   'Labor - Post Hole Digging Manual (per hole)',                   'Labor',  'EA',  12.00, 18.00, 9999.000),
('LBR-PH-AU',   'Labor - Post Hole Auger Machine (per hole)',                    'Labor',  'EA',   8.00, 12.00, 9999.000),
('LBR-OT',      'Labor - Overtime Hour (1.5x standard rate)',                    'Labor',  'HR',  95.00,142.50, 9999.000),
('LBR-TL-MH',   'Equipment - Hydraulic Post Driver Machine Hour',                'Equipment','HR', 45.00, 75.00, 9999.000),
('LBR-TL-AH',   'Equipment - Auger Machine Hour',                                'Equipment','HR', 35.00, 55.00, 9999.000),
('LBR-DS-HRS',  'Disposal - Debris Haul Away Hour',                             'Equipment','HR', 55.00, 85.00, 9999.000),
('LBR-DS-LOAD', 'Disposal - Debris Load / Bin Charge',                          'Equipment','EA', 85.00,135.00, 9999.000);

-- ============================================================
-- END OF SEED DATA
-- Total Products: 250+ entries above (scale with real POS data)
-- ============================================================
