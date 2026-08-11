-- ================================================================
-- FENCE ESTIMATOR PRO – BACKUP PROCEDURES
-- ================================================================
USE fence_estimator;

DELIMITER $$

-- Full backup procedure (run mysqldump externally; this logs the event)
CREATE PROCEDURE IF NOT EXISTS sp_log_backup()
BEGIN
  INSERT INTO audit_log (action, table_name, new_data)
  VALUES ('BACKUP', 'all', JSON_OBJECT('timestamp', NOW(), 'type', 'full'));
END$$

-- Archive old audit logs (keep 90 days)
CREATE PROCEDURE IF NOT EXISTS sp_archive_audit_logs()
BEGIN
  DELETE FROM audit_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
  SELECT ROW_COUNT() AS rows_deleted;
END$$

-- Get table row counts for backup verification
CREATE PROCEDURE IF NOT EXISTS sp_table_counts()
BEGIN
  SELECT 'users'         AS tbl, COUNT(*) AS cnt FROM users
  UNION ALL SELECT 'projects',    COUNT(*) FROM projects
  UNION ALL SELECT 'fence_specs', COUNT(*) FROM fence_specs
  UNION ALL SELECT 'estimates',   COUNT(*) FROM estimates
  UNION ALL SELECT 'contracts',   COUNT(*) FROM contracts
  UNION ALL SELECT 'change_orders',COUNT(*) FROM change_orders
  UNION ALL SELECT 'sign_offs',   COUNT(*) FROM sign_offs
  UNION ALL SELECT 'notes',       COUNT(*) FROM notes
  UNION ALL SELECT 'inventory',   COUNT(*) FROM inventory;
END$$

DELIMITER ;
