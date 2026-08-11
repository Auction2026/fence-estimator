BEGIN;
SET search_path TO public;
CREATE TABLE IF NOT EXISTS recovery_log (
    id BIGSERIAL PRIMARY KEY,
    backup_id BIGINT NOT NULL REFERENCES backup_log(id) ON DELETE CASCADE,
    project_id BIGINT,
    restored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    restored_by TEXT NOT NULL DEFAULT CURRENT_USER,
    restore_status VARCHAR(20) NOT NULL,
    validation_result JSONB NOT NULL,
    CONSTRAINT recovery_log_status_check CHECK (restore_status IN ('completed', 'failed'))
);
CREATE INDEX IF NOT EXISTS idx_recovery_log_backup_id ON recovery_log (backup_id);
CREATE OR REPLACE FUNCTION list_backups()
RETURNS TABLE (backup_id BIGINT, backup_scope VARCHAR, project_id BIGINT, backup_label VARCHAR, snapshot_ts TIMESTAMPTZ, backup_status VARCHAR, row_count INTEGER, checksum TEXT, created_by TEXT)
LANGUAGE SQL STABLE AS $$ SELECT id, backup_scope, project_id, backup_label, snapshot_ts, backup_status, row_count, checksum, created_by FROM backup_log ORDER BY snapshot_ts DESC, id DESC; $$;
CREATE OR REPLACE FUNCTION verify_backup(p_backup_id BIGINT)
RETURNS TABLE (backup_id BIGINT, backup_scope VARCHAR, is_valid BOOLEAN, details TEXT, stored_checksum TEXT, computed_checksum TEXT, snapshot_ts TIMESTAMPTZ)
LANGUAGE plpgsql AS $$
DECLARE v_scope VARCHAR(20); v_payload JSONB; v_checksum TEXT; v_computed TEXT; v_snapshot_ts TIMESTAMPTZ; v_has_required BOOLEAN;
BEGIN
    SELECT bl.backup_scope, bl.backup_data, bl.checksum, bl.snapshot_ts INTO v_scope, v_payload, v_checksum, v_snapshot_ts FROM backup_log bl WHERE bl.id = p_backup_id;
    IF NOT FOUND THEN
        RETURN QUERY SELECT p_backup_id, NULL::VARCHAR, FALSE, 'Backup not found', NULL::TEXT, NULL::TEXT, NULL::TIMESTAMPTZ;
        RETURN;
    END IF;
    v_computed := calculate_jsonb_checksum(v_payload);
    v_has_required := CASE WHEN v_scope = 'project' THEN v_payload ? 'project' WHEN v_scope = 'all_projects' THEN v_payload ? 'projects' AND v_payload ? 'metadata' WHEN v_scope = 'snapshot' THEN v_payload ? 'table_counts' AND v_payload ? 'metadata' ELSE FALSE END;
    RETURN QUERY SELECT p_backup_id, v_scope, (v_checksum = v_computed AND v_has_required), CASE WHEN v_checksum <> v_computed THEN 'Checksum mismatch detected' WHEN NOT v_has_required THEN 'Backup payload is missing required keys' ELSE 'Backup verified successfully' END, v_checksum, v_computed, v_snapshot_ts;
END;
$$;
CREATE OR REPLACE PROCEDURE restore_project(p_project_id BIGINT, p_backup_id BIGINT)
LANGUAGE plpgsql AS $$
DECLARE v_scope VARCHAR(20); v_backup_data JSONB; v_payload JSONB; v_validation RECORD;
BEGIN
    SELECT * INTO v_validation FROM verify_backup(p_backup_id);
    IF NOT COALESCE(v_validation.is_valid, FALSE) THEN
        INSERT INTO recovery_log (backup_id, project_id, restore_status, validation_result) VALUES (p_backup_id, p_project_id, 'failed', to_jsonb(v_validation));
        RAISE EXCEPTION 'Backup % failed verification: %', p_backup_id, v_validation.details;
    END IF;
    SELECT backup_scope, backup_data INTO v_scope, v_backup_data FROM backup_log WHERE id = p_backup_id;
    IF v_scope = 'project' THEN
        v_payload := v_backup_data;
    ELSIF v_scope = 'all_projects' THEN
        SELECT elem INTO v_payload FROM jsonb_array_elements(COALESCE(v_backup_data -> 'projects', '[]'::jsonb)) AS elem WHERE (elem -> 'project' ->> 'id')::BIGINT = p_project_id LIMIT 1;
    ELSE
        INSERT INTO recovery_log (backup_id, project_id, restore_status, validation_result) VALUES (p_backup_id, p_project_id, 'failed', jsonb_build_object('details', 'Snapshot backups do not include restorable project payloads'));
        RAISE EXCEPTION 'Backup % is a snapshot-only record and cannot restore projects', p_backup_id;
    END IF;
    IF v_payload IS NULL OR v_payload -> 'project' IS NULL THEN
        INSERT INTO recovery_log (backup_id, project_id, restore_status, validation_result) VALUES (p_backup_id, p_project_id, 'failed', jsonb_build_object('details', 'Project payload not found in backup'));
        RAISE EXCEPTION 'Project % not found in backup %', p_project_id, p_backup_id;
    END IF;
    DELETE FROM contracts WHERE project_id = p_project_id;
    DELETE FROM change_orders WHERE project_id = p_project_id;
    DELETE FROM sign_offs WHERE project_id = p_project_id;
    DELETE FROM notes WHERE project_id = p_project_id;
    DELETE FROM fence_specs WHERE project_id = p_project_id;
    DELETE FROM estimates WHERE project_id = p_project_id;
    DELETE FROM projects WHERE id = p_project_id;
    INSERT INTO projects (id, user_id, customer_name, customer_email, customer_phone, address, city, state, zip, project_date, project_type, status, created_at, updated_at)
    SELECT x.id, x.user_id, x.customer_name, x.customer_email, x.customer_phone, x.address, x.city, x.state, x.zip, x.project_date, x.project_type, x.status, x.created_at, x.updated_at FROM jsonb_to_record(v_payload -> 'project') AS x(id BIGINT, user_id BIGINT, customer_name VARCHAR(150), customer_email VARCHAR(255), customer_phone VARCHAR(25), address TEXT, city VARCHAR(100), state CHAR(2), zip VARCHAR(10), project_date DATE, project_type VARCHAR(50), status VARCHAR(20), created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ);
    INSERT INTO fence_specs (id, project_id, fence_type, height_feet, color, gauge, total_footage, num_gates, gate_width, notes, created_at, updated_at)
    SELECT x.id, x.project_id, x.fence_type, x.height_feet, x.color, x.gauge, x.total_footage, x.num_gates, x.gate_width, x.notes, x.created_at, x.updated_at FROM jsonb_to_recordset(COALESCE(v_payload -> 'fence_specs', '[]'::jsonb)) AS x(id BIGINT, project_id BIGINT, fence_type VARCHAR(20), height_feet NUMERIC(5,2), color VARCHAR(50), gauge VARCHAR(20), total_footage NUMERIC(10,2), num_gates INTEGER, gate_width NUMERIC(6,2), notes TEXT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ);
    INSERT INTO estimates (id, project_id, materials_cost, labor_cost, overhead_pct, markup_pct, subtotal, tax_pct, total_amount, is_locked, locked_at, locked_by, created_at, updated_at)
    SELECT x.id, x.project_id, x.materials_cost, x.labor_cost, x.overhead_pct, x.markup_pct, x.subtotal, x.tax_pct, x.total_amount, x.is_locked, x.locked_at, x.locked_by, x.created_at, x.updated_at FROM jsonb_to_recordset(COALESCE(v_payload -> 'estimates', '[]'::jsonb)) AS x(id BIGINT, project_id BIGINT, materials_cost NUMERIC(12,2), labor_cost NUMERIC(12,2), overhead_pct NUMERIC(5,2), markup_pct NUMERIC(5,2), subtotal NUMERIC(12,2), tax_pct NUMERIC(5,2), total_amount NUMERIC(12,2), is_locked BOOLEAN, locked_at TIMESTAMPTZ, locked_by BIGINT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ);
    INSERT INTO estimate_line_items (id, estimate_id, product_id, description, quantity, unit, unit_price, created_at)
    SELECT li.id, li.estimate_id, li.product_id, li.description, li.quantity, li.unit, li.unit_price, li.created_at FROM jsonb_array_elements(COALESCE(v_payload -> 'estimates', '[]'::jsonb)) AS e(item) CROSS JOIN LATERAL jsonb_to_recordset(COALESCE(e.item -> 'line_items', '[]'::jsonb)) AS li(id BIGINT, estimate_id BIGINT, product_id BIGINT, description TEXT, quantity NUMERIC(12,3), unit VARCHAR(20), unit_price NUMERIC(12,2), created_at TIMESTAMPTZ);
    INSERT INTO contracts (id, project_id, estimate_id, contract_number, contract_date, terms_text, customer_signature, customer_signed_at, company_signature, company_signed_at, status, created_at, updated_at)
    SELECT x.id, x.project_id, x.estimate_id, x.contract_number, x.contract_date, x.terms_text, x.customer_signature, x.customer_signed_at, x.company_signature, x.company_signed_at, x.status, x.created_at, x.updated_at FROM jsonb_to_recordset(COALESCE(v_payload -> 'contracts', '[]'::jsonb)) AS x(id BIGINT, project_id BIGINT, estimate_id BIGINT, contract_number VARCHAR(50), contract_date DATE, terms_text TEXT, customer_signature TEXT, customer_signed_at TIMESTAMPTZ, company_signature TEXT, company_signed_at TIMESTAMPTZ, status VARCHAR(20), created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ);
    INSERT INTO change_orders (id, project_id, estimate_id, change_order_number, description, reason, cost_change, status, requested_by, approved_by, created_at, updated_at)
    SELECT x.id, x.project_id, x.estimate_id, x.change_order_number, x.description, x.reason, x.cost_change, x.status, x.requested_by, x.approved_by, x.created_at, x.updated_at FROM jsonb_to_recordset(COALESCE(v_payload -> 'change_orders', '[]'::jsonb)) AS x(id BIGINT, project_id BIGINT, estimate_id BIGINT, change_order_number VARCHAR(50), description TEXT, reason TEXT, cost_change NUMERIC(12,2), status VARCHAR(20), requested_by BIGINT, approved_by BIGINT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ);
    INSERT INTO sign_offs (id, project_id, inspection_type, inspector_name, inspection_date, passed, notes, signature, created_at)
    SELECT x.id, x.project_id, x.inspection_type, x.inspector_name, x.inspection_date, x.passed, x.notes, x.signature, x.created_at FROM jsonb_to_recordset(COALESCE(v_payload -> 'sign_offs', '[]'::jsonb)) AS x(id BIGINT, project_id BIGINT, inspection_type VARCHAR(50), inspector_name VARCHAR(150), inspection_date DATE, passed BOOLEAN, notes TEXT, signature TEXT, created_at TIMESTAMPTZ);
    INSERT INTO notes (id, project_id, user_id, category, note_text, is_pinned, created_at, updated_at)
    SELECT x.id, x.project_id, x.user_id, x.category, x.note_text, x.is_pinned, x.created_at, x.updated_at FROM jsonb_to_recordset(COALESCE(v_payload -> 'notes', '[]'::jsonb)) AS x(id BIGINT, project_id BIGINT, user_id BIGINT, category VARCHAR(20), note_text TEXT, is_pinned BOOLEAN, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ);
    PERFORM setval(pg_get_serial_sequence('projects', 'id'), COALESCE((SELECT MAX(id) FROM projects), 1), TRUE);
    PERFORM setval(pg_get_serial_sequence('fence_specs', 'id'), COALESCE((SELECT MAX(id) FROM fence_specs), 1), TRUE);
    PERFORM setval(pg_get_serial_sequence('estimates', 'id'), COALESCE((SELECT MAX(id) FROM estimates), 1), TRUE);
    PERFORM setval(pg_get_serial_sequence('estimate_line_items', 'id'), COALESCE((SELECT MAX(id) FROM estimate_line_items), 1), TRUE);
    PERFORM setval(pg_get_serial_sequence('contracts', 'id'), COALESCE((SELECT MAX(id) FROM contracts), 1), TRUE);
    PERFORM setval(pg_get_serial_sequence('change_orders', 'id'), COALESCE((SELECT MAX(id) FROM change_orders), 1), TRUE);
    PERFORM setval(pg_get_serial_sequence('sign_offs', 'id'), COALESCE((SELECT MAX(id) FROM sign_offs), 1), TRUE);
    PERFORM setval(pg_get_serial_sequence('notes', 'id'), COALESCE((SELECT MAX(id) FROM notes), 1), TRUE);
    INSERT INTO recovery_log (backup_id, project_id, restore_status, validation_result) VALUES (p_backup_id, p_project_id, 'completed', jsonb_build_object('details', 'Project restored successfully', 'verified_backup', to_jsonb(v_validation)));
END;
$$;
COMMIT;
