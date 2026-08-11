
-- Migration 003: constraints and update triggers.
CREATE TRIGGER IF NOT EXISTS trg_projects_updated_at
AFTER UPDATE ON projects
FOR EACH ROW
BEGIN
  UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_estimates_updated_at
AFTER UPDATE ON estimates
FOR EACH ROW
BEGIN
  UPDATE estimates SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;
