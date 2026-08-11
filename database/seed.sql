-- PART 3: Starter inventory seed data
INSERT INTO inventory_items (sku, description, category, unit, unit_price) VALUES
('CL-POST-2-3/8', 'Chain Link Post 2-3/8in x 8ft', 'Posts', 'each', 29.95),
('CL-POST-1-7/8', 'Chain Link Line Post 1-7/8in x 8ft', 'Posts', 'each', 22.50),
('CL-RAIL-1-3/8', 'Top Rail 1-3/8in x 21ft', 'Rails', 'each', 34.95),
('CL-FAB-6-9GA', 'Chain Link Fabric 6ft 9ga', 'Fabric', 'ft', 6.85),
('CL-TIE-ALUM', 'Aluminum Ties', 'Hardware', 'bag', 18.75),
('CL-TENSION-BAND', 'Tension Band 2-3/8in', 'Hardware', 'each', 1.95),
('CL-TENSION-BAR', 'Tension Bar 6ft', 'Hardware', 'each', 11.20),
('CL-CAP-DOME', 'Dome Post Cap 2-3/8in', 'Hardware', 'each', 3.25),
('CL-CONCRETE-30', 'Post Mix Concrete 30kg', 'Concrete', 'bag', 7.60),
('CL-GATE-4', 'Swing Gate 4ft', 'Gates', 'each', 199.00),
('WD-POST-4X4', 'Pressure Treated Post 4x4x8', 'Wood', 'each', 18.40),
('WD-RAIL-2X4', 'Pressure Treated Rail 2x4x8', 'Wood', 'each', 7.10),
('WD-PICKET-6', 'Wood Picket 6ft', 'Wood', 'each', 4.05),
('WD-SCREW-BOX', 'Exterior Screw Box', 'Hardware', 'box', 38.50),
('VIN-POST-5', 'Vinyl Post 5x5', 'Vinyl', 'each', 46.00)
ON CONFLICT (sku) DO NOTHING;
