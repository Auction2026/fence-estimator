-- Migration 003: Add constraints and defaults
-- SQLite cannot add many CHECK constraints with ALTER TABLE after creation,
-- so this migration applies runtime validation triggers and timestamp helpers
-- that enforce the same business rules in-place.

PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;
-- ---------------------------------------------------------------------
-- Validation and maintenance triggers
-- ---------------------------------------------------------------------
CREATE TRIGGER IF NOT EXISTS trg_projects_touch_updated_at
AFTER UPDATE ON projects
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE projects
       SET updated_at = datetime('now')
     WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_estimates_touch_updated_at
AFTER UPDATE ON estimates
FOR EACH ROW
WHEN NEW.updated_at = OLD.updated_at
BEGIN
    UPDATE estimates
       SET updated_at = datetime('now')
     WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_estimates_validate_insert
BEFORE INSERT ON estimates
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN abs(NEW.subtotal - (NEW.materials_cost + NEW.labor_cost + NEW.equipment_cost)) > 0.01
            THEN RAISE(ABORT, 'Estimate subtotal must equal materials + labor + equipment')
    END;
    SELECT CASE
        WHEN abs(NEW.tax_amount - ROUND(NEW.subtotal * NEW.tax_rate, 2)) > 0.01
            THEN RAISE(ABORT, 'Estimate tax_amount must equal subtotal * tax_rate')
    END;
    SELECT CASE
        WHEN abs(NEW.total - ROUND(NEW.subtotal + NEW.tax_amount, 2)) > 0.01
            THEN RAISE(ABORT, 'Estimate total must equal subtotal + tax_amount')
    END;
END;

CREATE TRIGGER IF NOT EXISTS trg_estimates_validate_update
BEFORE UPDATE ON estimates
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN abs(NEW.subtotal - (NEW.materials_cost + NEW.labor_cost + NEW.equipment_cost)) > 0.01
            THEN RAISE(ABORT, 'Estimate subtotal must equal materials + labor + equipment')
    END;
    SELECT CASE
        WHEN abs(NEW.tax_amount - ROUND(NEW.subtotal * NEW.tax_rate, 2)) > 0.01
            THEN RAISE(ABORT, 'Estimate tax_amount must equal subtotal * tax_rate')
    END;
    SELECT CASE
        WHEN abs(NEW.total - ROUND(NEW.subtotal + NEW.tax_amount, 2)) > 0.01
            THEN RAISE(ABORT, 'Estimate total must equal subtotal + tax_amount')
    END;
END;

CREATE TRIGGER IF NOT EXISTS trg_estimate_items_validate_insert
BEFORE INSERT ON estimate_items
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN abs(NEW.total_cost - ROUND(NEW.quantity * NEW.unit_cost, 2)) > 0.01
            THEN RAISE(ABORT, 'Estimate item total_cost must equal quantity * unit_cost')
    END;
END;

CREATE TRIGGER IF NOT EXISTS trg_estimate_items_validate_update
BEFORE UPDATE ON estimate_items
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN abs(NEW.total_cost - ROUND(NEW.quantity * NEW.unit_cost, 2)) > 0.01
            THEN RAISE(ABORT, 'Estimate item total_cost must equal quantity * unit_cost')
    END;
END;

CREATE TRIGGER IF NOT EXISTS trg_change_orders_validate_insert
BEFORE INSERT ON change_orders
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN abs(NEW.total_cost - ROUND(NEW.materials_cost + NEW.labor_cost, 2)) > 0.01
            THEN RAISE(ABORT, 'Change order total_cost must equal materials_cost + labor_cost')
    END;
END;

CREATE TRIGGER IF NOT EXISTS trg_change_orders_validate_update
BEFORE UPDATE ON change_orders
FOR EACH ROW
BEGIN
    SELECT CASE
        WHEN abs(NEW.total_cost - ROUND(NEW.materials_cost + NEW.labor_cost, 2)) > 0.01
            THEN RAISE(ABORT, 'Change order total_cost must equal materials_cost + labor_cost')
    END;
END;

COMMIT;
