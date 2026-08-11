-- Migration: 002
-- Date: 2026-08-11
-- Description: Add performance indexes.

-- Add performance indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_estimator ON projects(estimator_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_project_number ON projects(project_number);
CREATE INDEX idx_fence_specs_project ON fence_specs(project_id);
CREATE INDEX idx_fence_specs_type ON fence_specs(fence_type);
CREATE INDEX idx_fence_specs_created_at ON fence_specs(created_at);
CREATE INDEX idx_estimates_project ON estimates(project_id);
CREATE INDEX idx_estimates_spec ON estimates(spec_id);
CREATE INDEX idx_estimates_status ON estimates(status);
CREATE INDEX idx_estimates_created_at ON estimates(created_at);
CREATE INDEX idx_contracts_project ON contracts(project_id);
CREATE INDEX idx_contracts_estimate ON contracts(estimate_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_created_at ON contracts(created_at);
CREATE INDEX idx_change_orders_contract ON change_orders(contract_id);
CREATE INDEX idx_change_orders_project ON change_orders(project_id);
CREATE INDEX idx_change_orders_status ON change_orders(status);
CREATE INDEX idx_change_orders_created_at ON change_orders(created_at);
CREATE INDEX idx_signoffs_project ON signoffs(project_id);
CREATE INDEX idx_signoffs_status ON signoffs(status);
CREATE INDEX idx_signoffs_created_at ON signoffs(created_at);
CREATE INDEX idx_notes_project ON notes(project_id);
CREATE INDEX idx_notes_created_by ON notes(created_by);
CREATE INDEX idx_notes_category ON notes(category);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_inventory_category ON inventory(category);
CREATE INDEX idx_inventory_subcategory ON inventory(subcategory);
CREATE INDEX idx_inventory_fence_type ON inventory(fence_type);
CREATE INDEX idx_inventory_quantity ON inventory(quantity_on_hand);
CREATE INDEX idx_inventory_created_at ON inventory(created_at);
