-- Migration 003 — Crew & Scheduling
CREATE TABLE IF NOT EXISTS crew_members (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id),
  first_name  VARCHAR(75) NOT NULL,
  last_name   VARCHAR(75) NOT NULL,
  phone       VARCHAR(20),
  role        VARCHAR(50),   -- 'lead','installer','labourer'
  hourly_rate NUMERIC(8,2),
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS schedule_entries (
  id             SERIAL PRIMARY KEY,
  project_id     INTEGER NOT NULL REFERENCES projects(id),
  crew_member_id INTEGER REFERENCES crew_members(id),
  scheduled_date DATE NOT NULL,
  start_time     TIME,
  end_time       TIME,
  hours_logged   NUMERIC(5,2),
  status         VARCHAR(20) DEFAULT 'scheduled'
                   CHECK (status IN ('scheduled','in-progress','completed','cancelled')),
  notes          TEXT,
  created_at     TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_schedule_project ON schedule_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_schedule_date    ON schedule_entries(scheduled_date);
