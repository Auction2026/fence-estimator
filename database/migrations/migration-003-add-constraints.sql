-- Migration: 003
-- Date: 2026-08-11
-- Description: Add additional constraints, validation rules, and business logic.

ALTER TABLE projects
    ADD CONSTRAINT chk_projects_customer_phone_length
        CHECK (customer_phone IS NULL OR length(customer_phone) >= 7);

ALTER TABLE fence_specs
    ADD CONSTRAINT chk_fence_specs_color_length
        CHECK (color IS NULL OR length(color) BETWEEN 2 AND 50);

ALTER TABLE estimates
    ADD CONSTRAINT chk_estimates_valid_until_reasonable
        CHECK (valid_until IS NULL OR valid_until >= DATE '2020-01-01');

ALTER TABLE contracts
    ADD CONSTRAINT chk_contracts_signature_sequence
        CHECK (contractor_signed_at IS NULL OR customer_signed_at IS NOT NULL);

ALTER TABLE change_orders
    ADD CONSTRAINT chk_change_orders_signature_when_approved
        CHECK (customer_approved = false OR customer_signature IS NOT NULL);

ALTER TABLE signoffs
    ADD CONSTRAINT chk_signoffs_completion_date_reasonable
        CHECK (completion_date >= DATE '2020-01-01');

ALTER TABLE notes
    ADD CONSTRAINT chk_notes_title_length
        CHECK (length(title) >= 3);

ALTER TABLE inventory
    ADD CONSTRAINT chk_inventory_supplier_length
        CHECK (supplier IS NULL OR length(supplier) >= 3);
