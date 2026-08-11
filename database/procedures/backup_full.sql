-- Procedure 1: metadata record for full backups
CREATE TABLE IF NOT EXISTS backup_history (
  id BIGSERIAL PRIMARY KEY,
  backup_type VARCHAR(30) NOT NULL,
  destination TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'running'
);

CREATE OR REPLACE FUNCTION record_full_backup_start(dest TEXT)
RETURNS BIGINT AS $$
DECLARE row_id BIGINT;
BEGIN
  INSERT INTO backup_history (backup_type, destination)
  VALUES ('full', dest)
  RETURNING id INTO row_id;
  RETURN row_id;
END;
$$ LANGUAGE plpgsql;
