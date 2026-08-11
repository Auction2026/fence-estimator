# PART 5: TROUBLESHOOTING GUIDE
## Fence Depot Estimator — 110+ Solutions

---

## 📋 TABLE OF CONTENTS

1. [Installation Issues (Problems 1–20)](#installation-issues)
2. [Database Issues (Problems 21–40)](#database-issues)
3. [Backend / API Issues (Problems 41–65)](#backend--api-issues)
4. [Frontend / UI Issues (Problems 66–85)](#frontend--ui-issues)
5. [Estimate & Calculation Issues (Problems 86–100)](#estimate--calculation-issues)
6. [Email & PDF Issues (Problems 101–110)](#email--pdf-issues)
7. [Performance Issues (Problems 111–115)](#performance-issues)

---

## INSTALLATION ISSUES

### Problem 1 — Node.js version too old

**Symptom:** `SyntaxError: Unexpected token` or `Error: Cannot find module`

**Fix:**
```bash
nvm install 18
nvm use 18
nvm alias default 18
node --version  # Confirm v18.x.x
```

---

### Problem 2 — npm install fails with EACCES permission error

**Symptom:** `npm ERR! Error: EACCES: permission denied`

**Fix:**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
npm install -g pm2
```

---

### Problem 3 — PostgreSQL not found after install

**Symptom:** `command not found: psql`

**Fix:**
```bash
# Add PostgreSQL to PATH
echo 'export PATH=/usr/lib/postgresql/15/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
psql --version
```

---

### Problem 4 — Cannot connect to PostgreSQL

**Symptom:** `FATAL: role "your_user" does not exist`

**Fix:**
```bash
sudo -u postgres psql
CREATE USER fence_user WITH PASSWORD 'your_password';
CREATE DATABASE fence_estimator OWNER fence_user;
GRANT ALL PRIVILEGES ON DATABASE fence_estimator TO fence_user;
\q
```

---

### Problem 5 — Migration 001 fails: "relation already exists"

**Symptom:** `ERROR: relation "users" already exists`

**Fix:**
The schema uses `CREATE TABLE IF NOT EXISTS` — this error means you are running schema.sql directly instead of through migration 001. Use:
```bash
sudo -u postgres psql -d fence_estimator -f migrations/001_initial_schema.sql
```

---

### Problem 6 — Migration 002 (seed) fails: "ON CONFLICT not supported"

**Symptom:** `ERROR: syntax error at or near "ON"`

**Fix:** You are running MySQL/MariaDB instead of PostgreSQL. Either switch to PostgreSQL (recommended) or convert ON CONFLICT to:
```sql
INSERT IGNORE INTO products ...
```

---

### Problem 7 — Git clone fails: "Repository not found"

**Symptom:** `fatal: repository 'https://github.com/Auction2026/fence-estimator' not found`

**Fix:**
```bash
# Verify GitHub authentication
ssh -T git@github.com
# Or use HTTPS with token:
git clone https://YOUR_TOKEN@github.com/Auction2026/fence-estimator.git
```

---

### Problem 8 — Nginx "test failed"

**Symptom:** `nginx: configuration file test failed`

**Fix:**
```bash
# Check exact error
sudo nginx -t 2>&1

# Common fix: remove default Nginx site that conflicts
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

### Problem 9 — Port 5000 already in use

**Symptom:** `Error: listen EADDRINUSE: address already in use :::5000`

**Fix:**
```bash
# Find what's using port 5000
sudo lsof -i :5000

# Kill the process
sudo kill -9 <PID>

# Or change backend port in .env
PORT=5001
```

---

### Problem 10 — PM2 process shows "errored" status

**Symptom:** `pm2 status` shows status: errored

**Fix:**
```bash
# Check logs for error
pm2 logs fence-estimator-backend --lines 50

# Most common cause: missing .env file
ls -la backend/.env    # Must exist
cp backend/.env.example backend/.env
# Fill in values then:
pm2 restart fence-estimator-backend
```

---

### Problem 11 — SSL certificate fails to install

**Symptom:** `Challenge failed for domain` or `Could not bind TCP port 80`

**Fix:**
```bash
# Stop Nginx temporarily
sudo systemctl stop nginx

# Run certbot in standalone mode
sudo certbot certonly --standalone -d yourdomain.com

# Start Nginx
sudo systemctl start nginx
```

---

### Problem 12 — "Cannot find module 'pdfkit'"

**Symptom:** `Error: Cannot find module 'pdfkit'`

**Fix:**
```bash
cd backend
npm install pdfkit
```

---

### Problem 13 — "Cannot find module 'nodemailer'"

**Fix:**
```bash
cd backend
npm install nodemailer
```

---

### Problem 14 — Backend starts but crashes after 30 seconds

**Symptom:** Backend starts then stops automatically

**Fix:** Usually a MongoDB/database connection timeout. Check `.env`:
```
# For PostgreSQL (not MongoDB):
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fence_estimator
DB_USER=fence_user
DB_PASS=your_password
```

---

### Problem 15 — Firewall blocking the app

**Symptom:** Site not accessible but backend is running

**Fix:**
```bash
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

---

### Problem 16 — index.html not loading (404)

**Symptom:** Browser shows 404 when visiting the site

**Fix:** Check Nginx root directive in site config:
```nginx
root /var/www/fence-estimator;  # Must be the actual path to index.html
index index.html;
```

---

### Problem 17 — "Permission denied" when running npm install

**Fix:**
```bash
sudo chown -R $(whoami) /var/www/fence-estimator
cd /var/www/fence-estimator/backend
npm install
```

---

### Problem 18 — PM2 not starting on server reboot

**Fix:**
```bash
pm2 startup
# Follow the command it outputs (starts with: sudo env PATH=...)
pm2 save
pm2 list   # Confirm processes are saved
```

---

### Problem 19 — Database backup not running

**Fix:**
```bash
# Test backup script manually
sudo /usr/local/bin/fence-db-backup.sh

# Verify cron is running
crontab -l | grep fence

# Check cron log
sudo journalctl -u cron
```

---

### Problem 20 — "psql: FATAL: Peer authentication failed"

**Fix:**
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Change peer to md5 or scram-sha-256 for local connections:
# local  all  all  md5

sudo systemctl restart postgresql
```

---

## DATABASE ISSUES

### Problem 21 — Product count is 0 after seed

**Symptom:** `SELECT COUNT(*) FROM products;` returns 0

**Fix:**
```bash
# Re-run seed with verbose output
sudo -u postgres psql -d fence_estimator -v ON_ERROR_STOP=1 -f database/seed.sql
```

---

### Problem 22 — "duplicate key value violates unique constraint"

**Symptom:** Error on INSERT for existing product PLU

**Fix:** The seed uses `ON CONFLICT (plu) DO NOTHING` — this is expected behavior. It means the seed was already run. No action needed.

---

### Problem 23 — Views not created

**Symptom:** `v_products_priced` view not found

**Fix:**
```bash
sudo -u postgres psql -d fence_estimator -f database/migrations/003_pricing_views.sql
```

---

### Problem 24 — Estimate totals not calculating correctly

**Symptom:** Estimate total doesn't match line items

**Fix:**
```sql
-- Manually recalculate
SELECT * FROM fn_calculate_estimate_total('EST-2026-00001');

-- Update estimate with correct totals
UPDATE estimates
SET material_cost = calc.material_cost,
    subtotal = calc.subtotal,
    tax_amount = calc.tax_amount,
    total = calc.total
FROM fn_calculate_estimate_total('EST-2026-00001') AS calc
WHERE estimate_number = 'EST-2026-00001';
```

---

### Problem 25 — Database runs out of disk space

**Fix:**
```bash
# Check database size
sudo -u postgres psql -d fence_estimator -c "
SELECT pg_size_pretty(pg_database_size('fence_estimator')) AS size;"

# Vacuum to reclaim space
sudo -u postgres vacuumdb --analyze fence_estimator

# Check largest tables
sudo -u postgres psql -d fence_estimator -c "
SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename::text))
FROM pg_tables WHERE schemaname='public' ORDER BY 2 DESC;"
```

---

### Problem 26 — Slow database queries

**Fix:**
```sql
-- Check which queries are slow
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 20;

-- Run ANALYZE to update statistics
ANALYZE;

-- Reindex if needed
REINDEX DATABASE fence_estimator;
```

---

### Problem 27 — Cannot drop/reset database

**Fix:**
```bash
# Disconnect all users first
sudo -u postgres psql -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'fence_estimator';"

# Then drop
sudo -u postgres dropdb fence_estimator
sudo -u postgres createdb fence_estimator -O fence_user
```

---

### Problem 28 — Product sell_price shows NULL

**Symptom:** `sell_price` column is NULL in products table

**Fix:** This is a generated column that requires `unit_cost > 0`. Update the product:
```sql
UPDATE products SET unit_cost = 10.00 WHERE unit_cost = 0 AND plu = 'YOUR-PLU';
```

---

### Problem 29 — Migration ran out of order

**Fix:**
```sql
-- Check migration history
SELECT * FROM schema_migrations ORDER BY applied_at;

-- Identify which migrations ran
-- Re-run any that are missing
```

---

### Problem 30 — Database password forgotten

**Fix:**
```bash
sudo -u postgres psql
ALTER USER fence_user WITH PASSWORD 'new_password';
\q

# Update .env
nano backend/.env
# Change DB_PASS to new_password
pm2 restart fence-estimator-backend
```

---

### Problem 31 — "column does not exist" error

**Symptom:** Application throws error about missing column

**Fix:**
```bash
# Check current schema
sudo -u postgres psql -d fence_estimator -c "\d products"

# Re-run migration if column is missing
sudo -u postgres psql -d fence_estimator -f database/migrations/001_initial_schema.sql
```

---

### Problem 32 — PostgreSQL service crashes on restart

**Fix:**
```bash
# Check PostgreSQL logs
sudo journalctl -u postgresql --since "1 hour ago"

# Common fix for out-of-memory:
# Tune shared_buffers in postgresql.conf
sudo nano /etc/postgresql/15/main/postgresql.conf
# Set: shared_buffers = 256MB (for 2GB RAM server)

sudo systemctl restart postgresql
```

---

### Problem 33 — Backup file corrupt

**Fix:**
```bash
# Test a backup file
gunzip -c /var/backups/fence-estimator/fence_estimator_YYYYMMDD.sql.gz | head -20

# If corrupt, restore from older backup
gunzip -c /var/backups/fence-estimator/fence_estimator_OLDER.sql.gz | \
  sudo -u postgres psql fence_estimator
```

---

### Problem 34 — Schema migration conflict

**Symptom:** Migration fails with constraint error

**Fix:**
```bash
# Roll back partial migration
sudo -u postgres psql -d fence_estimator

-- Delete partial migration record
DELETE FROM schema_migrations WHERE version = '003';
\q

# Re-run clean
sudo -u postgres psql -d fence_estimator -f database/migrations/003_pricing_views.sql
```

---

### Problem 35 — Too many database connections

**Symptom:** `FATAL: sorry, too many clients already`

**Fix:**
```bash
# Increase max connections in postgresql.conf
sudo nano /etc/postgresql/15/main/postgresql.conf
# Set: max_connections = 200

sudo systemctl restart postgresql

# Also implement connection pooling (PgBouncer)
sudo apt install -y pgbouncer
```

---

### Problem 36 — Audit log growing too large

**Fix:**
```sql
-- Delete audit logs older than 1 year
DELETE FROM audit_log WHERE created_at < NOW() - INTERVAL '1 year';

-- Or archive to separate table
CREATE TABLE audit_log_archive AS
SELECT * FROM audit_log WHERE created_at < NOW() - INTERVAL '6 months';

DELETE FROM audit_log WHERE created_at < NOW() - INTERVAL '6 months';
```

---

### Problem 37 — Product import fails for special characters

**Fix:** Ensure file is UTF-8 encoded:
```bash
file -i your_import.csv
# Should show: charset=utf-8

# Convert if needed
iconv -f ISO-8859-1 -t UTF-8 import.csv -o import_utf8.csv
```

---

### Problem 38 — Trigger not firing on update

**Fix:**
```sql
-- Check trigger exists
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers
WHERE event_object_table = 'estimates';

-- Re-create trigger if missing
\i database/migrations/004_procedures_triggers.sql
```

---

### Problem 39 — Date/time showing wrong timezone

**Fix:**
```sql
-- Set database timezone to Eastern (Ontario)
ALTER DATABASE fence_estimator SET timezone = 'America/Toronto';

-- Or in postgresql.conf:
-- timezone = 'America/Toronto'

-- Restart PostgreSQL
```
```bash
sudo systemctl restart postgresql
```

---

### Problem 40 — Indexes not being used

**Fix:**
```sql
-- Check query plan
EXPLAIN ANALYZE SELECT * FROM products WHERE fence_type = 'Chain Link';

-- If index not used, force ANALYZE
ANALYZE products;

-- Rebuild indexes
REINDEX TABLE products;
```

---

## BACKEND / API ISSUES

### Problem 41 — API returns 401 Unauthorized

**Symptom:** API calls return `{"message": "Unauthorized"}`

**Fix:**
1. Ensure you are sending the JWT token in the request header:
   ```
   Authorization: ******
   ```
2. Check token has not expired (default: 7 days)
3. Verify `JWT_SECRET` in `.env` matches the one used to sign the token

---

### Problem 42 — API returns 404 for valid endpoints

**Symptom:** `POST /api/estimates` returns 404

**Fix:** Verify the Nginx reverse proxy config:
```nginx
location /api/ {
    proxy_pass http://localhost:5000;
}
```
Then: `sudo nginx -t && sudo systemctl reload nginx`

---

### Problem 43 — API returns 500 Internal Server Error

**Fix:**
```bash
# Check backend logs for the actual error
pm2 logs fence-estimator-backend --lines 100

# Common causes:
# 1. Database connection failed
# 2. Missing environment variable
# 3. Unhandled promise rejection in async function
```

---

### Problem 44 — CORS error in browser

**Symptom:** `Access-Control-Allow-Origin` error in browser console

**Fix:** In `backend/server.js`, update CORS configuration:
```javascript
app.use(cors({
    origin: ['https://yourdomain.com', 'http://localhost:3000'],
    credentials: true
}));
```
Then: `pm2 restart fence-estimator-backend`

---

### Problem 45 — JWT token not accepted

**Symptom:** Valid token returns 403 Forbidden

**Fix:**
```bash
# Check JWT_SECRET hasn't changed
cat backend/.env | grep JWT_SECRET

# If it changed, all users must log in again (expected behavior)
# Ensure JWT_SECRET is the same value used when token was issued
```

---

### Problem 46 — File upload fails (photos)

**Symptom:** Photo upload returns error

**Fix:**
```bash
# Create uploads directory
mkdir -p backend/uploads/photos
chmod 755 backend/uploads/photos

# Check disk space
df -h /var/www
```

---

### Problem 47 — Backend memory leak

**Symptom:** Memory usage grows continuously over days

**Fix:**
```bash
# Set memory limit and auto-restart in PM2
pm2 stop fence-estimator-backend
pm2 start server.js --name fence-estimator-backend --max-memory-restart 512M
pm2 save
```

---

### Problem 48 — Request timeout for large estimates

**Symptom:** Large estimates with many line items time out

**Fix:** In Nginx config:
```nginx
proxy_read_timeout 120s;
proxy_send_timeout 120s;
```
In Express (`server.js`):
```javascript
server.timeout = 120000; // 120 seconds
```

---

### Problem 49 — Cannot create estimate (validation error)

**Symptom:** `POST /api/estimates` fails with validation error

**Fix:** Ensure all required fields are included:
```json
{
  "project_id": "FD-2026-00001",
  "customer_name": "John Smith",
  "fence_type": "Chain Link",
  "linear_feet": 200,
  "material_cost": 1500,
  "subtotal": 1500,
  "total": 1695
}
```

---

### Problem 50 — Backend crashes on startup

**Fix:**
```bash
pm2 logs fence-estimator-backend --lines 50

# If error is "Cannot read .env": ensure .env exists in backend/
ls -la backend/.env

# If error is database connection: check DATABASE_URL or MONGO_URI
```

---

### Problem 51 — Rate limiting blocking legitimate requests

**Symptom:** `429 Too Many Requests`

**Fix:** Increase rate limit in `server.js`:
```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,  // Increase from default
});
```

---

### Problem 52 — Session not persisting after server restart

**Fix:** Sessions are JWT-based (stateless) — they should persist. If they don't:
1. Verify `JWT_SECRET` is the same in `.env` before and after restart
2. Verify token is stored in browser localStorage and sent with each request

---

### Problem 53 — API endpoint "/api/health" not found

**Fix:** Add health check endpoint to `server.js`:
```javascript
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date(), environment: process.env.NODE_ENV });
});
```

---

### Problem 54 — Logs not writing to file

**Fix:**
```bash
# Configure PM2 logging
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30

# View log location
pm2 logs --lines 5
```

---

### Problem 55 — "bcrypt" module compile error

**Symptom:** `Error: Cannot find module '../build/Release/bcrypt_lib'`

**Fix:**
```bash
cd backend
npm uninstall bcrypt bcryptjs
npm install bcryptjs  # Use pure-JS version
```

---

### Problem 56 — Google Maps not loading

**Symptom:** Map shows "For development purposes only" watermark

**Fix:**
1. Ensure `GOOGLE_MAPS_API_KEY` is set in `.env`
2. Enable "Maps JavaScript API" in Google Cloud Console
3. Add your domain to "Application restrictions" in the API key settings

---

### Problem 57 — PDF generation produces blank pages

**Fix:**
```bash
# Ensure pdfkit is installed
cd backend
npm list pdfkit

# If missing:
npm install pdfkit

# Restart backend
pm2 restart fence-estimator-backend
```

---

### Problem 58 — API response very slow (>5 seconds)

**Fix:**
1. Check database indexes are in place
2. Enable query result caching
3. Check PM2 memory: `pm2 monit`
4. Check database: `EXPLAIN ANALYZE` slow queries

---

### Problem 59 — Cannot delete project (constraint error)

**Symptom:** `DELETE FROM projects` fails with foreign key error

**Fix:**
```sql
-- Must delete related records first
DELETE FROM estimate_line_items WHERE estimate_number IN (
    SELECT estimate_number FROM estimates WHERE project_id = 'FD-2026-00001'
);
DELETE FROM estimates WHERE project_id = 'FD-2026-00001';
DELETE FROM fence_specifications WHERE project_id = 'FD-2026-00001';
DELETE FROM projects WHERE project_id = 'FD-2026-00001';
```

---

### Problem 60 — Change order not updating estimate total

**Fix:**
```javascript
// After approving change order, recalculate estimate total via API:
// PUT /api/estimates/:estimateNumber/recalculate
```

---

### Problem 61 — User role permissions not enforced

**Fix:** Check middleware in `server.js`:
```javascript
const requireRole = (role) => (req, res, next) => {
    if (req.user.role !== role && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};
```

---

### Problem 62 — Environment variables not loading

**Symptom:** `process.env.JWT_SECRET` is undefined

**Fix:**
```javascript
// Ensure dotenv is called at very top of server.js
require('dotenv').config();
```

---

### Problem 63 — Backend not restarting after crash

**Fix:**
```bash
pm2 start server.js --name fence-estimator-backend --restart-delay 3000
pm2 save
```

---

### Problem 64 — API dates show in wrong format

**Fix:**
```javascript
// Set locale in Node.js
process.env.TZ = 'America/Toronto';

// Or format dates explicitly:
const date = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
```

---

### Problem 65 — "request entity too large"

**Symptom:** Large file uploads fail with 413 error

**Fix:** In `server.js`:
```javascript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```
In Nginx config:
```nginx
client_max_body_size 50M;
```

---

## FRONTEND / UI ISSUES

### Problem 66 — Page shows blank white screen

**Fix:**
1. Open browser DevTools (F12)
2. Check Console tab for JavaScript errors
3. Most common: script file not found or CORS error

---

### Problem 67 — Tab switching not working

**Symptom:** Clicking a tab does nothing

**Fix:**
```javascript
// Check that switchTab() function is defined and onclick is correct:
// <button onclick="switchTab('dashboard')">Dashboard</button>
// function switchTab(tabName) {
//     const tabs = document.querySelectorAll('[id$="-tab"]');
//     tabs.forEach(tab => tab.style.display = 'none');
//     document.getElementById(tabName + '-tab').style.display = 'block';
// }
```

---

### Problem 68 — Mobile layout broken

**Fix:** Ensure viewport meta tag is in `<head>`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

### Problem 69 — Estimate wizard steps not advancing

**Symptom:** "Next" button doesn't move to step 2

**Fix:** Check that step element IDs match exactly:
```html
<div id="step1" class="active">...</div>
<div id="step2">...</div>
```

---

### Problem 70 — Login form not submitting

**Symptom:** Clicking "Login" does nothing

**Fix:**
```javascript
// Ensure form has onsubmit handler:
// <form onsubmit="loginUser(event)">
// function loginUser(e) { e.preventDefault(); ... }
```

---

### Problem 71 — Dashboard data not loading

**Symptom:** Dashboard shows "Loading..." permanently

**Fix:**
1. Check browser console for API errors
2. Verify backend is running: `pm2 status`
3. Test API directly: `curl http://localhost:5000/api/health`

---

### Problem 72 — Inventory/products not showing

**Symptom:** Products tab empty

**Fix:**
```bash
# Verify products exist in database
sudo -u postgres psql -d fence_estimator -c "SELECT COUNT(*) FROM products;"
# Should be 950+

# If 0, re-run seed
sudo -u postgres psql -d fence_estimator -f database/seed.sql
```

---

### Problem 73 — Prices showing $0.00

**Symptom:** All product prices show zero

**Fix:** Check the seed inserted `unit_cost` values:
```sql
SELECT plu, name, unit_cost FROM products WHERE unit_cost = 0;
```
Re-run seed if needed.

---

### Problem 74 — PDF opens but is blank

**Fix:**
1. Check pdfkit version: `cd backend && npm list pdfkit`
2. Check browser popup blocker is not blocking the PDF window
3. Try downloading instead of previewing

---

### Problem 75 — Browser shows security warning

**Symptom:** "Your connection is not private" warning

**Fix:**
```bash
# Renew SSL certificate
sudo certbot renew

# Force renew
sudo certbot renew --force-renewal
```

---

### Problem 76 — Dark mode not working

**Fix:** Check CSS variable definitions in `:root { ... }` block in `index.html`.

---

### Problem 77 — Print layout looks wrong

**Fix:** Add print CSS:
```css
@media print {
    .nav-sidebar { display: none; }
    .print-area { width: 100%; }
}
```

---

### Problem 78 — Map not centering on customer address

**Fix:** Verify `GOOGLE_MAPS_API_KEY` is valid and Geocoding API is enabled in Google Cloud Console.

---

### Problem 79 — Calculator not updating totals

**Symptom:** Changing quantity doesn't update line totals

**Fix:** Check the `calculateTotal()` function is called on input `change` event:
```javascript
document.querySelector('#qty').addEventListener('input', calculateTotal);
```

---

### Problem 80 — Export to Excel not working

**Symptom:** Export button does nothing

**Fix:**
```bash
cd backend
npm install xlsx
pm2 restart fence-estimator-backend
```

---

### Problem 81 — Images not loading

**Symptom:** Product photos show broken image icon

**Fix:**
```bash
# Check uploads directory exists and has correct permissions
ls -la backend/uploads/
chmod -R 755 backend/uploads/
```

---

### Problem 82 — Session expires too quickly

**Symptom:** Logged out after short period of inactivity

**Fix:** Update JWT expiry in `server.js`:
```javascript
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
```

---

### Problem 83 — Search not returning results

**Symptom:** Searching for a customer returns nothing

**Fix:**
```sql
-- Verify data exists
SELECT * FROM projects WHERE customer_name ILIKE '%smith%';

-- Check if search is case-sensitive (use ILIKE for case-insensitive)
```

---

### Problem 84 — Dropdown menus not populating

**Symptom:** Fence type dropdown is empty

**Fix:** Verify API endpoint returns data:
```bash
curl -H "Authorization: ******" http://localhost:5000/api/products/categories
```

---

### Problem 85 — Date picker not working on mobile

**Fix:** Use HTML5 native date input:
```html
<input type="date" id="project-date" required>
```

---

## ESTIMATE & CALCULATION ISSUES

### Problem 86 — Material quantities calculating incorrectly

**Symptom:** Chain link mesh quantity seems wrong

**Fix:** Verify calculation formula for 100 LF of chain link:
```
Mesh rolls = Linear Feet / 50 (standard roll = 50 LF)
Line posts = CEILING(Linear Feet / 10) + 1 (at 10ft spacing)
Terminal posts = (Number of corners × 1) + 2 (minimum)
Top rail = CEILING(Linear Feet / 21) + 1 (standard 21ft sections)
```

---

### Problem 87 — Tax not calculated correctly

**Symptom:** HST not being applied

**Fix:**
```javascript
// Ontario HST = 13%
const TAX_RATE = 0.13;
const taxAmount = subtotal * TAX_RATE;
const total = subtotal + taxAmount;
```

---

### Problem 88 — Labour cost showing too high

**Symptom:** Labour cost is much higher than expected

**Fix:** Check if labour hours are per post or per linear foot:
- Chain Link: 1.5–2 hours per 100 LF (2-person crew)
- Wood: 2.5–3 hours per 100 LF
- Vinyl: 2–2.5 hours per 100 LF
- Wrought Iron: 4–6 hours per 100 LF

---

### Problem 89 — Profit margin not applying

**Fix:**
```javascript
// Profit margin is applied as markup on top of cost:
const sellPrice = cost * (1 + profitMargin / 100);
// 35% margin means: sellPrice = cost * 1.35
```

---

### Problem 90 — Estimate not saving

**Symptom:** "Save" button clicks but estimate disappears

**Fix:**
1. Check browser console for API errors
2. Verify estimate has all required fields (estimate_number, project_id, customer_name, fence_type, linear_feet, material_cost, subtotal, total)
3. Check if estimate_number already exists (must be unique)

---

### Problem 91 — Change order delta not applied to total

**Fix:**
```sql
UPDATE estimates
SET total = total + co.cost_delta,
    material_cost = material_cost + co.cost_delta
FROM change_orders co
WHERE co.estimate_number = estimates.estimate_number
  AND co.co_number = 'CO-2026-00001'
  AND co.status = 'approved';
```

---

### Problem 92 — Locked estimate can still be edited

**Symptom:** Users can edit estimate even after it's locked

**Fix:** Add check in frontend before allowing edits:
```javascript
if (estimate.is_locked) {
    alert('This estimate is locked and cannot be edited.');
    return;
}
```

---

### Problem 93 — Estimate expiry date wrong

**Symptom:** Estimate shows expired when it shouldn't

**Fix:**
```sql
-- Check expiry date in database
SELECT estimate_number, expires_at, status FROM estimates
WHERE estimate_number = 'EST-2026-00001';

-- Extend expiry if needed
UPDATE estimates
SET expires_at = NOW() + INTERVAL '30 days'
WHERE estimate_number = 'EST-2026-00001';
```

---

### Problem 94 — Duplicate project IDs being created

**Fix:**
```sql
-- Use the sequence function
SELECT fn_generate_project_id();
-- Always use this to get next available ID
```

---

### Problem 95 — Waste factor not included

**Symptom:** Material quantities seem too low

**Fix:** Apply 10-15% waste factor:
```javascript
const wastedMaterials = baseQuantity * 1.15; // 15% waste
```

---

### Problem 96 — Post spacing calculation wrong

**Fix:**
```javascript
// Chain link post spacing standard = 10 feet
const numLinePosts = Math.ceil(linearFeet / 10) - 1;
// Terminal posts: each end + each corner
const numTerminalPosts = 2 + (numCorners * 1);
const totalPosts = numLinePosts + numTerminalPosts;
```

---

### Problem 97 — Concrete quantity too low

**Fix:**
```javascript
// Per post:
// Standard: 0.5 CY per post
// Commercial/wrought iron: 0.75 CY per post
// OPSD guide rail: 1.25 CY per post
const concretePerPost = 0.5;
const totalConcrete = totalPosts * concretePerPost;
```

---

### Problem 98 — Gate hardware not included in estimate

**Fix:** Gate hardware must be added as separate line items:
- 2× Gate hinges
- 1× Gate latch
- 1× Gate chain
- 2× Gate post caps
- Gate post (larger diameter than line posts)

---

### Problem 99 — Estimate PDF doesn't include all line items

**Symptom:** PDF is missing some products

**Fix:**
```javascript
// Ensure all line items are fetched before generating PDF
const lineItems = await db.query(
    'SELECT * FROM estimate_line_items WHERE estimate_number = $1 ORDER BY sort_order',
    [estimateNumber]
);
```

---

### Problem 100 — Material cost shows different in estimate vs product list

**Symptom:** Unit cost in estimate doesn't match product database

**Fix:** Unit cost is locked at time of estimate creation. This is intentional. If prices change, new estimates use new prices; existing estimates keep original prices for integrity.

---

## EMAIL & PDF ISSUES

### Problem 101 — Email not sending

**Symptom:** `Error: Invalid login: 535 Authentication failed`

**Fix:**
1. Enable "App Passwords" in your Gmail account
2. Update `.env`:
   ```
   EMAIL_USER=your@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```
3. Restart backend: `pm2 restart fence-estimator-backend`

---

### Problem 102 — Email goes to spam

**Fix:**
1. Add SPF record to DNS: `v=spf1 include:_spf.google.com ~all`
2. Add DKIM record (from Google Workspace)
3. Add DMARC record: `v=DMARC1; p=none; rua=mailto:admin@yourdomain.com`

---

### Problem 103 — PDF font rendering issue

**Symptom:** PDF shows garbled text or wrong font

**Fix:**
```javascript
// Register a font explicitly in pdfkit
doc.registerFont('Helvetica', 'Helvetica');
doc.font('Helvetica').fontSize(12);
```

---

### Problem 104 — PDF too large (over 5MB)

**Fix:**
```javascript
// Compress images in PDF
doc.image('logo.png', { width: 150, quality: 60 });
// Avoid embedding high-resolution photos in estimates
```

---

### Problem 105 — PDF download not working in Safari

**Fix:**
```javascript
// Set correct Content-Disposition header
res.setHeader('Content-Disposition', 'attachment; filename="estimate.pdf"');
res.setHeader('Content-Type', 'application/pdf');
```

---

### Problem 106 — Email attachment not attaching PDF

**Fix:**
```javascript
// Nodemailer attachment example
attachments: [{
    filename: `estimate-${estimateNumber}.pdf`,
    content: pdfBuffer,
    contentType: 'application/pdf'
}]
```

---

### Problem 107 — Email template not showing customer name

**Fix:** Ensure template uses correct variable:
```javascript
const html = `<h1>Dear ${customerName},</h1>`;
// Not: `<h1>Dear ${customer_name},</h1>`
```

---

### Problem 108 — Multiple emails sent for one estimate

**Symptom:** Customer receives 2-3 copies of estimate

**Fix:** Add email send tracking:
```sql
ALTER TABLE estimates ADD COLUMN email_sent_at TIMESTAMP;
UPDATE estimates SET email_sent_at = NOW() WHERE estimate_number = $1;
```
Check `email_sent_at` before sending.

---

### Problem 109 — PDF page breaks in wrong place

**Fix:**
```javascript
// Add manual page break
doc.addPage();

// Or set auto page break margins
doc = new PDFDocument({ margin: 50, autoFirstPage: true });
```

---

### Problem 110 — Email shows HTML tags instead of formatted content

**Symptom:** Customer receives email with visible `<p>` and `<br>` tags

**Fix:** Ensure you are using the `html` field (not `text`) in Nodemailer:
```javascript
await transporter.sendMail({
    to: customerEmail,
    subject: 'Your Fence Estimate',
    html: '<h1>Your Estimate</h1><p>See attached.</p>',  // NOT text:
});
```

---

## PERFORMANCE ISSUES

### Problem 111 — Page loads slowly (>5 seconds)

**Fix:**
1. Enable Nginx gzip compression:
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```
2. Enable browser caching for static assets:
```nginx
location ~* \.(css|js|png|jpg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

### Problem 112 — API calls slow on large datasets

**Fix:**
```javascript
// Add pagination to all list endpoints
const { page = 1, limit = 50 } = req.query;
const offset = (page - 1) * limit;

const results = await db.query(
    'SELECT * FROM products LIMIT $1 OFFSET $2',
    [limit, offset]
);
```

---

### Problem 113 — Server CPU high

**Fix:**
```bash
# Identify process using CPU
top -u fence_user

# Check PM2 resource usage
pm2 monit

# Add cluster mode (use all CPU cores)
pm2 stop fence-estimator-backend
pm2 start server.js --name fence-estimator-backend -i max
pm2 save
```

---

### Problem 114 — Memory usage keeps growing

**Fix:**
```bash
# Set max memory in PM2 and auto-restart
pm2 stop fence-estimator-backend
pm2 start server.js --name fence-estimator-backend --max-memory-restart 500M
pm2 save
```

---

### Problem 115 — Image uploads slow

**Fix:**
```javascript
// Resize images on upload before saving
const sharp = require('sharp');
await sharp(uploadedFile.buffer)
    .resize(800, 600, { fit: 'inside' })
    .jpeg({ quality: 80 })
    .toFile(destinationPath);
```

---

## 📞 GETTING ADDITIONAL HELP

If your issue is not listed above:

1. **Check backend logs:** `pm2 logs fence-estimator-backend --lines 100`
2. **Check Nginx logs:** `sudo tail -100 /var/log/nginx/error.log`
3. **Check database logs:** `sudo tail -100 /var/log/postgresql/postgresql-15-main.log`
4. **Open a GitHub Issue:** https://github.com/Auction2026/fence-estimator/issues

---

*Fence Depot Estimator — Troubleshooting Guide v1.0*
*110+ Solutions | Canadian Standards Compliant*
*August 2026*
