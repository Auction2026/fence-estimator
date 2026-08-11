-- Migration 001: Initial Schema Setup
-- Run: mysql -u root -p fence_estimator < migration-001-initial-schema.sql
-- ================================================================
-- This migration creates all base tables.
-- Source: ../schema.sql

SOURCE ../schema.sql;

INSERT INTO audit_log (action, table_name) VALUES ('MIGRATION', 'migration-001');
