-- Backup helper: export project data as JSON
CREATE OR REPLACE FUNCTION export_project_json(p_project_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'project',       row_to_json(p),
    'fence_specs',   (SELECT jsonb_agg(row_to_json(fs)) FROM fence_specs fs WHERE fs.project_id = p.id),
    'estimates',     (SELECT jsonb_agg(row_to_json(e))  FROM estimates e  WHERE e.project_id  = p.id),
    'contracts',     (SELECT jsonb_agg(row_to_json(c))  FROM contracts c  WHERE c.project_id  = p.id),
    'change_orders', (SELECT jsonb_agg(row_to_json(co)) FROM change_orders co WHERE co.project_id = p.id),
    'sign_offs',     (SELECT jsonb_agg(row_to_json(so)) FROM sign_offs so WHERE so.project_id = p.id),
    'notes',         (SELECT jsonb_agg(row_to_json(n))  FROM notes n  WHERE n.project_id  = p.id)
  )
  INTO v_result
  FROM projects p WHERE p.id = p_project_id;
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
