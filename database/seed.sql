-- ============================================================
-- FENCE DEPOT ESTIMATOR - PRODUCT SEED DATA
-- 300+ SKUs covering all fence types, materials, hardware
-- ============================================================

-- Admin user — default password is: ChangeMe2026!
-- IMPORTANT: Change this password immediately after first login.
-- Hash below is bcrypt(cost=10) of "ChangeMe2026!"
-- Generate a new hash with: node -e "const b=require('bcryptjs');b.hash('YourNewPassword',10).then(h=>console.log(h))"
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('admin@fencedepot.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh.q', 'Admin', 'User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ============================================================
-- INVENTORY SEED - CHAIN LINK FABRIC
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
-- Chain Link Fabric - 9 Gauge Galvanized
('CL-9G-4H-50',  'CL9G450',   '9-Ga Galvanized Chain Link Fabric 4ft x 50ft',  'Chain Link', 'Fabric', 'roll', 38.00, 58.00),
('CL-9G-5H-50',  'CL9G550',   '9-Ga Galvanized Chain Link Fabric 5ft x 50ft',  'Chain Link', 'Fabric', 'roll', 48.00, 72.00),
('CL-9G-6H-50',  'CL9G650',   '9-Ga Galvanized Chain Link Fabric 6ft x 50ft',  'Chain Link', 'Fabric', 'roll', 58.00, 87.00),
('CL-9G-8H-50',  'CL9G850',   '9-Ga Galvanized Chain Link Fabric 8ft x 50ft',  'Chain Link', 'Fabric', 'roll', 76.00, 115.00),
('CL-9G-10H-50', 'CL9G1050',  '9-Ga Galvanized Chain Link Fabric 10ft x 50ft', 'Chain Link', 'Fabric', 'roll', 95.00, 143.00),
('CL-9G-12H-50', 'CL9G1250',  '9-Ga Galvanized Chain Link Fabric 12ft x 50ft', 'Chain Link', 'Fabric', 'roll', 114.00, 171.00),
-- Chain Link Fabric - 11.5 Gauge Galvanized
('CL-115G-4H-50',  'CL115G450',  '11.5-Ga Galvanized Chain Link Fabric 4ft x 50ft',  'Chain Link', 'Fabric', 'roll', 28.00, 42.00),
('CL-115G-5H-50',  'CL115G550',  '11.5-Ga Galvanized Chain Link Fabric 5ft x 50ft',  'Chain Link', 'Fabric', 'roll', 35.00, 52.00),
('CL-115G-6H-50',  'CL115G650',  '11.5-Ga Galvanized Chain Link Fabric 6ft x 50ft',  'Chain Link', 'Fabric', 'roll', 42.00, 63.00),
('CL-115G-8H-50',  'CL115G850',  '11.5-Ga Galvanized Chain Link Fabric 8ft x 50ft',  'Chain Link', 'Fabric', 'roll', 56.00, 84.00),
-- Chain Link Fabric - 9 Gauge Black Vinyl Coated
('CL-9BK-4H-50', 'CL9BK450',  '9-Ga Black Vinyl Chain Link Fabric 4ft x 50ft',  'Chain Link', 'Fabric', 'roll', 52.00, 78.00),
('CL-9BK-5H-50', 'CL9BK550',  '9-Ga Black Vinyl Chain Link Fabric 5ft x 50ft',  'Chain Link', 'Fabric', 'roll', 65.00, 97.00),
('CL-9BK-6H-50', 'CL9BK650',  '9-Ga Black Vinyl Chain Link Fabric 6ft x 50ft',  'Chain Link', 'Fabric', 'roll', 78.00, 117.00),
('CL-9BK-8H-50', 'CL9BK850',  '9-Ga Black Vinyl Chain Link Fabric 8ft x 50ft',  'Chain Link', 'Fabric', 'roll', 104.00, 156.00),
-- Chain Link Fabric - 9 Gauge Green Vinyl Coated
('CL-9GR-4H-50', 'CL9GR450',  '9-Ga Green Vinyl Chain Link Fabric 4ft x 50ft',  'Chain Link', 'Fabric', 'roll', 52.00, 78.00),
('CL-9GR-5H-50', 'CL9GR550',  '9-Ga Green Vinyl Chain Link Fabric 5ft x 50ft',  'Chain Link', 'Fabric', 'roll', 65.00, 97.00),
('CL-9GR-6H-50', 'CL9GR650',  '9-Ga Green Vinyl Chain Link Fabric 6ft x 50ft',  'Chain Link', 'Fabric', 'roll', 78.00, 117.00),
-- Chain Link Fabric - 6 Gauge Heavy Commercial
('CL-6G-6H-50',  'CL6G650',   '6-Ga Galvanized Chain Link Fabric 6ft x 50ft',  'Chain Link', 'Fabric', 'roll', 95.00, 143.00),
('CL-6G-8H-50',  'CL6G850',   '6-Ga Galvanized Chain Link Fabric 8ft x 50ft',  'Chain Link', 'Fabric', 'roll', 127.00, 190.00),
('CL-6G-10H-50', 'CL6G1050',  '6-Ga Galvanized Chain Link Fabric 10ft x 50ft', 'Chain Link', 'Fabric', 'roll', 159.00, 238.00);

-- ============================================================
-- CHAIN LINK LINE POSTS
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
-- 1-5/8" OD Line Posts
('CL-LP-158-6',  'CLLP1586',   '1-5/8" x 6ft Galv Chain Link Line Post',  'Chain Link', 'Posts', 'each', 8.50,  13.00),
('CL-LP-158-7',  'CLLP1587',   '1-5/8" x 7ft Galv Chain Link Line Post',  'Chain Link', 'Posts', 'each', 9.90,  15.00),
('CL-LP-158-8',  'CLLP1588',   '1-5/8" x 8ft Galv Chain Link Line Post',  'Chain Link', 'Posts', 'each', 11.30, 17.00),
('CL-LP-158-10', 'CLLP15810',  '1-5/8" x 10ft Galv Chain Link Line Post', 'Chain Link', 'Posts', 'each', 14.20, 21.50),
('CL-LP-158-12', 'CLLP15812',  '1-5/8" x 12ft Galv Chain Link Line Post', 'Chain Link', 'Posts', 'each', 17.00, 25.50),
-- 1-7/8" OD Line Posts
('CL-LP-178-6',  'CLLP1786',   '1-7/8" x 6ft Galv Chain Link Line Post',  'Chain Link', 'Posts', 'each', 10.50, 15.75),
('CL-LP-178-7',  'CLLP1787',   '1-7/8" x 7ft Galv Chain Link Line Post',  'Chain Link', 'Posts', 'each', 12.25, 18.40),
('CL-LP-178-8',  'CLLP1788',   '1-7/8" x 8ft Galv Chain Link Line Post',  'Chain Link', 'Posts', 'each', 14.00, 21.00),
('CL-LP-178-10', 'CLLP17810',  '1-7/8" x 10ft Galv Chain Link Line Post', 'Chain Link', 'Posts', 'each', 17.50, 26.25),
('CL-LP-178-12', 'CLLP17812',  '1-7/8" x 12ft Galv Chain Link Line Post', 'Chain Link', 'Posts', 'each', 21.00, 31.50),
-- 2" OD Line Posts
('CL-LP-200-6',  'CLLP2006',   '2" x 6ft Galv Chain Link Line Post',  'Chain Link', 'Posts', 'each', 12.75, 19.15),
('CL-LP-200-8',  'CLLP2008',   '2" x 8ft Galv Chain Link Line Post',  'Chain Link', 'Posts', 'each', 17.00, 25.50),
('CL-LP-200-10', 'CLLP20010',  '2" x 10ft Galv Chain Link Line Post', 'Chain Link', 'Posts', 'each', 21.25, 31.90),
-- 2-3/8" OD Line Posts (Commercial)
('CL-LP-238-8',  'CLLP2388',   '2-3/8" x 8ft Galv Chain Link Line Post',  'Chain Link', 'Posts', 'each', 22.00, 33.00),
('CL-LP-238-10', 'CLLP23810',  '2-3/8" x 10ft Galv Chain Link Line Post', 'Chain Link', 'Posts', 'each', 27.50, 41.25),
('CL-LP-238-12', 'CLLP23812',  '2-3/8" x 12ft Galv Chain Link Line Post', 'Chain Link', 'Posts', 'each', 33.00, 49.50),
-- 4" OD Line Posts (Heavy Commercial)
('CL-LP-400-10', 'CLLP40010',  '4" x 10ft Galv Chain Link Line Post', 'Chain Link', 'Posts', 'each', 65.00, 97.50),
('CL-LP-400-12', 'CLLP40012',  '4" x 12ft Galv Chain Link Line Post', 'Chain Link', 'Posts', 'each', 78.00, 117.00);

-- ============================================================
-- CHAIN LINK TERMINAL / END POSTS
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('CL-TP-238-6',  'CLTP2386',  '2-3/8" x 6ft Galv Terminal Post',  'Chain Link', 'Posts', 'each', 18.00, 27.00),
('CL-TP-238-7',  'CLTP2387',  '2-3/8" x 7ft Galv Terminal Post',  'Chain Link', 'Posts', 'each', 21.00, 31.50),
('CL-TP-238-8',  'CLTP2388',  '2-3/8" x 8ft Galv Terminal Post',  'Chain Link', 'Posts', 'each', 24.00, 36.00),
('CL-TP-238-10', 'CLTP23810', '2-3/8" x 10ft Galv Terminal Post', 'Chain Link', 'Posts', 'each', 30.00, 45.00),
('CL-TP-300-8',  'CLTP3008',  '3" x 8ft Galv Terminal Post',  'Chain Link', 'Posts', 'each', 32.00, 48.00),
('CL-TP-300-10', 'CLTP30010', '3" x 10ft Galv Terminal Post', 'Chain Link', 'Posts', 'each', 40.00, 60.00),
('CL-TP-400-10', 'CLTP40010', '4" x 10ft Galv Terminal Post', 'Chain Link', 'Posts', 'each', 78.00, 117.00);

-- ============================================================
-- CHAIN LINK TOP RAIL
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('CL-TR-158-21', 'CLTR15821', '1-5/8" x 21ft Galv Chain Link Top Rail', 'Chain Link', 'Top Rail', 'each', 14.00, 21.00),
('CL-TR-178-21', 'CLTR17821', '1-7/8" x 21ft Galv Chain Link Top Rail', 'Chain Link', 'Top Rail', 'each', 17.00, 25.50),
('CL-TR-158BK-21','CLTR158BK21','1-5/8" x 21ft Black Vinyl Top Rail',   'Chain Link', 'Top Rail', 'each', 19.00, 28.50),
('CL-TR-178BK-21','CLTR178BK21','1-7/8" x 21ft Black Vinyl Top Rail',   'Chain Link', 'Top Rail', 'each', 23.00, 34.50);

-- ============================================================
-- CHAIN LINK TENSION WIRE
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('CL-TW-9G-1000', 'CLTW9G1000', '9-Ga Galv Tension Wire 1000ft Coil',   'Chain Link', 'Wire', 'coil', 42.00, 63.00),
('CL-TW-7G-500',  'CLTW7G500',  '7-Ga Galv Tension Wire 500ft Coil',    'Chain Link', 'Wire', 'coil', 38.00, 57.00),
('CL-TW-6G-500',  'CLTW6G500',  '6-Ga Galv Tension Wire 500ft Coil',    'Chain Link', 'Wire', 'coil', 52.00, 78.00);

-- ============================================================
-- CHAIN LINK FITTINGS & HARDWARE
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
-- Brace Bands
('CL-BB-158',  'CLBB158',  '1-5/8" Galv Brace Band',  'Commercial Fitting', 'Bands', 'each', 0.35, 0.75),
('CL-BB-178',  'CLBB178',  '1-7/8" Galv Brace Band',  'Commercial Fitting', 'Bands', 'each', 0.40, 0.85),
('CL-BB-200',  'CLBB200',  '2" Galv Brace Band',       'Commercial Fitting', 'Bands', 'each', 0.45, 0.95),
('CL-BB-238',  'CLBB238',  '2-3/8" Galv Brace Band',  'Commercial Fitting', 'Bands', 'each', 0.55, 1.15),
('CL-BB-300',  'CLBB300',  '3" Galv Brace Band',       'Commercial Fitting', 'Bands', 'each', 0.75, 1.55),
-- Tension Bands
('CL-TBD-158', 'CLTBD158', '1-5/8" Galv Tension Band', 'Commercial Fitting', 'Bands', 'each', 0.45, 0.95),
('CL-TBD-178', 'CLTBD178', '1-7/8" Galv Tension Band', 'Commercial Fitting', 'Bands', 'each', 0.50, 1.05),
('CL-TBD-238', 'CLTBD238', '2-3/8" Galv Tension Band', 'Commercial Fitting', 'Bands', 'each', 0.65, 1.35),
-- Tension Bars
('CL-TBR-4',   'CLTBR4',   '4ft Galv Tension Bar',     'Commercial Fitting', 'Bars',  'each', 1.20, 2.25),
('CL-TBR-5',   'CLTBR5',   '5ft Galv Tension Bar',     'Commercial Fitting', 'Bars',  'each', 1.50, 2.80),
('CL-TBR-6',   'CLTBR6',   '6ft Galv Tension Bar',     'Commercial Fitting', 'Bars',  'each', 1.80, 3.35),
('CL-TBR-8',   'CLTBR8',   '8ft Galv Tension Bar',     'Commercial Fitting', 'Bars',  'each', 2.40, 4.50),
-- Post Caps
('CL-CAP-158', 'CLCAP158', '1-5/8" Galv Post Cap',     'Commercial Fitting', 'Caps',  'each', 0.45, 0.90),
('CL-CAP-178', 'CLCAP178', '1-7/8" Galv Post Cap',     'Commercial Fitting', 'Caps',  'each', 0.55, 1.10),
('CL-CAP-200', 'CLCAP200', '2" Galv Post Cap',          'Commercial Fitting', 'Caps',  'each', 0.65, 1.30),
('CL-CAP-238', 'CLCAP238', '2-3/8" Galv Post Cap',     'Commercial Fitting', 'Caps',  'each', 0.85, 1.70),
-- Loop Caps (Rail Ends)
('CL-LC-158',  'CLLC158',  '1-5/8" Loop Cap / Rail End', 'Commercial Fitting', 'Caps', 'each', 0.65, 1.30),
('CL-LC-178',  'CLLC178',  '1-7/8" Loop Cap / Rail End', 'Commercial Fitting', 'Caps', 'each', 0.80, 1.60),
-- Rail Couplings
('CL-RC-158',  'CLRC158',  '1-5/8" Rail Coupling', 'Commercial Fitting', 'Couplings', 'each', 0.90, 1.80),
('CL-RC-178',  'CLRC178',  '1-7/8" Rail Coupling', 'Commercial Fitting', 'Couplings', 'each', 1.10, 2.20),
-- Tie Wires
('CL-TIE-9G-BOX', 'CLTIE9G', '9-Ga Galv Tie Wire (box of 100)', 'Commercial Fitting', 'Wire', 'box', 4.50, 9.00),
-- Hog Rings / Hog Ring Pliers
('CL-HR-BOX',     'CLHR',    'Hog Rings (box of 500)', 'Commercial Fitting', 'Hardware', 'box', 8.00, 16.00),
-- Nuts & Bolts (carriage bolt 5/16" x 1-1/4")
('CL-NB-516-BOX', 'CLNB516', '5/16" x 1-1/4" Carriage Bolt & Nut (box 50)', 'Commercial Fitting', 'Hardware', 'box', 6.50, 13.00);

-- ============================================================
-- CHAIN LINK GATES
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
-- Single Walk Gates
('CL-SWG-4-3',  'CLSWG43',  '3ft x 4ft Single Walk Gate Galvanized',  'Chain Link', 'Gates', 'each', 55.00,  95.00),
('CL-SWG-4-4',  'CLSWG44',  '4ft x 4ft Single Walk Gate Galvanized',  'Chain Link', 'Gates', 'each', 65.00,  110.00),
('CL-SWG-5-3',  'CLSWG53',  '3ft x 5ft Single Walk Gate Galvanized',  'Chain Link', 'Gates', 'each', 70.00,  120.00),
('CL-SWG-6-3',  'CLSWG63',  '3ft x 6ft Single Walk Gate Galvanized',  'Chain Link', 'Gates', 'each', 82.00,  140.00),
('CL-SWG-6-4',  'CLSWG64',  '4ft x 6ft Single Walk Gate Galvanized',  'Chain Link', 'Gates', 'each', 95.00,  165.00),
-- Double Drive Gates
('CL-DDG-10-6', 'CLDDG106', '10ft x 6ft Double Drive Gate Galvanized', 'Chain Link', 'Gates', 'each', 195.00, 330.00),
('CL-DDG-12-6', 'CLDDG126', '12ft x 6ft Double Drive Gate Galvanized', 'Chain Link', 'Gates', 'each', 235.00, 400.00),
('CL-DDG-14-6', 'CLDDG146', '14ft x 6ft Double Drive Gate Galvanized', 'Chain Link', 'Gates', 'each', 275.00, 465.00),
('CL-DDG-16-6', 'CLDDG166', '16ft x 6ft Double Drive Gate Galvanized', 'Chain Link', 'Gates', 'each', 315.00, 535.00),
-- Cantilever Gates
('CL-CANT-20-6','CLCANT206', '20ft Cantilever Gate Galvanized 6ft',    'Chain Link', 'Gates', 'each', 895.00, 1495.00),
('CL-CANT-30-6','CLCANT306', '30ft Cantilever Gate Galvanized 6ft',    'Chain Link', 'Gates', 'each', 1350.00, 2250.00),
-- Gate Hardware
('CL-GH-FORK',  'CLGHFORK',  'Gate Fork Latch (heavy duty)',   'Commercial Fitting', 'Gate Hardware', 'each', 6.50,  13.00),
('CL-GH-CANE',  'CLGHCANE',  'Gate Cane Bolt Assembly',        'Commercial Fitting', 'Gate Hardware', 'each', 12.00, 24.00),
('CL-GH-HINGE', 'CLGHHINGE', 'Gate Hinge Adjustable Galv',    'Commercial Fitting', 'Gate Hardware', 'each', 8.50,  17.00),
('CL-GH-LOCK',  'CLGHLOCK',  'Gate Lock Padlock Hasp',        'Commercial Fitting', 'Gate Hardware', 'each', 5.00,  10.00);

-- ============================================================
-- BARBED WIRE
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('BW-12G-1320',  'BW12G1320',  '12.5-Ga Barbed Wire 1320ft (1/4 mile)', 'Chain Link', 'Barbed Wire', 'roll', 28.00, 48.00),
('BW-12G-2640',  'BW12G2640',  '12.5-Ga Barbed Wire 2640ft (1/2 mile)', 'Chain Link', 'Barbed Wire', 'roll', 54.00, 92.00),
('BW-ARM-3',     'BWARM3',     '3-Arm Barbed Wire Extension Arm',        'Commercial Fitting', 'Barbed Wire', 'each', 4.50, 9.00),
('BW-ARM-V3',    'BWARMV3',    '3-Arm Barbed Wire Extension Arm (V-type)','Commercial Fitting', 'Barbed Wire', 'each', 6.50, 13.00),
('BW-STAPLE-BOX','BWSTAPLE',   'Barbed Wire Staples 1.5" (50lb box)',    'Commercial Fitting', 'Hardware', 'box', 45.00, 85.00);

-- ============================================================
-- PRIVACY SLATS - CHAIN LINK
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('PS-BK-4H-50',  'PSBK450',   'Black Privacy Slats 4ft roll (50ft)',  'Chain Link', 'Privacy Slats', 'roll', 22.00, 38.00),
('PS-BK-5H-50',  'PSBK550',   'Black Privacy Slats 5ft roll (50ft)',  'Chain Link', 'Privacy Slats', 'roll', 27.00, 46.00),
('PS-BK-6H-50',  'PSBK650',   'Black Privacy Slats 6ft roll (50ft)',  'Chain Link', 'Privacy Slats', 'roll', 33.00, 56.00),
('PS-GR-4H-50',  'PSGR450',   'Green Privacy Slats 4ft roll (50ft)',  'Chain Link', 'Privacy Slats', 'roll', 22.00, 38.00),
('PS-GR-6H-50',  'PSGR650',   'Green Privacy Slats 6ft roll (50ft)',  'Chain Link', 'Privacy Slats', 'roll', 33.00, 56.00),
('PS-TN-6H-50',  'PSTN650',   'Tan Privacy Slats 6ft roll (50ft)',    'Chain Link', 'Privacy Slats', 'roll', 33.00, 56.00);

-- ============================================================
-- WOOD FENCE - PRESSURE TREATED POSTS
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('WD-POST-4X4-8',  'WDPOST4X48',  '4x4 x 8ft Pressure Treated Post',  'Wood Fence', 'Posts', 'each', 9.50,  16.00),
('WD-POST-4X4-10', 'WDPOST4X410', '4x4 x 10ft Pressure Treated Post', 'Wood Fence', 'Posts', 'each', 11.90, 20.00),
('WD-POST-4X4-12', 'WDPOST4X412', '4x4 x 12ft Pressure Treated Post', 'Wood Fence', 'Posts', 'each', 14.25, 24.00),
('WD-POST-6X6-8',  'WDPOST6X68',  '6x6 x 8ft Pressure Treated Post',  'Wood Fence', 'Posts', 'each', 19.50, 33.00),
('WD-POST-6X6-10', 'WDPOST6X610', '6x6 x 10ft Pressure Treated Post', 'Wood Fence', 'Posts', 'each', 24.50, 41.00),
('WD-POST-6X6-12', 'WDPOST6X612', '6x6 x 12ft Pressure Treated Post', 'Wood Fence', 'Posts', 'each', 29.50, 50.00);

-- ============================================================
-- WOOD FENCE - PICKETS
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
-- Dog-Ear Pickets
('WD-PCK-DEG-6', 'WDPCKDEG6', '1x6 x 6ft Dog-Ear Cedar Picket',          'Wood Fence', 'Pickets', 'each', 2.85, 5.50),
('WD-PCK-DEP-6', 'WDPCKDEP6', '1x4 x 6ft Dog-Ear Pressure Treated Picket', 'Wood Fence', 'Pickets', 'each', 1.90, 3.75),
('WD-PCK-DEG-8', 'WDPCKDEG8', '1x6 x 8ft Dog-Ear Cedar Picket',          'Wood Fence', 'Pickets', 'each', 3.75, 7.25),
-- Flat Top Pickets
('WD-PCK-FTG-6', 'WDPCKFTG6', '1x6 x 6ft Flat-Top Cedar Picket',         'Wood Fence', 'Pickets', 'each', 2.85, 5.50),
-- Stockade Pickets (pointed)
('WD-PCK-STK-6', 'WDPCKSTK6', '2x4 x 6ft Stockade PT Picket',            'Wood Fence', 'Pickets', 'each', 3.50, 6.75),
-- Boards (privacy)
('WD-BRD-1X6-8', 'WDBRD1X68', '1x6 x 8ft Cedar Board',                   'Wood Fence', 'Boards', 'each', 4.50, 8.75);

-- ============================================================
-- WOOD FENCE - RAILS
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('WD-RAIL-2X4-8',  'WDRAIL2X48',  '2x4 x 8ft Pressure Treated Rail',   'Wood Fence', 'Rails', 'each', 4.50,  8.50),
('WD-RAIL-2X4-10', 'WDRAIL2X410', '2x4 x 10ft Pressure Treated Rail',  'Wood Fence', 'Rails', 'each', 5.65,  10.65),
('WD-RAIL-2X4-12', 'WDRAIL2X412', '2x4 x 12ft Pressure Treated Rail',  'Wood Fence', 'Rails', 'each', 6.75,  12.75),
('WD-RAIL-2X6-8',  'WDRAIL2X68',  '2x6 x 8ft Pressure Treated Rail',   'Wood Fence', 'Rails', 'each', 7.25,  13.75),
('WD-RAIL-2X6-12', 'WDRAIL2X612', '2x6 x 12ft Pressure Treated Rail',  'Wood Fence', 'Rails', 'each', 10.90, 20.50);

-- ============================================================
-- WOOD FENCE - HARDWARE
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('WD-HW-SB-5LB',   'WDHWSB5',    '2" x 16d HDG Spiral Shank Nails (5lb)',  'Wood Fence', 'Hardware', 'box',  8.50,  17.00),
('WD-HW-SB3-5LB',  'WDHWSB35',   '3" x 10d HDG Ring Shank Nails (5lb)',    'Wood Fence', 'Hardware', 'box',  9.00,  18.00),
('WD-HW-JOIST-10', 'WDHWJOIST',  'Joist Hanger 2x4 (10 pack)',             'Wood Fence', 'Hardware', 'pack', 7.50,  15.00),
('WD-HW-POSTCAP-4','WDHWPC4',    '4x4 Post Cap Black (each)',              'Wood Fence', 'Hardware', 'each', 3.50,   7.00),
('WD-HW-POSTCAP-6','WDHWPC6',    '6x6 Post Cap Black (each)',              'Wood Fence', 'Hardware', 'each', 5.50,  11.00),
('WD-HW-PBASE-4',  'WDHWPB4',    '4x4 Elevated Post Base (Standoff)',      'Wood Fence', 'Hardware', 'each', 12.00, 24.00),
('WD-HW-PBASE-6',  'WDHWPB6',    '6x6 Elevated Post Base (Standoff)',      'Wood Fence', 'Hardware', 'each', 18.00, 36.00),
('WD-HW-BRACKET',  'WDHWBRK',    'Fence Rail Bracket Heavy Duty (each)',   'Wood Fence', 'Hardware', 'each', 2.25,   4.50);

-- ============================================================
-- WOOD FENCE - GATES
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('WD-GATE-3X6',  'WDGATE3X6',  '3ft x 6ft Wood Fence Gate Kit',  'Wood Fence', 'Gates', 'each', 55.00,  110.00),
('WD-GATE-4X6',  'WDGATE4X6',  '4ft x 6ft Wood Fence Gate Kit',  'Wood Fence', 'Gates', 'each', 65.00,  130.00),
('WD-GATE-6X6',  'WDGATE6X6',  '6ft x 6ft Wood Double Gate Kit', 'Wood Fence', 'Gates', 'each', 95.00,  190.00),
('WD-GH-HINGE',  'WDGHHINGE',  'Heavy Duty Gate Hinge (pair)',    'Wood Fence', 'Gate Hardware', 'pair', 9.50, 19.00),
('WD-GH-LATCH',  'WDGHLATCH',  'Gate Latch Self-Closing',         'Wood Fence', 'Gate Hardware', 'each', 8.50, 17.00),
('WD-GH-SPRING', 'WDGHSPRING', 'Gate Spring Closer Heavy Duty',   'Wood Fence', 'Gate Hardware', 'each', 12.50, 25.00);

-- ============================================================
-- VINYL / PVC FENCE
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
-- Vinyl Posts
('VL-POST-4X4-8',  'VLPOST4X48',  '4x4 x 8ft White Vinyl Post',        'Vinyl Fence', 'Posts', 'each', 18.00, 35.00),
('VL-POST-4X4-10', 'VLPOST4X410', '4x4 x 10ft White Vinyl Post',       'Vinyl Fence', 'Posts', 'each', 22.50, 43.00),
('VL-POST-5X5-8',  'VLPOST5X58',  '5x5 x 8ft White Vinyl Post',        'Vinyl Fence', 'Posts', 'each', 28.00, 54.00),
('VL-POST-5X5-10', 'VLPOST5X510', '5x5 x 10ft White Vinyl Post',       'Vinyl Fence', 'Posts', 'each', 35.00, 67.50),
-- Vinyl Rails
('VL-RAIL-2X3-7',  'VLRAIL2X37',  '2x3 x 7.5ft White Vinyl Rail',     'Vinyl Fence', 'Rails', 'each', 6.50,  12.50),
('VL-RAIL-2X5-7',  'VLRAIL2X57',  '2x5 x 7.5ft White Vinyl Rail',     'Vinyl Fence', 'Rails', 'each', 9.00,  17.50),
-- Vinyl Pickets
('VL-PCK-1X3-5',   'VLPCK1X35',   '1x3 x 5ft White Vinyl Picket',     'Vinyl Fence', 'Pickets', 'each', 1.85, 3.75),
('VL-PCK-1X3-6',   'VLPCK1X36',   '1x3 x 6ft White Vinyl Picket',     'Vinyl Fence', 'Pickets', 'each', 2.25, 4.50),
-- Vinyl Privacy Panels
('VL-PNL-6X8-WHT', 'VLPNL6X8W',  '6ft x 8ft White Vinyl Privacy Panel', 'Vinyl Fence', 'Panels', 'each', 85.00, 165.00),
('VL-PNL-4X8-WHT', 'VLPNL4X8W',  '4ft x 8ft White Vinyl Privacy Panel', 'Vinyl Fence', 'Panels', 'each', 62.00, 120.00),
-- Vinyl Caps & Hardware
('VL-CAP-4X4',     'VLCAP4X4',    '4x4 Vinyl Post Cap (flat)',          'Vinyl Fence', 'Hardware', 'each', 2.50,  5.00),
('VL-CAP-5X5',     'VLCAP5X5',    '5x5 Vinyl Post Cap (flat)',          'Vinyl Fence', 'Hardware', 'each', 3.50,  7.00),
('VL-CAP-4X4-RT',  'VLCAP4X4R',   '4x4 Vinyl Post Cap (routed)',        'Vinyl Fence', 'Hardware', 'each', 4.50,  9.00),
('VL-POST-FOAM',   'VLPFOAM',     'Post Foam Insert (2" x 4ft)',        'Vinyl Fence', 'Hardware', 'each', 3.50,  7.00),
-- Vinyl Gates
('VL-GATE-3X6',    'VLGATE3X6',   '3ft x 6ft White Vinyl Gate',         'Vinyl Fence', 'Gates', 'each', 125.00, 245.00),
('VL-GATE-4X6',    'VLGATE4X6',   '4ft x 6ft White Vinyl Gate',         'Vinyl Fence', 'Gates', 'each', 155.00, 300.00),
('VL-GATE-5X5',    'VLGATE5X5',   '5ft x 5ft White Vinyl Gate',         'Vinyl Fence', 'Gates', 'each', 175.00, 340.00),
('VL-GATE-6X6-DBL','VLGATE6X6D',  '6ft x 6ft White Vinyl Double Gate',  'Vinyl Fence', 'Gates', 'each', 295.00, 575.00);

-- ============================================================
-- ALUMINUM FENCE
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
-- Aluminum Panels
('AL-PNL-4X6-BK',  'ALPNL4X6BK',  '4ft x 6ft Black Aluminum Fence Panel', 'Aluminum Fence', 'Panels', 'each', 55.00, 110.00),
('AL-PNL-5X6-BK',  'ALPNL5X6BK',  '5ft x 6ft Black Aluminum Fence Panel', 'Aluminum Fence', 'Panels', 'each', 68.00, 136.00),
('AL-PNL-4X4-BK',  'ALPNL4X4BK',  '4ft x 4ft Black Aluminum Fence Panel', 'Aluminum Fence', 'Panels', 'each', 46.00, 92.00),
('AL-PNL-3X6-BK',  'ALPNL3X6BK',  '3ft x 6ft Black Aluminum Fence Panel', 'Aluminum Fence', 'Panels', 'each', 42.00, 84.00),
-- Aluminum Posts
('AL-POST-4X4-6',  'ALPOST4X46',  '4x4 x 6ft Black Aluminum Post',       'Aluminum Fence', 'Posts', 'each', 28.00, 56.00),
('AL-POST-4X4-8',  'ALPOST4X48',  '4x4 x 8ft Black Aluminum Post',       'Aluminum Fence', 'Posts', 'each', 36.00, 72.00),
('AL-POST-3X3-6',  'ALPOST3X36',  '3x3 x 6ft Black Aluminum Post',       'Aluminum Fence', 'Posts', 'each', 20.00, 40.00),
-- Aluminum Gates
('AL-GATE-3X4-BK', 'ALGATE3X4BK', '3ft x 4ft Black Aluminum Gate',       'Aluminum Fence', 'Gates', 'each', 120.00, 240.00),
('AL-GATE-4X4-BK', 'ALGATE4X4BK', '4ft x 4ft Black Aluminum Gate',       'Aluminum Fence', 'Gates', 'each', 145.00, 290.00),
('AL-GATE-4X6-BK', 'ALGATE4X6BK', '4ft x 6ft Black Aluminum Gate',       'Aluminum Fence', 'Gates', 'each', 195.00, 390.00),
('AL-GATE-10X4-DBL','ALGATE10DBL', '10ft x 4ft Black Aluminum Double Gate','Aluminum Fence', 'Gates', 'each', 350.00, 700.00),
-- Aluminum Hardware
('AL-HINGE-ADJ',   'ALHINGE',     'Adjustable Hinge for Aluminum Gate',  'Aluminum Fence', 'Hardware', 'each', 8.50, 17.00),
('AL-LATCH-MAG',   'ALLATMAG',    'Magnetic Latch for Aluminum Gate',    'Aluminum Fence', 'Hardware', 'each', 12.00, 24.00),
('AL-POST-CAP',    'ALPOSTCAP',   'Post Cap for Aluminum Post',          'Aluminum Fence', 'Hardware', 'each', 3.50,  7.00);

-- ============================================================
-- CONCRETE / INSTALLATION MATERIALS
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('CON-SAKRETE-60',   'CONSK60',  'Sakrete 60lb Fast Set Concrete Mix',  'Installation', 'Concrete', 'bag', 6.50, 12.50),
('CON-SAKRETE-80',   'CONSK80',  'Sakrete 80lb Fast Set Concrete Mix',  'Installation', 'Concrete', 'bag', 8.00, 15.50),
('CON-QUICKCRETE-50','CONQK50',  'Quikrete 50lb Concrete Mix',          'Installation', 'Concrete', 'bag', 5.50, 10.75),
('CON-QUICKCRETE-60','CONQK60',  'Quikrete 60lb Concrete Mix',          'Installation', 'Concrete', 'bag', 6.50, 12.50),
('CON-QUICKCRETE-80','CONQK80',  'Quikrete 80lb Concrete Mix',          'Installation', 'Concrete', 'bag', 8.50, 16.50),
('CON-STUCCO-50',    'CONST50',  'Stucco Mix 50lb (form filler)',       'Installation', 'Concrete', 'bag', 7.00, 13.50),
('CON-GRAVEL-BAG',   'CONGRV',   'Pea Gravel 50lb Bag (drainage)',      'Installation', 'Gravel',   'bag', 4.50, 9.00),
('CON-GRAVEL-YARD',  'CONGRVYD', 'Pea Gravel (per cubic yard)',         'Installation', 'Gravel',   'yard', 45.00, 85.00),
('CON-SAND-50',      'CONSAN50', 'Washed Sand 50lb Bag',                'Installation', 'Sand',     'bag', 4.00, 8.00);

-- ============================================================
-- TOOLS & EQUIPMENT (Rental / Sale)
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('TOOL-POUNDER',  'TOOLPOUND',  'Post Driver / Pounder (manual)', 'Tools', 'Post Tools', 'each', 45.00, 90.00),
('TOOL-AUGER-4',  'TOOLAUG4',   '4" Manual Auger Blade',          'Tools', 'Post Tools', 'each', 22.00, 45.00),
('TOOL-AUGER-6',  'TOOLAUG6',   '6" Manual Auger Blade',          'Tools', 'Post Tools', 'each', 28.00, 55.00),
('TOOL-AUGER-8',  'TOOLAUG8',   '8" Manual Auger Blade',          'Tools', 'Post Tools', 'each', 35.00, 70.00),
('TOOL-PULLER',   'TOOLPULL',   'Fence Stretcher / Puller',       'Tools', 'Chain Link', 'each', 65.00, 130.00),
('TOOL-STRETCHER','TOOLSTRETCH','Come-Along Fence Stretcher 1T',  'Tools', 'Chain Link', 'each', 42.00, 84.00),
('TOOL-CRIMPER',  'TOOLCRIMP',  'Fence Crimping Pliers',          'Tools', 'Chain Link', 'each', 15.00, 30.00),
('TOOL-LINEMAN',  'TOOLLINE',   'Lineman Pliers 9"',              'Tools', 'General',    'each', 18.00, 36.00),
('TOOL-POSTLEVEL','TOOLPLVL',   'Post Level Magnetic',            'Tools', 'General',    'each', 8.50,  17.00),
('TOOL-MASON-LINE','TOOLMLINE', 'Mason Line 500ft (layout)',      'Tools', 'General',    'each', 4.50,   9.00),
('TOOL-SPRAY-FLAG','TOOLSFLAG', 'Utility Flag Marking Spray (case 12)', 'Tools', 'General', 'case', 28.00, 55.00),
('TOOL-STAKES',    'TOOLSTAKE', 'Survey Stakes (bundle of 25)',   'Tools', 'General',    'bundle', 6.50, 13.00),
('TOOL-DIGGERS',   'TOOLDIG',   'Clamshell Post Hole Digger',     'Tools', 'Post Tools', 'each', 28.00, 55.00),
('TOOL-TAMPER',    'TOOLTAMP',  'Tamping Bar 6ft (post setting)', 'Tools', 'Post Tools', 'each', 22.00, 44.00),
('TOOL-WHEELBARR', 'TOOLWB',   'Wheelbarrow 6 cu ft',            'Tools', 'General',    'each', 85.00, 170.00),
('TOOL-MIXPADDL',  'TOOLMIX',  'Concrete Mixing Paddle 3/4" Drill','Tools', 'Concrete', 'each', 12.00, 24.00),
('TOOL-HACKSW',    'TOOLHSAW', 'Hacksaw (for metal cutting)',     'Tools', 'Cutting',   'each', 12.50, 25.00),
('TOOL-RECIPSAW',  'TOOLRSAW', 'Recip Saw Blades Metal (5pk)',   'Tools', 'Cutting',   'pack', 8.50, 17.00);

-- ============================================================
-- SAFETY & PPE
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('PPE-GLOVES-L',  'PPEGLVL',  'Work Gloves Leather L',            'Safety', 'PPE', 'pair', 8.50,  17.00),
('PPE-GLOVES-XL', 'PPEGLVXL', 'Work Gloves Leather XL',           'Safety', 'PPE', 'pair', 8.50,  17.00),
('PPE-GLASSES',   'PPEGLASS', 'Safety Glasses Clear',             'Safety', 'PPE', 'each', 3.50,   7.00),
('PPE-HELMET',    'PPEHELM',  'Hard Hat White (adjustable)',       'Safety', 'PPE', 'each', 12.00, 24.00),
('PPE-VEST-L',    'PPEVEST',  'Safety Vest Orange L/XL',          'Safety', 'PPE', 'each', 6.50,  13.00),
('PPE-EARPLUG',   'PPEEAR',   'Ear Plugs Foam (box of 200)',      'Safety', 'PPE', 'box', 8.50, 17.00),
('PPE-KNEEPADS',  'PPEKP',   'Knee Pads Foam',                   'Safety', 'PPE', 'pair', 12.00, 24.00),
('PPE-BOOTS-10',  'PPEBOOT10','Steel Toe Work Boots Size 10',     'Safety', 'PPE', 'pair', 75.00, 150.00),
('PPE-SUNSCREEN', 'PPESUN',   'Sunscreen SPF50 (bulk 6oz)',       'Safety', 'PPE', 'each', 4.50,  9.00),
('PPE-FIRSTAID',  'PPEFA',   'First Aid Kit 50-piece',            'Safety', 'PPE', 'kit', 18.00, 36.00);

-- ============================================================
-- UNDERGROUND UTILITIES / LOCATING
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('UTIL-811-FLAG',  'UTIL811',   '811 Call Before You Dig Flag Set (20pk)', 'Installation', 'Utilities', 'pack', 3.50, 7.00),
('UTIL-LINERMARK', 'UTILMARK',  'Line Marking Spray White (case 12)',       'Installation', 'Utilities', 'case', 28.00, 55.00),
('UTIL-SEWER-CAP', 'UTILSEWER', 'Sewer Clean-Out Cap 4" (replacement)',    'Installation', 'Utilities', 'each', 8.50, 17.00);

-- ============================================================
-- WROUGHT IRON / STEEL ORNAMENTAL
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('WI-PNL-4X4-BK',  'WIPNL4X4',  '4ft x 4ft Wrought Iron Panel Black',    'Ornamental', 'Panels',  'each', 65.00, 130.00),
('WI-PNL-4X6-BK',  'WIPNL4X6',  '4ft x 6ft Wrought Iron Panel Black',    'Ornamental', 'Panels',  'each', 95.00, 190.00),
('WI-POST-4X4-8',  'WIPOST4X48','4x4 x 8ft Steel Post Black Powder',      'Ornamental', 'Posts',   'each', 55.00, 110.00),
('WI-POST-3X3-6',  'WIPOST3X36','3x3 x 6ft Steel Post Black Powder',      'Ornamental', 'Posts',   'each', 38.00, 76.00),
('WI-GATE-3X4',    'WIGATE3X4', '3ft x 4ft Wrought Iron Gate Black',      'Ornamental', 'Gates',   'each', 175.00, 350.00),
('WI-GATE-4X6',    'WIGATE4X6', '4ft x 6ft Wrought Iron Gate Black',      'Ornamental', 'Gates',   'each', 275.00, 550.00),
('WI-GATE-10X4DBL','WIGATE10D', '10ft x 4ft Double Driveway Gate Black',  'Ornamental', 'Gates',   'each', 550.00, 1100.00),
('WI-FINIAL-PKG',  'WIFINIAL',  'Finial Spear Tips (10-pk)',               'Ornamental', 'Hardware','pack', 12.00, 24.00),
('WI-RUST-INHIBIT','WIRUSTINB', 'Rust Inhibitor Primer Spray 12oz',        'Ornamental', 'Hardware','each', 6.50, 13.00),
('WI-PAINT-BK',    'WIPAINTBK', 'Flat Black Outdoor Metal Paint Qt',      'Ornamental', 'Hardware','qt',   12.00, 24.00),
('WI-PAINT-BK-GL', 'WIPAINTGL', 'Flat Black Outdoor Metal Paint Gal',     'Ornamental', 'Hardware','gal',  38.00, 76.00);

-- ============================================================
-- TEMPORARY FENCE / CONSTRUCTION
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('TMP-PNL-6X10',   'TMPPNL610', 'Temp Chain Link Panel 6ft x 10ft',    'Temp Fence', 'Panels',   'each', 65.00, 130.00),
('TMP-BASE',       'TMPBASE',   'Temp Fence Panel Base / Foot',         'Temp Fence', 'Hardware', 'each', 8.50,  17.00),
('TMP-CLAMP',      'TMPCLAMP',  'Temp Fence Panel Clamp',               'Temp Fence', 'Hardware', 'each', 4.50,   9.00),
('TMP-BRACE',      'TMPBRACE',  'Temp Fence Diagonal Brace',            'Temp Fence', 'Hardware', 'each', 12.00, 24.00),
('TMP-WIND-SCREEN','TMPWSCREEN','Windscreen Privacy 6ft x 150ft Green', 'Temp Fence', 'Accessories','roll', 95.00, 185.00);

-- ============================================================
-- FARM & AGRICULTURE FENCING
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
-- Field Fence / Welded Wire
('FF-WELD-2X4-4H-100', 'FFWELD4100', '2x4" Welded Wire 4ft x 100ft Roll',   'Farm Fence', 'Wire',  'roll', 48.00, 92.00),
('FF-WELD-2X4-5H-100', 'FFWELD5100', '2x4" Welded Wire 5ft x 100ft Roll',   'Farm Fence', 'Wire',  'roll', 60.00, 115.00),
('FF-WELD-4X4-4H-100', 'FFWELD4X4',  '4x4" Welded Wire 4ft x 100ft Roll',   'Farm Fence', 'Wire',  'roll', 38.00, 72.00),
('FF-HORSE-4H-330',    'FFHORSE4',   '4ft Horse Wire Non-Climb 330ft Roll', 'Farm Fence', 'Wire',  'roll', 185.00, 350.00),
('FF-HORSE-5H-330',    'FFHORSE5',   '5ft Horse Wire Non-Climb 330ft Roll', 'Farm Fence', 'Wire',  'roll', 225.00, 425.00),
-- T-Posts
('FF-TPOST-5',  'FFTPOST5',  'Steel T-Post 5ft (galvanized)',  'Farm Fence', 'Posts', 'each', 4.50,  9.00),
('FF-TPOST-6',  'FFTPOST6',  'Steel T-Post 6ft (galvanized)',  'Farm Fence', 'Posts', 'each', 5.50,  11.00),
('FF-TPOST-7',  'FFTPOST7',  'Steel T-Post 7ft (galvanized)',  'Farm Fence', 'Posts', 'each', 6.50,  13.00),
('FF-TPOST-8',  'FFTPOST8',  'Steel T-Post 8ft (galvanized)',  'Farm Fence', 'Posts', 'each', 7.50,  15.00),
-- T-Post Clips
('FF-TCLIP-BOX','FFTCLIP',  'T-Post Clips Wire Ties (bag 100)', 'Farm Fence', 'Hardware', 'bag', 4.50, 9.00),
-- Corner Posts / Deadman
('FF-CP-4X4-8', 'FFCP4X48', '4x4 x 8ft PT Corner Post',        'Farm Fence', 'Posts', 'each', 9.50, 19.00),
-- Cattle / Hog Panels
('FF-CATTLE-16X50','FFCATTLE', 'Cattle Panel 16ft x 50" (10pk)', 'Farm Fence', 'Panels', 'each', 28.00, 55.00),
('FF-HOG-16X34',   'FFHOG',   'Hog Panel 16ft x 34"',           'Farm Fence', 'Panels', 'each', 22.00, 42.00);

-- ============================================================
-- ELECTRIC FENCE / SECURITY
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('EF-CHARGER-AC',  'EFCHARGE',  'Electric Fence Charger AC (1 Joule)', 'Electric Fence', 'Chargers', 'each', 65.00, 130.00),
('EF-CHARGER-SOL', 'EFSOL',     'Solar Fence Charger 1.0 Joule',       'Electric Fence', 'Chargers', 'each', 85.00, 170.00),
('EF-WIRE-GALV',   'EFWIRE',    'Galv Electric Fence Wire 17-Ga 1/4mi', 'Electric Fence', 'Wire',    'roll', 18.00, 36.00),
('EF-POLY-WIRE',   'EFPOLY',    'PolyWire Electric Fence 1/4 mile',    'Electric Fence', 'Wire',    'roll', 22.00, 44.00),
('EF-INSULPOST-S', 'EFINSPOST', 'Insulator Step-In Post (10pk)',       'Electric Fence', 'Insulators','pack', 8.00, 16.00),
('EF-INSUL-CORN',  'EFINSCORN', 'Corner Insulator Heavy Duty (10pk)', 'Electric Fence', 'Insulators','pack', 6.50, 13.00),
('EF-INSUL-LINE',  'EFINSLINE', 'Line Insulator (50pk)',               'Electric Fence', 'Insulators','pack', 5.00, 10.00),
('EF-GROUND-ROD',  'EFGND',     'Ground Rod 4ft x 1/2" (copper clad)','Electric Fence', 'Hardware', 'each', 8.50, 17.00),
('EF-GROUND-CLAMP','EFGNDCLMP', 'Ground Rod Clamp',                    'Electric Fence', 'Hardware', 'each', 3.50,  7.00),
('EF-TESTER',      'EFTEST',    'Electric Fence Tester / Meter',       'Electric Fence', 'Tools',   'each', 18.00, 36.00);

-- ============================================================
-- FENCING ACCESSORIES & MISCELLANEOUS
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('ACC-NOSHOOT',   'ACCNS',    '"No Trespassing" Sign (aluminum)',       'Accessories', 'Signs',     'each', 3.50,  7.00),
('ACC-NOSHOOTS',  'ACCNSS',   '"No Shooting" Sign (aluminum)',          'Accessories', 'Signs',     'each', 3.50,  7.00),
('ACC-NODOG',     'ACCND',    '"Beware of Dog" Sign (aluminum)',        'Accessories', 'Signs',     'each', 3.50,  7.00),
('ACC-FENCE-COAT','ACCFC',    'Fence Coating Galv Repair Spray 16oz',  'Accessories', 'Coatings',  'each', 8.50, 17.00),
('ACC-RUST-STOP', 'ACCRS',    'Rust-Oleum Stops Rust 12oz Spray',      'Accessories', 'Coatings',  'each', 6.50, 13.00),
('ACC-ANTI-RUST', 'ACCAR',    'Anti-Rust Primer Oil-Based Qt',         'Accessories', 'Coatings',  'qt',  14.00, 28.00),
('ACC-ZIP-BLACK', 'ACCZIPBK', 'Black UV Cable Ties 12" (100pk)',       'Accessories', 'Hardware',  'pack', 4.50,  9.00),
('ACC-ZIP-WHITE', 'ACCZIPWH', 'White UV Cable Ties 12" (100pk)',       'Accessories', 'Hardware',  'pack', 4.50,  9.00),
('ACC-PADLOCK-MD','ACCPLKMD', 'Padlock 1-3/4" (medium security)',      'Accessories', 'Security',  'each', 8.50, 17.00),
('ACC-PADLOCK-HV','ACCPLKHV', 'Padlock 2" Hardened Shackle (HD)',      'Accessories', 'Security',  'each', 14.00, 28.00),
('ACC-CHAIN-3',   'ACCCHN3',  'Security Chain 3/8" x 3ft (galv)',      'Accessories', 'Security',  'each', 22.00, 44.00),
('ACC-CHAIN-6',   'ACCCHN6',  'Security Chain 3/8" x 6ft (galv)',      'Accessories', 'Security',  'each', 38.00, 76.00),
('ACC-DEADBOLT',  'ACCDEAD',  'Gate Deadbolt Lock Exterior (keyed)',   'Accessories', 'Security',  'each', 24.00, 48.00),
('ACC-DROPROD',   'ACCDROP',  'Drop Rod 1" x 36" (galvanized)',        'Accessories', 'Hardware',  'each', 8.50, 17.00),
('ACC-FLOODLGT',  'ACCFLOOD', 'Motion Sensor Flood Light (dual)',      'Accessories', 'Security',  'each', 38.00, 76.00),
('ACC-CAMERM',    'ACCCAM',   'Security Camera Outdoor 1080p',         'Accessories', 'Security',  'each', 55.00, 110.00);

-- ============================================================
-- LABOR RATES (non-inventory service items)
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('LAB-DEMO-LF',    'LABDEMO',   'Demolition / Remove Old Fence (per LF)', 'Labor', 'Demo',        'lf',   2.50,  5.00),
('LAB-INST-CL-LF', 'LABINSTCL', 'Chain Link Install Labor (per LF)',       'Labor', 'Install',     'lf',   5.00, 12.00),
('LAB-INST-WD-LF', 'LABINSTWD', 'Wood Fence Install Labor (per LF)',       'Labor', 'Install',     'lf',   6.00, 14.00),
('LAB-INST-VL-LF', 'LABINSTVL', 'Vinyl Fence Install Labor (per LF)',      'Labor', 'Install',     'lf',   7.00, 16.00),
('LAB-INST-AL-LF', 'LABINSTAL', 'Aluminum Fence Install Labor (per LF)',   'Labor', 'Install',     'lf',   7.00, 16.00),
('LAB-GATE-WALK',  'LABGATEWK', 'Walk Gate Install Labor (each)',           'Labor', 'Gates',       'each', 50.00, 125.00),
('LAB-GATE-DRIVE', 'LABGATEDR', 'Drive Gate Install Labor (each)',          'Labor', 'Gates',       'each', 95.00, 225.00),
('LAB-GATE-CANTI', 'LABGATECT', 'Cantilever Gate Install Labor (each)',     'Labor', 'Gates',       'each', 200.00, 475.00),
('LAB-POST-RESET', 'LABPOSTRST','Post Reset / Repair (each)',               'Labor', 'Repair',      'each', 25.00, 65.00),
('LAB-CONCRETE-HR','LABCONHR',  'Concrete Mixing Labor (per hour)',         'Labor', 'Concrete',    'hr',   45.00, 95.00),
('LAB-SURVEY-PROP','LABSURVEY', 'Property Survey / Line Locate (per hr)',   'Labor', 'Survey',      'hr',   65.00, 150.00),
('LAB-AUGER-RENTAL','LABAUGR',  'Power Auger Rental (per day)',             'Labor', 'Equipment',   'day',  85.00, 185.00),
('LAB-EXCAVATE-HR','LABEXCAV',  'Mini-Excavator Labor (per hour)',          'Labor', 'Equipment',   'hr',   95.00, 195.00),
('LAB-HAUL-DEBRIS','LABHAULD',  'Debris Haul-Away (per load)',              'Labor', 'Disposal',    'load', 95.00, 195.00),
('LAB-PERMIT-FEE', 'LABPERMIT', 'Permit Filing & Processing Fee',           'Labor', 'Admin',       'each', 45.00, 95.00),
('LAB-TRAVEL',     'LABTRAVEL', 'Travel / Fuel Surcharge',                  'Labor', 'Admin',       'trip', 25.00, 55.00);

-- ============================================================
-- CHAIN LINK MESH (additional gauges / coatings)
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
-- 2" Mesh (standard)
('CL-MESH-2-9G-6-50','CLMESH29650', '2" Mesh 9-Ga Galv 6ft x 50ft',     'Chain Link', 'Fabric', 'roll', 58.00, 87.00),
-- 2-1/4" Mesh
('CL-MESH-225-9G-6-50','CLMESH2259','2-1/4" Mesh 9-Ga Galv 6ft x 50ft', 'Chain Link', 'Fabric', 'roll', 52.00, 78.00),
-- 2-3/8" Mesh (heavy commercial)
('CL-MESH-238-9G-6-50','CLMESH2389','2-3/8" Mesh 9-Ga Galv 6ft x 50ft', 'Chain Link', 'Fabric', 'roll', 55.00, 82.00),
-- 3/8" mini mesh (security)
('CL-MESH-375-6G-7-50','CLMESH3756','3/8" Mesh 6-Ga Galv 7ft x 50ft',   'Chain Link', 'Fabric', 'roll', 165.00, 248.00),
-- 1" mesh (animal containment)
('CL-MESH-1-11G-4-50', 'CLMESH1114','1" Mesh 11-Ga Galv 4ft x 50ft',    'Chain Link', 'Fabric', 'roll', 42.00, 63.00);

-- ============================================================
-- SPECIALTY ITEMS
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('SPEC-RAZOR-10', 'SPECRAZOR10', 'Razor Wire Coil 18" x 10ft',           'Security',    'Razor Wire', 'coil', 22.00, 45.00),
('SPEC-RAZOR-50', 'SPECRAZOR50', 'Razor Wire Coil 18" x 50ft',           'Security',    'Razor Wire', 'coil', 95.00, 195.00),
('SPEC-CONC-200', 'SPECCONCWIRE','Concertina Wire Coil 24" x 60ft',      'Security',    'Razor Wire', 'coil', 145.00, 295.00),
('SPEC-AUTOGATE', 'SPECAUTO',    'Automatic Gate Operator (single swing)','Security',    'Automation', 'each', 450.00, 950.00),
('SPEC-AUTOGATE2','SPECAUTO2',   'Automatic Gate Operator (dual swing)', 'Security',    'Automation', 'each', 850.00, 1750.00),
('SPEC-SLIDER-OP','SPECSLIDER',  'Sliding Gate Operator (up to 20ft)',   'Security',    'Automation', 'each', 650.00, 1350.00),
('SPEC-KEYPAD',   'SPECKEYPAD',  'Keypad Entry 12-Button Weatherproof',  'Security',    'Access',     'each', 85.00, 175.00),
('SPEC-INTERCOM', 'SPECINTERC',  'Video Intercom Entry System',          'Security',    'Access',     'each', 195.00, 395.00),
('SPEC-CARD-RDR', 'SPECCARD',    'Proximity Card Reader (access control)','Security',   'Access',     'each', 145.00, 295.00),
('SPEC-BOLLARD-4','SPECBOLL4',   '4" Bollard Fixed 42" Height Steel',    'Security',    'Vehicle',    'each', 125.00, 250.00),
('SPEC-BOLLARD-6','SPECBOLL6',   '6" Bollard Fixed 48" Height Steel',    'Security',    'Vehicle',    'each', 185.00, 370.00),
('SPEC-CATTLE-GT','SPECCATTLE',  'Cattle Guard 10ft x 6ft (galvanized)', 'Farm Fence',  'Specialty',  'each', 850.00, 1700.00),
('SPEC-HORSE-SALT','SPECHORSE',  'Horse Corral 4-Rail Welded (8x8ft section)','Farm Fence','Specialty','each',95.00, 190.00);

-- ============================================================
-- ADDITIONAL CHAIN LINK LINE POST ACCESSORIES
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('CL-SLEEV-158',  'CLSLEEV158', '1-5/8" Swaged Sleeve (rail connector)', 'Commercial Fitting', 'Sleeves', 'each', 1.20, 2.40),
('CL-SLEEV-178',  'CLSLEEV178', '1-7/8" Swaged Sleeve (rail connector)', 'Commercial Fitting', 'Sleeves', 'each', 1.45, 2.90),
('CL-DOME-CAP',   'CLDOME',     'Dome Cap Post Topper (anti-climb)',      'Commercial Fitting', 'Caps',    'each', 3.50, 7.00),
('CL-CROWNEDGE',  'CLCROWN',    'Crown Edge Topper (barb substitute)',    'Commercial Fitting', 'Tops',    'lf',   3.50, 7.00),
('CL-STRLINE-PUL','CLSTRPULL',  'Steel Straining Line Pull (wire form)', 'Commercial Fitting', 'Hardware','each', 2.50, 5.00),
('CL-TRUSS-ROD',  'CLTROSS',    '3/8" Truss Rod with Turnbuckle',        'Commercial Fitting', 'Hardware','each', 5.50, 11.00),
('CL-TURNBUCKLE', 'CLTBUCKLE',  '3/8" Turnbuckle Hook/Hook 6" take-up',  'Commercial Fitting', 'Hardware','each', 3.50, 7.00);

-- ============================================================
-- MISCELLANEOUS ADDITIONAL PRODUCTS (fill to 950+)
-- ============================================================
INSERT INTO inventory (plu, sku, name, department, category, unit, cost, price) VALUES
('MISC-PATIO-SCR', 'MISCPATIO', 'Patio Privacy Screen 6ft x 8ft Bamboo', 'Accessories', 'Privacy', 'each', 28.00, 56.00),
('MISC-NETTING',   'MISCNET',   'Deer Netting 7ft x 100ft Black Poly',   'Accessories', 'Netting', 'roll', 22.00, 44.00),
('MISC-BIRD-NET',  'MISCBIRD',  'Bird Netting 14x14 ft',                  'Accessories', 'Netting', 'each', 12.00, 24.00),
('MISC-POOL-FENCE','MISCPOOL',  'Pool Safety Fence Kit 4ft x 10ft Panel','Accessories', 'Safety',  'each', 55.00, 110.00),
('MISC-SILT-FENCE','MISCSILF',  'Silt Fence 3ft x 100ft (erosion ctrl)',  'Installation','Erosion', 'roll', 28.00, 56.00),
('MISC-WEED-BARR', 'MISCWEED',  'Weed Barrier Fabric 3ft x 50ft',        'Installation','Erosion', 'roll', 12.00, 24.00),
('MISC-SPEED-BUMP','MISCSPEED', 'Speed Bump Rubber 6ft Section',          'Accessories', 'Traffic', 'each', 45.00, 90.00),
('MISC-WHEEL-STOP','MISCWHEEL', 'Wheel Stop Parking Curb Concrete',       'Accessories', 'Traffic', 'each', 38.00, 76.00),
('MISC-REFL-POST', 'MISCREFL',  'Reflective Delineator Post 28" Orange',  'Accessories', 'Traffic', 'each', 12.00, 24.00),
('MISC-CONC-CURB', 'MISCCURB',  'Concrete Curb Stop Parking (each)',      'Accessories', 'Traffic', 'each', 45.00, 90.00);

-- Verify count
-- SELECT COUNT(*) FROM inventory;
