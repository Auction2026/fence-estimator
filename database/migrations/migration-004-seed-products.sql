-- Migration: 004
-- Date: 2026-08-11
-- Description: Seed the product catalog.

-- Fence Depot Estimator Inventory Seed Data
-- Inserts baseline product catalog records.

-- Chain Link products
INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-MESH-11G-4', 'Chain Link Mesh 11-Gauge 4ft x 50ft Roll', 'Chain Link', 'Mesh', 'chain_link', 'roll', 48.50, 72.75, 22, 5, 'Midwest Fence Supply', 'CL-MESH-11G-4', '11-gauge galvanized chain link mesh, 4ft height, 50ft roll');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-MESH-11G-5', 'Chain Link Mesh 11-Gauge 5ft x 50ft Roll', 'Chain Link', 'Mesh', 'chain_link', 'roll', 54.75, 82.15, 23, 5, 'Midwest Fence Supply', 'CL-MESH-11G-5', '11-gauge galvanized chain link mesh, 5ft height, 50ft roll');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-MESH-11G-6', 'Chain Link Mesh 11-Gauge 6ft x 50ft Roll', 'Chain Link', 'Mesh', 'chain_link', 'roll', 61.00, 91.55, 24, 5, 'Midwest Fence Supply', 'CL-MESH-11G-6', '11-gauge galvanized chain link mesh, 6ft height, 50ft roll');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-MESH-11G-7', 'Chain Link Mesh 11-Gauge 7ft x 50ft Roll', 'Chain Link', 'Mesh', 'chain_link', 'roll', 67.25, 100.95, 25, 5, 'Midwest Fence Supply', 'CL-MESH-11G-7', '11-gauge galvanized chain link mesh, 7ft height, 50ft roll');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-MESH-11G-8', 'Chain Link Mesh 11-Gauge 8ft x 50ft Roll', 'Chain Link', 'Mesh', 'chain_link', 'roll', 73.50, 110.35, 26, 5, 'Midwest Fence Supply', 'CL-MESH-11G-8', '11-gauge galvanized chain link mesh, 8ft height, 50ft roll');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-MESH-9G-4', 'Chain Link Mesh 9-Gauge 4ft x 50ft Roll', 'Chain Link', 'Mesh', 'chain_link', 'roll', 62.00, 93.00, 22, 5, 'Midwest Fence Supply', 'CL-MESH-9G-4', '9-gauge galvanized chain link mesh, 4ft height, 50ft roll');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-MESH-9G-5', 'Chain Link Mesh 9-Gauge 5ft x 50ft Roll', 'Chain Link', 'Mesh', 'chain_link', 'roll', 68.25, 102.40, 23, 5, 'Midwest Fence Supply', 'CL-MESH-9G-5', '9-gauge galvanized chain link mesh, 5ft height, 50ft roll');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-MESH-9G-6', 'Chain Link Mesh 9-Gauge 6ft x 50ft Roll', 'Chain Link', 'Mesh', 'chain_link', 'roll', 74.50, 111.80, 24, 5, 'Midwest Fence Supply', 'CL-MESH-9G-6', '9-gauge galvanized chain link mesh, 6ft height, 50ft roll');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-MESH-9G-7', 'Chain Link Mesh 9-Gauge 7ft x 50ft Roll', 'Chain Link', 'Mesh', 'chain_link', 'roll', 80.75, 121.20, 25, 5, 'Midwest Fence Supply', 'CL-MESH-9G-7', '9-gauge galvanized chain link mesh, 7ft height, 50ft roll');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-MESH-9G-8', 'Chain Link Mesh 9-Gauge 8ft x 50ft Roll', 'Chain Link', 'Mesh', 'chain_link', 'roll', 87.00, 130.60, 26, 5, 'Midwest Fence Supply', 'CL-MESH-9G-8', '9-gauge galvanized chain link mesh, 8ft height, 50ft roll');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-POST-LINE-2-3-8', 'Chain Link Line Post 2-3/8in x 8ft Galvanized', 'Chain Link', 'Posts', 'chain_link', 'each', 18.25, 27.35, 80, 10, 'Midwest Fence Supply', 'CL-POST-LINE-2-3-8', 'Galvanized line post for 4ft to 6ft chain link installations');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-POST-LINE-2-3-10', 'Chain Link Line Post 2-3/8in x 10ft Galvanized', 'Chain Link', 'Posts', 'chain_link', 'each', 24.75, 37.15, 70, 10, 'Midwest Fence Supply', 'CL-POST-LINE-2-3-10', 'Galvanized line post for 6ft to 8ft chain link installations');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-POST-LINE-2-3-12', 'Chain Link Line Post 2-3/8in x 12ft Galvanized', 'Chain Link', 'Posts', 'chain_link', 'each', 31.40, 47.10, 52, 8, 'Midwest Fence Supply', 'CL-POST-LINE-2-3-12', 'Long galvanized line post for athletic or security fence applications');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-POST-TERM-2-7-8', 'Chain Link Terminal Post 2-7/8in x 8ft Galvanized', 'Chain Link', 'Posts', 'chain_link', 'each', 28.50, 42.75, 60, 8, 'Midwest Fence Supply', 'CL-POST-TERM-2-7-8', 'Terminal post used at ends and corners');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-POST-TERM-2-7-10', 'Chain Link Terminal Post 2-7/8in x 10ft Galvanized', 'Chain Link', 'Posts', 'chain_link', 'each', 35.20, 52.80, 44, 8, 'Midwest Fence Supply', 'CL-POST-TERM-2-7-10', 'Longer terminal post for higher chain link runs');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-POST-CORNER-2-7-8', 'Chain Link Corner Post 2-7/8in x 8ft Galvanized', 'Chain Link', 'Posts', 'chain_link', 'each', 29.10, 43.65, 38, 8, 'Midwest Fence Supply', 'CL-POST-CORNER-2-7-8', 'Corner post with brace hardware compatibility');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-POST-CORNER-2-7-10', 'Chain Link Corner Post 2-7/8in x 10ft Galvanized', 'Chain Link', 'Posts', 'chain_link', 'each', 36.10, 54.15, 34, 8, 'Midwest Fence Supply', 'CL-POST-CORNER-2-7-10', 'Long corner post for tall chain link projects');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-POST-GATE-4-0-8', 'Chain Link Gate Post 4in x 8ft Galvanized', 'Chain Link', 'Posts', 'chain_link', 'each', 46.90, 70.35, 24, 4, 'Great Plains Fence', 'CL-POST-GATE-4-0-8', 'Heavy gate post for residential chain link walk gates');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-POST-GATE-4-0-10', 'Chain Link Gate Post 4in x 10ft Galvanized', 'Chain Link', 'Posts', 'chain_link', 'each', 57.25, 85.90, 18, 4, 'Great Plains Fence', 'CL-POST-GATE-4-0-10', 'Heavy gate post for commercial or drive gates');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-RAIL-TOP-1-3-21', 'Chain Link Top Rail 1-3/8in x 21ft Swedged', 'Chain Link', 'Top Rail', 'chain_link', 'piece', 19.60, 29.40, 96, 12, 'Great Plains Fence', 'CL-RAIL-TOP-1-3-21', 'Galvanized swedged top rail for standard chain link runs');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-RAIL-TOP-1-5-21', 'Chain Link Top Rail 1-5/8in x 21ft Swedged', 'Chain Link', 'Top Rail', 'chain_link', 'piece', 24.80, 37.20, 74, 10, 'Great Plains Fence', 'CL-RAIL-TOP-1-5-21', 'Heavier galvanized top rail for commercial chain link fencing');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-RAIL-BRACE-1-3-10', 'Chain Link Brace Rail 1-3/8in x 10ft', 'Chain Link', 'Top Rail', 'chain_link', 'piece', 10.90, 16.35, 70, 10, 'Great Plains Fence', 'CL-RAIL-BRACE-1-3-10', 'Brace rail for terminal and corner assemblies');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-RAIL-SLEEVE-1-3', 'Chain Link Top Rail Sleeve 1-3/8in', 'Chain Link', 'Hardware', 'chain_link', 'each', 2.15, 3.25, 240, 30, 'Great Plains Fence', 'CL-RAIL-SLEEVE-1-3', 'Sleeve used to join top rail sections');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-WIRE-TENSION-7G-250', 'Chain Link Tension Wire 7-Gauge 250ft Coil', 'Chain Link', 'Wire', 'chain_link', 'roll', 21.00, 31.50, 30, 6, 'Great Plains Fence', 'CL-WIRE-TENSION-7G-250', 'Galvanized bottom tension wire for chain link applications');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-WIRE-TENSION-9G-500', 'Chain Link Tension Wire 9-Gauge 500ft Coil', 'Chain Link', 'Wire', 'chain_link', 'roll', 28.80, 43.20, 24, 6, 'Great Plains Fence', 'CL-WIRE-TENSION-9G-500', 'Galvanized tension wire for longer runs');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-WIRE-HOGRING-100', 'Chain Link Hog Rings Box of 100', 'Chain Link', 'Hardware', 'chain_link', 'box', 7.50, 11.25, 65, 10, 'Great Plains Fence', 'CL-WIRE-HOGRING-100', 'Galvanized hog rings for fastening wire and mesh');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-WIRE-BARBED-4PT-1320', 'Barbed Wire 4-Point 1320ft Roll', 'Chain Link', 'Wire', 'chain_link', 'roll', 74.00, 111.00, 12, 4, 'Great Plains Fence', 'CL-WIRE-BARBED-4PT-1320', 'Galvanized barbed wire roll for security toppings');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-HW-TENSION-BAND-2-3', 'Chain Link Tension Band 2-3/8in', 'Chain Link', 'Hardware', 'chain_link', 'each', 0.95, 1.45, 500, 80, 'Great Plains Fence', 'CL-HW-TENSION-BAND-2-3', 'Tension band for attaching tension bar to terminal posts');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-HW-BRACE-BAND-2-3', 'Chain Link Brace Band 2-3/8in', 'Chain Link', 'Hardware', 'chain_link', 'each', 1.10, 1.65, 480, 80, 'Great Plains Fence', 'CL-HW-BRACE-BAND-2-3', 'Brace band for attaching brace rail to posts');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-HW-POST-CAP-2-3', 'Chain Link Dome Cap 2-3/8in', 'Chain Link', 'Hardware', 'chain_link', 'each', 1.35, 2.05, 220, 20, 'Great Plains Fence', 'CL-HW-POST-CAP-2-3', 'Galvanized dome cap for line posts');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-HW-LOOP-CAP-1-3', 'Chain Link Loop Cap 1-3/8in Rail End', 'Chain Link', 'Hardware', 'chain_link', 'each', 1.65, 2.50, 210, 20, 'Great Plains Fence', 'CL-HW-LOOP-CAP-1-3', 'Loop cap supporting top rail on line posts');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-HW-RAIL-END-1-3', 'Chain Link Rail End 1-3/8in', 'Chain Link', 'Hardware', 'chain_link', 'each', 1.45, 2.20, 260, 24, 'Great Plains Fence', 'CL-HW-RAIL-END-1-3', 'Rail end fitting for terminal post connections');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-HW-TENSION-BAR-4', 'Chain Link Tension Bar 4ft', 'Chain Link', 'Hardware', 'chain_link', 'each', 5.40, 8.10, 88, 12, 'Great Plains Fence', 'CL-HW-TENSION-BAR-4', 'Galvanized tension bar sized for 4ft chain link mesh');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-HW-TENSION-BAR-6', 'Chain Link Tension Bar 6ft', 'Chain Link', 'Hardware', 'chain_link', 'each', 7.60, 11.40, 66, 12, 'Great Plains Fence', 'CL-HW-TENSION-BAR-6', 'Galvanized tension bar sized for 6ft chain link mesh');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-HW-TRUSS-ROD-8', 'Chain Link Truss Rod 3/8in x 8ft', 'Chain Link', 'Hardware', 'chain_link', 'each', 8.90, 13.35, 54, 10, 'Great Plains Fence', 'CL-HW-TRUSS-ROD-8', 'Galvanized truss rod for end and corner bracing');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-HW-GATE-HINGE-SET', 'Chain Link Residential Gate Hinge Set', 'Chain Link', 'Hardware', 'chain_link', 'set', 16.25, 24.40, 32, 6, 'Great Plains Fence', 'CL-HW-GATE-HINGE-SET', 'Adjustable galvanized hinge set for residential chain link gates');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CL-HW-GATE-LATCH', 'Chain Link Fork Latch Assembly', 'Chain Link', 'Hardware', 'chain_link', 'each', 14.40, 21.60, 40, 8, 'Great Plains Fence', 'CL-HW-GATE-LATCH', 'Galvanized fork latch for chain link walk gates');

-- Wood products
INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-BOARD-CEDAR-1X6X6', 'Western Red Cedar Fence Board 1in x 6in x 6ft', 'Wood', 'Fence Boards', 'wood', 'each', 4.10, 6.15, 420, 40, 'Timberline Outdoor Supply', 'WD-BOARD-CEDAR-1X6X6', 'Premium cedar fence board with dog-ear top');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-BOARD-CEDAR-1X6X8', 'Western Red Cedar Fence Board 1in x 6in x 8ft', 'Wood', 'Fence Boards', 'wood', 'each', 5.35, 8.05, 310, 30, 'Timberline Outdoor Supply', 'WD-BOARD-CEDAR-1X6X8', 'Premium cedar fence board for taller privacy fences');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-BOARD-PT-1X6X6', 'Pressure-Treated Fence Board 1in x 6in x 6ft', 'Wood', 'Fence Boards', 'wood', 'each', 2.85, 4.30, 520, 50, 'Timberline Outdoor Supply', 'WD-BOARD-PT-1X6X6', 'Pressure-treated fence board for economical privacy fencing');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-BOARD-PT-1X6X8', 'Pressure-Treated Fence Board 1in x 6in x 8ft', 'Wood', 'Fence Boards', 'wood', 'each', 3.95, 5.95, 360, 40, 'Timberline Outdoor Supply', 'WD-BOARD-PT-1X6X8', 'Pressure-treated fence board for taller installations');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-PICKET-CEDAR-1X4X4', 'Cedar Gothic Picket 1in x 4in x 4ft', 'Wood', 'Pickets', 'wood', 'each', 2.35, 3.55, 460, 40, 'Timberline Outdoor Supply', 'WD-PICKET-CEDAR-1X4X4', 'Decorative cedar picket with gothic point');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-PICKET-CEDAR-1X4X5', 'Cedar Gothic Picket 1in x 4in x 5ft', 'Wood', 'Pickets', 'wood', 'each', 2.95, 4.45, 420, 35, 'Timberline Outdoor Supply', 'WD-PICKET-CEDAR-1X4X5', 'Decorative cedar picket for mid-height fencing');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-PICKET-CEDAR-1X4X6', 'Cedar Flat Top Picket 1in x 4in x 6ft', 'Wood', 'Pickets', 'wood', 'each', 3.20, 4.85, 380, 35, 'Timberline Outdoor Supply', 'WD-PICKET-CEDAR-1X4X6', 'Cedar flat-top picket for privacy and decorative runs');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-PICKET-PT-1X4X4', 'Pressure-Treated Dog-Ear Picket 1in x 4in x 4ft', 'Wood', 'Pickets', 'wood', 'each', 1.70, 2.60, 540, 50, 'Timberline Outdoor Supply', 'WD-PICKET-PT-1X4X4', 'Economical treated picket with dog-ear top');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-PICKET-PT-1X4X6', 'Pressure-Treated Dog-Ear Picket 1in x 4in x 6ft', 'Wood', 'Pickets', 'wood', 'each', 2.30, 3.50, 500, 50, 'Timberline Outdoor Supply', 'WD-PICKET-PT-1X4X6', 'Economical treated picket for privacy fences');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-PANEL-SHADOW-6X8', 'Wood Shadowbox Panel 6ft x 8ft', 'Wood', 'Panels', 'wood', 'panel', 68.00, 102.00, 28, 6, 'Timberline Outdoor Supply', 'WD-PANEL-SHADOW-6X8', 'Preassembled cedar shadowbox fence panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-PANEL-PRIVACY-6X8', 'Wood Privacy Panel 6ft x 8ft', 'Wood', 'Panels', 'wood', 'panel', 72.00, 108.00, 24, 6, 'Timberline Outdoor Supply', 'WD-PANEL-PRIVACY-6X8', 'Preassembled pressure-treated privacy panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-PANEL-PICKET-4X8', 'Wood Picket Panel 4ft x 8ft', 'Wood', 'Panels', 'wood', 'panel', 54.00, 81.00, 30, 6, 'Timberline Outdoor Supply', 'WD-PANEL-PICKET-4X8', 'Preassembled cedar picket panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-POST-4X4X8', 'Pressure-Treated Wood Post 4in x 4in x 8ft', 'Wood', 'Posts', 'wood', 'each', 15.25, 22.90, 120, 16, 'Timberline Outdoor Supply', 'WD-POST-4X4X8', 'Ground-contact pressure-treated fence post');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-POST-4X4X10', 'Pressure-Treated Wood Post 4in x 4in x 10ft', 'Wood', 'Posts', 'wood', 'each', 22.50, 33.75, 88, 12, 'Timberline Outdoor Supply', 'WD-POST-4X4X10', 'Ground-contact treated post for taller fences');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-POST-4X6X8', 'Pressure-Treated Wood Post 4in x 6in x 8ft', 'Wood', 'Posts', 'wood', 'each', 23.90, 35.85, 54, 10, 'Timberline Outdoor Supply', 'WD-POST-4X6X8', 'Heavy-duty treated post for gate and corner locations');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-POST-CEDAR-4X4X8', 'Rough Cedar Post 4in x 4in x 8ft', 'Wood', 'Posts', 'wood', 'each', 19.40, 29.10, 46, 8, 'Timberline Outdoor Supply', 'WD-POST-CEDAR-4X4X8', 'Cedar post for premium natural wood fences');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-RAIL-2X4X8', 'Pressure-Treated Rail 2in x 4in x 8ft', 'Wood', 'Rails', 'wood', 'each', 7.60, 11.40, 160, 20, 'Timberline Outdoor Supply', 'WD-RAIL-2X4X8', 'Pressure-treated horizontal fence rail');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-RAIL-2X4X10', 'Pressure-Treated Rail 2in x 4in x 10ft', 'Wood', 'Rails', 'wood', 'each', 9.25, 13.90, 110, 20, 'Timberline Outdoor Supply', 'WD-RAIL-2X4X10', 'Longer treated horizontal rail');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-RAIL-CEDAR-2X4X8', 'Cedar Rail 2in x 4in x 8ft', 'Wood', 'Rails', 'wood', 'each', 10.80, 16.20, 96, 16, 'Timberline Outdoor Supply', 'WD-RAIL-CEDAR-2X4X8', 'Premium cedar rail for natural wood installations');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-KICK-BOARD-2X6X8', 'Pressure-Treated Kick Board 2in x 6in x 8ft', 'Wood', 'Rails', 'wood', 'each', 8.95, 13.45, 70, 12, 'Timberline Outdoor Supply', 'WD-KICK-BOARD-2X6X8', 'Treated kick board for moisture-prone applications');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-HW-GALV-SCREW-5LB', 'Exterior Fence Screw 3in 5lb Box', 'Wood', 'Hardware', 'wood', 'box', 19.50, 29.25, 68, 8, 'Builder Hardware Direct', 'WD-HW-GALV-SCREW-5LB', 'Coated exterior-grade screws for fence assembly');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-HW-RING-NAIL-5LB', 'Galvanized Ring Shank Nail 2in 5lb Box', 'Wood', 'Hardware', 'wood', 'box', 17.80, 26.70, 72, 8, 'Builder Hardware Direct', 'WD-HW-RING-NAIL-5LB', 'Galvanized ring shank nails for wood fencing');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-HW-POST-CAP-4X4', 'Wood Post Cap Cedar 4in x 4in', 'Wood', 'Hardware', 'wood', 'each', 4.25, 6.40, 65, 8, 'Timberline Outdoor Supply', 'WD-HW-POST-CAP-4X4', 'Decorative cedar post cap');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-HW-POST-ANCHOR-4X4', 'Adjustable Post Anchor 4in x 4in', 'Wood', 'Hardware', 'wood', 'each', 13.60, 20.40, 36, 6, 'Builder Hardware Direct', 'WD-HW-POST-ANCHOR-4X4', 'Hot-dipped galvanized anchor for deck or concrete mounting');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-HW-HINGE-HEAVY', 'Heavy Duty Strap Hinge Pair Black', 'Wood', 'Hardware', 'wood', 'pair', 18.40, 27.60, 30, 6, 'Builder Hardware Direct', 'WD-HW-HINGE-HEAVY', 'Decorative heavy-duty strap hinge pair for wood gates');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WD-HW-LATCH-GRAVITY', 'Wood Gate Gravity Latch Black', 'Wood', 'Hardware', 'wood', 'each', 11.80, 17.70, 42, 6, 'Builder Hardware Direct', 'WD-HW-LATCH-GRAVITY', 'Self-latching gravity latch for wood gates');

-- Vinyl products
INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-PANEL-PRIVACY-6X8-WHT', 'Vinyl Privacy Panel White 6ft x 8ft', 'Vinyl', 'Panels', 'vinyl', 'panel', 118.00, 177.00, 34, 6, 'EverWhite Fence Products', 'VN-PANEL-PRIVACY-6X8-WHT', 'White routed vinyl privacy panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-PANEL-PRIVACY-6X8-TAN', 'Vinyl Privacy Panel Tan 6ft x 8ft', 'Vinyl', 'Panels', 'vinyl', 'panel', 122.00, 183.00, 28, 6, 'EverWhite Fence Products', 'VN-PANEL-PRIVACY-6X8-TAN', 'Tan routed vinyl privacy panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-PANEL-SEMI-4X8-WHT', 'Vinyl Semi-Privacy Panel White 4ft x 8ft', 'Vinyl', 'Panels', 'vinyl', 'panel', 98.00, 147.00, 30, 6, 'EverWhite Fence Products', 'VN-PANEL-SEMI-4X8-WHT', 'White semi-privacy vinyl fence panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-PANEL-SEMI-6X8-WHT', 'Vinyl Semi-Privacy Panel White 6ft x 8ft', 'Vinyl', 'Panels', 'vinyl', 'panel', 114.00, 171.00, 24, 6, 'EverWhite Fence Products', 'VN-PANEL-SEMI-6X8-WHT', 'Tall semi-privacy vinyl panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-PANEL-PICKET-4X8-WHT', 'Vinyl Picket Panel White 4ft x 8ft', 'Vinyl', 'Panels', 'vinyl', 'panel', 88.00, 132.00, 32, 6, 'EverWhite Fence Products', 'VN-PANEL-PICKET-4X8-WHT', 'Classic white vinyl picket panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-PANEL-RANCH-3X8-WHT', 'Vinyl Ranch Rail Panel White 3ft x 8ft', 'Vinyl', 'Panels', 'vinyl', 'panel', 74.00, 111.00, 36, 8, 'EverWhite Fence Products', 'VN-PANEL-RANCH-3X8-WHT', 'Three-rail ranch-style vinyl panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-PANEL-LATTICE-6X8-WHT', 'Vinyl Lattice Top Privacy Panel 6ft x 8ft', 'Vinyl', 'Panels', 'vinyl', 'panel', 136.00, 204.00, 18, 4, 'EverWhite Fence Products', 'VN-PANEL-LATTICE-6X8-WHT', 'Vinyl privacy panel with decorative lattice top');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-PANEL-CONTEMP-6X6-GRY', 'Vinyl Contemporary Panel Gray 6ft x 6ft', 'Vinyl', 'Panels', 'vinyl', 'panel', 140.00, 210.00, 16, 4, 'EverWhite Fence Products', 'VN-PANEL-CONTEMP-6X6-GRY', 'Modern gray tongue-and-groove panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-POST-5X5X8', 'Vinyl Routed Post 5in x 5in x 8ft', 'Vinyl', 'Posts', 'vinyl', 'each', 34.50, 51.75, 80, 10, 'EverWhite Fence Products', 'VN-POST-5X5X8', 'Routed line post for standard vinyl fence systems');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-POST-5X5X9', 'Vinyl Routed Post 5in x 5in x 9ft', 'Vinyl', 'Posts', 'vinyl', 'each', 39.80, 59.70, 64, 8, 'EverWhite Fence Products', 'VN-POST-5X5X9', 'Routed post for taller vinyl fence systems');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-POST-5X5-BLANK-8', 'Vinyl Blank Post 5in x 5in x 8ft', 'Vinyl', 'Posts', 'vinyl', 'each', 30.20, 45.30, 52, 8, 'EverWhite Fence Products', 'VN-POST-5X5-BLANK-8', 'Blank vinyl post for field-cut applications');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-POST-5X5-CORNER-8', 'Vinyl Routed Corner Post 5in x 5in x 8ft', 'Vinyl', 'Posts', 'vinyl', 'each', 36.90, 55.35, 42, 8, 'EverWhite Fence Products', 'VN-POST-5X5-CORNER-8', 'Corner post for routed vinyl systems');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-POST-5X5-END-8', 'Vinyl Routed End Post 5in x 5in x 8ft', 'Vinyl', 'Posts', 'vinyl', 'each', 35.90, 53.85, 40, 8, 'EverWhite Fence Products', 'VN-POST-5X5-END-8', 'End post for routed vinyl fence runs');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-POST-5X5-GATE-8', 'Vinyl Gate Post 5in x 5in x 8ft Reinforced', 'Vinyl', 'Posts', 'vinyl', 'each', 58.00, 87.00, 22, 4, 'EverWhite Fence Products', 'VN-POST-5X5-GATE-8', 'Heavy-duty reinforced gate post for vinyl systems');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-CAP-5X5-FLAT', 'Vinyl Post Cap Flat 5in x 5in', 'Vinyl', 'Caps', 'vinyl', 'each', 4.60, 6.90, 140, 20, 'EverWhite Fence Products', 'VN-CAP-5X5-FLAT', 'Flat white vinyl cap for 5in posts');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-CAP-5X5-NEWEL', 'Vinyl Post Cap New England 5in x 5in', 'Vinyl', 'Caps', 'vinyl', 'each', 8.95, 13.45, 96, 12, 'EverWhite Fence Products', 'VN-CAP-5X5-NEWEL', 'Decorative New England post cap');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-CAP-5X5-SOLAR', 'Vinyl Solar Post Cap 5in x 5in', 'Vinyl', 'Caps', 'vinyl', 'each', 28.50, 42.75, 20, 4, 'EverWhite Fence Products', 'VN-CAP-5X5-SOLAR', 'Solar LED cap for premium vinyl posts');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-CAP-5X5-GOTHIC', 'Vinyl Gothic Post Cap 5in x 5in', 'Vinyl', 'Caps', 'vinyl', 'each', 7.90, 11.85, 58, 8, 'EverWhite Fence Products', 'VN-CAP-5X5-GOTHIC', 'Decorative gothic cap for 5in vinyl posts');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-RAIL-PRIVACY-8', 'Vinyl Privacy Rail 8ft', 'Vinyl', 'Rails', 'vinyl', 'piece', 22.50, 33.75, 70, 10, 'EverWhite Fence Products', 'VN-RAIL-PRIVACY-8', 'Top or bottom rail for routed privacy panels');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-RAIL-PICKET-8', 'Vinyl Picket Rail 8ft', 'Vinyl', 'Rails', 'vinyl', 'piece', 18.25, 27.35, 72, 10, 'EverWhite Fence Products', 'VN-RAIL-PICKET-8', 'Routed rail for vinyl picket panels');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-RAIL-RANCH-8', 'Vinyl Ranch Rail 8ft', 'Vinyl', 'Rails', 'vinyl', 'piece', 19.60, 29.40, 68, 10, 'EverWhite Fence Products', 'VN-RAIL-RANCH-8', 'Horizontal ranch rail for open-style fences');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('VN-RAIL-ALUM-INSERT-8', 'Vinyl Gate Rail Aluminum Insert 8ft', 'Vinyl', 'Rails', 'vinyl', 'piece', 21.80, 32.70, 40, 8, 'EverWhite Fence Products', 'VN-RAIL-ALUM-INSERT-8', 'Aluminum stiffener insert for vinyl rails');

-- Wrought Iron products
INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-PANEL-4X6-BLK', 'Wrought Iron Panel Black 4ft x 6ft', 'Wrought Iron', 'Panels', 'wrought_iron', 'panel', 122.00, 183.00, 26, 4, 'IronCraft Supply', 'WI-PANEL-4X6-BLK', 'Powder-coated ornamental iron panel with spear pickets');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-PANEL-5X6-BLK', 'Wrought Iron Panel Black 5ft x 6ft', 'Wrought Iron', 'Panels', 'wrought_iron', 'panel', 138.00, 207.00, 22, 4, 'IronCraft Supply', 'WI-PANEL-5X6-BLK', 'Powder-coated ornamental iron panel for residential use');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-PANEL-6X6-BLK', 'Wrought Iron Panel Black 6ft x 6ft', 'Wrought Iron', 'Panels', 'wrought_iron', 'panel', 154.00, 231.00, 18, 4, 'IronCraft Supply', 'WI-PANEL-6X6-BLK', 'Tall ornamental iron panel for security and style');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-PANEL-4X8-BLK', 'Wrought Iron Panel Black 4ft x 8ft', 'Wrought Iron', 'Panels', 'wrought_iron', 'panel', 160.00, 240.00, 14, 4, 'IronCraft Supply', 'WI-PANEL-4X8-BLK', 'Longer ornamental iron panel section');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-PANEL-5X8-BLK', 'Wrought Iron Panel Black 5ft x 8ft', 'Wrought Iron', 'Panels', 'wrought_iron', 'panel', 182.00, 273.00, 12, 4, 'IronCraft Supply', 'WI-PANEL-5X8-BLK', 'Heavy-duty ornamental iron panel section');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-PANEL-POOL-4X6', 'Wrought Iron Pool Panel Black 4ft x 6ft', 'Wrought Iron', 'Panels', 'wrought_iron', 'panel', 128.00, 192.00, 20, 4, 'IronCraft Supply', 'WI-PANEL-POOL-4X6', 'Pool-code ornamental iron panel with tight picket spacing');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-PANEL-ARCH-4X6', 'Wrought Iron Arched Panel Black 4ft x 6ft', 'Wrought Iron', 'Panels', 'wrought_iron', 'panel', 148.00, 222.00, 10, 3, 'IronCraft Supply', 'WI-PANEL-ARCH-4X6', 'Decorative arched ornamental iron panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-PANEL-FLAT-3X6', 'Wrought Iron Flat Top Panel Black 3ft x 6ft', 'Wrought Iron', 'Panels', 'wrought_iron', 'panel', 104.00, 156.00, 18, 4, 'IronCraft Supply', 'WI-PANEL-FLAT-3X6', 'Decorative flat-top ornamental iron panel');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-POST-2X2X8', 'Wrought Iron Post 2in x 2in x 8ft Black', 'Wrought Iron', 'Posts', 'wrought_iron', 'each', 38.50, 57.75, 54, 8, 'IronCraft Supply', 'WI-POST-2X2X8', 'Powder-coated steel post for ornamental iron panels');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-POST-2X2X10', 'Wrought Iron Post 2in x 2in x 10ft Black', 'Wrought Iron', 'Posts', 'wrought_iron', 'each', 46.90, 70.35, 42, 8, 'IronCraft Supply', 'WI-POST-2X2X10', 'Longer post for taller iron fence sections');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-POST-2-5X2-5X8', 'Wrought Iron Gate Post 2.5in x 2.5in x 8ft Black', 'Wrought Iron', 'Posts', 'wrought_iron', 'each', 61.00, 91.50, 20, 4, 'IronCraft Supply', 'WI-POST-2-5X2-5X8', 'Heavy-duty gate post for ornamental iron gates');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-HW-BRACKET-LINE', 'Ornamental Iron Line Bracket Set Black', 'Wrought Iron', 'Hardware', 'wrought_iron', 'set', 5.10, 7.65, 100, 10, 'IronCraft Supply', 'WI-HW-BRACKET-LINE', 'Bracket set for line post panel connections');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-HW-BRACKET-CORNER', 'Ornamental Iron Corner Bracket Set Black', 'Wrought Iron', 'Hardware', 'wrought_iron', 'set', 5.45, 8.20, 94, 10, 'IronCraft Supply', 'WI-HW-BRACKET-CORNER', 'Bracket set for corner post panel connections');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-HW-GATE-HINGE', 'Ornamental Iron Self-Closing Hinge Pair', 'Wrought Iron', 'Hardware', 'wrought_iron', 'pair', 26.80, 40.20, 24, 4, 'IronCraft Supply', 'WI-HW-GATE-HINGE', 'Self-closing hinge pair for pool and pedestrian gates');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-HW-GATE-LATCH', 'Ornamental Iron Magna Latch Black', 'Wrought Iron', 'Hardware', 'wrought_iron', 'each', 32.90, 49.35, 18, 4, 'IronCraft Supply', 'WI-HW-GATE-LATCH', 'Magnetic safety latch for ornamental iron gates');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('WI-HW-TOUCHUP-BLK', 'Ornamental Iron Touch-Up Paint Black', 'Wrought Iron', 'Hardware', 'wrought_iron', 'each', 8.20, 12.30, 32, 4, 'IronCraft Supply', 'WI-HW-TOUCHUP-BLK', 'Touch-up paint for field scratches and cut ends');

-- Concrete products
INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CON-RM-50', 'Ready Mix Concrete 50lb Bag', 'Concrete', 'Bags', 'concrete', 'bag', 4.15, 6.25, 180, 40, 'QuikSet Materials', 'CON-RM-50', 'General-purpose ready mix concrete bag for fence post setting');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CON-RM-60', 'Ready Mix Concrete 60lb Bag', 'Concrete', 'Bags', 'concrete', 'bag', 4.95, 7.45, 220, 40, 'QuikSet Materials', 'CON-RM-60', 'General-purpose ready mix concrete bag for standard posts');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CON-RM-80', 'Ready Mix Concrete 80lb Bag', 'Concrete', 'Bags', 'concrete', 'bag', 6.30, 9.45, 260, 50, 'QuikSet Materials', 'CON-RM-80', 'Heavy-duty ready mix concrete bag for large post footings');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('CON-FAST-50', 'Fast-Setting Concrete 50lb Bag', 'Concrete', 'Bags', 'concrete', 'bag', 6.85, 10.30, 120, 25, 'QuikSet Materials', 'CON-FAST-50', 'Fast-setting concrete mix for rapid fence post installation');

-- Hardware products
INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-BOLT-CARR-3-8X4', 'Carriage Bolt 3/8in x 4in Zinc', 'Hardware', 'Bolts', 'hardware', 'each', 0.42, 0.65, 900, 100, 'Builder Hardware Direct', 'HW-BOLT-CARR-3-8X4', 'Zinc carriage bolt used for fence and gate hardware assemblies');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-BOLT-CARR-1-2X6', 'Carriage Bolt 1/2in x 6in Zinc', 'Hardware', 'Bolts', 'hardware', 'each', 0.88, 1.35, 620, 80, 'Builder Hardware Direct', 'HW-BOLT-CARR-1-2X6', 'Long zinc carriage bolt for heavy gate hardware');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-NUT-3-8', 'Hex Nut 3/8in Zinc', 'Hardware', 'Bolts', 'hardware', 'each', 0.09, 0.15, 2200, 150, 'Builder Hardware Direct', 'HW-NUT-3-8', 'Matching zinc hex nut for 3/8in bolts');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-WASHER-3-8', 'Flat Washer 3/8in Zinc', 'Hardware', 'Bolts', 'hardware', 'each', 0.05, 0.08, 2600, 150, 'Builder Hardware Direct', 'HW-WASHER-3-8', 'Matching zinc flat washer for 3/8in bolts');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-SCREW-TEK-1-25', 'Self-Drilling Tek Screw 1-1/4in Box of 250', 'Hardware', 'Screws', 'hardware', 'box', 14.80, 22.20, 84, 8, 'Builder Hardware Direct', 'HW-SCREW-TEK-1-25', 'Self-drilling screw box for metal brackets and hardware');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-SCREW-DECK-2-5', 'Deck Screw 2-1/2in Exterior Box of 350', 'Hardware', 'Screws', 'hardware', 'box', 22.40, 33.60, 56, 8, 'Builder Hardware Direct', 'HW-SCREW-DECK-2-5', 'Coated deck screws for treated lumber applications');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-BRACKET-U-2IN', 'U-Bracket 2in Galvanized', 'Hardware', 'Brackets', 'hardware', 'each', 3.20, 4.80, 150, 12, 'Builder Hardware Direct', 'HW-BRACKET-U-2IN', 'Universal galvanized bracket for custom fence fabrication');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-BRACKET-L-HEAVY', 'Heavy Duty L-Bracket Black', 'Hardware', 'Brackets', 'hardware', 'each', 4.90, 7.35, 120, 12, 'Builder Hardware Direct', 'HW-BRACKET-L-HEAVY', 'Powder-coated L-bracket for reinforcement and repairs');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-HINGE-T-10IN', 'T-Hinge 10in Zinc Pair', 'Hardware', 'Hinges', 'hardware', 'pair', 8.60, 12.90, 70, 8, 'Builder Hardware Direct', 'HW-HINGE-T-10IN', 'T-hinge pair for light wood and utility gates');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-HINGE-BALL-BEARING', 'Ball Bearing Gate Hinge Pair Black', 'Hardware', 'Hinges', 'hardware', 'pair', 18.90, 28.35, 40, 6, 'Builder Hardware Direct', 'HW-HINGE-BALL-BEARING', 'Ball-bearing hinge pair for smooth gate operation');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-LATCH-RING', 'Ring Latch Black', 'Hardware', 'Latches', 'hardware', 'each', 7.10, 10.70, 88, 8, 'Builder Hardware Direct', 'HW-LATCH-RING', 'Decorative ring latch for wood and ornamental gates');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-LATCH-KEYED', 'Keyed Gate Latch Stainless', 'Hardware', 'Latches', 'hardware', 'each', 24.50, 36.75, 24, 4, 'Builder Hardware Direct', 'HW-LATCH-KEYED', 'Lockable keyed latch for secure pedestrian gates');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-BRACE-KIT-GATE', 'Adjustable Gate Anti-Sag Kit', 'Hardware', 'Brackets', 'hardware', 'kit', 12.75, 19.15, 36, 4, 'Builder Hardware Direct', 'HW-BRACE-KIT-GATE', 'Adjustable cable kit to prevent gate sagging');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('HW-ANCHOR-WEDGE-1-2X5', 'Concrete Wedge Anchor 1/2in x 5in', 'Hardware', 'Bolts', 'hardware', 'each', 1.65, 2.50, 180, 20, 'Builder Hardware Direct', 'HW-ANCHOR-WEDGE-1-2X5', 'Concrete wedge anchor for post base plates');

-- Gates products
INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-CL-SW-4X4', 'Chain Link Single Walk Gate 4ft x 4ft', 'Gates', 'Chain Link Gates', 'chain_link', 'gate', 92.00, 138.00, 12, 3, 'Great Plains Fence', 'GATE-CL-SW-4X4', 'Pre-hung galvanized residential walk gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-CL-SW-4X5', 'Chain Link Single Walk Gate 4ft x 5ft', 'Gates', 'Chain Link Gates', 'chain_link', 'gate', 101.00, 151.50, 10, 3, 'Great Plains Fence', 'GATE-CL-SW-4X5', 'Pre-hung galvanized residential walk gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-CL-SW-4X6', 'Chain Link Single Walk Gate 4ft x 6ft', 'Gates', 'Chain Link Gates', 'chain_link', 'gate', 112.00, 168.00, 8, 3, 'Great Plains Fence', 'GATE-CL-SW-4X6', 'Pre-hung galvanized commercial walk gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-CL-DD-10X4', 'Chain Link Double Drive Gate 10ft x 4ft', 'Gates', 'Chain Link Gates', 'chain_link', 'gate', 268.00, 402.00, 6, 2, 'Great Plains Fence', 'GATE-CL-DD-10X4', 'Two-leaf galvanized double drive gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-CL-DD-12X6', 'Chain Link Double Drive Gate 12ft x 6ft', 'Gates', 'Chain Link Gates', 'chain_link', 'gate', 356.00, 534.00, 4, 2, 'Great Plains Fence', 'GATE-CL-DD-12X6', 'Commercial galvanized double drive gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-CL-SLIDE-20X6', 'Chain Link Cantilever Slide Gate 20ft x 6ft', 'Gates', 'Chain Link Gates', 'chain_link', 'gate', 1480.00, 2220.00, 2, 1, 'Great Plains Fence', 'GATE-CL-SLIDE-20X6', 'Heavy-duty cantilever slide gate frame package');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-WD-PRIVACY-4X6', 'Wood Privacy Gate 4ft x 6ft', 'Gates', 'Wood Gates', 'wood', 'gate', 145.00, 217.50, 8, 2, 'Timberline Outdoor Supply', 'GATE-WD-PRIVACY-4X6', 'Assembled cedar privacy walk gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-WD-PRIVACY-5X6', 'Wood Privacy Gate 5ft x 6ft', 'Gates', 'Wood Gates', 'wood', 'gate', 168.00, 252.00, 6, 2, 'Timberline Outdoor Supply', 'GATE-WD-PRIVACY-5X6', 'Assembled cedar privacy gate for larger openings');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-WD-PICKET-4X4', 'Wood Picket Gate 4ft x 4ft', 'Gates', 'Wood Gates', 'wood', 'gate', 118.00, 177.00, 8, 2, 'Timberline Outdoor Supply', 'GATE-WD-PICKET-4X4', 'Decorative cedar picket walk gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-WD-DOUBLE-10X6', 'Wood Double Drive Gate 10ft x 6ft', 'Gates', 'Wood Gates', 'wood', 'gate', 462.00, 693.00, 3, 1, 'Timberline Outdoor Supply', 'GATE-WD-DOUBLE-10X6', 'Framed double drive gate with heavy hinges');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-VN-PRIVACY-4X6-WHT', 'Vinyl Privacy Gate White 4ft x 6ft', 'Gates', 'Vinyl Gates', 'vinyl', 'gate', 184.00, 276.00, 8, 2, 'EverWhite Fence Products', 'GATE-VN-PRIVACY-4X6-WHT', 'Factory-assembled white vinyl privacy gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-VN-PRIVACY-5X6-TAN', 'Vinyl Privacy Gate Tan 5ft x 6ft', 'Gates', 'Vinyl Gates', 'vinyl', 'gate', 205.00, 307.50, 6, 2, 'EverWhite Fence Products', 'GATE-VN-PRIVACY-5X6-TAN', 'Factory-assembled tan vinyl privacy gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-VN-PICKET-4X4-WHT', 'Vinyl Picket Gate White 4ft x 4ft', 'Gates', 'Vinyl Gates', 'vinyl', 'gate', 152.00, 228.00, 6, 2, 'EverWhite Fence Products', 'GATE-VN-PICKET-4X4-WHT', 'Factory-assembled white vinyl picket gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-VN-RANCH-4X4-WHT', 'Vinyl Ranch Gate White 4ft x 4ft', 'Gates', 'Vinyl Gates', 'vinyl', 'gate', 144.00, 216.00, 6, 2, 'EverWhite Fence Products', 'GATE-VN-RANCH-4X4-WHT', 'Open-style ranch gate in white vinyl');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-WI-SW-4X4-BLK', 'Wrought Iron Walk Gate Black 4ft x 4ft', 'Gates', 'Iron Gates', 'wrought_iron', 'gate', 244.00, 366.00, 6, 2, 'IronCraft Supply', 'GATE-WI-SW-4X4-BLK', 'Single swing ornamental iron walk gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-WI-SW-4X5-BLK', 'Wrought Iron Walk Gate Black 4ft x 5ft', 'Gates', 'Iron Gates', 'wrought_iron', 'gate', 268.00, 402.00, 5, 2, 'IronCraft Supply', 'GATE-WI-SW-4X5-BLK', 'Single swing ornamental iron walk gate');

INSERT INTO inventory (sku, name, category, subcategory, fence_type, unit, unit_cost, retail_price, quantity_on_hand, reorder_level, supplier, supplier_sku, description)
VALUES ('GATE-WI-DD-10X6-BLK', 'Wrought Iron Double Drive Gate Black 10ft x 6ft', 'Gates', 'Iron Gates', 'wrought_iron', 'gate', 760.00, 1140.00, 2, 1, 'IronCraft Supply', 'GATE-WI-DD-10X6-BLK', 'Double drive ornamental iron gate for vehicle access');
