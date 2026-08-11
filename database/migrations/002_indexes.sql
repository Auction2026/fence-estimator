-- Migration 002: Add all indexes for performance

PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;
-- ---------------------------------------------------------------------
-- Performance indexes
-- ---------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_role
    ON users (role);

CREATE INDEX IF NOT EXISTS idx_projects_user_id
    ON projects (user_id);

CREATE INDEX IF NOT EXISTS idx_projects_status
    ON projects (status);

CREATE INDEX IF NOT EXISTS idx_projects_customer_name
    ON projects (customer_name);

CREATE INDEX IF NOT EXISTS idx_projects_location
    ON projects (state, city, zip);

CREATE INDEX IF NOT EXISTS idx_projects_updated_at
    ON projects (updated_at);

CREATE INDEX IF NOT EXISTS idx_fence_specs_project_id
    ON fence_specs (project_id);

CREATE INDEX IF NOT EXISTS idx_fence_specs_type_height
    ON fence_specs (fence_type, height);

CREATE INDEX IF NOT EXISTS idx_estimates_project_id
    ON estimates (project_id);

CREATE INDEX IF NOT EXISTS idx_estimates_status
    ON estimates (status);

CREATE INDEX IF NOT EXISTS idx_estimates_created_at
    ON estimates (created_at);

CREATE INDEX IF NOT EXISTS idx_estimate_items_estimate_id
    ON estimate_items (estimate_id);

CREATE INDEX IF NOT EXISTS idx_estimate_items_category
    ON estimate_items (category);

CREATE INDEX IF NOT EXISTS idx_contracts_project_id
    ON contracts (project_id);

CREATE INDEX IF NOT EXISTS idx_contracts_estimate_id
    ON contracts (estimate_id);

CREATE INDEX IF NOT EXISTS idx_contracts_status
    ON contracts (status);

CREATE INDEX IF NOT EXISTS idx_contracts_signed_at
    ON contracts (signed_at);

CREATE INDEX IF NOT EXISTS idx_change_orders_project_id
    ON change_orders (project_id);

CREATE INDEX IF NOT EXISTS idx_change_orders_contract_id
    ON change_orders (contract_id);

CREATE INDEX IF NOT EXISTS idx_change_orders_status
    ON change_orders (status);

CREATE INDEX IF NOT EXISTS idx_sign_offs_project_id
    ON sign_offs (project_id);

CREATE INDEX IF NOT EXISTS idx_sign_offs_type_signed_at
    ON sign_offs (type, signed_at);

CREATE INDEX IF NOT EXISTS idx_notes_project_id
    ON notes (project_id);

CREATE INDEX IF NOT EXISTS idx_notes_user_id
    ON notes (user_id);

CREATE INDEX IF NOT EXISTS idx_notes_category_created_at
    ON notes (category, created_at);

CREATE INDEX IF NOT EXISTS idx_catalog_products_category
    ON catalog_products (category, subcategory);

CREATE INDEX IF NOT EXISTS idx_catalog_products_name
    ON catalog_products (name);

COMMIT;
