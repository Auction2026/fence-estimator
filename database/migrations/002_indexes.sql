BEGIN;

CREATE INDEX IF NOT EXISTS idx_projects_estimator_status_created
    ON projects (estimator_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_projects_location_lookup
    ON projects (province, city, postal_code);

CREATE INDEX IF NOT EXISTS idx_fence_specs_type_material
    ON fence_specs (fence_type, material);

CREATE INDEX IF NOT EXISTS idx_fence_specs_gate_sizes_gin
    ON fence_specs USING GIN (gate_sizes);

CREATE INDEX IF NOT EXISTS idx_estimates_project_status_created
    ON estimates (project_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_estimates_valid_open
    ON estimates (valid_until)
    WHERE status IN ('draft', 'sent', 'accepted');

CREATE INDEX IF NOT EXISTS idx_contracts_project_status_created
    ON contracts (project_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contracts_signed_at
    ON contracts (signed_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_change_orders_contract_status_created
    ON change_orders (contract_id, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_change_orders_approved_at
    ON change_orders (approved_at DESC NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_sign_offs_project_signed_at
    ON sign_offs (project_id, signed_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_notes_project_created
    ON project_notes (project_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_project_notes_search
    ON project_notes USING GIN (to_tsvector('english', note_text));

CREATE INDEX IF NOT EXISTS idx_inventory_category_supplier
    ON inventory (category, supplier);

CREATE INDEX IF NOT EXISTS idx_inventory_reorder_alert
    ON inventory (qty_on_hand, reorder_point)
    WHERE qty_on_hand <= reorder_point;

COMMIT;
