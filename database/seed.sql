-- ============================================================
-- FENCE ESTIMATOR - SEED DATA
-- Version: 1.0.0
-- Description: 950+ fence materials, 5 suppliers, demo data
-- ============================================================

-- ============================================================
-- USERS
-- ============================================================
INSERT INTO users (username, email, password_hash, full_name, role) VALUES
    ('admin',     'admin@abcfence.com',    '$2b$10$adminhashedpassword',    'Admin User',       'admin'),
    ('estimator1','john@abcfence.com',     '$2b$10$estimator1hashedpassword','John Smith',      'estimator'),
    ('estimator2','maria@abcfence.com',    '$2b$10$estimator2hashedpassword','Maria Garcia',    'estimator'),
    ('viewer1',   'viewer@abcfence.com',   '$2b$10$viewer1hashedpassword',  'View Only User',   'viewer');

-- ============================================================
-- SUPPLIERS
-- ============================================================
INSERT INTO suppliers (supplier_name, contact_name, email, phone, city, state, zip_code, account_number, payment_terms, lead_time_days, is_preferred) VALUES
    ('AmeriSteel Fence Supply',  'Bob Johnson',    'bob@ameristeel.com',   '713-555-0101', 'Houston',    'TX', '77001', 'ABC-1001', 'Net 30', 2, TRUE),
    ('Gulf Coast Fence Products','Linda Martinez', 'linda@gulfcoast.com',  '281-555-0202', 'Pasadena',   'TX', '77501', 'ABC-1002', 'Net 15', 3, FALSE),
    ('Texas Fence Wholesale',    'Mike Davis',     'mike@txfence.com',     '972-555-0303', 'Dallas',     'TX', '75201', 'ABC-1003', 'Net 30', 5, FALSE),
    ('National Fence Dist.',     'Sara Lee',       'sara@nationalfence.com','800-555-0404','Atlanta',    'GA', '30301', 'ABC-1004', 'Net 45', 7, FALSE),
    ('HarborWire Co.',           'Tom Chen',       'tom@harborwire.com',   '310-555-0505', 'Los Angeles','CA', '90001', 'ABC-1005', 'Net 30', 10, FALSE);

-- ============================================================
-- CUSTOMERS (demo data)
-- ============================================================
INSERT INTO customers (first_name, last_name, company_name, email, phone, address_line1, city, state, zip_code, customer_type, created_by) VALUES
    ('James',    'Wilson',     NULL,                       'james.wilson@email.com',    '713-555-1001', '1420 Oak St',         'Houston',     'TX', '77002', 'residential', 1),
    ('Patricia', 'Brown',      NULL,                       'patricia.b@email.com',      '281-555-1002', '3305 Pine Ave',       'Pasadena',    'TX', '77502', 'residential', 1),
    ('Robert',   'Johnson',    'Johnson LLC',              'robert.j@johnsonllc.com',   '713-555-1003', '500 Commerce Blvd',   'Houston',     'TX', '77010', 'commercial',  1),
    ('Jennifer', 'Davis',      NULL,                       'jennifer.d@email.com',      '832-555-1004', '9812 Elm Dr',         'Sugar Land',  'TX', '77478', 'residential', 2),
    ('Michael',  'Martinez',   'Martinez Properties',      'mike@martinezprop.com',     '713-555-1005', '1200 Main St Ste 400','Houston',     'TX', '77002', 'commercial',  2),
    ('Linda',    'Taylor',     NULL,                       'linda.t@email.com',         '281-555-1006', '450 Maple Ct',        'Pearland',    'TX', '77584', 'residential', 2),
    ('William',  'Anderson',   'Anderson HOA',             'w.anderson@ahoa.org',       '713-555-1007', '6000 Community Blvd', 'Katy',        'TX', '77449', 'hoa',         1),
    ('Barbara',  'Thomas',     NULL,                       'b.thomas@email.com',        '832-555-1008', '7721 Birch Ln',       'Spring',      'TX', '77373', 'residential', 3),
    ('Richard',  'Jackson',    'Jackson Industrial',       'r.jackson@jacksonind.com',  '713-555-1009', '3400 Industrial Dr',  'Houston',     'TX', '77020', 'commercial',  1),
    ('Susan',    'White',      NULL,                       'susan.w@email.com',         '281-555-1010', '234 Cedar St',        'League City', 'TX', '77573', 'residential', 2);

-- ============================================================
-- MATERIALS - CHAIN LINK FENCE
-- ============================================================
INSERT INTO materials (sku, plu, name, category, subcategory, department, unit_of_measure, unit_cost, unit_price, markup_pct, gauge, height_ft, length_ft, color, coating, fence_type, notes) VALUES

-- Chain Link Fabric (Mesh)
('CL-FABRIC-4-11-GV',  '10001', 'Chain Link Fabric 4ft 11ga Galvanized',    'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 1.42, 1.85, 30.28, '11', 4,    50, 'Silver', 'Galvanized', 'chain_link', 'Standard residential grade'),
('CL-FABRIC-4-9-GV',   '10002', 'Chain Link Fabric 4ft 9ga Galvanized',     'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 1.85, 2.40, 29.73, '9',  4,    50, 'Silver', 'Galvanized', 'chain_link', 'Heavy commercial grade'),
('CL-FABRIC-5-11-GV',  '10003', 'Chain Link Fabric 5ft 11ga Galvanized',    'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 1.72, 2.24, 30.23, '11', 5,    50, 'Silver', 'Galvanized', 'chain_link', 'Standard residential grade'),
('CL-FABRIC-5-9-GV',   '10004', 'Chain Link Fabric 5ft 9ga Galvanized',     'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 2.20, 2.86, 30.00, '9',  5,    50, 'Silver', 'Galvanized', 'chain_link', 'Heavy commercial grade'),
('CL-FABRIC-6-11-GV',  '10005', 'Chain Link Fabric 6ft 11ga Galvanized',    'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 2.05, 2.66, 29.76, '11', 6,    50, 'Silver', 'Galvanized', 'chain_link', 'Standard residential grade'),
('CL-FABRIC-6-9-GV',   '10006', 'Chain Link Fabric 6ft 9ga Galvanized',     'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 2.65, 3.44, 29.81, '9',  6,    50, 'Silver', 'Galvanized', 'chain_link', 'Heavy commercial grade'),
('CL-FABRIC-8-9-GV',   '10007', 'Chain Link Fabric 8ft 9ga Galvanized',     'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 3.52, 4.58, 30.11, '9',  8,    50, 'Silver', 'Galvanized', 'chain_link', 'Commercial/industrial grade'),
('CL-FABRIC-10-9-GV',  '10008', 'Chain Link Fabric 10ft 9ga Galvanized',    'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 4.40, 5.72, 30.00, '9',  10,   50, 'Silver', 'Galvanized', 'chain_link', 'Industrial grade'),
('CL-FABRIC-12-9-GV',  '10009', 'Chain Link Fabric 12ft 9ga Galvanized',    'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 5.28, 6.86, 29.92, '9',  12,   50, 'Silver', 'Galvanized', 'chain_link', 'Industrial grade'),
('CL-FABRIC-4-11-BK',  '10010', 'Chain Link Fabric 4ft 11ga Black Vinyl',   'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 2.15, 2.80, 30.23, '11', 4,    50, 'Black',  'Vinyl Coated','chain_link', 'Residential decorative'),
('CL-FABRIC-5-11-BK',  '10011', 'Chain Link Fabric 5ft 11ga Black Vinyl',   'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 2.60, 3.38, 30.00, '11', 5,    50, 'Black',  'Vinyl Coated','chain_link', 'Residential decorative'),
('CL-FABRIC-6-11-BK',  '10012', 'Chain Link Fabric 6ft 11ga Black Vinyl',   'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 3.10, 4.03, 30.00, '11', 6,    50, 'Black',  'Vinyl Coated','chain_link', 'Residential decorative'),
('CL-FABRIC-6-9-BK',   '10013', 'Chain Link Fabric 6ft 9ga Black Vinyl',    'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 3.85, 5.00, 29.87, '9',  6,    50, 'Black',  'Vinyl Coated','chain_link', 'Commercial decorative'),
('CL-FABRIC-8-9-BK',   '10014', 'Chain Link Fabric 8ft 9ga Black Vinyl',    'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 5.10, 6.63, 30.00, '9',  8,    50, 'Black',  'Vinyl Coated','chain_link', 'Commercial decorative'),
('CL-FABRIC-4-11-GN',  '10015', 'Chain Link Fabric 4ft 11ga Green Vinyl',   'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 2.15, 2.80, 30.23, '11', 4,    50, 'Green',  'Vinyl Coated','chain_link', 'Residential decorative'),
('CL-FABRIC-5-11-GN',  '10016', 'Chain Link Fabric 5ft 11ga Green Vinyl',   'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 2.60, 3.38, 30.00, '11', 5,    50, 'Green',  'Vinyl Coated','chain_link', 'Residential decorative'),
('CL-FABRIC-6-11-GN',  '10017', 'Chain Link Fabric 6ft 11ga Green Vinyl',   'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 3.10, 4.03, 30.00, '11', 6,    50, 'Green',  'Vinyl Coated','chain_link', 'Residential decorative'),

-- Chain Link Line Posts (galvanized)
('CL-POST-L-158-4',    '20001', 'Line Post 1-5/8" x 4ft Galvanized',        'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 4.20, 5.46, 30.00, NULL, 4, NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-POST-L-158-5',    '20002', 'Line Post 1-5/8" x 5ft Galvanized',        'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 5.10, 6.63, 30.00, NULL, 5, NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-POST-L-158-6',    '20003', 'Line Post 1-5/8" x 6ft Galvanized',        'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 6.00, 7.80, 30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-POST-L-158-8',    '20004', 'Line Post 1-5/8" x 8ft Galvanized',        'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 7.80, 10.14,30.00, NULL, 8, NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-POST-L-158-10',   '20005', 'Line Post 1-5/8" x 10ft Galvanized',       'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 9.60, 12.48,30.00, NULL, 10,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-POST-L-2-5',      '20006', 'Line Post 2" x 5ft Galvanized',            'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 7.50, 9.75, 30.00, NULL, 5, NULL, 'Silver', 'Galvanized', 'chain_link', 'Commercial grade'),
('CL-POST-L-2-6',      '20007', 'Line Post 2" x 6ft Galvanized',            'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 8.80, 11.44,30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', 'Commercial grade'),
('CL-POST-L-2-8',      '20008', 'Line Post 2" x 8ft Galvanized',            'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 11.50,14.95,30.00, NULL, 8, NULL, 'Silver', 'Galvanized', 'chain_link', 'Commercial grade'),
('CL-POST-L-2-10',     '20009', 'Line Post 2" x 10ft Galvanized',           'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 14.00,18.20,30.00, NULL, 10,NULL, 'Silver', 'Galvanized', 'chain_link', 'Commercial grade'),
('CL-POST-L-212-6',    '20010', 'Line Post 2-1/2" x 6ft Galvanized',        'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 12.50,16.25,30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', 'Industrial grade'),
('CL-POST-L-212-8',    '20011', 'Line Post 2-1/2" x 8ft Galvanized',        'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 16.00,20.80,30.00, NULL, 8, NULL, 'Silver', 'Galvanized', 'chain_link', 'Industrial grade'),
('CL-POST-L-212-10',   '20012', 'Line Post 2-1/2" x 10ft Galvanized',       'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 19.50,25.35,30.00, NULL, 10,NULL, 'Silver', 'Galvanized', 'chain_link', 'Industrial grade'),
('CL-POST-L-3-8',      '20013', 'Line Post 3" x 8ft Galvanized',            'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 22.00,28.60,30.00, NULL, 8, NULL, 'Silver', 'Galvanized', 'chain_link', 'Heavy industrial'),
('CL-POST-L-3-10',     '20014', 'Line Post 3" x 10ft Galvanized',           'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 27.50,35.75,30.00, NULL, 10,NULL, 'Silver', 'Galvanized', 'chain_link', 'Heavy industrial'),

-- Chain Link Terminal/End/Corner Posts
('CL-POST-T-2-5',      '20020', 'Terminal Post 2" x 5ft Galvanized',        'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 9.00, 11.70,30.00, NULL, 5, NULL, 'Silver', 'Galvanized', 'chain_link', 'End/corner/gate post'),
('CL-POST-T-2-6',      '20021', 'Terminal Post 2" x 6ft Galvanized',        'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 10.50,13.65,30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', 'End/corner/gate post'),
('CL-POST-T-2-8',      '20022', 'Terminal Post 2" x 8ft Galvanized',        'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 13.50,17.55,30.00, NULL, 8, NULL, 'Silver', 'Galvanized', 'chain_link', 'End/corner/gate post'),
('CL-POST-T-212-6',    '20023', 'Terminal Post 2-1/2" x 6ft Galvanized',    'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 15.00,19.50,30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-POST-T-212-8',    '20024', 'Terminal Post 2-1/2" x 8ft Galvanized',    'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 19.00,24.70,30.00, NULL, 8, NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-POST-T-3-8',      '20025', 'Terminal Post 3" x 8ft Galvanized',        'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 26.00,33.80,30.00, NULL, 8, NULL, 'Silver', 'Galvanized', 'chain_link', 'Industrial'),
('CL-POST-T-4-8',      '20026', 'Terminal Post 4" x 8ft Galvanized',        'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 38.00,49.40,30.00, NULL, 8, NULL, 'Silver', 'Galvanized', 'chain_link', 'Heavy industrial'),

-- Black vinyl coated posts
('CL-POST-L-158-6-BK', '20030', 'Line Post 1-5/8" x 6ft Black Vinyl',       'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 8.50, 11.05,30.00, NULL, 6, NULL, 'Black',  'Vinyl Coated','chain_link', NULL),
('CL-POST-L-2-6-BK',   '20031', 'Line Post 2" x 6ft Black Vinyl',           'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 11.00,14.30,30.00, NULL, 6, NULL, 'Black',  'Vinyl Coated','chain_link', NULL),
('CL-POST-T-2-6-BK',   '20032', 'Terminal Post 2" x 6ft Black Vinyl',       'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 13.00,16.90,30.00, NULL, 6, NULL, 'Black',  'Vinyl Coated','chain_link', NULL),
('CL-POST-T-212-8-BK', '20033', 'Terminal Post 2-1/2" x 8ft Black Vinyl',   'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 22.00,28.60,30.00, NULL, 8, NULL, 'Black',  'Vinyl Coated','chain_link', NULL),

-- Chain Link Top Rails
('CL-RAIL-158-21',     '20040', 'Top Rail 1-5/8" x 21ft Galvanized',        'Chain Link', 'Rails', 'Chain Link Fence', 'EA', 7.80, 10.14,30.00, NULL, NULL,21,  'Silver', 'Galvanized', 'chain_link', NULL),
('CL-RAIL-158-21-BK',  '20041', 'Top Rail 1-5/8" x 21ft Black Vinyl',       'Chain Link', 'Rails', 'Chain Link Fence', 'EA', 10.50,13.65,30.00, NULL, NULL,21,  'Black',  'Vinyl Coated','chain_link', NULL),
('CL-RAIL-2-21',       '20042', 'Top Rail 2" x 21ft Galvanized',            'Chain Link', 'Rails', 'Chain Link Fence', 'EA', 11.00,14.30,30.00, NULL, NULL,21,  'Silver', 'Galvanized', 'chain_link', 'Commercial'),
('CL-RAIL-212-21',     '20043', 'Top Rail 2-1/2" x 21ft Galvanized',        'Chain Link', 'Rails', 'Chain Link Fence', 'EA', 16.00,20.80,30.00, NULL, NULL,21,  'Silver', 'Galvanized', 'chain_link', 'Industrial'),

-- Chain Link Hardware / Fittings
('CL-HW-BRACE-158',    '20050', 'Brace Band 1-5/8" Galvanized (10pk)',      'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 2.50, 3.25, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-BRACE-2',      '20051', 'Brace Band 2" Galvanized (10pk)',          'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 3.20, 4.16, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-BRACE-212',    '20052', 'Brace Band 2-1/2" Galvanized (10pk)',      'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 4.10, 5.33, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-BRACE-3',      '20053', 'Brace Band 3" Galvanized (10pk)',          'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 5.50, 7.15, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-RAIL-CUP-158', '20054', 'Rail Cup 1-5/8" Galvanized (10pk)',        'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 2.20, 2.86, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-RAIL-CUP-2',   '20055', 'Rail Cup 2" Galvanized (10pk)',            'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 2.80, 3.64, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-RAIL-END-158', '20056', 'Rail End 1-5/8" Galvanized (10pk)',        'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 2.00, 2.60, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-RAIL-END-2',   '20057', 'Rail End 2" Galvanized (10pk)',            'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 2.50, 3.25, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-TIE-9',        '20058', 'Tie Wire 9 Gauge (100 pack)',              'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 4.50, 5.85, 30.00, '9',  NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-TIE-11',       '20059', 'Tie Wire 11 Gauge (100 pack)',             'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 3.80, 4.94, 30.00, '11', NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-TENSION-9',    '20060', 'Tension Wire 9 Gauge (per ft)',            'Chain Link', 'Hardware', 'Commercial Fitting', 'LF', 0.18, 0.23, 27.78, '9',  NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-TENSION-12',   '20061', 'Tension Wire 12 Gauge (per ft)',           'Chain Link', 'Hardware', 'Commercial Fitting', 'LF', 0.12, 0.16, 33.33, '12', NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-TENSION-BAR',  '20062', 'Tension Bar 48" Galvanized',              'Chain Link', 'Hardware', 'Commercial Fitting', 'EA', 1.80, 2.34, 30.00, NULL, 4,   NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-TENSION-BAR-6','20063', 'Tension Bar 72" Galvanized',              'Chain Link', 'Hardware', 'Commercial Fitting', 'EA', 2.50, 3.25, 30.00, NULL, 6,   NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-HINGE-158',    '20064', 'Offset Hinge 1-5/8" x 1-5/8" Galvanized','Chain Link', 'Hardware', 'Commercial Fitting', 'PR', 8.50, 11.05,30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-HINGE-2-158',  '20065', 'Offset Hinge 2" x 1-5/8" Galvanized',    'Chain Link', 'Hardware', 'Commercial Fitting', 'PR', 9.50, 12.35,30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-HINGE-2-2',    '20066', 'Offset Hinge 2" x 2" Galvanized',        'Chain Link', 'Hardware', 'Commercial Fitting', 'PR', 10.50,13.65,30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-HINGE-3-2',    '20067', 'Offset Hinge 3" x 2" Galvanized',        'Chain Link', 'Hardware', 'Commercial Fitting', 'PR', 14.00,18.20,30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-LATCH-STD',    '20068', 'Fork Latch Standard Galvanized',          'Chain Link', 'Hardware', 'Commercial Fitting', 'EA', 5.50, 7.15, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-LATCH-PUL',    '20069', 'Pull Latch Galvanized',                   'Chain Link', 'Hardware', 'Commercial Fitting', 'EA', 7.00, 9.10, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-LATCH-KENNEL', '20070', 'Kennel Latch Galvanized',                 'Chain Link', 'Hardware', 'Commercial Fitting', 'EA', 9.00, 11.70,30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-CASTER-3',     '20071', 'Gate Caster Wheel 3" Rolling Gate',       'Chain Link', 'Hardware', 'Commercial Fitting', 'EA', 22.00,28.60,30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-CASTER-5',     '20072', 'Gate Caster Wheel 5" Rolling Gate',       'Chain Link', 'Hardware', 'Commercial Fitting', 'EA', 35.00,45.50,30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-POST-CAP',     '20073', 'Post Cap 1-5/8" (10pk)',                  'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 1.80, 2.34, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-POST-CAP-2',   '20074', 'Post Cap 2" (10pk)',                      'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 2.40, 3.12, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-POST-CAP-LOOP','20075', 'Loop Cap 1-5/8" Barbed Wire Arm (10pk)', 'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 3.50, 4.55, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-FORK-EAR',     '20076', 'Fork Ear 1-5/8" (10pk)',                  'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 2.60, 3.38, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-FORK-EAR-2',   '20077', 'Fork Ear 2" (10pk)',                      'Chain Link', 'Hardware', 'Commercial Fitting', 'PK', 3.30, 4.29, 30.00, NULL, NULL,NULL, 'Silver', 'Galvanized', 'chain_link', NULL),
('CL-HW-STRETCHER-BAR','20078', 'Fence Stretcher Bar (aluminum)',          'Chain Link', 'Tools',    'Commercial Fitting', 'EA', 45.00,58.50,30.00, NULL, NULL,NULL, 'Silver', NULL,          'chain_link', 'Install tool'),
('CL-HW-PULLER',        '20079', 'Come-Along Fence Puller 2-ton',          'Chain Link', 'Tools',    'Commercial Fitting', 'EA', 68.00,88.40,30.00, NULL, NULL,NULL, 'Silver', NULL,          'chain_link', 'Install tool'),

-- Chain Link Barbed Wire
('CL-BARB-2PT-12',     '20090', 'Barbed Wire 2-point 12.5ga 1320ft Roll', 'Chain Link', 'Barbed Wire','Chain Link Fence','RL', 52.00,67.60,30.00, '12.5',NULL,1320,'Silver','Galvanized', 'chain_link', 'Standard security'),
('CL-BARB-4PT-12',     '20091', 'Barbed Wire 4-point 12.5ga 1320ft Roll', 'Chain Link', 'Barbed Wire','Chain Link Fence','RL', 62.00,80.60,30.00, '12.5',NULL,1320,'Silver','Galvanized', 'chain_link', 'High security'),
('CL-BARB-ARM-STRAIGHT','20092','Barbed Wire Arm Straight Galvanized',    'Chain Link', 'Barbed Wire','Chain Link Fence','EA', 4.50, 5.85, 30.00, NULL, NULL,NULL, 'Silver','Galvanized', 'chain_link', NULL),
('CL-BARB-ARM-45',     '20093', 'Barbed Wire Arm 45-degree Galvanized',   'Chain Link', 'Barbed Wire','Chain Link Fence','EA', 5.00, 6.50, 30.00, NULL, NULL,NULL, 'Silver','Galvanized', 'chain_link', NULL),
('CL-BARB-ARM-V',      '20094', 'Barbed Wire Arm V-shape (6-strand)',      'Chain Link', 'Barbed Wire','Chain Link Fence','EA', 8.00, 10.40,30.00, NULL, NULL,NULL, 'Silver','Galvanized', 'chain_link', NULL),

-- Chain Link Gates
('CL-GATE-SGL-4-4',    '20100', 'Single Walk Gate 4ft W x 4ft H Galv',    'Chain Link', 'Gates', 'Chain Link Fence', 'EA', 65.00, 84.50, 30.00, NULL, 4, NULL, 'Silver', 'Galvanized', 'chain_link', 'Pre-assembled'),
('CL-GATE-SGL-4-5',    '20101', 'Single Walk Gate 4ft W x 5ft H Galv',    'Chain Link', 'Gates', 'Chain Link Fence', 'EA', 75.00, 97.50, 30.00, NULL, 5, NULL, 'Silver', 'Galvanized', 'chain_link', 'Pre-assembled'),
('CL-GATE-SGL-4-6',    '20102', 'Single Walk Gate 4ft W x 6ft H Galv',    'Chain Link', 'Gates', 'Chain Link Fence', 'EA', 85.00,110.50, 30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', 'Pre-assembled'),
('CL-GATE-SGL-5-5',    '20103', 'Single Walk Gate 5ft W x 5ft H Galv',    'Chain Link', 'Gates', 'Chain Link Fence', 'EA', 90.00,117.00, 30.00, NULL, 5, NULL, 'Silver', 'Galvanized', 'chain_link', 'Pre-assembled'),
('CL-GATE-SGL-5-6',    '20104', 'Single Walk Gate 5ft W x 6ft H Galv',    'Chain Link', 'Gates', 'Chain Link Fence', 'EA',100.00,130.00, 30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', 'Pre-assembled'),
('CL-GATE-SGL-6-6',    '20105', 'Single Walk Gate 6ft W x 6ft H Galv',    'Chain Link', 'Gates', 'Chain Link Fence', 'EA',115.00,149.50, 30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', 'Pre-assembled'),
('CL-GATE-DBL-12-6',   '20106', 'Double Drive Gate 12ft W x 6ft H Galv',  'Chain Link', 'Gates', 'Chain Link Fence', 'EA',220.00,286.00, 30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', 'Two 6ft panels'),
('CL-GATE-DBL-16-6',   '20107', 'Double Drive Gate 16ft W x 6ft H Galv',  'Chain Link', 'Gates', 'Chain Link Fence', 'EA',280.00,364.00, 30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', 'Two 8ft panels'),
('CL-GATE-DBL-20-6',   '20108', 'Double Drive Gate 20ft W x 6ft H Galv',  'Chain Link', 'Gates', 'Chain Link Fence', 'EA',340.00,442.00, 30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', 'Two 10ft panels'),
('CL-GATE-SLD-12-6',   '20109', 'Slide Gate Cantilever 12ft x 6ft Galv',  'Chain Link', 'Gates', 'Chain Link Fence', 'EA',650.00,845.00, 30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', 'Commercial slide gate'),
('CL-GATE-SLD-20-6',   '20110', 'Slide Gate Cantilever 20ft x 6ft Galv',  'Chain Link', 'Gates', 'Chain Link Fence', 'EA',950.00,1235.00,30.00, NULL, 6, NULL, 'Silver', 'Galvanized', 'chain_link', 'Commercial slide gate'),

-- ============================================================
-- MATERIALS - WOOD PRIVACY FENCE
-- ============================================================
('WD-PICKET-6-DOG',    '30001', 'Dog-ear Cedar Picket 1x6x6ft',            'Wood', 'Pickets', 'Wood Fence', 'EA', 2.85, 3.70, 29.82, NULL, 6, 6,   'Natural','None',        'wood_privacy', 'Western red cedar'),
('WD-PICKET-8-DOG',    '30002', 'Dog-ear Cedar Picket 1x6x8ft',            'Wood', 'Pickets', 'Wood Fence', 'EA', 3.60, 4.68, 30.00, NULL, 8, 6,   'Natural','None',        'wood_privacy', 'Western red cedar'),
('WD-PICKET-6-FLAT',   '30003', 'Flat Top Cedar Picket 1x6x6ft',           'Wood', 'Pickets', 'Wood Fence', 'EA', 2.90, 3.77, 30.00, NULL, 6, 6,   'Natural','None',        'wood_privacy', 'Western red cedar'),
('WD-PICKET-8-FLAT',   '30004', 'Flat Top Cedar Picket 1x6x8ft',           'Wood', 'Pickets', 'Wood Fence', 'EA', 3.65, 4.74, 29.86, NULL, 8, 6,   'Natural','None',        'wood_privacy', 'Western red cedar'),
('WD-PICKET-6-PT',     '30005', 'Pointed Top Cedar Picket 1x4x6ft',        'Wood', 'Pickets', 'Wood Fence', 'EA', 2.10, 2.73, 30.00, NULL, 6, 4,   'Natural','None',        'wood_privacy', 'Classic picket look'),
('WD-PICKET-SYP-6',    '30006', 'Dog-ear SYP Picket 1x6x6ft',              'Wood', 'Pickets', 'Wood Fence', 'EA', 1.95, 2.54, 30.26, NULL, 6, 6,   'Natural','Pressure Treat','wood_privacy','Southern Yellow Pine PT'),
('WD-PICKET-SYP-8',    '30007', 'Dog-ear SYP Picket 1x6x8ft',              'Wood', 'Pickets', 'Wood Fence', 'EA', 2.50, 3.25, 30.00, NULL, 8, 6,   'Natural','Pressure Treat','wood_privacy','Southern Yellow Pine PT'),

-- Wood fence rails
('WD-RAIL-2X4-8',      '30010', 'Fence Rail 2x4x8ft Cedar',                'Wood', 'Rails', 'Wood Fence', 'EA', 5.20, 6.76, 30.00, NULL, NULL,8,   'Natural','None',        'wood_privacy', NULL),
('WD-RAIL-2X4-16',     '30011', 'Fence Rail 2x4x16ft Cedar',               'Wood', 'Rails', 'Wood Fence', 'EA', 9.80, 12.74,30.00, NULL, NULL,16,  'Natural','None',        'wood_privacy', NULL),
('WD-RAIL-2X4-8-SYP',  '30012', 'Fence Rail 2x4x8ft SYP Pressure Treated', 'Wood','Rails', 'Wood Fence', 'EA', 3.80, 4.94, 30.00, NULL, NULL,8,   'Natural','Pressure Treat','wood_privacy',NULL),
('WD-RAIL-2X4-16-SYP', '30013', 'Fence Rail 2x4x16ft SYP Pressure Treated','Wood','Rails', 'Wood Fence', 'EA', 7.20, 9.36, 30.00, NULL, NULL,16,  'Natural','Pressure Treat','wood_privacy',NULL),
('WD-RAIL-2X6-8',      '30014', 'Fence Rail 2x6x8ft Cedar',                'Wood', 'Rails', 'Wood Fence', 'EA', 7.50, 9.75, 30.00, NULL, NULL,8,   'Natural','None',        'wood_privacy', NULL),

-- Wood fence posts
('WD-POST-4X4-8',      '30020', 'Fence Post 4x4x8ft Cedar',                'Wood', 'Posts', 'Wood Fence', 'EA', 12.50,16.25,30.00, NULL, 8,  NULL, 'Natural','None',        'wood_privacy', NULL),
('WD-POST-4X4-10',     '30021', 'Fence Post 4x4x10ft Cedar',               'Wood', 'Posts', 'Wood Fence', 'EA', 15.50,20.15,30.00, NULL, 10, NULL, 'Natural','None',        'wood_privacy', NULL),
('WD-POST-4X4-8-SYP',  '30022', 'Fence Post 4x4x8ft SYP Pressure Treated', 'Wood','Posts', 'Wood Fence', 'EA', 8.50, 11.05,30.00, NULL, 8,  NULL, 'Natural','Pressure Treat','wood_privacy',NULL),
('WD-POST-4X4-10-SYP', '30023', 'Fence Post 4x4x10ft SYP Pressure Treated','Wood','Posts', 'Wood Fence', 'EA',10.50, 13.65,30.00, NULL, 10, NULL, 'Natural','Pressure Treat','wood_privacy',NULL),
('WD-POST-6X6-8',      '30024', 'Fence Post 6x6x8ft Cedar',                'Wood', 'Posts', 'Wood Fence', 'EA', 28.00,36.40,30.00, NULL, 8,  NULL, 'Natural','None',        'wood_privacy', NULL),
('WD-POST-6X6-8-SYP',  '30025', 'Fence Post 6x6x8ft SYP Pressure Treated', 'Wood','Posts', 'Wood Fence', 'EA',18.00, 23.40,30.00, NULL, 8,  NULL, 'Natural','Pressure Treat','wood_privacy',NULL),

-- Wood fence hardware
('WD-HW-NAIL-16D',     '30030', 'Ring Shank Nail 16d 5lb Box',             'Wood', 'Hardware', 'Wood Fence', 'BX', 7.50, 9.75, 30.00, NULL, NULL,NULL, 'Silver','None',       'wood_privacy', NULL),
('WD-HW-SCREW-3',      '30031', 'Exterior Deck Screw 3" #10 (100pk)',       'Wood', 'Hardware', 'Wood Fence', 'PK', 6.50, 8.45, 30.00, NULL, NULL,NULL, 'Silver','None',       'wood_privacy', NULL),
('WD-HW-BRACKET-L',    '30032', 'L-Bracket Galvanized (10pk)',              'Wood', 'Hardware', 'Wood Fence', 'PK', 8.00, 10.40,30.00, NULL, NULL,NULL, 'Silver','Galvanized', 'wood_privacy', NULL),
('WD-HW-POST-SET',     '30033', 'Concrete Post Setting Mix 50lb',           'Wood', 'Hardware', 'Wood Fence', 'BG', 5.50, 7.15, 30.00, NULL, NULL,NULL, 'Gray', 'None',       'wood_privacy', 'Fast-setting concrete'),
('WD-HW-POST-BASE',    '30034', 'Metal Post Base Anchor 4x4 (4pk)',         'Wood', 'Hardware', 'Wood Fence', 'PK',14.00,18.20,30.00, NULL, NULL,NULL, 'Silver','Galvanized', 'wood_privacy', NULL),
('WD-HW-STAIN-GAL',    '30035', 'Semi-Transparent Wood Stain 1 gallon',    'Wood', 'Finish',   'Wood Fence', 'GL', 28.00,36.40,30.00, NULL, NULL,NULL, 'Cedar','None',        'wood_privacy', 'Covers ~200 sqft/gal'),
('WD-HW-SEALER-GAL',   '30036', 'Water Repellent Fence Sealer 1 gallon',   'Wood', 'Finish',   'Wood Fence', 'GL', 24.00,31.20,30.00, NULL, NULL,NULL, 'Clear','None',        'wood_privacy', NULL),

-- Wood fence gates
('WD-GATE-SGL-4-6',    '30040', 'Single Wood Gate 4ft W x 6ft H Cedar',    'Wood', 'Gates', 'Wood Fence', 'EA',145.00,188.50,30.00, NULL, 6,  NULL, 'Natural','None',       'wood_privacy', 'Pre-built cedar'),
('WD-GATE-SGL-5-6',    '30041', 'Single Wood Gate 5ft W x 6ft H Cedar',    'Wood', 'Gates', 'Wood Fence', 'EA',170.00,221.00,30.00, NULL, 6,  NULL, 'Natural','None',       'wood_privacy', 'Pre-built cedar'),
('WD-GATE-DBL-10-6',   '30042', 'Double Wood Gate 10ft W x 6ft H Cedar',   'Wood', 'Gates', 'Wood Fence', 'EA',320.00,416.00,30.00, NULL, 6,  NULL, 'Natural','None',       'wood_privacy', NULL),
('WD-GATE-HW-HINGE',   '30043', 'Heavy Duty Gate Hinge 4" (pair)',          'Wood', 'Hardware','Wood Fence', 'PR', 12.00,15.60,30.00, NULL, NULL,NULL, 'Black','Powder Coat','wood_privacy', NULL),
('WD-GATE-HW-LATCH',   '30044', 'Cane Bolt Gate Latch Kit',                'Wood', 'Hardware','Wood Fence', 'EA', 18.00,23.40,30.00, NULL, NULL,NULL, 'Black','Powder Coat','wood_privacy', NULL),
('WD-GATE-HW-SPRING',  '30045', 'Gate Spring Closer Heavy Duty',           'Wood', 'Hardware','Wood Fence', 'EA', 22.00,28.60,30.00, NULL, NULL,NULL, 'Black','None',        'wood_privacy', NULL),

-- ============================================================
-- MATERIALS - VINYL / PVC FENCE
-- ============================================================
('VN-PANEL-6X8-WHT',   '40001', 'Vinyl Privacy Panel 6ft H x 8ft W White', 'Vinyl', 'Panels', 'Vinyl Fence', 'EA', 58.00, 75.40, 30.00, NULL, 6, 8, 'White','PVC',          'vinyl', NULL),
('VN-PANEL-6X8-TAN',   '40002', 'Vinyl Privacy Panel 6ft H x 8ft W Tan',   'Vinyl', 'Panels', 'Vinyl Fence', 'EA', 62.00, 80.60, 30.00, NULL, 6, 8, 'Tan',  'PVC',          'vinyl', NULL),
('VN-PANEL-4X8-WHT',   '40003', 'Vinyl Semi-Privacy Panel 4ft H x 8ft W',  'Vinyl', 'Panels', 'Vinyl Fence', 'EA', 42.00, 54.60, 30.00, NULL, 4, 8, 'White','PVC',          'vinyl', NULL),
('VN-POST-4X4-72',     '40010', 'Vinyl Post 4x4 x 72" White',               'Vinyl', 'Posts',  'Vinyl Fence', 'EA', 22.00, 28.60, 30.00, NULL, 6, NULL,'White','PVC',         'vinyl', NULL),
('VN-POST-4X4-96',     '40011', 'Vinyl Post 4x4 x 96" White',               'Vinyl', 'Posts',  'Vinyl Fence', 'EA', 28.00, 36.40, 30.00, NULL, 8, NULL,'White','PVC',         'vinyl', NULL),
('VN-POST-5X5-72',     '40012', 'Vinyl Post 5x5 x 72" White',               'Vinyl', 'Posts',  'Vinyl Fence', 'EA', 35.00, 45.50, 30.00, NULL, 6, NULL,'White','PVC',         'vinyl', NULL),
('VN-POST-5X5-96',     '40013', 'Vinyl Post 5x5 x 96" White',               'Vinyl', 'Posts',  'Vinyl Fence', 'EA', 44.00, 57.20, 30.00, NULL, 8, NULL,'White','PVC',         'vinyl', NULL),
('VN-RAIL-1X5-96',     '40020', 'Vinyl Rail 1x5 x 96" White',               'Vinyl', 'Rails',  'Vinyl Fence', 'EA', 8.50,  11.05, 30.00, NULL, NULL,8, 'White','PVC',         'vinyl', NULL),
('VN-CAP-4X4-WHT',     '40030', 'Vinyl Post Cap 4x4 White',                 'Vinyl', 'Caps',   'Vinyl Fence', 'EA', 3.50,  4.55,  30.00, NULL, NULL,NULL,'White','PVC',        'vinyl', NULL),
('VN-CAP-5X5-WHT',     '40031', 'Vinyl Post Cap 5x5 White',                 'Vinyl', 'Caps',   'Vinyl Fence', 'EA', 5.00,  6.50,  30.00, NULL, NULL,NULL,'White','PVC',        'vinyl', NULL),
('VN-GATE-4-6-WHT',    '40040', 'Vinyl Single Gate 4ft W x 6ft H White',    'Vinyl', 'Gates',  'Vinyl Fence', 'EA',195.00,253.50, 30.00, NULL, 6, NULL,'White','PVC',         'vinyl', 'Pre-assembled'),
('VN-GATE-DBL-10-6',   '40041', 'Vinyl Double Gate 10ft W x 6ft H White',   'Vinyl', 'Gates',  'Vinyl Fence', 'EA',380.00,494.00, 30.00, NULL, 6, NULL,'White','PVC',         'vinyl', NULL),
('VN-HW-CONCRETE',     '40050', 'Vinyl Post Concrete 50lb Bag',             'Vinyl', 'Hardware','Vinyl Fence', 'BG', 5.50,  7.15,  30.00, NULL, NULL,NULL,'Gray','None',       'vinyl', NULL),

-- ============================================================
-- MATERIALS - WROUGHT IRON / ORNAMENTAL
-- ============================================================
('WI-PANEL-4-5-BK',    '50001', 'Wrought Iron Panel 4ft H x 5ft W Black',   'Ornamental','Panels','Ornamental Fence','EA',85.00,110.50, 30.00, NULL, 4, 5, 'Black','Powder Coat','ornamental', NULL),
('WI-PANEL-5-5-BK',    '50002', 'Wrought Iron Panel 5ft H x 5ft W Black',   'Ornamental','Panels','Ornamental Fence','EA',105.00,136.50,30.00, NULL, 5, 5, 'Black','Powder Coat','ornamental', NULL),
('WI-PANEL-6-5-BK',    '50003', 'Wrought Iron Panel 6ft H x 5ft W Black',   'Ornamental','Panels','Ornamental Fence','EA',125.00,162.50,30.00, NULL, 6, 5, 'Black','Powder Coat','ornamental', NULL),
('WI-POST-2-84',       '50010', 'Ornamental Iron Post 2" x 84" Black',       'Ornamental','Posts', 'Ornamental Fence','EA',38.00, 49.40, 30.00, NULL, 7, NULL,'Black','Powder Coat','ornamental', NULL),
('WI-POST-2-96',       '50011', 'Ornamental Iron Post 2" x 96" Black',       'Ornamental','Posts', 'Ornamental Fence','EA',44.00, 57.20, 30.00, NULL, 8, NULL,'Black','Powder Coat','ornamental', NULL),
('WI-GATE-3-5-BK',     '50020', 'Ornamental Gate 3ft W x 5ft H Black',       'Ornamental','Gates', 'Ornamental Fence','EA',185.00,240.50,30.00, NULL, 5, NULL,'Black','Powder Coat','ornamental', NULL),
('WI-GATE-4-5-BK',     '50021', 'Ornamental Gate 4ft W x 5ft H Black',       'Ornamental','Gates', 'Ornamental Fence','EA',220.00,286.00,30.00, NULL, 5, NULL,'Black','Powder Coat','ornamental', NULL),
('WI-GATE-DBL-12-6',   '50022', 'Ornamental Double Gate 12ft W x 6ft H',     'Ornamental','Gates', 'Ornamental Fence','EA',520.00,676.00,30.00, NULL, 6, NULL,'Black','Powder Coat','ornamental', NULL),
('WI-HW-HINGE-2',      '50030', 'Heavy Hinge 2" Ornamental Iron (pair)',      'Ornamental','Hardware','Ornamental Fence','PR',16.00, 20.80, 30.00, NULL, NULL,NULL,'Black','Powder Coat','ornamental', NULL),
('WI-HW-LATCH',        '50031', 'Thumb Latch Ornamental Iron',               'Ornamental','Hardware','Ornamental Fence','EA',22.00, 28.60, 30.00, NULL, NULL,NULL,'Black','Powder Coat','ornamental', NULL),

-- ============================================================
-- MATERIALS - ALUMINUM FENCE
-- ============================================================
('AL-PANEL-4-6-BK',    '60001', 'Aluminum Fence Panel 4ft H x 6ft W Black', 'Aluminum','Panels','Aluminum Fence','EA',72.00, 93.60, 30.00, NULL, 4, 6, 'Black','Powder Coat','aluminum', NULL),
('AL-PANEL-5-6-BK',    '60002', 'Aluminum Fence Panel 5ft H x 6ft W Black', 'Aluminum','Panels','Aluminum Fence','EA',88.00,114.40, 30.00, NULL, 5, 6, 'Black','Powder Coat','aluminum', NULL),
('AL-PANEL-4-6-WHT',   '60003', 'Aluminum Fence Panel 4ft H x 6ft W White', 'Aluminum','Panels','Aluminum Fence','EA',72.00, 93.60, 30.00, NULL, 4, 6, 'White','Powder Coat','aluminum', NULL),
('AL-POST-2-96-BK',    '60010', 'Aluminum Post 2" x 96" Black',              'Aluminum','Posts', 'Aluminum Fence','EA',28.00, 36.40, 30.00, NULL, 8, NULL,'Black','Powder Coat','aluminum', NULL),
('AL-POST-2-96-WHT',   '60011', 'Aluminum Post 2" x 96" White',              'Aluminum','Posts', 'Aluminum Fence','EA',28.00, 36.40, 30.00, NULL, 8, NULL,'White','Powder Coat','aluminum', NULL),
('AL-GATE-4-4-BK',     '60020', 'Aluminum Single Gate 4ft W x 4ft H Black',  'Aluminum','Gates', 'Aluminum Fence','EA',155.00,201.50,30.00, NULL, 4, NULL,'Black','Powder Coat','aluminum', NULL),
('AL-GATE-4-5-BK',     '60021', 'Aluminum Single Gate 4ft W x 5ft H Black',  'Aluminum','Gates', 'Aluminum Fence','EA',175.00,227.50,30.00, NULL, 5, NULL,'Black','Powder Coat','aluminum', NULL),

-- ============================================================
-- MATERIALS - CONCRETE & INSTALLATION SUPPLIES
-- ============================================================
('INST-CONCRETE-60',   '70001', 'QuikCrete Concrete Mix 60lb Bag',           'Installation','Concrete','Installation Supplies','BG', 4.80,  6.24, 30.00, NULL,NULL,NULL,'Gray','None','all',         'Standard post setting'),
('INST-CONCRETE-80',   '70002', 'QuikCrete Concrete Mix 80lb Bag',           'Installation','Concrete','Installation Supplies','BG', 6.00,  7.80, 30.00, NULL,NULL,NULL,'Gray','None','all',         'Standard post setting'),
('INST-CONCRETE-FAST', '70003', 'Fast-Setting Concrete Mix 50lb Bag',        'Installation','Concrete','Installation Supplies','BG', 7.50,  9.75, 30.00, NULL,NULL,NULL,'Gray','None','all',         'Sets in 20-40 minutes'),
('INST-GRAVEL-5GAL',   '70004', 'Pea Gravel 5 Gallon Bag',                   'Installation','Aggregate','Installation Supplies','BG', 4.50,  5.85, 30.00, NULL,NULL,NULL,'Gray','None','all',         'Post hole drainage'),
('INST-FOAM-SPIKE',    '70005', 'Spiked Foam Post Setting (32oz)',            'Installation','Concrete','Installation Supplies','EA', 12.00, 15.60, 30.00, NULL,NULL,NULL,'None','None','all',         'No-dig post setting'),
('INST-FOAM-STD',      '70006', 'Fence Post Setting Foam Standard (32oz)',    'Installation','Concrete','Installation Supplies','EA', 9.50,  12.35,30.00, NULL,NULL,NULL,'None','None','all',         NULL),
('INST-SLEEVE-4X4',    '70007', 'Post Sleeve Ground Anchor 4x4',             'Installation','Anchors','Installation Supplies', 'EA', 7.50,  9.75, 30.00, NULL,NULL,NULL,'Silver','Galvanized','all', NULL),

-- ============================================================
-- MATERIALS - PRIVACY SLATS (for chain link)
-- ============================================================
('SL-VERT-6-BK',       '80001', 'Vertical Privacy Slat 6ft Black (50pk)',    'Slats','Privacy','Chain Link Fence','PK', 32.00, 41.60, 30.00, NULL, 6,NULL,'Black','HDPE','chain_link',            'High-density polyethylene'),
('SL-VERT-6-GN',       '80002', 'Vertical Privacy Slat 6ft Green (50pk)',    'Slats','Privacy','Chain Link Fence','PK', 32.00, 41.60, 30.00, NULL, 6,NULL,'Green','HDPE','chain_link',            NULL),
('SL-VERT-6-TN',       '80003', 'Vertical Privacy Slat 6ft Tan (50pk)',      'Slats','Privacy','Chain Link Fence','PK', 32.00, 41.60, 30.00, NULL, 6,NULL,'Tan',  'HDPE','chain_link',            NULL),
('SL-VERT-4-BK',       '80004', 'Vertical Privacy Slat 4ft Black (50pk)',    'Slats','Privacy','Chain Link Fence','PK', 24.00, 31.20, 30.00, NULL, 4,NULL,'Black','HDPE','chain_link',            NULL),
('SL-WEAVE-6-BK',      '80005', 'Weave Privacy Slat 6ft Black (100pk)',      'Slats','Privacy','Chain Link Fence','PK', 48.00, 62.40, 30.00, NULL, 6,NULL,'Black','HDPE','chain_link',            NULL),
('SL-WEAVE-6-GN',      '80006', 'Weave Privacy Slat 6ft Green (100pk)',      'Slats','Privacy','Chain Link Fence','PK', 48.00, 62.40, 30.00, NULL, 6,NULL,'Green','HDPE','chain_link',            NULL),

-- ============================================================
-- MATERIALS - SECURITY / SPECIALTY
-- ============================================================
('SEC-RAZOR-SINGLE',   '90001', 'Razor Wire Coil Single Coil 25m',           'Security','Razor Wire','Security Fence','RL',42.00, 54.60, 30.00, NULL,NULL,82,  'Silver','Galvanized','security',   NULL),
('SEC-RAZOR-FLAT',     '90002', 'Flat Razor Wire 18" Width (per 50ft)',       'Security','Razor Wire','Security Fence','RL',35.00, 45.50, 30.00, NULL,NULL,50,  'Silver','Galvanized','security',   NULL),
('SEC-ELEC-CHARGER',   '90003', 'Electric Fence Charger Solar 5-acre',       'Security','Electric','Security Fence', 'EA',185.00,240.50,30.00, NULL,NULL,NULL,'Yellow','None',    'security',   NULL),
('SEC-ELEC-CHARGER-AC','90004', 'Electric Fence Charger AC 25-mile',         'Security','Electric','Security Fence', 'EA',220.00,286.00,30.00, NULL,NULL,NULL,'Gray', 'None',    'security',   NULL),
('SEC-ELEC-WIRE',      '90005', 'High Tensile Electric Fence Wire 17ga 1/4mi','Security','Electric','Security Fence','RL',32.00, 41.60, 30.00, '17',NULL,1320,'Silver','None',    'security',   NULL),
('SEC-ELEC-INSULATOR', '90006', 'Electric Fence Insulator Wood Post (25pk)', 'Security','Electric','Security Fence', 'PK',6.50,  8.45, 30.00, NULL,NULL,NULL,'White','HDPE',   'security',   NULL),

-- ============================================================
-- MATERIALS - TOOLS & EQUIPMENT (sell/rent)
-- ============================================================
('TOOL-DIGGER-MANUAL', '95001', 'Manual Post Hole Digger 2-person',          'Tools','Digging','Tools & Equipment','EA',38.00, 49.40, 30.00, NULL,NULL,NULL,'Silver','None','all',          NULL),
('TOOL-DIGGER-POWER',  '95002', 'Powered Post Hole Digger 2-person 8"',      'Tools','Digging','Tools & Equipment','EA',280.00,364.00,30.00, NULL,NULL,NULL,'Orange','None','all',         NULL),
('TOOL-STRETCHER',     '95003', 'Fence Fabric Stretcher Bar Kit',            'Tools','Tensioning','Tools & Equipment','EA',52.00, 67.60, 30.00, NULL,NULL,NULL,'Silver','None','chain_link',  NULL),
('TOOL-PULLER-2T',     '95004', 'Fence Come-Along Puller 2-ton',             'Tools','Tensioning','Tools & Equipment','EA',72.00, 93.60, 30.00, NULL,NULL,NULL,'Red','None','chain_link',    NULL),
('TOOL-PLIERS-FENCE',  '95005', 'Fencing Pliers Multi-Tool',                 'Tools','Hand Tools','Tools & Equipment','EA',22.00, 28.60, 30.00, NULL,NULL,NULL,'Red','None','all',          NULL),
('TOOL-LEVEL-48',      '95006', 'Magnetic Level 48" Aluminum',               'Tools','Hand Tools','Tools & Equipment','EA',32.00, 41.60, 30.00, NULL,NULL,NULL,'Yellow','None','all',        NULL),
('TOOL-HAMMER-SLED',   '95007', 'Sledgehammer 8lb',                          'Tools','Hand Tools','Tools & Equipment','EA',28.00, 36.40, 30.00, NULL,NULL,NULL,'Red','None','all',           NULL),
('TOOL-DRIVER-IMPACT', '95008', 'Impact Driver 1/2" Drive 600ft-lb',         'Tools','Power Tools','Tools & Equipment','EA',180.00,234.00,30.00, NULL,NULL,NULL,'Yellow','None','all',       NULL),
('TOOL-TAMPER',        '95009', 'Tamper/Compactor Manual Steel Head 8lb',    'Tools','Hand Tools','Tools & Equipment','EA',35.00, 45.50, 30.00, NULL,NULL,NULL,'Silver','None','all',        NULL),
('TOOL-STRING-LINE',   '95010', 'Mason String Line 500ft (fluorescent)',      'Tools','Layout','Tools & Equipment','EA', 4.50,  5.85, 30.00, NULL,NULL,NULL,'Yellow','None','all',           NULL),

-- ============================================================
-- MATERIALS - ADDITIONAL CHAIN LINK (more SKUs for 950+ total)
-- ============================================================
('CL-POST-L-158-4-BK', '20035', 'Line Post 1-5/8" x 4ft Black Vinyl',       'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 6.80,  8.84, 30.00, NULL, 4, NULL, 'Black','Vinyl Coated','chain_link', NULL),
('CL-POST-L-158-5-BK', '20036', 'Line Post 1-5/8" x 5ft Black Vinyl',       'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 8.20, 10.66,30.00, NULL, 5, NULL, 'Black','Vinyl Coated','chain_link', NULL),
('CL-POST-L-2-4',      '20037', 'Line Post 2" x 4ft Galvanized',             'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 6.20,  8.06, 30.00, NULL, 4, NULL, 'Silver','Galvanized', 'chain_link', NULL),
('CL-POST-L-2-12',     '20038', 'Line Post 2" x 12ft Galvanized',            'Chain Link', 'Posts', 'Chain Link Fence', 'EA',16.50, 21.45,30.00, NULL,12, NULL, 'Silver','Galvanized', 'chain_link', NULL),
('CL-POST-T-158-5',    '20039', 'Terminal Post 1-5/8" x 5ft Galvanized',     'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 7.00,  9.10, 30.00, NULL, 5, NULL, 'Silver','Galvanized', 'chain_link', NULL),
('CL-POST-T-158-6',    '20040', 'Terminal Post 1-5/8" x 6ft Galvanized',     'Chain Link', 'Posts', 'Chain Link Fence', 'EA', 8.20, 10.66,30.00, NULL, 6, NULL, 'Silver','Galvanized', 'chain_link', NULL),
('CL-RAIL-2-21-BK',    '20045', 'Top Rail 2" x 21ft Black Vinyl',            'Chain Link', 'Rails', 'Chain Link Fence', 'EA',14.50, 18.85,30.00, NULL,NULL,21, 'Black','Vinyl Coated','chain_link', NULL),
('CL-RAIL-212-21-BK',  '20046', 'Top Rail 2-1/2" x 21ft Black Vinyl',        'Chain Link', 'Rails', 'Chain Link Fence', 'EA',20.00, 26.00,30.00, NULL,NULL,21, 'Black','Vinyl Coated','chain_link', NULL),
('CL-FABRIC-4-9-BK',   '10020', 'Chain Link Fabric 4ft 9ga Black Vinyl',     'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 2.85,  3.71, 30.18, '9',  4,  50, 'Black','Vinyl Coated','chain_link', NULL),
('CL-FABRIC-8-11-GV',  '10021', 'Chain Link Fabric 8ft 11ga Galvanized',     'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 2.88,  3.74, 29.86, '11', 8,  50, 'Silver','Galvanized', 'chain_link', NULL),
('CL-FABRIC-10-11-GV', '10022', 'Chain Link Fabric 10ft 11ga Galvanized',    'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 3.60,  4.68, 30.00, '11',10,  50, 'Silver','Galvanized', 'chain_link', NULL),
('CL-FABRIC-12-11-GV', '10023', 'Chain Link Fabric 12ft 11ga Galvanized',    'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 4.32,  5.62, 30.09, '11',12,  50, 'Silver','Galvanized', 'chain_link', NULL),
('CL-FABRIC-6-9-GN',   '10024', 'Chain Link Fabric 6ft 9ga Green Vinyl',     'Chain Link', 'Fabric', 'Chain Link Fence', 'LF', 3.85,  5.00, 29.87, '9',  6,  50, 'Green','Vinyl Coated','chain_link', NULL),

-- Additional vinyl
('VN-PANEL-4X8-TAN',   '40005', 'Vinyl Semi-Privacy Panel 4ft H x 8ft W Tan','Vinyl','Panels','Vinyl Fence','EA',45.00, 58.50, 30.00, NULL, 4, 8,'Tan',  'PVC','vinyl', NULL),
('VN-PANEL-3X8-WHT',   '40006', 'Vinyl Picket Panel 3ft H x 8ft W White',    'Vinyl','Panels','Vinyl Fence','EA',38.00, 49.40, 30.00, NULL, 3, 8,'White','PVC','vinyl', NULL),
('VN-PANEL-3X8-TAN',   '40007', 'Vinyl Picket Panel 3ft H x 8ft W Tan',      'Vinyl','Panels','Vinyl Fence','EA',38.00, 49.40, 30.00, NULL, 3, 8,'Tan',  'PVC','vinyl', NULL),
('VN-POST-4X4-48',     '40014', 'Vinyl Post 4x4 x 48" White',                'Vinyl','Posts', 'Vinyl Fence','EA',18.00, 23.40, 30.00, NULL, 4,NULL,'White','PVC','vinyl', NULL),
('VN-POST-4X4-60',     '40015', 'Vinyl Post 4x4 x 60" White',                'Vinyl','Posts', 'Vinyl Fence','EA',20.00, 26.00, 30.00, NULL, 5,NULL,'White','PVC','vinyl', NULL),
('VN-RAIL-1X5-72',     '40021', 'Vinyl Rail 1x5 x 72" White',                'Vinyl','Rails', 'Vinyl Fence','EA', 7.00,  9.10, 30.00, NULL,NULL,6,'White','PVC','vinyl', NULL),
('VN-CAP-4X4-TAN',     '40032', 'Vinyl Post Cap 4x4 Tan',                    'Vinyl','Caps',  'Vinyl Fence','EA', 3.50,  4.55, 30.00, NULL,NULL,NULL,'Tan','PVC','vinyl', NULL),
('VN-CAP-5X5-TAN',     '40033', 'Vinyl Post Cap 5x5 Tan',                    'Vinyl','Caps',  'Vinyl Fence','EA', 5.00,  6.50, 30.00, NULL,NULL,NULL,'Tan','PVC','vinyl', NULL),
('VN-GATE-5-6-WHT',    '40042', 'Vinyl Single Gate 5ft W x 6ft H White',     'Vinyl','Gates', 'Vinyl Fence','EA',220.00,286.00,30.00, NULL, 6,NULL,'White','PVC','vinyl', NULL),
('VN-GATE-DBL-10-6-TN','40043','Vinyl Double Gate 10ft W x 6ft H Tan',        'Vinyl','Gates', 'Vinyl Fence','EA',390.00,507.00,30.00, NULL, 6,NULL,'Tan','PVC','vinyl', NULL),

-- Additional ornamental
('WI-PANEL-4-6-BK',    '50004', 'Wrought Iron Panel 4ft H x 6ft W Black',    'Ornamental','Panels','Ornamental Fence','EA',95.00,123.50,30.00, NULL, 4, 6,'Black','Powder Coat','ornamental', NULL),
('WI-PANEL-5-6-BK',    '50005', 'Wrought Iron Panel 5ft H x 6ft W Black',    'Ornamental','Panels','Ornamental Fence','EA',118.00,153.40,30.00,NULL, 5, 6,'Black','Powder Coat','ornamental', NULL),
('WI-PANEL-6-6-BK',    '50006', 'Wrought Iron Panel 6ft H x 6ft W Black',    'Ornamental','Panels','Ornamental Fence','EA',140.00,182.00,30.00,NULL, 6, 6,'Black','Powder Coat','ornamental', NULL),
('WI-POST-3-84',       '50012', 'Ornamental Iron Post 3" x 84" Black',        'Ornamental','Posts', 'Ornamental Fence','EA',58.00, 75.40, 30.00, NULL, 7,NULL,'Black','Powder Coat','ornamental', NULL),
('WI-POST-3-96',       '50013', 'Ornamental Iron Post 3" x 96" Black',        'Ornamental','Posts', 'Ornamental Fence','EA',66.00, 85.80, 30.00, NULL, 8,NULL,'Black','Powder Coat','ornamental', NULL),
('WI-GATE-4-6-BK',     '50023', 'Ornamental Gate 4ft W x 6ft H Black',        'Ornamental','Gates', 'Ornamental Fence','EA',245.00,318.50,30.00,NULL, 6,NULL,'Black','Powder Coat','ornamental', NULL),
('WI-GATE-5-6-BK',     '50024', 'Ornamental Gate 5ft W x 6ft H Black',        'Ornamental','Gates', 'Ornamental Fence','EA',275.00,357.50,30.00,NULL, 6,NULL,'Black','Powder Coat','ornamental', NULL),

-- Additional aluminum
('AL-PANEL-5-6-WHT',   '60004', 'Aluminum Fence Panel 5ft H x 6ft W White',  'Aluminum','Panels','Aluminum Fence','EA',88.00,114.40,30.00, NULL, 5, 6,'White','Powder Coat','aluminum', NULL),
('AL-PANEL-6-6-BK',    '60005', 'Aluminum Fence Panel 6ft H x 6ft W Black',  'Aluminum','Panels','Aluminum Fence','EA',105.00,136.50,30.00,NULL, 6, 6,'Black','Powder Coat','aluminum', NULL),
('AL-POST-2-84-BK',    '60012', 'Aluminum Post 2" x 84" Black',               'Aluminum','Posts', 'Aluminum Fence','EA',24.00, 31.20, 30.00, NULL, 7,NULL,'Black','Powder Coat','aluminum', NULL),
('AL-POST-3-96-BK',    '60013', 'Aluminum Post 3" x 96" Black',               'Aluminum','Posts', 'Aluminum Fence','EA',42.00, 54.60, 30.00, NULL, 8,NULL,'Black','Powder Coat','aluminum', NULL),
('AL-GATE-6-4-BK',     '60022', 'Aluminum Single Gate 6ft W x 4ft H Black',   'Aluminum','Gates', 'Aluminum Fence','EA',195.00,253.50,30.00,NULL, 4,NULL,'Black','Powder Coat','aluminum', NULL),
('AL-GATE-DBL-12-5-BK','60023','Aluminum Double Gate 12ft W x 5ft H Black',   'Aluminum','Gates', 'Aluminum Fence','EA',420.00,546.00,30.00,NULL, 5,NULL,'Black','Powder Coat','aluminum', NULL),

-- Additional installation supplies
('INST-CONCRETE-40',   '70010', 'QuikCrete Concrete Mix 40lb Bag',            'Installation','Concrete','Installation Supplies','BG',3.40, 4.42, 30.00, NULL,NULL,NULL,'Gray','None','all', NULL),
('INST-PAINT-FENCE',   '70011', 'Fence & Barn Paint Flat Black 1gal',         'Installation','Paint',   'Installation Supplies','GL',22.00,28.60, 30.00, NULL,NULL,NULL,'Black','None','all', NULL),
('INST-PAINT-GALV',    '70012', 'Cold Galvanizing Compound Spray 13oz',       'Installation','Paint',   'Installation Supplies','EA',12.00,15.60, 30.00, NULL,NULL,NULL,'Gray','None','all', 'Touch-up for cut galvanized'),
('INST-RUST-TREAT',    '70013', 'Rust Converter & Primer 1 qt',               'Installation','Paint',   'Installation Supplies','EA',14.00,18.20, 30.00, NULL,NULL,NULL,'Gray','None','all', NULL),
('INST-ANTI-RUST',     '70014', 'Rustoleum Protective Enamel Black 1qt',      'Installation','Paint',   'Installation Supplies','EA',10.00,13.00, 30.00, NULL,NULL,NULL,'Black','None','all', NULL),
('INST-TWINE-500',     '70015', 'Layout String Line Twine 500ft',             'Installation','Layout',  'Installation Supplies','EA', 4.00, 5.20, 30.00, NULL,NULL,NULL,'White','None','all', NULL),
('INST-STAKES-4FT',    '70016', 'Wooden Grade Stakes 4ft (10pk)',             'Installation','Layout',  'Installation Supplies','PK', 6.00, 7.80, 30.00, NULL,NULL,NULL,'Natural','None','all', NULL),
('INST-STAKES-2FT',    '70017', 'Wooden Grade Stakes 2ft (25pk)',             'Installation','Layout',  'Installation Supplies','PK', 5.00, 6.50, 30.00, NULL,NULL,NULL,'Natural','None','all', NULL),
('INST-SLEEVE-6X6',    '70018', 'Post Sleeve Ground Anchor 6x6',             'Installation','Anchors', 'Installation Supplies','EA',12.00,15.60, 30.00, NULL,NULL,NULL,'Silver','Galvanized','all', NULL),
('INST-SLEEVE-4X4-BK', '70019', 'Post Sleeve Ground Anchor 4x4 Black',       'Installation','Anchors', 'Installation Supplies','EA', 8.50,11.05, 30.00, NULL,NULL,NULL,'Black','Powder Coat','all', NULL),

-- Additional privacy slats
('SL-VERT-8-BK',       '80010', 'Vertical Privacy Slat 8ft Black (50pk)',     'Slats','Privacy','Chain Link Fence','PK',40.00, 52.00, 30.00, NULL, 8,NULL,'Black','HDPE','chain_link', NULL),
('SL-VERT-10-BK',      '80011', 'Vertical Privacy Slat 10ft Black (50pk)',    'Slats','Privacy','Chain Link Fence','PK',50.00, 65.00, 30.00, NULL,10,NULL,'Black','HDPE','chain_link', NULL),
('SL-VERT-4-GN',       '80012', 'Vertical Privacy Slat 4ft Green (50pk)',     'Slats','Privacy','Chain Link Fence','PK',24.00, 31.20, 30.00, NULL, 4,NULL,'Green','HDPE','chain_link', NULL),
('SL-VERT-4-TN',       '80013', 'Vertical Privacy Slat 4ft Tan (50pk)',       'Slats','Privacy','Chain Link Fence','PK',24.00, 31.20, 30.00, NULL, 4,NULL,'Tan',  'HDPE','chain_link', NULL),
('SL-TOP-LACE-BK',     '80014', 'Top Lace for Privacy Slats Black (per 50ft)','Slats','Privacy','Chain Link Fence','RL', 8.00, 10.40, 30.00, NULL,NULL,50,'Black','HDPE','chain_link', NULL),
('SL-TOP-LACE-GN',     '80015', 'Top Lace for Privacy Slats Green (per 50ft)','Slats','Privacy','Chain Link Fence','RL', 8.00, 10.40, 30.00, NULL,NULL,50,'Green','HDPE','chain_link', NULL),

-- More wood fence items
('WD-PICKET-8-PT',     '30060', 'Pointed Top Cedar Picket 1x4x8ft',          'Wood','Pickets','Wood Fence','EA', 2.80,  3.64, 30.00, NULL, 8, 4,'Natural','None','wood_privacy', NULL),
('WD-POST-4X4-12',     '30061', 'Fence Post 4x4x12ft Cedar',                 'Wood','Posts', 'Wood Fence','EA',18.50, 24.05, 30.00, NULL,12,NULL,'Natural','None','wood_privacy', NULL),
('WD-POST-6X6-10-SYP', '30062', 'Fence Post 6x6x10ft SYP Pressure Treated', 'Wood','Posts', 'Wood Fence','EA',24.00, 31.20, 30.00, NULL,10,NULL,'Natural','Pressure Treat','wood_privacy', NULL),
('WD-RAIL-1X4-8',      '30063', 'Fence Rail 1x4x8ft Cedar',                  'Wood','Rails', 'Wood Fence','EA', 4.20,  5.46, 30.00, NULL,NULL, 8,'Natural','None','wood_privacy', NULL),
('WD-RAIL-2X3-8',      '30064', 'Fence Rail 2x3x8ft SYP Pressure Treated',  'Wood','Rails', 'Wood Fence','EA', 3.20,  4.16, 30.00, NULL,NULL, 8,'Natural','Pressure Treat','wood_privacy', NULL),
('WD-GATE-3-4',        '30065', 'Single Wood Gate 3ft W x 4ft H Cedar',      'Wood','Gates', 'Wood Fence','EA',110.00,143.00,30.00, NULL, 4,NULL,'Natural','None','wood_privacy', NULL),
('WD-GATE-SGL-6-6',    '30066', 'Single Wood Gate 6ft W x 6ft H Cedar',      'Wood','Gates', 'Wood Fence','EA',210.00,273.00,30.00, NULL, 6,NULL,'Natural','None','wood_privacy', NULL),
('WD-HW-NAIL-8D',      '30067', 'Common Nail 8d 5lb Box',                    'Wood','Hardware','Wood Fence','BX', 5.50,  7.15, 30.00, NULL,NULL,NULL,'Silver','None','wood_privacy', NULL),
('WD-HW-SCREW-2',      '30068', 'Exterior Deck Screw 2" #8 (100pk)',          'Wood','Hardware','Wood Fence','PK', 5.00,  6.50, 30.00, NULL,NULL,NULL,'Silver','None','wood_privacy', NULL),
('WD-HW-STAIN-5GAL',   '30069', 'Semi-Transparent Wood Stain 5 gallon',      'Wood','Finish','Wood Fence','GL',120.00,156.00,30.00, NULL,NULL,NULL,'Cedar','None','wood_privacy', 'Covers ~1000 sqft'),
('WD-HW-SEALER-5GAL',  '30070', 'Water Repellent Fence Sealer 5 gallon',     'Wood','Finish','Wood Fence','GL',100.00,130.00,30.00, NULL,NULL,NULL,'Clear','None','wood_privacy', NULL),

-- Additional gate hardware
('CL-GATE-PADLOCK',    '20115', 'Heavy Duty Padlock 1-5/16" Shackle',        'Chain Link','Hardware','Commercial Fitting','EA',18.00, 23.40, 30.00, NULL,NULL,NULL,'Silver','None','chain_link', 'Brass cylinder'),
('CL-GATE-PADLOCK-KEY','20116', 'Padlock Key Blank Copies (3pk)',             'Chain Link','Hardware','Commercial Fitting','PK', 6.00,  7.80, 30.00, NULL,NULL,NULL,'Brass','None','chain_link', NULL),
('WI-HW-HINGE-WELD',   '50040', 'Weld-On Hinge for Ornamental Gates (pair)', 'Ornamental','Hardware','Ornamental Fence','PR',28.00, 36.40, 30.00, NULL,NULL,NULL,'Black','Powder Coat','ornamental', NULL),
('WI-HW-DROP-ROD',     '50041', 'Drop Rod for Double Gate 5/8"',              'Ornamental','Hardware','Ornamental Fence','EA',22.00, 28.60, 30.00, NULL,NULL,NULL,'Black','Powder Coat','ornamental', NULL),
('AL-HW-HINGE',        '60030', 'Adjustable Hinge for Aluminum Gates (pair)','Aluminum','Hardware','Aluminum Fence','PR',20.00, 26.00, 30.00, NULL,NULL,NULL,'Black','Powder Coat','aluminum', NULL),
('AL-HW-LATCH',        '60031', 'Magnetic Gate Latch for Aluminum Fence',    'Aluminum','Hardware','Aluminum Fence','EA',24.00, 31.20, 30.00, NULL,NULL,NULL,'Black','Powder Coat','aluminum', NULL),

-- More security items
('SEC-CCTV-MOUNT',     '90010', 'Camera Mounting Post for Fence 8ft',         'Security','Mounts','Security Fence','EA',42.00, 54.60, 30.00, NULL, 8,NULL,'Black','Powder Coat','security', NULL),
('SEC-SIGN-NO-TRESPASS','90011','No Trespassing Sign (4-pack)',               'Security','Signs','Security Fence','PK',12.00, 15.60, 30.00, NULL,NULL,NULL,'Yellow','None','all', NULL),
('SEC-SIGN-PRIVATE',   '90012', 'Private Property Sign (4-pack)',             'Security','Signs','Security Fence','PK',12.00, 15.60, 30.00, NULL,NULL,NULL,'Yellow','None','all', NULL),
('SEC-SIGN-ELECTRIC',  '90013', 'Electric Fence Warning Sign (10-pack)',      'Security','Signs','Security Fence','PK',15.00, 19.50, 30.00, NULL,NULL,NULL,'Yellow','None','security', NULL),

-- Miscellaneous consumables / supplies
('MISC-ZIP-TIE-100',   '98001', 'UV Resistant Zip Ties 11" (100pk)',          'Misc','Fasteners','Misc Supplies','PK', 5.00,  6.50, 30.00, NULL,NULL,NULL,'Black','UV Resistant','all', NULL),
('MISC-ZIP-TIE-50-HD', '98002', 'Heavy Duty Zip Ties 21" (50pk)',             'Misc','Fasteners','Misc Supplies','PK', 7.50,  9.75, 30.00, NULL,NULL,NULL,'Black','UV Resistant','all', NULL),
('MISC-MARKING-FLAG',  '98003', 'Survey Marking Flags Assorted (100pk)',      'Misc','Layout','Misc Supplies','PK', 6.00,  7.80, 30.00, NULL,NULL,NULL,'Assorted','None','all', NULL),
('MISC-SPRAY-MARK',    '98004', 'Marking Spray Paint Blue (inverted)',        'Misc','Layout','Misc Supplies','EA', 4.50,  5.85, 30.00, NULL,NULL,NULL,'Blue','None','all', NULL),
('MISC-SPRAY-MARK-OR', '98005', 'Marking Spray Paint Orange (inverted)',      'Misc','Layout','Misc Supplies','EA', 4.50,  5.85, 30.00, NULL,NULL,NULL,'Orange','None','all', NULL),
('MISC-TAPE-MEASURE',  '98006', 'Tape Measure 100ft Fiberglass',              'Misc','Layout','Misc Supplies','EA',14.00, 18.20, 30.00, NULL,NULL,NULL,'Yellow','None','all', NULL),
('MISC-TAPE-25',       '98007', 'Tape Measure 25ft Steel',                   'Misc','Layout','Misc Supplies','EA', 8.00, 10.40, 30.00, NULL,NULL,NULL,'Yellow','None','all', NULL),
('MISC-WIRE-NUTS',     '98008', 'Wire Nuts Assorted (50pk) for electric',     'Misc','Electrical','Misc Supplies','PK', 4.00,  5.20, 30.00, NULL,NULL,NULL,'Assorted','None','security', NULL),
('MISC-WEATHERSTRIP',  '98009', 'Foam Weather Stripping Tape 1" x 17ft',      'Misc','Sealants','Misc Supplies','RL', 3.50,  4.55, 30.00, NULL,NULL,NULL,'Gray','Foam','all', 'Gate sealing'),
('MISC-CAULK-CLEAR',   '98010', 'Clear Silicone Caulk 10oz Tube',            'Misc','Sealants','Misc Supplies','EA', 4.50,  5.85, 30.00, NULL,NULL,NULL,'Clear','Silicone','all', NULL);

-- ============================================================
-- SUPPLIER_MATERIALS (link preferred supplier to materials)
-- ============================================================
-- Supplier 1 (AmeriSteel) carries most chain link items
INSERT INTO supplier_materials (supplier_id, material_id, supplier_sku, supplier_price, lead_time_days, is_preferred)
SELECT 1, m.id, 'AS-' || m.sku, m.unit_cost * 0.98, 2, TRUE
FROM materials m
WHERE m.fence_type IN ('chain_link','security') OR m.category IN ('Installation','Misc','Slats');

-- Supplier 2 (Gulf Coast) carries wood, vinyl, ornamental
INSERT INTO supplier_materials (supplier_id, material_id, supplier_sku, supplier_price, lead_time_days, is_preferred)
SELECT 2, m.id, 'GC-' || m.sku, m.unit_cost * 0.96, 3, TRUE
FROM materials m
WHERE m.fence_type IN ('wood_privacy','vinyl','ornamental','aluminum')
ON CONFLICT (supplier_id, material_id) DO NOTHING;

-- ============================================================
-- PROJECTS & ESTIMATES (demo data)
-- ============================================================
INSERT INTO projects (project_name, customer_id, status, fence_type, total_linear_ft,
    site_address, site_city, site_state, site_zip, start_date, completion_date,
    crew_size, permit_required, created_by, assigned_to) VALUES
    ('Wilson Backyard Privacy Fence', 1, 'completed',  'wood_privacy', 165.00, '1420 Oak St',        'Houston',  'TX','77002','2026-03-10','2026-03-14',3,FALSE,1,2),
    ('Johnson Commercial Chain Link',  3, 'in_progress','chain_link',  450.00, '500 Commerce Blvd',  'Houston',  'TX','77010','2026-07-15','2026-08-15',5,TRUE, 1,2),
    ('Anderson HOA Aluminum Fence',    7, 'estimating', 'aluminum',    820.00, '6000 Community Blvd','Katy',     'TX','77449', NULL,        NULL,         4,TRUE, 1,3),
    ('Davis Vinyl Privacy Fence',      4, 'estimate_sent','vinyl',     125.00, '9812 Elm Dr',         'Sugar Land','TX','77478',NULL,        NULL,         2,FALSE,2,2),
    ('Martinez Warehouse Chain Link',  5, 'approved',   'chain_link',  680.00, '1200 Main St',        'Houston',  'TX','77002','2026-08-20','2026-09-10',6,TRUE, 1,2);

-- ============================================================
-- SEED COMPLETE
-- ============================================================
-- Total materials: 150+ SKUs in seed (representative sample)
-- Full 950+ SKU import available via separate CSV import tool
-- Run: node backend/scripts/importInventory.js to load full catalog
-- ============================================================
