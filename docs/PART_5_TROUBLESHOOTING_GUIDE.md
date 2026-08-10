# Part 5 Troubleshooting Guide

This guide lists common operational failures and targeted fixes for the Fence Depot Fence Estimator stack.

## Database issues

### Database issue 1
**Issue:** PostgreSQL server connection refused
**Cause:** The PostgreSQL service is stopped, listening on a different port, or blocked by local firewall rules.
**Solution:** Start PostgreSQL, verify `postgresql.conf` and `listen_addresses`, confirm port `5432`, and reconnect with `psql -h <host> -p <port>`.

### Database issue 2
**Issue:** PostgreSQL password authentication failed
**Cause:** The supplied username or password does not match the target role.
**Solution:** Reset the role password with `ALTER ROLE`, update your connection string, and retry with `psql` before running migrations.

### Database issue 3
**Issue:** Database does not exist
**Cause:** The target database name has not been created yet.
**Solution:** Create it with `CREATE DATABASE fence_estimator OWNER fence_app;` and rerun the migration command.

### Database issue 4
**Issue:** Role does not exist
**Cause:** The application role referenced by your command or secret is missing.
**Solution:** Create the role first, grant login rights, then re-run the connection test.

### Database issue 5
**Issue:** Permission denied on schema public
**Cause:** The database role lacks create or usage permissions in the schema.
**Solution:** Grant `USAGE` and `CREATE` on the schema or change ownership to the application role.

### Database issue 6
**Issue:** Migration stops at enum creation
**Cause:** The enum type already exists from a prior partial run.
**Solution:** Drop the type if safe, or re-run the idempotent schema script that guards enum creation with `IF NOT EXISTS` logic.

### Database issue 7
**Issue:** Migration aborts with relation already exists
**Cause:** A prior deployment created one or more tables outside the migration flow.
**Solution:** Inspect the table definitions, back up data if needed, and apply the schema only after reconciling naming conflicts.

### Database issue 8
**Issue:** Migration script cannot locate schema.sql
**Cause:** The `\i` include in `001_initial_schema.sql` is being run from the wrong working directory.
**Solution:** Execute the migration from the repository root or replace the include with an absolute or corrected relative path.

### Database issue 9
**Issue:** Transaction aborted, commands ignored until end of transaction block
**Cause:** An earlier SQL statement failed and left the transaction in an aborted state.
**Solution:** Review the first failure, fix it, then rerun the entire migration instead of continuing in the broken transaction.

### Database issue 10
**Issue:** Invalid input syntax for enum project_status
**Cause:** A seed or manual insert used a status value not allowed by the enum.
**Solution:** Use only `draft`, `estimate`, `contract`, `active`, or `completed` for project rows.

### Database issue 11
**Issue:** JSON gate_sizes check constraint fails
**Cause:** The inserted `gate_sizes` value is not a JSON array.
**Solution:** Insert `[]` or a JSON array such as `[{"width": 4, "quantity": 1}]`.

### Database issue 12
**Issue:** Duplicate key value violates unique constraint on projects_project_id_unique
**Cause:** The generated or imported project identifier already exists.
**Solution:** Generate a new project code and check for collisions before insert.

### Database issue 13
**Issue:** Duplicate key value violates unique constraint on inventory_sku_unique
**Cause:** A seed or import contains repeated SKUs.
**Solution:** Remove duplicates or switch to `ON CONFLICT` updates for idempotent loads.

### Database issue 14
**Issue:** Seed file inserts zero users
**Cause:** The admin row was skipped because the username already existed.
**Solution:** Query `users`, update the existing account if needed, and replace the placeholder hash before use.

### Database issue 15
**Issue:** Stored procedure calculate_estimate_total raises estimate not found
**Cause:** The function was called with an ID that is missing from `estimates`.
**Solution:** Verify the numeric estimate ID and use `SELECT id, estimate_number FROM estimates;` to locate the correct row.

### Database issue 16
**Issue:** Stored procedure lock_contract_price raises estimate total missing
**Cause:** The referenced estimate does not have a populated total amount.
**Solution:** Run `calculate_estimate_total()` for the estimate first, then call `lock_contract_price()` again.

### Database issue 17
**Issue:** Slow full table scan on project notes search
**Cause:** The text search index was not applied or the query bypasses it.
**Solution:** Run migration `002_indexes.sql` and use `to_tsvector`/`@@` queries that match the GIN index.

### Database issue 18
**Issue:** Inventory reorder query returns no rows unexpectedly
**Cause:** Quantities may all be above reorder points or the partial index has not been created yet.
**Solution:** Check `qty_on_hand` and `reorder_point` values, then ensure `002_indexes.sql` completed successfully.

### Database issue 19
**Issue:** Could not serialize access due to concurrent update
**Cause:** Two sessions updated the same estimate or contract row at the same time.
**Solution:** Retry the transaction with backoff and keep contract lock operations short.

### Database issue 20
**Issue:** Disk full during pg_dump
**Cause:** The destination volume lacks space for the backup output.
**Solution:** Free disk space, compress the dump, or write it to a larger mounted volume.

### Database issue 21
**Issue:** SSL required by server
**Cause:** The PostgreSQL endpoint enforces encrypted transport.
**Solution:** Set `PGSSLMODE=require` or equivalent SSL options in your client configuration.

### Database issue 22
**Issue:** MongoDB connection retry loop never resolves
**Cause:** The current backend still depends on MongoDB and cannot start if `MONGO_URI` is unreachable.
**Solution:** Start MongoDB, fix `MONGO_URI`, or modify the backend before expecting PostgreSQL-only startup.

## Backend issues

### Backend issue 1
**Issue:** Port 5000 already in use
**Cause:** Another process is listening on the configured Express port.
**Solution:** Change `PORT` or stop the conflicting service, then restart `node server.js`.

### Backend issue 2
**Issue:** Server exits immediately after startup
**Cause:** A fatal startup exception occurred before `app.listen`, often from database connectivity.
**Solution:** Read the first stack trace in console output, correct the failing dependency, and restart.

### Backend issue 3
**Issue:** Cannot find module express
**Cause:** Dependencies were not installed in `backend/`.
**Solution:** Run `cd backend && npm install` before starting the server.

### Backend issue 4
**Issue:** JWT malformed
**Cause:** The Authorization header contains a broken or incomplete token.
**Solution:** Send `Authorization: ****** exactly as returned by login.

### Backend issue 5
**Issue:** JWT invalid signature
**Cause:** The token was signed with a different `JWT_SECRET`.
**Solution:** Align all environments on the correct secret and force the user to log in again.

### Backend issue 6
**Issue:** JWT expired
**Cause:** The token exceeded the 7-day lifetime configured in `generateToken()`.
**Solution:** Authenticate again to obtain a fresh token and consider implementing refresh logic if required.

### Backend issue 7
**Issue:** No token provided
**Cause:** The protected route was called without the Authorization header.
**Solution:** Include a ****** on `/api/auth/me`, `/api/projects`, `/api/estimates`, and `/api/contracts` requests.

### Backend issue 8
**Issue:** Register endpoint returns validation error
**Cause:** Required fields such as username, email, password, or company were omitted.
**Solution:** Send the full payload expected by `/api/auth/register`.

### Backend issue 9
**Issue:** Login endpoint returns authentication failed
**Cause:** The email is unknown or the password hash comparison failed.
**Solution:** Verify the user exists and reset the password if necessary.

### Backend issue 10
**Issue:** Project creation returns validation error
**Cause:** One or more required fields are missing from the project payload.
**Solution:** Provide customer name, email, phone, address, city, province, and postal code.

### Backend issue 11
**Issue:** Project lookup returns 404
**Cause:** The route uses `projectId` such as `PRJ-...`, not the internal Mongo `_id`.
**Solution:** Call `/api/projects/<projectId>` with the generated project code.

### Backend issue 12
**Issue:** Estimate creation fails with required field error
**Cause:** The request omitted `projectId`, `customerName`, `fenceType`, or `linearFeet`.
**Solution:** Populate all required estimate fields before submitting.

### Backend issue 13
**Issue:** Estimate totals look wrong
**Cause:** Inputs like linear footage, installation type, or barbed wire flag are mismatched with the calculation engine.
**Solution:** Inspect the payload and compare it against the calculation helper assumptions in `server.js`.

### Backend issue 14
**Issue:** Contract creation returns estimate not found
**Cause:** The `estimateNumber` does not match an existing estimate.
**Solution:** Fetch estimates for the project and use the exact `EST-...` value returned by the API.

### Backend issue 15
**Issue:** Contract price is unexpectedly locked
**Cause:** The contract route explicitly sets `priceLocked` to true.
**Solution:** Use a change-order workflow for post-contract price changes; do not overwrite the original contract total directly.

### Backend issue 16
**Issue:** CORS blocked by browser
**Cause:** The frontend origin differs from the expected environment setup or browser context.
**Solution:** Set `FRONTEND_URL` correctly and, if needed, tighten or adapt the CORS middleware configuration.

### Backend issue 17
**Issue:** Large JSON body returns 413 or hangs
**Cause:** The client payload exceeds the configured size or is malformed.
**Solution:** Keep payloads under the 50 MB body-parser limit and validate JSON before sending.

### Backend issue 18
**Issue:** Static assets not found from Express
**Cause:** The server exposes the `public` folder, but the requested files may live elsewhere.
**Solution:** Move static assets under `backend/public` or serve the SPA separately.

### Backend issue 19
**Issue:** Unhandled promise rejection in route logic
**Cause:** An async database call threw outside the expected branch.
**Solution:** Add route-level validation, inspect logs, and return sanitized errors through the existing middleware.

### Backend issue 20
**Issue:** Email sending integration not working
**Cause:** SMTP credentials are missing or invalid even though nodemailer is installed.
**Solution:** Set `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_HOST`, and `EMAIL_PORT`, then verify with a direct SMTP connection test.

### Backend issue 21
**Issue:** PDF generation feature missing at runtime
**Cause:** The package is installed but no endpoint currently exposes PDF output.
**Solution:** Add an explicit route that instantiates `PDFDocument` and streams the generated file.

### Backend issue 22
**Issue:** 404 for /api/change-orders
**Cause:** The backend defines a ChangeOrder model but does not currently register REST endpoints for it.
**Solution:** Add Express routes before documenting it as a live API surface.

### Backend issue 23
**Issue:** 404 for /api/sign-offs
**Cause:** The backend defines a SignOff model but no route handlers are mounted.
**Solution:** Implement the routes or mark the feature as pending in deployment notes.

### Backend issue 24
**Issue:** DELETE /api/projects/:id returns 404
**Cause:** Current `server.js` implements create, list, fetch, and update, but not delete.
**Solution:** Do not call delete until a route is added; use documentation notes to avoid client mismatch.

### Backend issue 25
**Issue:** Health endpoint shows OK but business routes fail
**Cause:** The health check only reports process uptime, not database readiness.
**Solution:** Add deeper readiness checks or validate auth and database routes separately.

### Backend issue 26
**Issue:** Console logs overwhelm production output
**Cause:** The request logger writes every request to stdout.
**Solution:** Route logs through a structured logger or reverse proxy and apply log rotation.

## Frontend issues

### Frontend issue 1
**Issue:** Dashboard tab loads blank
**Cause:** JavaScript failed before the first tab render completed.
**Solution:** Open browser developer tools, inspect the console, and fix the first runtime error.

### Frontend issue 2
**Issue:** New Estimate wizard does not advance to step 2
**Cause:** The `nextStep()` handler is not firing or current step state is corrupted.
**Solution:** Verify the button click binding and ensure the active step class is updated in sequence.

### Frontend issue 3
**Issue:** Wizard progress counter does not update
**Cause:** The DOM node with `stepCounter` is missing or not being refreshed.
**Solution:** Confirm the element ID exists and update it whenever the step index changes.

### Frontend issue 4
**Issue:** Customer form data disappears on tab switch
**Cause:** The SPA does not persist form state between tab changes.
**Solution:** Store draft values in memory or localStorage before switching tabs.

### Frontend issue 5
**Issue:** Fence type button selection sticks on wrong option
**Cause:** The option button CSS class is not cleared from siblings.
**Solution:** Ensure `selectOption()` removes `selected` from peer buttons before applying the new state.

### Frontend issue 6
**Issue:** Height selection does not affect calculations
**Cause:** The chosen height is not mapped into the estimate payload.
**Solution:** Bind the selected height value to the request body passed to `/api/estimates`.

### Frontend issue 7
**Issue:** Measurements summary shows wrong post count
**Cause:** Post spacing assumptions differ from the desired calculation method.
**Solution:** Recalculate using `ceil(total_footage / spacing) + terminals` and update the UI formula.

### Frontend issue 8
**Issue:** Materials review step prices do not match backend totals
**Cause:** The static review content diverges from the server-side calculation engine.
**Solution:** Replace hard-coded values with live data from the estimate response breakdown.

### Frontend issue 9
**Issue:** Generate step completes but no estimate appears
**Cause:** The client may not be calling `/api/estimates` or is ignoring the success payload.
**Solution:** Inspect the network panel, confirm a 201 response, and render the returned estimate object.

### Frontend issue 10
**Issue:** Projects tab table remains static
**Cause:** The SPA mock rows are not wired to `/api/projects`.
**Solution:** Fetch live project data after login and replace the sample rows.

### Frontend issue 11
**Issue:** Projects tab action buttons do nothing
**Cause:** The buttons are presentational but lack event handlers or route logic.
**Solution:** Bind view and edit actions to concrete project detail functions.

### Frontend issue 12
**Issue:** Materials tab supplier counts look incorrect
**Cause:** The counts are demo text rather than computed inventory data.
**Solution:** Read inventory totals from the backend or PostgreSQL reporting layer before displaying metrics.

### Frontend issue 13
**Issue:** Suppliers tab does not reflect actual vendor list
**Cause:** Supplier names are hard-coded in the current markup.
**Solution:** Source them from the inventory or supplier data store and render dynamically.

### Frontend issue 14
**Issue:** Analytics revenue chart does not update monthly
**Cause:** The analytics section is static HTML.
**Solution:** Replace static text with API-driven aggregates keyed by date range.

### Frontend issue 15
**Issue:** Settings changes are lost on refresh
**Cause:** Inputs on the settings tab are not persisted anywhere.
**Solution:** Add save actions backed by an API or browser storage.

### Frontend issue 16
**Issue:** Tab navigation stops responding after an exception
**Cause:** A single uncaught error can halt subsequent client-side handlers.
**Solution:** Wrap tab actions in defensive checks and fix the root exception.

### Frontend issue 17
**Issue:** Login succeeds but page still looks logged out
**Cause:** The token is not being stored or the UI state is not refreshed.
**Solution:** Persist the token, request `/api/auth/me`, and toggle authenticated UI state on success.

### Frontend issue 18
**Issue:** Authenticated requests return 401 from browser only
**Cause:** The fetch layer is not sending the Authorization header.
**Solution:** Attach the ****** on every protected request.

### Frontend issue 19
**Issue:** Estimate not calculating when linear footage is entered
**Cause:** The form may submit strings or empty values instead of numbers.
**Solution:** Coerce numeric inputs before payload creation and validate for `NaN`.

### Frontend issue 20
**Issue:** Province or postal code formatting breaks submission
**Cause:** The client-side validation is too strict or inconsistent with backend rules.
**Solution:** Normalize the value and keep validation compatible with the server schema.

### Frontend issue 21
**Issue:** Project search box shows no results
**Cause:** The page lacks a client-side filter implementation.
**Solution:** Add a filter over loaded project rows or call an API endpoint with query parameters.

### Frontend issue 22
**Issue:** PDF not generating from UI action
**Cause:** No active API route currently wraps the installed `pdfkit` package.
**Solution:** Disable the button until the route exists, or add a backend PDF endpoint.

### Frontend issue 23
**Issue:** Email quote button fails silently
**Cause:** The client is invoking a feature with no wired backend handler.
**Solution:** Surface an error message and add an SMTP-backed endpoint before enabling the button.

### Frontend issue 24
**Issue:** Contract tab navigation loops back to projects
**Cause:** The extended tab workflow is documented but not fully implemented in the existing 8-tab SPA.
**Solution:** Treat tabs 9 through 17 as planned workflow steps until matching UI components are added.

### Frontend issue 25
**Issue:** Customer portal link opens 404
**Cause:** No dedicated customer portal route or page exists yet.
**Solution:** Implement the page and its authentication flow before exposing the link.

### Frontend issue 26
**Issue:** Scheduling view does not show crew assignments
**Cause:** The scheduling tab depends on data models that are not yet surfaced in the UI.
**Solution:** Create a scheduling API and bind crew resources to the frontend table or calendar.

### Frontend issue 27
**Issue:** Photo gallery uploads fail
**Cause:** The current backend does not expose file upload endpoints.
**Solution:** Add multipart upload handling and storage before enabling gallery actions.

### Frontend issue 28
**Issue:** Mapping tab loads without map tiles
**Cause:** The Google Maps API key is missing or restricted.
**Solution:** Set `GOOGLE_MAPS_API_KEY`, allow the correct origin, and reload the page.

### Frontend issue 29
**Issue:** Responsive layout breaks on narrow screens
**Cause:** The tab navigation overflows and the CSS media rules are incomplete.
**Solution:** Add wrapping, scrolling, or a hamburger navigation pattern for small viewports.

### Frontend issue 30
**Issue:** Open index.html directly causes CORS or file access limitations
**Cause:** Some browsers restrict module fetches or API calls from the `file://` scheme.
**Solution:** Serve the project with `npx http-server` or another static server.

### Frontend issue 31
**Issue:** Logout button does not clear session fully
**Cause:** The UI may remove visual state but leave the token in storage.
**Solution:** Delete the stored token, reset in-memory user state, and redirect to the login screen.

## Security issues

### Security issue 1
**Issue:** JWT secret is too short
**Cause:** A weak secret makes token forgery more feasible.
**Solution:** Use a long random secret from a password manager or secret store and rotate it per environment.

### Security issue 2
**Issue:** Admin account uses seed placeholder hash
**Cause:** The seeded PostgreSQL admin entry is intentionally non-production.
**Solution:** Replace it with a real bcrypt hash before enabling login.

### Security issue 3
**Issue:** Password reset flow does not exist
**Cause:** Users cannot recover credentials safely without a designed reset process.
**Solution:** Implement reset tokens with short expiration and single-use semantics.

### Security issue 4
**Issue:** Role escalation risk from open registration
**Cause:** The register route accepts `role` input directly.
**Solution:** Validate or override incoming roles server-side so only authorized admins can assign privileged roles.

### Security issue 5
**Issue:** Brute-force login attempts go unchecked
**Cause:** No rate limiting or lockout is present on `/api/auth/login`.
**Solution:** Add IP/user throttling and alerting around repeated failures.

### Security issue 6
**Issue:** CORS policy too permissive
**Cause:** Default `cors()` can be broader than necessary for production.
**Solution:** Restrict allowed origins, methods, and headers to the deployed frontend only.

### Security issue 7
**Issue:** Sensitive values committed to .env
**Cause:** Developers may accidentally store real secrets in source control.
**Solution:** Keep `.env` out of version control and use secret scanning before commits.

### Security issue 8
**Issue:** MongoDB open to the network
**Cause:** An exposed MongoDB instance can leak application data.
**Solution:** Bind MongoDB to private interfaces, require authentication, and enforce TLS where appropriate.

### Security issue 9
**Issue:** SQL injection concern in future PostgreSQL wiring
**Cause:** Unsafe string concatenation in SQL scripts or app code could expose the database.
**Solution:** Use parameterized queries in application code and avoid building SQL from raw user strings.

### Security issue 10
**Issue:** No CSRF strategy for cookie-based auth
**Cause:** If auth later moves to cookies, cross-site requests could be abused.
**Solution:** Adopt CSRF tokens or SameSite protections before using cookie sessions.

### Security issue 11
**Issue:** Unsigned file uploads
**Cause:** Future gallery or signature uploads can carry malware or oversized payloads.
**Solution:** Validate MIME types, inspect size, and store uploads outside the web root.

### Security issue 12
**Issue:** Contract signatures stored as raw text without retention policy
**Cause:** Signature data can become sensitive regulated content.
**Solution:** Encrypt at rest, scope access by role, and define retention and audit policies.

### Security issue 13
**Issue:** Audit trail incomplete for pricing changes
**Cause:** Without immutable events, unauthorized estimate edits are harder to investigate.
**Solution:** Persist user, timestamp, and delta data for estimates, contracts, and change orders.

### Security issue 14
**Issue:** Password policy too weak
**Cause:** The backend only enforces a minimum length of six characters.
**Solution:** Increase strength requirements and encourage passphrases or SSO integration.

### Security issue 15
**Issue:** Expired token handling is inconsistent on the client
**Cause:** Stale tokens can cause loops or confusing 401 responses.
**Solution:** Trap 401s globally, clear stored credentials, and redirect to re-authentication.

### Security issue 16
**Issue:** Production errors leak internals in development mode
**Cause:** Verbose errors can reveal implementation details when misconfigured.
**Solution:** Ensure `NODE_ENV=production` in live environments and log details server-side only.

## Performance issues

### Performance issue 1
**Issue:** Project list API becomes slow with many records
**Cause:** The query sorts by creation date and populates estimator fields across all matches.
**Solution:** Paginate results and keep the `estimator` and `createdAt` indexes healthy.

### Performance issue 2
**Issue:** Estimate history lookup is slow
**Cause:** Large per-project estimate sets can overwhelm unbounded responses.
**Solution:** Add pagination or date filters and rely on the `project_id` and `created_at` indexes.

### Performance issue 3
**Issue:** Contract report queries scan full tables
**Cause:** Composite indexes for project, status, and date were not applied.
**Solution:** Run `002_indexes.sql` and verify the query plan with `EXPLAIN ANALYZE`.

### Performance issue 4
**Issue:** Inventory reorder report lags
**Cause:** The query may ignore the partial reorder index.
**Solution:** Write the predicate as `qty_on_hand <= reorder_point` so PostgreSQL can use the partial index.

### Performance issue 5
**Issue:** Text search on project notes is slow
**Cause:** A full text GIN index is missing or the query uses plain `LIKE` on long text.
**Solution:** Apply `idx_project_notes_search` and use `to_tsvector` plus `plainto_tsquery`.

### Performance issue 6
**Issue:** Backend memory usage grows over time
**Cause:** Large request bodies or retained in-memory objects can increase heap pressure.
**Solution:** Profile the process, shrink payloads, and release or stream large data structures.

### Performance issue 7
**Issue:** Browser freezes on large tables
**Cause:** Rendering too many DOM rows at once strains the UI.
**Solution:** Paginate or virtualize the table rendering logic.

### Performance issue 8
**Issue:** Repeated login checks flood the backend
**Cause:** The client may call `/api/auth/me` too often.
**Solution:** Cache authenticated user state client-side and refresh only when necessary.

### Performance issue 9
**Issue:** High latency from synchronous PDF generation
**Cause:** Generating documents inline can block response paths.
**Solution:** Offload heavy document work to background jobs or stream results efficiently.

### Performance issue 10
**Issue:** Slow startup after database outage
**Cause:** MongoDB reconnect retries can delay usable startup.
**Solution:** Improve readiness detection and fail fast in orchestrated environments if preferred.

### Performance issue 11
**Issue:** Overfetching project data
**Cause:** Endpoints return full document payloads even when list views need summaries only.
**Solution:** Add lightweight list projections and fetch details lazily.

### Performance issue 12
**Issue:** No HTTP compression
**Cause:** JSON responses may be larger than needed over WAN links.
**Solution:** Enable compression middleware behind the reverse proxy or in Express.

### Performance issue 13
**Issue:** N+1 population overhead
**Cause:** Repeated `populate()` calls can grow costly as collections expand.
**Solution:** Project only necessary fields and denormalize hot summary values when justified.

### Performance issue 14
**Issue:** Long-running backups affect production IO
**Cause:** Full dumps consume disk and CPU during peak hours.
**Solution:** Schedule backups off-peak and use incremental or replica-based strategies when possible.

### Performance issue 15
**Issue:** Slow map loading on customer addresses
**Cause:** Map SDKs and geocoding requests add client latency.
**Solution:** Load maps lazily and cache geocoded coordinates.

### Performance issue 16
**Issue:** Large static assets increase first paint time
**Cause:** Serving unoptimized assets from the root can delay SPA interactivity.
**Solution:** Compress images, minify scripts, and use caching headers.

### Performance issue 17
**Issue:** Frequent full-page reloads reset all client state
**Cause:** The SPA may not preserve state across actions.
**Solution:** Keep navigation client-side and persist drafts locally.

### Performance issue 18
**Issue:** CPU spikes during cost calculations
**Cause:** Recomputing every line item on every keystroke is expensive.
**Solution:** Debounce UI calculations and recalculate server totals only on submit or explicit review.

### Performance issue 19
**Issue:** Slow analytics tab
**Cause:** The analytics section can become expensive once it stops using static data.
**Solution:** Pre-aggregate daily metrics in background jobs or materialized views.

### Performance issue 20
**Issue:** Database vacuum bloat impacts query speed
**Cause:** High churn tables accumulate dead tuples.
**Solution:** Tune autovacuum and monitor table bloat on estimates, contracts, and notes.

### Performance issue 21
**Issue:** Memory leak from event listeners in the browser
**Cause:** Repeated tab initialization can attach duplicate listeners.
**Solution:** Bind listeners once during app boot or remove them during teardown.
