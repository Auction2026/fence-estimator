# PART 5 TROUBLESHOOTING GUIDE

## DATABASE ISSUES
1. Connection failed — check host/port/user and firewall; retest with CLI.
2. Schema not created — run `schema.sql` with correct DB selected.
3. Seed import failed — ensure PostgreSQL `generate_series` support.
4. Slow queries — add indexes and run `VACUUM ANALYZE`.
5. Backup failed — verify disk space and permissions.

## BACKEND ISSUES
1. Server won’t start — check `.env` values and dependency install.
2. Auth fails — confirm JWT secret consistency.
3. Endpoint 404 — verify route prefix `/api`.
4. PDF fails — ensure `pdfkit` installed.
5. High CPU — inspect request loops and add rate limiting.

## FRONTEND ISSUES
1. Page not loading — check static server root.
2. Tabs not displaying — confirm `app.js` loaded after tab scripts.
3. Form submit fails — inspect browser console/network.
4. Drawing tools fail — verify canvas exists before init.
5. Map not loading — configure API key and billing.

## SECURITY ISSUES
1. Login denied — verify token expiration and clock skew.
2. CORS blocked — update allowed origin list.
3. Access denied — verify role claims in JWT.
4. Weak passwords — enforce length and complexity.
5. Token leakage — never store tokens in source files.

## PERFORMANCE ISSUES
1. Slow system — profile DB and API latency.
2. High memory — investigate large payloads and leaks.
3. Slow API responses — add pagination/caching.
4. Frontend lag — defer expensive rendering.
5. Timeouts — tune DB pool and reverse proxy timeout.

For each issue: define symptoms, identify root cause, apply fix, and record prevention notes in ops runbook.
