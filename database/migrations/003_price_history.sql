-- ============================================================
-- MIGRATION 003 - Add price history tracking
-- ============================================================
\echo 'Running migration 003: Price history table'

CREATE TABLE IF NOT EXISTS material_price_history (
    id              SERIAL PRIMARY KEY,
    material_id     INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    supplier_id     INTEGER REFERENCES suppliers(id),
    old_unit_cost   NUMERIC(10,4),
    new_unit_cost   NUMERIC(10,4) NOT NULL,
    old_unit_price  NUMERIC(10,4),
    new_unit_price  NUMERIC(10,4) NOT NULL,
    reason          VARCHAR(255),
    changed_by      INTEGER REFERENCES users(id),
    changed_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_price_hist_material ON material_price_history(material_id);
CREATE INDEX idx_price_hist_date     ON material_price_history(changed_at);

-- Trigger: auto-record price changes on materials
CREATE OR REPLACE FUNCTION fn_track_price_change()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF OLD.unit_cost <> NEW.unit_cost OR OLD.unit_price <> NEW.unit_price THEN
        INSERT INTO material_price_history
            (material_id, old_unit_cost, new_unit_cost, old_unit_price, new_unit_price)
        VALUES
            (NEW.id, OLD.unit_cost, NEW.unit_cost, OLD.unit_price, NEW.unit_price);
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_materials_price_history
    AFTER UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION fn_track_price_change();

\echo 'Migration 003 complete'
