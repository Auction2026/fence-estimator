-- Migration 004: Crew assignments table
CREATE TABLE IF NOT EXISTS crew_assignments (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id  UUID         NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id     UUID         NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
    role        VARCHAR(50)  NOT NULL DEFAULT 'installer',
    start_date  DATE,
    end_date    DATE,
    notes       TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crew_project ON crew_assignments (project_id);
CREATE INDEX idx_crew_user    ON crew_assignments (user_id);
