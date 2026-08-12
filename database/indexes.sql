CREATE INDEX IF NOT EXISTS idx_projects_estimator_id ON projects(estimator_id);
CREATE INDEX IF NOT EXISTS idx_projects_status_created_at ON projects(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fence_specs_project_id ON fence_specs(project_id);
CREATE INDEX IF NOT EXISTS idx_estimates_project_created_at ON estimates(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contracts_project_created_at ON contracts(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_change_orders_project_created_at ON change_orders(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_signoffs_project_completion_date ON signoffs(project_id, completion_date DESC);
CREATE INDEX IF NOT EXISTS idx_notes_project_created_at ON notes(project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_catalog_products_category_active ON catalog_products(category, is_active);
