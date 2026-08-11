# PART 5 — TROUBLESHOOTING GUIDE
## Fence Depot Estimator — 110+ Issues with Complete Solutions

---

## HOW TO USE THIS GUIDE

1. Find your issue category (Database, Backend, Frontend, etc.)
2. Look for your specific error message or symptom
3. Follow the numbered steps exactly
4. If still stuck, check the bottom of this guide for support contacts

---

# SECTION 1 — DATABASE ISSUES (20+ Solutions)

## DB-001: Cannot connect to PostgreSQL

**Error:** `ECONNREFUSED 127.0.0.1:5432` or `connection refused`

**Solution:**
1. Check if PostgreSQL is running:
   - Windows: Open Services → Look for "postgresql-x64-16" → Start it
   - Mac: `brew services restart postgresql@16`
   - Linux: `sudo systemctl restart postgresql`
2. Verify port: `netstat -an | grep 5432`
3. Check `.env` file: `DB_HOST=localhost` and `DB_PORT=5432`

---

## DB-002: Wrong password for database

**Error:** `password authentication failed for user "fence_user"`

**Solution:**
1. Open pgAdmin
2. Right-click the user → Properties → Change password
3. Update `DB_PASSWORD` in your `.env` file
4. Restart the backend server

---

## DB-003: Database does not exist

**Error:** `database "fence_estimator" does not exist`

**Solution:**
```sql
-- Run in pgAdmin or psql as postgres user:
CREATE DATABASE fence_estimator;
GRANT ALL PRIVILEGES ON DATABASE fence_estimator TO fence_user;
```

---

## DB-004: Schema file fails to run

**Error:** `ERROR: relation already exists` or `ERROR: syntax error`

**Solution:**
1. The schema was already run. Check if tables exist:
   ```sql
   SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
   ```
2. If tables exist, skip `schema.sql` — run only migrations and seed

---

## DB-005: Seed data fails with duplicate key

**Error:** `ERROR: duplicate key value violates unique constraint "inventory_plu_key"`

**Solution:**
```sql
-- Clear existing inventory and re-seed:
TRUNCATE TABLE inventory RESTART IDENTITY CASCADE;
```
Then re-run `seed.sql`

---

## DB-006: Seed ran but inventory is empty

**Error:** `SELECT COUNT(*) FROM inventory;` returns 0

**Solution:**
1. Verify you're connected to the right database
2. Re-run: `psql -U fence_user -d fence_estimator -f database/seed.sql`
3. Check for SQL errors in the seed file output

---

## DB-007: UUID extension not found

**Error:** `ERROR: could not open extension control file "uuid-ossp"`

**Solution:**
```sql
-- Run as postgres superuser:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
Or use PostgreSQL 13+ where `gen_random_uuid()` is built-in (update schema to use it)

---

## DB-008: Permission denied on tables

**Error:** `ERROR: permission denied for table estimates`

**Solution:**
```sql
-- Run as postgres user:
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fence_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fence_user;
```

---

## DB-009: Too many connections

**Error:** `FATAL: sorry, too many clients already`

**Solution:**
1. Increase max connections in `postgresql.conf`:
   ```
   max_connections = 200
   ```
2. Restart PostgreSQL
3. Or add a connection pooler (PgBouncer) for production

---

## DB-010: Disk full — database won't start

**Solution:**
1. Free disk space (remove old log files, temp files)
2. Linux: `du -sh /var/lib/postgresql/` to find size
3. Archive old audit logs: Run `purge_old_audit_log(30)` procedure
4. Consider moving database to larger drive

---

## DB-011: Slow queries on large datasets

**Solution:**
1. Run maintenance: `VACUUM ANALYZE;`
2. Check for missing indexes: `EXPLAIN ANALYZE SELECT ...`
3. Run Migration 002 to add performance indexes
4. Consider partitioning `audit_log` by month for very large datasets

---

## DB-012: Backup fails

**Solution:**
```bash
# Manual backup command:
pg_dump -U fence_user -d fence_estimator -F c -f backup_$(date +%Y%m%d).dump

# Restore:
pg_restore -U fence_user -d fence_estimator backup_20260101.dump
```

---

## DB-013: pgAdmin won't connect

**Solution:**
1. Make sure PostgreSQL service is running
2. In pgAdmin: Right-click Servers → Register → Server
3. Host: `localhost`, Port: `5432`, Username: `postgres`, Password: your postgres password
4. If on WSL (Windows): Use `127.0.0.1` not `localhost`

---

## DB-014: Migration 003 fails with constraint error

**Error:** Existing data violates new constraints

**Solution:**
```sql
-- Find violations first:
SELECT COUNT(*) FROM estimates WHERE total < 0;
SELECT COUNT(*) FROM inventory WHERE cost < 0;

-- Fix violations, then re-run migration
UPDATE estimates SET total = 0 WHERE total < 0;
```

---

## DB-015: Cannot create user with role

**Error:** `ERROR: permission denied to create role`

**Solution:**
Connect as `postgres` superuser:
```bash
psql -U postgres
CREATE USER fence_user WITH ENCRYPTED PASSWORD 'password';
```

---

## DB-016: Foreign key constraint violation

**Error:** `ERROR: insert or update on table violates foreign key constraint`

**Solution:**
1. Make sure the referenced record exists first
2. Example: Create customer before creating project
3. Check the order of your INSERT statements

---

## DB-017: Transaction isolation errors

**Error:** `ERROR: could not serialize access due to concurrent update`

**Solution:**
1. Add retry logic in the backend for serialization errors
2. Reduce transaction isolation level for non-critical reads:
   ```sql
   SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
   ```

---

## DB-018: PostgreSQL won't start after Windows update

**Solution:**
1. Open Services (Win+R → `services.msc`)
2. Find `postgresql-x64-16`
3. Right-click → Start
4. If "Access Denied": Right-click → Properties → Log On tab → change to Local System account

---

## DB-019: Data corruption after power loss

**Solution:**
1. Check PostgreSQL logs: `C:\Program Files\PostgreSQL\16\data\log\`
2. Run: `psql -U postgres -c "CHECKPOINT;"`
3. Restore from last backup if corruption is detected

---

## DB-020: Cannot drop database (in use)

**Solution:**
```sql
-- Terminate all connections first:
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'fence_estimator' AND pid <> pg_backend_pid();

DROP DATABASE fence_estimator;
```

---

# SECTION 2 — BACKEND SERVER ISSUES (25+ Solutions)

## BE-001: Server won't start

**Error:** `Error: Cannot find module 'express'`

**Solution:**
```bash
cd backend
npm install
npm start
```

---

## BE-002: Port already in use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
- Windows: `netstat -ano | findstr :3000` → find PID → `taskkill /PID <pid> /F`
- Mac/Linux: `lsof -ti:3000 | xargs kill -9`
- Or change port in `.env`: `PORT=3001`

---

## BE-003: JWT token errors

**Error:** `JsonWebTokenError: invalid signature` or `TokenExpiredError`

**Solution:**
1. Make sure `JWT_SECRET` in `.env` is at least 32 random characters
2. Don't reuse secrets between environments
3. Token expired: User needs to log in again (expected behavior)

---

## BE-004: CORS errors in browser

**Error:** `Access to fetch at 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
In `backend/server.js`, verify cors is configured:
```javascript
app.use(cors({
    origin: ['http://localhost:3000', 'https://yourproductiondomain.com'],
    credentials: true
}));
```

---

## BE-005: Cannot send email (estimates)

**Error:** `Error: connect ECONNREFUSED` on email send

**Solution:**
1. Check email settings in `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=yourmail@gmail.com
   SMTP_PASS=your_app_password
   ```
2. Gmail: Use App Password (not your regular password)
   - Google Account → Security → 2-Step Verification → App Passwords

---

## BE-006: PDF generation fails

**Error:** `Error: Cannot read property of undefined` in PDF route

**Solution:**
1. `npm install pdfkit` if not installed
2. Check estimate ID exists before generating
3. Check disk space (PDFs are written to temp folder)

---

## BE-007: Server crashes with uncaught exception

**Solution:**
1. Check logs: `pm2 logs fence-estimator`
2. Add error handler to `server.js`:
   ```javascript
   process.on('uncaughtException', (err) => console.error('Uncaught:', err));
   ```
3. Use PM2 for automatic restart: `pm2 start server.js`

---

## BE-008: .env file not being read

**Error:** Variables showing as `undefined`

**Solution:**
1. Make sure `dotenv` is installed: `npm install dotenv`
2. Make sure `.env` is in the `backend/` folder (not the root)
3. Verify file is named `.env` (not `.env.txt` or `env`)
4. Windows: Enable "Show file extensions" in File Explorer

---

## BE-009: 404 on all API routes

**Solution:**
1. Check you're sending requests to the right port
2. Routes must be registered in `server.js`
3. Test with: `curl http://localhost:3000/api/health`

---

## BE-010: bcrypt errors on login

**Error:** `Error: data and hash arguments required`

**Solution:**
1. Make sure `bcryptjs` is installed: `npm install bcryptjs`
2. Ensure password in database is actually a bcrypt hash (starts with `$2b$`)
3. Re-hash the password:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hash = await bcrypt.hash('NewPassword123!', 10);
   ```

---

## BE-011: Mongoose/MongoDB connection error

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Note:** This project uses PostgreSQL only — MongoDB is not supported.
If you see this error, a stale `mongoose` dependency is present:
1. Remove it: `npm uninstall mongoose`
2. Make sure `backend/server.js` uses `pg` (node-postgres) for all database calls
3. Verify your `.env` has PostgreSQL settings (`DB_HOST`, `DB_PORT`, etc.), not a MongoDB connection string

---

## BE-012: Memory leak / server slowing down

**Solution:**
1. Check for unresolved promises: add `await` to all async calls
2. Check database connection pool isn't exhausted
3. Restart server nightly with PM2 cron: `pm2 restart fence-estimator --cron "0 3 * * *"`

---

## BE-013: Cannot read CSV/Excel uploads

**Solution:**
1. Install multer: `npm install multer`
2. Install xlsx parser: `npm install xlsx`
3. Check file upload size limit in server.js (default 1MB; increase to 10MB)

---

## BE-014: Rate limiting blocking users

**Error:** `429 Too Many Requests`

**Solution:**
In `server.js`, adjust rate limiter:
```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 200                     // increase from 100
});
```

---

## BE-015: Server works locally but not on VPS

**Solution:**
1. Check firewall: `sudo ufw allow 3000`
2. Check Nginx config if using reverse proxy
3. Ensure `.env` is on the server (never commit it to GitHub)
4. Run `npm install --production` on server

---

## BE-016: Session not persisting after server restart

**Solution:**
1. Implement JWT (stateless) — already in server.js
2. Or use Redis for session storage: `npm install connect-redis redis`

---

## BE-017: nodemon not found

**Error:** `nodemon: command not found`

**Solution:**
```bash
npm install -g nodemon
# or use npm run dev which uses local nodemon
```

---

## BE-018: SSL/HTTPS certificate errors

**Solution:**
For development: Use HTTP (`localhost`)
For production:
1. Use Let's Encrypt (free): `sudo certbot --nginx -d yourdomain.com`
2. Or use Cloudflare proxy (free SSL)

---

## BE-019: Cannot parse large JSON body

**Error:** `PayloadTooLargeError: request entity too large`

**Solution:**
In `server.js`:
```javascript
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
```

---

## BE-020: Database pool exhausted

**Error:** `Error: timeout expired` from `pg` pool

**Solution:**
Increase pool size in database config:
```javascript
const pool = new Pool({
    max: 20,          // increase from 10
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});
```

---

## BE-021: Tests failing (jest)

**Solution:**
```bash
cd backend
npm test
```
If tests fail after code changes, check:
1. Database is running and has test data
2. `.env` has `NODE_ENV=test`
3. Run `npm run seed-test` if test seeder exists

---

## BE-022: EACCES permission denied on port 80

**Solution:**
- Don't run Node on port 80 directly
- Use Nginx reverse proxy listening on 80 → forward to 3000
- Or: `sudo setcap 'cap_net_bind_service=+ep' $(which node)`

---

## BE-023: Cannot find module after pulling from GitHub

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

---

## BE-024: Environment variables not loading in production

**Solution:**
1. Never commit `.env` to GitHub
2. Set environment variables directly:
   - Railway: Dashboard → Variables
   - Heroku: `heroku config:set KEY=value`
   - Linux: `export KEY=value` or use `.profile`

---

## BE-025: Cannot generate estimate number (sequence)

**Solution:**
```sql
-- Reset the sequence:
SELECT setval('your_sequence_name', 1, false);
-- Or use the recovery procedure:
CALL reset_estimate_sequence(2026);
```

---

# SECTION 3 — FRONTEND ISSUES (30+ Solutions)

## FE-001: Blank white page

**Solution:**
1. Open browser DevTools (F12) → Console tab — check for errors
2. Make sure `index.html` is the file you're opening (not a folder)
3. Check that the `<script>` tags at the bottom of `index.html` have no typos

---

## FE-002: Tab not switching

**Solution:**
1. Open DevTools → Console — look for JavaScript errors
2. Check `switchTab()` function is defined
3. Make sure tab IDs match (e.g., `id="dashboard-tab"`)

---

## FE-003: Estimate total not calculating

**Solution:**
1. Check that `calculateTotal()` function is in the script section
2. Make sure all input fields have the correct `id` attributes
3. Check for NaN: `if (isNaN(value)) value = 0;`

---

## FE-004: Form not saving data

**Solution:**
The frontend uses `localStorage`. Check:
1. Browser storage is not full: DevTools → Application → Local Storage
2. `localStorage.setItem()` is being called on form submit
3. Private/Incognito mode disables localStorage in some browsers

---

## FE-005: PDF won't download (frontend only mode)

**Note:** PDF generation requires the backend server.
**Solution (frontend-only workaround):**
1. Use browser Print → Save as PDF
2. Or integrate a JS PDF library: `npm install jspdf`

---

## FE-006: Mobile display broken

**Solution:**
1. Check `<meta name="viewport" content="width=device-width, initial-scale=1.0">` is in `<head>`
2. Add responsive CSS:
   ```css
   @media (max-width: 768px) { .tab-navigation { flex-direction: column; } }
   ```

---

## FE-007: Google Maps not loading

**Solution:**
1. You need a Google Maps API key
2. Go to **https://console.cloud.google.com**
3. Enable Maps JavaScript API
4. Create API key → restrict to your domain
5. Replace `YOUR_API_KEY` in index.html

---

## FE-008: Colors/fonts not loading (custom styles)

**Solution:**
1. Check CSS file path is correct in `<link>` tag
2. If using external fonts (Google Fonts), you need internet connection
3. Add a fallback font: `font-family: 'Segoe UI', Arial, sans-serif;`

---

## FE-009: Data lost after refreshing page

**Solution:**
1. Frontend uses `localStorage` — data persists across refreshes
2. Check `saveToLocalStorage()` is called when data changes
3. For permanent storage, connect to the backend API

---

## FE-010: Inventory search not working

**Solution:**
1. Check `INVENTORY_DB` array is defined
2. Verify `filterInventory()` function filters correctly:
   ```javascript
   return item.name.toLowerCase().includes(query.toLowerCase());
   ```

---

## FE-011: Print layout is wrong

**Solution:**
1. Add print-specific CSS:
   ```css
   @media print {
       .tab-navigation { display: none; }
       .no-print { display: none; }
   }
   ```
2. Use browser's Print Preview to test

---

## FE-012: Estimate wizard stuck on step 1

**Solution:**
1. Check `nextStep()` function is defined
2. Check `currentStep` variable is declared globally
3. Check `step1`, `step2`, etc. IDs exist in HTML

---

## FE-013: Currency formatting is wrong

**Solution:**
Use the Intl API:
```javascript
const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD'
}).format(amount);
```

---

## FE-014: Date picker not working

**Solution:**
1. Use HTML5 input type: `<input type="date">`
2. For custom date picker, add a library: `flatpickr`

---

## FE-015: Canvas drawing tools not working

**Solution:**
1. Check browser supports HTML5 Canvas: `if (!canvas.getContext) return;`
2. Make sure canvas width/height are set
3. Check mouse event coordinates are correctly calculated

---

## FE-016: Export to Excel not working

**Solution:**
1. Add SheetJS library: `<script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>`
2. Create workbook:
   ```javascript
   const wb = XLSX.utils.book_new();
   XLSX.writeFile(wb, 'estimate.xlsx');
   ```

---

## FE-017: Browser says "unsafe script"

**Solution:**
1. Serve files via a local server, not by double-clicking the HTML file
2. Use VS Code Live Server extension
3. Or: `npx serve .` from the project root

---

## FE-018: Dropdown not populating

**Solution:**
1. Check the array feeding the dropdown is not empty
2. Check the `<select id="...">` ID matches what JavaScript targets
3. Check for typos in option values

---

## FE-019: Modal not closing

**Solution:**
1. Check `closeModal()` function is defined
2. Add click outside to close:
   ```javascript
   window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };
   ```

---

## FE-020: Form validation not working

**Solution:**
```javascript
function validateForm() {
    const required = document.querySelectorAll('[required]');
    for (let field of required) {
        if (!field.value.trim()) {
            field.focus();
            alert('Please fill in all required fields');
            return false;
        }
    }
    return true;
}
```

---

## FE-021: Table sorting not working

**Solution:**
Add a sort function:
```javascript
function sortTable(colIndex) {
    const table = document.getElementById('myTable');
    const rows = Array.from(table.rows).slice(1);
    rows.sort((a, b) => a.cells[colIndex].textContent.localeCompare(b.cells[colIndex].textContent));
    rows.forEach(row => table.appendChild(row));
}
```

---

## FE-022: Search results showing wrong items

**Solution:**
1. Make sure search is comparing lowercase: `.toLowerCase()`
2. Clear previous search results before showing new ones
3. Check that search is filtering the correct array/dataset

---

## FE-023: Autocomplete suggestions not appearing

**Solution:**
1. Make sure input has an event listener: `input.addEventListener('input', showSuggestions)`
2. Check the suggestion list `<div>` is positioned absolutely
3. Check z-index: `z-index: 1000`

---

## FE-024: Number inputs accepting letters

**Solution:**
```html
<input type="number" min="0" step="0.01" oninput="this.value = this.value.replace(/[^0-9.]/g, '')">
```

---

## FE-025: Dashboard stats not updating

**Solution:**
1. Call the stats update function after any data change
2. Pull live stats from the backend: `fetch('/api/dashboard/stats')`
3. Set an auto-refresh interval: `setInterval(loadStats, 60000)`

---

## FE-026: Signature pad not working

**Solution:**
1. Use `signature_pad` library: `npm install signature_pad`
2. Initialize: `const pad = new SignaturePad(canvas);`
3. Get data: `pad.toDataURL('image/png')`

---

## FE-027: Tab content not visible

**Solution:**
1. Ensure only the active tab has `display: block` — others have `display: none`
2. Check CSS isn't overriding with `!important`

---

## FE-028: Icons not showing

**Solution:**
1. If using emoji icons, they work on all modern browsers
2. If using Font Awesome: add CDN link in `<head>`:
   ```html
   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
   ```

---

## FE-029: Data not syncing to backend

**Solution:**
1. Check backend is running: `curl http://localhost:3000/api/health`
2. Check CORS is configured for your frontend URL
3. Check the fetch URL matches the backend route

---

## FE-030: Analytics chart not rendering

**Solution:**
1. Add Chart.js: `<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>`
2. Canvas must have explicit width/height
3. Data array must not be empty

---

# SECTION 4 — SECURITY ISSUES (15+ Solutions)

## SEC-001: SQL injection vulnerability

**Solution:**
Always use parameterized queries — NEVER string concatenation:
```javascript
// WRONG: db.query(`SELECT * FROM users WHERE id = ${id}`)
// RIGHT:
db.query('SELECT * FROM users WHERE id = $1', [id])
```

---

## SEC-002: XSS (cross-site scripting) attack

**Solution:**
Never insert raw user input into HTML:
```javascript
// WRONG: div.innerHTML = userInput
// RIGHT:
div.textContent = userInput
// Or sanitize: DOMPurify.sanitize(userInput)
```

---

## SEC-003: Exposed secrets in GitHub

**Solution:**
1. Add `.env` to `.gitignore` immediately
2. Rotate all exposed credentials
3. Use GitHub's Secret Scanning to detect future leaks
4. Check: `git log --all -- .env` to see if it was ever committed

---

## SEC-004: Weak passwords

**Solution:**
1. Enforce minimum password requirements in validation
2. Use bcrypt with work factor ≥ 10: `bcrypt.hash(password, 10)`
3. Add account lockout after 5 failed attempts

---

## SEC-005: Insecure JWT token storage

**Solution:**
- Store JWTs in `httpOnly` cookies (not localStorage)
- Set `Secure` and `SameSite=Strict` cookie flags
- Short expiry (e.g., 1 hour) + refresh tokens

---

## SEC-006: No HTTPS in production

**Solution:**
1. Get a free SSL certificate with Let's Encrypt
2. Force HTTPS redirect in Nginx:
   ```nginx
   return 301 https://$host$request_uri;
   ```

---

## SEC-007: API rate limiting not configured

**Solution:**
```javascript
const rateLimit = require('express-rate-limit');
app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));
```

---

## SEC-008: Directory traversal attack

**Solution:**
Never use user input directly in file paths:
```javascript
// Use path.resolve + check it stays in allowed directory
const safePath = path.resolve('./uploads', path.basename(userInput));
```

---

## SEC-009: Default admin credentials not changed

**Solution:**
1. Change admin email and password before going live
2. Remove the default seed user and create a new one
3. Add a "first run" setup wizard that forces password change

---

## SEC-010: Insecure direct object references

**Solution:**
Always verify the requesting user owns the resource:
```javascript
// Always check ownership:
const project = await db.query(
    'SELECT * FROM projects WHERE id = $1 AND created_by = $2',
    [projectId, req.user.id]
);
```

---

## SEC-011: Missing authentication on API routes

**Solution:**
Add auth middleware to all protected routes:
```javascript
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    // verify token...
    next();
};
app.use('/api/estimates', authMiddleware);
```

---

## SEC-012: Sensitive data in logs

**Solution:**
Never log passwords, credit cards, or PII:
```javascript
// WRONG: console.log('User login:', { email, password })
// RIGHT: console.log('User login attempt:', { email })
```

---

## SEC-013: Outdated dependencies with vulnerabilities

**Solution:**
```bash
cd backend
npm audit
npm audit fix
```

---

## SEC-014: Open redirect vulnerability

**Solution:**
Validate redirect URLs:
```javascript
const allowedDomains = ['localhost:3000', 'yourdomain.com'];
const redirectTo = new URL(req.query.redirect);
if (!allowedDomains.includes(redirectTo.host)) {
    return res.status(400).send('Invalid redirect');
}
```

---

## SEC-015: Missing security headers

**Solution:**
Add Helmet.js:
```bash
npm install helmet
```
```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

# SECTION 5 — PERFORMANCE ISSUES (20+ Solutions)

## PERF-001: Page loads slowly

**Solution:**
1. Minify CSS and JS (use build tool or online minifier)
2. Lazy load images: `<img loading="lazy">`
3. Remove unused inventory items from the JS array in index.html
4. Enable gzip compression in Nginx

---

## PERF-002: Database queries are slow

**Solution:**
1. Run `EXPLAIN ANALYZE` on slow queries
2. Add indexes (run Migration 002)
3. Avoid `SELECT *` — select only needed columns
4. Paginate large result sets: `LIMIT 50 OFFSET 0`

---

## PERF-003: PDF generation takes too long

**Solution:**
1. Generate PDFs asynchronously
2. Cache generated PDFs for 24 hours
3. Use a lighter PDF library or pre-built templates

---

## PERF-004: Too much data in localStorage

**Solution:**
localStorage limit is ~5MB. For large projects:
1. Compress data before storing: `JSON.stringify()` then `btoa()`
2. Clear old estimates from localStorage
3. Move to backend API storage

---

## PERF-005: Memory usage growing over time (backend)

**Solution:**
1. Check for memory leaks: `node --inspect server.js` → Chrome DevTools → Memory
2. Make sure database connections are closed/returned to pool
3. Use PM2 with memory limit: `pm2 start server.js --max-memory-restart 512M`

---

## PERF-006: API response time > 2 seconds

**Solution:**
1. Add database indexes
2. Cache common queries (Redis)
3. Reduce payload size — don't return full objects when IDs suffice
4. Use database connection pooling

---

## PERF-007: Browser tab crashing (too much data)

**Solution:**
1. Paginate the inventory display (show 50 at a time)
2. Use virtual scrolling for long lists
3. Don't load all 950+ products into DOM at once

---

## PERF-008: Images loading slowly

**Solution:**
1. Compress images (use TinyPNG)
2. Use WebP format instead of JPEG/PNG
3. Use a CDN for images in production

---

## PERF-009: Server response time high under load

**Solution:**
1. Use PM2 cluster mode: `pm2 start server.js -i max`
2. Add caching layer (Redis)
3. Use a load balancer (Nginx upstream)

---

## PERF-010: Database connection leak

**Solution:**
Always release connections after use:
```javascript
const client = await pool.connect();
try {
    await client.query('...');
} finally {
    client.release();  // Always release!
}
```

---

## PERF-011: Estimate PDF is too large

**Solution:**
1. Reduce image quality in the PDF generator
2. Use vector graphics (SVG) instead of raster images
3. Split very large estimates into multiple pages

---

## PERF-012: Slow inventory search

**Solution:**
1. Pre-index the inventory array on page load
2. Use a binary search or hash map for PLU lookups:
   ```javascript
   const inventoryByPLU = Object.fromEntries(INVENTORY_DB.map(i => [i.plu, i]));
   ```

---

## PERF-013: Too many API calls on page load

**Solution:**
1. Batch API calls: load all dashboard data in one request
2. Use browser caching with `Cache-Control` headers
3. Debounce search inputs: wait 300ms after typing stops

---

## PERF-014: React-style re-renders causing flicker (vanilla JS)

**Solution:**
1. Build the DOM off-screen, then insert once:
   ```javascript
   const fragment = document.createDocumentFragment();
   // ... add items to fragment ...
   container.appendChild(fragment);
   ```

---

## PERF-015: Node.js event loop blocking

**Solution:**
1. Never use synchronous file operations in request handlers
2. Use `setImmediate()` for CPU-heavy work
3. Move heavy computation to a worker thread

---

## PERF-016: Slow report generation

**Solution:**
1. Pre-aggregate data with database views
2. Generate reports on a schedule (daily/weekly) and cache results
3. Use PostgreSQL `MATERIALIZED VIEW` for complex aggregates

---

## PERF-017: Frontend freezes when calculating estimates

**Solution:**
Move calculations to a Web Worker:
```javascript
const worker = new Worker('js/calculations-worker.js');
worker.postMessage({ type: 'calculate', data: formData });
worker.onmessage = (e) => displayResults(e.data);
```

---

## PERF-018: Email sending slows down request

**Solution:**
Send emails asynchronously — don't `await` email in the HTTP response:
```javascript
// Fire and forget:
sendEmail(customer, estimate).catch(console.error);
res.json({ success: true });
```

---

## PERF-019: Database grows too large

**Solution:**
1. Archive old projects: `CALL archive_old_projects(730);`  (2 years)
2. Purge old audit logs: `CALL purge_old_audit_log(90);`
3. Schedule weekly maintenance: add to cron job

---

## PERF-020: Frontend chart rendering slow

**Solution:**
1. Limit chart data points to 100 max
2. Use `requestAnimationFrame` for animations
3. Destroy and recreate Chart.js instance instead of updating

---

# SECTION 6 — ERROR CODES & QUICK REFERENCE

| Error Code | Meaning | Solution |
|------------|---------|---------|
| 400 | Bad Request | Check request body / parameters |
| 401 | Unauthorized | Log in again / check JWT |
| 403 | Forbidden | Check user role permissions |
| 404 | Not Found | Check URL / resource exists |
| 409 | Conflict | Duplicate data (e.g., PLU already exists) |
| 422 | Unprocessable | Validation failed |
| 429 | Rate Limited | Wait and retry / increase limit |
| 500 | Server Error | Check backend logs |
| 503 | Service Unavailable | Server/DB is down |
| ECONNREFUSED | Connection refused | Check DB/server is running |
| ETIMEDOUT | Connection timeout | Check network / firewall |
| EPERM | Permission denied | Check file/folder permissions |

---

## GETTING MORE HELP

1. **Check GitHub Issues:** https://github.com/Auction2026/fence-estimator/issues
2. **Review server logs:** `pm2 logs` or `console.log` in browser DevTools
3. **PostgreSQL docs:** https://www.postgresql.org/docs/
4. **Node.js docs:** https://nodejs.org/docs/
5. **Express.js docs:** https://expressjs.com/

---

*Fence Depot Estimator Troubleshooting Guide — Version 1.0*
