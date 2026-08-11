-- ================================================================
-- FENCE ESTIMATOR PRO – MAINTENANCE PROCEDURES
-- ================================================================
USE fence_estimator;

DELIMITER $$

-- Rebuild full-text indexes
CREATE PROCEDURE IF NOT EXISTS sp_rebuild_ft_indexes()
BEGIN
  ALTER TABLE inventory DROP INDEX ft_inv_search;
  ALTER TABLE inventory ADD FULLTEXT KEY ft_inv_search (name, description, sku);
  SELECT 'Full-text indexes rebuilt' AS result;
END$$

-- Update inventory usage statistics
CREATE PROCEDURE IF NOT EXISTS sp_update_stats()
BEGIN
  ANALYZE TABLE users, projects, fence_specs, estimates, contracts, inventory;
  SELECT 'Statistics updated' AS result;
END$$

-- Get low-inventory items
CREATE PROCEDURE IF NOT EXISTS sp_low_inventory(IN threshold INT)
BEGIN
  SELECT sku, name, category, quantity, reorder_level
  FROM inventory
  WHERE quantity <= COALESCE(threshold, reorder_level) AND active = 1
  ORDER BY quantity ASC;
END$$

-- Monthly revenue report
CREATE PROCEDURE IF NOT EXISTS sp_monthly_revenue(IN report_year INT, IN report_month INT)
BEGIN
  SELECT
    COUNT(*)           AS contract_count,
    SUM(total_price)   AS gross_revenue,
    AVG(total_price)   AS avg_contract_value,
    MIN(total_price)   AS min_value,
    MAX(total_price)   AS max_value
  FROM contracts
  WHERE YEAR(created_at)  = COALESCE(report_year, YEAR(NOW()))
    AND MONTH(created_at) = COALESCE(report_month, MONTH(NOW()))
    AND status IN ('signed','active','completed');
END$$

DELIMITER ;
