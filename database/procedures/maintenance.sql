-- Maintenance: Archive old completed projects
CREATE OR REPLACE PROCEDURE archive_old_projects(p_before_date DATE DEFAULT NOW() - INTERVAL '2 years')
LANGUAGE plpgsql AS $$
BEGIN
  -- Create archive snapshot in notes
  INSERT INTO notes (project_id, note_type, title, body)
  SELECT id, 'general', 'ARCHIVED',
    'Project archived on ' || NOW()::DATE::TEXT ||
    ' — Total: $' || COALESCE((SELECT SUM(contract_amount) FROM contracts c WHERE c.project_id = projects.id AND c.status='complete'),0)::TEXT
  FROM projects
  WHERE status = 'complete'
    AND updated_at::DATE < p_before_date
    AND id NOT IN (SELECT DISTINCT project_id FROM notes WHERE title = 'ARCHIVED');

  RAISE NOTICE 'Archive notes created for projects completed before %', p_before_date;
END;
$$;

-- Maintenance: Update inventory reorder alerts
CREATE OR REPLACE VIEW v_inventory_reorder_alerts AS
SELECT plu, description, qty_on_hand, reorder_point, preferred_supplier
FROM inventory
WHERE qty_on_hand <= reorder_point
  AND is_active = TRUE
ORDER BY (reorder_point - qty_on_hand) DESC;
