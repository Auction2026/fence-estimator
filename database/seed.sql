-- =============================================================
-- FENCE DEPOT ESTIMATOR — Seed Data
-- =============================================================

-- ── Provinces ─────────────────────────────────────────────
INSERT INTO provinces (code, name) VALUES
  ('AB','Alberta'),('BC','British Columbia'),('MB','Manitoba'),
  ('NB','New Brunswick'),('NL','Newfoundland and Labrador'),
  ('NS','Nova Scotia'),('NT','Northwest Territories'),
  ('NU','Nunavut'),('ON','Ontario'),('PE','Prince Edward Island'),
  ('QC','Quebec'),('SK','Saskatchewan'),('YT','Yukon')
ON CONFLICT (code) DO NOTHING;

-- ── Fence Types ───────────────────────────────────────────
INSERT INTO fence_types (code, label, description) VALUES
  ('chain-link','Chain Link','Galvanized, vinyl-coated or black; commercial & residential'),
  ('wood',      'Wood',      'Cedar or pressure-treated pickets and rails'),
  ('aluminum',  'Aluminum',  'Ornamental aluminum panels; low maintenance'),
  ('vinyl',     'Vinyl PVC', 'PVC privacy or picket panels; no painting required')
ON CONFLICT (code) DO NOTHING;

-- ── Default Admin User ────────────────────────────────────
-- Default password: FenceDepot2026!
-- bcrypt hash (cost factor 10). CHANGE THIS BEFORE PRODUCTION.
-- Generate a new hash with: node -e "const b=require('bcryptjs');b.hash('NewPassword',10).then(console.log)"
INSERT INTO users (username, email, password_hash, first_name, last_name, role, company) VALUES
  ('admin','admin@fencedepot.ca','$2b$10$rOzJqEqQ5kLm3nVwXyZ8uOQdDk7pHsIoNbFgAeWcTvMjPqKlRsUxY','Admin','User','admin','Fence Depot')
ON CONFLICT (email) DO NOTHING;

-- ── Inventory — Chain Link Fabric (50 ft rolls) ───────────
INSERT INTO inventory (plu, description, dept, height_ft, gauge, length_ft, color, unit, price) VALUES
  ('CLF-4-11.5-G',   '4\' Chain Link Fabric — 11.5 Ga Galvanized',    'Chain Link Fabric', 4,  '11.5', 50,  'Galvanized',   '50 ft Roll', 89.99),
  ('CLF-5-11.5-G',   '5\' Chain Link Fabric — 11.5 Ga Galvanized',    'Chain Link Fabric', 5,  '11.5', 50,  'Galvanized',   '50 ft Roll', 109.99),
  ('CLF-6-11.5-G',   '6\' Chain Link Fabric — 11.5 Ga Galvanized',    'Chain Link Fabric', 6,  '11.5', 50,  'Galvanized',   '50 ft Roll', 129.99),
  ('CLF-8-11.5-G',   '8\' Chain Link Fabric — 11.5 Ga Galvanized',    'Chain Link Fabric', 8,  '11.5', 50,  'Galvanized',   '50 ft Roll', 169.99),
  ('CLF-4-11.5-B',   '4\' Chain Link Fabric — 11.5 Ga Black',         'Chain Link Fabric', 4,  '11.5', 50,  'Black',        '50 ft Roll', 99.99),
  ('CLF-5-11.5-B',   '5\' Chain Link Fabric — 11.5 Ga Black',         'Chain Link Fabric', 5,  '11.5', 50,  'Black',        '50 ft Roll', 119.99),
  ('CLF-6-11.5-B',   '6\' Chain Link Fabric — 11.5 Ga Black',         'Chain Link Fabric', 6,  '11.5', 50,  'Black',        '50 ft Roll', 139.99),
  ('CLF-6-9-G',      '6\' Chain Link Fabric — 9 Ga Galvanized',       'Chain Link Fabric', 6,  '9',    50,  'Galvanized',   '50 ft Roll', 179.99),
  ('CLF-6-11.5-GR',  '6\' Chain Link Fabric — 11.5 Ga Green',         'Chain Link Fabric', 6,  '11.5', 50,  'Green',        '50 ft Roll', 139.99),
  ('CLF-4-11.5-GR',  '4\' Chain Link Fabric — 11.5 Ga Green',         'Chain Link Fabric', 4,  '11.5', 50,  'Green',        '50 ft Roll', 94.99),

-- ── Line Posts ─────────────────────────────────────────────
  ('LP-1.375-4',     'Line Post 1-3/8" × 4\' Galvanized',             'Posts', 4,  NULL, NULL, 'Galvanized',  'Each', 7.99),
  ('LP-1.375-5',     'Line Post 1-3/8" × 5\' Galvanized',             'Posts', 5,  NULL, NULL, 'Galvanized',  'Each', 9.99),
  ('LP-1.375-6',     'Line Post 1-3/8" × 6\' Galvanized',             'Posts', 6,  NULL, NULL, 'Galvanized',  'Each', 12.49),
  ('LP-1.375-8',     'Line Post 1-3/8" × 8\' Galvanized',             'Posts', 8,  NULL, NULL, 'Galvanized',  'Each', 15.99),
  ('LP-2-6',         'Line Post 2" × 6\' Galvanized',                 'Posts', 6,  NULL, NULL, 'Galvanized',  'Each', 17.99),
  ('LP-2-8',         'Line Post 2" × 8\' Galvanized',                 'Posts', 8,  NULL, NULL, 'Galvanized',  'Each', 21.99),

-- ── Terminal / Corner Posts ────────────────────────────────
  ('TP-2-8',         'Terminal Post 2" × 8\' Galvanized',             'Posts', 6,  NULL, NULL, 'Galvanized',  'Each', 24.99),
  ('TP-2.5-8',       'Terminal Post 2-1/2" × 8\' Galvanized',         'Posts', 6,  NULL, NULL, 'Galvanized',  'Each', 29.99),
  ('TP-3-10',        'Terminal Post 3" × 10\' Commercial Galvanized',  'Posts', 8,  NULL, NULL, 'Galvanized',  'Each', 49.99),

-- ── Top Rail ──────────────────────────────────────────────
  ('RAIL-1.375-21',  'Top Rail 1-3/8" × 21\' Galvanized',             'Rail',  NULL,NULL, 21, 'Galvanized',  'Each', 18.99),
  ('RAIL-1.625-21',  'Top Rail 1-5/8" × 21\' Galvanized',             'Rail',  NULL,NULL, 21, 'Galvanized',  'Each', 22.99),
  ('RAIL-2-21',      'Top Rail 2" × 21\' Galvanized',                 'Rail',  NULL,NULL, 21, 'Galvanized',  'Each', 28.99),

-- ── Tension Wire ──────────────────────────────────────────
  ('TW-12.5-1000',   'Tension Wire 12.5 Ga × 1000 ft Galvanized',     'Commercial Fitting',NULL,NULL,1000,'Galvanized','1000 ft Spool',34.99),
  ('TW-9-1000',      'Tension Wire 9 Ga × 1000 ft Galvanized',        'Commercial Fitting',NULL,NULL,1000,'Galvanized','1000 ft Spool',54.99),

-- ── Hardware: Bands, Ties, Caps ───────────────────────────
  ('BB-1.375',       'Brace Band 1-3/8"',                             'Commercial Fitting',NULL,NULL,NULL,'Galvanized','Each', 0.59),
  ('BB-2',           'Brace Band 2"',                                  'Commercial Fitting',NULL,NULL,NULL,'Galvanized','Each', 0.79),
  ('TIE-WIRE-50',    'Tie Wire — 50 Pack',                             'Commercial Fitting',NULL,NULL,NULL,'Galvanized','50 Pack', 4.99),
  ('POST-CAP-1.375', 'Dome Post Cap 1-3/8"',                          'Commercial Fitting',NULL,NULL,NULL,'Galvanized','Each', 0.49),
  ('POST-CAP-2',     'Dome Post Cap 2"',                               'Commercial Fitting',NULL,NULL,NULL,'Galvanized','Each', 0.79),
  ('LOOP-CAP-1.375', 'Loop Cap 1-3/8"',                               'Commercial Fitting',NULL,NULL,NULL,'Galvanized','Each', 1.29),
  ('LOOP-CAP-2',     'Loop Cap 2"',                                    'Commercial Fitting',NULL,NULL,NULL,'Galvanized','Each', 1.79),
  ('RAIL-END-1.375', 'Rail End Fitting 1-3/8"',                       'Commercial Fitting',NULL,NULL,NULL,'Galvanized','Each', 0.89),
  ('TENSION-BAR-4',  'Tension Bar 4\'',                               'Commercial Fitting',NULL,NULL,NULL,'Galvanized','Each', 3.49),
  ('TENSION-BAR-5',  'Tension Bar 5\'',                               'Commercial Fitting',NULL,NULL,NULL,'Galvanized','Each', 4.49),
  ('TENSION-BAR-6',  'Tension Bar 6\'',                               'Commercial Fitting',NULL,NULL,NULL,'Galvanized','Each', 5.49),

-- ── Gates — Chain Link ────────────────────────────────────
  ('GATE-CL-4-6',    'Chain Link Gate 4\' × 6\' Galvanized',          'Gates', 6,  NULL, NULL, 'Galvanized',  'Each', 149.99),
  ('GATE-CL-5-6',    'Chain Link Gate 5\' × 6\' Galvanized',          'Gates', 6,  NULL, NULL, 'Galvanized',  'Each', 179.99),
  ('GATE-CL-4-4',    'Chain Link Gate 4\' × 4\' Galvanized',          'Gates', 4,  NULL, NULL, 'Galvanized',  'Each', 124.99),
  ('GATE-CL-10-6',   'Chain Link Double Gate 10\' × 6\' Galvanized',  'Gates', 6,  NULL, NULL, 'Galvanized',  'Each', 324.99),
  ('GATE-CL-12-6',   'Chain Link Double Gate 12\' × 6\' Galvanized',  'Gates', 6,  NULL, NULL, 'Galvanized',  'Each', 374.99),
  ('GATE-HINGE-1.5', 'Gate Hinge 1-1/2" (pair)',                      'Gates', NULL,NULL,NULL,'Galvanized',  'Pair', 8.99),
  ('GATE-LATCH-STD', 'Gate Latch — Standard',                          'Gates', NULL,NULL,NULL,'Galvanized',  'Each', 12.99),
  ('GATE-LOCK-PAD',  'Gate Padlock Hasp',                              'Gates', NULL,NULL,NULL,'Galvanized',  'Each', 7.99),

-- ── Concrete ──────────────────────────────────────────────
  ('CONC-60LB',      'Concrete Mix — 60 lb bag (Sakrete/Quikrete)',    'Concrete',NULL,NULL,NULL,NULL,        '60 lb Bag', 6.99),
  ('CONC-80LB',      'Concrete Mix — 80 lb bag',                       'Concrete',NULL,NULL,NULL,NULL,        '80 lb Bag', 8.99),

-- ── Wood Fence ────────────────────────────────────────────
  ('PICKET-6-6CED',  '6" Cedar Dog-Ear Picket — 6 ft',                'Wood Fence',NULL,NULL,NULL,NULL,      'Each', 4.99),
  ('PICKET-4-6CED',  '4" Cedar Dog-Ear Picket — 6 ft',                'Wood Fence',NULL,NULL,NULL,NULL,      'Each', 3.49),
  ('PICKET-6-8CED',  '6" Cedar Dog-Ear Picket — 8 ft',                'Wood Fence',NULL,NULL,NULL,NULL,      'Each', 6.49),
  ('POST-4X4-8PT',   '4×4 Pressure-Treated Post — 8 ft',              'Wood Fence',NULL,NULL,NULL,NULL,      'Each', 14.99),
  ('POST-4X4-10PT',  '4×4 Pressure-Treated Post — 10 ft',             'Wood Fence',NULL,NULL,NULL,NULL,      'Each', 18.99),
  ('RAIL-2X4-8PT',   '2×4 Pressure-Treated Rail — 8 ft',              'Wood Fence',NULL,NULL,NULL,NULL,      'Each', 7.49),
  ('RAIL-2X4-10PT',  '2×4 Pressure-Treated Rail — 10 ft',             'Wood Fence',NULL,NULL,NULL,NULL,      'Each', 8.99),
  ('SCREW-2IN-LB',   'Exterior Deck Screws 2" — 1 lb box',            'Wood Fence',NULL,NULL,NULL,NULL,      '1 lb Box', 5.99),
  ('SCREW-3IN-LB',   'Exterior Deck Screws 3" — 1 lb box',            'Wood Fence',NULL,NULL,NULL,NULL,      '1 lb Box', 6.49),

-- ── Aluminum Ornamental ───────────────────────────────────
  ('AL-POST-2X2-72', 'Aluminum Post 2"×2" — 72" (6 ft)',              'Aluminum', 6,  NULL, NULL, 'Black',    'Each', 34.99),
  ('AL-POST-2X2-96', 'Aluminum Post 2"×2" — 96" (8 ft)',              'Aluminum', 8,  NULL, NULL, 'Black',    'Each', 44.99),
  ('AL-PANEL-3X6',   'Aluminum Fence Panel 3\'×6\'',                  'Aluminum', 6,  NULL, NULL, 'Black',    'Each', 89.99),
  ('AL-GATE-4X6',    'Aluminum Gate 4\'×6\'',                         'Aluminum', 6,  NULL, NULL, 'Black',    'Each', 169.99),
  ('AL-CAP-2X2',     'Aluminum Post Cap 2"×2"',                       'Aluminum', NULL,NULL,NULL,'Black',     'Each', 4.99),

-- ── Vinyl PVC ─────────────────────────────────────────────
  ('VIN-POST-4X4-8', 'Vinyl Post 4"×4" — 8 ft',                      'Vinyl',    NULL,NULL, NULL,'White',    'Each', 24.99),
  ('VIN-PANEL-6-6',  'Vinyl Privacy Panel 6\'×6\'',                   'Vinyl',    6,  NULL, NULL, 'White',    'Each', 79.99),
  ('VIN-PANEL-6-8',  'Vinyl Privacy Panel 6\'×8\'',                   'Vinyl',    6,  NULL, NULL, 'White',    'Each', 89.99),
  ('VIN-GATE-4X6',   'Vinyl Gate 4\'×6\'',                            'Vinyl',    6,  NULL, NULL, 'White',    'Each', 149.99),
  ('VIN-CAP-4X4',    'Vinyl Post Cap 4"×4" — Flat',                   'Vinyl',    NULL,NULL, NULL,'White',    'Each', 3.99)
ON CONFLICT (plu) DO UPDATE SET
  description = EXCLUDED.description,
  price       = EXCLUDED.price,
  updated_at  = NOW();
