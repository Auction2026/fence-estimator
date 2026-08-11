-- Migration 002: additional indexes
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_project_created ON notes(project_id, created_at DESC);
