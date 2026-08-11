-- Migration 004: Insert catalog products

-- Fence Depot Fence Estimator
-- Seed data for fence material catalog.
-- Inserts realistic chain link, framework, accessory, gate,
-- privacy, security, and concrete products used by estimators.

PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;
INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-4-11.5GA', '4 ft Galvanized Chain Link Fabric 11.5GA', 'Fabric', 'Chain Link Fabric', 'lf', 1.45, 2.06, 'Galvanized chain link fence fabric, 4 ft tall, 11.5ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-4-11GA', '4 ft Galvanized Chain Link Fabric 11GA', 'Fabric', 'Chain Link Fabric', 'lf', 1.62, 2.30, 'Galvanized chain link fence fabric, 4 ft tall, 11ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-4-9GA', '4 ft Galvanized Chain Link Fabric 9GA', 'Fabric', 'Chain Link Fabric', 'lf', 2.05, 2.91, 'Galvanized chain link fence fabric, 4 ft tall, 9ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-5-11.5GA', '5 ft Galvanized Chain Link Fabric 11.5GA', 'Fabric', 'Chain Link Fabric', 'lf', 1.83, 2.60, 'Galvanized chain link fence fabric, 5 ft tall, 11.5ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-5-11GA', '5 ft Galvanized Chain Link Fabric 11GA', 'Fabric', 'Chain Link Fabric', 'lf', 2.00, 2.84, 'Galvanized chain link fence fabric, 5 ft tall, 11ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-5-9GA', '5 ft Galvanized Chain Link Fabric 9GA', 'Fabric', 'Chain Link Fabric', 'lf', 2.43, 3.45, 'Galvanized chain link fence fabric, 5 ft tall, 9ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-6-11.5GA', '6 ft Galvanized Chain Link Fabric 11.5GA', 'Fabric', 'Chain Link Fabric', 'lf', 2.27, 3.22, 'Galvanized chain link fence fabric, 6 ft tall, 11.5ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-6-11GA', '6 ft Galvanized Chain Link Fabric 11GA', 'Fabric', 'Chain Link Fabric', 'lf', 2.44, 3.46, 'Galvanized chain link fence fabric, 6 ft tall, 11ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-6-9GA', '6 ft Galvanized Chain Link Fabric 9GA', 'Fabric', 'Chain Link Fabric', 'lf', 2.87, 4.08, 'Galvanized chain link fence fabric, 6 ft tall, 9ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-8-11.5GA', '8 ft Galvanized Chain Link Fabric 11.5GA', 'Fabric', 'Chain Link Fabric', 'lf', 3.23, 4.59, 'Galvanized chain link fence fabric, 8 ft tall, 11.5ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-8-11GA', '8 ft Galvanized Chain Link Fabric 11GA', 'Fabric', 'Chain Link Fabric', 'lf', 3.40, 4.83, 'Galvanized chain link fence fabric, 8 ft tall, 11ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CL-8-9GA', '8 ft Galvanized Chain Link Fabric 9GA', 'Fabric', 'Chain Link Fabric', 'lf', 3.83, 5.44, 'Galvanized chain link fence fabric, 8 ft tall, 9ga woven mesh for commercial and residential fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CLB-4-9GA', '4 ft Black Vinyl Chain Link Fabric 9GA', 'Fabric', 'Vinyl Coated Fabric', 'lf', 2.68, 3.75, 'Black vinyl-coated chain link fabric, 4 ft tall, 9 gauge core wire for premium privacy-slat compatible installations.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CLB-5-9GA', '5 ft Black Vinyl Chain Link Fabric 9GA', 'Fabric', 'Vinyl Coated Fabric', 'lf', 3.06, 4.28, 'Black vinyl-coated chain link fabric, 5 ft tall, 9 gauge core wire for premium privacy-slat compatible installations.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CLB-6-9GA', '6 ft Black Vinyl Chain Link Fabric 9GA', 'Fabric', 'Vinyl Coated Fabric', 'lf', 3.50, 4.90, 'Black vinyl-coated chain link fabric, 6 ft tall, 9 gauge core wire for premium privacy-slat compatible installations.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CLB-8-9GA', '8 ft Black Vinyl Chain Link Fabric 9GA', 'Fabric', 'Vinyl Coated Fabric', 'lf', 4.46, 6.24, 'Black vinyl-coated chain link fabric, 8 ft tall, 9 gauge core wire for premium privacy-slat compatible installations.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-158-6FT', 'Line Post 1-5/8 in x 6 ft', 'Posts', 'Line Post', 'ea', 12.50, 18.38, 'Galvanized line post sized 1-5/8 in with 6 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-158-7FT', 'Line Post 1-5/8 in x 7 ft', 'Posts', 'Line Post', 'ea', 14.25, 20.95, 'Galvanized line post sized 1-5/8 in with 7 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-158-8FT', 'Line Post 1-5/8 in x 8 ft', 'Posts', 'Line Post', 'ea', 16.00, 23.52, 'Galvanized line post sized 1-5/8 in with 8 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-158-10FT', 'Line Post 1-5/8 in x 10 ft', 'Posts', 'Line Post', 'ea', 19.50, 28.66, 'Galvanized line post sized 1-5/8 in with 10 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-178-6FT', 'Line Post 1-7/8 in x 6 ft', 'Posts', 'Line Post', 'ea', 15.25, 22.42, 'Galvanized line post sized 1-7/8 in with 6 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-178-7FT', 'Line Post 1-7/8 in x 7 ft', 'Posts', 'Line Post', 'ea', 17.00, 24.99, 'Galvanized line post sized 1-7/8 in with 7 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-178-8FT', 'Line Post 1-7/8 in x 8 ft', 'Posts', 'Line Post', 'ea', 18.75, 27.56, 'Galvanized line post sized 1-7/8 in with 8 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-178-10FT', 'Line Post 1-7/8 in x 10 ft', 'Posts', 'Line Post', 'ea', 22.25, 32.71, 'Galvanized line post sized 1-7/8 in with 10 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-200-8FT', 'Line Post 2 in x 8 ft', 'Posts', 'Line Post', 'ea', 20.75, 30.50, 'Galvanized line post sized 2 in with 8 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-200-10FT', 'Line Post 2 in x 10 ft', 'Posts', 'Line Post', 'ea', 24.25, 35.65, 'Galvanized line post sized 2 in with 10 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-200-12FT', 'Line Post 2 in x 12 ft', 'Posts', 'Line Post', 'ea', 27.75, 40.79, 'Galvanized line post sized 2 in with 12 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-250-8FT', 'Line Post 2-1/2 in x 8 ft', 'Posts', 'Line Post', 'ea', 28.50, 41.90, 'Galvanized line post sized 2-1/2 in with 8 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-250-10FT', 'Line Post 2-1/2 in x 10 ft', 'Posts', 'Line Post', 'ea', 32.00, 47.04, 'Galvanized line post sized 2-1/2 in with 10 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('LP-250-12FT', 'Line Post 2-1/2 in x 12 ft', 'Posts', 'Line Post', 'ea', 35.50, 52.18, 'Galvanized line post sized 2-1/2 in with 12 ft overall length for chain link fence framework and mid-span support.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-END-238-6FT', 'End Post 2-3/8 in x 6 ft', 'Posts', 'Terminal Post', 'ea', 26.00, 37.70, 'Galvanized end post sized 2-3/8 in with 6 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-END-238-8FT', 'End Post 2-3/8 in x 8 ft', 'Posts', 'Terminal Post', 'ea', 32.20, 46.69, 'Galvanized end post sized 2-3/8 in with 8 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-END-238-10FT', 'End Post 2-3/8 in x 10 ft', 'Posts', 'Terminal Post', 'ea', 38.40, 55.68, 'Galvanized end post sized 2-3/8 in with 10 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-END-287-6FT', 'End Post 2-7/8 in x 6 ft', 'Posts', 'Terminal Post', 'ea', 38.00, 55.10, 'Galvanized end post sized 2-7/8 in with 6 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-END-287-8FT', 'End Post 2-7/8 in x 8 ft', 'Posts', 'Terminal Post', 'ea', 44.20, 64.09, 'Galvanized end post sized 2-7/8 in with 8 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-END-287-10FT', 'End Post 2-7/8 in x 10 ft', 'Posts', 'Terminal Post', 'ea', 50.40, 73.08, 'Galvanized end post sized 2-7/8 in with 10 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-END-400-6FT', 'End Post 4 in x 6 ft', 'Posts', 'Terminal Post', 'ea', 61.00, 88.45, 'Galvanized end post sized 4 in with 6 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-END-400-8FT', 'End Post 4 in x 8 ft', 'Posts', 'Terminal Post', 'ea', 67.20, 97.44, 'Galvanized end post sized 4 in with 8 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-END-400-10FT', 'End Post 4 in x 10 ft', 'Posts', 'Terminal Post', 'ea', 73.40, 106.43, 'Galvanized end post sized 4 in with 10 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-COR-238-6FT', 'Corner Post 2-3/8 in x 6 ft', 'Posts', 'Terminal Post', 'ea', 27.80, 40.31, 'Galvanized corner post sized 2-3/8 in with 6 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-COR-238-8FT', 'Corner Post 2-3/8 in x 8 ft', 'Posts', 'Terminal Post', 'ea', 34.00, 49.30, 'Galvanized corner post sized 2-3/8 in with 8 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-COR-238-10FT', 'Corner Post 2-3/8 in x 10 ft', 'Posts', 'Terminal Post', 'ea', 40.20, 58.29, 'Galvanized corner post sized 2-3/8 in with 10 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-COR-287-6FT', 'Corner Post 2-7/8 in x 6 ft', 'Posts', 'Terminal Post', 'ea', 39.80, 57.71, 'Galvanized corner post sized 2-7/8 in with 6 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-COR-287-8FT', 'Corner Post 2-7/8 in x 8 ft', 'Posts', 'Terminal Post', 'ea', 46.00, 66.70, 'Galvanized corner post sized 2-7/8 in with 8 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-COR-287-10FT', 'Corner Post 2-7/8 in x 10 ft', 'Posts', 'Terminal Post', 'ea', 52.20, 75.69, 'Galvanized corner post sized 2-7/8 in with 10 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-COR-400-6FT', 'Corner Post 4 in x 6 ft', 'Posts', 'Terminal Post', 'ea', 62.80, 91.06, 'Galvanized corner post sized 4 in with 6 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-COR-400-8FT', 'Corner Post 4 in x 8 ft', 'Posts', 'Terminal Post', 'ea', 69.00, 100.05, 'Galvanized corner post sized 4 in with 8 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-COR-400-10FT', 'Corner Post 4 in x 10 ft', 'Posts', 'Terminal Post', 'ea', 75.20, 109.04, 'Galvanized corner post sized 4 in with 10 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-GATE-238-6FT', 'Gate Post 2-3/8 in x 6 ft', 'Posts', 'Terminal Post', 'ea', 30.25, 43.86, 'Galvanized gate post sized 2-3/8 in with 6 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-GATE-238-8FT', 'Gate Post 2-3/8 in x 8 ft', 'Posts', 'Terminal Post', 'ea', 36.45, 52.85, 'Galvanized gate post sized 2-3/8 in with 8 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-GATE-238-10FT', 'Gate Post 2-3/8 in x 10 ft', 'Posts', 'Terminal Post', 'ea', 42.65, 61.84, 'Galvanized gate post sized 2-3/8 in with 10 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-GATE-287-6FT', 'Gate Post 2-7/8 in x 6 ft', 'Posts', 'Terminal Post', 'ea', 42.25, 61.26, 'Galvanized gate post sized 2-7/8 in with 6 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-GATE-287-8FT', 'Gate Post 2-7/8 in x 8 ft', 'Posts', 'Terminal Post', 'ea', 48.45, 70.25, 'Galvanized gate post sized 2-7/8 in with 8 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-GATE-287-10FT', 'Gate Post 2-7/8 in x 10 ft', 'Posts', 'Terminal Post', 'ea', 54.65, 79.24, 'Galvanized gate post sized 2-7/8 in with 10 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-GATE-400-6FT', 'Gate Post 4 in x 6 ft', 'Posts', 'Terminal Post', 'ea', 65.25, 94.61, 'Galvanized gate post sized 4 in with 6 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-GATE-400-8FT', 'Gate Post 4 in x 8 ft', 'Posts', 'Terminal Post', 'ea', 71.45, 103.60, 'Galvanized gate post sized 4 in with 8 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TP-GATE-400-10FT', 'Gate Post 4 in x 10 ft', 'Posts', 'Terminal Post', 'ea', 77.65, 112.59, 'Galvanized gate post sized 4 in with 10 ft length for bracing ends, corners, and gate openings.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TR-138-21FT', 'Top Rail 1-3/8 in x 21 ft', 'Rails', 'Top Rail', 'ea', 18.75, 26.81, 'Swedged galvanized top rail, 1-3/8 in diameter and 21 ft long, used to tie chain link framework together.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TR-138-24FT', 'Top Rail 1-3/8 in x 24 ft', 'Rails', 'Top Rail', 'ea', 21.95, 31.39, 'Swedged galvanized top rail, 1-3/8 in diameter and 24 ft long, used to tie chain link framework together.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TR-158-21FT', 'Top Rail 1-5/8 in x 21 ft', 'Rails', 'Top Rail', 'ea', 24.10, 34.46, 'Swedged galvanized top rail, 1-5/8 in diameter and 21 ft long, used to tie chain link framework together.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TR-158-24FT', 'Top Rail 1-5/8 in x 24 ft', 'Rails', 'Top Rail', 'ea', 28.35, 40.54, 'Swedged galvanized top rail, 1-5/8 in diameter and 24 ft long, used to tie chain link framework together.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TRS-138', 'Top Rail Sleeve 1-3/8 in', 'Rails', 'Rail Sleeve', 'ea', 4.65, 6.79, 'Galvanized rail sleeve for joining 1-3/8 in top rail sections on long fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TRS-158', 'Top Rail Sleeve 1-5/8 in', 'Rails', 'Rail Sleeve', 'ea', 6.15, 8.98, 'Galvanized rail sleeve for joining 1-5/8 in top rail sections on long fence runs.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TW-7GA-GALV-500', '7GA Galvanized Tension Wire 500 ft Coil', 'Wire', 'Tension Wire', 'coil', 96.00, 132.48, 'Galvanized 7 gauge bottom tension wire in a 500 ft coil for stabilizing chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TW-7GA-BLK-500', '7GA Black Tension Wire 500 ft Coil', 'Wire', 'Tension Wire', 'coil', 121.00, 166.98, 'Black PVC-coated 7 gauge tension wire in a 500 ft coil for black chain link systems.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TW-9GA-GALV-500', '9GA Galvanized Tension Wire 500 ft Coil', 'Wire', 'Tension Wire', 'coil', 78.00, 107.64, 'Galvanized 9 gauge tension wire in a 500 ft coil for lighter chain link applications.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TW-9GA-BLK-500', '9GA Black Tension Wire 500 ft Coil', 'Wire', 'Tension Wire', 'coil', 99.00, 136.62, 'Black PVC-coated 9 gauge tension wire in a 500 ft coil for ornamental chain link installations.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('BB-158', 'Brace Band 1-5/8 in', 'Fittings', 'Brace Band', 'ea', 0.68, 1.07, 'Galvanized brace band 1-5/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('BB-178', 'Brace Band 1-7/8 in', 'Fittings', 'Brace Band', 'ea', 0.75, 1.18, 'Galvanized brace band 1-7/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('BB-238', 'Brace Band 2-3/8 in', 'Fittings', 'Brace Band', 'ea', 0.88, 1.39, 'Galvanized brace band 2-3/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('BB-287', 'Brace Band 2-7/8 in', 'Fittings', 'Brace Band', 'ea', 1.10, 1.74, 'Galvanized brace band 2-7/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('BB-400', 'Brace Band 4 in', 'Fittings', 'Brace Band', 'ea', 1.95, 3.08, 'Galvanized brace band 4 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TB-158', 'Tension Band 1-5/8 in', 'Fittings', 'Tension Band', 'ea', 0.54, 0.85, 'Galvanized tension band 1-5/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TB-178', 'Tension Band 1-7/8 in', 'Fittings', 'Tension Band', 'ea', 0.61, 0.96, 'Galvanized tension band 1-7/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TB-238', 'Tension Band 2-3/8 in', 'Fittings', 'Tension Band', 'ea', 0.73, 1.15, 'Galvanized tension band 2-3/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TB-287', 'Tension Band 2-7/8 in', 'Fittings', 'Tension Band', 'ea', 0.94, 1.49, 'Galvanized tension band 2-7/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TB-400', 'Tension Band 4 in', 'Fittings', 'Tension Band', 'ea', 1.66, 2.62, 'Galvanized tension band 4 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('RE-138', 'Rail End 1-3/8 in', 'Fittings', 'Rail End', 'ea', 1.42, 2.24, 'Galvanized rail end 1-3/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('RE-158', 'Rail End 1-5/8 in', 'Fittings', 'Rail End', 'ea', 1.65, 2.61, 'Galvanized rail end 1-5/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('RE-178', 'Rail End 1-7/8 in', 'Fittings', 'Rail End', 'ea', 1.90, 3.00, 'Galvanized rail end 1-7/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('RE-238', 'Rail End 2-3/8 in', 'Fittings', 'Rail End', 'ea', 2.18, 3.44, 'Galvanized rail end 2-3/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('RE-287', 'Rail End 2-7/8 in', 'Fittings', 'Rail End', 'ea', 2.75, 4.34, 'Galvanized rail end 2-7/8 in used in chain link framework assembly and fabric tensioning.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TWIRE-6GA-1LB', '6GA Aluminum Tie Wire 1 lb Roll', 'Fittings', 'Tie Wire', 'roll', 9.80, 14.90, 'Aluminum tie wire roll for securing fabric to line posts and rails.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TWIRE-9GA-5LB', '9GA Galvanized Tie Wire 5 lb Roll', 'Fittings', 'Tie Wire', 'roll', 18.40, 27.97, 'Galvanized tie wire roll for larger chain link tie-off quantities.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('HR-ALUM-1000', 'Aluminum Hog Rings 1000 Count', 'Fittings', 'Hog Ring', 'box', 19.75, 30.02, 'Aluminum hog rings for fastening chain link fabric to bottom tension wire.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('HR-SS-1000', 'Stainless Hog Rings 1000 Count', 'Fittings', 'Hog Ring', 'box', 28.60, 43.47, 'Stainless hog rings for corrosion-resistant installations near pools or coastal areas.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TBAR-4FT', 'Tension Bar 4 ft', 'Fittings', 'Tension Bar', 'ea', 6.25, 9.50, 'Galvanized tension bar sized for 4 ft chain link fabric terminations.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TBAR-5FT', 'Tension Bar 5 ft', 'Fittings', 'Tension Bar', 'ea', 7.15, 10.87, 'Galvanized tension bar sized for 5 ft chain link fabric terminations.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TBAR-6FT', 'Tension Bar 6 ft', 'Fittings', 'Tension Bar', 'ea', 8.10, 12.31, 'Galvanized tension bar sized for 6 ft chain link fabric terminations.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TBAR-8FT', 'Tension Bar 8 ft', 'Fittings', 'Tension Bar', 'ea', 10.95, 16.64, 'Galvanized tension bar sized for 8 ft chain link fabric terminations.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('PCAP-158-LP', 'Dome Cap 1-5/8 in Line Post', 'Fittings', 'Post Cap', 'ea', 1.05, 1.60, 'Pressed steel dome cap for 1-5/8 in line posts.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('PCAP-178-LP', 'Dome Cap 1-7/8 in Line Post', 'Fittings', 'Post Cap', 'ea', 1.18, 1.79, 'Pressed steel dome cap for 1-7/8 in line posts.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('PCAP-238-TP', 'Loop Cap 2-3/8 in Terminal Post', 'Fittings', 'Post Cap', 'ea', 2.65, 4.03, 'Galvanized loop cap sized for 2-3/8 in terminal posts and 1-3/8 in top rail.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('PCAP-287-TP', 'Loop Cap 2-7/8 in Terminal Post', 'Fittings', 'Post Cap', 'ea', 3.15, 4.79, 'Galvanized loop cap sized for 2-7/8 in terminal posts and 1-5/8 in top rail.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('PCAP-400-TP', 'Boulevard Clamp 4 in Terminal Post', 'Fittings', 'Post Cap', 'ea', 7.95, 12.08, 'Heavy galvanized boulevard clamp cap for 4 in terminal posts on commercial chain link fences.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('TRUSS-38', 'Truss Rod 3/8 in x 18 in', 'Fittings', 'Truss Rod', 'ea', 4.85, 7.37, 'Galvanized truss rod used with brace bands for end and corner bracing.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GF-WALK-4X4', 'Walk Gate Frame 4 ft x 4 ft', 'Gates', 'Gate Frame', 'ea', 88.00, 126.72, 'Pre-welded galvanized walk gate frame sized for a 4 ft wide by 4 ft tall opening.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GF-WALK-4X5', 'Walk Gate Frame 4 ft x 5 ft', 'Gates', 'Gate Frame', 'ea', 96.50, 138.96, 'Pre-welded galvanized walk gate frame sized for a 4 ft wide by 5 ft tall opening.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GF-WALK-4X6', 'Walk Gate Frame 4 ft x 6 ft', 'Gates', 'Gate Frame', 'ea', 108.00, 155.52, 'Pre-welded galvanized walk gate frame sized for a 4 ft wide by 6 ft tall opening.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GF-DRIVE-10X4', 'Double Drive Gate Frame 10 ft x 4 ft', 'Gates', 'Gate Frame', 'ea', 205.00, 295.20, 'Double drive galvanized gate frame for a 10 ft wide by 4 ft tall vehicle entrance.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GF-DRIVE-10X5', 'Double Drive Gate Frame 10 ft x 5 ft', 'Gates', 'Gate Frame', 'ea', 224.00, 322.56, 'Double drive galvanized gate frame for a 10 ft wide by 5 ft tall vehicle entrance.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GF-DRIVE-12X6', 'Double Drive Gate Frame 12 ft x 6 ft', 'Gates', 'Gate Frame', 'ea', 268.00, 385.92, 'Double drive galvanized gate frame for a 12 ft wide by 6 ft tall vehicle entrance.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GF-DRIVE-14X6', 'Double Drive Gate Frame 14 ft x 6 ft', 'Gates', 'Gate Frame', 'ea', 294.00, 423.36, 'Double drive galvanized gate frame for a 14 ft wide by 6 ft tall vehicle entrance.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GH-HINGE-180', '180 Degree Residential Gate Hinge Set', 'Gates', 'Gate Hardware', 'pair', 26.50, 38.16, 'Pair of adjustable hinges for residential chain link walk gates.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GH-HINGE-COM', 'Heavy Duty Commercial Gate Hinge Set', 'Gates', 'Gate Hardware', 'pair', 48.00, 69.12, 'Heavy-duty hinge set for commercial swing gates and large walk gates.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GH-LATCH-FORK', 'Fork Latch Assembly', 'Gates', 'Gate Hardware', 'set', 21.75, 31.32, 'Galvanized fork latch assembly for standard chain link walk gates.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GH-LATCH-DBL', 'Drop Fork Latch for Double Gate', 'Gates', 'Gate Hardware', 'set', 35.50, 51.12, 'Center latch assembly for double drive gate applications.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GH-CANE-24', 'Cane Bolt 24 in', 'Gates', 'Gate Hardware', 'set', 18.40, 26.50, '24 inch cane bolt for securing inactive leaf on double gates.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GH-DROPROD-36', 'Drop Rod 36 in', 'Gates', 'Gate Hardware', 'set', 24.25, 34.92, '36 inch drop rod for commercial double gate installations.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GH-WHEEL-6', 'Gate Wheel 6 in Pneumatic', 'Gates', 'Gate Hardware', 'set', 34.60, 49.82, 'Pneumatic support wheel to reduce sag on wide swing gates.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GH-CLOSER-HYD', 'Hydraulic Gate Closer', 'Gates', 'Gate Hardware', 'set', 86.00, 123.84, 'Hydraulic gate closer for self-closing pedestrian security gates.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('GH-LOCK-LATCH', 'Padlockable Gravity Latch', 'Gates', 'Gate Hardware', 'set', 29.95, 43.13, 'Padlockable gravity latch for secure pool and perimeter walk gates.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-BLK-4FT', 'Black Privacy Slats for 4 ft Chain Link', 'Privacy', 'Slats', 'bag', 47.00, 66.27, 'black privacy slat package sized to fill approximately 10 linear feet of 4 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-BLK-5FT', 'Black Privacy Slats for 5 ft Chain Link', 'Privacy', 'Slats', 'bag', 56.00, 78.96, 'black privacy slat package sized to fill approximately 10 linear feet of 5 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-BLK-6FT', 'Black Privacy Slats for 6 ft Chain Link', 'Privacy', 'Slats', 'bag', 68.00, 95.88, 'black privacy slat package sized to fill approximately 10 linear feet of 6 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-BLK-8FT', 'Black Privacy Slats for 8 ft Chain Link', 'Privacy', 'Slats', 'bag', 94.00, 132.54, 'black privacy slat package sized to fill approximately 10 linear feet of 8 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-GRN-4FT', 'Green Privacy Slats for 4 ft Chain Link', 'Privacy', 'Slats', 'bag', 49.00, 69.09, 'green privacy slat package sized to fill approximately 10 linear feet of 4 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-GRN-5FT', 'Green Privacy Slats for 5 ft Chain Link', 'Privacy', 'Slats', 'bag', 58.00, 81.78, 'green privacy slat package sized to fill approximately 10 linear feet of 5 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-GRN-6FT', 'Green Privacy Slats for 6 ft Chain Link', 'Privacy', 'Slats', 'bag', 70.00, 98.70, 'green privacy slat package sized to fill approximately 10 linear feet of 6 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-GRN-8FT', 'Green Privacy Slats for 8 ft Chain Link', 'Privacy', 'Slats', 'bag', 96.00, 135.36, 'green privacy slat package sized to fill approximately 10 linear feet of 8 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-BRN-4FT', 'Brown Privacy Slats for 4 ft Chain Link', 'Privacy', 'Slats', 'bag', 50.50, 71.20, 'brown privacy slat package sized to fill approximately 10 linear feet of 4 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-BRN-5FT', 'Brown Privacy Slats for 5 ft Chain Link', 'Privacy', 'Slats', 'bag', 59.50, 83.90, 'brown privacy slat package sized to fill approximately 10 linear feet of 5 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-BRN-6FT', 'Brown Privacy Slats for 6 ft Chain Link', 'Privacy', 'Slats', 'bag', 71.50, 100.82, 'brown privacy slat package sized to fill approximately 10 linear feet of 6 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('SLAT-BRN-8FT', 'Brown Privacy Slats for 8 ft Chain Link', 'Privacy', 'Slats', 'bag', 97.50, 137.48, 'brown privacy slat package sized to fill approximately 10 linear feet of 8 ft chain link fabric.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('BW-4PT-1320', '4 Point Barbed Wire 1320 ft Roll', 'Security', 'Barbed Wire', 'roll', 89.00, 123.71, 'Standard 4-point galvanized barbed wire roll for topping security fences.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('BW-4PT-BLK-1320', '4 Point Black Barbed Wire 1320 ft Roll', 'Security', 'Barbed Wire', 'roll', 124.00, 172.36, 'Black PVC-coated 4-point barbed wire roll for security fence toppings on black systems.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('BW-6PT-1320', '6 Point Barbed Wire 1320 ft Roll', 'Security', 'Barbed Wire', 'roll', 97.50, 135.52, 'High-security 6-point galvanized barbed wire roll for deterrence applications.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CONC-80', 'Concrete Mix 80 lb Bag', 'Materials', 'Concrete', 'bag', 5.85, 8.13, '80 lb bag of general-purpose concrete mix for setting fence posts.');

INSERT OR IGNORE INTO catalog_products (sku, name, category, subcategory, unit, cost, price, description)
VALUES ('CONC-80-HI', 'High Early Concrete Mix 80 lb Bag', 'Materials', 'Concrete', 'bag', 7.25, 10.08, '80 lb bag of high-early-strength concrete mix for accelerated post setting.');

COMMIT;
