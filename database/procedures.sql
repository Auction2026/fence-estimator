-- SQLite-compatible helper views as procedure equivalents
CREATE VIEW IF NOT EXISTS project_estimate_totals AS
SELECT
  p.project_id,
  p.customer_name,
  p.status,
  COALESCE(MAX(e.total), 0) AS latest_total
FROM projects p
LEFT JOIN estimates e ON e.project_id = p.project_id
GROUP BY p.project_id, p.customer_name, p.status;
