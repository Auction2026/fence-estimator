# Part 5: Troubleshooting Guide

This guide collects **110+ actionable issues** for the Fence Depot estimator. Each entry includes the symptom, likely cause, solution steps, and a prevention note so teams can fix the immediate problem and reduce repeat incidents.

## How to Use This Guide
- Start with the category that matches the failing layer.
- Confirm the symptom exactly before applying a fix.
- Prefer reproducing the issue in development or staging before changing production settings.
- After each fix, retest the original workflow end to end.

## Database Issues

### 1. Database connection refused
  **Symptom:** The API logs `ECONNREFUSED` or `connection refused` when starting.

  **Cause:** PostgreSQL is stopped, listening on another port, or blocked by firewall rules.

  **Solution steps:**
1. Check that PostgreSQL is running with `systemctl status postgresql` or the Windows service manager.
2. Verify `DB_HOST` and `DB_PORT` in `backend/.env`.
3. Run `psql -h localhost -U fence_app -d fence_depot` to confirm direct connectivity.
4. Open port 5432 locally or update the app to the correct port.

  **Prevention:** Monitor service health and keep environment variables consistent across local, staging, and production.

### 2. Password authentication failed
  **Symptom:** Startup succeeds until the first query, then PostgreSQL returns `password authentication failed for user`.

  **Cause:** The configured password does not match the database user or the wrong connection string is being used.

  **Solution steps:**
1. Reset the password with `ALTER USER fence_app WITH PASSWORD ...;`.
2. Update `DB_PASSWORD` and `DATABASE_URL` to the new value.
3. Restart the backend so the connection pool uses the new credentials.
4. Retest with `psql` before retrying the app.

  **Prevention:** Store secrets in one source of truth and rotate them with a documented procedure.

### 3. Database does not exist
  **Symptom:** The app fails with `database "fence_depot" does not exist`.

  **Cause:** The database was not created or the name in `.env` is incorrect.

  **Solution steps:**
1. List databases with `psql -l`.
2. Create the database with `CREATE DATABASE fence_depot;` if it is missing.
3. Correct `DB_NAME` or `DATABASE_URL` if they point to the wrong database.
4. Re-run migrations after the correct database exists.

  **Prevention:** Automate environment provisioning so database creation is part of setup.

### 4. User does not exist
  **Symptom:** Authentication fails with `role "fence_app" does not exist`.

  **Cause:** The application role was never created or was dropped.

  **Solution steps:**
1. Connect as the postgres superuser.
2. Recreate the account with `CREATE USER fence_app ...`.
3. Grant access to the target database and schema.
4. Restart the application and verify with `SELECT current_user;`.

  **Prevention:** Keep bootstrap SQL in source control and apply it consistently.

### 5. Relation or table not found
  **Symptom:** Requests fail with `relation ... does not exist`.

  **Cause:** Migrations did not run, ran against the wrong database, or failed halfway through.

  **Solution steps:**
1. Check the migration status table.
2. Run the pending migration command.
3. Verify the connection string points to the same database you are inspecting manually.
4. If a migration partially applied, repair it and rerun cleanly.

  **Prevention:** Run migrations automatically during deployment and block startup on schema drift.

### 6. Migration already applied error
  **Symptom:** A deploy stops because the migration tool says a migration already ran.

  **Cause:** The migration metadata table shows the file as applied, but the deployment attempted to rerun it.

  **Solution steps:**
1. Inspect the migrations table.
2. Confirm that the migration file name has not changed.
3. Do not delete metadata rows unless you intentionally roll back.
4. If necessary, create a new forward-only migration rather than editing history.

  **Prevention:** Treat applied migration files as immutable.

### 7. Migration checksum mismatch
  **Symptom:** The tool reports a checksum or hash mismatch on an old migration.

  **Cause:** A previously applied migration file was edited after deployment.

  **Solution steps:**
1. Restore the original migration contents from Git history.
2. Generate a new migration for additional changes.
3. Re-run the migration verification command.
4. Document the correction in the release notes.

  **Prevention:** Never modify a migration after it has been executed outside a disposable local database.

### 8. Too many clients already
  **Symptom:** The backend intermittently fails with `too many clients already`.

  **Cause:** The PostgreSQL connection limit is lower than peak demand or connections are being leaked.

  **Solution steps:**
1. Inspect active sessions with `SELECT * FROM pg_stat_activity;`.
2. Increase pool reuse in the app and reduce per-request client creation.
3. Raise PostgreSQL `max_connections` only if hardware supports it.
4. Terminate clearly stuck sessions if needed.

  **Prevention:** Use a bounded connection pool and alert on abnormal connection growth.

### 9. SSL required by server
  **Symptom:** Production connects locally but fails remotely with an SSL-related error.

  **Cause:** The managed PostgreSQL instance requires SSL and the client is connecting without TLS.

  **Solution steps:**
1. Read the database provider connection requirements.
2. Set the SSL options required by your PostgreSQL driver.
3. Update `DATABASE_URL` parameters if your driver supports query-string flags.
4. Retest from the production host.

  **Prevention:** Standardize cloud database settings in deployment templates.

### 10. Connection timeout
  **Symptom:** Startup hangs and eventually logs a timeout while connecting to PostgreSQL.

  **Cause:** DNS, firewall rules, routing, or a sleeping managed database is delaying connection establishment.

  **Solution steps:**
1. Confirm the hostname resolves from the app host.
2. Test the port with `nc -vz host 5432` if available.
3. Review firewall and security-group rules.
4. Wake or scale up the database if it auto-paused.

  **Prevention:** Use health checks and documented networking prerequisites before deployment windows.

### 11. Permission denied for schema public
  **Symptom:** Migrations or inserts fail with `permission denied for schema public`.

  **Cause:** The application role can connect but does not have schema-level privileges.

  **Solution steps:**
1. Connect as a superuser to the target database.
2. Grant `USAGE` and `CREATE` on the schema.
3. Grant default table and sequence privileges for future objects.
4. Retry the failed command.

  **Prevention:** Apply schema grants immediately after creating the database role.

### 12. Deadlock detected
  **Symptom:** Concurrent saves fail with `deadlock detected`.

  **Cause:** Two transactions lock rows in different orders.

  **Solution steps:**
1. Capture the statements involved from logs.
2. Reduce transaction scope so locks are held for less time.
3. Update the code to lock rows in a consistent order.
4. Add retry logic for safe, idempotent operations.

  **Prevention:** Keep transactions short and design update paths to acquire locks deterministically.

### 13. Duplicate key violation
  **Symptom:** Insert or update calls fail with a unique constraint error.

  **Cause:** A record already exists for the same natural key such as email, project code, or contract number.

  **Solution steps:**
1. Read the specific index name in the error.
2. Check whether the request should be an update instead of an insert.
3. Regenerate any application-level sequence or human-readable identifier.
4. Return a user-friendly conflict message from the API.

  **Prevention:** Validate uniqueness in both the UI and API before insert-heavy workflows.

### 14. Invalid UUID syntax
  **Symptom:** The API returns `invalid input syntax for type uuid`.

  **Cause:** A route parameter or foreign key value is not a properly formatted UUID.

  **Solution steps:**
1. Inspect the request payload and route parameter.
2. Validate IDs in the API before querying.
3. Correct any frontend state that stores placeholder strings such as `new` or `undefined`.
4. Retry with a valid UUID.

  **Prevention:** Use a shared ID validation helper on both client and server.

### 15. Database disk full
  **Symptom:** Writes start failing and PostgreSQL reports no space left on device.

  **Cause:** The host volume is full because of data growth, logs, or backups.

  **Solution steps:**
1. Check disk usage with `df -h`.
2. Archive or rotate oversized logs.
3. Expand the disk or clean non-database files from the host.
4. Vacuum and remove abandoned large objects if necessary.

  **Prevention:** Monitor free disk space and define retention for backups and logs.

### 16. Slow query on project list
  **Symptom:** Project pages load slowly and database CPU spikes.

  **Cause:** Missing indexes or large unfiltered scans are forcing expensive reads.

  **Solution steps:**
1. Run `EXPLAIN ANALYZE` for the slow query.
2. Add indexes on status, customer name, and `updated_at` if queries depend on them.
3. Limit and paginate results returned to the UI.
4. Cache rarely changing reference data.

  **Prevention:** Review query plans when adding new list views or reporting features.

### 17. Sequence out of sync
  **Symptom:** An insert fails even though the next numeric ID should be free.

  **Cause:** Manual imports inserted IDs without resetting the underlying sequence.

  **Solution steps:**
1. Find the max ID in the table.
2. Run `SELECT setval(...)` to advance the sequence.
3. Retry the insert.
4. Review any recent import or restore job that bypassed defaults.

  **Prevention:** Always reset sequences after manual data loads.

### 18. Idle connections dropped
  **Symptom:** Requests fail after long inactivity, then work again on retry.

  **Cause:** Load balancers, proxies, or the database close idle connections in the pool.

  **Solution steps:**
1. Enable pool validation or test-on-borrow if supported.
2. Reduce idle timeout values to recycle clients earlier.
3. Retry one safe reconnect on transient connection errors.
4. Check proxy idle timeout settings.

  **Prevention:** Align app pool settings with infrastructure timeout values.

### 19. Pool exhausted during imports
  **Symptom:** Bulk imports hang or fail with pool timeout errors.

  **Cause:** Long-running import jobs consume all database clients.

  **Solution steps:**
1. Reduce import concurrency.
2. Use batch inserts inside controlled transactions.
3. Create a dedicated worker pool if background jobs share the same database.
4. Raise pool size only after confirming database capacity.

  **Prevention:** Stress-test import jobs before running them against production.

### 20. Backup restore version mismatch
  **Symptom:** A restore command fails because the dump format or server version is incompatible.

  **Cause:** The dump was produced by a newer PostgreSQL version or with unsupported options.

  **Solution steps:**
1. Use a matching or newer `pg_restore` client.
2. Restore to a compatible PostgreSQL server version.
3. If needed, export plain SQL from the source environment.
4. Retry the restore in a disposable environment first.

  **Prevention:** Document exact backup and restore tooling versions.

### 21. Timezone mismatch in timestamps
  **Symptom:** Dates look correct in SQL but appear off by hours in the app.

  **Cause:** The database, server, and browser are using different timezone assumptions.

  **Solution steps:**
1. Store timestamps in UTC with `timestamptz`.
2. Set the app and DB session timezone to UTC.
3. Convert to local time only in the UI.
4. Review date parsing in the frontend.

  **Prevention:** Adopt UTC end-to-end and document display-time conversions.

### 22. Foreign key violation on delete
  **Symptom:** Deleting a project or catalog item fails with a foreign key error.

  **Cause:** Child rows still reference the parent record.

  **Solution steps:**
1. Identify dependent rows from the constraint name.
2. Soft-delete the record if history must remain.
3. Delete or reassign dependent rows in the correct order.
4. Add API messaging that explains why the delete was blocked.

  **Prevention:** Design destructive actions with explicit dependency checks and confirmation screens.

## Backend Issues

### 23. Port 3001 already in use
  **Symptom:** The server exits with `EADDRINUSE`.

  **Cause:** Another process is already listening on port 3001.

  **Solution steps:**
1. Find the owning process with `lsof -i :3001` or the platform equivalent.
2. Stop the conflicting process or change the app port in `.env`.
3. Restart the API.
4. Update reverse-proxy settings if the port changed.

  **Prevention:** Reserve the API port in deployment docs and run one process manager per service.

### 24. Module not found
  **Symptom:** Node exits on startup with `Cannot find module ...`.

  **Cause:** Dependencies were not installed, the wrong directory was used, or a file path is incorrect.

  **Solution steps:**
1. Run `npm install` in the backend directory.
2. Confirm the import path matches the file name and case.
3. Delete `node_modules` and reinstall if the lockfile and modules drifted.
4. Retry startup.

  **Prevention:** Use the correct working directory and keep dependencies checked into the lockfile.

### 25. Environment file not loaded
  **Symptom:** The backend starts with defaults and ignores configured credentials.

  **Cause:** The `.env` file is missing, malformed, or loaded from the wrong directory.

  **Solution steps:**
1. Ensure `backend/.env` exists.
2. Check for invalid quoting or spaces around `=`.
3. Start the process from the backend directory or use absolute paths in your process manager.
4. Log sanitized config values at startup in development.

  **Prevention:** Create `.env` from a template and validate required settings before boot.

### 26. CORS blocked by browser
  **Symptom:** Browser requests fail with a CORS error even though curl works.

  **Cause:** The API did not allow the frontend origin, method, or headers.

  **Solution steps:**
1. Set `CORS_ORIGIN` to the exact frontend URL.
2. Allow `Authorization` and `Content-Type` headers.
3. Ensure OPTIONS preflight requests return 200.
4. Retest in the browser network panel.

  **Prevention:** Keep one environment-specific list of allowed origins and test preflight in staging.

### 27. Payload too large
  **Symptom:** Saving drawings or attachments returns HTTP 413 or `PayloadTooLargeError`.

  **Cause:** The request body exceeds the configured parser or proxy limit.

  **Solution steps:**
1. Reduce the payload size by compressing or chunking large data.
2. Raise Express body limits only if the infrastructure supports it.
3. Mirror the same limit in nginx if it proxies uploads.
4. Prefer object storage for large binary uploads.

  **Prevention:** Define size limits early and keep images or documents out of JSON bodies.

### 28. Route not found
  **Symptom:** The API responds with 404 for an expected endpoint.

  **Cause:** The frontend is calling the wrong path, version, or HTTP method.

  **Solution steps:**
1. Compare the request against the documented route list.
2. Check whether the router is mounted under `/api`.
3. Verify the frontend base URL and trailing slashes.
4. Add a helpful 404 message in development logs.

  **Prevention:** Centralize endpoint constants in the frontend.

### 29. Unhandled promise rejection
  **Symptom:** The process logs an async rejection and may terminate.

  **Cause:** An awaited call was missing a `try/catch` or the error was not passed to middleware.

  **Solution steps:**
1. Inspect the stack trace to find the failing promise.
2. Wrap route handlers and background tasks with consistent error handling.
3. Return structured errors instead of throwing raw values.
4. Retest the failing request.

  **Prevention:** Use shared async handler wrappers and monitor unhandled rejections.

### 30. Required environment variable missing
  **Symptom:** The API boots partially and then fails when a feature is used.

  **Cause:** A required setting such as `JWT_SECRET` or `DATABASE_URL` is not present.

  **Solution steps:**
1. Validate required config at startup.
2. Add the missing variable to `.env` or the deployment secret store.
3. Restart the process after updating secrets.
4. Confirm the process manager loads the new environment.

  **Prevention:** Fail fast on startup when critical configuration is absent.

### 31. Nodemon restart loop
  **Symptom:** The dev server keeps restarting continuously.

  **Cause:** Generated files, logs, or watched directories are triggering repeated reloads.

  **Solution steps:**
1. Review nodemon watch settings.
2. Ignore upload, export, or log directories.
3. Fix any startup crash that causes an immediate restart.
4. Retry after narrowing the watch scope.

  **Prevention:** Keep generated artifacts outside watched source directories.

### 32. JWT secret undefined or weak
  **Symptom:** Login succeeds in one environment but tokens fail verification elsewhere.

  **Cause:** Different instances use different secrets or a default development secret leaked into production.

  **Solution steps:**
1. Set one strong `JWT_SECRET` for the environment.
2. Restart all API instances so they share the same value.
3. Force re-login for existing users if tokens were signed with the wrong secret.
4. Audit deployment variables for drift.

  **Prevention:** Manage secrets centrally and never rely on code fallbacks in production.

### 33. Password comparison always fails
  **Symptom:** Users cannot log in even though records exist.

  **Cause:** Passwords were stored unhashed, hashed twice, or the wrong bcrypt package/options were used.

  **Solution steps:**
1. Inspect one stored hash format.
2. Recreate the affected account or migrate hashes to the expected format.
3. Verify registration and password-reset flows generate the same hash type.
4. Test login with a freshly created user.

  **Prevention:** Keep one hashing library and one verification path across all auth features.

### 34. File upload middleware error
  **Symptom:** Attachment uploads fail before reaching business logic.

  **Cause:** Multipart middleware is missing, misordered, or storing files in an invalid location.

  **Solution steps:**
1. Confirm the upload middleware is mounted before the controller.
2. Check destination paths and write permissions.
3. Validate file size and MIME types explicitly.
4. Return a user-friendly error for rejected files.

  **Prevention:** Treat uploads as a separate concern with dedicated configuration and tests.

### 35. Migrations not run on boot
  **Symptom:** The app starts but critical tables are missing until someone runs a manual command.

  **Cause:** Deployment skipped schema migration or startup assumes an already-prepared database.

  **Solution steps:**
1. Add a release step that runs migrations before switching traffic.
2. Block startup if the schema version is behind.
3. Document the exact migration command in your deployment checklist.
4. Verify migrations in staging.

  **Prevention:** Make migrations part of every deployment pipeline.

### 36. Email sending fails
  **Symptom:** Estimate or notification emails queue up or throw SMTP errors.

  **Cause:** SMTP host, port, credentials, or TLS settings are incorrect.

  **Solution steps:**
1. Verify all `SMTP_*` variables.
2. Test authentication using the provider’s recommended settings.
3. Check whether the provider blocks basic auth or requires app passwords.
4. Add retry and dead-letter behavior for noncritical emails.

  **Prevention:** Use a known transactional email provider and validate credentials during deployment.

### 37. PDF generation fails
  **Symptom:** Contract or estimate export returns 500.

  **Cause:** The template code references missing data or the process runs out of memory on large exports.

  **Solution steps:**
1. Log the exact data payload used for the failing export in development.
2. Guard against undefined fields in the PDF template.
3. Generate PDFs in a worker if exports are large.
4. Retest with a minimal sample and then the failing case.

  **Prevention:** Keep export templates defensive and test with edge-case projects.

### 38. Process exits after startup
  **Symptom:** The backend appears to boot and then stops immediately.

  **Cause:** An uncaught exception, failed DB connection, or container command exits the process.

  **Solution steps:**
1. Run the server directly to view the full stack trace.
2. Check PM2 or container logs.
3. Confirm the startup command points to the right entry file.
4. Fix the root error and relaunch.

  **Prevention:** Always test the production start command locally before deployment.

### 39. Memory spike during estimate generation
  **Symptom:** API memory use climbs sharply when bulk estimates are created.

  **Cause:** The server is holding large objects in memory or generating expensive derived data synchronously.

  **Solution steps:**
1. Profile the hot path with Node inspection tools.
2. Avoid storing entire request histories or large catalogs in process memory.
3. Stream export output when possible.
4. Move bulk work to background jobs.

  **Prevention:** Load-test calculation-heavy operations before release.

### 40. Static frontend files return 404
  **Symptom:** Visiting the app URL shows missing assets.

  **Cause:** The static directory path is wrong or nginx is pointing at the wrong build output.

  **Solution steps:**
1. Verify the filesystem path configured for static hosting.
2. Check generated asset names and relative paths.
3. Inspect nginx `root` and `try_files` settings.
4. Clear stale browser cache after redeploying assets.

  **Prevention:** Use a consistent release directory structure for static files.

### 41. Reverse proxy headers incorrect
  **Symptom:** The app generates wrong absolute URLs or secure cookies fail behind nginx.

  **Cause:** Proxy headers such as `X-Forwarded-Proto` are missing or Express does not trust the proxy.

  **Solution steps:**
1. Set the standard forwarded headers in nginx.
2. Enable `app.set("trust proxy", 1)` if needed.
3. Retest redirects, secure cookies, and generated links.
4. Inspect request headers reaching the app.

  **Prevention:** Document proxy requirements alongside the nginx config.

### 42. Health check fails intermittently
  **Symptom:** Load balancers mark the service unhealthy even though the app is mostly working.

  **Cause:** The health route depends on slow subsystems or shares expensive middleware.

  **Solution steps:**
1. Keep `/api/health` lightweight.
2. Return a simple status payload quickly.
3. Separate readiness checks from liveness checks if needed.
4. Review infrastructure timeout thresholds.

  **Prevention:** Design health endpoints for machine consumption, not full diagnostics.

### 43. Validation surfaces as 500 error
  **Symptom:** Bad user input produces server errors instead of clean 400 responses.

  **Cause:** Validation happens too late or thrown validation errors are not mapped to client-friendly responses.

  **Solution steps:**
1. Validate request bodies before business logic.
2. Translate known validation errors into 400-series responses.
3. Log field-level failures in development.
4. Retest with intentionally invalid payloads.

  **Prevention:** Adopt a consistent request validation layer for all routes.

### 44. Rate limiter blocks internal traffic
  **Symptom:** Automated tests or internal integrations receive 429 errors.

  **Cause:** Rate limiting rules treat trusted internal callers like public traffic.

  **Solution steps:**
1. Review the limiter scope.
2. Whitelist health checks, admin jobs, or trusted network ranges where appropriate.
3. Tune the threshold and window for authenticated users.
4. Retest from the affected client.

  **Prevention:** Separate public, authenticated, and internal rate-limiting policies.

### 45. Malformed JSON crashes request handling
  **Symptom:** A bad request body causes noisy logs or broken responses.

  **Cause:** The JSON parser error is not being handled cleanly.

  **Solution steps:**
1. Add error middleware for JSON parse failures.
2. Return a 400 response explaining the body format problem.
3. Log the route and client, not the entire raw body.
4. Retest with invalid JSON.

  **Prevention:** Keep parser error handling explicit in Express middleware.

### 46. Logging too verbose in production
  **Symptom:** Logs are noisy, expensive, and hard to search.

  **Cause:** Debug logging was left enabled or request bodies are logged indiscriminately.

  **Solution steps:**
1. Reduce the log level via `LOG_LEVEL`.
2. Remove or redact body and token logging.
3. Ship structured logs instead of console spam.
4. Keep request IDs for tracing.

  **Prevention:** Define production-safe logging defaults and redact secrets by design.

### 47. Date serialization wrong in API responses
  **Symptom:** Frontend dates shift or become unreadable after API calls.

  **Cause:** The backend serializes local dates inconsistently or string formatting is ad hoc.

  **Solution steps:**
1. Standardize on ISO 8601 UTC strings in responses.
2. Store dates as UTC in PostgreSQL.
3. Avoid locale-specific formatting in JSON.
4. Verify the frontend parsing logic.

  **Prevention:** Use one serialization strategy for every endpoint.

### 48. PM2 process flapping
  **Symptom:** PM2 shows the app repeatedly restarting.

  **Cause:** The app crashes on boot, runs out of memory, or the start command exits incorrectly.

  **Solution steps:**
1. Inspect `pm2 logs` for the first failure.
2. Increase memory only after identifying whether usage is legitimate.
3. Confirm `pm2 start npm -- start` is the correct launch command.
4. Fix the crash and `pm2 restart` the app.

  **Prevention:** Pin a known-good PM2 ecosystem file and monitor restart counts.

## Frontend Issues

### 49. Blank page on load
  **Symptom:** Opening the app shows a white screen with no usable UI.

  **Cause:** The HTML loaded but JavaScript crashed during initialization.

  **Solution steps:**
1. Open browser developer tools and check the console.
2. Fix the first fatal JavaScript error before chasing secondary symptoms.
3. Confirm script tags point to the correct files.
4. Reload with cache disabled.

  **Prevention:** Keep one startup function, fail gracefully, and surface initialization errors visibly.

### 50. CSS not loading
  **Symptom:** The page renders unstyled or partially styled.

  **Cause:** Stylesheet paths are wrong, blocked, or cached incorrectly.

  **Solution steps:**
1. Inspect the Network tab for 404 or MIME-type failures.
2. Correct relative or absolute asset paths.
3. Check nginx/static hosting rules for CSS files.
4. Hard refresh the browser.

  **Prevention:** Use predictable asset paths and verify them after deployment.

### 51. JavaScript syntax error
  **Symptom:** The console reports `Unexpected token` or similar parse errors.

  **Cause:** A recent edit introduced invalid syntax or the browser is reading an old partially deployed file.

  **Solution steps:**
1. Open the referenced file and line in dev tools.
2. Fix the syntax issue.
3. Redeploy the full frontend bundle or static file set.
4. Reload the page and confirm the error is gone.

  **Prevention:** Lint frontend scripts before deployment even when using vanilla JS.

### 52. Tabs do not switch
  **Symptom:** Clicking a tab does nothing or shows the wrong content pane.

  **Cause:** The click handler is not bound, IDs do not match, or class toggling logic is broken.

  **Solution steps:**
1. Verify the tab button data attributes or IDs.
2. Check that the tab-switch function runs without throwing.
3. Ensure only one active pane is shown at a time.
4. Test all 17 tabs after the fix.

  **Prevention:** Keep tab configuration declarative instead of duplicating selectors in many places.

### 53. Current tab loses state
  **Symptom:** User-entered values disappear when moving between tabs.

  **Cause:** Tab changes rerender the panel from scratch without preserving form state.

  **Solution steps:**
1. Store in-progress form data in a shared state object.
2. Persist draft state to localStorage or session storage if appropriate.
3. Only reset fields on explicit new-project actions.
4. Retest by switching across multiple tabs.

  **Prevention:** Design the wizard with a single source of truth for form values.

### 54. Estimate not recalculating
  **Symptom:** Changing footage, fence type, or markup does not update totals.

  **Cause:** The calculation trigger is not attached to one or more inputs.

  **Solution steps:**
1. Check `input`, `change`, and programmatic update events.
2. Re-run the calculation after loading existing project data.
3. Log the values flowing into the calculator.
4. Write one recalculation function used by every relevant field.

  **Prevention:** Maintain a dependency map for fields that must trigger recalculation.

### 55. Wrong footage total
  **Symptom:** Layout totals do not match entered segment lengths.

  **Cause:** One or more segments are excluded, parsed as strings, or rounded incorrectly.

  **Solution steps:**
1. Inspect the raw segment values before summing.
2. Convert input strings to numbers explicitly.
3. Handle blank fields as zero only when appropriate.
4. Add visual subtotal checks in the layout tab.

  **Prevention:** Use numeric parsing helpers and unit tests for sum logic.

### 56. Save button appears unresponsive
  **Symptom:** Clicking Save shows no message and no data persists.

  **Cause:** The click handler is missing, form validation is blocking submit silently, or the API call fails.

  **Solution steps:**
1. Watch the browser console and network tab.
2. Confirm the save handler prevents default only when intended.
3. Display visible success and error states to the user.
4. Check the API response body for validation errors.

  **Prevention:** Every primary action should show pending, success, or failure feedback.

### 57. API base URL wrong
  **Symptom:** Frontend requests go to the wrong host, port, or path.

  **Cause:** Environment-specific API configuration is hardcoded incorrectly.

  **Solution steps:**
1. Inspect the request URL in dev tools.
2. Update the frontend config to use the correct origin and `/api` prefix.
3. Avoid mixing relative and absolute base URLs unpredictably.
4. Retest login and project loading.

  **Prevention:** Store API base configuration in one file or injected runtime setting.

### 58. CORS preflight fails in browser
  **Symptom:** Requests never reach the controller and the browser reports a preflight error.

  **Cause:** The frontend is sending headers or methods the backend has not allowed.

  **Solution steps:**
1. Check the OPTIONS request in the Network tab.
2. Allow the required method and headers server-side.
3. Remove unnecessary custom headers from simple requests.
4. Retest from the browser, not curl.

  **Prevention:** Test authenticated browser calls whenever CORS settings change.

### 59. Stale localStorage data
  **Symptom:** Old project details or tokens reappear after new deployments.

  **Cause:** localStorage keys were not versioned or cleared when the schema changed.

  **Solution steps:**
1. Inspect stored keys in dev tools.
2. Remove outdated keys manually or via a version bump script.
3. Add migration logic for persisted client data.
4. Force a fresh login if auth payloads changed.

  **Prevention:** Namespace and version localStorage keys.

### 60. Duplicate form submission
  **Symptom:** A single click creates two projects or estimates.

  **Cause:** Both form submit and button click handlers trigger the same API call.

  **Solution steps:**
1. Debounce or disable the submit button while the request is pending.
2. Ensure only one handler owns the submission.
3. Check whether Enter key handling triggers an extra submit.
4. Delete duplicate records from test data.

  **Prevention:** Use one submission path and guard against double clicks.

### 61. Read-only fields are editable
  **Symptom:** Locked contract or estimate values can still be typed into.

  **Cause:** The UI did not apply disabled/read-only states after price lock.

  **Solution steps:**
1. Refresh lock state from the API before rendering.
2. Disable inputs and hide save actions when `is_locked` is true.
3. Show a banner explaining that change orders are required.
4. Retest after locking an estimate.

  **Prevention:** Tie editability directly to authoritative backend state.

### 62. Catalog dropdown empty
  **Symptom:** Fence materials or inventory selectors show no options.

  **Cause:** Catalog data failed to load, filtered out all records, or expected fields changed.

  **Solution steps:**
1. Check the inventory API response.
2. Confirm the frontend maps the correct property names.
3. Handle empty states with a visible message.
4. Reload after seeding catalog data if the database is empty.

  **Prevention:** Validate reference-data endpoints after every seed or schema change.

### 63. Search or filter not working
  **Symptom:** Typing in a search box does not narrow visible records.

  **Cause:** Filtering is bound to the wrong field names or stale state is reused.

  **Solution steps:**
1. Inspect the dataset before and after filter application.
2. Normalize case and trim whitespace before comparison.
3. Reset pagination when filters change.
4. Confirm filter controls map to existing properties.

  **Prevention:** Build filters from a single configuration object.

### 64. Map not rendering
  **Symptom:** The mapping tab stays blank or shows a provider error.

  **Cause:** The map script failed to load, the container has zero height, or the API key is invalid.

  **Solution steps:**
1. Check the browser console for map SDK errors.
2. Confirm the map container is visible and sized.
3. Verify the mapping API key and allowed referrers.
4. Retest after reinitializing the map when the tab becomes visible.

  **Prevention:** Load third-party map code lazily and validate keys separately.

### 65. Drawing canvas not saving
  **Symptom:** Fence layout sketches vanish after save or reload.

  **Cause:** Canvas output is not serialized correctly or the save endpoint rejects the payload.

  **Solution steps:**
1. Encode the drawing in a supported format such as JSON or image data.
2. Check payload size limits.
3. Confirm save and load use the same format.
4. Verify the record exists in the database after save.

  **Prevention:** Define one canonical drawing serialization format.

### 66. Permit data missing after refresh
  **Symptom:** Permit selections show during editing but disappear on reload.

  **Cause:** The UI saved only local state and not the backend payload, or the backend omits the field on read.

  **Solution steps:**
1. Compare the POST/PUT request body to the GET response.
2. Persist permit fields in the server model.
3. Populate the form from the saved API response.
4. Retest a full save-refresh-edit cycle.

  **Prevention:** Round-trip-test every tab that stores data.

### 67. Utility checkbox resets
  **Symptom:** Utility clearance or locate flags do not remain checked.

  **Cause:** Boolean values are serialized inconsistently as strings, nulls, or absent fields.

  **Solution steps:**
1. Normalize booleans before sending data.
2. Set explicit defaults when reading empty records.
3. Check for mismatched names like `utilityCleared` vs `utilitiesCleared`.
4. Retest with both true and false values.

  **Prevention:** Use shared form serializers for booleans.

### 68. Contract preview blank
  **Symptom:** Opening the contract tab shows an empty preview area.

  **Cause:** The preview depends on an estimate or locked price that is missing.

  **Solution steps:**
1. Ensure the estimate was saved and price-locked first.
2. Check whether the preview template receives the expected project and estimate objects.
3. Render a placeholder message when prerequisites are missing.
4. Retest after completing the estimate flow.

  **Prevention:** Model tab prerequisites explicitly and surface them in the UI.

### 69. Change-order totals not updating
  **Symptom:** Approved change orders do not alter displayed totals.

  **Cause:** The project summary ignores approved adjustments or caches stale totals.

  **Solution steps:**
1. Refresh totals after change-order approval.
2. Include approved change orders in the aggregate calculation.
3. Invalidate any cached summary state.
4. Retest with both approved and rejected change orders.

  **Prevention:** Keep project total calculation centralized instead of duplicating it across tabs.

### 70. Signature pad not capturing sign-off
  **Symptom:** The sign-off tab accepts clicks but saves an empty signature.

  **Cause:** The canvas is not exporting data or the form submission omits the signature field.

  **Solution steps:**
1. Verify the signature pad returns non-empty data.
2. Include the signature payload in the save request.
3. Handle clear/reset actions carefully.
4. Retest by saving and reloading a signed record.

  **Prevention:** Add a required-signature check before final submission.

### 71. Notes lost on refresh
  **Symptom:** Typed project notes disappear after page reload.

  **Cause:** Draft notes were never persisted or a stale load overwrote newer local text.

  **Solution steps:**
1. Save notes explicitly before navigation or enable autosave.
2. Use last-updated timestamps to prevent stale overwrites.
3. Show whether the notes are local draft or server-saved.
4. Retest offline/online transitions if autosave exists.

  **Prevention:** Display save state clearly for free-text fields.

### 72. Admin menu hidden for admins
  **Symptom:** An admin user logs in but cannot see admin-only tabs or actions.

  **Cause:** The role was not loaded, cached role data is stale, or the UI checks the wrong property.

  **Solution steps:**
1. Inspect the `/api/auth/me` response.
2. Clear cached auth state and log in again.
3. Compare the expected role string to the actual backend value.
4. Retest with a known admin account.

  **Prevention:** Gate UI permissions from a single normalized role source.

### 73. Mobile layout broken
  **Symptom:** Tabs, forms, or tables overflow on small screens.

  **Cause:** Fixed widths, large tables, or absolute positioning break responsive behavior.

  **Solution steps:**
1. Use browser responsive mode to identify the failing breakpoint.
2. Convert rigid widths to fluid layouts.
3. Wrap or stack large form sections and tables.
4. Retest the most-used workflows on a phone-sized viewport.

  **Prevention:** Add responsive checks for every new tab or data table.

### 74. Back button logs the user out
  **Symptom:** Using the browser back button returns to login or corrupts app state.

  **Cause:** Navigation is tied to full page reloads or auth state only lives in memory.

  **Solution steps:**
1. Persist the session token in localStorage or session storage as designed.
2. Handle route/tab state without full reload when possible.
3. Prevent logout handlers from running on ordinary navigation.
4. Retest login followed by multi-step navigation.

  **Prevention:** Separate navigation state from authentication teardown.

### 75. Print layout cuts off estimate
  **Symptom:** Printed estimates lose columns, totals, or signatures.

  **Cause:** Print styles are incomplete and screen-only widths overflow the page.

  **Solution steps:**
1. Create a print-specific stylesheet.
2. Hide nonessential controls in print mode.
3. Force page breaks around tables and signature sections.
4. Print-preview multiple browsers before release.

  **Prevention:** Treat PDF/print output as a separate supported surface.

### 76. File uploads fail in browser
  **Symptom:** Selecting a file leads to an immediate frontend error or empty upload.

  **Cause:** The form encoding, API endpoint, or file validation flow is incorrect.

  **Solution steps:**
1. Use `FormData` for multipart submissions.
2. Check accepted file types and size messages.
3. Verify the API path and authentication header.
4. Retest with a small known-good file.

  **Prevention:** Standardize upload components across tabs.

### 77. Date picker off by one day
  **Symptom:** Selected dates shift after save or display.

  **Cause:** The UI mixes local dates with UTC timestamps without normalization.

  **Solution steps:**
1. Store date-only values as `YYYY-MM-DD` where time is irrelevant.
2. Convert server timestamps carefully before populating inputs.
3. Avoid constructing dates from ambiguous locale strings.
4. Retest around timezone boundaries.

  **Prevention:** Define date-only vs datetime rules for every field.

### 78. Validation messages not shown
  **Symptom:** The form blocks save but the user cannot see why.

  **Cause:** Errors are generated but not rendered near fields or summary banners.

  **Solution steps:**
1. Inspect the validation response body.
2. Map field errors to visible UI elements.
3. Add a top-level error summary for hidden or collapsed sections.
4. Retest with multiple invalid fields.

  **Prevention:** Never reject a form silently.

### 79. Autosave spinner never stops
  **Symptom:** The UI shows `Saving...` indefinitely.

  **Cause:** A promise never resolves, an error path does not clear state, or save calls overlap.

  **Solution steps:**
1. Inspect the pending network request.
2. Clear loading state in both success and failure paths.
3. Debounce autosave triggers.
4. Surface a retry option if autosave fails.

  **Prevention:** Treat save-state transitions as a finite-state machine.

### 80. Catalog prices display stale values
  **Symptom:** The UI shows old inventory pricing after an admin update.

  **Cause:** The frontend cached catalog data too aggressively or never refetched after edits.

  **Solution steps:**
1. Force a catalog refresh after successful inventory updates.
2. Invalidate local caches or add an ETag/version check.
3. Confirm the API returns updated timestamps.
4. Retest the estimate flow after catalog edits.

  **Prevention:** Version reference data and refresh it deliberately.

### 81. Estimate line items sorted oddly
  **Symptom:** Rows jump order after edits or refreshes.

  **Cause:** Sorting uses string comparison on numeric or mixed keys.

  **Solution steps:**
1. Check the client-side sort function.
2. Sort by explicit numeric position or created timestamp.
3. Persist line item order if drag-and-drop reordering is supported.
4. Retest add, edit, delete, and refresh flows.

  **Prevention:** Store stable ordering metadata for user-arranged lists.

## Authentication Issues

### 82. Valid user cannot log in
  **Symptom:** Known-good credentials are rejected.

  **Cause:** The account is inactive, the email casing differs from lookup rules, or the stored hash is wrong.

  **Solution steps:**
1. Check that the user record exists and is active.
2. Verify whether login normalizes email case consistently.
3. Reset the password and test again.
4. Review recent auth schema changes.

  **Prevention:** Normalize email values and include an account-status check in admin tooling.

### 83. Token expired unexpectedly
  **Symptom:** Users are logged out sooner than expected.

  **Cause:** JWT expiration is shorter than intended or client clocks are far behind the server.

  **Solution steps:**
1. Check `JWT_EXPIRES_IN`.
2. Inspect the token `exp` value.
3. Ensure server and client clocks are accurate.
4. Ask the user to log in again after correcting config.

  **Prevention:** Use NTP-synced hosts and document token lifetime expectations.

### 84. Malformed token sent
  **Symptom:** Protected endpoints return `invalid token` immediately.

  **Cause:** The frontend stored a damaged token, added extra quotes, or truncated the value.

  **Solution steps:**
1. Inspect the exact `Authorization` header in the browser.
2. Clear localStorage and log in again.
3. Store the token as a raw string, not nested JSON accidentally.
4. Retest `/api/auth/me`.

  **Prevention:** Wrap token read/write logic in one tested auth helper.

### 85. Unauthorized after page refresh
  **Symptom:** The app works until the browser is refreshed.

  **Cause:** Auth state only lives in memory and is not restored from storage.

  **Solution steps:**
1. Persist the token between reloads.
2. Reload user state from `/api/auth/me` during startup.
3. Handle missing or expired tokens by redirecting cleanly to login.
4. Retest a full refresh after login.

  **Prevention:** Design startup auth restoration as a first-class flow.

### 86. Logout does not clear session
  **Symptom:** Clicking logout still leaves some protected data visible.

  **Cause:** The token was removed from memory but not from storage, or cached API responses remain.

  **Solution steps:**
1. Delete auth tokens from all storage locations.
2. Clear in-memory user state and sensitive caches.
3. Redirect to login after logout.
4. Retest using the back button and a page refresh.

  **Prevention:** Implement one logout routine used everywhere.

### 87. Admin denied admin route
  **Symptom:** An administrator receives 403 on admin-only features.

  **Cause:** The JWT role claim is stale, the database role changed, or the authorization check uses the wrong role names.

  **Solution steps:**
1. Compare the JWT claims to the database record.
2. Force a re-login to mint a fresh token.
3. Verify the backend authorization list includes the intended role string.
4. Retest the blocked route.

  **Prevention:** Reissue tokens after role changes and centralize permission constants.

### 88. Password reset email never arrives
  **Symptom:** Users request reset links but receive nothing.

  **Cause:** SMTP is misconfigured, the email is landing in spam, or the reset job is not triggered.

  **Solution steps:**
1. Check mailer logs for the request.
2. Verify SMTP credentials and sender domain configuration.
3. Inspect spam/junk folders.
4. Confirm the password-reset feature is enabled in the environment.

  **Prevention:** Monitor transactional email delivery and bounce metrics.

### 89. First admin creation blocked
  **Symptom:** Initial setup cannot create an admin account through the UI.

  **Cause:** Public self-registration intentionally defaults to estimator or disallows admin role creation.

  **Solution steps:**
1. Use the documented seed or SQL bootstrap method.
2. Enable bootstrap mode only temporarily if supported.
3. Disable bootstrap access immediately after creating the account.
4. Log in as the new admin and create standard users from the UI.

  **Prevention:** Document the initial-admin procedure separately from day-to-day user creation.

### 90. Account locked after repeated attempts
  **Symptom:** A user is blocked even after entering the correct password.

  **Cause:** Brute-force protection or a manual lock flag is still active.

  **Solution steps:**
1. Wait for the lockout window to expire or clear the lock server-side.
2. Verify whether the user is hitting the right environment.
3. Reset the password if compromise is suspected.
4. Review lockout logs for suspicious activity.

  **Prevention:** Expose account-status information in admin tools and alert on repeated failures.

### 91. Concurrent sessions overwrite each other
  **Symptom:** Logging in on one device logs out another unexpectedly.

  **Cause:** The app tracks only one valid refresh/session token or rotates state globally per user.

  **Solution steps:**
1. Decide whether multi-device sessions are allowed.
2. If allowed, store session records separately per device.
3. If not allowed, show a clear message to the user.
4. Retest with two browsers.

  **Prevention:** Define session-concurrency policy explicitly.

### 92. Clock skew invalidates JWTs
  **Symptom:** Freshly issued tokens are rejected as not yet valid or already expired.

  **Cause:** Server, database, or client machines have inaccurate clocks.

  **Solution steps:**
1. Check system time on the API host.
2. Enable NTP synchronization.
3. Allow minimal leeway during verification if your library supports it.
4. Retest token issuance and verification.

  **Prevention:** Time-sync every environment that signs or verifies tokens.

### 93. Authorization header missing from fetch
  **Symptom:** Protected API requests work in Postman but fail in the browser.

  **Cause:** The frontend forgot to attach the token after login or after a page refresh.

  **Solution steps:**
1. Inspect the browser Network tab.
2. Update the shared fetch wrapper to inject the Authorization header with the current JWT
3. Retest multiple protected calls, not just one route.
4. Handle missing-token state before dispatching requests.

  **Prevention:** Route all API calls through one authenticated client helper.

### 94. Remember-me setting not persistent
  **Symptom:** Users expect to stay signed in but are logged out on browser restart.

  **Cause:** The app stores tokens in session storage instead of persistent storage.

  **Solution steps:**
1. Check whether the remember-me option changes storage strategy.
2. Store long-lived sessions in localStorage or a secure alternative as designed.
3. Balance convenience with security requirements.
4. Retest browser restart behavior.

  **Prevention:** Document how session persistence works in the UI.

### 95. Token stored under wrong key
  **Symptom:** The login response succeeds but later requests behave as unauthenticated.

  **Cause:** The token is saved under one localStorage key and read back from another.

  **Solution steps:**
1. Search the frontend code for all auth storage keys.
2. Standardize on one constant.
3. Clear old keys from the browser.
4. Retest login, refresh, and logout.

  **Prevention:** Use constants for storage keys instead of inline strings.

### 96. User profile endpoint shows stale role
  **Symptom:** The UI permissions do not match recent role changes.

  **Cause:** The frontend is using cached user data instead of reloading current profile information.

  **Solution steps:**
1. Call `/api/auth/me` after login and after role-sensitive actions.
2. Invalidate cached user data when admins edit user roles.
3. Force re-login if JWT claims are stale.
4. Retest the affected menus and routes.

  **Prevention:** Treat profile data as dynamic, not immutable client state.

### 97. Mixed cookie and JWT setup causes confusion
  **Symptom:** Some requests authenticate while others fail unpredictably.

  **Cause:** The environment mixes token-in-header auth with cookie-based assumptions.

  **Solution steps:**
1. Choose one primary auth transport for the app.
2. Remove conflicting middleware or browser settings.
3. Document whether tokens live in localStorage, memory, or cookies.
4. Retest every auth path after standardizing.

  **Prevention:** Avoid partial migrations between auth models without a compatibility plan.

## Performance Issues

### 98. Project list loads slowly
  **Symptom:** Opening the dashboard takes several seconds.

  **Cause:** The endpoint returns too many rows, joins expensive related data, or sorts without supporting indexes.

  **Solution steps:**
1. Paginate the project list.
2. Index frequently filtered columns.
3. Return summary fields on list screens and load detail lazily.
4. Measure before and after with the browser and database tools.

  **Prevention:** Design list endpoints as summaries, not full-detail dumps.

### 99. Estimate calculation lags on large jobs
  **Symptom:** Typing in long-footage estimates causes noticeable UI delay.

  **Cause:** The frontend recalculates too often or the backend does heavy synchronous work for each field change.

  **Solution steps:**
1. Debounce calculation triggers.
2. Move expensive recalculation to deliberate events when appropriate.
3. Cache stable catalog lookups during one estimate session.
4. Profile large-job scenarios.

  **Prevention:** Test calculators with worst-case data volumes early.

### 100. N+1 queries on inventory lookups
  **Symptom:** Estimate generation performs many repetitive catalog queries.

  **Cause:** Each line item fetches inventory metadata separately.

  **Solution steps:**
1. Batch inventory lookups by ID.
2. Join or prefetch required catalog records in one query.
3. Cache catalog rows for one request.
4. Recheck query counts after the change.

  **Prevention:** Review query patterns whenever line items are introduced.

### 101. High backend memory usage
  **Symptom:** API memory climbs over time and restarts are needed.

  **Cause:** Objects are retained too long, exports build large in-memory buffers, or caches never expire.

  **Solution steps:**
1. Capture heap snapshots in a non-production replica.
2. Stream large responses instead of buffering them.
3. Bound cache sizes and lifetimes.
4. Restarting is a temporary mitigation, not a fix.

  **Prevention:** Watch memory trends continuously and profile before scaling blindly.

### 102. CPU spike from aggressive polling
  **Symptom:** Browsers and API instances show high CPU usage during active editing.

  **Cause:** The frontend polls status endpoints too frequently.

  **Solution steps:**
1. Lengthen polling intervals.
2. Use event-driven updates where practical.
3. Pause polling on hidden tabs.
4. Measure network and CPU after the change.

  **Prevention:** Document polling budgets for each screen.

### 103. Oversized frontend bundle or asset set
  **Symptom:** First page load is slow on normal connections.

  **Cause:** Too many scripts, large images, or unnecessary libraries are loaded up front.

  **Solution steps:**
1. Compress and resize large images.
2. Load heavy features only when their tab opens.
3. Minify JS and CSS for production.
4. Serve assets with gzip or brotli.

  **Prevention:** Track page-weight budgets for the main workflow.

### 104. Image uploads are slow
  **Symptom:** Users wait a long time for site photos or drawings to finish uploading.

  **Cause:** Large files are uploaded without resizing or compression.

  **Solution steps:**
1. Resize images client-side when appropriate.
2. Compress files before upload.
3. Show progress indicators.
4. Store files outside the main API process if usage grows.

  **Prevention:** Define upload size guidelines for users and enforce them in the UI.

### 105. PDF generation blocks the event loop
  **Symptom:** Other API requests slow down while a PDF is being generated.

  **Cause:** CPU-heavy synchronous export code runs inside the main request thread.

  **Solution steps:**
1. Move PDF generation to a worker or queue for heavy documents.
2. Stream output instead of building huge buffers.
3. Reduce template overhead for repeated calculations.
4. Profile export timing separately from API timing.

  **Prevention:** Offload expensive non-API-critical work from the main Node process.

### 106. Connection pool thrashing
  **Symptom:** Throughput drops under modest concurrency.

  **Cause:** Pool size, timeout, and workload do not match the database capacity.

  **Solution steps:**
1. Tune pool min/max values based on measured load.
2. Avoid opening a new pool per module or request.
3. Log pool wait times.
4. Retest under concurrent traffic.

  **Prevention:** Maintain one well-configured shared pool per process.

### 107. Missing indexes on hot tables
  **Symptom:** Searches and filtered lists degrade as data grows.

  **Cause:** Frequently filtered columns were never indexed.

  **Solution steps:**
1. Use slow-query logs and `EXPLAIN ANALYZE`.
2. Add targeted indexes for the exact filters and sorts in use.
3. Avoid over-indexing write-heavy tables.
4. Deploy indexes during low-traffic windows if needed.

  **Prevention:** Review index needs whenever a new filter or report is added.

### 108. Full table scan on change orders
  **Symptom:** Change-order reporting becomes sluggish on large accounts.

  **Cause:** Queries filter by project or status without supporting indexes.

  **Solution steps:**
1. Add indexes on `project_id`, `status`, and `created_at` as needed.
2. Paginate results.
3. Limit default date ranges in reports.
4. Recheck execution plans afterward.

  **Prevention:** Design reporting endpoints with bounded result sets.

### 109. Notes search is slow
  **Symptom:** Searching the notes repository takes too long.

  **Cause:** Text filters use broad wildcard scans on unindexed fields.

  **Solution steps:**
1. Add full-text search or trigram indexes if search volume warrants it.
2. Restrict search scope by category or project first.
3. Paginate results.
4. Cache common note templates separately from free-form note history.

  **Prevention:** Choose the right search strategy before the notes table grows large.

### 110. Frontend freezes on large 17-tab project
  **Symptom:** Opening a complex project stalls the browser.

  **Cause:** Too much DOM is rendered at once or one giant JSON blob is parsed on every tab change.

  **Solution steps:**
1. Render only the active tab when possible.
2. Lazy-load secondary tabs.
3. Break very large state objects into focused modules.
4. Profile scripting time in browser dev tools.

  **Prevention:** Treat each tab as a separately optimized screen.

### 111. localStorage serialization is slow
  **Symptom:** Autosave stutters when large drafts are stored.

  **Cause:** Massive project objects are stringified too often.

  **Solution steps:**
1. Persist only the fields needed for recovery.
2. Throttle autosave frequency.
3. Split large drafts into smaller keys if necessary.
4. Clear obsolete draft data.

  **Prevention:** Keep client persistence lightweight and intentional.

### 112. Repeated auth/profile calls
  **Symptom:** The app calls `/api/auth/me` too often and slows navigation.

  **Cause:** Every tab load revalidates the same profile state independently.

  **Solution steps:**
1. Load profile once on app initialization.
2. Reuse cached role/user data until logout or token refresh.
3. Invalidate only when user-related settings change.
4. Measure network reduction after consolidation.

  **Prevention:** Centralize session bootstrap logic.

### 113. nginx timeout on exports
  **Symptom:** Large exports fail after a fixed interval behind the proxy.

  **Cause:** nginx proxy timeout is shorter than export duration.

  **Solution steps:**
1. Increase `proxy_read_timeout` for export routes if long-running exports are expected.
2. Prefer async export jobs with polling/download links for very large files.
3. Profile the export to see whether app optimization is the better fix.
4. Retest via the public URL, not only localhost.

  **Prevention:** Match proxy timeout settings to real workload or move heavy work async.

### 114. PM2 restarts under load
  **Symptom:** The process restarts only during busy periods.

  **Cause:** Memory limits, uncaught errors, or blocking work make the service unstable at peak traffic.

  **Solution steps:**
1. Inspect restart reason in PM2 logs.
2. Profile CPU and memory under load.
3. Scale horizontally or separate background work if demand is legitimate.
4. Fix the root bottleneck before only raising memory.

  **Prevention:** Load-test before production campaigns or data imports.

### 115. Logs fill the disk
  **Symptom:** Performance degrades and writes slow down because the disk is nearly full.

  **Cause:** Verbose logs are not rotated or purged.

  **Solution steps:**
1. Enable log rotation.
2. Lower unnecessary log verbosity.
3. Archive or ship logs centrally.
4. Free disk space immediately if the host is impacted.

  **Prevention:** Treat logging retention as part of capacity planning.

### 116. Seed script too slow
  **Symptom:** Initial environment setup takes much longer than expected.

  **Cause:** The seed inserts rows one by one or repeats expensive lookups.

  **Solution steps:**
1. Batch inserts where possible.
2. Wrap related inserts in transactions.
3. Disable unnecessary per-row logging.
4. Profile large catalog imports separately from minimal bootstrap data.

  **Prevention:** Keep bootstrap seed data lean and move bulk sample data to optional scripts.

### 117. Browser cache disabled in production
  **Symptom:** Every page load redownloads static assets.

  **Cause:** Cache-control headers are missing or set too conservatively.

  **Solution steps:**
1. Configure caching for versioned JS, CSS, and image assets.
2. Use cache-busting file names for deploys.
3. Keep HTML less aggressively cached if it references changing assets.
4. Verify headers in dev tools.

  **Prevention:** Adopt a static-asset versioning strategy.

### 118. Long transactions lock active work
  **Symptom:** Users experience waits or contention during approvals and edits.

  **Cause:** Business logic keeps transactions open while doing non-database work.

  **Solution steps:**
1. Move email, PDF, or webhook work outside the transaction.
2. Commit as soon as the authoritative data change is complete.
3. Keep row scopes narrow.
4. Add retry logic where safe.

  **Prevention:** Use transactions only for the shortest consistent unit of work.

Total documented issues: **118**
