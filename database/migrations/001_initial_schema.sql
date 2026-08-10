\set ON_ERROR_STOP on

BEGIN;

DO $$
BEGIN
    PERFORM 1;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Unable to initialize migration transaction: %', SQLERRM;
END $$;

\i database/schema.sql

DO $$
BEGIN
    RAISE NOTICE 'Migration 001_initial_schema applied successfully';
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Migration 001_initial_schema failed: %', SQLERRM;
END $$;

COMMIT;
