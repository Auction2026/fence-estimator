-- ================================================================
-- FENCE ESTIMATOR PRO – RECOVERY PROCEDURES
-- ================================================================
USE fence_estimator;

DELIMITER $$

-- Check database integrity
CREATE PROCEDURE IF NOT EXISTS sp_check_integrity()
BEGIN
  -- Check for orphaned records
  SELECT 'Orphaned fence_specs' AS issue, COUNT(*) AS cnt
  FROM fence_specs fs
  LEFT JOIN projects p ON fs.project_id = p.project_id
  WHERE p.id IS NULL
  UNION ALL
  SELECT 'Orphaned estimates', COUNT(*)
  FROM estimates e
  LEFT JOIN projects p ON e.project_id = p.project_id
  WHERE p.id IS NULL
  UNION ALL
  SELECT 'Orphaned contracts', COUNT(*)
  FROM contracts c
  LEFT JOIN projects p ON c.project_id = p.project_id
  WHERE p.id IS NULL;
END$$

-- Clean orphaned records
CREATE PROCEDURE IF NOT EXISTS sp_clean_orphans()
BEGIN
  DELETE fs FROM fence_specs fs
  LEFT JOIN projects p ON fs.project_id = p.project_id
  WHERE p.id IS NULL;

  DELETE e FROM estimates e
  LEFT JOIN projects p ON e.project_id = p.project_id
  WHERE p.id IS NULL;

  SELECT 'Cleanup complete' AS result;
END$$

DELIMITER ;
