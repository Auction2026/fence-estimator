BEGIN;
SET search_path TO public;

-- Replace this placeholder hash with a real bcrypt hash before production use.
INSERT INTO users (username, email, password_hash, role, is_active)
VALUES ('admin', 'admin@fencedepot.local', '$2b$12$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', 'admin', TRUE)
ON CONFLICT (username) DO UPDATE
SET email = EXCLUDED.email,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

INSERT INTO inventory (sku, name, description, category, unit, unit_cost, unit_price, quantity_on_hand, reorder_level, supplier, is_active)
VALUES
('CL-LP-1-58in-L06-GAL', 'Line Post 1-5/8 in x 6 ft (galvanized)', 'Commercial-grade line post in 1-5/8 in OD, 6 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 11.75, 18.57, 24, 8, 'Merchants Metals', TRUE),
('CL-LP-1-58in-L06-BLK', 'Line Post 1-5/8 in x 6 ft (black powder-coated)', 'Commercial-grade line post in 1-5/8 in OD, 6 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 15.25, 24.10, 24, 8, 'Merchants Metals', TRUE),
('CL-LP-1-58in-L08-GAL', 'Line Post 1-5/8 in x 8 ft (galvanized)', 'Commercial-grade line post in 1-5/8 in OD, 8 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 15.85, 25.04, 26, 8, 'Merchants Metals', TRUE),
('CL-LP-1-58in-L08-BLK', 'Line Post 1-5/8 in x 8 ft (black powder-coated)', 'Commercial-grade line post in 1-5/8 in OD, 8 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 19.95, 31.52, 26, 8, 'Merchants Metals', TRUE),
('CL-LP-1-58in-L10-GAL', 'Line Post 1-5/8 in x 10 ft (galvanized)', 'Commercial-grade line post in 1-5/8 in OD, 10 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 19.95, 31.52, 28, 8, 'Merchants Metals', TRUE),
('CL-LP-1-58in-L10-BLK', 'Line Post 1-5/8 in x 10 ft (black powder-coated)', 'Commercial-grade line post in 1-5/8 in OD, 10 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 24.65, 38.95, 28, 8, 'Merchants Metals', TRUE),
('CL-LP-1-58in-L12-GAL', 'Line Post 1-5/8 in x 12 ft (galvanized)', 'Commercial-grade line post in 1-5/8 in OD, 12 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 24.05, 38.00, 30, 8, 'Merchants Metals', TRUE),
('CL-LP-1-58in-L12-BLK', 'Line Post 1-5/8 in x 12 ft (black powder-coated)', 'Commercial-grade line post in 1-5/8 in OD, 12 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 29.35, 46.37, 30, 8, 'Merchants Metals', TRUE),
('CL-TP-2-38in-L08-GAL', 'Terminal Post 2-3/8 in x 8 ft (galvanized)', 'Commercial-grade terminal post in 2-3/8 in OD, 8 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 19.50, 30.81, 26, 8, 'Merchants Metals', TRUE),
('CL-TP-2-38in-L08-BLK', 'Terminal Post 2-3/8 in x 8 ft (black powder-coated)', 'Commercial-grade terminal post in 2-3/8 in OD, 8 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 24.00, 37.92, 26, 8, 'Merchants Metals', TRUE),
('CL-TP-2-38in-L10-GAL', 'Terminal Post 2-3/8 in x 10 ft (galvanized)', 'Commercial-grade terminal post in 2-3/8 in OD, 10 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 23.60, 37.29, 28, 8, 'Merchants Metals', TRUE),
('CL-TP-2-38in-L10-BLK', 'Terminal Post 2-3/8 in x 10 ft (black powder-coated)', 'Commercial-grade terminal post in 2-3/8 in OD, 10 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 28.70, 45.35, 28, 8, 'Merchants Metals', TRUE),
('CL-TP-2-38in-L12-GAL', 'Terminal Post 2-3/8 in x 12 ft (galvanized)', 'Commercial-grade terminal post in 2-3/8 in OD, 12 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 27.70, 43.77, 30, 8, 'Merchants Metals', TRUE),
('CL-TP-2-38in-L12-BLK', 'Terminal Post 2-3/8 in x 12 ft (black powder-coated)', 'Commercial-grade terminal post in 2-3/8 in OD, 12 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 33.40, 52.77, 30, 8, 'Merchants Metals', TRUE),
('CL-CP-2-78in-L08-GAL', 'Corner Post 2-7/8 in x 8 ft (galvanized)', 'Commercial-grade corner post in 2-7/8 in OD, 8 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 28.00, 44.24, 26, 8, 'Merchants Metals', TRUE),
('CL-CP-2-78in-L08-BLK', 'Corner Post 2-7/8 in x 8 ft (black powder-coated)', 'Commercial-grade corner post in 2-7/8 in OD, 8 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 33.50, 52.93, 26, 8, 'Merchants Metals', TRUE),
('CL-CP-2-78in-L10-GAL', 'Corner Post 2-7/8 in x 10 ft (galvanized)', 'Commercial-grade corner post in 2-7/8 in OD, 10 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 32.10, 50.72, 28, 8, 'Merchants Metals', TRUE),
('CL-CP-2-78in-L10-BLK', 'Corner Post 2-7/8 in x 10 ft (black powder-coated)', 'Commercial-grade corner post in 2-7/8 in OD, 10 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 38.20, 60.36, 28, 8, 'Merchants Metals', TRUE),
('CL-CP-2-78in-L12-GAL', 'Corner Post 2-7/8 in x 12 ft (galvanized)', 'Commercial-grade corner post in 2-7/8 in OD, 12 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 36.20, 57.20, 30, 8, 'Merchants Metals', TRUE),
('CL-CP-2-78in-L12-BLK', 'Corner Post 2-7/8 in x 12 ft (black powder-coated)', 'Commercial-grade corner post in 2-7/8 in OD, 12 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 42.90, 67.78, 30, 8, 'Merchants Metals', TRUE),
('CL-GP-40in-L08-GAL', 'Gate Post 4.0 in x 8 ft (galvanized)', 'Commercial-grade gate post in 4.0 in OD, 8 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 43.00, 67.94, 26, 8, 'Merchants Metals', TRUE),
('CL-GP-40in-L08-BLK', 'Gate Post 4.0 in x 8 ft (black powder-coated)', 'Commercial-grade gate post in 4.0 in OD, 8 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 49.50, 78.21, 26, 8, 'Merchants Metals', TRUE),
('CL-GP-40in-L10-GAL', 'Gate Post 4.0 in x 10 ft (galvanized)', 'Commercial-grade gate post in 4.0 in OD, 10 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 47.10, 74.42, 28, 8, 'Merchants Metals', TRUE),
('CL-GP-40in-L10-BLK', 'Gate Post 4.0 in x 10 ft (black powder-coated)', 'Commercial-grade gate post in 4.0 in OD, 10 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 54.20, 85.64, 28, 8, 'Merchants Metals', TRUE),
('CL-GP-40in-L12-GAL', 'Gate Post 4.0 in x 12 ft (galvanized)', 'Commercial-grade gate post in 4.0 in OD, 12 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 51.20, 80.90, 30, 8, 'Merchants Metals', TRUE),
('CL-GP-40in-L12-BLK', 'Gate Post 4.0 in x 12 ft (black powder-coated)', 'Commercial-grade gate post in 4.0 in OD, 12 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 58.90, 93.06, 30, 8, 'Merchants Metals', TRUE),
('CL-BP-2-38in-L08-GAL', 'Brace Post 2-3/8 in x 8 ft (galvanized)', 'Commercial-grade brace post in 2-3/8 in OD, 8 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 22.00, 34.76, 26, 8, 'Merchants Metals', TRUE),
('CL-BP-2-38in-L08-BLK', 'Brace Post 2-3/8 in x 8 ft (black powder-coated)', 'Commercial-grade brace post in 2-3/8 in OD, 8 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 27.00, 42.66, 26, 8, 'Merchants Metals', TRUE),
('CL-BP-2-38in-L10-GAL', 'Brace Post 2-3/8 in x 10 ft (galvanized)', 'Commercial-grade brace post in 2-3/8 in OD, 10 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 26.10, 41.24, 28, 8, 'Merchants Metals', TRUE),
('CL-BP-2-38in-L10-BLK', 'Brace Post 2-3/8 in x 10 ft (black powder-coated)', 'Commercial-grade brace post in 2-3/8 in OD, 10 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 31.70, 50.09, 28, 8, 'Merchants Metals', TRUE),
('CL-BP-2-38in-L12-GAL', 'Brace Post 2-3/8 in x 12 ft (galvanized)', 'Commercial-grade brace post in 2-3/8 in OD, 12 ft overall length, galvanized finish for chain-link installations.', 'chain_link_posts', 'EA', 30.20, 47.72, 30, 8, 'Merchants Metals', TRUE),
('CL-BP-2-38in-L12-BLK', 'Brace Post 2-3/8 in x 12 ft (black powder-coated)', 'Commercial-grade brace post in 2-3/8 in OD, 12 ft overall length, black powder-coated finish for chain-link installations.', 'chain_link_posts', 'EA', 36.40, 57.51, 30, 8, 'Merchants Metals', TRUE),
('CL-TR-138-L21-GAL', 'Top Rail 1-3/8 in x 21 ft (galvanized)', 'Swaged top rail, 1-3/8 in OD x 21 ft, galvanized finish for chain-link fence frameworks.', 'chain_link_rails', 'EA', 21.50, 33.11, 24, 10, 'Allied Tube & Conduit', TRUE),
('CL-TR-138-L21-BLK', 'Top Rail 1-3/8 in x 21 ft (black powder-coated)', 'Swaged top rail, 1-3/8 in OD x 21 ft, black powder-coated finish for chain-link fence frameworks.', 'chain_link_rails', 'EA', 27.75, 42.74, 24, 10, 'Allied Tube & Conduit', TRUE),
('CL-TR-138-L24-GAL', 'Top Rail 1-3/8 in x 24 ft (galvanized)', 'Swaged top rail, 1-3/8 in OD x 24 ft, galvanized finish for chain-link fence frameworks.', 'chain_link_rails', 'EA', 27.35, 42.12, 24, 10, 'Allied Tube & Conduit', TRUE),
('CL-TR-138-L24-BLK', 'Top Rail 1-3/8 in x 24 ft (black powder-coated)', 'Swaged top rail, 1-3/8 in OD x 24 ft, black powder-coated finish for chain-link fence frameworks.', 'chain_link_rails', 'EA', 33.60, 51.74, 24, 10, 'Allied Tube & Conduit', TRUE),
('CL-TR-158-L21-GAL', 'Top Rail 1-5/8 in x 21 ft (galvanized)', 'Swaged top rail, 1-5/8 in OD x 21 ft, galvanized finish for chain-link fence frameworks.', 'chain_link_rails', 'EA', 24.25, 37.35, 24, 10, 'Allied Tube & Conduit', TRUE),
('CL-TR-158-L21-BLK', 'Top Rail 1-5/8 in x 21 ft (black powder-coated)', 'Swaged top rail, 1-5/8 in OD x 21 ft, black powder-coated finish for chain-link fence frameworks.', 'chain_link_rails', 'EA', 30.50, 46.97, 24, 10, 'Allied Tube & Conduit', TRUE),
('CL-TR-158-L24-GAL', 'Top Rail 1-5/8 in x 24 ft (galvanized)', 'Swaged top rail, 1-5/8 in OD x 24 ft, galvanized finish for chain-link fence frameworks.', 'chain_link_rails', 'EA', 30.10, 46.35, 24, 10, 'Allied Tube & Conduit', TRUE),
('CL-TR-158-L24-BLK', 'Top Rail 1-5/8 in x 24 ft (black powder-coated)', 'Swaged top rail, 1-5/8 in OD x 24 ft, black powder-coated finish for chain-link fence frameworks.', 'chain_link_rails', 'EA', 36.35, 55.98, 24, 10, 'Allied Tube & Conduit', TRUE),
('CL-MSH-H04-G090-GAL', 'Chain-Link Mesh 4 ft x 50 ft 9 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 4 ft high x 50 ft long, 9 ga, galvanized.', 'chain_link_mesh', 'ROLL', 318.00, 435.66, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H04-G090-BLK', 'Chain-Link Mesh 4 ft x 50 ft 9 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 4 ft high x 50 ft long, 9 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 404.00, 553.48, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H04-G090-GRN', 'Chain-Link Mesh 4 ft x 50 ft 9 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 4 ft high x 50 ft long, 9 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 397.00, 543.89, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H04-G110-GAL', 'Chain-Link Mesh 4 ft x 50 ft 11 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 4 ft high x 50 ft long, 11 ga, galvanized.', 'chain_link_mesh', 'ROLL', 274.00, 375.38, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H04-G110-BLK', 'Chain-Link Mesh 4 ft x 50 ft 11 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 4 ft high x 50 ft long, 11 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 360.00, 493.20, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H04-G110-GRN', 'Chain-Link Mesh 4 ft x 50 ft 11 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 4 ft high x 50 ft long, 11 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 353.00, 483.61, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H04-G115-GAL', 'Chain-Link Mesh 4 ft x 50 ft 11.5 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 4 ft high x 50 ft long, 11.5 ga, galvanized.', 'chain_link_mesh', 'ROLL', 246.00, 337.02, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H04-G115-BLK', 'Chain-Link Mesh 4 ft x 50 ft 11.5 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 4 ft high x 50 ft long, 11.5 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 332.00, 454.84, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H04-G115-GRN', 'Chain-Link Mesh 4 ft x 50 ft 11.5 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 4 ft high x 50 ft long, 11.5 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 325.00, 445.25, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H05-G090-GAL', 'Chain-Link Mesh 5 ft x 50 ft 9 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 5 ft high x 50 ft long, 9 ga, galvanized.', 'chain_link_mesh', 'ROLL', 370.00, 506.90, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H05-G090-BLK', 'Chain-Link Mesh 5 ft x 50 ft 9 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 5 ft high x 50 ft long, 9 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 456.00, 624.72, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H05-G090-GRN', 'Chain-Link Mesh 5 ft x 50 ft 9 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 5 ft high x 50 ft long, 9 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 449.00, 615.13, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H05-G110-GAL', 'Chain-Link Mesh 5 ft x 50 ft 11 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 5 ft high x 50 ft long, 11 ga, galvanized.', 'chain_link_mesh', 'ROLL', 326.00, 446.62, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H05-G110-BLK', 'Chain-Link Mesh 5 ft x 50 ft 11 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 5 ft high x 50 ft long, 11 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 412.00, 564.44, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H05-G110-GRN', 'Chain-Link Mesh 5 ft x 50 ft 11 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 5 ft high x 50 ft long, 11 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 405.00, 554.85, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H05-G115-GAL', 'Chain-Link Mesh 5 ft x 50 ft 11.5 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 5 ft high x 50 ft long, 11.5 ga, galvanized.', 'chain_link_mesh', 'ROLL', 298.00, 408.26, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H05-G115-BLK', 'Chain-Link Mesh 5 ft x 50 ft 11.5 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 5 ft high x 50 ft long, 11.5 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 384.00, 526.08, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H05-G115-GRN', 'Chain-Link Mesh 5 ft x 50 ft 11.5 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 5 ft high x 50 ft long, 11.5 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 377.00, 516.49, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H06-G090-GAL', 'Chain-Link Mesh 6 ft x 50 ft 9 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 6 ft high x 50 ft long, 9 ga, galvanized.', 'chain_link_mesh', 'ROLL', 426.00, 583.62, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H06-G090-BLK', 'Chain-Link Mesh 6 ft x 50 ft 9 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 6 ft high x 50 ft long, 9 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 512.00, 701.44, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H06-G090-GRN', 'Chain-Link Mesh 6 ft x 50 ft 9 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 6 ft high x 50 ft long, 9 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 505.00, 691.85, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H06-G110-GAL', 'Chain-Link Mesh 6 ft x 50 ft 11 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 6 ft high x 50 ft long, 11 ga, galvanized.', 'chain_link_mesh', 'ROLL', 382.00, 523.34, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H06-G110-BLK', 'Chain-Link Mesh 6 ft x 50 ft 11 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 6 ft high x 50 ft long, 11 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 468.00, 641.16, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H06-G110-GRN', 'Chain-Link Mesh 6 ft x 50 ft 11 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 6 ft high x 50 ft long, 11 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 461.00, 631.57, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H06-G115-GAL', 'Chain-Link Mesh 6 ft x 50 ft 11.5 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 6 ft high x 50 ft long, 11.5 ga, galvanized.', 'chain_link_mesh', 'ROLL', 354.00, 484.98, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H06-G115-BLK', 'Chain-Link Mesh 6 ft x 50 ft 11.5 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 6 ft high x 50 ft long, 11.5 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 440.00, 602.80, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H06-G115-GRN', 'Chain-Link Mesh 6 ft x 50 ft 11.5 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 6 ft high x 50 ft long, 11.5 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 433.00, 593.21, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H08-G090-GAL', 'Chain-Link Mesh 8 ft x 50 ft 9 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 8 ft high x 50 ft long, 9 ga, galvanized.', 'chain_link_mesh', 'ROLL', 556.00, 761.72, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H08-G090-BLK', 'Chain-Link Mesh 8 ft x 50 ft 9 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 8 ft high x 50 ft long, 9 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 642.00, 879.54, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H08-G090-GRN', 'Chain-Link Mesh 8 ft x 50 ft 9 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 8 ft high x 50 ft long, 9 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 635.00, 869.95, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H08-G110-GAL', 'Chain-Link Mesh 8 ft x 50 ft 11 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 8 ft high x 50 ft long, 11 ga, galvanized.', 'chain_link_mesh', 'ROLL', 512.00, 701.44, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H08-G110-BLK', 'Chain-Link Mesh 8 ft x 50 ft 11 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 8 ft high x 50 ft long, 11 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 598.00, 819.26, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H08-G110-GRN', 'Chain-Link Mesh 8 ft x 50 ft 11 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 8 ft high x 50 ft long, 11 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 591.00, 809.67, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H08-G115-GAL', 'Chain-Link Mesh 8 ft x 50 ft 11.5 ga (galvanized)', 'Knuckled selvage chain-link mesh roll, 8 ft high x 50 ft long, 11.5 ga, galvanized.', 'chain_link_mesh', 'ROLL', 484.00, 663.08, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H08-G115-BLK', 'Chain-Link Mesh 8 ft x 50 ft 11.5 ga (black PVC-coated)', 'Knuckled selvage chain-link mesh roll, 8 ft high x 50 ft long, 11.5 ga, black PVC-coated.', 'chain_link_mesh', 'ROLL', 570.00, 780.90, 10, 4, 'Master Halco', TRUE),
('CL-MSH-H08-G115-GRN', 'Chain-Link Mesh 8 ft x 50 ft 11.5 ga (green PVC-coated)', 'Knuckled selvage chain-link mesh roll, 8 ft high x 50 ft long, 11.5 ga, green PVC-coated.', 'chain_link_mesh', 'ROLL', 563.00, 771.31, 10, 4, 'Master Halco', TRUE),
('CL-TB-158', 'Tension Band 1-5/8 in', 'Galvanized tension band sized for 1-5/8 in terminal posts.', 'chain_link_hardware', 'EA', 0.92, 1.79, 250, 100, 'Merchants Metals', TRUE),
('CL-BB-158', 'Brace Band 1-5/8 in', 'Galvanized brace band sized for 1-5/8 in terminal posts.', 'chain_link_hardware', 'EA', 1.10, 2.11, 200, 80, 'Merchants Metals', TRUE),
('CL-DCAP-158', 'Dome Cap 1-5/8 in', 'Pressed steel dome cap for 1-5/8 in terminal posts.', 'chain_link_hardware', 'EA', 1.62, 3.05, 80, 25, 'Merchants Metals', TRUE),
('CL-LCAP-158', 'Loop Cap 1-5/8 in', 'Galvanized loop cap to connect top rail to 1-5/8 in line posts.', 'chain_link_hardware', 'EA', 1.54, 2.93, 120, 40, 'Merchants Metals', TRUE),
('CL-TB-238', 'Tension Band 2-3/8 in', 'Galvanized tension band sized for 2-3/8 in terminal posts.', 'chain_link_hardware', 'EA', 1.24, 2.42, 250, 100, 'Merchants Metals', TRUE),
('CL-BB-238', 'Brace Band 2-3/8 in', 'Galvanized brace band sized for 2-3/8 in terminal posts.', 'chain_link_hardware', 'EA', 1.42, 2.73, 200, 80, 'Merchants Metals', TRUE),
('CL-DCAP-238', 'Dome Cap 2-3/8 in', 'Pressed steel dome cap for 2-3/8 in terminal posts.', 'chain_link_hardware', 'EA', 1.94, 3.65, 80, 25, 'Merchants Metals', TRUE),
('CL-LCAP-238', 'Loop Cap 2-3/8 in', 'Galvanized loop cap to connect top rail to 2-3/8 in line posts.', 'chain_link_hardware', 'EA', 1.86, 3.53, 120, 40, 'Merchants Metals', TRUE),
('CL-TB-278', 'Tension Band 2-7/8 in', 'Galvanized tension band sized for 2-7/8 in terminal posts.', 'chain_link_hardware', 'EA', 1.58, 3.08, 250, 100, 'Merchants Metals', TRUE),
('CL-BB-278', 'Brace Band 2-7/8 in', 'Galvanized brace band sized for 2-7/8 in terminal posts.', 'chain_link_hardware', 'EA', 1.76, 3.38, 200, 80, 'Merchants Metals', TRUE),
('CL-DCAP-278', 'Dome Cap 2-7/8 in', 'Pressed steel dome cap for 2-7/8 in terminal posts.', 'chain_link_hardware', 'EA', 2.28, 4.29, 80, 25, 'Merchants Metals', TRUE),
('CL-LCAP-278', 'Loop Cap 2-7/8 in', 'Galvanized loop cap to connect top rail to 2-7/8 in line posts.', 'chain_link_hardware', 'EA', 2.20, 4.18, 120, 40, 'Merchants Metals', TRUE),
('CL-TB-400', 'Tension Band 4.0 in', 'Galvanized tension band sized for 4.0 in terminal posts.', 'chain_link_hardware', 'EA', 2.18, 4.25, 250, 100, 'Merchants Metals', TRUE),
('CL-BB-400', 'Brace Band 4.0 in', 'Galvanized brace band sized for 4.0 in terminal posts.', 'chain_link_hardware', 'EA', 2.36, 4.53, 200, 80, 'Merchants Metals', TRUE),
('CL-DCAP-400', 'Dome Cap 4.0 in', 'Pressed steel dome cap for 4.0 in terminal posts.', 'chain_link_hardware', 'EA', 2.88, 5.41, 80, 25, 'Merchants Metals', TRUE),
('CL-LCAP-400', 'Loop Cap 4.0 in', 'Galvanized loop cap to connect top rail to 4.0 in line posts.', 'chain_link_hardware', 'EA', 2.80, 5.32, 120, 40, 'Merchants Metals', TRUE),
('CL-TW-7GA-GAL-100', 'Tension Wire 7 ga 100 ft (galvanized)', 'High-tensile galvanized tension wire for bottom reinforcement.', 'chain_link_wire', 'ROLL', 18.40, 29.95, 20, 8, 'Bekaert', TRUE),
('CL-TW-7GA-BLK-100', 'Tension Wire 7 ga 100 ft (black)', 'PVC-coated black tension wire for ornamental black chain-link systems.', 'chain_link_wire', 'ROLL', 24.90, 38.95, 18, 6, 'Bekaert', TRUE),
('CL-TW-9GA-GAL-250', 'Tension Wire 9 ga 250 ft (galvanized)', 'Galvanized tension wire for standard residential chain-link fencing.', 'chain_link_wire', 'ROLL', 32.75, 49.95, 14, 6, 'Bekaert', TRUE),
('CL-BW-12GA-4PT-1320', 'Barbed Wire 12.5 ga 4-point 1,320 ft', 'Class III galvanized barbed wire for chain-link security tops.', 'chain_link_wire', 'ROLL', 68.20, 96.50, 8, 3, 'Bekaert', TRUE),
('CL-TIE-AL-100', 'Aluminum Tie Wire 6-1/2 in (100 pack)', 'Precut aluminum tie wires for attaching mesh to line posts.', 'chain_link_hardware', 'BOX', 7.60, 12.95, 40, 15, 'Merchants Metals', TRUE),
('CL-TIE-BLK-100', 'Black Tie Wire 6-1/2 in (100 pack)', 'Precut black PVC tie wires for black chain-link systems.', 'chain_link_hardware', 'BOX', 10.10, 15.95, 30, 12, 'Merchants Metals', TRUE),
('CL-HOGRING-2500', 'Hog Rings 9 ga galvanized (2,500 count)', 'Galvanized hog rings for attaching chain-link mesh to tension wire.', 'chain_link_hardware', 'BOX', 28.00, 44.95, 12, 4, 'Merchants Metals', TRUE),
('CL-COIL-WIRE-9GA-5LB', 'Coil Wire 9 ga galvanized 5 lb', 'Multi-purpose galvanized coil wire for tie-offs and field fabrication.', 'chain_link_wire', 'ROLL', 14.75, 23.50, 16, 6, 'Bekaert', TRUE),
('CL-RE-138', 'Rail End 1-3/8 in', 'Galvanized rail end for 1-3/8 in top rail.', 'chain_link_hardware', 'EA', 1.08, 1.95, 180, 60, 'Merchants Metals', TRUE),
('CL-RE-158', 'Rail End 1-5/8 in', 'Galvanized rail end for 1-5/8 in top rail.', 'chain_link_hardware', 'EA', 1.26, 2.35, 160, 50, 'Merchants Metals', TRUE),
('CL-BR-138-104', 'Brace Rail 1-3/8 in x 10 ft 4 in', 'Pre-cut brace rail for chain-link end and corner assemblies.', 'chain_link_rails', 'EA', 12.85, 20.95, 40, 15, 'Allied Tube & Conduit', TRUE),
('CL-TRUSS-38', 'Truss Rod 3/8 in x 36 in', 'Truss rod assembly for terminal, corner, and gate post bracing.', 'chain_link_hardware', 'EA', 6.40, 10.95, 50, 18, 'Merchants Metals', TRUE),
('CL-TURNBUCKLE-38', 'Turnbuckle 3/8 in', 'Hot-dip galvanized turnbuckle for adjusting truss rods.', 'chain_link_hardware', 'EA', 5.10, 8.75, 35, 12, 'Merchants Metals', TRUE),
('CL-BARB-ARM-SGL', 'Barb Arm Single', 'Single-arm galvanized barb arm for 1-5/8 in posts.', 'chain_link_hardware', 'EA', 3.95, 6.85, 60, 20, 'Merchants Metals', TRUE),
('CL-BARB-ARM-TRI', 'Barb Arm 3-Strand', 'Tri-arm galvanized barb arm for security fencing.', 'chain_link_hardware', 'EA', 6.75, 10.95, 40, 14, 'Merchants Metals', TRUE),
('CL-BOLT-516-125', 'Carriage Bolt 5/16 in x 1-1/4 in', 'Galvanized carriage bolt with nut for bands and fittings.', 'chain_link_hardware', 'BOX', 15.25, 23.95, 22, 8, 'Fastenal', TRUE),
('CL-BOLT-516-150', 'Carriage Bolt 5/16 in x 1-1/2 in', 'Galvanized carriage bolt with nut for heavy wall fittings.', 'chain_link_hardware', 'BOX', 16.40, 25.50, 18, 6, 'Fastenal', TRUE),
('CL-PB-24', 'Post Base Plate 2-3/8 in', 'Welded post base for surface-mount terminal posts.', 'chain_link_hardware', 'EA', 14.50, 24.95, 16, 6, 'Merchants Metals', TRUE),
('CL-GD-ROD-24', 'Gate Drop Rod 24 in', 'Galvanized cane bolt/drop rod for double-drive chain-link gates.', 'chain_link_gate_hardware', 'EA', 12.85, 21.95, 20, 8, 'Merchants Metals', TRUE),
('CL-HINGE-FRK-238', 'Female Fork Hinge 2-3/8 in', 'Adjustable female fork hinge for walk gates up to 2 in frame.', 'chain_link_gate_hardware', 'SET', 9.40, 16.95, 25, 10, 'D&D Technologies', TRUE),
('CL-HINGE-MLE-238', 'Male Hinge 2-3/8 in', 'Adjustable male hinge body for chain-link gates.', 'chain_link_gate_hardware', 'SET', 8.90, 15.95, 25, 10, 'D&D Technologies', TRUE),
('CL-LATCH-FORK', 'Fork Latch', 'Gravity fork latch for walk gates with receiver fork.', 'chain_link_gate_hardware', 'EA', 12.60, 21.95, 24, 8, 'D&D Technologies', TRUE),
('CL-LATCH-CANTILEVER', 'Cantilever Gate Latch', 'Heavy-duty latch assembly for rolling cantilever gates.', 'chain_link_gate_hardware', 'EA', 46.00, 79.95, 8, 3, 'D&D Technologies', TRUE),
('CL-ROLLER-CANTILEVER-6', 'Cantilever Roller 6 in', 'Nylon cantilever roller assembly for chain-link slide gates.', 'chain_link_gate_hardware', 'EA', 38.00, 62.95, 10, 4, 'Merchants Metals', TRUE),
('CL-STOP-CANTILEVER', 'Cantilever Gate Stop', 'Receiver stop and guide assembly for slide gates.', 'chain_link_gate_hardware', 'EA', 21.25, 35.95, 12, 4, 'Merchants Metals', TRUE),
('MAT-CONC-80', 'Concrete Mix 80 lb', 'General purpose fence post concrete mix.', 'concrete', 'BAG', 4.85, 7.95, 320, 120, 'Quikrete', TRUE),
('MAT-CONC-50', 'Concrete Mix 50 lb', 'Fast-moving 50 lb bag for small post setting jobs.', 'concrete', 'BAG', 3.55, 5.95, 240, 80, 'Quikrete', TRUE),
('MAT-FSET-50', 'Fast-Setting Concrete 50 lb', 'Fast-setting post concrete mix for rapid set times.', 'concrete', 'BAG', 4.10, 6.75, 180, 60, 'Quikrete', TRUE),
('MAT-GRAVEL-05', 'Washed Gravel 0.5 cu ft', 'Drain rock for post footing base preparation.', 'concrete', 'BAG', 3.20, 5.25, 90, 30, 'Local Aggregate Supply', TRUE),
('MAT-POSTFOAM', 'Expanding Post Foam Kit', 'Two-part structural foam alternative to bagged concrete.', 'concrete', 'KIT', 10.75, 17.95, 42, 12, 'Sika', TRUE),
('WD-POST-4X4-8-PT', 'Pressure-Treated Post 4x4x8', 'Ground-contact treated southern yellow pine post.', 'wood_materials', 'EA', 14.80, 24.95, 48, 16, 'Outdoor Wood Products', TRUE),
('WD-POST-4X4-10-PT', 'Pressure-Treated Post 4x4x10', 'Ground-contact treated southern yellow pine post for 6 ft privacy fences.', 'wood_materials', 'EA', 19.40, 31.95, 36, 12, 'Outdoor Wood Products', TRUE),
('WD-RAIL-2X4-8-PT', 'Pressure-Treated Rail 2x4x8', 'Fence rail for privacy and board-on-board wood fencing.', 'wood_materials', 'EA', 4.60, 7.95, 120, 40, 'Outdoor Wood Products', TRUE),
('WD-PICKET-1X6-6-CEDAR-DE', 'Cedar Picket 1x6x6 Dog Ear', 'Western red cedar dog-ear fence picket.', 'wood_materials', 'EA', 2.15, 3.85, 800, 240, 'Alta Forest Products', TRUE),
('WD-PICKET-1X4-4-CEDAR-FLAT', 'Cedar Picket 1x4x4 Flat Top', 'Western red cedar flat-top picket for decorative wood fencing.', 'wood_materials', 'EA', 1.62, 2.95, 500, 150, 'Alta Forest Products', TRUE),
('WD-CAP-2X6-8-CEDAR', 'Cedar Cap Board 2x6x8', 'Cap board for cap-and-trim privacy fence assemblies.', 'wood_materials', 'EA', 9.25, 15.95, 44, 15, 'Alta Forest Products', TRUE),
('WD-SCREW-1750', 'Exterior Fence Screws 1-5/8 in (1,750 count)', 'Polymer-coated exterior wood fence screws.', 'wood_hardware', 'BOX', 32.50, 49.95, 26, 8, 'Grip-Rite', TRUE),
('WD-STAIN-CEDAR-1G', 'Transparent Cedar Stain 1 gal', 'Contractor-grade transparent cedar stain for fence finishing.', 'wood_finishes', 'GAL', 24.90, 39.95, 18, 6, 'Ready Seal', TRUE),
('VN-PANEL-PRIV-6X8-WHT', 'Vinyl Privacy Panel 6x8 White', 'Tongue-and-groove vinyl privacy panel, 6 ft high x 8 ft wide.', 'vinyl_materials', 'EA', 121.00, 179.95, 20, 8, 'Barrette Outdoor Living', TRUE),
('VN-POST-LINE-5X5X108-WHT', 'Vinyl Line Post 5x5x108 White', 'Routed vinyl line post for 6 ft privacy fence systems.', 'vinyl_materials', 'EA', 34.75, 52.95, 30, 10, 'Barrette Outdoor Living', TRUE),
('VN-POST-CAP-5X5-NEWPORT-WHT', 'Vinyl Post Cap 5x5 Newport White', 'Decorative external vinyl post cap for 5x5 posts.', 'vinyl_materials', 'EA', 5.20, 8.95, 60, 20, 'Barrette Outdoor Living', TRUE),
('VN-UCHANNEL-72-WHT', 'Vinyl U-Channel 72 in White', 'Privacy panel u-channel trim for vinyl fence sections.', 'vinyl_materials', 'EA', 7.10, 11.95, 50, 18, 'Barrette Outdoor Living', TRUE),
('VN-GATE-KIT-48-WHT', 'Vinyl Gate Hardware Kit 48 in White', 'Self-closing hinge and latch kit for vinyl walk gates.', 'vinyl_hardware', 'KIT', 52.00, 79.95, 12, 4, 'D&D Technologies', TRUE),
('VN-RAIL-2X6X94-WHT', 'Vinyl Bottom Rail 2x6x94 White', 'Bottom rail component for routed vinyl privacy panels.', 'vinyl_materials', 'EA', 18.40, 29.95, 28, 10, 'Barrette Outdoor Living', TRUE),
('TL-STRETCH-BAR-58', 'Stretch Bar 58 in', 'Galvanized stretch bar for 6 ft chain-link fabric.', 'tools', 'EA', 11.20, 18.95, 18, 6, 'Midwest Tool', TRUE),
('TL-COMEALONG-2T', 'Come-Along 2 Ton', 'Ratcheting fence stretcher / come-along for fabric tensioning.', 'tools', 'EA', 42.50, 68.95, 8, 3, 'Maasdam', TRUE),
('TL-POST-DRIVER-32', 'Manual Post Driver 32 lb', 'Heavy-duty manual post driver for round posts.', 'tools', 'EA', 76.00, 119.95, 4, 2, 'Bon Tool', TRUE),
('TL-AUGER-8IN', 'Gas Auger Bit 8 in', 'Replacement auger bit for 8 in fence post holes.', 'tools', 'EA', 84.00, 132.95, 4, 2, 'Echo', TRUE),
('TL-LASER-DIST', 'Laser Distance Meter 165 ft', 'Distance meter for layout and quick takeoffs.', 'tools', 'EA', 74.90, 114.95, 6, 2, 'Bosch', TRUE),
('TL-POST-LEVEL', 'Post Level', 'Magnetic post level for plumb installation.', 'tools', 'EA', 5.10, 8.95, 25, 8, 'Johnson Level', TRUE),
('TL-FENCE-PLIERS', 'Fence Pliers 10 in', 'Multi-purpose fence pliers for wire work and fasteners.', 'tools', 'EA', 14.95, 24.95, 14, 5, 'Klein Tools', TRUE),
('TL-BOLT-CUTTER-24', 'Bolt Cutter 24 in', 'Bolt cutter suitable for chain-link hardware and wire.', 'tools', 'EA', 29.50, 46.95, 6, 2, 'Crescent', TRUE),
('TL-CHALK-REEL', 'Chalk Line Reel 100 ft', 'Layout reel for straight fence line marking.', 'tools', 'EA', 11.60, 19.95, 10, 3, 'Irwin', TRUE),
('TL-WHEEL-MEASURE', 'Measuring Wheel Contractor', 'Contractor-grade measuring wheel for footage takeoffs.', 'tools', 'EA', 54.00, 84.95, 5, 2, 'Keson', TRUE),
('CL-GATE-WALK-W04-H06-GAL', 'Walk Gate 4 ft x 6 ft (galvanized)', 'Fabricated single-swing chain-link walk gate, 4 ft wide x 6 ft high, galvanized.', 'chain_link_gates', 'EA', 104.00, 147.68, 6, 2, 'Merchants Metals', TRUE),
('CL-GATE-WALK-W04-H06-BLK', 'Walk Gate 4 ft x 6 ft (black powder-coated)', 'Fabricated single-swing chain-link walk gate, 4 ft wide x 6 ft high, black powder-coated.', 'chain_link_gates', 'EA', 152.00, 215.84, 6, 2, 'Merchants Metals', TRUE),
('CL-GATE-WALK-W05-H06-GAL', 'Walk Gate 5 ft x 6 ft (galvanized)', 'Fabricated single-swing chain-link walk gate, 5 ft wide x 6 ft high, galvanized.', 'chain_link_gates', 'EA', 122.00, 173.24, 6, 2, 'Merchants Metals', TRUE),
('CL-GATE-WALK-W05-H06-BLK', 'Walk Gate 5 ft x 6 ft (black powder-coated)', 'Fabricated single-swing chain-link walk gate, 5 ft wide x 6 ft high, black powder-coated.', 'chain_link_gates', 'EA', 170.00, 241.40, 6, 2, 'Merchants Metals', TRUE),
('CL-GATE-WALK-W06-H06-GAL', 'Walk Gate 6 ft x 6 ft (galvanized)', 'Fabricated single-swing chain-link walk gate, 6 ft wide x 6 ft high, galvanized.', 'chain_link_gates', 'EA', 140.00, 198.80, 6, 2, 'Merchants Metals', TRUE),
('CL-GATE-WALK-W06-H06-BLK', 'Walk Gate 6 ft x 6 ft (black powder-coated)', 'Fabricated single-swing chain-link walk gate, 6 ft wide x 6 ft high, black powder-coated.', 'chain_link_gates', 'EA', 188.00, 266.96, 6, 2, 'Merchants Metals', TRUE),
('CL-GATE-DOUBLE-W10-H06-GAL', 'Double Drive Gate 10 ft x 6 ft (galvanized)', 'Double-swing chain-link drive gate, 10 ft clear opening x 6 ft high, galvanized finish.', 'chain_link_gates', 'EA', 428.00, 594.92, 3, 1, 'Merchants Metals', TRUE),
('CL-GATE-DOUBLE-W12-H06-GAL', 'Double Drive Gate 12 ft x 6 ft (galvanized)', 'Double-swing chain-link drive gate, 12 ft clear opening x 6 ft high, galvanized finish.', 'chain_link_gates', 'EA', 512.00, 711.68, 3, 1, 'Merchants Metals', TRUE),
('CL-GATE-DOUBLE-W14-H06-GAL', 'Double Drive Gate 14 ft x 6 ft (galvanized)', 'Double-swing chain-link drive gate, 14 ft clear opening x 6 ft high, galvanized finish.', 'chain_link_gates', 'EA', 596.00, 828.44, 3, 1, 'Merchants Metals', TRUE)
ON CONFLICT (sku) DO UPDATE
SET name = EXCLUDED.name,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    unit = EXCLUDED.unit,
    unit_cost = EXCLUDED.unit_cost,
    unit_price = EXCLUDED.unit_price,
    quantity_on_hand = EXCLUDED.quantity_on_hand,
    reorder_level = EXCLUDED.reorder_level,
    supplier = EXCLUDED.supplier,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

INSERT INTO projects (user_id, customer_name, customer_email, customer_phone, address, city, state, zip, project_date, project_type, status)
SELECT u.id, 'Smith Residence', 'smith.family@example.com', '(816) 555-0131', '1420 Cedar Ridge Drive', 'Overland Park', 'KS', '66212', DATE '2026-07-18', 'Residential chain-link backyard enclosure', 'active'
FROM users u WHERE u.username = 'admin'
  AND NOT EXISTS (SELECT 1 FROM projects p WHERE p.customer_email = 'smith.family@example.com' AND p.address = '1420 Cedar Ridge Drive');

INSERT INTO projects (user_id, customer_name, customer_email, customer_phone, address, city, state, zip, project_date, project_type, status)
SELECT u.id, 'Green Valley Preschool', 'facilities@greenvalleypreschool.org', '(913) 555-0177', '5801 Meadow Lane', 'Lenexa', 'KS', '66219', DATE '2026-08-02', 'Commercial wood privacy perimeter', 'draft'
FROM users u WHERE u.username = 'admin'
  AND NOT EXISTS (SELECT 1 FROM projects p WHERE p.customer_email = 'facilities@greenvalleypreschool.org' AND p.address = '5801 Meadow Lane');

INSERT INTO fence_specs (project_id, fence_type, height_feet, color, gauge, total_footage, num_gates, gate_width, notes)
SELECT p.id, 'chain-link', 6.00, 'black', '11.5 ga', 184.00, 2, 4.00, 'Backyard enclosure with one walk gate and one 12 ft drive gate. Includes one offset along the rear property line.'
FROM projects p WHERE p.customer_email = 'smith.family@example.com'
  AND NOT EXISTS (SELECT 1 FROM fence_specs fs WHERE fs.project_id = p.id);

INSERT INTO fence_specs (project_id, fence_type, height_feet, color, gauge, total_footage, num_gates, gate_width, notes)
SELECT p.id, 'wood', 6.00, 'natural cedar', NULL, 242.00, 3, 4.00, 'Full privacy fence with cap-and-trim front return, playground code spacing at entry gate, and dumpster screening at rear service drive.'
FROM projects p WHERE p.customer_email = 'facilities@greenvalleypreschool.org'
  AND NOT EXISTS (SELECT 1 FROM fence_specs fs WHERE fs.project_id = p.id);

INSERT INTO estimates (project_id, materials_cost, labor_cost, overhead_pct, markup_pct, subtotal, tax_pct, total_amount, is_locked, locked_at, locked_by)
SELECT p.id, 4285.00, 2200.00, 12.00, 18.00, 7274.20, 8.25, 7874.32, FALSE, NULL, NULL
FROM projects p WHERE p.customer_email = 'smith.family@example.com'
  AND NOT EXISTS (SELECT 1 FROM estimates e WHERE e.project_id = p.id);

INSERT INTO estimates (project_id, materials_cost, labor_cost, overhead_pct, markup_pct, subtotal, tax_pct, total_amount, is_locked, locked_at, locked_by)
SELECT p.id, 6890.00, 3400.00, 10.00, 15.00, 11323.50, 7.75, 12201.07, FALSE, NULL, NULL
FROM projects p WHERE p.customer_email = 'facilities@greenvalleypreschool.org'
  AND NOT EXISTS (SELECT 1 FROM estimates e WHERE e.project_id = p.id);

INSERT INTO estimate_line_items (estimate_id, product_id, description, quantity, unit, unit_price)
SELECT e.id, i.id, '6 ft black chain-link mesh roll', 4.000, 'ROLL', i.unit_price
FROM estimates e JOIN projects p ON p.id = e.project_id JOIN inventory i ON i.sku = 'CL-MSH-H06-G115-BLK'
WHERE p.customer_email = 'smith.family@example.com'
  AND NOT EXISTS (SELECT 1 FROM estimate_line_items li WHERE li.estimate_id = e.id AND li.description = '6 ft black chain-link mesh roll');

INSERT INTO estimate_line_items (estimate_id, product_id, description, quantity, unit, unit_price)
SELECT e.id, i.id, 'Black line posts 1-5/8 in x 8 ft', 14.000, 'EA', i.unit_price
FROM estimates e JOIN projects p ON p.id = e.project_id JOIN inventory i ON i.sku = 'CL-LP-1-58in-L08-BLK'
WHERE p.customer_email = 'smith.family@example.com'
  AND NOT EXISTS (SELECT 1 FROM estimate_line_items li WHERE li.estimate_id = e.id AND li.description = 'Black line posts 1-5/8 in x 8 ft');

INSERT INTO estimate_line_items (estimate_id, product_id, description, quantity, unit, unit_price)
SELECT e.id, i.id, 'Black terminal posts 2-3/8 in x 8 ft', 4.000, 'EA', i.unit_price
FROM estimates e JOIN projects p ON p.id = e.project_id JOIN inventory i ON i.sku = 'CL-TP-2-38in-L08-BLK'
WHERE p.customer_email = 'smith.family@example.com'
  AND NOT EXISTS (SELECT 1 FROM estimate_line_items li WHERE li.estimate_id = e.id AND li.description = 'Black terminal posts 2-3/8 in x 8 ft');

INSERT INTO estimate_line_items (estimate_id, product_id, description, quantity, unit, unit_price)
SELECT e.id, i.id, '4 ft x 6 ft black walk gate', 1.000, 'EA', i.unit_price
FROM estimates e JOIN projects p ON p.id = e.project_id JOIN inventory i ON i.sku = 'CL-GATE-WALK-W04-H06-BLK'
WHERE p.customer_email = 'smith.family@example.com'
  AND NOT EXISTS (SELECT 1 FROM estimate_line_items li WHERE li.estimate_id = e.id AND li.description = '4 ft x 6 ft black walk gate');

INSERT INTO estimate_line_items (estimate_id, product_id, description, quantity, unit, unit_price)
SELECT e.id, i.id, 'Pressure-treated 4x4x10 posts', 34.000, 'EA', i.unit_price
FROM estimates e JOIN projects p ON p.id = e.project_id JOIN inventory i ON i.sku = 'WD-POST-4X4-10-PT'
WHERE p.customer_email = 'facilities@greenvalleypreschool.org'
  AND NOT EXISTS (SELECT 1 FROM estimate_line_items li WHERE li.estimate_id = e.id AND li.description = 'Pressure-treated 4x4x10 posts');

INSERT INTO estimate_line_items (estimate_id, product_id, description, quantity, unit, unit_price)
SELECT e.id, i.id, 'Cedar dog-ear pickets 1x6x6', 408.000, 'EA', i.unit_price
FROM estimates e JOIN projects p ON p.id = e.project_id JOIN inventory i ON i.sku = 'WD-PICKET-1X6-6-CEDAR-DE'
WHERE p.customer_email = 'facilities@greenvalleypreschool.org'
  AND NOT EXISTS (SELECT 1 FROM estimate_line_items li WHERE li.estimate_id = e.id AND li.description = 'Cedar dog-ear pickets 1x6x6');

INSERT INTO estimate_line_items (estimate_id, product_id, description, quantity, unit, unit_price)
SELECT e.id, i.id, 'Pressure-treated 2x4x8 rails', 102.000, 'EA', i.unit_price
FROM estimates e JOIN projects p ON p.id = e.project_id JOIN inventory i ON i.sku = 'WD-RAIL-2X4-8-PT'
WHERE p.customer_email = 'facilities@greenvalleypreschool.org'
  AND NOT EXISTS (SELECT 1 FROM estimate_line_items li WHERE li.estimate_id = e.id AND li.description = 'Pressure-treated 2x4x8 rails');

INSERT INTO estimate_line_items (estimate_id, product_id, description, quantity, unit, unit_price)
SELECT e.id, i.id, 'Fast-setting concrete 50 lb', 42.000, 'BAG', i.unit_price
FROM estimates e JOIN projects p ON p.id = e.project_id JOIN inventory i ON i.sku = 'MAT-FSET-50'
WHERE p.customer_email = 'facilities@greenvalleypreschool.org'
  AND NOT EXISTS (SELECT 1 FROM estimate_line_items li WHERE li.estimate_id = e.id AND li.description = 'Fast-setting concrete 50 lb');

INSERT INTO notes (project_id, user_id, category, note_text, is_pinned)
SELECT p.id, u.id, 'customer', 'Customer requested black chain-link fabric to better match existing deck railing and requested one 12 ft access gate for mower entry.', TRUE
FROM projects p JOIN users u ON u.username = 'admin'
WHERE p.customer_email = 'smith.family@example.com'
  AND NOT EXISTS (SELECT 1 FROM notes n WHERE n.project_id = p.id AND n.note_text LIKE 'Customer requested black chain-link fabric%');

INSERT INTO notes (project_id, user_id, category, note_text, is_pinned)
SELECT p.id, u.id, 'permit', 'Preschool project requires local permit submission and utility locate before layout. HOA submittal waived for commercial parcel.', TRUE
FROM projects p JOIN users u ON u.username = 'admin'
WHERE p.customer_email = 'facilities@greenvalleypreschool.org'
  AND NOT EXISTS (SELECT 1 FROM notes n WHERE n.project_id = p.id AND n.note_text LIKE 'Preschool project requires local permit submission%');

COMMIT;
