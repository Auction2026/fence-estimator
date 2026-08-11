-- Procedure 2: record incremental backup checkpoints
CREATE TABLE IF NOT EXISTS backup_checkpoints (
  id BIGSERIAL PRIMARY KEY,
  last_audit_log_id BIGINT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION create_incremental_checkpoint(last_seen BIGINT)
RETURNS BIGINT AS $$
DECLARE cp BIGINT;
BEGIN
  INSERT INTO backup_checkpoints(last_audit_log_id)
  VALUES (last_seen)
  RETURNING id INTO cp;
  RETURN cp;
END;
$$ LANGUAGE plpgsql;
