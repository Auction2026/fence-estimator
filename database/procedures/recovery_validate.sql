-- Procedure 3: recovery validation helper
CREATE OR REPLACE FUNCTION validate_recovery(min_products INTEGER, min_projects INTEGER)
RETURNS TABLE(check_name TEXT, ok BOOLEAN, detail TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 'products_count', COUNT(*) >= min_products, 'Expected at least ' || min_products || ' products'
  FROM products;

  RETURN QUERY
  SELECT 'projects_count', COUNT(*) >= min_projects, 'Expected at least ' || min_projects || ' projects'
  FROM projects;
END;
$$ LANGUAGE plpgsql;
