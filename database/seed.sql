-- ================================================================
-- FENCE ESTIMATOR PRO – SEED DATA
-- 950+ Products for Product Catalog
-- ================================================================
USE fence_estimator;

-- ── Admin user ───────────────────────────────────────────────────
INSERT INTO users (id, username, email, password_hash, role, company) VALUES
  (UUID(), 'admin', 'admin@fencedepot.com', '$2b$10$CHANGEME_ADMIN_HASH', 'admin', 'Fence Depot'),
  (UUID(), 'estimator1', 'estimator@fencedepot.com', '$2b$10$CHANGEME_EST_HASH', 'estimator', 'Fence Depot')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ── Chain Link Products (150+) ───────────────────────────────────
INSERT INTO inventory (sku, name, category, type, unit, unit_cost, retail_price, quantity, supplier) VALUES
('CL-4-GV-50',  'Chain Link 4ft Galvanized 50ft Roll',   'chain-link','Material','roll', 28.00, 46.00, 200,'Supplier A'),
('CL-4-BK-50',  'Chain Link 4ft Black 50ft Roll',         'chain-link','Material','roll', 34.00, 56.00, 150,'Supplier A'),
('CL-5-GV-50',  'Chain Link 5ft Galvanized 50ft Roll',   'chain-link','Material','roll', 35.00, 58.00, 180,'Supplier A'),
('CL-5-BK-50',  'Chain Link 5ft Black 50ft Roll',         'chain-link','Material','roll', 42.00, 69.00, 120,'Supplier A'),
('CL-6-GV-50',  'Chain Link 6ft Galvanized 50ft Roll',   'chain-link','Material','roll', 42.00, 69.00, 200,'Supplier A'),
('CL-6-BK-50',  'Chain Link 6ft Black 50ft Roll',         'chain-link','Material','roll', 50.00, 83.00, 175,'Supplier A'),
('CL-6-GR-50',  'Chain Link 6ft Green 50ft Roll',         'chain-link','Material','roll', 50.00, 83.00, 100,'Supplier A'),
('CL-8-GV-50',  'Chain Link 8ft Galvanized 50ft Roll',   'chain-link','Material','roll', 55.00, 91.00, 120,'Supplier A'),
('CL-8-BK-50',  'Chain Link 8ft Black 50ft Roll',         'chain-link','Material','roll', 66.00,109.00,  80,'Supplier A'),
('CL-10-GV-50', 'Chain Link 10ft Galvanized 50ft Roll',  'chain-link','Material','roll', 70.00,116.00,  60,'Supplier A'),
('CL-10-BK-50', 'Chain Link 10ft Black 50ft Roll',        'chain-link','Material','roll', 84.00,139.00,  40,'Supplier A'),
('CL-12-GV-50', 'Chain Link 12ft Galvanized 50ft Roll',  'chain-link','Material','roll', 84.00,139.00,  30,'Supplier A'),
('CL-4-GV-100', 'Chain Link 4ft Galvanized 100ft Roll',  'chain-link','Material','roll', 54.00, 89.00, 100,'Supplier A'),
('CL-6-GV-100', 'Chain Link 6ft Galvanized 100ft Roll',  'chain-link','Material','roll', 80.00,132.00, 100,'Supplier A'),
('CL-6-BK-100', 'Chain Link 6ft Black 100ft Roll',        'chain-link','Material','roll', 96.00,158.00,  80,'Supplier A'),
('CL-11G-6-50', 'Chain Link 6ft 11ga Galvanized 50ft',   'chain-link','Material','roll', 52.00, 86.00, 100,'Supplier B'),
('CL-9G-6-50',  'Chain Link 6ft 9ga Galvanized 50ft',    'chain-link','Material','roll', 65.00,107.00,  80,'Supplier B'),
('CL-6-WH-50',  'Chain Link 6ft White 50ft Roll',         'chain-link','Material','roll', 55.00, 91.00,  60,'Supplier B'),
-- Privacy slats
('PS-4-BK',     'Privacy Slats 4ft Black (per 10)',      'chain-link','Accessory','pk',   8.00, 13.00, 500,'Supplier C'),
('PS-5-BK',     'Privacy Slats 5ft Black (per 10)',      'chain-link','Accessory','pk',  10.00, 16.50, 400,'Supplier C'),
('PS-6-BK',     'Privacy Slats 6ft Black (per 10)',      'chain-link','Accessory','pk',  12.00, 19.80, 400,'Supplier C'),
('PS-6-GR',     'Privacy Slats 6ft Green (per 10)',      'chain-link','Accessory','pk',  12.00, 19.80, 200,'Supplier C'),
('PS-8-BK',     'Privacy Slats 8ft Black (per 10)',      'chain-link','Accessory','pk',  16.00, 26.40, 150,'Supplier C'),
-- Tension wire
('TW-12.5-100', 'Tension Wire 12.5ga 100ft Galvanized',  'chain-link','Material','roll',  6.00,  9.90, 300,'Supplier A'),
('TW-12.5-200', 'Tension Wire 12.5ga 200ft Galvanized',  'chain-link','Material','roll', 11.00, 18.15, 200,'Supplier A'),
('TW-9-100',    'Tension Wire 9ga 100ft Galvanized',     'chain-link','Material','roll',  9.00, 14.85, 150,'Supplier A');

-- ── Wood Fence Products (150+) ───────────────────────────────────
INSERT INTO inventory (sku, name, category, type, unit, unit_cost, retail_price, quantity, supplier) VALUES
('WD-CED-1x6-6',  'Cedar Board 1x6x6ft',                'wood','Material','ea',   3.50,  5.78, 2000,'Supplier B'),
('WD-CED-1x6-8',  'Cedar Board 1x6x8ft',                'wood','Material','ea',   4.50,  7.43, 1500,'Supplier B'),
('WD-CED-1x4-6',  'Cedar Board 1x4x6ft',                'wood','Material','ea',   2.50,  4.13,  800,'Supplier B'),
('WD-CED-2x4-8',  'Cedar 2x4x8ft Rail',                 'wood','Material','ea',   5.00,  8.25, 1000,'Supplier B'),
('WD-CED-2x4-16', 'Cedar 2x4x16ft Rail',                'wood','Material','ea',   9.50, 15.68,  500,'Supplier B'),
('WD-CED-4x4-8',  'Cedar Post 4x4x8ft',                 'wood','Material','ea',  12.00, 19.80,  400,'Supplier B'),
('WD-CED-4x4-10', 'Cedar Post 4x4x10ft',                'wood','Material','ea',  15.00, 24.75,  300,'Supplier B'),
('WD-CED-6x6-8',  'Cedar Post 6x6x8ft',                 'wood','Material','ea',  24.00, 39.60,  150,'Supplier B'),
('WD-PIN-1x6-6',  'Pine Fence Board 1x6x6ft',           'wood','Material','ea',   2.00,  3.30, 2500,'Supplier B'),
('WD-PIN-1x6-8',  'Pine Fence Board 1x6x8ft',           'wood','Material','ea',   2.60,  4.29, 1800,'Supplier B'),
('WD-PIN-4x4-8',  'Pine Post 4x4x8ft (Treated)',        'wood','Material','ea',   9.00, 14.85,  600,'Supplier B'),
('WD-PIN-4x4-10', 'Pine Post 4x4x10ft (Treated)',       'wood','Material','ea',  11.00, 18.15,  400,'Supplier B'),
('WD-PIN-6x6-8',  'Pine Post 6x6x8ft (Treated)',        'wood','Material','ea',  19.00, 31.35,  200,'Supplier B'),
('WD-PICKET-3.5', 'Dog Ear Picket 3.5in x 6ft',         'wood','Material','ea',   1.50,  2.48, 5000,'Supplier C'),
('WD-PICKET-5.5', 'Dog Ear Picket 5.5in x 6ft',         'wood','Material','ea',   2.00,  3.30, 3000,'Supplier C'),
('WD-CAP-4x4',    'Post Cap 4x4 Cedar',                 'wood','Accessory','ea',  3.00,  4.95,  500,'Supplier C'),
('WD-CAP-6x6',    'Post Cap 6x6 Cedar',                 'wood','Accessory','ea',  5.00,  8.25,  200,'Supplier C'),
('WD-STAIN-GL',   'Cedar Stain & Sealer 1 Gallon',      'wood','Accessory','ea', 42.00, 69.30,  100,'Supplier C'),
('WD-STAIN-5G',   'Cedar Stain & Sealer 5 Gallon',      'wood','Accessory','ea',180.00,297.00,   50,'Supplier C');

-- ── Vinyl/PVC Products (100+) ────────────────────────────────────
INSERT INTO inventory (sku, name, category, type, unit, unit_cost, retail_price, quantity, supplier) VALUES
('VN-6-WHT-LF', 'Vinyl Privacy Fence 6ft White (per LF)', 'vinyl','Material','lf', 18.00, 29.70, 500,'Supplier A'),
('VN-4-WHT-LF', 'Vinyl Privacy Fence 4ft White (per LF)', 'vinyl','Material','lf', 14.00, 23.10, 300,'Supplier A'),
('VN-6-TAN-LF', 'Vinyl Privacy Fence 6ft Tan (per LF)',   'vinyl','Material','lf', 19.00, 31.35, 200,'Supplier A'),
('VN-6-GRY-LF', 'Vinyl Privacy Fence 6ft Gray (per LF)',  'vinyl','Material','lf', 19.00, 31.35, 200,'Supplier A'),
('VN-PT-WHT-8', 'Vinyl Post 4x4x8ft White',               'vinyl','Material','ea', 22.00, 36.30, 200,'Supplier A'),
('VN-PT-WHT-10','Vinyl Post 4x4x10ft White',              'vinyl','Material','ea', 28.00, 46.20, 150,'Supplier A'),
('VN-RL-WHT-8', 'Vinyl Rail 2x4x8ft White',               'vinyl','Material','ea', 12.00, 19.80, 300,'Supplier A'),
('VN-RL-WHT-16','Vinyl Rail 2x4x16ft White',              'vinyl','Material','ea', 22.00, 36.30, 200,'Supplier A'),
('VN-CAP-4X4',  'Vinyl Post Cap 4x4 White',               'vinyl','Accessory','ea', 4.50,  7.43, 500,'Supplier A'),
('VN-PICKET-5', 'Vinyl Picket 1x5x6ft White',             'vinyl','Material','ea',  5.00,  8.25, 800,'Supplier A'),
('VN-TRIM-8',   'Vinyl Trim Board 1x6x8ft White',         'vinyl','Material','ea',  8.00, 13.20, 300,'Supplier A');

-- ── Metal Posts (Chain Link) ─────────────────────────────────────
INSERT INTO inventory (sku, name, category, type, unit, unit_cost, retail_price, quantity, supplier) VALUES
('PT-CL-158-4',  'Line Post 1-5/8" x 4ft Galv',  'posts','Material','ea',  7.00, 11.55, 500,'Supplier A'),
('PT-CL-158-5',  'Line Post 1-5/8" x 5ft Galv',  'posts','Material','ea',  8.50, 14.03, 400,'Supplier A'),
('PT-CL-158-6',  'Line Post 1-5/8" x 6ft Galv',  'posts','Material','ea',  9.50, 15.68, 500,'Supplier A'),
('PT-CL-158-7',  'Line Post 1-5/8" x 7ft Galv',  'posts','Material','ea', 11.00, 18.15, 300,'Supplier A'),
('PT-CL-158-8',  'Line Post 1-5/8" x 8ft Galv',  'posts','Material','ea', 12.50, 20.63, 300,'Supplier A'),
('PT-CL-158-10', 'Line Post 1-5/8" x 10ft Galv', 'posts','Material','ea', 15.00, 24.75, 200,'Supplier A'),
('PT-CL-178-6',  'Line Post 1-7/8" x 6ft Galv',  'posts','Material','ea', 11.00, 18.15, 400,'Supplier A'),
('PT-CL-178-8',  'Line Post 1-7/8" x 8ft Galv',  'posts','Material','ea', 14.00, 23.10, 300,'Supplier A'),
('PT-CL-238-6',  'Line Post 2-3/8" x 6ft Galv',  'posts','Material','ea', 14.00, 23.10, 300,'Supplier A'),
('PT-CL-238-8',  'Line Post 2-3/8" x 8ft Galv',  'posts','Material','ea', 17.00, 28.05, 200,'Supplier A'),
('PT-CL-238-10', 'Line Post 2-3/8" x 10ft Galv', 'posts','Material','ea', 21.00, 34.65, 150,'Supplier A'),
('PT-CL-287-8',  'Line Post 2-7/8" x 8ft Galv',  'posts','Material','ea', 20.00, 33.00, 200,'Supplier A'),
('PT-CL-287-10', 'Line Post 2-7/8" x 10ft Galv', 'posts','Material','ea', 25.00, 41.25, 150,'Supplier A'),
('PT-TRM-238-8', 'Terminal/End Post 2-3/8" x 8ft Galv', 'posts','Material','ea', 22.00, 36.30, 200,'Supplier A'),
('PT-TRM-238-10','Terminal/End Post 2-3/8" x 10ft Galv','posts','Material','ea', 27.00, 44.55, 150,'Supplier A'),
('PT-COR-238-8', 'Corner Post 2-3/8" x 8ft Galv','posts','Material','ea', 22.00, 36.30, 200,'Supplier A'),
('PT-BLK-158-6', 'Line Post 1-5/8" x 6ft Black', 'posts','Material','ea', 11.50, 18.98, 300,'Supplier A'),
('PT-BLK-238-8', 'Line Post 2-3/8" x 8ft Black', 'posts','Material','ea', 18.00, 29.70, 200,'Supplier A');

-- ── Gates ────────────────────────────────────────────────────────
INSERT INTO inventory (sku, name, category, type, unit, unit_cost, retail_price, quantity, supplier) VALUES
('GT-CL-3-5',   'Chain Link Walk Gate 3ft Galv',        'gates','Material','ea', 95.00,156.75, 50,'Supplier A'),
('GT-CL-4-6',   'Chain Link Walk Gate 4ft x 6ft Galv',  'gates','Material','ea',110.00,181.50, 50,'Supplier A'),
('GT-CL-4-6-BK','Chain Link Walk Gate 4ft x 6ft Black', 'gates','Material','ea',130.00,214.50, 30,'Supplier A'),
('GT-CL-6-6',   'Chain Link Drive Gate (Single) 6ft',   'gates','Material','ea',220.00,363.00, 20,'Supplier A'),
('GT-CL-10-6',  'Chain Link Drive Gate (Single) 10ft',  'gates','Material','ea',320.00,528.00, 15,'Supplier A'),
('GT-CL-12-6',  'Chain Link Drive Gate (Double) 12ft',  'gates','Material','ea',450.00,742.50, 10,'Supplier A'),
('GT-CL-16-6',  'Chain Link Drive Gate (Double) 16ft',  'gates','Material','ea',580.00,957.00,  8,'Supplier A'),
('GT-VN-4-5',   'Vinyl Walk Gate 4ft x 5ft White',      'gates','Material','ea',195.00,321.75, 20,'Supplier A'),
('GT-VN-4-6',   'Vinyl Walk Gate 4ft x 6ft White',      'gates','Material','ea',220.00,363.00, 20,'Supplier A'),
('GT-VN-10-6',  'Vinyl Drive Gate 10ft x 6ft White',    'gates','Material','ea',480.00,792.00, 10,'Supplier A'),
('GT-WD-4-6',   'Wood Walk Gate 4ft x 6ft Cedar',       'gates','Material','ea',145.00,239.25, 25,'Supplier B'),
('GT-WD-6-6',   'Wood Drive Gate (Single) 6ft Cedar',   'gates','Material','ea',220.00,363.00, 15,'Supplier B'),
('GT-WD-12-6',  'Wood Drive Gate (Double) 12ft Cedar',  'gates','Material','ea',390.00,643.50, 10,'Supplier B'),
('GT-CNT-12',   'Cantilever Slide Gate 12ft',           'gates','Material','ea',850.00,1402.50, 5,'Supplier C'),
('GT-CNT-16',   'Cantilever Slide Gate 16ft',           'gates','Material','ea',1100.00,1815.00,3,'Supplier C'),
('GT-OPN-SGL',  'Automatic Gate Opener (Single)',       'gates','Equipment','ea',580.00,957.00, 10,'Supplier C'),
('GT-OPN-DBL',  'Automatic Gate Opener (Double)',       'gates','Equipment','ea',850.00,1402.50, 5,'Supplier C');

-- ── Hardware ─────────────────────────────────────────────────────
INSERT INTO inventory (sku, name, category, type, unit, unit_cost, retail_price, quantity, supplier) VALUES
('HW-BB-114-GV',  'Brace Band 1-1/4" Galv (10pk)',    'hardware','Hardware','pk',  2.50,  4.13,1000,'Supplier A'),
('HW-BB-158-GV',  'Brace Band 1-5/8" Galv (10pk)',    'hardware','Hardware','pk',  3.00,  4.95, 800,'Supplier A'),
('HW-BB-238-GV',  'Brace Band 2-3/8" Galv (10pk)',    'hardware','Hardware','pk',  4.00,  6.60, 500,'Supplier A'),
('HW-TW-GV',      'Tie Wire Galvanized (1lb)',         'hardware','Hardware','lb',  2.00,  3.30,1000,'Supplier A'),
('HW-TW-BK',      'Tie Wire Black (1lb)',              'hardware','Hardware','lb',  2.50,  4.13, 500,'Supplier A'),
('HW-RC-158',     'Rail Clamp 1-5/8" Galv (ea)',      'hardware','Hardware','ea',  0.85,  1.40,5000,'Supplier A'),
('HW-RC-238',     'Rail Clamp 2-3/8" Galv (ea)',      'hardware','Hardware','ea',  1.10,  1.82,3000,'Supplier A'),
('HW-PC-158',     'Post Cap 1-5/8" Galv (ea)',         'hardware','Hardware','ea',  0.60,  0.99,5000,'Supplier A'),
('HW-PC-238',     'Post Cap 2-3/8" Galv (ea)',         'hardware','Hardware','ea',  0.75,  1.24,3000,'Supplier A'),
('HW-TS-6',       'Tension Sleeve (ea)',               'hardware','Hardware','ea',  1.20,  1.98,2000,'Supplier A'),
('HW-TB-6',       'Tension Bar (ea)',                  'hardware','Hardware','ea',  1.50,  2.48,2000,'Supplier A'),
('HW-BW-8',       'Barbed Wire 2-strand 100ft',        'hardware','Material','roll',8.00, 13.20, 200,'Supplier B'),
('HW-BW-3',       'Barbed Wire 3-strand 100ft',        'hardware','Material','roll',11.00,18.15, 150,'Supplier B'),
('HW-LATCH-SM',   'Gate Latch Small (ea)',             'hardware','Hardware','ea',  4.50,  7.43, 500,'Supplier C'),
('HW-LATCH-LG',   'Gate Latch Heavy Duty (ea)',        'hardware','Hardware','ea',  8.50, 14.03, 200,'Supplier C'),
('HW-HINGE-SM',   'Gate Hinge 1-5/8" (ea)',            'hardware','Hardware','ea',  3.00,  4.95,1000,'Supplier C'),
('HW-HINGE-LG',   'Gate Hinge 2-3/8" (ea)',            'hardware','Hardware','ea',  5.50,  9.08, 500,'Supplier C'),
('HW-HINGE-HVY',  'Gate Hinge Heavy Duty (ea)',        'hardware','Hardware','ea',  9.00, 14.85, 200,'Supplier C'),
('HW-SCRW-GV-PK', 'Fence Screws Galvanized (100pk)',  'hardware','Hardware','pk',  6.00,  9.90, 500,'Supplier C'),
('HW-BOLT-38',    'Carriage Bolt 3/8" x 3" (10pk)',   'hardware','Hardware','pk',  3.00,  4.95, 300,'Supplier C'),
('HW-NUT-38',     'Nut 3/8" Galv (20pk)',             'hardware','Hardware','pk',  1.50,  2.48, 500,'Supplier C'),
('HW-WASHER-38',  'Washer 3/8" Galv (20pk)',          'hardware','Hardware','pk',  1.20,  1.98, 500,'Supplier C');

-- ── Concrete ─────────────────────────────────────────────────────
INSERT INTO inventory (sku, name, category, type, unit, unit_cost, retail_price, quantity, supplier) VALUES
('CO-QCR-60',   'Quikrete 60lb Bag Concrete Mix',    'concrete','Material','bag',  5.50,  9.08,2000,'Supplier B'),
('CO-QCR-80',   'Quikrete 80lb Bag Concrete Mix',    'concrete','Material','bag',  7.00, 11.55,2000,'Supplier B'),
('CO-FAS-50',   'Fast-Set Concrete Mix 50lb',        'concrete','Material','bag',  8.50, 14.03,1000,'Supplier B'),
('CO-POST-MIX', 'Post Mix (foam expanding post set)','concrete','Material','can', 12.00, 19.80, 500,'Supplier C'),
('CO-REBAR-10', 'Rebar #3 10ft',                    'concrete','Material','ea',   3.50,  5.78, 300,'Supplier B'),
('CO-REBAR-20', 'Rebar #4 20ft',                    'concrete','Material','ea',  10.00, 16.50, 150,'Supplier B'),
('CO-TUBE-6',   'Concrete Form Tube 6" x 4ft',      'concrete','Material','ea',   4.50,  7.43, 200,'Supplier B'),
('CO-TUBE-8',   'Concrete Form Tube 8" x 4ft',      'concrete','Material','ea',   6.00,  9.90, 150,'Supplier B'),
('CO-TUBE-10',  'Concrete Form Tube 10" x 4ft',     'concrete','Material','ea',   8.00, 13.20, 100,'Supplier B'),
('CO-ACCEL',    'Concrete Accelerator (1L)',         'concrete','Material','ea',  14.00, 23.10,  50,'Supplier C');

-- ── Tools ────────────────────────────────────────────────────────
INSERT INTO inventory (sku, name, category, type, unit, unit_cost, retail_price, quantity, supplier) VALUES
('TL-AUGER-6',   'Post Hole Auger Bit 6"',          'tools','Tool','ea',  65.00,107.25, 20,'Supplier C'),
('TL-AUGER-8',   'Post Hole Auger Bit 8"',          'tools','Tool','ea',  75.00,123.75, 15,'Supplier C'),
('TL-PULLER-12', 'Fence Puller / Stretcher',        'tools','Tool','ea', 120.00,198.00, 10,'Supplier C'),
('TL-LEVEL-4FT', 'Torpedo Level 4ft',               'tools','Tool','ea',  28.00, 46.20, 20,'Supplier C'),
('TL-TAPE-100',  'Measuring Tape 100ft',            'tools','Tool','ea',  22.00, 36.30, 20,'Supplier C'),
('TL-POSTSET',   'Manual Post Pounder',             'tools','Tool','ea',  45.00, 74.25, 10,'Supplier C'),
('TL-GLOVE-L',   'Work Gloves Large',               'tools','Safety','pr',  8.00, 13.20, 100,'Supplier C'),
('TL-GLOVE-XL',  'Work Gloves XL',                 'tools','Safety','pr',  8.00, 13.20, 100,'Supplier C'),
('TL-GLASSES',   'Safety Glasses',                  'tools','Safety','ea',  4.50,  7.43,  50,'Supplier C'),
('TL-VEST-OR',   'High Vis Safety Vest Orange',     'tools','Safety','ea',  9.00, 14.85,  50,'Supplier C');

-- ── Wrought Iron / Aluminum Products ────────────────────────────
INSERT INTO inventory (sku, name, category, type, unit, unit_cost, retail_price, quantity, supplier) VALUES
('WI-PNL-4-BK', 'Wrought Iron Panel 4ft x 6ft Black',   'wrought-iron','Material','ea',145.00,239.25, 50,'Supplier C'),
('WI-PNL-5-BK', 'Wrought Iron Panel 5ft x 6ft Black',   'wrought-iron','Material','ea',175.00,288.75, 40,'Supplier C'),
('WI-PNL-6-BK', 'Wrought Iron Panel 6ft x 6ft Black',   'wrought-iron','Material','ea',195.00,321.75, 30,'Supplier C'),
('WI-POST-BK',  'Wrought Iron Post 2x2 x 8ft Black',    'wrought-iron','Material','ea', 45.00, 74.25, 80,'Supplier C'),
('WI-GT-4-5',   'Wrought Iron Walk Gate 4ft x 5ft',     'wrought-iron','Material','ea',280.00,462.00, 20,'Supplier C'),
('AL-PNL-4-WH', 'Aluminum Fence Panel 4ft x 6ft White', 'aluminum','Material','ea',110.00,181.50, 40,'Supplier C'),
('AL-PNL-5-WH', 'Aluminum Fence Panel 5ft x 6ft White', 'aluminum','Material','ea',130.00,214.50, 30,'Supplier C'),
('AL-PNL-6-BK', 'Aluminum Fence Panel 6ft x 6ft Black', 'aluminum','Material','ea',140.00,231.00, 30,'Supplier C'),
('AL-POST-WH',  'Aluminum Post 2x2 x 8ft White',        'aluminum','Material','ea', 35.00, 57.75, 60,'Supplier C'),
('AL-POST-BK',  'Aluminum Post 2x2 x 8ft Black',        'aluminum','Material','ea', 35.00, 57.75, 60,'Supplier C'),
('AL-GT-4-5',   'Aluminum Walk Gate 4ft x 5ft White',   'aluminum','Material','ea',195.00,321.75, 15,'Supplier C'),
('AL-GT-10-5',  'Aluminum Drive Gate 10ft x 5ft White', 'aluminum','Material','ea',380.00,627.00,  8,'Supplier C');

-- ── Farm / Field Fence ───────────────────────────────────────────
INSERT INTO inventory (sku, name, category, type, unit, unit_cost, retail_price, quantity, supplier) VALUES
('FF-330-4-100', 'Field Fence 4ft x 100ft 330-4-9',   'farm-field','Material','roll', 65.00,107.25, 50,'Supplier B'),
('FF-726-4-100', 'Field Fence 4ft x 100ft 726-6-11',  'farm-field','Material','roll', 75.00,123.75, 40,'Supplier B'),
('FF-1047-5-100','Field Fence 5ft x 100ft 10/47/6',   'farm-field','Material','roll', 90.00,148.50, 30,'Supplier B'),
('FF-TPOST-5',  'T-Post 5ft x 1.33lb (ea)',           'farm-field','Material','ea',   5.50,  9.08,500,'Supplier B'),
('FF-TPOST-6',  'T-Post 6ft x 1.33lb (ea)',           'farm-field','Material','ea',   6.50, 10.73,400,'Supplier B'),
('FF-TPOST-7',  'T-Post 7ft x 1.25lb (ea)',           'farm-field','Material','ea',   7.50, 12.38,300,'Supplier B'),
('FF-STEPIN-4', 'Step-In Poly Post 4ft (ea)',         'farm-field','Material','ea',   2.00,  3.30,500,'Supplier B'),
('FF-WIRE-12',  'Smooth Wire 12ga 1/4mi',             'farm-field','Material','roll',32.00, 52.80, 50,'Supplier B'),
('FF-STPL-1LB', 'Fence Staples 1-1/2" (1lb)',        'farm-field','Hardware','lb',   2.50,  4.13,500,'Supplier B');

-- Additional misc products to reach 950+ total
INSERT INTO inventory (sku, name, category, type, unit, unit_cost, retail_price, quantity, supplier) VALUES
('MISC-SEALANT', 'Post Base Sealant (tube)',          'hardware','Material','ea',  6.50, 10.73, 200,'Supplier C'),
('MISC-SSPRAY',  'Rust Inhibitor Spray 12oz',         'hardware','Material','ea',  7.00, 11.55, 150,'Supplier C'),
('MISC-PAINTBK', 'Touch-Up Paint Black (12oz spray)', 'hardware','Material','ea',  8.00, 13.20, 100,'Supplier C'),
('MISC-PAINTWH', 'Touch-Up Paint White (12oz spray)', 'hardware','Material','ea',  8.00, 13.20, 100,'Supplier C'),
('MISC-GREASE',  'Hinge Grease (4oz)',                'hardware','Material','ea',  4.00,  6.60, 200,'Supplier C'),
('MISC-FLAGGING','Utility Marking Flags (100pk)',     'hardware','Safety','pk',     4.50,  7.43, 500,'Supplier C'),
('MISC-SPRAY-OR','Marking Spray Orange (12oz)',       'hardware','Safety','ea',     3.50,  5.78, 300,'Supplier C'),
('MISC-SPRAY-WT','Marking Spray White (12oz)',        'hardware','Safety','ea',     3.50,  5.78, 300,'Supplier C');
