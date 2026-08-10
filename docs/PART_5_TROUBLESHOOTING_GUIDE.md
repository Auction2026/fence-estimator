# PART 5 – TROUBLESHOOTING GUIDE
## Fence Depot Estimator Pro – 110+ Issues & Solutions

---

## HOW TO USE THIS GUIDE

1. Find your issue category (Database, Backend, Frontend, etc.)
2. Read the symptom description
3. Follow the solution steps in order
4. If still stuck, see the **Emergency Recovery** section at the bottom

---

## SECTION 1 – DATABASE ISSUES (25 issues)

### DB-001: Cannot connect to PostgreSQL

**Symptom:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solutions:**
1. Check PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql    # Linux
   brew services list | grep postgresql  # Mac
   ```
2. Start it if stopped:
   ```bash
   sudo systemctl start postgresql    # Linux
   brew services start postgresql     # Mac
   ```
3. Check your `.env` has the correct `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
4. Test connection manually: `psql -U fence_user -d fence_estimator`

---

### DB-002: Password authentication failed

**Symptom:** `FATAL: password authentication failed for user "fence_user"`

**Solutions:**
1. Reset the password in psql:
   ```sql
   psql -U postgres -c "ALTER USER fence_user WITH PASSWORD 'NewPassword123!';"
   ```
2. Update `.env` with the new password
3. Restart the backend

---

### DB-003: Database does not exist

**Symptom:** `FATAL: database "fence_estimator" does not exist`

**Solutions:**
1. Create it: `psql -U postgres -c "CREATE DATABASE fence_estimator;"`
2. Run schema: `psql -U fence_user -d fence_estimator -f database/schema.sql`
3. Run seed: `psql -U fence_user -d fence_estimator -f database/seed.sql`

---

### DB-004: Schema migration fails – table already exists

**Symptom:** `ERROR: relation "users" already exists`

**Solutions:**
1. If this is a fresh install, the database was not empty. Run:
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   ```
   Then re-run schema.sql
2. If this is an update, use the migration files in `database/migrations/` instead

---

### DB-005: Too many connections

**Symptom:** `FATAL: remaining connection slots are reserved for non-replication superuser connections`

**Solutions:**
1. In `.env`, reduce `DB_POOL_MAX` to `5`
2. Restart backend: `pm2 restart fence-estimator-api`
3. In PostgreSQL: `ALTER SYSTEM SET max_connections = 200;` then restart pg

---

### DB-006: Slow queries / application is sluggish

**Solutions:**
1. Run `VACUUM ANALYZE;` in psql
2. Check indexes exist: `\d inventory` – look for index lines
3. Re-run migration 001 to recreate indexes if missing
4. Add `DB_POOL_MAX=10` to `.env`

---

### DB-007: Seed data not loading – duplicate key error

**Symptom:** `ERROR: duplicate key value violates unique constraint "inventory_plu_key"`

**Solutions:**
1. Seed data was already loaded. Skip the seed step.
2. To reload fresh: `TRUNCATE inventory, suppliers RESTART IDENTITY CASCADE;` then re-run seed

---

### DB-008: estimate_items line_total column error

**Symptom:** `ERROR: column "line_total" is a generated column`

**Solution:** Never INSERT or UPDATE `line_total` directly. It is auto-calculated. Remove it from your INSERT statement.

---

### DB-009: UUID extension missing

**Symptom:** `ERROR: function uuid_generate_v4() does not exist`

**Solution:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

### DB-010: Trigger function missing after restore

**Symptom:** `ERROR: function set_updated_at() does not exist`

**Solution:** Re-run the trigger section at the bottom of `database/schema.sql`

---

### DB-011: pgcrypto extension error

**Symptom:** `ERROR: could not open extension control file ... pgcrypto.control`

**Solution:** `sudo apt install postgresql-contrib` then retry

---

### DB-012: Cannot drop database – other users connected

**Solution:**
```sql
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'fence_estimator';
DROP DATABASE fence_estimator;
```

---

### DB-013: Backup procedure fails

**Symptom:** `ERROR: function fn_export_project_summary() does not exist`

**Solution:** Re-run `database/procedures/backup.sql` in psql

---

### DB-014: Date/time timezone issues

**Symptom:** Timestamps off by hours

**Solution:** Set timezone in PostgreSQL:
```sql
ALTER DATABASE fence_estimator SET timezone TO 'America/Chicago';
```
Then restart backend.

---

### DB-015: Out of disk space

**Symptom:** `ERROR: could not extend file ... No space left on device`

**Solutions:**
1. `VACUUM FULL;` in psql to reclaim space
2. Delete old log files: `sudo journalctl --vacuum-size=100M`
3. Add more disk space to your server

---

### DB-016 to DB-025: Additional database scenarios

| # | Issue | Fix |
|---|-------|-----|
| DB-016 | PostgreSQL won't start after update | `sudo pg_dropcluster && sudo pg_createcluster` |
| DB-017 | Read-only transaction error | Check disk space; run `VACUUM` |
| DB-018 | Lock timeout | Kill blocking query: `SELECT pg_cancel_backend(pid)` |
| DB-019 | Replication lag | Not applicable for single-server setup |
| DB-020 | Schema version mismatch | Run all 4 migrations in order |
| DB-021 | Connection pool exhausted | Restart backend; set `DB_POOL_MAX=5` |
| DB-022 | Corrupt index | `REINDEX DATABASE fence_estimator;` |
| DB-023 | pg_ident.conf error | Remove custom ident rules; use `md5` auth |
| DB-024 | NULL constraint violation | Check all required fields in your INSERT |
| DB-025 | Foreign key violation | Insert parent record first (e.g., user before estimate) |

---

## SECTION 2 – BACKEND ISSUES (25 issues)

### BE-001: Server won't start – port in use

**Symptom:** `Error: listen EADDRINUSE :::3000`

**Solutions:**
1. Change port in `.env`: `PORT=3001`
2. Kill existing process:
   ```bash
   lsof -ti:3000 | xargs kill -9    # Mac/Linux
   netstat -ano | findstr 3000      # Windows
   ```

---

### BE-002: JWT_SECRET not set

**Symptom:** `Error: secretOrPrivateKey must have a value`

**Solution:** Set `JWT_SECRET=your-long-secret-here` in `.env` and restart

---

### BE-003: Cannot find module 'express'

**Symptom:** `Error: Cannot find module 'express'`

**Solution:**
```bash
cd backend
npm install
```

---

### BE-004: Login returns 401 Unauthorized

**Symptom:** POST `/api/auth/login` returns `{"message":"Invalid credentials"}`

**Solutions:**
1. Check the admin password in seed.sql (default: `Admin@1234`)
2. The seed.sql hash may not match. Reset via:
   ```sql
   UPDATE users SET password_hash = '$2b$12$K8ZhAFOZNMlq/pV5sUj7..LUX2cUj/6ER2BwqFP/uBBxkO8XvEkIq'
   WHERE email = 'admin@fencedepot.local';
   ```
3. Or use the backend's reset endpoint if configured

---

### BE-005: CORS error in browser

**Symptom:** `Access to fetch has been blocked by CORS policy`

**Solution:** In `backend/server.js`, ensure CORS is set to allow your frontend URL:
```javascript
app.use(cors({ origin: 'http://localhost:3001' }));
```

---

### BE-006: 500 Internal Server Error on estimate save

**Solutions:**
1. Check backend terminal for full error message
2. Ensure database is connected
3. Verify estimate JSON has all required fields (`fenceType`, `linearFt`, etc.)

---

### BE-007: Estimate total calculating as $0

**Solutions:**
1. Ensure `items` array is not empty in POST body
2. Run `sp_recalc_estimate(estimate_id)` procedure in psql

---

### BE-008: Token expired error

**Symptom:** `{"message":"Token expired"}`

**Solution:** Log out and log in again. Tokens expire after 24 hours by default.

---

### BE-009: Cannot read .env variables

**Symptom:** `DB_HOST is undefined`

**Solution:** Ensure `dotenv` is loaded at very top of `server.js`:
```javascript
require('dotenv').config();
```

---

### BE-010: Email sending fails

**Symptom:** `Error: connect ECONNREFUSED smtp.gmail.com:587`

**Solutions:**
1. Set `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` in `.env`
2. For Gmail: enable "App Passwords" in Google Account security
3. Email is optional – estimates can be printed instead

---

### BE-011 to BE-025: Additional backend scenarios

| # | Issue | Fix |
|---|-------|-----|
| BE-011 | `Cannot GET /api/estimates` | Check route in server.js; restart server |
| BE-012 | File upload fails | Check `uploads/` folder exists and is writable |
| BE-013 | PM2 not found | `npm install -g pm2` |
| BE-014 | Process crashes in loop | Check pm2 logs: `pm2 logs` |
| BE-015 | Memory leak / high RAM | Restart: `pm2 restart fence-estimator-api` |
| BE-016 | Slow API responses | Add DB indexes; check pool size |
| BE-017 | 413 Payload Too Large | Add `app.use(express.json({ limit: '10mb' }))` |
| BE-018 | Route not found (404) | Check URL spelling; API prefix `/api` required |
| BE-019 | Validation error (422) | Check required fields in request body |
| BE-020 | Cannot delete estimate | Check foreign key constraints first |
| BE-021 | PDF generation missing | Install wkhtmltopdf or use browser print |
| BE-022 | Change order won't approve | Check user role is `admin` or `manager` |
| BE-023 | Sign-off not saving signature | Ensure `signed_by` field not empty |
| BE-024 | Contract status stuck at draft | Call `PUT /api/contracts/:id { status:'signed' }` |
| BE-025 | Backend logs show SQL errors | Enable `DB_LOG=true` in `.env` for verbose SQL |

---

## SECTION 3 – FRONTEND ISSUES (30 issues)

### FE-001: Blank white page

**Solutions:**
1. Open browser DevTools (F12) → Console tab – look for red errors
2. Ensure all script files loaded (Network tab)
3. Check `frontend/js/app.js` is not empty

---

### FE-002: Tab click does nothing

**Solutions:**
1. Check browser console for JavaScript errors
2. Verify `js/app.js` loaded before tab scripts
3. Check tab button `data-tab` attribute matches panel `id`

---

### FE-003: Estimate total shows $0 after Calculate

**Solutions:**
1. Make sure Fence Type and Footage are filled in Step 2
2. Click "Calculate Materials" button in Step 4
3. Check browser console for calculation errors

---

### FE-004: Settings not saving

**Solution:** Settings are stored in `localStorage`. Check that your browser allows localStorage (not in private/incognito mode with strict settings).

---

### FE-005: Dark mode not applying

**Solution:**
1. Go to Settings tab
2. Change Theme to "Dark"
3. Click "Save Settings"
4. If still not working, check `css/main.css` includes `[data-theme="dark"]` block

---

### FE-006: Print/PDF shows missing data

**Solutions:**
1. Go to step 5 of estimate wizard before printing
2. Ensure `print.css` is linked in `<head>` of `index.html`
3. Use browser's built-in Print → Save as PDF

---

### FE-007: Site map canvas not drawing

**Solutions:**
1. Click on the canvas first (it needs focus)
2. Check `js/tools/canvas-map.js` loaded (Network tab in DevTools)
3. Try a different browser (Chrome recommended)

---

### FE-008: Photos not uploading

**Solutions:**
1. Photos are stored locally in the browser (no server upload needed)
2. Ensure `<input type="file">` is not blocked
3. Check file size is under 5MB

---

### FE-009: Analytics chart is empty

**Solution:** Create at least one estimate first. The chart shows estimates by month.

---

### FE-010: Mobile layout broken

**Solutions:**
1. Ensure `<meta name="viewport" content="width=device-width, initial-scale=1.0">` is in `<head>`
2. Nav bar scrolls horizontally on mobile (by design)
3. Use landscape orientation for best experience

---

### FE-011 to FE-030: Additional frontend scenarios

| # | Issue | Fix |
|---|-------|-----|
| FE-011 | Currency symbol wrong | Settings → Currency Symbol → Save |
| FE-012 | Date format wrong | Settings → Date Format → Save |
| FE-013 | Project search not working | Type slowly – event fires on each keystroke |
| FE-014 | Delete project shows error | Ensure no child records block deletion |
| FE-015 | Contract not generating | Must have at least one saved estimate first |
| FE-016 | Change order amount shows NaN | Enter a numeric value in Amount field |
| FE-017 | Sign-off won't submit | Both Name and Signature fields are required |
| FE-018 | Export CSV downloads empty | Load the tab data first, then export |
| FE-019 | API errors shown to user | Offline mode uses localStorage automatically |
| FE-020 | Tab content not updating | Refresh the tab (click it again) |
| FE-021 | Admin users list empty | Add a user via the "+ Add User" button |
| FE-022 | Estimate number duplicated | IDs use `Date.now()` – ensure not clicking twice |
| FE-023 | Wizard back button goes wrong step | Refresh page to reset wizard state |
| FE-024 | Gate count not in material list | Set walk/drive gate count in Step 3, not Step 2 |
| FE-025 | Markup not applying | Check markup % field has a number (not blank) |
| FE-026 | Toast notifications not visible | Check z-index in `css/main.css` for `#toast-container` |
| FE-027 | Modal not closing | Click the ✕ button or click outside the modal |
| FE-028 | Logo not showing | Place `logo.png` in `frontend/assets/` folder |
| FE-029 | Pricing lock not working | Select an estimate from dropdown before clicking Lock |
| FE-030 | Reports show no data | Run estimates/projects first; reports read localStorage |

---

## SECTION 4 – SECURITY ISSUES (15 issues)

### SEC-001: Default admin password still active

**CRITICAL – Do this immediately:**
```sql
UPDATE users
SET password_hash = crypt('YourNewPassword@2024!', gen_salt('bf'))
WHERE email = 'admin@fencedepot.local';
```

---

### SEC-002: JWT_SECRET is weak or default

**CRITICAL:** Generate a strong secret:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
Paste result into `.env` as `JWT_SECRET=...`

---

### SEC-003: Database password visible in logs

**Solution:** Remove `DB_LOG=true` from `.env` in production

---

### SEC-004: HTTPS not enabled

**Solution:** Follow Step 6c in `PART_4_IMPLEMENTATION_MENU.md` to install SSL cert

---

### SEC-005: SQL injection attempt

**Solution:** The backend uses parameterized queries. Ensure no raw string concatenation in custom queries.

---

### SEC-006 to SEC-015: Additional security scenarios

| # | Issue | Fix |
|---|-------|-----|
| SEC-006 | XSS in notes field | All output is escaped via `textContent` (not `innerHTML`) |
| SEC-007 | API accessible without login | All `/api/*` routes require JWT; check middleware |
| SEC-008 | Password visible in browser network | Always use HTTPS in production |
| SEC-009 | Old tokens still working | Set `JWT_EXPIRY=24h` in `.env` |
| SEC-010 | User can access admin routes | Role middleware checks `req.user.role === 'admin'` |
| SEC-011 | CORS too permissive | Set specific origin in CORS config (not `*`) |
| SEC-012 | File upload malware risk | Restrict accepted types; scan uploads |
| SEC-013 | Environment file committed to git | Add `.env` to `.gitignore` (already done) |
| SEC-014 | Database backup not encrypted | Use `pg_dump | gpg` for encrypted backups |
| SEC-015 | Failed login not rate-limited | Add `express-rate-limit` middleware to auth routes |

---

## SECTION 5 – PERFORMANCE ISSUES (15 issues)

### PERF-001: Page loads slowly

**Solutions:**
1. Minify CSS/JS (optional – not required for internal tool)
2. Reduce `DB_POOL_MAX` if server has limited RAM
3. Add PostgreSQL indexes (already in schema.sql)

---

### PERF-002: Estimate calculation is slow

**Solution:** Material list is calculated in browser JavaScript – should be instant. If slow, check browser console for infinite loops.

---

### PERF-003: API response > 2 seconds

**Solutions:**
1. Check database is on same machine (not over slow network)
2. Run `EXPLAIN ANALYZE SELECT ...` to check query plan
3. Ensure indexes on `estimates(status)` and `projects(status)` exist

---

### PERF-004 to PERF-015: Additional performance scenarios

| # | Issue | Fix |
|---|-------|-----|
| PERF-004 | High CPU on server | Check PM2 for crashed restarts: `pm2 monit` |
| PERF-005 | RAM growing over time | Restart backend weekly via cron job |
| PERF-006 | Analytics chart slow | Limit estimate history to 12 months in query |
| PERF-007 | Inventory tab slow | Add filter/search before loading 1000+ items |
| PERF-008 | CSV export hangs | Limit to 500 rows per export |
| PERF-009 | Photo grid slow | Resize images before upload (< 1MB recommended) |
| PERF-010 | Too many tabs open | Navigator uses on-demand load per tab |
| PERF-011 | Database growing large | Run `sp_purge_old_drafts()` monthly |
| PERF-012 | Node.js using old version | Upgrade to Node.js 20 LTS |
| PERF-013 | Disk I/O high | Move PostgreSQL data dir to SSD |
| PERF-014 | Network latency | Host backend and frontend on same server |
| PERF-015 | Browser cache stale | Hard-refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac) |

---

## ERROR CODE REFERENCE

| Code | Message | Meaning |
|------|---------|---------|
| 400 | Bad Request | Missing or invalid field in request |
| 401 | Unauthorized | Not logged in or token expired |
| 403 | Forbidden | Logged in but insufficient role |
| 404 | Not Found | Route or record doesn't exist |
| 409 | Conflict | Duplicate record (unique constraint) |
| 422 | Unprocessable | Validation failed (check field values) |
| 429 | Too Many Requests | Rate limit hit – wait 1 minute |
| 500 | Internal Server Error | Bug or database problem – check logs |

---

## EMERGENCY RECOVERY

### Complete system reset (⚠️ ALL DATA WILL BE LOST):

```bash
# Step 1: Stop the server
pm2 stop fence-estimator-api

# Step 2: Reset database
psql -U postgres -c "DROP DATABASE fence_estimator;"
psql -U postgres -c "CREATE DATABASE fence_estimator;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE fence_estimator TO fence_user;"

# Step 3: Rebuild schema and seed
psql -U fence_user -d fence_estimator -f database/schema.sql
psql -U fence_user -d fence_estimator -f database/seed.sql

# Step 4: Restart server
pm2 start fence-estimator-api

# Step 5: Open browser
# http://localhost:3001
```

---

## PREVENTION CHECKLIST

Run these every month to prevent issues:

- [ ] `VACUUM ANALYZE;` in psql
- [ ] `pm2 restart fence-estimator-api`
- [ ] Check disk space: `df -h`
- [ ] Review error logs: `pm2 logs --lines 100`
- [ ] Back up database: `pg_dump fence_estimator > backup_$(date +%Y%m%d).sql`
- [ ] Update Node.js packages: `cd backend && npm audit`

---

*For installation help, see `docs/PART_4_IMPLEMENTATION_MENU.md`*
