INSERT INTO projects (project_id, customer_name, customer_email, customer_phone, status)
VALUES
  ('P-1001', 'Sample Customer 1', 'customer1@example.com', '555-1001', 'draft'),
  ('P-1002', 'Sample Customer 2', 'customer2@example.com', '555-1002', 'estimate'),
  ('P-1003', 'Sample Customer 3', 'customer3@example.com', '555-1003', 'contract');

INSERT INTO estimates (project_id, materials, labor, equipment, permits, extras, subtotal, tax, total)
VALUES
  ('P-1001', 1250.00, 650.00, 220.00, 75.00, 35.00, 2230.00, 289.90, 2519.90),
  ('P-1002', 1700.00, 900.00, 300.00, 90.00, 0.00, 2990.00, 388.70, 3378.70),
  ('P-1003', 2100.00, 1150.00, 420.00, 120.00, 60.00, 3850.00, 500.50, 4350.50);

INSERT INTO contracts (contract_number, project_id, customer_name, total, status)
VALUES
  ('FD-20260812-P-1001', 'P-1001', 'Sample Customer 1', 2519.90, 'draft'),
  ('FD-20260812-P-1002', 'P-1002', 'Sample Customer 2', 3378.70, 'signed');
