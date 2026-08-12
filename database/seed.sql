-- Fence Estimator Seed Data
-- File: /home/runner/work/fence-estimator/fence-estimator/database/seed.sql
-- Seeds sample users, customers, projects, estimates, estimate items, gates, contracts, payments, photos, and a 200+ item product catalog.

BEGIN;

-- Clear dependent data in reverse order for idempotent local setup.
TRUNCATE TABLE audit_log, payments, contracts, gates, estimate_items, estimates, photos, projects, customers, products, users RESTART IDENTITY CASCADE;

-- -----------------------------------------------------------------------------
-- USERS
-- -----------------------------------------------------------------------------
INSERT INTO users (id, username, email, password_hash, role, company, phone, created_at, updated_at) VALUES
    (1, 'admin', 'admin@fencedepotestimating.com', '$2b$12$adminExampleHashReplaceInRealDeploy', 'admin', 'Fence Depot Estimating', '(555) 201-1000', '2026-01-02 08:00:00+00', '2026-01-02 08:00:00+00'),
    (2, 'estimator_jane', 'jane.mercer@fencedepotestimating.com', '$2b$12$estimatorExampleHashReplaceInRealDeploy', 'estimator', 'Fence Depot Estimating', '(555) 201-1001', '2026-01-03 08:15:00+00', '2026-01-03 08:15:00+00'),
    (3, 'crew_mike', 'mike.santos@fencedepotestimating.com', '$2b$12$crewExampleHashReplaceInRealDeploy', 'crew', 'Fence Depot Field Operations', '(555) 201-1002', '2026-01-04 07:30:00+00', '2026-01-04 07:30:00+00');

-- -----------------------------------------------------------------------------
-- CUSTOMERS
-- -----------------------------------------------------------------------------
INSERT INTO customers (id, first_name, last_name, email, phone, address, city, state, zip, company, notes, created_at, user_id) VALUES
    (1, 'Olivia', 'Bennett', 'olivia.bennett@example.com', '(555) 310-1100', '1824 Willow Creek Dr', 'Franklin', 'TN', '37064', NULL, 'Interested in black aluminum around pool. HOA approval required.', '2026-01-08 10:05:00+00', 2),
    (2, 'Marcus', 'Hale', 'marcus.hale@example.com', '(555) 310-1101', '44 South Ridge Rd', 'Brentwood', 'TN', '37027', 'Hale Outdoor Living', 'Needs privacy fence and two gates for backyard remodel.', '2026-01-09 14:12:00+00', 2),
    (3, 'Dana', 'Kim', 'dana.kim@example.com', '(555) 310-1102', '931 Lakeview Ct', 'Murfreesboro', 'TN', '37129', NULL, 'Replacing storm-damaged chain link on side lot.', '2026-01-12 09:20:00+00', 2),
    (4, 'Robert', 'Fischer', 'rfischer@fischerlogistics.com', '(555) 310-1103', '700 Commerce Pkwy', 'La Vergne', 'TN', '37086', 'Fischer Logistics', 'Commercial security fencing with controlled access gate.', '2026-01-15 11:45:00+00', 1),
    (5, 'Emily', 'Serrano', 'emily.serrano@example.com', '(555) 310-1104', '128 Oak Hollow Ln', 'Hendersonville', 'TN', '37075', NULL, 'Vinyl semi-privacy around patio and side yard.', '2026-01-18 16:05:00+00', 2),
    (6, 'Trevor', 'Nguyen', 'trevor.nguyen@example.com', '(555) 310-1105', '610 Aspen Fields Dr', 'Nolensville', 'TN', '37135', NULL, 'Wants cedar shadowbox fence with custom walk gate.', '2026-01-20 13:10:00+00', 2),
    (7, 'Harper', 'Cole', 'harper.cole@example.com', '(555) 310-1106', '93 Birch Run', 'Lebanon', 'TN', '37087', 'Cole Family Farm', 'Agricultural perimeter fence and service gate.', '2026-01-25 08:40:00+00', 1),
    (8, 'Jordan', 'Patel', 'jordan.patel@example.com', '(555) 310-1107', '5001 Sunset Blvd', 'Nashville', 'TN', '37215', NULL, 'Modern horizontal wood privacy concept. Needs estimate options.', '2026-01-26 15:27:00+00', 2),
    (9, 'Whitney', 'Ross', 'whitney.ross@example.com', '(555) 310-1108', '221 Hampton Green', 'Smyrna', 'TN', '37167', 'Ross Property Management', 'Townhome common-area replacement fencing in phases.', '2026-01-28 10:00:00+00', 1),
    (10, 'Samuel', 'Brooks', 'samuel.brooks@example.com', '(555) 310-1109', '15 River Point', 'Gallatin', 'TN', '37066', NULL, 'Chain link dog run with privacy slats and upgraded latch.', '2026-01-30 12:35:00+00', 2);

-- -----------------------------------------------------------------------------
-- PROJECTS
-- -----------------------------------------------------------------------------
INSERT INTO projects (id, customer_id, user_id, name, site_address, site_city, site_state, site_zip, project_type, status, notes, start_date, end_date, created_at, updated_at) VALUES
    (1, 1, 2, 'Bennett Pool Safety Fence', '1824 Willow Creek Dr', 'Franklin', 'TN', '37064', 'residential', 'proposal-sent', 'Black aluminum around pool deck with one self-closing gate.', '2026-02-15', '2026-02-20', '2026-02-01 09:00:00+00', '2026-02-05 09:00:00+00'),
    (2, 2, 2, 'Hale Backyard Privacy Upgrade', '44 South Ridge Rd', 'Brentwood', 'TN', '37027', 'residential', 'approved', '6ft cedar privacy fence with double drive gate and walk gate.', '2026-03-10', '2026-03-15', '2026-02-03 09:15:00+00', '2026-02-10 13:20:00+00'),
    (3, 3, 2, 'Kim Side Lot Chain Link Replacement', '931 Lakeview Ct', 'Murfreesboro', 'TN', '37129', 'repair', 'completed', 'Replace approximately 140 LF of 4ft galvanized chain link damaged by storm.', '2026-02-18', '2026-02-19', '2026-02-04 10:40:00+00', '2026-02-22 17:00:00+00'),
    (4, 4, 1, 'Fischer Logistics Security Perimeter', '700 Commerce Pkwy', 'La Vergne', 'TN', '37086', 'commercial', 'estimating', '6ft black chain link with barb arm and 24ft cantilever gate.', '2026-04-01', '2026-04-20', '2026-02-06 08:30:00+00', '2026-02-12 16:40:00+00'),
    (5, 5, 2, 'Serrano Vinyl Patio Enclosure', '128 Oak Hollow Ln', 'Hendersonville', 'TN', '37075', 'residential', 'site-visit', '5ft tan vinyl semi-privacy on patio and side setback.', '2026-03-05', '2026-03-08', '2026-02-07 11:05:00+00', '2026-02-08 11:05:00+00');

-- -----------------------------------------------------------------------------
-- ESTIMATES
-- -----------------------------------------------------------------------------
INSERT INTO estimates (id, project_id, version, status, fence_type, fence_height, fence_color, linear_feet, post_count, materials_total, labor_total, extras_total, tax_rate, tax_amount, subtotal, grand_total, markup_percent, created_at, updated_at) VALUES
    (1, 1, 1, 'sent', 'aluminum', 4.0, 'Black', 96.0, 7, 3955.00, 920.00, 250.00, 0.0925, 474.56, 5125.00, 5599.56, 38.00, '2026-02-02 12:00:00+00', '2026-02-05 09:30:00+00'),
    (2, 2, 1, 'approved', 'wood', 6.0, 'Natural Cedar', 184.0, 25, 6741.00, 2350.00, 420.00, 0.0925, 880.48, 9511.00, 10391.48, 42.00, '2026-02-04 12:00:00+00', '2026-02-10 13:25:00+00'),
    (3, 3, 1, 'converted', 'chain-link', 4.0, 'Galvanized', 140.0, 15, 1865.00, 780.00, 120.00, 0.0925, 255.19, 2765.00, 3020.19, 30.00, '2026-02-05 14:20:00+00', '2026-02-18 08:10:00+00'),
    (4, 4, 1, 'draft', 'chain-link', 6.0, 'Black', 486.0, 41, 14890.00, 4950.00, 960.00, 0.0925, 1924.05, 20800.00, 22724.05, 36.00, '2026-02-07 16:00:00+00', '2026-02-12 16:45:00+00'),
    (5, 5, 1, 'draft', 'vinyl', 5.0, 'Tan', 78.0, 9, 3880.00, 1180.00, 180.00, 0.0925, 484.70, 5240.00, 5724.70, 35.00, '2026-02-08 10:30:00+00', '2026-02-08 11:15:00+00');

-- -----------------------------------------------------------------------------
-- ESTIMATE ITEMS
-- -----------------------------------------------------------------------------
INSERT INTO estimate_items (id, estimate_id, category, sku, description, quantity, unit, unit_price, total_price, notes) VALUES
    (1, 1, 'material', 'AL-PNL-RES-4-BLK', 'Residential flat-top aluminum panels', 16, 'panel', 118.00, 1888.00, 'Pool code spacing included.'),
    (2, 1, 'material', 'AL-PST-LINE-BLK', 'Aluminum line/end/corner posts package', 7, 'each', 45.00, 315.00, 'Includes base collars and caps.'),
    (3, 1, 'material', 'AL-WALK-4', 'Aluminum walk gate 4ft x 5ft black', 1, 'each', 512.00, 512.00, 'Self-closing hinges and MagnaLatch included.'),
    (4, 1, 'labor', NULL, 'Install labor for pool fence and gate', 24, 'hour', 38.50, 924.00, 'Two-person crew.'),
    (5, 1, 'other', NULL, 'Layout, core drilling, and cleanup', 1, 'lot', 250.00, 250.00, 'Includes haul away of spoils.'),
    (6, 2, 'material', 'WD-PNL-CEDAR-PRIV-6', 'Western Red Cedar 6ft privacy panels', 23, 'panel', 129.00, 2967.00, 'Premium cedar panels.'),
    (7, 2, 'material', 'WD-PST-CEDAR-4X4-8', 'Western Red Cedar 4x4 x 8ft posts', 25, 'each', 16.50, 412.50, 'Corner and gate posts field selected.'),
    (8, 2, 'material', 'WD-WALK-4', 'Wood walk gate 4ft x 6ft privacy', 1, 'each', 255.00, 255.00, 'Heavy duty black strap hinges.'),
    (9, 2, 'material', 'WD-DRV-10', 'Wood double drive gate 10ft x 6ft privacy', 1, 'each', 785.00, 785.00, 'Drop rod and cane bolt hardware included.'),
    (10, 2, 'labor', NULL, 'Install labor for cedar privacy fence', 61, 'hour', 38.50, 2348.50, 'Crew plus custom gate build-out.'),
    (11, 2, 'other', NULL, 'Removal of existing fence and debris haul-off', 1, 'lot', 420.00, 420.00, 'Includes dump fees.'),
    (12, 3, 'material', 'CL-MSH-48-11G-GALV', '4ft galvanized chain link fabric rolls', 3, 'roll', 118.00, 354.00, 'Standard residential fabric.'),
    (13, 3, 'material', 'CL-LP-158-6-GALV', '1-5/8in x 6ft galvanized line posts', 12, 'each', 21.50, 258.00, 'Reuse existing caps where possible.'),
    (14, 3, 'material', 'CL-TP-200-8-GALV', '2in x 8ft galvanized terminal posts', 3, 'each', 35.00, 105.00, 'End and corner posts.'),
    (15, 3, 'material', 'CL-TR-1315-21-GALV', '1-3/8in x 21ft galvanized top rail', 7, 'each', 45.15, 316.05, 'Swedged rail sticks.'),
    (16, 3, 'labor', NULL, 'Storm repair chain link labor', 20, 'hour', 39.00, 780.00, 'Crew reset line and corner posts.'),
    (17, 3, 'other', 'CONC-FASTSET-50', 'Fast-set concrete and site cleanup', 12, 'bag', 10.00, 120.00, '12 bags estimated.'),
    (18, 4, 'material', 'CL-MSH-72-9GA-BLK', '6ft black chain link fabric rolls', 10, 'roll', 281.17, 2811.70, 'Commercial 9 gauge fabric.'),
    (19, 4, 'material', 'CL-TP-300-12-BLK', '3in x 12ft black terminal posts', 8, 'each', 110.49, 883.92, 'Gate and corner assemblies.'),
    (20, 4, 'material', 'CL-LP-200-10-BLK', '2in x 10ft black line posts', 33, 'each', 62.93, 2076.69, 'Commercial line posts.'),
    (21, 4, 'material', 'CL-DRV-12', 'Double drive gate package allowance', 2, 'each', 689.00, 1378.00, 'Temporary allowance while deciding slide vs swing.'),
    (22, 4, 'labor', NULL, 'Commercial install labor and equipment', 120, 'hour', 41.25, 4950.00, 'Crew plus skid steer.'),
    (23, 4, 'other', NULL, 'Permitting, traffic control, and mobilization', 1, 'lot', 960.00, 960.00, 'Municipal right-of-way coordination included.'),
    (24, 5, 'material', 'VY-PNL-SEMI-5-TAN', '5ft tan vinyl semi-privacy panels', 10, 'panel', 201.15, 2011.50, 'Patio and side yard runs.'),
    (25, 5, 'material', 'VY-PST-5X5-ROUTED-LINE-POST-9FT-TAN', '5x5 routed line posts 9ft tan', 7, 'each', 56.16, 393.12, 'Line post allocation.'),
    (26, 5, 'material', 'VY-WALK-4', 'Vinyl walk gate 4ft x 6ft privacy white', 1, 'each', 429.00, 429.00, 'Color-match surcharge still pending.'),
    (27, 5, 'labor', NULL, 'Install labor for vinyl semi-privacy fence', 30, 'hour', 39.33, 1179.90, 'Crew estimate based on auger installation.'),
    (28, 5, 'other', NULL, 'Layout and color-match special order freight', 1, 'lot', 180.00, 180.00, 'Freight estimated from regional distributor.');

-- -----------------------------------------------------------------------------
-- GATES
-- -----------------------------------------------------------------------------
INSERT INTO gates (id, estimate_id, gate_type, width, height, hardware_type, quantity, unit_price, total_price) VALUES
    (1, 1, 'walk', 4.00, 5.00, 'Self-closing hinges + MagnaLatch', 1, 512.00, 512.00),
    (2, 2, 'walk', 4.00, 6.00, 'Black strap hinges + gravity latch', 1, 255.00, 255.00),
    (3, 2, 'double-drive', 10.00, 6.00, 'Cane bolts + drop rod', 1, 785.00, 785.00),
    (4, 3, 'walk', 4.00, 4.00, 'Fork latch + hinge set', 1, 189.00, 189.00),
    (5, 4, 'double-drive', 12.00, 6.00, 'Industrial latch + pneumatic closer allowance', 2, 689.00, 1378.00),
    (6, 5, 'walk', 4.00, 6.00, 'Vinyl hinge + latch kit', 1, 429.00, 429.00);

-- -----------------------------------------------------------------------------
-- CONTRACTS
-- -----------------------------------------------------------------------------
INSERT INTO contracts (id, estimate_id, status, terms, signed_date, signed_by, deposit_amount, deposit_paid, created_at) VALUES
    (1, 2, 'signed', '50% deposit due at signing. Balance due upon substantial completion. Includes one-year workmanship warranty.', '2026-02-11', 'Marcus Hale', 5195.74, TRUE, '2026-02-11 15:00:00+00'),
    (2, 3, 'closed', '50% deposit and balance due at completion. Emergency repair approved verbally and signed on site.', '2026-02-17', 'Dana Kim', 1510.10, TRUE, '2026-02-17 13:25:00+00'),
    (3, 1, 'sent', '40% deposit to schedule. Balance due after final walkthrough and gate adjustment.', NULL, NULL, 2239.82, FALSE, '2026-02-06 10:10:00+00');

-- -----------------------------------------------------------------------------
-- PAYMENTS
-- -----------------------------------------------------------------------------
INSERT INTO payments (id, contract_id, amount, payment_date, payment_method, reference_number, notes) VALUES
    (1, 1, 5195.74, '2026-02-11', 'credit-card', 'AUTH-332014', 'Deposit captured at signing.'),
    (2, 2, 1510.10, '2026-02-17', 'check', 'CHK-8841', 'Deposit check collected on site.'),
    (3, 2, 1510.09, '2026-02-19', 'ach', 'ACH-214987', 'Final balance received after completion.');

-- -----------------------------------------------------------------------------
-- PHOTOS
-- -----------------------------------------------------------------------------
INSERT INTO photos (id, project_id, filename, label, upload_date, user_id) VALUES
    (1, 1, 'bennett-pool-layout-01.jpg', 'Pool fence layout sketch', '2026-02-02 14:25:00+00', 2),
    (2, 1, 'bennett-pool-grade-02.jpg', 'Deck edge grade photo', '2026-02-02 14:28:00+00', 2),
    (3, 2, 'hale-yard-overview-01.jpg', 'Backyard overview', '2026-02-04 09:45:00+00', 2),
    (4, 2, 'hale-gate-opening-02.jpg', 'Drive gate opening measurement', '2026-02-04 09:48:00+00', 2),
    (5, 3, 'kim-damaged-run-01.jpg', 'Damaged chain link section', '2026-02-05 11:15:00+00', 2),
    (6, 4, 'fischer-yard-aerial-01.jpg', 'Loading dock perimeter', '2026-02-07 13:10:00+00', 1),
    (7, 4, 'fischer-gate-location-02.jpg', 'Proposed cantilever gate location', '2026-02-07 13:12:00+00', 1),
    (8, 5, 'serrano-patio-01.jpg', 'Patio enclosure concept', '2026-02-08 10:00:00+00', 2);

-- -----------------------------------------------------------------------------
-- PRODUCTS (200+ CATALOG ITEMS)
-- -----------------------------------------------------------------------------
INSERT INTO products (
    id,
    sku,
    name,
    description,
    category,
    unit,
    unit_price,
    cost_price,
    stock_qty,
    active
) VALUES
(
    1, 'CL-MSH-42-9GA-GALV', 'Chain Link Mesh 42in x 50ft 9GA Galvanized', 'Knuckled selvage chain link fabric roll, 42 inch height, 50 foot roll, 9ga wire, galvanized finish.', 'chain-link-mesh', 'roll', 116.30, 86.06, 18, TRUE
),
(
    2, 'CL-MSH-42-9GA-BLK', 'Chain Link Mesh 42in x 50ft 9GA Black', 'Knuckled selvage chain link fabric roll, 42 inch height, 50 foot roll, 9ga wire, black finish.', 'chain-link-mesh', 'roll', 165.15, 122.21, 18, TRUE
),
(
    3, 'CL-MSH-42-9GA-GRN', 'Chain Link Mesh 42in x 50ft 9GA Green', 'Knuckled selvage chain link fabric roll, 42 inch height, 50 foot roll, 9ga wire, green finish.', 'chain-link-mesh', 'roll', 158.17, 117.05, 18, TRUE
),
(
    4, 'CL-MSH-42-9GA-BRN', 'Chain Link Mesh 42in x 50ft 9GA Brown', 'Knuckled selvage chain link fabric roll, 42 inch height, 50 foot roll, 9ga wire, brown finish.', 'chain-link-mesh', 'roll', 161.66, 119.63, 18, TRUE
),
(
    5, 'CL-MSH-42-11G-GALV', 'Chain Link Mesh 42in x 50ft 11G Galvanized', 'Knuckled selvage chain link fabric roll, 42 inch height, 50 foot roll, 11g wire, galvanized finish.', 'chain-link-mesh', 'roll', 103.84, 76.84, 18, TRUE
),
(
    6, 'CL-MSH-42-11G-BLK', 'Chain Link Mesh 42in x 50ft 11G Black', 'Knuckled selvage chain link fabric roll, 42 inch height, 50 foot roll, 11g wire, black finish.', 'chain-link-mesh', 'roll', 147.45, 109.12, 18, TRUE
),
(
    7, 'CL-MSH-42-11G-GRN', 'Chain Link Mesh 42in x 50ft 11G Green', 'Knuckled selvage chain link fabric roll, 42 inch height, 50 foot roll, 11g wire, green finish.', 'chain-link-mesh', 'roll', 141.22, 104.50, 18, TRUE
),
(
    8, 'CL-MSH-42-11G-BRN', 'Chain Link Mesh 42in x 50ft 11G Brown', 'Knuckled selvage chain link fabric roll, 42 inch height, 50 foot roll, 11g wire, brown finish.', 'chain-link-mesh', 'roll', 144.34, 106.81, 18, TRUE
),
(
    9, 'CL-MSH-48-9GA-GALV', 'Chain Link Mesh 48in x 50ft 9GA Galvanized', 'Knuckled selvage chain link fabric roll, 48 inch height, 50 foot roll, 9ga wire, galvanized finish.', 'chain-link-mesh', 'roll', 132.16, 97.80, 18, TRUE
),
(
    10, 'CL-MSH-48-9GA-BLK', 'Chain Link Mesh 48in x 50ft 9GA Black', 'Knuckled selvage chain link fabric roll, 48 inch height, 50 foot roll, 9ga wire, black finish.', 'chain-link-mesh', 'roll', 187.67, 138.87, 18, TRUE
),
(
    11, 'CL-MSH-48-9GA-GRN', 'Chain Link Mesh 48in x 50ft 9GA Green', 'Knuckled selvage chain link fabric roll, 48 inch height, 50 foot roll, 9ga wire, green finish.', 'chain-link-mesh', 'roll', 179.74, 133.01, 18, TRUE
),
(
    12, 'CL-MSH-48-9GA-BRN', 'Chain Link Mesh 48in x 50ft 9GA Brown', 'Knuckled selvage chain link fabric roll, 48 inch height, 50 foot roll, 9ga wire, brown finish.', 'chain-link-mesh', 'roll', 183.70, 135.94, 18, TRUE
),
(
    13, 'CL-MSH-48-11G-GALV', 'Chain Link Mesh 48in x 50ft 11G Galvanized', 'Knuckled selvage chain link fabric roll, 48 inch height, 50 foot roll, 11g wire, galvanized finish.', 'chain-link-mesh', 'roll', 118.00, 87.32, 18, TRUE
),
(
    14, 'CL-MSH-48-11G-BLK', 'Chain Link Mesh 48in x 50ft 11G Black', 'Knuckled selvage chain link fabric roll, 48 inch height, 50 foot roll, 11g wire, black finish.', 'chain-link-mesh', 'roll', 167.56, 123.99, 18, TRUE
),
(
    15, 'CL-MSH-48-11G-GRN', 'Chain Link Mesh 48in x 50ft 11G Green', 'Knuckled selvage chain link fabric roll, 48 inch height, 50 foot roll, 11g wire, green finish.', 'chain-link-mesh', 'roll', 160.48, 118.76, 18, TRUE
),
(
    16, 'CL-MSH-48-11G-BRN', 'Chain Link Mesh 48in x 50ft 11G Brown', 'Knuckled selvage chain link fabric roll, 48 inch height, 50 foot roll, 11g wire, brown finish.', 'chain-link-mesh', 'roll', 164.02, 121.37, 18, TRUE
),
(
    17, 'CL-MSH-60-9GA-GALV', 'Chain Link Mesh 60in x 50ft 9GA Galvanized', 'Knuckled selvage chain link fabric roll, 60 inch height, 50 foot roll, 9ga wire, galvanized finish.', 'chain-link-mesh', 'roll', 163.88, 121.27, 18, TRUE
),
(
    18, 'CL-MSH-60-9GA-BLK', 'Chain Link Mesh 60in x 50ft 9GA Black', 'Knuckled selvage chain link fabric roll, 60 inch height, 50 foot roll, 9ga wire, black finish.', 'chain-link-mesh', 'roll', 232.71, 172.20, 18, TRUE
),
(
    19, 'CL-MSH-60-9GA-GRN', 'Chain Link Mesh 60in x 50ft 9GA Green', 'Knuckled selvage chain link fabric roll, 60 inch height, 50 foot roll, 9ga wire, green finish.', 'chain-link-mesh', 'roll', 222.87, 164.93, 18, TRUE
),
(
    20, 'CL-MSH-60-9GA-BRN', 'Chain Link Mesh 60in x 50ft 9GA Brown', 'Knuckled selvage chain link fabric roll, 60 inch height, 50 foot roll, 9ga wire, brown finish.', 'chain-link-mesh', 'roll', 227.79, 168.57, 18, TRUE
),
(
    21, 'CL-MSH-60-11G-GALV', 'Chain Link Mesh 60in x 50ft 11G Galvanized', 'Knuckled selvage chain link fabric roll, 60 inch height, 50 foot roll, 11g wire, galvanized finish.', 'chain-link-mesh', 'roll', 146.32, 108.28, 18, TRUE
),
(
    22, 'CL-MSH-60-11G-BLK', 'Chain Link Mesh 60in x 50ft 11G Black', 'Knuckled selvage chain link fabric roll, 60 inch height, 50 foot roll, 11g wire, black finish.', 'chain-link-mesh', 'roll', 207.77, 153.75, 18, TRUE
),
(
    23, 'CL-MSH-60-11G-GRN', 'Chain Link Mesh 60in x 50ft 11G Green', 'Knuckled selvage chain link fabric roll, 60 inch height, 50 foot roll, 11g wire, green finish.', 'chain-link-mesh', 'roll', 199.00, 147.26, 18, TRUE
),
(
    24, 'CL-MSH-60-11G-BRN', 'Chain Link Mesh 60in x 50ft 11G Brown', 'Knuckled selvage chain link fabric roll, 60 inch height, 50 foot roll, 11g wire, brown finish.', 'chain-link-mesh', 'roll', 203.38, 150.50, 18, TRUE
),
(
    25, 'CL-MSH-72-9GA-GALV', 'Chain Link Mesh 72in x 50ft 9GA Galvanized', 'Knuckled selvage chain link fabric roll, 72 inch height, 50 foot roll, 9ga wire, galvanized finish.', 'chain-link-mesh', 'roll', 196.92, 145.72, 18, TRUE
),
(
    26, 'CL-MSH-72-9GA-BLK', 'Chain Link Mesh 72in x 50ft 9GA Black', 'Knuckled selvage chain link fabric roll, 72 inch height, 50 foot roll, 9ga wire, black finish.', 'chain-link-mesh', 'roll', 279.62, 206.92, 18, TRUE
),
(
    27, 'CL-MSH-72-9GA-GRN', 'Chain Link Mesh 72in x 50ft 9GA Green', 'Knuckled selvage chain link fabric roll, 72 inch height, 50 foot roll, 9ga wire, green finish.', 'chain-link-mesh', 'roll', 267.81, 198.18, 18, TRUE
),
(
    28, 'CL-MSH-72-9GA-BRN', 'Chain Link Mesh 72in x 50ft 9GA Brown', 'Knuckled selvage chain link fabric roll, 72 inch height, 50 foot roll, 9ga wire, brown finish.', 'chain-link-mesh', 'roll', 273.72, 202.55, 18, TRUE
),
(
    29, 'CL-MSH-72-11G-GALV', 'Chain Link Mesh 72in x 50ft 11G Galvanized', 'Knuckled selvage chain link fabric roll, 72 inch height, 50 foot roll, 11g wire, galvanized finish.', 'chain-link-mesh', 'roll', 175.82, 130.11, 18, TRUE
),
(
    30, 'CL-MSH-72-11G-BLK', 'Chain Link Mesh 72in x 50ft 11G Black', 'Knuckled selvage chain link fabric roll, 72 inch height, 50 foot roll, 11g wire, black finish.', 'chain-link-mesh', 'roll', 249.66, 184.75, 18, TRUE
),
(
    31, 'CL-MSH-72-11G-GRN', 'Chain Link Mesh 72in x 50ft 11G Green', 'Knuckled selvage chain link fabric roll, 72 inch height, 50 foot roll, 11g wire, green finish.', 'chain-link-mesh', 'roll', 239.12, 176.95, 18, TRUE
),
(
    32, 'CL-MSH-72-11G-BRN', 'Chain Link Mesh 72in x 50ft 11G Brown', 'Knuckled selvage chain link fabric roll, 72 inch height, 50 foot roll, 11g wire, brown finish.', 'chain-link-mesh', 'roll', 244.39, 180.85, 18, TRUE
),
(
    33, 'CL-LP-158-6-GALV', 'Chain Link Line Post 1-5/8in x 6ft Galvanized', 'Schedule 40 round steel line post, 1-5/8in diameter, 6 foot length, galvanized.', 'chain-link-post', 'each', 21.50, 15.26, 42, TRUE
),
(
    34, 'CL-LP-158-6-BLK', 'Chain Link Line Post 1-5/8in x 6ft Black Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 6 foot length, black powder coat.', 'chain-link-post', 'each', 27.52, 19.54, 42, TRUE
),
(
    35, 'CL-LP-158-6-GRN', 'Chain Link Line Post 1-5/8in x 6ft Green Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 6 foot length, green powder coat.', 'chain-link-post', 'each', 26.88, 19.08, 42, TRUE
),
(
    36, 'CL-LP-158-6-BRN', 'Chain Link Line Post 1-5/8in x 6ft Brown Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 6 foot length, brown powder coat.', 'chain-link-post', 'each', 27.30, 19.39, 42, TRUE
),
(
    37, 'CL-LP-158-8-GALV', 'Chain Link Line Post 1-5/8in x 8ft Galvanized', 'Schedule 40 round steel line post, 1-5/8in diameter, 8 foot length, galvanized.', 'chain-link-post', 'each', 28.67, 20.35, 42, TRUE
),
(
    38, 'CL-LP-158-8-BLK', 'Chain Link Line Post 1-5/8in x 8ft Black Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 8 foot length, black powder coat.', 'chain-link-post', 'each', 36.69, 26.05, 42, TRUE
),
(
    39, 'CL-LP-158-8-GRN', 'Chain Link Line Post 1-5/8in x 8ft Green Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 8 foot length, green powder coat.', 'chain-link-post', 'each', 35.83, 25.44, 42, TRUE
),
(
    40, 'CL-LP-158-8-BRN', 'Chain Link Line Post 1-5/8in x 8ft Brown Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 8 foot length, brown powder coat.', 'chain-link-post', 'each', 36.41, 25.85, 42, TRUE
),
(
    41, 'CL-LP-158-10-GALV', 'Chain Link Line Post 1-5/8in x 10ft Galvanized', 'Schedule 40 round steel line post, 1-5/8in diameter, 10 foot length, galvanized.', 'chain-link-post', 'each', 35.83, 25.44, 42, TRUE
),
(
    42, 'CL-LP-158-10-BLK', 'Chain Link Line Post 1-5/8in x 10ft Black Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 10 foot length, black powder coat.', 'chain-link-post', 'each', 45.87, 32.57, 42, TRUE
),
(
    43, 'CL-LP-158-10-GRN', 'Chain Link Line Post 1-5/8in x 10ft Green Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 10 foot length, green powder coat.', 'chain-link-post', 'each', 44.79, 31.80, 42, TRUE
),
(
    44, 'CL-LP-158-10-BRN', 'Chain Link Line Post 1-5/8in x 10ft Brown Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 10 foot length, brown powder coat.', 'chain-link-post', 'each', 45.51, 32.31, 42, TRUE
),
(
    45, 'CL-LP-158-12-GALV', 'Chain Link Line Post 1-5/8in x 12ft Galvanized', 'Schedule 40 round steel line post, 1-5/8in diameter, 12 foot length, galvanized.', 'chain-link-post', 'each', 43.00, 30.53, 42, TRUE
),
(
    46, 'CL-LP-158-12-BLK', 'Chain Link Line Post 1-5/8in x 12ft Black Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 12 foot length, black powder coat.', 'chain-link-post', 'each', 55.04, 39.08, 42, TRUE
),
(
    47, 'CL-LP-158-12-GRN', 'Chain Link Line Post 1-5/8in x 12ft Green Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 12 foot length, green powder coat.', 'chain-link-post', 'each', 53.75, 38.16, 42, TRUE
),
(
    48, 'CL-LP-158-12-BRN', 'Chain Link Line Post 1-5/8in x 12ft Brown Powder Coat', 'Schedule 40 round steel line post, 1-5/8in diameter, 12 foot length, brown powder coat.', 'chain-link-post', 'each', 54.61, 38.77, 42, TRUE
),
(
    49, 'CL-LP-187-6-GALV', 'Chain Link Line Post 1-7/8in x 6ft Galvanized', 'Schedule 40 round steel line post, 1-7/8in diameter, 6 foot length, galvanized.', 'chain-link-post', 'each', 25.50, 18.11, 42, TRUE
),
(
    50, 'CL-LP-187-6-BLK', 'Chain Link Line Post 1-7/8in x 6ft Black Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 6 foot length, black powder coat.', 'chain-link-post', 'each', 32.64, 23.17, 42, TRUE
),
(
    51, 'CL-LP-187-6-GRN', 'Chain Link Line Post 1-7/8in x 6ft Green Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 6 foot length, green powder coat.', 'chain-link-post', 'each', 31.88, 22.63, 42, TRUE
),
(
    52, 'CL-LP-187-6-BRN', 'Chain Link Line Post 1-7/8in x 6ft Brown Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 6 foot length, brown powder coat.', 'chain-link-post', 'each', 32.38, 22.99, 42, TRUE
),
(
    53, 'CL-LP-187-8-GALV', 'Chain Link Line Post 1-7/8in x 8ft Galvanized', 'Schedule 40 round steel line post, 1-7/8in diameter, 8 foot length, galvanized.', 'chain-link-post', 'each', 34.00, 24.14, 42, TRUE
),
(
    54, 'CL-LP-187-8-BLK', 'Chain Link Line Post 1-7/8in x 8ft Black Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 8 foot length, black powder coat.', 'chain-link-post', 'each', 43.52, 30.90, 42, TRUE
),
(
    55, 'CL-LP-187-8-GRN', 'Chain Link Line Post 1-7/8in x 8ft Green Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 8 foot length, green powder coat.', 'chain-link-post', 'each', 42.50, 30.17, 42, TRUE
),
(
    56, 'CL-LP-187-8-BRN', 'Chain Link Line Post 1-7/8in x 8ft Brown Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 8 foot length, brown powder coat.', 'chain-link-post', 'each', 43.18, 30.66, 42, TRUE
),
(
    57, 'CL-LP-187-10-GALV', 'Chain Link Line Post 1-7/8in x 10ft Galvanized', 'Schedule 40 round steel line post, 1-7/8in diameter, 10 foot length, galvanized.', 'chain-link-post', 'each', 42.50, 30.17, 42, TRUE
),
(
    58, 'CL-LP-187-10-BLK', 'Chain Link Line Post 1-7/8in x 10ft Black Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 10 foot length, black powder coat.', 'chain-link-post', 'each', 54.40, 38.62, 42, TRUE
),
(
    59, 'CL-LP-187-10-GRN', 'Chain Link Line Post 1-7/8in x 10ft Green Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 10 foot length, green powder coat.', 'chain-link-post', 'each', 53.12, 37.72, 42, TRUE
),
(
    60, 'CL-LP-187-10-BRN', 'Chain Link Line Post 1-7/8in x 10ft Brown Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 10 foot length, brown powder coat.', 'chain-link-post', 'each', 53.98, 38.32, 42, TRUE
),
(
    61, 'CL-LP-187-12-GALV', 'Chain Link Line Post 1-7/8in x 12ft Galvanized', 'Schedule 40 round steel line post, 1-7/8in diameter, 12 foot length, galvanized.', 'chain-link-post', 'each', 51.00, 36.21, 42, TRUE
),
(
    62, 'CL-LP-187-12-BLK', 'Chain Link Line Post 1-7/8in x 12ft Black Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 12 foot length, black powder coat.', 'chain-link-post', 'each', 65.28, 46.35, 42, TRUE
),
(
    63, 'CL-LP-187-12-GRN', 'Chain Link Line Post 1-7/8in x 12ft Green Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 12 foot length, green powder coat.', 'chain-link-post', 'each', 63.75, 45.26, 42, TRUE
),
(
    64, 'CL-LP-187-12-BRN', 'Chain Link Line Post 1-7/8in x 12ft Brown Powder Coat', 'Schedule 40 round steel line post, 1-7/8in diameter, 12 foot length, brown powder coat.', 'chain-link-post', 'each', 64.77, 45.99, 42, TRUE
),
(
    65, 'CL-LP-200-6-GALV', 'Chain Link Line Post 2in x 6ft Galvanized', 'Schedule 40 round steel line post, 2in diameter, 6 foot length, galvanized.', 'chain-link-post', 'each', 29.50, 20.95, 42, TRUE
),
(
    66, 'CL-LP-200-6-BLK', 'Chain Link Line Post 2in x 6ft Black Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 6 foot length, black powder coat.', 'chain-link-post', 'each', 37.76, 26.81, 42, TRUE
),
(
    67, 'CL-LP-200-6-GRN', 'Chain Link Line Post 2in x 6ft Green Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 6 foot length, green powder coat.', 'chain-link-post', 'each', 36.88, 26.18, 42, TRUE
),
(
    68, 'CL-LP-200-6-BRN', 'Chain Link Line Post 2in x 6ft Brown Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 6 foot length, brown powder coat.', 'chain-link-post', 'each', 37.47, 26.60, 42, TRUE
),
(
    69, 'CL-LP-200-8-GALV', 'Chain Link Line Post 2in x 8ft Galvanized', 'Schedule 40 round steel line post, 2in diameter, 8 foot length, galvanized.', 'chain-link-post', 'each', 39.33, 27.93, 42, TRUE
),
(
    70, 'CL-LP-200-8-BLK', 'Chain Link Line Post 2in x 8ft Black Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 8 foot length, black powder coat.', 'chain-link-post', 'each', 50.35, 35.75, 42, TRUE
),
(
    71, 'CL-LP-200-8-GRN', 'Chain Link Line Post 2in x 8ft Green Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 8 foot length, green powder coat.', 'chain-link-post', 'each', 49.17, 34.91, 42, TRUE
),
(
    72, 'CL-LP-200-8-BRN', 'Chain Link Line Post 2in x 8ft Brown Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 8 foot length, brown powder coat.', 'chain-link-post', 'each', 49.95, 35.47, 42, TRUE
),
(
    73, 'CL-LP-200-10-GALV', 'Chain Link Line Post 2in x 10ft Galvanized', 'Schedule 40 round steel line post, 2in diameter, 10 foot length, galvanized.', 'chain-link-post', 'each', 49.17, 34.91, 42, TRUE
),
(
    74, 'CL-LP-200-10-BLK', 'Chain Link Line Post 2in x 10ft Black Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 10 foot length, black powder coat.', 'chain-link-post', 'each', 62.93, 44.68, 42, TRUE
),
(
    75, 'CL-LP-200-10-GRN', 'Chain Link Line Post 2in x 10ft Green Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 10 foot length, green powder coat.', 'chain-link-post', 'each', 61.46, 43.64, 42, TRUE
),
(
    76, 'CL-LP-200-10-BRN', 'Chain Link Line Post 2in x 10ft Brown Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 10 foot length, brown powder coat.', 'chain-link-post', 'each', 62.44, 44.33, 42, TRUE
),
(
    77, 'CL-LP-200-12-GALV', 'Chain Link Line Post 2in x 12ft Galvanized', 'Schedule 40 round steel line post, 2in diameter, 12 foot length, galvanized.', 'chain-link-post', 'each', 59.00, 41.89, 42, TRUE
),
(
    78, 'CL-LP-200-12-BLK', 'Chain Link Line Post 2in x 12ft Black Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 12 foot length, black powder coat.', 'chain-link-post', 'each', 75.52, 53.62, 42, TRUE
),
(
    79, 'CL-LP-200-12-GRN', 'Chain Link Line Post 2in x 12ft Green Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 12 foot length, green powder coat.', 'chain-link-post', 'each', 73.75, 52.36, 42, TRUE
),
(
    80, 'CL-LP-200-12-BRN', 'Chain Link Line Post 2in x 12ft Brown Powder Coat', 'Schedule 40 round steel line post, 2in diameter, 12 foot length, brown powder coat.', 'chain-link-post', 'each', 74.93, 53.20, 42, TRUE
),
(
    81, 'CL-TP-200-8-GALV', 'Chain Link Terminal Post 2in x 8ft Galvanized', 'Heavy wall terminal/corner/end post, 2in diameter, 8 foot length, galvanized.', 'chain-link-post', 'each', 35.00, 25.20, 28, TRUE
),
(
    82, 'CL-TP-200-8-BLK', 'Chain Link Terminal Post 2in x 8ft Black Powder Coat', 'Heavy wall terminal/corner/end post, 2in diameter, 8 foot length, black powder coat.', 'chain-link-post', 'each', 44.80, 32.26, 28, TRUE
),
(
    83, 'CL-TP-200-8-GRN', 'Chain Link Terminal Post 2in x 8ft Green Powder Coat', 'Heavy wall terminal/corner/end post, 2in diameter, 8 foot length, green powder coat.', 'chain-link-post', 'each', 43.75, 31.50, 28, TRUE
),
(
    84, 'CL-TP-200-8-BRN', 'Chain Link Terminal Post 2in x 8ft Brown Powder Coat', 'Heavy wall terminal/corner/end post, 2in diameter, 8 foot length, brown powder coat.', 'chain-link-post', 'each', 44.45, 32.00, 28, TRUE
),
(
    85, 'CL-TP-200-10-GALV', 'Chain Link Terminal Post 2in x 10ft Galvanized', 'Heavy wall terminal/corner/end post, 2in diameter, 10 foot length, galvanized.', 'chain-link-post', 'each', 43.75, 31.50, 28, TRUE
),
(
    86, 'CL-TP-200-10-BLK', 'Chain Link Terminal Post 2in x 10ft Black Powder Coat', 'Heavy wall terminal/corner/end post, 2in diameter, 10 foot length, black powder coat.', 'chain-link-post', 'each', 56.00, 40.32, 28, TRUE
),
(
    87, 'CL-TP-200-10-GRN', 'Chain Link Terminal Post 2in x 10ft Green Powder Coat', 'Heavy wall terminal/corner/end post, 2in diameter, 10 foot length, green powder coat.', 'chain-link-post', 'each', 54.69, 39.38, 28, TRUE
),
(
    88, 'CL-TP-200-10-BRN', 'Chain Link Terminal Post 2in x 10ft Brown Powder Coat', 'Heavy wall terminal/corner/end post, 2in diameter, 10 foot length, brown powder coat.', 'chain-link-post', 'each', 55.56, 40.00, 28, TRUE
),
(
    89, 'CL-TP-200-12-GALV', 'Chain Link Terminal Post 2in x 12ft Galvanized', 'Heavy wall terminal/corner/end post, 2in diameter, 12 foot length, galvanized.', 'chain-link-post', 'each', 52.50, 37.80, 28, TRUE
),
(
    90, 'CL-TP-200-12-BLK', 'Chain Link Terminal Post 2in x 12ft Black Powder Coat', 'Heavy wall terminal/corner/end post, 2in diameter, 12 foot length, black powder coat.', 'chain-link-post', 'each', 67.20, 48.38, 28, TRUE
),
(
    91, 'CL-TP-200-12-GRN', 'Chain Link Terminal Post 2in x 12ft Green Powder Coat', 'Heavy wall terminal/corner/end post, 2in diameter, 12 foot length, green powder coat.', 'chain-link-post', 'each', 65.62, 47.25, 28, TRUE
),
(
    92, 'CL-TP-200-12-BRN', 'Chain Link Terminal Post 2in x 12ft Brown Powder Coat', 'Heavy wall terminal/corner/end post, 2in diameter, 12 foot length, brown powder coat.', 'chain-link-post', 'each', 66.67, 48.01, 28, TRUE
),
(
    93, 'CL-TP-250-8-GALV', 'Chain Link Terminal Post 2-1/2in x 8ft Galvanized', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 8 foot length, galvanized.', 'chain-link-post', 'each', 46.00, 33.12, 28, TRUE
),
(
    94, 'CL-TP-250-8-BLK', 'Chain Link Terminal Post 2-1/2in x 8ft Black Powder Coat', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 8 foot length, black powder coat.', 'chain-link-post', 'each', 58.88, 42.39, 28, TRUE
),
(
    95, 'CL-TP-250-8-GRN', 'Chain Link Terminal Post 2-1/2in x 8ft Green Powder Coat', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 8 foot length, green powder coat.', 'chain-link-post', 'each', 57.50, 41.40, 28, TRUE
),
(
    96, 'CL-TP-250-8-BRN', 'Chain Link Terminal Post 2-1/2in x 8ft Brown Powder Coat', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 8 foot length, brown powder coat.', 'chain-link-post', 'each', 58.42, 42.06, 28, TRUE
),
(
    97, 'CL-TP-250-10-GALV', 'Chain Link Terminal Post 2-1/2in x 10ft Galvanized', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 10 foot length, galvanized.', 'chain-link-post', 'each', 57.50, 41.40, 28, TRUE
),
(
    98, 'CL-TP-250-10-BLK', 'Chain Link Terminal Post 2-1/2in x 10ft Black Powder Coat', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 10 foot length, black powder coat.', 'chain-link-post', 'each', 73.60, 52.99, 28, TRUE
),
(
    99, 'CL-TP-250-10-GRN', 'Chain Link Terminal Post 2-1/2in x 10ft Green Powder Coat', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 10 foot length, green powder coat.', 'chain-link-post', 'each', 71.88, 51.75, 28, TRUE
),
(
    100, 'CL-TP-250-10-BRN', 'Chain Link Terminal Post 2-1/2in x 10ft Brown Powder Coat', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 10 foot length, brown powder coat.', 'chain-link-post', 'each', 73.03, 52.58, 28, TRUE
),
(
    101, 'CL-TP-250-12-GALV', 'Chain Link Terminal Post 2-1/2in x 12ft Galvanized', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 12 foot length, galvanized.', 'chain-link-post', 'each', 69.00, 49.68, 28, TRUE
),
(
    102, 'CL-TP-250-12-BLK', 'Chain Link Terminal Post 2-1/2in x 12ft Black Powder Coat', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 12 foot length, black powder coat.', 'chain-link-post', 'each', 88.32, 63.59, 28, TRUE
),
(
    103, 'CL-TP-250-12-GRN', 'Chain Link Terminal Post 2-1/2in x 12ft Green Powder Coat', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 12 foot length, green powder coat.', 'chain-link-post', 'each', 86.25, 62.10, 28, TRUE
),
(
    104, 'CL-TP-250-12-BRN', 'Chain Link Terminal Post 2-1/2in x 12ft Brown Powder Coat', 'Heavy wall terminal/corner/end post, 2-1/2in diameter, 12 foot length, brown powder coat.', 'chain-link-post', 'each', 87.63, 63.09, 28, TRUE
),
(
    105, 'CL-TP-300-8-GALV', 'Chain Link Terminal Post 3in x 8ft Galvanized', 'Heavy wall terminal/corner/end post, 3in diameter, 8 foot length, galvanized.', 'chain-link-post', 'each', 58.00, 41.76, 28, TRUE
),
(
    106, 'CL-TP-300-8-BLK', 'Chain Link Terminal Post 3in x 8ft Black Powder Coat', 'Heavy wall terminal/corner/end post, 3in diameter, 8 foot length, black powder coat.', 'chain-link-post', 'each', 74.24, 53.45, 28, TRUE
),
(
    107, 'CL-TP-300-8-GRN', 'Chain Link Terminal Post 3in x 8ft Green Powder Coat', 'Heavy wall terminal/corner/end post, 3in diameter, 8 foot length, green powder coat.', 'chain-link-post', 'each', 72.50, 52.20, 28, TRUE
),
(
    108, 'CL-TP-300-8-BRN', 'Chain Link Terminal Post 3in x 8ft Brown Powder Coat', 'Heavy wall terminal/corner/end post, 3in diameter, 8 foot length, brown powder coat.', 'chain-link-post', 'each', 73.66, 53.04, 28, TRUE
),
(
    109, 'CL-TP-300-10-GALV', 'Chain Link Terminal Post 3in x 10ft Galvanized', 'Heavy wall terminal/corner/end post, 3in diameter, 10 foot length, galvanized.', 'chain-link-post', 'each', 72.50, 52.20, 28, TRUE
),
(
    110, 'CL-TP-300-10-BLK', 'Chain Link Terminal Post 3in x 10ft Black Powder Coat', 'Heavy wall terminal/corner/end post, 3in diameter, 10 foot length, black powder coat.', 'chain-link-post', 'each', 92.80, 66.82, 28, TRUE
),
(
    111, 'CL-TP-300-10-GRN', 'Chain Link Terminal Post 3in x 10ft Green Powder Coat', 'Heavy wall terminal/corner/end post, 3in diameter, 10 foot length, green powder coat.', 'chain-link-post', 'each', 90.62, 65.25, 28, TRUE
),
(
    112, 'CL-TP-300-10-BRN', 'Chain Link Terminal Post 3in x 10ft Brown Powder Coat', 'Heavy wall terminal/corner/end post, 3in diameter, 10 foot length, brown powder coat.', 'chain-link-post', 'each', 92.08, 66.29, 28, TRUE
),
(
    113, 'CL-TP-300-12-GALV', 'Chain Link Terminal Post 3in x 12ft Galvanized', 'Heavy wall terminal/corner/end post, 3in diameter, 12 foot length, galvanized.', 'chain-link-post', 'each', 87.00, 62.64, 28, TRUE
),
(
    114, 'CL-TP-300-12-BLK', 'Chain Link Terminal Post 3in x 12ft Black Powder Coat', 'Heavy wall terminal/corner/end post, 3in diameter, 12 foot length, black powder coat.', 'chain-link-post', 'each', 111.36, 80.18, 28, TRUE
),
(
    115, 'CL-TP-300-12-GRN', 'Chain Link Terminal Post 3in x 12ft Green Powder Coat', 'Heavy wall terminal/corner/end post, 3in diameter, 12 foot length, green powder coat.', 'chain-link-post', 'each', 108.75, 78.30, 28, TRUE
),
(
    116, 'CL-TP-300-12-BRN', 'Chain Link Terminal Post 3in x 12ft Brown Powder Coat', 'Heavy wall terminal/corner/end post, 3in diameter, 12 foot length, brown powder coat.', 'chain-link-post', 'each', 110.49, 79.55, 28, TRUE
),
(
    117, 'CL-TR-1315-10-GALV', 'Chain Link Top Rail 1-3/8in x 10ft Galvanized', 'Swedged top rail pipe, 1-3/8in diameter, 10 foot stick, galvanized.', 'chain-link-rail', 'each', 21.50, 15.70, 60, TRUE
),
(
    118, 'CL-TR-1315-10-BLK', 'Chain Link Top Rail 1-3/8in x 10ft Black Powder Coat', 'Swedged top rail pipe, 1-3/8in diameter, 10 foot stick, black powder coat.', 'chain-link-rail', 'each', 27.52, 20.09, 60, TRUE
),
(
    119, 'CL-TR-1315-10-GRN', 'Chain Link Top Rail 1-3/8in x 10ft Green Powder Coat', 'Swedged top rail pipe, 1-3/8in diameter, 10 foot stick, green powder coat.', 'chain-link-rail', 'each', 26.88, 19.62, 60, TRUE
),
(
    120, 'CL-TR-1315-10-BRN', 'Chain Link Top Rail 1-3/8in x 10ft Brown Powder Coat', 'Swedged top rail pipe, 1-3/8in diameter, 10 foot stick, brown powder coat.', 'chain-link-rail', 'each', 27.30, 19.93, 60, TRUE
),
(
    121, 'CL-TR-1315-21-GALV', 'Chain Link Top Rail 1-3/8in x 21ft Galvanized', 'Swedged top rail pipe, 1-3/8in diameter, 21 foot stick, galvanized.', 'chain-link-rail', 'each', 45.15, 32.96, 60, TRUE
),
(
    122, 'CL-TR-1315-21-BLK', 'Chain Link Top Rail 1-3/8in x 21ft Black Powder Coat', 'Swedged top rail pipe, 1-3/8in diameter, 21 foot stick, black powder coat.', 'chain-link-rail', 'each', 57.79, 42.19, 60, TRUE
),
(
    123, 'CL-TR-1315-21-GRN', 'Chain Link Top Rail 1-3/8in x 21ft Green Powder Coat', 'Swedged top rail pipe, 1-3/8in diameter, 21 foot stick, green powder coat.', 'chain-link-rail', 'each', 56.44, 41.20, 60, TRUE
),
(
    124, 'CL-TR-1315-21-BRN', 'Chain Link Top Rail 1-3/8in x 21ft Brown Powder Coat', 'Swedged top rail pipe, 1-3/8in diameter, 21 foot stick, brown powder coat.', 'chain-link-rail', 'each', 57.34, 41.86, 60, TRUE
),
(
    125, 'CL-TR-1660-10-GALV', 'Chain Link Top Rail 1-5/8in x 10ft Galvanized', 'Swedged top rail pipe, 1-5/8in diameter, 10 foot stick, galvanized.', 'chain-link-rail', 'each', 27.00, 19.71, 60, TRUE
),
(
    126, 'CL-TR-1660-10-BLK', 'Chain Link Top Rail 1-5/8in x 10ft Black Powder Coat', 'Swedged top rail pipe, 1-5/8in diameter, 10 foot stick, black powder coat.', 'chain-link-rail', 'each', 34.56, 25.23, 60, TRUE
),
(
    127, 'CL-TR-1660-10-GRN', 'Chain Link Top Rail 1-5/8in x 10ft Green Powder Coat', 'Swedged top rail pipe, 1-5/8in diameter, 10 foot stick, green powder coat.', 'chain-link-rail', 'each', 33.75, 24.64, 60, TRUE
),
(
    128, 'CL-TR-1660-10-BRN', 'Chain Link Top Rail 1-5/8in x 10ft Brown Powder Coat', 'Swedged top rail pipe, 1-5/8in diameter, 10 foot stick, brown powder coat.', 'chain-link-rail', 'each', 34.29, 25.03, 60, TRUE
),
(
    129, 'CL-TR-1660-21-GALV', 'Chain Link Top Rail 1-5/8in x 21ft Galvanized', 'Swedged top rail pipe, 1-5/8in diameter, 21 foot stick, galvanized.', 'chain-link-rail', 'each', 56.70, 41.39, 60, TRUE
),
(
    130, 'CL-TR-1660-21-BLK', 'Chain Link Top Rail 1-5/8in x 21ft Black Powder Coat', 'Swedged top rail pipe, 1-5/8in diameter, 21 foot stick, black powder coat.', 'chain-link-rail', 'each', 72.58, 52.98, 60, TRUE
),
(
    131, 'CL-TR-1660-21-GRN', 'Chain Link Top Rail 1-5/8in x 21ft Green Powder Coat', 'Swedged top rail pipe, 1-5/8in diameter, 21 foot stick, green powder coat.', 'chain-link-rail', 'each', 70.88, 51.74, 60, TRUE
),
(
    132, 'CL-TR-1660-21-BRN', 'Chain Link Top Rail 1-5/8in x 21ft Brown Powder Coat', 'Swedged top rail pipe, 1-5/8in diameter, 21 foot stick, brown powder coat.', 'chain-link-rail', 'each', 72.01, 52.57, 60, TRUE
),
(
    133, 'CL-TR-1875-10-GALV', 'Chain Link Top Rail 1-7/8in x 10ft Galvanized', 'Swedged top rail pipe, 1-7/8in diameter, 10 foot stick, galvanized.', 'chain-link-rail', 'each', 33.50, 24.45, 60, TRUE
),
(
    134, 'CL-TR-1875-10-BLK', 'Chain Link Top Rail 1-7/8in x 10ft Black Powder Coat', 'Swedged top rail pipe, 1-7/8in diameter, 10 foot stick, black powder coat.', 'chain-link-rail', 'each', 42.88, 31.30, 60, TRUE
),
(
    135, 'CL-TR-1875-10-GRN', 'Chain Link Top Rail 1-7/8in x 10ft Green Powder Coat', 'Swedged top rail pipe, 1-7/8in diameter, 10 foot stick, green powder coat.', 'chain-link-rail', 'each', 41.88, 30.57, 60, TRUE
),
(
    136, 'CL-TR-1875-10-BRN', 'Chain Link Top Rail 1-7/8in x 10ft Brown Powder Coat', 'Swedged top rail pipe, 1-7/8in diameter, 10 foot stick, brown powder coat.', 'chain-link-rail', 'each', 42.55, 31.06, 60, TRUE
),
(
    137, 'CL-TR-1875-21-GALV', 'Chain Link Top Rail 1-7/8in x 21ft Galvanized', 'Swedged top rail pipe, 1-7/8in diameter, 21 foot stick, galvanized.', 'chain-link-rail', 'each', 70.35, 51.36, 60, TRUE
),
(
    138, 'CL-TR-1875-21-BLK', 'Chain Link Top Rail 1-7/8in x 21ft Black Powder Coat', 'Swedged top rail pipe, 1-7/8in diameter, 21 foot stick, black powder coat.', 'chain-link-rail', 'each', 90.05, 65.74, 60, TRUE
),
(
    139, 'CL-TR-1875-21-GRN', 'Chain Link Top Rail 1-7/8in x 21ft Green Powder Coat', 'Swedged top rail pipe, 1-7/8in diameter, 21 foot stick, green powder coat.', 'chain-link-rail', 'each', 87.94, 64.19, 60, TRUE
),
(
    140, 'CL-TR-1875-21-BRN', 'Chain Link Top Rail 1-7/8in x 21ft Brown Powder Coat', 'Swedged top rail pipe, 1-7/8in diameter, 21 foot stick, brown powder coat.', 'chain-link-rail', 'each', 89.34, 65.22, 60, TRUE
),
(
    141, 'CL-FIT-TBND-GALV', 'Tension Band Galvanized', 'Chain link fitting: tension band with galvanized finish.', 'chain-link-fitting', 'each', 1.95, 1.33, 150, TRUE
),
(
    142, 'CL-FIT-BBND-GALV', 'Brace Band Galvanized', 'Chain link fitting: brace band with galvanized finish.', 'chain-link-fitting', 'each', 2.25, 1.53, 150, TRUE
),
(
    143, 'CL-FIT-REND-GALV', 'Rail End Galvanized', 'Chain link fitting: rail end with galvanized finish.', 'chain-link-fitting', 'each', 3.15, 2.14, 150, TRUE
),
(
    144, 'CL-FIT-LCAP-GALV', 'Loop Cap Galvanized', 'Chain link fitting: loop cap with galvanized finish.', 'chain-link-fitting', 'each', 1.65, 1.12, 150, TRUE
),
(
    145, 'CL-FIT-DCAP-GALV', 'Dome Cap Galvanized', 'Chain link fitting: dome cap with galvanized finish.', 'chain-link-fitting', 'each', 2.85, 1.94, 150, TRUE
),
(
    146, 'CL-FIT-TCAP-GALV', 'Terminal Cap Galvanized', 'Chain link fitting: terminal cap with galvanized finish.', 'chain-link-fitting', 'each', 3.75, 2.55, 150, TRUE
),
(
    147, 'CL-FIT-TBAR48-GALV', 'Tension Bar 48in Galvanized', 'Chain link fitting: tension bar 48in with galvanized finish.', 'chain-link-fitting', 'each', 10.95, 7.45, 150, TRUE
),
(
    148, 'CL-FIT-TBAR72-GALV', 'Tension Bar 72in Galvanized', 'Chain link fitting: tension bar 72in with galvanized finish.', 'chain-link-fitting', 'each', 15.25, 10.37, 150, TRUE
),
(
    149, 'CL-FIT-CBOLT-GALV', 'Carriage Bolt 5/16 x 1-1/4 Galvanized', 'Chain link fitting: carriage bolt 5/16 x 1-1/4 with galvanized finish.', 'chain-link-fitting', 'each', 0.42, 0.29, 150, TRUE
),
(
    150, 'CL-FIT-HOGR100-GALV', 'Hog Ring Pack 100 Galvanized', 'Chain link fitting: hog ring pack 100 with galvanized finish.', 'chain-link-fitting', 'each', 8.95, 6.09, 150, TRUE
),
(
    151, 'CL-FIT-TRUSS-GALV', 'Truss Rod Assembly Galvanized', 'Chain link fitting: truss rod assembly with galvanized finish.', 'chain-link-fitting', 'each', 19.50, 13.26, 150, TRUE
),
(
    152, 'CL-FIT-BARB3-GALV', 'Barb Arm 3-Wire Galvanized', 'Chain link fitting: barb arm 3-wire with galvanized finish.', 'chain-link-fitting', 'each', 14.50, 9.86, 150, TRUE
),
(
    153, 'CL-FIT-TBND-BLK', 'Tension Band Black Powder Coat', 'Chain link fitting: tension band with black powder coat finish.', 'chain-link-fitting', 'each', 1.95, 1.33, 150, TRUE
),
(
    154, 'CL-FIT-BBND-BLK', 'Brace Band Black Powder Coat', 'Chain link fitting: brace band with black powder coat finish.', 'chain-link-fitting', 'each', 2.88, 1.96, 150, TRUE
),
(
    155, 'CL-FIT-REND-BLK', 'Rail End Black Powder Coat', 'Chain link fitting: rail end with black powder coat finish.', 'chain-link-fitting', 'each', 4.03, 2.74, 150, TRUE
),
(
    156, 'CL-FIT-LCAP-BLK', 'Loop Cap Black Powder Coat', 'Chain link fitting: loop cap with black powder coat finish.', 'chain-link-fitting', 'each', 2.11, 1.44, 150, TRUE
),
(
    157, 'CL-FIT-DCAP-BLK', 'Dome Cap Black Powder Coat', 'Chain link fitting: dome cap with black powder coat finish.', 'chain-link-fitting', 'each', 3.65, 2.48, 150, TRUE
),
(
    158, 'CL-FIT-TCAP-BLK', 'Terminal Cap Black Powder Coat', 'Chain link fitting: terminal cap with black powder coat finish.', 'chain-link-fitting', 'each', 3.75, 2.55, 150, TRUE
),
(
    159, 'CL-FIT-TBAR48-BLK', 'Tension Bar 48in Black Powder Coat', 'Chain link fitting: tension bar 48in with black powder coat finish.', 'chain-link-fitting', 'each', 10.95, 7.45, 150, TRUE
),
(
    160, 'CL-FIT-TBAR72-BLK', 'Tension Bar 72in Black Powder Coat', 'Chain link fitting: tension bar 72in with black powder coat finish.', 'chain-link-fitting', 'each', 15.25, 10.37, 150, TRUE
),
(
    161, 'CL-FIT-CBOLT-BLK', 'Carriage Bolt 5/16 x 1-1/4 Black Powder Coat', 'Chain link fitting: carriage bolt 5/16 x 1-1/4 with black powder coat finish.', 'chain-link-fitting', 'each', 0.54, 0.37, 150, TRUE
),
(
    162, 'CL-FIT-HOGR100-BLK', 'Hog Ring Pack 100 Black Powder Coat', 'Chain link fitting: hog ring pack 100 with black powder coat finish.', 'chain-link-fitting', 'each', 11.46, 7.79, 150, TRUE
),
(
    163, 'CL-FIT-TRUSS-BLK', 'Truss Rod Assembly Black Powder Coat', 'Chain link fitting: truss rod assembly with black powder coat finish.', 'chain-link-fitting', 'each', 19.50, 13.26, 150, TRUE
),
(
    164, 'CL-FIT-BARB3-BLK', 'Barb Arm 3-Wire Black Powder Coat', 'Chain link fitting: barb arm 3-wire with black powder coat finish.', 'chain-link-fitting', 'each', 18.56, 12.62, 150, TRUE
),
(
    165, 'CL-FIT-TBND-GRN', 'Tension Band Green Powder Coat', 'Chain link fitting: tension band with green powder coat finish.', 'chain-link-fitting', 'each', 1.95, 1.33, 150, TRUE
),
(
    166, 'CL-FIT-BBND-GRN', 'Brace Band Green Powder Coat', 'Chain link fitting: brace band with green powder coat finish.', 'chain-link-fitting', 'each', 2.81, 1.91, 150, TRUE
),
(
    167, 'CL-FIT-REND-GRN', 'Rail End Green Powder Coat', 'Chain link fitting: rail end with green powder coat finish.', 'chain-link-fitting', 'each', 3.94, 2.68, 150, TRUE
),
(
    168, 'CL-FIT-LCAP-GRN', 'Loop Cap Green Powder Coat', 'Chain link fitting: loop cap with green powder coat finish.', 'chain-link-fitting', 'each', 2.06, 1.40, 150, TRUE
),
(
    169, 'CL-FIT-DCAP-GRN', 'Dome Cap Green Powder Coat', 'Chain link fitting: dome cap with green powder coat finish.', 'chain-link-fitting', 'each', 3.56, 2.42, 150, TRUE
),
(
    170, 'CL-FIT-TCAP-GRN', 'Terminal Cap Green Powder Coat', 'Chain link fitting: terminal cap with green powder coat finish.', 'chain-link-fitting', 'each', 3.75, 2.55, 150, TRUE
),
(
    171, 'CL-FIT-TBAR48-GRN', 'Tension Bar 48in Green Powder Coat', 'Chain link fitting: tension bar 48in with green powder coat finish.', 'chain-link-fitting', 'each', 10.95, 7.45, 150, TRUE
),
(
    172, 'CL-FIT-TBAR72-GRN', 'Tension Bar 72in Green Powder Coat', 'Chain link fitting: tension bar 72in with green powder coat finish.', 'chain-link-fitting', 'each', 15.25, 10.37, 150, TRUE
),
(
    173, 'CL-FIT-CBOLT-GRN', 'Carriage Bolt 5/16 x 1-1/4 Green Powder Coat', 'Chain link fitting: carriage bolt 5/16 x 1-1/4 with green powder coat finish.', 'chain-link-fitting', 'each', 0.53, 0.36, 150, TRUE
),
(
    174, 'CL-FIT-HOGR100-GRN', 'Hog Ring Pack 100 Green Powder Coat', 'Chain link fitting: hog ring pack 100 with green powder coat finish.', 'chain-link-fitting', 'each', 11.19, 7.61, 150, TRUE
),
(
    175, 'CL-FIT-TRUSS-GRN', 'Truss Rod Assembly Green Powder Coat', 'Chain link fitting: truss rod assembly with green powder coat finish.', 'chain-link-fitting', 'each', 19.50, 13.26, 150, TRUE
),
(
    176, 'CL-FIT-BARB3-GRN', 'Barb Arm 3-Wire Green Powder Coat', 'Chain link fitting: barb arm 3-wire with green powder coat finish.', 'chain-link-fitting', 'each', 18.12, 12.33, 150, TRUE
),
(
    177, 'CL-FIT-TBND-BRN', 'Tension Band Brown Powder Coat', 'Chain link fitting: tension band with brown powder coat finish.', 'chain-link-fitting', 'each', 1.95, 1.33, 150, TRUE
),
(
    178, 'CL-FIT-BBND-BRN', 'Brace Band Brown Powder Coat', 'Chain link fitting: brace band with brown powder coat finish.', 'chain-link-fitting', 'each', 2.86, 1.94, 150, TRUE
),
(
    179, 'CL-FIT-REND-BRN', 'Rail End Brown Powder Coat', 'Chain link fitting: rail end with brown powder coat finish.', 'chain-link-fitting', 'each', 4.00, 2.72, 150, TRUE
),
(
    180, 'CL-FIT-LCAP-BRN', 'Loop Cap Brown Powder Coat', 'Chain link fitting: loop cap with brown powder coat finish.', 'chain-link-fitting', 'each', 2.10, 1.42, 150, TRUE
),
(
    181, 'CL-FIT-DCAP-BRN', 'Dome Cap Brown Powder Coat', 'Chain link fitting: dome cap with brown powder coat finish.', 'chain-link-fitting', 'each', 3.62, 2.46, 150, TRUE
),
(
    182, 'CL-FIT-TCAP-BRN', 'Terminal Cap Brown Powder Coat', 'Chain link fitting: terminal cap with brown powder coat finish.', 'chain-link-fitting', 'each', 3.75, 2.55, 150, TRUE
),
(
    183, 'CL-FIT-TBAR48-BRN', 'Tension Bar 48in Brown Powder Coat', 'Chain link fitting: tension bar 48in with brown powder coat finish.', 'chain-link-fitting', 'each', 10.95, 7.45, 150, TRUE
),
(
    184, 'CL-FIT-TBAR72-BRN', 'Tension Bar 72in Brown Powder Coat', 'Chain link fitting: tension bar 72in with brown powder coat finish.', 'chain-link-fitting', 'each', 15.25, 10.37, 150, TRUE
),
(
    185, 'CL-FIT-CBOLT-BRN', 'Carriage Bolt 5/16 x 1-1/4 Brown Powder Coat', 'Chain link fitting: carriage bolt 5/16 x 1-1/4 with brown powder coat finish.', 'chain-link-fitting', 'each', 0.53, 0.36, 150, TRUE
),
(
    186, 'CL-FIT-HOGR100-BRN', 'Hog Ring Pack 100 Brown Powder Coat', 'Chain link fitting: hog ring pack 100 with brown powder coat finish.', 'chain-link-fitting', 'each', 11.37, 7.73, 150, TRUE
),
(
    187, 'CL-FIT-TRUSS-BRN', 'Truss Rod Assembly Brown Powder Coat', 'Chain link fitting: truss rod assembly with brown powder coat finish.', 'chain-link-fitting', 'each', 19.50, 13.26, 150, TRUE
),
(
    188, 'CL-FIT-BARB3-BRN', 'Barb Arm 3-Wire Brown Powder Coat', 'Chain link fitting: barb arm 3-wire with brown powder coat finish.', 'chain-link-fitting', 'each', 18.41, 12.52, 150, TRUE
),
(
    189, 'WD-PKT-CEDAR-DE-4', 'Western Red Cedar Dog Ear Picket 4ft', 'dog ear fence picket, approximately 5.5 inch face width, 4 foot nominal length, western red cedar.', 'wood-picket', 'each', 2.15, 1.42, 900, TRUE
),
(
    190, 'WD-PKT-CEDAR-DE-6', 'Western Red Cedar Dog Ear Picket 6ft', 'dog ear fence picket, approximately 5.5 inch face width, 6 foot nominal length, western red cedar.', 'wood-picket', 'each', 3.22, 2.13, 900, TRUE
),
(
    191, 'WD-PKT-CEDAR-DE-8', 'Western Red Cedar Dog Ear Picket 8ft', 'dog ear fence picket, approximately 5.5 inch face width, 8 foot nominal length, western red cedar.', 'wood-picket', 'each', 4.30, 2.84, 900, TRUE
),
(
    192, 'WD-PKT-CEDAR-FP-4', 'Western Red Cedar Flat Top Picket 4ft', 'flat top fence picket, approximately 5.5 inch face width, 4 foot nominal length, western red cedar.', 'wood-picket', 'each', 2.15, 1.42, 900, TRUE
),
(
    193, 'WD-PKT-CEDAR-FP-6', 'Western Red Cedar Flat Top Picket 6ft', 'flat top fence picket, approximately 5.5 inch face width, 6 foot nominal length, western red cedar.', 'wood-picket', 'each', 3.22, 2.13, 900, TRUE
),
(
    194, 'WD-PKT-CEDAR-SP-6', 'Western Red Cedar Shadowbox Picket 6ft', 'shadowbox fence picket, approximately 5.5 inch face width, 6 foot nominal length, western red cedar.', 'wood-picket', 'each', 5.18, 3.42, 900, TRUE
),
(
    195, 'WD-PKT-CEDAR-BOB-6', 'Western Red Cedar Board on Board Picket 6ft', 'board on board fence picket, approximately 7.25 inch face width, 6 foot nominal length, western red cedar.', 'wood-picket', 'each', 5.18, 3.42, 900, TRUE
),
(
    196, 'WD-PKT-PT-DE-4', 'Pressure Treated Pine Dog Ear Picket 4ft', 'dog ear fence picket, approximately 5.5 inch face width, 4 foot nominal length, pressure treated pine.', 'wood-picket', 'each', 1.63, 1.08, 900, TRUE
),
(
    197, 'WD-PKT-PT-DE-6', 'Pressure Treated Pine Dog Ear Picket 6ft', 'dog ear fence picket, approximately 5.5 inch face width, 6 foot nominal length, pressure treated pine.', 'wood-picket', 'each', 2.45, 1.62, 900, TRUE
),
(
    198, 'WD-PKT-PT-DE-8', 'Pressure Treated Pine Dog Ear Picket 8ft', 'dog ear fence picket, approximately 5.5 inch face width, 8 foot nominal length, pressure treated pine.', 'wood-picket', 'each', 3.27, 2.16, 900, TRUE
),
(
    199, 'WD-PKT-PT-FP-4', 'Pressure Treated Pine Flat Top Picket 4ft', 'flat top fence picket, approximately 5.5 inch face width, 4 foot nominal length, pressure treated pine.', 'wood-picket', 'each', 1.63, 1.08, 900, TRUE
),
(
    200, 'WD-PKT-PT-FP-6', 'Pressure Treated Pine Flat Top Picket 6ft', 'flat top fence picket, approximately 5.5 inch face width, 6 foot nominal length, pressure treated pine.', 'wood-picket', 'each', 2.45, 1.62, 900, TRUE
),
(
    201, 'WD-PKT-PT-SP-6', 'Pressure Treated Pine Shadowbox Picket 6ft', 'shadowbox fence picket, approximately 5.5 inch face width, 6 foot nominal length, pressure treated pine.', 'wood-picket', 'each', 3.93, 2.60, 900, TRUE
),
(
    202, 'WD-PKT-PT-BOB-6', 'Pressure Treated Pine Board on Board Picket 6ft', 'board on board fence picket, approximately 7.25 inch face width, 6 foot nominal length, pressure treated pine.', 'wood-picket', 'each', 3.93, 2.60, 900, TRUE
),
(
    203, 'WD-PST-CEDAR-4X4-8', 'Western Red Cedar Post 4x4 x 8ft', 'Structural wood fence post, 4x4 nominal dimension, 8 foot length, western red cedar.', 'wood-post', 'each', 16.50, 11.06, 120, TRUE
),
(
    204, 'WD-PST-CEDAR-4X4-10', 'Western Red Cedar Post 4x4 x 10ft', 'Structural wood fence post, 4x4 nominal dimension, 10 foot length, western red cedar.', 'wood-post', 'each', 20.62, 13.82, 120, TRUE
),
(
    205, 'WD-PST-CEDAR-4X4-12', 'Western Red Cedar Post 4x4 x 12ft', 'Structural wood fence post, 4x4 nominal dimension, 12 foot length, western red cedar.', 'wood-post', 'each', 24.75, 16.58, 120, TRUE
),
(
    206, 'WD-PST-CEDAR-6X6-8', 'Western Red Cedar Post 6x6 x 8ft', 'Structural wood fence post, 6x6 nominal dimension, 8 foot length, western red cedar.', 'wood-post', 'each', 36.50, 24.46, 120, TRUE
),
(
    207, 'WD-PST-CEDAR-6X6-10', 'Western Red Cedar Post 6x6 x 10ft', 'Structural wood fence post, 6x6 nominal dimension, 10 foot length, western red cedar.', 'wood-post', 'each', 45.62, 30.57, 120, TRUE
),
(
    208, 'WD-PST-CEDAR-6X6-12', 'Western Red Cedar Post 6x6 x 12ft', 'Structural wood fence post, 6x6 nominal dimension, 12 foot length, western red cedar.', 'wood-post', 'each', 54.75, 36.68, 120, TRUE
),
(
    209, 'WD-PST-PT-4X4-8', 'Pressure Treated Pine Post 4x4 x 8ft', 'Structural wood fence post, 4x4 nominal dimension, 8 foot length, pressure treated pine.', 'wood-post', 'each', 12.54, 8.40, 120, TRUE
),
(
    210, 'WD-PST-PT-4X4-10', 'Pressure Treated Pine Post 4x4 x 10ft', 'Structural wood fence post, 4x4 nominal dimension, 10 foot length, pressure treated pine.', 'wood-post', 'each', 15.68, 10.50, 120, TRUE
),
(
    211, 'WD-PST-PT-4X4-12', 'Pressure Treated Pine Post 4x4 x 12ft', 'Structural wood fence post, 4x4 nominal dimension, 12 foot length, pressure treated pine.', 'wood-post', 'each', 18.81, 12.60, 120, TRUE
),
(
    212, 'WD-PST-PT-6X6-8', 'Pressure Treated Pine Post 6x6 x 8ft', 'Structural wood fence post, 6x6 nominal dimension, 8 foot length, pressure treated pine.', 'wood-post', 'each', 27.74, 18.59, 120, TRUE
),
(
    213, 'WD-PST-PT-6X6-10', 'Pressure Treated Pine Post 6x6 x 10ft', 'Structural wood fence post, 6x6 nominal dimension, 10 foot length, pressure treated pine.', 'wood-post', 'each', 34.67, 23.23, 120, TRUE
),
(
    214, 'WD-PST-PT-6X6-12', 'Pressure Treated Pine Post 6x6 x 12ft', 'Structural wood fence post, 6x6 nominal dimension, 12 foot length, pressure treated pine.', 'wood-post', 'each', 41.61, 27.88, 120, TRUE
),
(
    215, 'WD-RL-CEDAR-2X4-8', 'Western Red Cedar Rail 2x4 x 8ft', 'Wood fence back rail, 2x4 nominal size, 8 foot length, western red cedar.', 'wood-rail', 'each', 8.25, 5.69, 240, TRUE
),
(
    216, 'WD-RL-CEDAR-2X4-10', 'Western Red Cedar Rail 2x4 x 10ft', 'Wood fence back rail, 2x4 nominal size, 10 foot length, western red cedar.', 'wood-rail', 'each', 10.31, 7.12, 240, TRUE
),
(
    217, 'WD-RL-CEDAR-2X4-12', 'Western Red Cedar Rail 2x4 x 12ft', 'Wood fence back rail, 2x4 nominal size, 12 foot length, western red cedar.', 'wood-rail', 'each', 12.38, 8.54, 240, TRUE
),
(
    218, 'WD-RL-CEDAR-2X3-8', 'Western Red Cedar Rail 2x3 x 8ft', 'Wood fence back rail, 2x3 nominal size, 8 foot length, western red cedar.', 'wood-rail', 'each', 6.55, 4.52, 240, TRUE
),
(
    219, 'WD-RL-CEDAR-2X3-10', 'Western Red Cedar Rail 2x3 x 10ft', 'Wood fence back rail, 2x3 nominal size, 10 foot length, western red cedar.', 'wood-rail', 'each', 8.19, 5.65, 240, TRUE
),
(
    220, 'WD-RL-PT-2X4-8', 'Pressure Treated Pine Rail 2x4 x 8ft', 'Wood fence back rail, 2x4 nominal size, 8 foot length, pressure treated pine.', 'wood-rail', 'each', 6.27, 4.33, 240, TRUE
),
(
    221, 'WD-RL-PT-2X4-10', 'Pressure Treated Pine Rail 2x4 x 10ft', 'Wood fence back rail, 2x4 nominal size, 10 foot length, pressure treated pine.', 'wood-rail', 'each', 7.84, 5.41, 240, TRUE
),
(
    222, 'WD-RL-PT-2X4-12', 'Pressure Treated Pine Rail 2x4 x 12ft', 'Wood fence back rail, 2x4 nominal size, 12 foot length, pressure treated pine.', 'wood-rail', 'each', 9.40, 6.49, 240, TRUE
),
(
    223, 'WD-RL-PT-2X3-8', 'Pressure Treated Pine Rail 2x3 x 8ft', 'Wood fence back rail, 2x3 nominal size, 8 foot length, pressure treated pine.', 'wood-rail', 'each', 4.98, 3.43, 240, TRUE
),
(
    224, 'WD-RL-PT-2X3-10', 'Pressure Treated Pine Rail 2x3 x 10ft', 'Wood fence back rail, 2x3 nominal size, 10 foot length, pressure treated pine.', 'wood-rail', 'each', 6.22, 4.29, 240, TRUE
),
(
    225, 'WD-PNL-CEDAR-PRIV-6', 'Western Red Cedar Privacy Panel 6ft x 8ft', 'Prebuilt privacy panel, nominal 6 foot high by 8 foot wide, western red cedar.', 'wood-panel', 'panel', 129.00, 91.59, 40, TRUE
),
(
    226, 'WD-PNL-CEDAR-PRIV-8', 'Western Red Cedar Privacy Panel 8ft x 8ft', 'Prebuilt privacy panel, nominal 8 foot high by 8 foot wide, western red cedar.', 'wood-panel', 'panel', 172.00, 122.12, 40, TRUE
),
(
    227, 'WD-PNL-CEDAR-SEMI-6', 'Western Red Cedar Semi-Privacy Panel 6ft x 8ft', 'Prebuilt semi-privacy panel, nominal 6 foot high by 8 foot wide, western red cedar.', 'wood-panel', 'panel', 118.00, 83.78, 40, TRUE
),
(
    228, 'WD-PNL-CEDAR-SEMI-8', 'Western Red Cedar Semi-Privacy Panel 8ft x 8ft', 'Prebuilt semi-privacy panel, nominal 8 foot high by 8 foot wide, western red cedar.', 'wood-panel', 'panel', 157.33, 111.71, 40, TRUE
),
(
    229, 'WD-PNL-CEDAR-SHDW-6', 'Western Red Cedar Shadowbox Panel 6ft x 8ft', 'Prebuilt shadowbox panel, nominal 6 foot high by 8 foot wide, western red cedar.', 'wood-panel', 'panel', 136.00, 96.56, 40, TRUE
),
(
    230, 'WD-PNL-CEDAR-SHDW-8', 'Western Red Cedar Shadowbox Panel 8ft x 8ft', 'Prebuilt shadowbox panel, nominal 8 foot high by 8 foot wide, western red cedar.', 'wood-panel', 'panel', 181.33, 128.75, 40, TRUE
),
(
    231, 'WD-PNL-PT-PRIV-6', 'Pressure Treated Pine Privacy Panel 6ft x 8ft', 'Prebuilt privacy panel, nominal 6 foot high by 8 foot wide, pressure treated pine.', 'wood-panel', 'panel', 98.04, 69.61, 40, TRUE
),
(
    232, 'WD-PNL-PT-PRIV-8', 'Pressure Treated Pine Privacy Panel 8ft x 8ft', 'Prebuilt privacy panel, nominal 8 foot high by 8 foot wide, pressure treated pine.', 'wood-panel', 'panel', 130.72, 92.81, 40, TRUE
),
(
    233, 'WD-PNL-PT-SEMI-6', 'Pressure Treated Pine Semi-Privacy Panel 6ft x 8ft', 'Prebuilt semi-privacy panel, nominal 6 foot high by 8 foot wide, pressure treated pine.', 'wood-panel', 'panel', 89.68, 63.67, 40, TRUE
),
(
    234, 'WD-PNL-PT-SEMI-8', 'Pressure Treated Pine Semi-Privacy Panel 8ft x 8ft', 'Prebuilt semi-privacy panel, nominal 8 foot high by 8 foot wide, pressure treated pine.', 'wood-panel', 'panel', 119.57, 84.90, 40, TRUE
),
(
    235, 'WD-PNL-PT-SHDW-6', 'Pressure Treated Pine Shadowbox Panel 6ft x 8ft', 'Prebuilt shadowbox panel, nominal 6 foot high by 8 foot wide, pressure treated pine.', 'wood-panel', 'panel', 103.36, 73.39, 40, TRUE
),
(
    236, 'WD-PNL-PT-SHDW-8', 'Pressure Treated Pine Shadowbox Panel 8ft x 8ft', 'Prebuilt shadowbox panel, nominal 8 foot high by 8 foot wide, pressure treated pine.', 'wood-panel', 'panel', 137.81, 97.85, 40, TRUE
),
(
    237, 'VY-PNL-PRIV-4-WHT', 'Vinyl Privacy Panel 4ft x 8ft White', 'Vinyl privacy fence panel, 4 foot high by 8 foot wide, white finish.', 'vinyl-panel', 'panel', 162.00, 102.06, 48, TRUE
),
(
    238, 'VY-PNL-PRIV-5-WHT', 'Vinyl Privacy Panel 5ft x 8ft White', 'Vinyl privacy fence panel, 5 foot high by 8 foot wide, white finish.', 'vinyl-panel', 'panel', 202.50, 127.58, 48, TRUE
),
(
    239, 'VY-PNL-PRIV-6-WHT', 'Vinyl Privacy Panel 6ft x 8ft White', 'Vinyl privacy fence panel, 6 foot high by 8 foot wide, white finish.', 'vinyl-panel', 'panel', 243.00, 153.09, 48, TRUE
),
(
    240, 'VY-PNL-SEMI-4-WHT', 'Vinyl Semi-Privacy Panel 4ft x 8ft White', 'Vinyl semi-privacy fence panel, 4 foot high by 8 foot wide, white finish.', 'vinyl-panel', 'panel', 149.00, 93.87, 48, TRUE
),
(
    241, 'VY-PNL-SEMI-5-WHT', 'Vinyl Semi-Privacy Panel 5ft x 8ft White', 'Vinyl semi-privacy fence panel, 5 foot high by 8 foot wide, white finish.', 'vinyl-panel', 'panel', 186.25, 117.34, 48, TRUE
),
(
    242, 'VY-PNL-SEMI-6-WHT', 'Vinyl Semi-Privacy Panel 6ft x 8ft White', 'Vinyl semi-privacy fence panel, 6 foot high by 8 foot wide, white finish.', 'vinyl-panel', 'panel', 223.50, 140.81, 48, TRUE
),
(
    243, 'VY-PNL-PICKET-4-WHT', 'Vinyl Picket Panel 4ft x 8ft White', 'Vinyl picket fence panel, 4 foot high by 8 foot wide, white finish.', 'vinyl-panel', 'panel', 138.00, 86.94, 48, TRUE
),
(
    244, 'VY-PNL-PICKET-5-WHT', 'Vinyl Picket Panel 5ft x 8ft White', 'Vinyl picket fence panel, 5 foot high by 8 foot wide, white finish.', 'vinyl-panel', 'panel', 172.50, 108.67, 48, TRUE
),
(
    245, 'VY-PNL-PICKET-6-WHT', 'Vinyl Picket Panel 6ft x 8ft White', 'Vinyl picket fence panel, 6 foot high by 8 foot wide, white finish.', 'vinyl-panel', 'panel', 207.00, 130.41, 48, TRUE
),
(
    246, 'VY-PNL-PRIV-4-TAN', 'Vinyl Privacy Panel 4ft x 8ft Tan', 'Vinyl privacy fence panel, 4 foot high by 8 foot wide, tan finish.', 'vinyl-panel', 'panel', 174.96, 110.22, 48, TRUE
),
(
    247, 'VY-PNL-PRIV-5-TAN', 'Vinyl Privacy Panel 5ft x 8ft Tan', 'Vinyl privacy fence panel, 5 foot high by 8 foot wide, tan finish.', 'vinyl-panel', 'panel', 218.70, 137.78, 48, TRUE
),
(
    248, 'VY-PNL-PRIV-6-TAN', 'Vinyl Privacy Panel 6ft x 8ft Tan', 'Vinyl privacy fence panel, 6 foot high by 8 foot wide, tan finish.', 'vinyl-panel', 'panel', 262.44, 165.34, 48, TRUE
),
(
    249, 'VY-PNL-SEMI-4-TAN', 'Vinyl Semi-Privacy Panel 4ft x 8ft Tan', 'Vinyl semi-privacy fence panel, 4 foot high by 8 foot wide, tan finish.', 'vinyl-panel', 'panel', 160.92, 101.38, 48, TRUE
),
(
    250, 'VY-PNL-SEMI-5-TAN', 'Vinyl Semi-Privacy Panel 5ft x 8ft Tan', 'Vinyl semi-privacy fence panel, 5 foot high by 8 foot wide, tan finish.', 'vinyl-panel', 'panel', 201.15, 126.72, 48, TRUE
),
(
    251, 'VY-PNL-SEMI-6-TAN', 'Vinyl Semi-Privacy Panel 6ft x 8ft Tan', 'Vinyl semi-privacy fence panel, 6 foot high by 8 foot wide, tan finish.', 'vinyl-panel', 'panel', 241.38, 152.07, 48, TRUE
),
(
    252, 'VY-PNL-PICKET-4-TAN', 'Vinyl Picket Panel 4ft x 8ft Tan', 'Vinyl picket fence panel, 4 foot high by 8 foot wide, tan finish.', 'vinyl-panel', 'panel', 149.04, 93.90, 48, TRUE
),
(
    253, 'VY-PNL-PICKET-5-TAN', 'Vinyl Picket Panel 5ft x 8ft Tan', 'Vinyl picket fence panel, 5 foot high by 8 foot wide, tan finish.', 'vinyl-panel', 'panel', 186.30, 117.37, 48, TRUE
),
(
    254, 'VY-PNL-PICKET-6-TAN', 'Vinyl Picket Panel 6ft x 8ft Tan', 'Vinyl picket fence panel, 6 foot high by 8 foot wide, tan finish.', 'vinyl-panel', 'panel', 223.56, 140.84, 48, TRUE
),
(
    255, 'VY-PNL-PRIV-4-KHK', 'Vinyl Privacy Panel 4ft x 8ft Khaki', 'Vinyl privacy fence panel, 4 foot high by 8 foot wide, khaki finish.', 'vinyl-panel', 'panel', 178.20, 112.27, 48, TRUE
),
(
    256, 'VY-PNL-PRIV-5-KHK', 'Vinyl Privacy Panel 5ft x 8ft Khaki', 'Vinyl privacy fence panel, 5 foot high by 8 foot wide, khaki finish.', 'vinyl-panel', 'panel', 222.75, 140.33, 48, TRUE
),
(
    257, 'VY-PNL-PRIV-6-KHK', 'Vinyl Privacy Panel 6ft x 8ft Khaki', 'Vinyl privacy fence panel, 6 foot high by 8 foot wide, khaki finish.', 'vinyl-panel', 'panel', 267.30, 168.40, 48, TRUE
),
(
    258, 'VY-PNL-SEMI-4-KHK', 'Vinyl Semi-Privacy Panel 4ft x 8ft Khaki', 'Vinyl semi-privacy fence panel, 4 foot high by 8 foot wide, khaki finish.', 'vinyl-panel', 'panel', 163.90, 103.26, 48, TRUE
),
(
    259, 'VY-PNL-SEMI-5-KHK', 'Vinyl Semi-Privacy Panel 5ft x 8ft Khaki', 'Vinyl semi-privacy fence panel, 5 foot high by 8 foot wide, khaki finish.', 'vinyl-panel', 'panel', 204.88, 129.07, 48, TRUE
),
(
    260, 'VY-PNL-SEMI-6-KHK', 'Vinyl Semi-Privacy Panel 6ft x 8ft Khaki', 'Vinyl semi-privacy fence panel, 6 foot high by 8 foot wide, khaki finish.', 'vinyl-panel', 'panel', 245.85, 154.89, 48, TRUE
),
(
    261, 'VY-PNL-PICKET-4-KHK', 'Vinyl Picket Panel 4ft x 8ft Khaki', 'Vinyl picket fence panel, 4 foot high by 8 foot wide, khaki finish.', 'vinyl-panel', 'panel', 151.80, 95.63, 48, TRUE
),
(
    262, 'VY-PNL-PICKET-5-KHK', 'Vinyl Picket Panel 5ft x 8ft Khaki', 'Vinyl picket fence panel, 5 foot high by 8 foot wide, khaki finish.', 'vinyl-panel', 'panel', 189.75, 119.54, 48, TRUE
),
(
    263, 'VY-PNL-PICKET-6-KHK', 'Vinyl Picket Panel 6ft x 8ft Khaki', 'Vinyl picket fence panel, 6 foot high by 8 foot wide, khaki finish.', 'vinyl-panel', 'panel', 227.70, 143.45, 48, TRUE
),
(
    264, 'VY-PST-5X5-BLANK-POST-9FT-WHT', 'Vinyl 5x5 Blank Post 9ft White', 'Vinyl fence post component, 5x5 blank post 9ft, white finish.', 'vinyl-post', 'each', 44.00, 28.16, 70, TRUE
),
(
    265, 'VY-PST-5X5-ROUTED-LINE-POST-9FT-WHT', 'Vinyl 5x5 Routed Line Post 9ft White', 'Vinyl fence post component, 5x5 routed line post 9ft, white finish.', 'vinyl-post', 'each', 52.00, 33.28, 70, TRUE
),
(
    266, 'VY-PST-5X5-ROUTED-END-POST-9FT-WHT', 'Vinyl 5x5 Routed End Post 9ft White', 'Vinyl fence post component, 5x5 routed end post 9ft, white finish.', 'vinyl-post', 'each', 54.00, 34.56, 70, TRUE
),
(
    267, 'VY-PST-5X5-ROUTED-CORNER-POST-9FT-WHT', 'Vinyl 5x5 Routed Corner Post 9ft White', 'Vinyl fence post component, 5x5 routed corner post 9ft, white finish.', 'vinyl-post', 'each', 58.00, 37.12, 70, TRUE
),
(
    268, 'VY-PST-5X5-GATE-POST-10FT-WHT', 'Vinyl 5x5 Gate Post 10ft White', 'Vinyl fence post component, 5x5 gate post 10ft, white finish.', 'vinyl-post', 'each', 78.00, 49.92, 70, TRUE
),
(
    269, 'VY-PST-5X5-BLANK-POST-9FT-TAN', 'Vinyl 5x5 Blank Post 9ft Tan', 'Vinyl fence post component, 5x5 blank post 9ft, tan finish.', 'vinyl-post', 'each', 47.52, 30.41, 70, TRUE
),
(
    270, 'VY-PST-5X5-ROUTED-LINE-POST-9FT-TAN', 'Vinyl 5x5 Routed Line Post 9ft Tan', 'Vinyl fence post component, 5x5 routed line post 9ft, tan finish.', 'vinyl-post', 'each', 56.16, 35.94, 70, TRUE
),
(
    271, 'VY-PST-5X5-ROUTED-END-POST-9FT-TAN', 'Vinyl 5x5 Routed End Post 9ft Tan', 'Vinyl fence post component, 5x5 routed end post 9ft, tan finish.', 'vinyl-post', 'each', 58.32, 37.32, 70, TRUE
),
(
    272, 'VY-PST-5X5-ROUTED-CORNER-POST-9FT-TAN', 'Vinyl 5x5 Routed Corner Post 9ft Tan', 'Vinyl fence post component, 5x5 routed corner post 9ft, tan finish.', 'vinyl-post', 'each', 62.64, 40.09, 70, TRUE
),
(
    273, 'VY-PST-5X5-GATE-POST-10FT-TAN', 'Vinyl 5x5 Gate Post 10ft Tan', 'Vinyl fence post component, 5x5 gate post 10ft, tan finish.', 'vinyl-post', 'each', 84.24, 53.91, 70, TRUE
),
(
    274, 'VY-PST-5X5-BLANK-POST-9FT-KHK', 'Vinyl 5x5 Blank Post 9ft Khaki', 'Vinyl fence post component, 5x5 blank post 9ft, khaki finish.', 'vinyl-post', 'each', 48.40, 30.98, 70, TRUE
),
(
    275, 'VY-PST-5X5-ROUTED-LINE-POST-9FT-KHK', 'Vinyl 5x5 Routed Line Post 9ft Khaki', 'Vinyl fence post component, 5x5 routed line post 9ft, khaki finish.', 'vinyl-post', 'each', 57.20, 36.61, 70, TRUE
),
(
    276, 'VY-PST-5X5-ROUTED-END-POST-9FT-KHK', 'Vinyl 5x5 Routed End Post 9ft Khaki', 'Vinyl fence post component, 5x5 routed end post 9ft, khaki finish.', 'vinyl-post', 'each', 59.40, 38.02, 70, TRUE
),
(
    277, 'VY-PST-5X5-ROUTED-CORNER-POST-9FT-KHK', 'Vinyl 5x5 Routed Corner Post 9ft Khaki', 'Vinyl fence post component, 5x5 routed corner post 9ft, khaki finish.', 'vinyl-post', 'each', 63.80, 40.83, 70, TRUE
),
(
    278, 'VY-PST-5X5-GATE-POST-10FT-KHK', 'Vinyl 5x5 Gate Post 10ft Khaki', 'Vinyl fence post component, 5x5 gate post 10ft, khaki finish.', 'vinyl-post', 'each', 85.80, 54.91, 70, TRUE
),
(
    279, 'VY-ACC-NECAP-WHT', 'Vinyl New England Cap White', 'Vinyl fence accessory: new england cap, white finish.', 'vinyl-accessory', 'each', 7.95, 4.85, 90, TRUE
),
(
    280, 'VY-ACC-FPCAP-WHT', 'Vinyl Flat Post Cap White', 'Vinyl fence accessory: flat post cap, white finish.', 'vinyl-accessory', 'each', 5.55, 3.39, 90, TRUE
),
(
    281, 'VY-ACC-RLK-WHT', 'Vinyl Rail Lock Kit White', 'Vinyl fence accessory: rail lock kit, white finish.', 'vinyl-accessory', 'each', 8.45, 5.15, 90, TRUE
),
(
    282, 'VY-ACC-STIFF8-WHT', 'Vinyl Aluminum Stiffener 8ft White', 'Vinyl fence accessory: aluminum stiffener 8ft, white finish.', 'vinyl-accessory', 'each', 19.95, 12.17, 90, TRUE
),
(
    283, 'VY-ACC-BRKT2-WHT', 'Vinyl Bracket Kit 2-Rail White', 'Vinyl fence accessory: bracket kit 2-rail, white finish.', 'vinyl-accessory', 'each', 10.95, 6.68, 90, TRUE
),
(
    284, 'VY-ACC-BRKT3-WHT', 'Vinyl Bracket Kit 3-Rail White', 'Vinyl fence accessory: bracket kit 3-rail, white finish.', 'vinyl-accessory', 'each', 12.95, 7.90, 90, TRUE
),
(
    285, 'VY-ACC-CHNL8-WHT', 'Vinyl Blank Channel 8ft White', 'Vinyl fence accessory: blank channel 8ft, white finish.', 'vinyl-accessory', 'each', 24.95, 15.22, 90, TRUE
),
(
    286, 'VY-ACC-UCHN8-WHT', 'Vinyl U-Channel 8ft White', 'Vinyl fence accessory: u-channel 8ft, white finish.', 'vinyl-accessory', 'each', 16.95, 10.34, 90, TRUE
),
(
    287, 'VY-ACC-NECAP-TAN', 'Vinyl New England Cap Tan', 'Vinyl fence accessory: new england cap, tan finish.', 'vinyl-accessory', 'each', 8.59, 5.24, 90, TRUE
),
(
    288, 'VY-ACC-FPCAP-TAN', 'Vinyl Flat Post Cap Tan', 'Vinyl fence accessory: flat post cap, tan finish.', 'vinyl-accessory', 'each', 5.99, 3.66, 90, TRUE
),
(
    289, 'VY-ACC-RLK-TAN', 'Vinyl Rail Lock Kit Tan', 'Vinyl fence accessory: rail lock kit, tan finish.', 'vinyl-accessory', 'each', 9.13, 5.57, 90, TRUE
),
(
    290, 'VY-ACC-STIFF8-TAN', 'Vinyl Aluminum Stiffener 8ft Tan', 'Vinyl fence accessory: aluminum stiffener 8ft, tan finish.', 'vinyl-accessory', 'each', 21.55, 13.14, 90, TRUE
),
(
    291, 'VY-ACC-BRKT2-TAN', 'Vinyl Bracket Kit 2-Rail Tan', 'Vinyl fence accessory: bracket kit 2-rail, tan finish.', 'vinyl-accessory', 'each', 11.83, 7.21, 90, TRUE
),
(
    292, 'VY-ACC-BRKT3-TAN', 'Vinyl Bracket Kit 3-Rail Tan', 'Vinyl fence accessory: bracket kit 3-rail, tan finish.', 'vinyl-accessory', 'each', 13.99, 8.53, 90, TRUE
),
(
    293, 'VY-ACC-CHNL8-TAN', 'Vinyl Blank Channel 8ft Tan', 'Vinyl fence accessory: blank channel 8ft, tan finish.', 'vinyl-accessory', 'each', 26.95, 16.44, 90, TRUE
),
(
    294, 'VY-ACC-UCHN8-TAN', 'Vinyl U-Channel 8ft Tan', 'Vinyl fence accessory: u-channel 8ft, tan finish.', 'vinyl-accessory', 'each', 18.31, 11.17, 90, TRUE
),
(
    295, 'VY-ACC-NECAP-KHK', 'Vinyl New England Cap Khaki', 'Vinyl fence accessory: new england cap, khaki finish.', 'vinyl-accessory', 'each', 8.75, 5.33, 90, TRUE
),
(
    296, 'VY-ACC-FPCAP-KHK', 'Vinyl Flat Post Cap Khaki', 'Vinyl fence accessory: flat post cap, khaki finish.', 'vinyl-accessory', 'each', 6.11, 3.72, 90, TRUE
),
(
    297, 'VY-ACC-RLK-KHK', 'Vinyl Rail Lock Kit Khaki', 'Vinyl fence accessory: rail lock kit, khaki finish.', 'vinyl-accessory', 'each', 9.29, 5.67, 90, TRUE
),
(
    298, 'VY-ACC-STIFF8-KHK', 'Vinyl Aluminum Stiffener 8ft Khaki', 'Vinyl fence accessory: aluminum stiffener 8ft, khaki finish.', 'vinyl-accessory', 'each', 21.95, 13.39, 90, TRUE
),
(
    299, 'VY-ACC-BRKT2-KHK', 'Vinyl Bracket Kit 2-Rail Khaki', 'Vinyl fence accessory: bracket kit 2-rail, khaki finish.', 'vinyl-accessory', 'each', 12.04, 7.35, 90, TRUE
),
(
    300, 'VY-ACC-BRKT3-KHK', 'Vinyl Bracket Kit 3-Rail Khaki', 'Vinyl fence accessory: bracket kit 3-rail, khaki finish.', 'vinyl-accessory', 'each', 14.25, 8.69, 90, TRUE
),
(
    301, 'VY-ACC-CHNL8-KHK', 'Vinyl Blank Channel 8ft Khaki', 'Vinyl fence accessory: blank channel 8ft, khaki finish.', 'vinyl-accessory', 'each', 27.45, 16.74, 90, TRUE
),
(
    302, 'VY-ACC-UCHN8-KHK', 'Vinyl U-Channel 8ft Khaki', 'Vinyl fence accessory: u-channel 8ft, khaki finish.', 'vinyl-accessory', 'each', 18.64, 11.37, 90, TRUE
),
(
    303, 'AL-PNL-RES-4-BLK', 'Aluminum Residential Flat Top Panel 4ft x 6ft Black', 'Powder-coated aluminum panel, residential flat top, 4 foot high by 6 foot wide, black finish.', 'aluminum-panel', 'panel', 118.00, 73.16, 55, TRUE
),
(
    304, 'AL-PNL-RES-5-BLK', 'Aluminum Residential Flat Top Panel 5ft x 6ft Black', 'Powder-coated aluminum panel, residential flat top, 5 foot high by 6 foot wide, black finish.', 'aluminum-panel', 'panel', 147.50, 91.45, 55, TRUE
),
(
    305, 'AL-PNL-RES-6-BLK', 'Aluminum Residential Flat Top Panel 6ft x 6ft Black', 'Powder-coated aluminum panel, residential flat top, 6 foot high by 6 foot wide, black finish.', 'aluminum-panel', 'panel', 177.00, 109.74, 55, TRUE
),
(
    306, 'AL-PNL-PUP-4-BLK', 'Aluminum Puppy Picket Panel 4ft x 6ft Black', 'Powder-coated aluminum panel, puppy picket, 4 foot high by 6 foot wide, black finish.', 'aluminum-panel', 'panel', 132.00, 81.84, 55, TRUE
),
(
    307, 'AL-PNL-PUP-5-BLK', 'Aluminum Puppy Picket Panel 5ft x 6ft Black', 'Powder-coated aluminum panel, puppy picket, 5 foot high by 6 foot wide, black finish.', 'aluminum-panel', 'panel', 165.00, 102.30, 55, TRUE
),
(
    308, 'AL-PNL-PUP-6-BLK', 'Aluminum Puppy Picket Panel 6ft x 6ft Black', 'Powder-coated aluminum panel, puppy picket, 6 foot high by 6 foot wide, black finish.', 'aluminum-panel', 'panel', 198.00, 122.76, 55, TRUE
),
(
    309, 'AL-PNL-RACK-4-BLK', 'Aluminum Rackable Flat Top Panel 4ft x 6ft Black', 'Powder-coated aluminum panel, rackable flat top, 4 foot high by 6 foot wide, black finish.', 'aluminum-panel', 'panel', 149.00, 92.38, 55, TRUE
),
(
    310, 'AL-PNL-RACK-5-BLK', 'Aluminum Rackable Flat Top Panel 5ft x 6ft Black', 'Powder-coated aluminum panel, rackable flat top, 5 foot high by 6 foot wide, black finish.', 'aluminum-panel', 'panel', 186.25, 115.47, 55, TRUE
),
(
    311, 'AL-PNL-RACK-6-BLK', 'Aluminum Rackable Flat Top Panel 6ft x 6ft Black', 'Powder-coated aluminum panel, rackable flat top, 6 foot high by 6 foot wide, black finish.', 'aluminum-panel', 'panel', 223.50, 138.57, 55, TRUE
),
(
    312, 'AL-PNL-RES-4-BRNZ', 'Aluminum Residential Flat Top Panel 4ft x 6ft Bronze', 'Powder-coated aluminum panel, residential flat top, 4 foot high by 6 foot wide, bronze finish.', 'aluminum-panel', 'panel', 125.08, 77.55, 55, TRUE
),
(
    313, 'AL-PNL-RES-5-BRNZ', 'Aluminum Residential Flat Top Panel 5ft x 6ft Bronze', 'Powder-coated aluminum panel, residential flat top, 5 foot high by 6 foot wide, bronze finish.', 'aluminum-panel', 'panel', 156.35, 96.94, 55, TRUE
),
(
    314, 'AL-PNL-RES-6-BRNZ', 'Aluminum Residential Flat Top Panel 6ft x 6ft Bronze', 'Powder-coated aluminum panel, residential flat top, 6 foot high by 6 foot wide, bronze finish.', 'aluminum-panel', 'panel', 187.62, 116.32, 55, TRUE
),
(
    315, 'AL-PNL-PUP-4-BRNZ', 'Aluminum Puppy Picket Panel 4ft x 6ft Bronze', 'Powder-coated aluminum panel, puppy picket, 4 foot high by 6 foot wide, bronze finish.', 'aluminum-panel', 'panel', 139.92, 86.75, 55, TRUE
),
(
    316, 'AL-PNL-PUP-5-BRNZ', 'Aluminum Puppy Picket Panel 5ft x 6ft Bronze', 'Powder-coated aluminum panel, puppy picket, 5 foot high by 6 foot wide, bronze finish.', 'aluminum-panel', 'panel', 174.90, 108.44, 55, TRUE
),
(
    317, 'AL-PNL-PUP-6-BRNZ', 'Aluminum Puppy Picket Panel 6ft x 6ft Bronze', 'Powder-coated aluminum panel, puppy picket, 6 foot high by 6 foot wide, bronze finish.', 'aluminum-panel', 'panel', 209.88, 130.13, 55, TRUE
),
(
    318, 'AL-PNL-RACK-4-BRNZ', 'Aluminum Rackable Flat Top Panel 4ft x 6ft Bronze', 'Powder-coated aluminum panel, rackable flat top, 4 foot high by 6 foot wide, bronze finish.', 'aluminum-panel', 'panel', 157.94, 97.92, 55, TRUE
),
(
    319, 'AL-PNL-RACK-5-BRNZ', 'Aluminum Rackable Flat Top Panel 5ft x 6ft Bronze', 'Powder-coated aluminum panel, rackable flat top, 5 foot high by 6 foot wide, bronze finish.', 'aluminum-panel', 'panel', 197.43, 122.40, 55, TRUE
),
(
    320, 'AL-PNL-RACK-6-BRNZ', 'Aluminum Rackable Flat Top Panel 6ft x 6ft Bronze', 'Powder-coated aluminum panel, rackable flat top, 6 foot high by 6 foot wide, bronze finish.', 'aluminum-panel', 'panel', 236.91, 146.88, 55, TRUE
),
(
    321, 'AL-PNL-RES-4-WHT', 'Aluminum Residential Flat Top Panel 4ft x 6ft White', 'Powder-coated aluminum panel, residential flat top, 4 foot high by 6 foot wide, white finish.', 'aluminum-panel', 'panel', 122.72, 76.09, 55, TRUE
),
(
    322, 'AL-PNL-RES-5-WHT', 'Aluminum Residential Flat Top Panel 5ft x 6ft White', 'Powder-coated aluminum panel, residential flat top, 5 foot high by 6 foot wide, white finish.', 'aluminum-panel', 'panel', 153.40, 95.11, 55, TRUE
),
(
    323, 'AL-PNL-RES-6-WHT', 'Aluminum Residential Flat Top Panel 6ft x 6ft White', 'Powder-coated aluminum panel, residential flat top, 6 foot high by 6 foot wide, white finish.', 'aluminum-panel', 'panel', 184.08, 114.13, 55, TRUE
),
(
    324, 'AL-PNL-PUP-4-WHT', 'Aluminum Puppy Picket Panel 4ft x 6ft White', 'Powder-coated aluminum panel, puppy picket, 4 foot high by 6 foot wide, white finish.', 'aluminum-panel', 'panel', 137.28, 85.11, 55, TRUE
),
(
    325, 'AL-PNL-PUP-5-WHT', 'Aluminum Puppy Picket Panel 5ft x 6ft White', 'Powder-coated aluminum panel, puppy picket, 5 foot high by 6 foot wide, white finish.', 'aluminum-panel', 'panel', 171.60, 106.39, 55, TRUE
),
(
    326, 'AL-PNL-PUP-6-WHT', 'Aluminum Puppy Picket Panel 6ft x 6ft White', 'Powder-coated aluminum panel, puppy picket, 6 foot high by 6 foot wide, white finish.', 'aluminum-panel', 'panel', 205.92, 127.67, 55, TRUE
),
(
    327, 'AL-PNL-RACK-4-WHT', 'Aluminum Rackable Flat Top Panel 4ft x 6ft White', 'Powder-coated aluminum panel, rackable flat top, 4 foot high by 6 foot wide, white finish.', 'aluminum-panel', 'panel', 154.96, 96.08, 55, TRUE
),
(
    328, 'AL-PNL-RACK-5-WHT', 'Aluminum Rackable Flat Top Panel 5ft x 6ft White', 'Powder-coated aluminum panel, rackable flat top, 5 foot high by 6 foot wide, white finish.', 'aluminum-panel', 'panel', 193.70, 120.09, 55, TRUE
),
(
    329, 'AL-PNL-RACK-6-WHT', 'Aluminum Rackable Flat Top Panel 6ft x 6ft White', 'Powder-coated aluminum panel, rackable flat top, 6 foot high by 6 foot wide, white finish.', 'aluminum-panel', 'panel', 232.44, 144.11, 55, TRUE
),
(
    330, 'AL-PST-LINE-BLK', 'Aluminum Line Post 2in x 2in x 8ft Black', 'Architectural aluminum post, line post 2in x 2in x 8ft, black finish.', 'aluminum-post', 'each', 42.00, 26.46, 80, TRUE
),
(
    331, 'AL-PST-END-BLK', 'Aluminum End Post 2in x 2in x 8ft Black', 'Architectural aluminum post, end post 2in x 2in x 8ft, black finish.', 'aluminum-post', 'each', 46.00, 28.98, 80, TRUE
),
(
    332, 'AL-PST-COR-BLK', 'Aluminum Corner Post 2in x 2in x 8ft Black', 'Architectural aluminum post, corner post 2in x 2in x 8ft, black finish.', 'aluminum-post', 'each', 48.00, 30.24, 80, TRUE
),
(
    333, 'AL-PST-GATE-BLK', 'Aluminum Gate Post 2-1/2in x 2-1/2in x 9ft Black', 'Architectural aluminum post, gate post 2-1/2in x 2-1/2in x 9ft, black finish.', 'aluminum-post', 'each', 72.00, 45.36, 80, TRUE
),
(
    334, 'AL-PST-LINE-BRNZ', 'Aluminum Line Post 2in x 2in x 8ft Bronze', 'Architectural aluminum post, line post 2in x 2in x 8ft, bronze finish.', 'aluminum-post', 'each', 44.52, 28.05, 80, TRUE
),
(
    335, 'AL-PST-END-BRNZ', 'Aluminum End Post 2in x 2in x 8ft Bronze', 'Architectural aluminum post, end post 2in x 2in x 8ft, bronze finish.', 'aluminum-post', 'each', 48.76, 30.72, 80, TRUE
),
(
    336, 'AL-PST-COR-BRNZ', 'Aluminum Corner Post 2in x 2in x 8ft Bronze', 'Architectural aluminum post, corner post 2in x 2in x 8ft, bronze finish.', 'aluminum-post', 'each', 50.88, 32.05, 80, TRUE
),
(
    337, 'AL-PST-GATE-BRNZ', 'Aluminum Gate Post 2-1/2in x 2-1/2in x 9ft Bronze', 'Architectural aluminum post, gate post 2-1/2in x 2-1/2in x 9ft, bronze finish.', 'aluminum-post', 'each', 76.32, 48.08, 80, TRUE
),
(
    338, 'AL-PST-LINE-WHT', 'Aluminum Line Post 2in x 2in x 8ft White', 'Architectural aluminum post, line post 2in x 2in x 8ft, white finish.', 'aluminum-post', 'each', 43.68, 27.52, 80, TRUE
),
(
    339, 'AL-PST-END-WHT', 'Aluminum End Post 2in x 2in x 8ft White', 'Architectural aluminum post, end post 2in x 2in x 8ft, white finish.', 'aluminum-post', 'each', 47.84, 30.14, 80, TRUE
),
(
    340, 'AL-PST-COR-WHT', 'Aluminum Corner Post 2in x 2in x 8ft White', 'Architectural aluminum post, corner post 2in x 2in x 8ft, white finish.', 'aluminum-post', 'each', 49.92, 31.45, 80, TRUE
),
(
    341, 'AL-PST-GATE-WHT', 'Aluminum Gate Post 2-1/2in x 2-1/2in x 9ft White', 'Architectural aluminum post, gate post 2-1/2in x 2-1/2in x 9ft, white finish.', 'aluminum-post', 'each', 74.88, 47.17, 80, TRUE
),
(
    342, 'AL-HW-BRKSET-BLK', 'Aluminum Panel Bracket Set Black', 'Aluminum fence hardware: panel bracket set, black finish.', 'aluminum-hardware', 'set', 12.95, 8.42, 65, TRUE
),
(
    343, 'AL-HW-SCHINGE-BLK', 'Aluminum Self Closing Hinge Pair Black', 'Aluminum fence hardware: self closing hinge pair, black finish.', 'aluminum-hardware', 'set', 68.00, 44.20, 65, TRUE
),
(
    344, 'AL-HW-MAGTOP-BLK', 'Aluminum MagnaLatch Top Pull Black', 'Aluminum fence hardware: magnalatch top pull, black finish.', 'aluminum-hardware', 'set', 92.00, 59.80, 65, TRUE
),
(
    345, 'AL-HW-DROPROD-BLK', 'Aluminum Drop Rod Kit Black', 'Aluminum fence hardware: drop rod kit, black finish.', 'aluminum-hardware', 'set', 36.00, 23.40, 65, TRUE
),
(
    346, 'AL-HW-WALLBR-BLK', 'Aluminum Wall Mount Bracket Black', 'Aluminum fence hardware: wall mount bracket, black finish.', 'aluminum-hardware', 'set', 14.95, 9.72, 65, TRUE
),
(
    347, 'AL-HW-FINIAL-BLK', 'Aluminum Finial Cap Black', 'Aluminum fence hardware: finial cap, black finish.', 'aluminum-hardware', 'set', 7.45, 4.84, 65, TRUE
),
(
    348, 'AL-HW-BRKSET-BRNZ', 'Aluminum Panel Bracket Set Bronze', 'Aluminum fence hardware: panel bracket set, bronze finish.', 'aluminum-hardware', 'set', 13.73, 8.92, 65, TRUE
),
(
    349, 'AL-HW-SCHINGE-BRNZ', 'Aluminum Self Closing Hinge Pair Bronze', 'Aluminum fence hardware: self closing hinge pair, bronze finish.', 'aluminum-hardware', 'set', 72.08, 46.85, 65, TRUE
),
(
    350, 'AL-HW-MAGTOP-BRNZ', 'Aluminum MagnaLatch Top Pull Bronze', 'Aluminum fence hardware: magnalatch top pull, bronze finish.', 'aluminum-hardware', 'set', 97.52, 63.39, 65, TRUE
),
(
    351, 'AL-HW-DROPROD-BRNZ', 'Aluminum Drop Rod Kit Bronze', 'Aluminum fence hardware: drop rod kit, bronze finish.', 'aluminum-hardware', 'set', 38.16, 24.80, 65, TRUE
),
(
    352, 'AL-HW-WALLBR-BRNZ', 'Aluminum Wall Mount Bracket Bronze', 'Aluminum fence hardware: wall mount bracket, bronze finish.', 'aluminum-hardware', 'set', 15.85, 10.30, 65, TRUE
),
(
    353, 'AL-HW-FINIAL-BRNZ', 'Aluminum Finial Cap Bronze', 'Aluminum fence hardware: finial cap, bronze finish.', 'aluminum-hardware', 'set', 7.90, 5.13, 65, TRUE
),
(
    354, 'AL-HW-BRKSET-WHT', 'Aluminum Panel Bracket Set White', 'Aluminum fence hardware: panel bracket set, white finish.', 'aluminum-hardware', 'set', 13.47, 8.75, 65, TRUE
),
(
    355, 'AL-HW-SCHINGE-WHT', 'Aluminum Self Closing Hinge Pair White', 'Aluminum fence hardware: self closing hinge pair, white finish.', 'aluminum-hardware', 'set', 70.72, 45.97, 65, TRUE
),
(
    356, 'AL-HW-MAGTOP-WHT', 'Aluminum MagnaLatch Top Pull White', 'Aluminum fence hardware: magnalatch top pull, white finish.', 'aluminum-hardware', 'set', 95.68, 62.19, 65, TRUE
),
(
    357, 'AL-HW-DROPROD-WHT', 'Aluminum Drop Rod Kit White', 'Aluminum fence hardware: drop rod kit, white finish.', 'aluminum-hardware', 'set', 37.44, 24.34, 65, TRUE
),
(
    358, 'AL-HW-WALLBR-WHT', 'Aluminum Wall Mount Bracket White', 'Aluminum fence hardware: wall mount bracket, white finish.', 'aluminum-hardware', 'set', 15.55, 10.11, 65, TRUE
),
(
    359, 'AL-HW-FINIAL-WHT', 'Aluminum Finial Cap White', 'Aluminum fence hardware: finial cap, white finish.', 'aluminum-hardware', 'set', 7.75, 5.04, 65, TRUE
),
(
    360, 'CL-WALK-4', 'Chain Link Walk Gate 4ft x 4ft', 'Fabricated chain link walk gate 4ft x 4ft including frame and standard latch hardware.', 'chain-link-gate', 'each', 189.00, 136.00, 16, TRUE
),
(
    361, 'CL-WALK-5', 'Chain Link Walk Gate 5ft x 5ft', 'Fabricated chain link walk gate 5ft x 5ft including frame and standard latch hardware.', 'chain-link-gate', 'each', 229.00, 165.00, 14, TRUE
),
(
    362, 'CL-DRV-12', 'Chain Link Double Drive Gate 12ft x 6ft', 'Fabricated chain link double drive gate 12ft x 6ft including frame and standard latch hardware.', 'chain-link-gate', 'each', 689.00, 505.00, 8, TRUE
),
(
    363, 'WD-WALK-4', 'Wood Walk Gate 4ft x 6ft Privacy', 'Fabricated wood walk gate 4ft x 6ft privacy including frame and standard latch hardware.', 'wood-gate', 'each', 255.00, 182.00, 12, TRUE
),
(
    364, 'WD-DRV-10', 'Wood Double Drive Gate 10ft x 6ft Privacy', 'Fabricated wood double drive gate 10ft x 6ft privacy including frame and standard latch hardware.', 'wood-gate', 'each', 785.00, 564.00, 6, TRUE
),
(
    365, 'VY-WALK-4', 'Vinyl Walk Gate 4ft x 6ft Privacy White', 'Fabricated vinyl walk gate 4ft x 6ft privacy white including frame and standard latch hardware.', 'vinyl-gate', 'each', 429.00, 298.00, 10, TRUE
),
(
    366, 'VY-DRV-10', 'Vinyl Double Drive Gate 10ft x 6ft Privacy White', 'Fabricated vinyl double drive gate 10ft x 6ft privacy white including frame and standard latch hardware.', 'vinyl-gate', 'each', 1225.00, 856.00, 5, TRUE
),
(
    367, 'AL-WALK-4', 'Aluminum Walk Gate 4ft x 5ft Black', 'Fabricated aluminum walk gate 4ft x 5ft black including frame and standard latch hardware.', 'aluminum-gate', 'each', 512.00, 356.00, 9, TRUE
),
(
    368, 'AL-DRV-12', 'Aluminum Double Drive Gate 12ft x 5ft Black', 'Fabricated aluminum double drive gate 12ft x 5ft black including frame and standard latch hardware.', 'aluminum-gate', 'each', 1495.00, 1048.00, 4, TRUE
),
(
    369, 'HNG-CL-180', 'Chain Link Hinge Set 180 Degree', 'Heavy duty malleable hinge set for chain link walk gates.', 'hardware', 'set', 28.95, 19.50, 54, TRUE
),
(
    370, 'LCH-CL-FORK', 'Chain Link Fork Latch', 'Fork latch assembly for chain link swing gates.', 'hardware', 'each', 24.95, 17.25, 48, TRUE
),
(
    371, 'LCH-CL-CANT', 'Chain Link Cantilever Gate Latch', 'Industrial latch assembly for cantilever slide gates.', 'hardware', 'each', 88.00, 61.50, 18, TRUE
),
(
    372, 'WHEEL-6-RUB', '6in Rubber Gate Wheel', 'Bolt-on support wheel for swing or roll gates.', 'hardware', 'each', 36.50, 24.50, 36, TRUE
),
(
    373, 'DROPROD-24', '24in Zinc Drop Rod', 'Drop rod with keeper for double drive gates.', 'hardware', 'each', 18.95, 12.90, 75, TRUE
),
(
    374, 'LATCH-MAGNALATCH', 'MagnaLatch Top Pull', 'Key-lockable magnetic latch for vinyl and aluminum gates.', 'hardware', 'each', 92.00, 64.00, 24, TRUE
),
(
    375, 'HINGE-TCA-SELF', 'TruClose Self-Closing Hinge Pair', 'Polymer self-closing hinge pair for gates up to 66 pounds.', 'hardware', 'pair', 74.00, 51.25, 27, TRUE
),
(
    376, 'SCREW-EXT-1-5', 'Exterior Structural Screw 1-5/8in Box', '1-5/8 inch ceramic coated exterior screws, 5 pound box.', 'hardware', 'box', 39.95, 27.50, 82, TRUE
),
(
    377, 'SCREW-EXT-3', 'Exterior Structural Screw 3in Box', '3 inch ceramic coated exterior screws, 5 pound box.', 'hardware', 'box', 44.50, 30.75, 80, TRUE
),
(
    378, 'NAIL-RING-2', '2in Ring Shank Nail Coil', 'Galvanized ring shank nail coil for pneumatic nailers.', 'hardware', 'box', 58.00, 39.95, 32, TRUE
),
(
    379, 'CONC-FASTSET-50', 'Fast-Set Concrete 50lb Bag', 'Fast setting post hole concrete mix, 50 pound bag.', 'consumable', 'bag', 8.95, 5.20, 260, TRUE
),
(
    380, 'CONC-STD-80', 'General Purpose Concrete 80lb Bag', 'Standard ready-mix concrete, 80 pound bag.', 'consumable', 'bag', 7.95, 4.80, 310, TRUE
),
(
    381, 'GRAVEL-POST-50', 'Drain Rock 50lb Bag', 'Washed gravel for post drainage backfill.', 'consumable', 'bag', 6.50, 3.90, 145, TRUE
),
(
    382, 'TAPE-BARRIER-300', 'Safety Barrier Tape 300ft', 'High-visibility barrier tape for layout and work zone control.', 'consumable', 'roll', 12.95, 8.75, 45, TRUE
),
(
    383, 'TIE-WIRE-9GA', '9 Gauge Tie Wire Coil 100ft', 'Galvanized tie wire for chain link fabric and fittings.', 'hardware', 'coil', 16.95, 11.50, 52, TRUE
),
(
    384, 'TIE-WIRE-BLK', 'Black Tie Wire Coil 100ft', 'Black PVC coated tie wire for chain link fabric and fittings.', 'hardware', 'coil', 21.95, 15.25, 44, TRUE
),
(
    385, 'DOGEAR-CAP-4X4', 'Decorative Pyramid Cap 4x4', 'Decorative pyramid cap for nominal 4x4 wood posts.', 'hardware', 'each', 5.95, 3.80, 120, TRUE
),
(
    386, 'DOGEAR-CAP-6X6', 'Decorative Pyramid Cap 6x6', 'Decorative pyramid cap for nominal 6x6 wood posts.', 'hardware', 'each', 8.95, 5.90, 90, TRUE
),
(
    387, 'STAIN-CEDAR-1G', 'Transparent Cedar Stain 1gal', 'Exterior transparent stain for cedar fences.', 'finish', 'gallon', 48.00, 32.50, 38, TRUE
),
(
    388, 'SEAL-PT-1G', 'Clear Water Sealer 1gal', 'Clear water repellent sealer for treated lumber.', 'finish', 'gallon', 41.00, 27.75, 40, TRUE
),
(
    389, 'CLR-STRING-500', 'Mason String Line 500ft', 'Fluorescent mason string for layout and grading.', 'consumable', 'roll', 9.25, 5.80, 64, TRUE
),
(
    390, 'STK-WOOD-18', '18in Wood Survey Stakes Bundle', 'Bundle of 24 pointed wood stakes for project layout.', 'consumable', 'bundle', 16.50, 10.90, 30, TRUE
),
(
    391, 'FLAG-MARK-100', 'Marking Flags 100 Pack', 'Utility marking flags for irrigation and underground line marking.', 'consumable', 'pack', 18.95, 12.60, 35, TRUE
),
(
    392, 'SLAT-CL-BLK', 'Chain Link Privacy Slat Black 8ft Bag', 'Bottom-lock privacy slat bag for 8 foot chain link sections, black.', 'chain-link-accessory', 'bag', 89.00, 61.00, 26, TRUE
),
(
    393, 'SLAT-CL-GRN', 'Chain Link Privacy Slat Green 8ft Bag', 'Bottom-lock privacy slat bag for 8 foot chain link sections, green.', 'chain-link-accessory', 'bag', 89.00, 61.00, 22, TRUE
),
(
    394, 'SLAT-CL-BRN', 'Chain Link Privacy Slat Brown 8ft Bag', 'Bottom-lock privacy slat bag for 8 foot chain link sections, brown.', 'chain-link-accessory', 'bag', 92.00, 63.00, 18, TRUE
),
(
    395, 'CAP-SOLAR-4X4', 'Solar Post Cap 4x4', 'Solar powered LED post cap for nominal 4x4 posts.', 'hardware', 'each', 24.95, 17.50, 34, TRUE
),
(
    396, 'CAP-SOLAR-5X5', 'Solar Post Cap 5x5 Vinyl', 'Solar powered LED post cap for nominal 5x5 vinyl posts.', 'hardware', 'each', 29.95, 21.00, 28, TRUE
);

-- -----------------------------------------------------------------------------
-- SAMPLE AUDIT HISTORY
-- -----------------------------------------------------------------------------
INSERT INTO audit_log (id, table_name, record_id, action, old_values, new_values, user_id, created_at) VALUES
    (1, 'customers', 1, 'INSERT', NULL, '{"first_name":"Olivia","last_name":"Bennett"}'::json, 2, '2026-01-08 10:05:10+00'),
    (2, 'projects', 2, 'INSERT', NULL, '{"name":"Hale Backyard Privacy Upgrade","status":"approved"}'::json, 2, '2026-02-03 09:15:10+00'),
    (3, 'estimates', 2, 'UPDATE', '{"status":"sent"}'::json, '{"status":"approved"}'::json, 2, '2026-02-10 13:25:10+00'),
    (4, 'contracts', 1, 'INSERT', NULL, '{"status":"signed","signed_by":"Marcus Hale"}'::json, 2, '2026-02-11 15:00:10+00'),
    (5, 'payments', 1, 'INSERT', NULL, '{"amount":5195.74,"payment_method":"credit-card"}'::json, 2, '2026-02-11 15:05:10+00');

-- Align sequences with explicit seed IDs so future inserts use the next safe value.
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users), true);
SELECT setval('customers_id_seq', (SELECT COALESCE(MAX(id), 1) FROM customers), true);
SELECT setval('projects_id_seq', (SELECT COALESCE(MAX(id), 1) FROM projects), true);
SELECT setval('estimates_id_seq', (SELECT COALESCE(MAX(id), 1) FROM estimates), true);
SELECT setval('estimate_items_id_seq', (SELECT COALESCE(MAX(id), 1) FROM estimate_items), true);
SELECT setval('gates_id_seq', (SELECT COALESCE(MAX(id), 1) FROM gates), true);
SELECT setval('contracts_id_seq', (SELECT COALESCE(MAX(id), 1) FROM contracts), true);
SELECT setval('payments_id_seq', (SELECT COALESCE(MAX(id), 1) FROM payments), true);
SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 1) FROM products), true);
SELECT setval('photos_id_seq', (SELECT COALESCE(MAX(id), 1) FROM photos), true);
SELECT setval('audit_log_id_seq', (SELECT COALESCE(MAX(id), 1) FROM audit_log), true);

COMMIT;
