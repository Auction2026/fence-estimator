BEGIN;
SET search_path TO public;
CREATE TABLE IF NOT EXISTS backup_log (
    id BIGSERIAL PRIMARY KEY,
    backup_scope VARCHAR(20) NOT NULL,
    project_id BIGINT REFERENCES projects(id) ON DELETE SET NULL,
    backup_label VARCHAR(150) NOT NULL,
    snapshot_ts TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    transaction_id BIGINT NOT NULL DEFAULT txid_current(),
    row_count INTEGER NOT NULL DEFAULT 0,
    checksum TEXT NOT NULL,
    backup_data JSONB NOT NULL,
    backup_status VARCHAR(20) NOT NULL DEFAULT 'completed',
    created_by TEXT NOT NULL DEFAULT CURRENT_USER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT backup_log_scope_check CHECK (backup_scope IN ('project', 'all_projects', 'snapshot')),
    CONSTRAINT backup_log_status_check CHECK (backup_status IN ('completed', 'failed', 'verified'))
);
CREATE INDEX IF NOT EXISTS idx_backup_log_project_id ON backup_log (project_id);
CREATE INDEX IF NOT EXISTS idx_backup_log_scope_snapshot_ts ON backup_log (backup_scope, snapshot_ts DESC);
CREATE OR REPLACE FUNCTION calculate_jsonb_checksum(payload JSONB) RETURNS TEXT LANGUAGE SQL IMMUTABLE AS $$ SELECT md5(COALESCE(payload::TEXT, '')); $$;
CREATE OR REPLACE FUNCTION build_project_backup_payload(p_project_id BIGINT)
RETURNS JSONB LANGUAGE SQL STABLE AS $$
    SELECT jsonb_build_object(
        'project', (SELECT to_jsonb(p) FROM projects p WHERE p.id = p_project_id),
        'fence_specs', COALESCE((SELECT jsonb_agg(to_jsonb(fs) ORDER BY fs.id) FROM fence_specs fs WHERE fs.project_id = p_project_id), '[]'::jsonb),
        'estimates', COALESCE((SELECT jsonb_agg(to_jsonb(e) || jsonb_build_object('line_items', COALESCE((SELECT jsonb_agg(to_jsonb(li) ORDER BY li.id) FROM estimate_line_items li WHERE li.estimate_id = e.id), '[]'::jsonb)) ORDER BY e.id) FROM estimates e WHERE e.project_id = p_project_id), '[]'::jsonb),
        'contracts', COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY c.id) FROM contracts c WHERE c.project_id = p_project_id), '[]'::jsonb),
        'change_orders', COALESCE((SELECT jsonb_agg(to_jsonb(co) ORDER BY co.id) FROM change_orders co WHERE co.project_id = p_project_id), '[]'::jsonb),
        'sign_offs', COALESCE((SELECT jsonb_agg(to_jsonb(s) ORDER BY s.id) FROM sign_offs s WHERE s.project_id = p_project_id), '[]'::jsonb),
        'notes', COALESCE((SELECT jsonb_agg(to_jsonb(n) ORDER BY n.id) FROM notes n WHERE n.project_id = p_project_id), '[]'::jsonb)
    );
$$;
CREATE OR REPLACE PROCEDURE backup_project(p_project_id BIGINT)
LANGUAGE plpgsql AS $$
DECLARE v_payload JSONB; v_row_count INTEGER;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM projects WHERE id = p_project_id) THEN RAISE EXCEPTION 'Project % does not exist', p_project_id; END IF;
    SELECT build_project_backup_payload(p_project_id) INTO v_payload;
    SELECT 1 + COALESCE(jsonb_array_length(v_payload -> 'fence_specs'), 0) + COALESCE(jsonb_array_length(v_payload -> 'estimates'), 0) + COALESCE((SELECT SUM(COALESCE(jsonb_array_length(e -> 'line_items'), 0)) FROM jsonb_array_elements(COALESCE(v_payload -> 'estimates', '[]'::jsonb)) AS e), 0) + COALESCE(jsonb_array_length(v_payload -> 'contracts'), 0) + COALESCE(jsonb_array_length(v_payload -> 'change_orders'), 0) + COALESCE(jsonb_array_length(v_payload -> 'sign_offs'), 0) + COALESCE(jsonb_array_length(v_payload -> 'notes'), 0) INTO v_row_count;
    INSERT INTO backup_log (backup_scope, project_id, backup_label, row_count, checksum, backup_data, backup_status)
    VALUES ('project', p_project_id, format('project-%s-%s', p_project_id, to_char(clock_timestamp(), 'YYYYMMDDHH24MISS')), v_row_count, calculate_jsonb_checksum(v_payload), v_payload, 'completed');
END;
$$;
CREATE OR REPLACE PROCEDURE backup_all_projects()
LANGUAGE plpgsql AS $$
DECLARE v_payload JSONB; v_project_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_project_count FROM projects;
    SELECT jsonb_build_object('metadata', jsonb_build_object('generated_at', NOW(), 'project_count', v_project_count, 'generated_by', CURRENT_USER), 'projects', COALESCE((SELECT jsonb_agg(build_project_backup_payload(p.id) ORDER BY p.id) FROM projects p), '[]'::jsonb)) INTO v_payload;
    INSERT INTO backup_log (backup_scope, project_id, backup_label, row_count, checksum, backup_data, backup_status)
    VALUES ('all_projects', NULL, format('all-projects-%s', to_char(clock_timestamp(), 'YYYYMMDDHH24MISS')), v_project_count, calculate_jsonb_checksum(v_payload), v_payload, 'completed');
END;
$$;
CREATE OR REPLACE PROCEDURE create_backup_snapshot()
LANGUAGE plpgsql AS $$
DECLARE v_payload JSONB; v_row_count INTEGER;
BEGIN
    SELECT (SELECT COUNT(*) FROM users) + (SELECT COUNT(*) FROM projects) + (SELECT COUNT(*) FROM fence_specs) + (SELECT COUNT(*) FROM estimates) + (SELECT COUNT(*) FROM estimate_line_items) + (SELECT COUNT(*) FROM contracts) + (SELECT COUNT(*) FROM change_orders) + (SELECT COUNT(*) FROM sign_offs) + (SELECT COUNT(*) FROM notes) + (SELECT COUNT(*) FROM inventory) INTO v_row_count;
    SELECT jsonb_build_object('metadata', jsonb_build_object('generated_at', NOW(), 'generated_by', CURRENT_USER, 'transaction_id', txid_current()), 'table_counts', jsonb_build_object('users', (SELECT COUNT(*) FROM users), 'projects', (SELECT COUNT(*) FROM projects), 'fence_specs', (SELECT COUNT(*) FROM fence_specs), 'estimates', (SELECT COUNT(*) FROM estimates), 'estimate_line_items', (SELECT COUNT(*) FROM estimate_line_items), 'contracts', (SELECT COUNT(*) FROM contracts), 'change_orders', (SELECT COUNT(*) FROM change_orders), 'sign_offs', (SELECT COUNT(*) FROM sign_offs), 'notes', (SELECT COUNT(*) FROM notes), 'inventory', (SELECT COUNT(*) FROM inventory)), 'latest_updates', jsonb_build_object('projects', (SELECT MAX(updated_at) FROM projects), 'fence_specs', (SELECT MAX(updated_at) FROM fence_specs), 'estimates', (SELECT MAX(updated_at) FROM estimates), 'inventory', (SELECT MAX(updated_at) FROM inventory))) INTO v_payload;
    INSERT INTO backup_log (backup_scope, project_id, backup_label, row_count, checksum, backup_data, backup_status)
    VALUES ('snapshot', NULL, format('snapshot-%s', to_char(clock_timestamp(), 'YYYYMMDDHH24MISS')), v_row_count, calculate_jsonb_checksum(v_payload), v_payload, 'completed');
END;
$$;
COMMIT;
