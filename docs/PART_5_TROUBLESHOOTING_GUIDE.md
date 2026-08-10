# PART 5: TROUBLESHOOTING GUIDE
## Fence Depot Fence Estimator — 110+ Solutions
### Database • Backend • Frontend • Security • Performance

---

## HOW TO USE THIS GUIDE

1. Find your issue in the table of contents
2. Follow the numbered steps exactly
3. After each step, test to see if the issue is resolved
4. If issue persists, proceed to next step
5. Still stuck? Check the error log section at the bottom

---

## TABLE OF CONTENTS

- [Section A: Database Issues (20 solutions)](#section-a-database-issues)
- [Section B: Backend Issues (25 solutions)](#section-b-backend-issues)
- [Section C: Frontend Issues (30 solutions)](#section-c-frontend-issues)
- [Section D: Security Issues (15 solutions)](#section-d-security-issues)
- [Section E: Performance Issues (20 solutions)](#section-e-performance-issues)
- [Error Code Reference](#error-code-reference)

---

## SECTION A: DATABASE ISSUES

### A1. Cannot connect to database
**Error:** `ECONNREFUSED 5432` or `connection refused`

**Steps:**
1. Check PostgreSQL is running:
   ```bash
   # Windows
   net start postgresql-x64-14
   # Mac/Linux
   sudo service postgresql status
   ```
2. Verify port 5432 is open:
   ```bash
   netstat -an | grep 5432
   ```
3. Check pg_hba.conf allows local connections
4. Verify DATABASE_URL in .env is correct
5. Try connecting manually: `psql -U postgres -h localhost`

---

### A2. Schema.sql fails with "already exists" errors
**Error:** `ERROR: relation "users" already exists`

**Solution:**
```sql
-- Drop and recreate:
DROP DATABASE fence_estimator;
CREATE DATABASE fence_estimator;
\c fence_estimator
\i database/schema.sql
```

---

### A3. Seed data insert fails — duplicate key
**Error:** `ERROR: duplicate key value violates unique constraint`

**Solution:**
```sql
-- The seed uses ON CONFLICT DO NOTHING — check if data already exists:
SELECT COUNT(*) FROM inventory;
SELECT COUNT(*) FROM users;
-- If counts are correct, seed already ran — no action needed.
```

---

### A4. Password hash not working — can't login
**Error:** Login fails even with correct password

**Steps:**
1. Generate a new hash:
   ```bash
   node -e "const b=require('bcryptjs'); console.log(b.hashSync('admin123',10))"
   ```
2. Update the user:
   ```sql
   UPDATE users SET password_hash = 'NEW_HASH_HERE' WHERE username = 'admin';
   ```

---

### A5. UUID extension missing
**Error:** `ERROR: function uuid_generate_v4() does not exist`

**Solution:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

### A6. Trigger "already exists" on repeated migration
**Error:** `ERROR: trigger "set_updated_at" for relation "users" already exists`

**Solution:**
```sql
-- Drop existing trigger before creating:
DROP TRIGGER IF EXISTS set_updated_at ON users;
-- Then re-run the trigger creation.
```

---

### A7. Inventory count is wrong
**Symptom:** Less than 950 items in inventory

**Steps:**
1. Check current count: `SELECT COUNT(*) FROM inventory;`
2. Check which bulk series ran:
   ```sql
   SELECT COUNT(*) FROM inventory WHERE plu LIKE 'BULK-%';
   ```
3. Re-run the bulk inserts from seed.sql manually if count is low

---

### A8. Database disk space full
**Error:** `could not extend file: wrote only X of Y bytes`

**Steps:**
1. Check disk space: `df -h`
2. Clean PostgreSQL WAL logs:
   ```sql
   SELECT pg_size_pretty(pg_database_size('fence_estimator'));
   VACUUM FULL;
   ```
3. Free disk space — delete temporary files
4. Increase disk partition if using VPS

---

### A9. Views return no data
**Symptom:** `v_project_summary` or `v_monthly_revenue` shows empty

**Steps:**
1. Check that projects exist: `SELECT COUNT(*) FROM projects;`
2. For `v_monthly_revenue` — contracts must have status 'signed' or 'complete'
3. Refresh materialized views (if any): `REFRESH MATERIALIZED VIEW ...`

---

### A10. Calculated column markup_pct shows 0
**Error:** Inventory markup shows 0%

**Cause:** `cost_price` is 0 — the generated column divides by cost_price

**Solution:**
```sql
UPDATE inventory SET cost_price = 1.00 WHERE cost_price = 0;
```

---

### A11. Cannot drop column — views depend on it
**Error:** `ERROR: cannot drop column ... because other objects depend on it`

**Solution:**
```sql
DROP VIEW IF EXISTS v_project_summary CASCADE;
DROP VIEW IF EXISTS v_monthly_revenue CASCADE;
-- Make your column change, then re-run schema.sql to recreate views.
```

---

### A12. JSONB line_items data corrupted
**Symptom:** Estimate totals are 0 after saving

**Steps:**
1. Check the raw data:
   ```sql
   SELECT id, line_items FROM estimates WHERE total_amount = 0;
   ```
2. Reset and recalculate:
   ```sql
   SELECT calculate_estimate_totals('ESTIMATE-UUID-HERE');
   ```

---

### A13. Slow queries on large datasets
**Symptom:** Pages take 5+ seconds to load

**Solution:**
```sql
-- Analyze tables to update statistics:
ANALYZE users; ANALYZE projects; ANALYZE estimates; ANALYZE inventory;

-- Verify indexes exist:
\di idx_*
```

---

### A14. Sign-off signature data too large
**Error:** `value too long for type character varying`

**Solution:** The `signature_data` column is TEXT (unlimited). Ensure the frontend is not sending very large base64 images — resize canvas before saving.

---

### A15. Foreign key constraint fails on project delete
**Error:** `violates foreign key constraint`

**Solution:** All child tables use `ON DELETE CASCADE` — the issue is likely that a referenced record doesn't exist. Check:
```sql
SELECT id FROM projects WHERE id = 'YOUR-PROJECT-UUID';
```

---

### A16. Archive procedure fails — notes already exist
**Symptom:** `archive_old_projects()` inserts duplicate archive notes

**Solution:** The procedure checks `WHERE title = 'ARCHIVED'` to skip already-archived projects. If duplicates exist:
```sql
DELETE FROM notes WHERE title = 'ARCHIVED'
AND id NOT IN (SELECT MIN(id) FROM notes WHERE title = 'ARCHIVED' GROUP BY project_id);
```

---

### A17. Cannot connect as non-postgres user
**Error:** `FATAL: role "app_user" does not exist`

**Solution:**
```sql
CREATE USER app_user WITH PASSWORD 'securepassword';
GRANT CONNECT ON DATABASE fence_estimator TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

---

### A18. Migrations run out of order
**Symptom:** Migration 004 fails because column from migration 003 doesn't exist

**Solution:** Always run migrations in order:
```bash
psql -U postgres -d fence_estimator -f database/migrations/001_initial_schema.sql
psql -U postgres -d fence_estimator -f database/migrations/002_seed_data.sql
psql -U postgres -d fence_estimator -f database/migrations/003_add_pricing_lock.sql
psql -U postgres -d fence_estimator -f database/migrations/004_add_crew_assignments.sql
```

---

### A19. Reorder alerts view shows everything
**Symptom:** `v_inventory_reorder_alerts` returns all 950+ items

**Cause:** `reorder_point` is set too high, or `qty_on_hand` was not updated.

**Solution:**
```sql
-- Update realistic quantities:
UPDATE inventory SET qty_on_hand = reorder_point + 50 WHERE qty_on_hand = 0;
```

---

### A20. pgAdmin connection refused
**Error:** pgAdmin can't connect to localhost:5432

**Steps:**
1. Verify PostgreSQL service is running (see A1)
2. Check Windows Firewall — allow port 5432
3. In pgAdmin, create new server:
   - Host: `127.0.0.1` (not `localhost`)
   - Port: `5432`
   - Username: `postgres`

---

## SECTION B: BACKEND ISSUES

### B1. npm install fails
**Error:** `npm ERR! code ENOTFOUND`

**Steps:**
1. Check internet connection
2. Try: `npm install --legacy-peer-deps`
3. Clear cache: `npm cache clean --force` then retry
4. Use different registry: `npm install --registry https://registry.npmjs.org`

---

### B2. Server won't start — port already in use
**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000:
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

---

### B3. JWT_SECRET not set — tokens fail
**Error:** `JsonWebTokenError: invalid signature`

**Solution:**
1. Open `.env` file
2. Set: `JWT_SECRET=your-very-long-random-string-here-at-least-32-chars`
3. Restart the server

---

### B4. CORS error from frontend
**Error:** `Access-Control-Allow-Origin` blocked

**Solution:**
Update `backend/server.js` CORS config:
```javascript
app.use(cors({
  origin: ['http://localhost:3001', 'https://yourdomain.com'],
  credentials: true
}));
```

---

### B5. Cannot read .env file
**Error:** `Error: ENOENT: no such file or directory '.env'`

**Solution:**
```bash
cp .env.example .env
# Then edit .env with your values
```

---

### B6. MongoDB connection fails
**Error:** `MongoServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**Steps:**
1. Start MongoDB: `mongod --dbpath /data/db`
2. Or start service: `net start MongoDB` (Windows)
3. Verify URI: `MONGO_URI=mongodb://localhost:27017/fence-estimator`

---

### B7. bcrypt module fails on Windows
**Error:** `Error: MSBUILD: error MSB3428`

**Solution:**
```bash
npm install --global windows-build-tools
npm install
```
Or use the pre-compiled version: `npm install bcryptjs` (pure JS).

---

### B8. PDF generation fails
**Error:** `Error: Cannot find module 'pdfkit'`

**Solution:**
```bash
cd backend
npm install pdfkit
```

---

### B9. Email sending fails
**Error:** `Error: Invalid login: 535 Authentication credentials invalid`

**Solution:**
1. Use Gmail App Password (not your regular password)
2. Enable 2FA on Gmail
3. Create App Password at: https://myaccount.google.com/apppasswords
4. Set `SMTP_PASS=your-16-char-app-password` in .env

---

### B10. Server crashes on startup — syntax error
**Error:** `SyntaxError: Unexpected token`

**Steps:**
1. Check Node.js version: `node --version` (need 18+)
2. Run: `node --check backend/server.js` to find syntax errors
3. Look at line number in error message

---

### B11. Authentication middleware blocks all requests
**Error:** All API calls return 401 Unauthorized

**Steps:**
1. Check that the login endpoint is NOT protected by auth middleware
2. Verify JWT token is being sent in the Authorization header:
   `Authorization: ******
3. Check token hasn't expired (default: 7 days)

---

### B12. Large file upload fails
**Error:** `PayloadTooLargeError: request entity too large`

**Solution:** The server already sets `limit: '50mb'`. If you need more:
```javascript
app.use(express.json({ limit: '100mb' }));
```

---

### B13. Database query returns empty results
**Symptom:** API returns `[]` but database has data

**Steps:**
1. Check database connection string
2. Verify the query in server.js matches schema column names
3. Add console.log to debug: `console.log('Query result:', result)`
4. Test query directly in psql

---

### B14. Process crashes under load
**Symptom:** Server stops responding after 20+ concurrent users

**Solution:**
1. Install PM2: `npm install -g pm2`
2. Start with cluster mode:
   ```bash
   pm2 start server.js -i max --name fence-estimator
   ```

---

### B15. npm audit shows vulnerabilities
**Symptom:** Security warnings on `npm install`

**Solution:**
```bash
npm audit fix
# For major version updates:
npm audit fix --force
```

---

### B16. Mongoose deprecation warnings
**Error:** `DeprecationWarning: collection.findAndModify is deprecated`

**Solution:** Already handled in server.js with `useNewUrlParser: true` and `useUnifiedTopology: true`. These warnings are informational only.

---

### B17. Server.js is using wrong database
**Symptom:** Changes don't appear in the correct database

**Steps:**
1. Check `.env` DATABASE_URL or MONGO_URI
2. Print the connection string at startup: `console.log('DB:', process.env.DATABASE_URL)`
3. Restart the server after changing .env

---

### B18. Health endpoint not responding
**Error:** `Cannot GET /api/health`

**Solution:** Add health endpoint to server.js:
```javascript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fence Estimator API is running' });
});
```

---

### B19. Sessions not persisting after server restart
**Symptom:** Users are logged out every time server restarts

**Cause:** JWT tokens are stateless — this is normal. Tokens persist in the browser localStorage, not on the server.

**Solution:** No action needed. This is correct behavior.

---

### B20. Cannot find module errors
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
cd backend
rm -rf node_modules
npm install
```

---

### B21–B25. Additional Backend Issues

**B21. API returns HTML instead of JSON**
Set `Accept: application/json` header in all requests.

**B22. Decimal precision issues in cost calculations**
Use `toFixed(2)` and `parseFloat()` when reading/writing cost values.

**B23. Date format mismatch between frontend and backend**
Always use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`

**B24. Rate limiting blocks legitimate requests**
Add IP whitelist to rate limiter config for internal network addresses.

**B25. nodemon not reloading on file changes**
Run `npm install -g nodemon` then `nodemon server.js` instead of `node server.js`.

---

## SECTION C: FRONTEND ISSUES

### C1. Blank white page on load
**Steps:**
1. Open browser DevTools (F12) → Console tab
2. Look for red error messages
3. Common causes:
   - JavaScript syntax error in app.js
   - Missing file reference
   - Network error loading a script

---

### C2. Login screen doesn't go away after correct credentials
**Symptom:** Typing admin/admin123 does nothing

**Steps:**
1. Open DevTools Console — look for errors
2. Check that `loginForm` form has `onsubmit="app.login(event)"`
3. Verify app.js is loaded: `typeof app` in console should return `object`

---

### C3. Tabs don't switch when clicking
**Symptom:** Clicking sidebar items doesn't change content

**Steps:**
1. Check browser console for errors
2. Verify `onclick="app.switchTab('...')"` attributes are correct
3. Check that tab IDs match: `tab-dashboard`, `tab-projects`, etc.

---

### C4. Charts don't appear in Analytics tab
**Symptom:** Analytics tab shows blank area

**Steps:**
1. Check if Chart.js is loaded: `typeof Chart` in console → should be `function`
2. If not loaded, add CDN fallback to index.html:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
   ```
3. Check that canvas elements exist: `document.getElementById('revenueChart')`

---

### C5. Data disappears after page refresh
**Symptom:** Estimates, notes, etc. are gone after refreshing

**Cause:** This is normal behavior if the app is running in offline/demo mode using localStorage and you cleared browser data.

**Solution:**
1. Do NOT clear browser data/cache
2. Use the **Settings → Export Data** button to backup before clearing
3. Connect to the backend API for persistent storage

---

### C6. Drawing canvas is not responding to mouse
**Steps:**
1. Verify canvas element exists: `document.getElementById('drawingCanvas')`
2. Check that drawing.js loaded: `typeof app.drawing.setTool` should be `function`
3. Try switching tools using toolbar buttons
4. Check browser console for errors

---

### C7. Print button opens blank page
**Steps:**
1. Ensure the tab has content before printing
2. Check browser popup blocker — allow popups from localhost
3. Try: `window.print()` in browser console directly

---

### C8. Form inputs not saving
**Symptom:** Values typed in forms disappear

**Cause:** Forms need explicit save buttons — the app doesn't auto-save field values.

**Solution:** Click the **Save** button for each section after entering data.

---

### C9. Modal won't close
**Steps:**
1. Click the ✕ button in the top-right of the modal
2. Click outside the modal (on the dark overlay)
3. Press Escape key (if implemented)
4. In console: `app.closeModal()`

---

### C10. Estimate wizard steps are out of order
**Symptom:** Clicking Next jumps to wrong step

**Steps:**
1. Clear browser cache (Ctrl+F5)
2. Check that `estimateStep` variable is resetting properly
3. Call `app.resetEstimateWizard()` from console

---

### C11. Inventory search not filtering
**Symptom:** Typing in search box doesn't filter results

**Steps:**
1. Verify `oninput="app.filterInventory(this.value)"` on the search input
2. Check inventory table is populated: `state.inventory.length` in console
3. Verify `inventoryTabFilter` function is defined

---

### C12. Map doesn't load
**Symptom:** Map Tool shows placeholder, not an actual map

**Note:** The map uses Google Maps embed. This requires:
1. A valid address typed in the search box
2. Internet connection
3. Google Maps not blocked by browser security settings (HTTPS required in production)

---

### C13. Font/styling looks broken
**Symptom:** App looks unstyled or text is misaligned

**Steps:**
1. Verify `frontend/css/styles.css` is in the correct location
2. Check the `<link>` tag in index.html points to `css/styles.css`
3. Open DevTools → Network → verify styles.css returns 200

---

### C14. Responsive layout broken on mobile
**Symptom:** Sidebar overlaps content on small screen

**Note:** On screens < 768px, sidebar collapses to icon-only mode. This is expected behavior. Check CSS media query.

---

### C15. Analytics charts not rendering on first tab visit
**Symptom:** Charts appear blank, then work after switching away and back

**Solution:** Charts render only after the Canvas is visible. The `analyticsTabRefresh()` function handles this. Try:
```javascript
analyticsTabRefresh();
```
in the console while the Analytics tab is active.

---

### C16. Export button downloads empty file
**Symptom:** Exported JSON is `{}`

**Cause:** No data has been created yet.

**Solution:** Create at least one estimate before exporting. The export includes all localStorage state.

---

### C17. Import fails with "Invalid JSON"
**Steps:**
1. Ensure the file was exported by this app (or is valid JSON)
2. Validate the JSON at: https://jsonlint.com
3. Ensure file extension is `.json`

---

### C18. Sign-off form shows no projects
**Symptom:** "Select a project" dropdown is empty

**Solution:** Create and save an estimate first. The dropdown pulls from saved estimates.

---

### C19. Change orders form shows no projects
**Same as C18** — create estimates first.

---

### C20. Toast notifications not appearing
**Steps:**
1. Check `toastContainer` div exists in HTML
2. Verify `app.toast()` is defined in app.js
3. Check CSS for `.toast` and `.toast-container` classes

---

### C21–C30. Additional Frontend Issues

**C21. Settings not saving after page reload**
Settings are saved to localStorage. Clearing browser data loses settings. Use Export button to backup.

**C22. Browser back button breaks app navigation**
This is a Single-Page App — use the sidebar tabs, not browser back/forward.

**C23. Decimal inputs not accepting fractions**
Use `step="0.01"` on number inputs. Already set in most fields.

**C24. Required field asterisk (*) missing after label**
Labels with `*` are marked in the HTML. This is visual only — validation runs on form submit.

**C25. Date picker not showing calendar**
Use `type="date"` input — calendar appears in all modern browsers (Chrome, Firefox, Edge).

**C26. Currency values showing too many decimals**
Use `.toFixed(2)` when displaying values. Already implemented in most places.

**C27. Tab panel content loads slowly on first click**
First load initializes data. Subsequent visits are instant from localStorage.

**C28. Print styles cutting off content**
Add `page-break-inside: avoid` to cards in print CSS.

**C29. App works in Chrome but not in Internet Explorer**
IE is not supported. Use Chrome, Firefox, Edge, or Safari.

**C30. Estimate number sequence resets**
Estimate numbers are based on localStorage count. Importing data restores the correct sequence.

---

## SECTION D: SECURITY ISSUES

### D1. Default credentials left in production
**URGENT — Action Required:**
```sql
-- Delete demo users:
DELETE FROM users WHERE username IN ('admin','estimator','crew1');

-- Create your real admin:
INSERT INTO users (username, email, password_hash, role, company)
VALUES ('youradmin', 'admin@yourcompany.com', 'BCRYPT_HASH', 'admin', 'Your Company');
```

---

### D2. JWT_SECRET is default value
**URGENT:** Change in .env before going live:
```env
JWT_SECRET=xK9$mP2#qL7@nR5&vB8!tW3^uY6*cH4+eA1
```

---

### D3. HTTP (not HTTPS) in production
**Risk:** Credentials transmitted in plain text

**Solution:**
1. Get SSL certificate (Let's Encrypt is free)
2. Configure nginx or Apache with SSL
3. Redirect HTTP to HTTPS

---

### D4. SQL injection risk
The app uses parameterized queries. If you add custom queries, ALWAYS use:
```javascript
// Safe:
db.query('SELECT * FROM users WHERE id = $1', [userId])

// UNSAFE — never do this:
db.query(`SELECT * FROM users WHERE id = '${userId}'`)
```

---

### D5. XSS in note/description fields
**Risk:** User-entered HTML could execute scripts

**Solution:** The app renders data as text, not HTML. Avoid using `innerHTML` with user data. Use `textContent` instead.

---

### D6. Exposed database port
**Risk:** Port 5432 accessible from internet

**Solution:**
```bash
# Block external access:
# Windows Firewall: Block inbound on port 5432 except localhost
# Linux iptables:
iptables -A INPUT -p tcp --dport 5432 -s 127.0.0.1 -j ACCEPT
iptables -A INPUT -p tcp --dport 5432 -j DROP
```

---

### D7. API keys in frontend code
**Risk:** Any keys in frontend JavaScript are visible to all users

**Solution:** Never put API keys, database passwords, or secrets in frontend JS files. Keep them in `.env` and access via backend API only.

---

### D8. Bcrypt cost factor too low
**Risk:** Passwords easier to crack

**Solution:** Use cost factor 12+ for production:
```javascript
const hash = await bcrypt.hash(password, 12);
```

---

### D9. CORS too permissive
**Risk:** Any website can make API calls

**Solution:**
```javascript
app.use(cors({
  origin: 'https://yourdomain.com'  // Not '*'
}));
```

---

### D10. Session tokens stored in localStorage
**Risk:** XSS can steal tokens from localStorage

**Consideration:** The current implementation stores JWT in localStorage for simplicity. For higher security, use HttpOnly cookies in production.

---

### D11–D15. Additional Security Issues

**D11.** Rate limiting: Add `express-rate-limit` to prevent brute-force login attacks.
**D12.** Input validation: Use `express-validator` for server-side validation of all API inputs.
**D13.** File upload security: Validate file types and sizes — never execute uploaded files.
**D14.** Error messages: Don't expose stack traces to users in production. Set `NODE_ENV=production`.
**D15.** Dependency updates: Run `npm audit` monthly and update vulnerable packages.

---

## SECTION E: PERFORMANCE ISSUES

### E1. App loads slowly on first visit
**Steps:**
1. Minify CSS and JS for production
2. Enable gzip compression in Express:
   ```bash
   npm install compression
   ```
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```
3. Add browser caching headers

---

### E2. Inventory table slow with 950+ items
**Solution:** Implement virtual scrolling or pagination:
```javascript
// Show 50 items at a time
const ITEMS_PER_PAGE = 50;
```

---

### E3. Analytics charts render slowly
**Solution:**
1. Cache data before rendering
2. Reduce dataset size for initial render
3. Use `requestAnimationFrame` for chart updates

---

### E4. Database queries slow
**Solution:**
```sql
-- Check slow queries:
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Run EXPLAIN ANALYZE on slow queries:
EXPLAIN ANALYZE SELECT * FROM inventory WHERE department = 'Chain Link';
```

---

### E5. Memory usage grows over time
**Solution:**
1. Check for memory leaks in event listeners
2. Use PM2 with auto-restart on memory limit:
   ```bash
   pm2 start server.js --max-memory-restart 500M
   ```

---

### E6–E20. Additional Performance Tips

**E6.** Use connection pooling for PostgreSQL (`pg.Pool` instead of single connection).
**E7.** Index frequently queried columns — already done in schema.sql.
**E8.** Cache static assets with long Cache-Control headers.
**E9.** Lazy-load analytics charts — only render when tab is visible.
**E10.** Paginate API results — add `?page=1&limit=50` to all list endpoints.
**E11.** Compress images before storing in database.
**E12.** Use CDN for frontend static files in production.
**E13.** Enable PostgreSQL `shared_buffers` = 25% of RAM.
**E14.** Use `EXPLAIN ANALYZE` to identify missing indexes.
**E15.** Archive old completed projects after 2 years (see maintenance.sql).
**E16.** Limit JSONB column size for line_items — cap at 200 line items per estimate.
**E17.** Use server-sent events or WebSockets instead of polling for real-time updates.
**E18.** Minify JavaScript before production deployment.
**E19.** Remove unused JavaScript libraries — check bundle size.
**E20.** Enable PostgreSQL auto-vacuum to keep table statistics current.

---

## ERROR CODE REFERENCE

| Error Code | Meaning | Quick Fix |
|-----------|---------|-----------|
| `ECONNREFUSED` | Server not running | Start the service |
| `EADDRINUSE` | Port in use | Kill process on port |
| `401 Unauthorized` | Bad/missing JWT token | Re-login |
| `403 Forbidden` | Insufficient permissions | Check user role |
| `404 Not Found` | Route doesn't exist | Check API URL |
| `422 Unprocessable` | Validation failed | Check required fields |
| `500 Internal Error` | Server crash | Check server logs |
| `ENOTFOUND` | DNS resolution failed | Check internet/hostname |
| `duplicate key` | Record already exists | Use ON CONFLICT |
| `foreign key` | Referenced record missing | Create parent first |

---

## WHERE TO FIND LOG FILES

**Backend logs:**
```bash
# With PM2:
pm2 logs fence-estimator

# Direct Node:
node backend/server.js 2>&1 | tee server.log
```

**PostgreSQL logs:**
```
# Windows: C:\Program Files\PostgreSQL\14\data\log\
# Linux: /var/log/postgresql/
# Mac: /usr/local/var/log/postgresql/
```

**Browser logs:**
Press `F12` → Console tab

---

*Guide covers 110+ solutions. For additional help, open a GitHub Issue at https://github.com/Auction2026/fence-estimator/issues*
