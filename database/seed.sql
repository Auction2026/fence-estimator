-- ============================================================
-- FENCE DEPOT ESTIMATOR - SEED DATA
-- Run after schema.sql
-- ============================================================

-- Default admin user (password: admin123 - change in production)
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@fencedepot.com', '$2b$10$PLACEHOLDER_HASH_CHANGE_ME', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Sample estimator user
INSERT INTO users (username, email, password, role)
VALUES ('estimator1', 'estimator@fencedepot.com', '$2b$10$PLACEHOLDER_HASH_CHANGE_ME', 'estimator')
ON CONFLICT (username) DO NOTHING;

-- ============================================================
-- CHAIN LINK INVENTORY (matching INVENTORY_DB in index.html)
-- ============================================================

INSERT INTO inventory (plu, description, department, category, unit, cost_price, sell_price)
VALUES
-- Chain Link Mesh
('CLM-9G-4FT-50',  '9 Gauge Chain Link Mesh 4ft x 50ft',   'Fencing', 'Chain Link', 'ROLL', 85.00,  109.99),
('CLM-9G-5FT-50',  '9 Gauge Chain Link Mesh 5ft x 50ft',   'Fencing', 'Chain Link', 'ROLL', 105.00, 134.99),
('CLM-9G-6FT-50',  '9 Gauge Chain Link Mesh 6ft x 50ft',   'Fencing', 'Chain Link', 'ROLL', 125.00, 159.99),
('CLM-11G-4FT-50', '11 Gauge Chain Link Mesh 4ft x 50ft',  'Fencing', 'Chain Link', 'ROLL', 70.00,  89.99),
('CLM-11G-5FT-50', '11 Gauge Chain Link Mesh 5ft x 50ft',  'Fencing', 'Chain Link', 'ROLL', 87.00,  109.99),
('CLM-11G-6FT-50', '11 Gauge Chain Link Mesh 6ft x 50ft',  'Fencing', 'Chain Link', 'ROLL', 104.00, 129.99),

-- Line Posts
('POST-LN-1-3-8-8', 'Line Post 1-3/8" x 8ft Galv',        'Fencing', 'Posts',      'EA',   12.50,  16.99),
('POST-LN-1-5-8-8', 'Line Post 1-5/8" x 8ft Galv',        'Fencing', 'Posts',      'EA',   15.00,  19.99),
('POST-LN-1-7-8-8', 'Line Post 1-7/8" x 8ft Galv',        'Fencing', 'Posts',      'EA',   18.00,  23.99),
('POST-TRM-2-8',    'Terminal Post 2" x 8ft Galv',         'Fencing', 'Posts',      'EA',   22.00,  29.99),
('POST-TRM-2-10',   'Terminal Post 2" x 10ft Galv',        'Fencing', 'Posts',      'EA',   28.00,  36.99),

-- Top Rails
('RAIL-TOP-21',     'Top Rail 1-3/8" x 21ft Galv',         'Fencing', 'Rails',      'EA',   11.00,  14.99),
('RAIL-TOP-21-HVY', 'Top Rail 1-5/8" x 21ft Galv Heavy',   'Fencing', 'Rails',      'EA',   14.00,  18.99),

-- Tension Wire
('TW-9G-170',       '9 Gauge Tension Wire 170ft coil',      'Fencing', 'Wire',       'COIL', 18.00,  24.99),
('TW-9G-250',       '9 Gauge Tension Wire 250ft coil',      'Fencing', 'Wire',       'COIL', 25.00,  32.99),

-- Fittings
('FIT-BB-1-3-8',    'Brace Band 1-3/8"',                    'Commercial Fitting', 'Hardware', 'EA', 0.75, 1.29),
('FIT-BB-1-5-8',    'Brace Band 1-5/8"',                    'Commercial Fitting', 'Hardware', 'EA', 0.90, 1.49),
('FIT-CAP-1-3-8',   'Post Cap 1-3/8"',                      'Commercial Fitting', 'Hardware', 'EA', 0.50, 0.79),
('FIT-CAP-1-5-8',   'Post Cap 1-5/8"',                      'Commercial Fitting', 'Hardware', 'EA', 0.60, 0.89),
('FIT-TIE-9G',      '9 Gauge Tie Wire 50 pack',             'Commercial Fitting', 'Hardware', 'PKG', 5.00, 7.99),
('FIT-TB-4FT',      'Tension Bar 4ft',                      'Commercial Fitting', 'Hardware', 'EA', 2.50, 3.99),
('FIT-TB-5FT',      'Tension Bar 5ft',                      'Commercial Fitting', 'Hardware', 'EA', 3.00, 4.99),
('FIT-TB-6FT',      'Tension Bar 6ft',                      'Commercial Fitting', 'Hardware', 'EA', 3.50, 5.49),

-- Concrete
('CONC-40LB',       'Concrete Mix 40lb bag',                'Building', 'Concrete',  'BAG',  5.50,  7.99),
('CONC-80LB',       'Concrete Mix 80lb bag',                'Building', 'Concrete',  'BAG',  9.50,  12.99)

ON CONFLICT (plu) DO NOTHING;

-- Sample customer
INSERT INTO customers (name, phone, email, address, city, province, postal_code)
VALUES ('Sample Customer', '416-555-0100', 'customer@example.com', '123 Main St', 'Toronto', 'ON', 'M1A 1A1')
ON CONFLICT DO NOTHING;
