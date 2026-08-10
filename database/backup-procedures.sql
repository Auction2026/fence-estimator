-- SQLite backup procedures for the delivered estimator package.
-- Run these statements from the sqlite3 shell connected to the production database.

-- 1) Create a timestamped copy of the full database file.
VACUUM INTO 'backups/fence-estimator-backup.sqlite';

-- 2) Export tab payloads for offline archive or migration to another environment.
.mode csv
.headers on
.once 'backups/project-tabs-export.csv'
SELECT project_id, tab_key, payload_json, updated_at
FROM project_tabs
ORDER BY project_id, tab_key;

-- 3) Verify the latest backup contains the expected row counts.
SELECT 'projects' AS table_name, COUNT(*) AS row_count FROM projects
UNION ALL
SELECT 'estimates', COUNT(*) FROM estimates
UNION ALL
SELECT 'contracts', COUNT(*) FROM contracts
UNION ALL
SELECT 'catalog_products', COUNT(*) FROM catalog_products;
