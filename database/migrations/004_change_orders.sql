-- ============================================================
-- MIGRATION 004 - Add change orders table
-- ============================================================
\echo 'Running migration 004: Change orders'

CREATE TABLE IF NOT EXISTS change_orders (
    id               SERIAL PRIMARY KEY,
    co_number        VARCHAR(50) NOT NULL UNIQUE,
    estimate_id      INTEGER NOT NULL REFERENCES estimates(id),
    project_id       INTEGER REFERENCES projects(id),
    description      TEXT NOT NULL,
    reason           TEXT,
    status           VARCHAR(50) NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending','approved','rejected','cancelled')),
    additional_cost  NUMERIC(12,2) NOT NULL DEFAULT 0,
    additional_days  INTEGER DEFAULT 0,
    requested_by     VARCHAR(255),
    approved_by      INTEGER REFERENCES users(id),
    approved_at      TIMESTAMP,
    created_by       INTEGER REFERENCES users(id),
    created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_co_estimate ON change_orders(estimate_id);
CREATE INDEX idx_co_project  ON change_orders(project_id);
CREATE INDEX idx_co_status   ON change_orders(status);

-- Auto-generate CO number
CREATE OR REPLACE FUNCTION fn_generate_co_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_year TEXT;
    v_seq  INTEGER;
BEGIN
    IF NEW.co_number IS NULL OR NEW.co_number = '' THEN
        v_year := TO_CHAR(NOW(), 'YYYY');
        SELECT COALESCE(MAX(CAST(SPLIT_PART(co_number, '-', 3) AS INTEGER)), 0) + 1
        INTO v_seq
        FROM change_orders
        WHERE co_number LIKE 'CO-' || v_year || '-%';
        NEW.co_number := 'CO-' || v_year || '-' || LPAD(v_seq::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_co_number
    BEFORE INSERT ON change_orders
    FOR EACH ROW EXECUTE FUNCTION fn_generate_co_number();

CREATE TRIGGER trg_co_updated_at
    BEFORE UPDATE ON change_orders
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

\echo 'Migration 004 complete'
