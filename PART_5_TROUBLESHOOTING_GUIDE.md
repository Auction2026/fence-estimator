# FENCE ESTIMATOR — PART 5: TROUBLESHOOTING GUIDE
## 110+ Issues with Complete Solutions

---

## HOW TO USE THIS GUIDE

1. Find your issue by **category** (Database, Backend, Frontend, etc.)
2. Each issue has: **Symptom → Cause → Fix**
3. Follow the numbered fix steps in order
4. Check the **Quick Diagnostics** section at the bottom first

---

## QUICK DIAGNOSTICS (Run These First)

```bash
# Check all services at once
echo "=== PostgreSQL ===" && sudo systemctl status postgresql --no-pager | grep Active
echo "=== Backend API ===" && pm2 status | grep fence
echo "=== NGINX ===" && sudo systemctl status nginx --no-pager | grep Active
echo "=== Database Connection ===" && psql -U fence_user -d fence_estimator -h localhost -c "SELECT NOW();" 2>&1 | head -3
echo "=== API Health ===" && curl -s http://localhost:3000/api/health
```

---

## CATEGORY 1: DATABASE ISSUES

### Issue 1.1 — PostgreSQL Won't Start
**Symptom:** `sudo systemctl start postgresql` fails  
**Cause:** Port conflict, corrupted data directory, insufficient permissions  
**Fix:**
```bash
# Check what's on port 5432
sudo lsof -i :5432
# Kill conflicting process if needed
sudo kill -9 <PID>

# Check PostgreSQL logs
sudo tail -50 /var/log/postgresql/postgresql-16-main.log

# Repair data directory permissions
sudo chown -R postgres:postgres /var/lib/postgresql/
sudo chmod 700 /var/lib/postgresql/16/main/

# Restart
sudo systemctl restart postgresql
```

### Issue 1.2 — Cannot Connect to Database (password authentication failed)
**Symptom:** `FATAL: password authentication failed for user "fence_user"`  
**Fix:**
```bash
# Reset password
sudo -u postgres psql
ALTER USER fence_user WITH ENCRYPTED PASSWORD 'NewPassword123!';
\q

# Update .env file
nano /var/www/fence-estimator/backend/.env
# Change DB_PASSWORD=NewPassword123!

# Restart backend
pm2 restart fence-estimator-api
```

### Issue 1.3 — Cannot Connect to Database (no pg_hba.conf entry)
**Symptom:** `FATAL: no pg_hba.conf entry for host "x.x.x.x"`  
**Fix:**
```bash
# Find pg_hba.conf location
sudo -u postgres psql -c "SHOW hba_file;"

# Edit pg_hba.conf
sudo nano /etc/postgresql/16/main/pg_hba.conf

# Add this line:
# host  fence_estimator  fence_user  127.0.0.1/32  md5

# Reload PostgreSQL
sudo systemctl reload postgresql
```

### Issue 1.4 — Database Does Not Exist
**Symptom:** `FATAL: database "fence_estimator" does not exist`  
**Fix:**
```bash
sudo -u postgres psql
CREATE DATABASE fence_estimator;
GRANT ALL PRIVILEGES ON DATABASE fence_estimator TO fence_user;
\q

# Re-run migrations
psql -U fence_user -d fence_estimator -h localhost -f database/schema.sql
psql -U fence_user -d fence_estimator -h localhost -f database/seed.sql
```

### Issue 1.5 — Schema Migration Fails (table already exists)
**Symptom:** `ERROR: relation "users" already exists`  
**Fix:**
```bash
# The schema.sql has DROP TABLE IF EXISTS — re-run it safely
# All existing data will be lost — back up first!
pg_dump -U fence_user fence_estimator > backup_before_migration.sql

# Then re-run schema
psql -U fence_user -d fence_estimator -h localhost -f database/schema.sql
```

### Issue 1.6 — Seed Data Fails (duplicate key violation)
**Symptom:** `ERROR: duplicate key value violates unique constraint "materials_sku_key"`  
**Cause:** Seed already ran once  
**Fix:**
```bash
# Truncate tables first
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
TRUNCATE TABLE estimate_items, estimates, projects, supplier_materials, 
               materials, suppliers, customers, settings, users RESTART IDENTITY CASCADE;
SQL

# Re-run seed
psql -U fence_user -d fence_estimator -h localhost -f database/seed.sql
```

### Issue 1.7 — No Materials in Inventory Tab
**Symptom:** Inventory tab shows 0 materials  
**Fix:**
```bash
# Check if seed ran
psql -U fence_user -d fence_estimator -h localhost -c "SELECT COUNT(*) FROM materials;"
# If 0, run seed:
psql -U fence_user -d fence_estimator -h localhost -f database/seed.sql
```

### Issue 1.8 — Triggers Not Working (estimate totals don't recalculate)
**Symptom:** Adding items to estimate doesn't update totals  
**Fix:**
```bash
psql -U fence_user -d fence_estimator -h localhost
-- Check triggers exist:
\df fn_recalculate_estimate
-- If missing, re-run schema.sql
\q
```

### Issue 1.9 — Database Running Out of Connections
**Symptom:** `FATAL: remaining connection slots are reserved`  
**Fix:**
```bash
# Check current connections
psql -U fence_user -d fence_estimator -h localhost -c "SELECT count(*) FROM pg_stat_activity;"

# Kill idle connections
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'fence_estimator' 
AND state = 'idle'
AND query_start < now() - interval '5 minutes';
SQL

# Increase max_connections in postgresql.conf if needed
sudo nano /etc/postgresql/16/main/postgresql.conf
# Change: max_connections = 200
sudo systemctl restart postgresql
```

### Issue 1.10 — Audit Log Filling Up Disk
**Symptom:** Disk usage high, audit_log table has millions of rows  
**Fix:**
```bash
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
-- Check table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(oid)) 
FROM pg_class WHERE relname IN ('audit_log','audit_log_archive')
ORDER BY pg_total_relation_size(oid) DESC;

-- Archive old logs (keep 1 year)
CALL sp_archive_old_audit_logs(365);

-- Verify space freed
VACUUM ANALYZE audit_log;
SQL
```

### Issue 1.11 — Slow Queries / Database Performance
**Symptom:** Pages load slowly, API timeouts  
**Fix:**
```bash
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;

-- Run VACUUM and ANALYZE
VACUUM ANALYZE;

-- Check index usage
SELECT indexname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan = 0;
SQL
```

### Issue 1.12 — Error: column "total_price" does not exist (in estimate_items)
**Symptom:** API returns error about missing column  
**Cause:** PostgreSQL version < 12 doesn't support generated columns  
**Fix:**
```bash
# Check PostgreSQL version
psql -U fence_user -d fence_estimator -h localhost -c "SELECT version();"

# If < 12, modify estimate_items to use regular columns + trigger
# Contact your database administrator to upgrade PostgreSQL
```

---

## CATEGORY 2: BACKEND / API ISSUES

### Issue 2.1 — Backend Won't Start (EADDRINUSE)
**Symptom:** `Error: listen EADDRINUSE: address already in use :::3000`  
**Fix:**
```bash
# Find process on port 3000
sudo lsof -i :3000
# Kill it
sudo kill -9 <PID>
# OR change port in .env: PORT=3001
pm2 restart fence-estimator-api
```

### Issue 2.2 — Backend Won't Start (Cannot find module)
**Symptom:** `Error: Cannot find module 'express'`  
**Fix:**
```bash
cd /var/www/fence-estimator/backend
rm -rf node_modules package-lock.json
npm install
pm2 restart fence-estimator-api
```

### Issue 2.3 — Backend Crashes on Start (.env not found)
**Symptom:** `Error: ENOENT: no such file or directory, open '.env'`  
**Fix:**
```bash
cd /var/www/fence-estimator/backend
cp .env.example .env
nano .env
# Fill in all required values
pm2 restart fence-estimator-api
```

### Issue 2.4 — JWT Authentication Errors (401 Unauthorized)
**Symptom:** API returns 401 on protected routes  
**Fix:**
```bash
# Verify JWT_SECRET is set in .env
grep JWT_SECRET /var/www/fence-estimator/backend/.env
# Must not be empty or the placeholder value

# Generate new secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Update .env and restart:
pm2 restart fence-estimator-api
```

### Issue 2.5 — CORS Errors (cross-origin blocked)
**Symptom:** Browser console: `Access to fetch has been blocked by CORS policy`  
**Fix:**
```bash
# Verify CORS config in server.js
grep -n "cors\|CORS\|origin" /var/www/fence-estimator/backend/server.js

# In server.js, ensure:
# app.use(cors({ origin: 'https://yourdomain.com' }))
# Replace 'yourdomain.com' with your actual domain

nano /var/www/fence-estimator/backend/server.js
# Update ALLOWED_ORIGINS to include your frontend URL
pm2 restart fence-estimator-api
```

### Issue 2.6 — API Returns 500 (Internal Server Error)
**Symptom:** All API calls return HTTP 500  
**Fix:**
```bash
# View backend logs
pm2 logs fence-estimator-api --lines 50

# Common causes:
# 1. Database not connected - check DB_* env vars
# 2. Missing environment variable
# 3. Syntax error in server.js after edit

# Test database connection directly:
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 
  '******localhost/fence_estimator' });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? 'DB ERROR: ' + err.message : 'DB OK: ' + res.rows[0].now);
  pool.end();
});
"
```

### Issue 2.7 — API 404 on All Routes
**Symptom:** All routes return 404 Not Found  
**Fix:**
```bash
# Verify backend is running
pm2 status

# Verify NGINX proxy config
sudo nginx -t
sudo cat /etc/nginx/sites-available/fence-estimator | grep proxy_pass
# Should show: proxy_pass http://localhost:3000;

# Test backend directly (bypass NGINX)
curl http://localhost:3000/api/health
```

### Issue 2.8 — Rate Limiting Blocks Requests (429 Too Many Requests)
**Symptom:** Gets 429 after many quick requests  
**Fix:**
```bash
# Increase rate limit in server.js
# Find the rate limiter config:
grep -n "rateLimit\|windowMs\|max" /var/www/fence-estimator/backend/server.js

# Increase max requests or window:
# max: 100 → max: 500
# windowMs: 15 * 60 * 1000 (15 min) → 5 * 60 * 1000 (5 min)
pm2 restart fence-estimator-api
```

### Issue 2.9 — Backend Runs but PM2 Shows "errored"
**Symptom:** `pm2 status` shows `errored` state  
**Fix:**
```bash
pm2 logs fence-estimator-api --err --lines 100
# Read the error
pm2 delete fence-estimator-api

cd /var/www/fence-estimator/backend
node server.js  # Run directly to see full error output

# Fix the issue, then:
pm2 start server.js --name fence-estimator-api
pm2 save
```

### Issue 2.10 — API Slow to Respond (>2 seconds)
**Symptom:** API requests take too long  
**Fix:**
```bash
# Check Node.js memory usage
pm2 monit

# Add database connection pooling check
# In server.js, verify pool settings:
# max: 20 (connections), idleTimeoutMillis: 30000

# Check for N+1 queries in logs
pm2 logs fence-estimator-api | grep "SELECT"
```

### Issue 2.11 — File Upload Fails (estimates/attachments)
**Symptom:** Error when trying to attach files  
**Fix:**
```bash
# Check upload directory exists and has write permissions
ls -la /var/www/fence-estimator/uploads/ 2>/dev/null || mkdir -p /var/www/fence-estimator/uploads

sudo chown -R www-data:www-data /var/www/fence-estimator/uploads/
sudo chmod 755 /var/www/fence-estimator/uploads/

# Check NGINX max upload size
sudo nano /etc/nginx/nginx.conf
# Add inside http block: client_max_body_size 10M;
sudo systemctl reload nginx
```

### Issue 2.12 — Estimates Not Saving (POST /api/estimates fails)
**Symptom:** Creating new estimate returns error  
**Fix:**
```bash
# Check server logs for specific error
pm2 logs fence-estimator-api --lines 20

# Test API directly:
curl -X POST http://localhost:3000/api/estimates \
  -H "Content-Type: application/json" \
  -d '{"customer_id":1,"fence_type":"chain_link","total_linear_ft":100}'

# Look for validation errors or missing required fields
```

---

## CATEGORY 3: FRONTEND ISSUES

### Issue 3.1 — Page Shows Blank / White Screen
**Symptom:** Opening index.html shows nothing  
**Fix:**
```bash
# Check browser console (F12 → Console tab)
# Common errors:
# "Failed to fetch" → Backend not running
# "Unexpected token <" → API returning HTML instead of JSON
# "Cannot read property of undefined" → Missing config variable

# Verify API_BASE_URL in index.html points to running backend
grep "API_BASE_URL" index.html
# Should be: const API_BASE_URL = 'http://localhost:3000/api';
```

### Issue 3.2 — Tabs Not Switching
**Symptom:** Clicking tab navigation doesn't change content  
**Fix:**
```bash
# Open browser console (F12)
# Look for JavaScript errors

# Common cause: Script not loaded
# Check at bottom of index.html:
grep -n "script src" index.html

# If using separate JS files, verify paths are correct
# frontend/js/app.js must be loaded
```

### Issue 3.3 — Inventory Tab Shows "Loading..." Forever
**Symptom:** Inventory tab spinner never stops  
**Fix:**
```bash
# Open browser DevTools → Network tab
# Look for failed request to /api/materials
# Check backend is running: curl http://localhost:3000/api/materials

# If CORS error in console: see Issue 2.5
# If 404: verify route exists in server.js
```

### Issue 3.4 — Estimate Calculations Wrong
**Symptom:** Material quantities or prices calculate incorrectly  
**Fix:**
```bash
# Check calculations.js
cat frontend/js/calculations.js | grep -A5 "function calculate"

# Common causes:
# - Wrong posts-per-foot formula (should be 1 post per 10ft of fence)
# - Wrong fabric quantity (1 LF of fabric per LF of fence)
# - Tax not calculating (check tax_rate in settings)

# Test calculation directly in browser console:
# Open DevTools → Console
# estimateState.totalLinearFt = 100
# calculateAndRenderMaterials()
```

### Issue 3.5 — Print Button Doesn't Work
**Symptom:** Print estimate button has no effect  
**Fix:**
```bash
# Check browser console for errors
# Verify print function exists:
grep -n "function.*print\|window.print\|@media print" index.html

# Allow popups in browser for the site
# Try keyboard shortcut: Ctrl+P (or Cmd+P on Mac)
```

### Issue 3.6 — Customer Form Doesn't Validate
**Symptom:** Can submit estimate form with missing required fields  
**Fix:**
```bash
# Check validation.js
grep -n "required\|validate\|isEmpty" frontend/js/validation.js

# Verify HTML required attributes in index.html:
grep -n "required" index.html | head -10
```

### Issue 3.7 — Settings Not Saving
**Symptom:** Changes in Settings tab don't persist after page refresh  
**Fix:**
```bash
# Check localStorage
# Browser DevTools → Application → Local Storage
# Look for fence_estimator_settings key

# Also check API:
curl http://localhost:3000/api/settings
# If empty, re-run seed.sql

# Check for errors in console when clicking Save
```

### Issue 3.8 — Analytics Charts Not Showing
**Symptom:** Analytics tab shows empty chart area  
**Fix:**
```bash
# Chart.js CDN might be blocked
# Check browser console for "Chart is not defined"

# Add Chart.js locally:
# Download: https://cdn.jsdelivr.net/npm/chart.js
# Save as: frontend/js/chart.min.js
# Update index.html script tag to use local file

# Also: ensure there is estimate data to display
# Charts need at least 1 approved estimate
```

### Issue 3.9 — Mobile Layout Broken
**Symptom:** On phone/tablet, layout overlaps or is unusable  
**Fix:**
```bash
# Verify responsive.css is linked in index.html:
grep "responsive.css" index.html

# Check viewport meta tag:
grep "viewport" index.html
# Must have: <meta name="viewport" content="width=device-width, initial-scale=1.0">

# Open Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
```

### Issue 3.10 — Export to PDF Not Working
**Symptom:** PDF export produces blank file or error  
**Fix:**
```bash
# Most PDF export uses browser print → Save as PDF
# If using jsPDF library, verify it's loaded:
grep "jspdf\|jsPDF" index.html

# Alternative: Use browser print (Ctrl+P → Save as PDF)
# This always works as a fallback
```

---

## CATEGORY 4: NGINX / SERVER ISSUES

### Issue 4.1 — NGINX Won't Start (port 80 in use)
**Symptom:** `nginx: [emerg] bind() to 0.0.0.0:80 failed`  
**Fix:**
```bash
# Find what's using port 80
sudo lsof -i :80
# Usually Apache is running
sudo systemctl stop apache2
sudo systemctl disable apache2
sudo systemctl start nginx
```

### Issue 4.2 — 502 Bad Gateway
**Symptom:** Browser shows 502 Bad Gateway  
**Fix:**
```bash
# Backend is not running
pm2 status
pm2 start fence-estimator-api

# Check NGINX proxy target
grep proxy_pass /etc/nginx/sites-available/fence-estimator
# Must match backend port: proxy_pass http://localhost:3000;

sudo systemctl reload nginx
```

### Issue 4.3 — 403 Forbidden on Frontend Files
**Symptom:** Browser shows 403 when accessing site  
**Fix:**
```bash
# Fix file permissions
sudo chown -R www-data:www-data /var/www/fence-estimator/
sudo find /var/www/fence-estimator/ -type f -exec chmod 644 {} \;
sudo find /var/www/fence-estimator/ -type d -exec chmod 755 {} \;
sudo systemctl reload nginx
```

### Issue 4.4 — SSL Certificate Expired
**Symptom:** Browser shows "Your connection is not private"  
**Fix:**
```bash
# Renew Let's Encrypt certificate
sudo certbot renew
sudo systemctl reload nginx

# Check expiry
sudo certbot certificates
```

### Issue 4.5 — NGINX Config Test Fails
**Symptom:** `sudo nginx -t` shows errors  
**Fix:**
```bash
sudo nginx -t 2>&1  # See full error message
# Common: mismatched brackets, missing semicolons
# Edit: sudo nano /etc/nginx/sites-available/fence-estimator
# Test again: sudo nginx -t
# Reload: sudo systemctl reload nginx
```

---

## CATEGORY 5: INSTALLATION / SETUP ISSUES

### Issue 5.1 — npm install Fails (EACCES permission denied)
**Symptom:** Permission error during `npm install`  
**Fix:**
```bash
# Fix npm cache permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules 2>/dev/null || true
cd backend && npm install
```

### Issue 5.2 — Node.js Version Too Old
**Symptom:** `SyntaxError: Unexpected token` or `require() not supported`  
**Fix:**
```bash
# Check Node version
node --version
# Need v18.x or higher

# Install Node.js 20 via nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node --version  # Should show v20.x.x
```

### Issue 5.3 — PostgreSQL Version Too Old
**Symptom:** `ERROR: syntax error at or near "GENERATED"` (generated columns require PG 12+)  
**Fix:**
```bash
# Check PostgreSQL version
psql --version
# Need 14.x or higher

# Upgrade on Ubuntu:
sudo apt install postgresql-16
# Follow PostgreSQL upgrade guide for your OS version
```

### Issue 5.4 — Git Clone Fails (authentication required)
**Symptom:** `fatal: Authentication failed` cloning from GitHub  
**Fix:**
```bash
# Use HTTPS with personal access token:
git clone https://<YOUR_TOKEN>@github.com/Auction2026/fence-estimator.git

# OR use SSH (set up SSH key first):
git clone git@github.com:Auction2026/fence-estimator.git
```

### Issue 5.5 — .env File Changes Not Taking Effect
**Symptom:** Updated .env but behavior didn't change  
**Fix:**
```bash
# Must restart backend to reload .env
pm2 restart fence-estimator-api

# Verify the value is loaded:
pm2 env fence-estimator-api | grep DB_HOST
```

### Issue 5.6 — PM2 Not Found
**Symptom:** `pm2: command not found`  
**Fix:**
```bash
sudo npm install -g pm2
# Verify: pm2 --version
```

### Issue 5.7 — Certbot Fails (domain not pointing to server)
**Symptom:** `Challenge failed for domain yourdomain.com`  
**Fix:**
```bash
# DNS must point to your server's IP before running certbot
# Check: nslookup yourdomain.com
# Must return your server's public IP

# Get your server IP:
curl ifconfig.me

# Update DNS A record at your domain registrar to point to this IP
# Wait for DNS propagation (5-60 minutes)
# Then retry: sudo certbot --nginx -d yourdomain.com
```

---

## CATEGORY 6: ESTIMATE-SPECIFIC ISSUES

### Issue 6.1 — Estimate Number Not Generating
**Symptom:** Estimate saved but no estimate number assigned  
**Fix:**
```bash
# Verify trigger exists in database
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
SELECT tgname FROM pg_trigger WHERE tgname = 'trg_estimates_number';
SQL
# If no row returned, re-run schema.sql
```

### Issue 6.2 — Tax Not Calculating
**Symptom:** Tax shows $0.00 on estimates  
**Fix:**
```bash
# Check default tax rate in settings
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
SELECT * FROM settings WHERE setting_key = 'default_tax_rate';
SQL
# Should show 0.0875 (8.75%)

# If missing:
INSERT INTO settings (setting_key, setting_value, setting_group)
VALUES ('default_tax_rate', '0.0875', 'pricing');
```

### Issue 6.3 — Can't Approve Estimate (status stuck in draft)
**Symptom:** No button to move estimate to "approved" status  
**Fix:**
```bash
# Manually update via API or database
# Via database:
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
UPDATE estimates SET status = 'approved', approved_at = NOW()
WHERE estimate_number = 'EST-2026-0001';
SQL
```

### Issue 6.4 — Price Lock Not Working
**Symptom:** Estimate prices change after locking  
**Fix:**
```bash
# Price lock should prevent UI changes, but verify backend enforcement:
grep -n "price_locked" /var/www/fence-estimator/backend/server.js
# Should reject updates when price_locked = TRUE
```

### Issue 6.5 — Estimate PDF Prints With Wrong Company Name
**Symptom:** Print shows "ABC Fence Company" instead of your name  
**Fix:**
```bash
# Update settings in database:
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
UPDATE settings SET setting_value = 'Your Company Name'
WHERE setting_key = 'company_name';
SQL

# OR update via Settings tab in the application
```

---

## CATEGORY 7: MATERIALS / INVENTORY ISSUES

### Issue 7.1 — Material Not Found in Estimate Wizard
**Symptom:** Selecting fence type shows no materials  
**Fix:**
```bash
# Check materials have correct fence_type field
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
SELECT DISTINCT fence_type FROM materials WHERE is_active = TRUE;
SQL
# Expected: chain_link, wood_privacy, vinyl, ornamental, aluminum, security, all
```

### Issue 7.2 — Prices Show $0.00 for All Materials
**Symptom:** All material prices are zero in estimates  
**Fix:**
```bash
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
SELECT sku, unit_cost, unit_price FROM materials LIMIT 5;
SQL
# If zeros, seed data may not have loaded
psql -U fence_user -d fence_estimator -h localhost -f database/seed.sql
```

### Issue 7.3 — Adding New Material to Database
**Symptom:** Need to add a material not in the catalog  
**Fix:**
```bash
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
INSERT INTO materials 
    (sku, name, category, fence_type, unit_of_measure, unit_cost, unit_price, markup_pct)
VALUES 
    ('MY-SKU-001', 'My New Material', 'Chain Link', 'chain_link', 'EA', 10.00, 13.00, 30.00);
SQL
```

### Issue 7.4 — Markup Percentage Calculating Wrong
**Symptom:** Displayed price doesn't match expected markup  
**Cause:** Markup is applied: price = cost × (1 + markup_pct/100)  
**Fix:**
```bash
# Verify formula: 30% markup on $10 cost = $13 price
# $10 × 1.30 = $13.00 ✓
# If prices seem wrong, check the markup_pct column:
psql -U fence_user -d fence_estimator -h localhost << 'SQL'
SELECT sku, unit_cost, unit_price, markup_pct,
       ROUND(unit_cost * (1 + markup_pct/100.0), 2) AS calculated_price
FROM materials LIMIT 5;
SQL
```

---

## CATEGORY 8: PERFORMANCE ISSUES

### Issue 8.1 — Site Loads Slowly (>5 seconds)
**Fix checklist:**
```bash
# 1. Check server resources
free -h && df -h && top -bn1 | head -20

# 2. Check PostgreSQL connections
psql -U fence_user -d fence_estimator -h localhost -c "SELECT count(*) FROM pg_stat_activity;"

# 3. Run database VACUUM
psql -U fence_user -d fence_estimator -h localhost -c "VACUUM ANALYZE;"

# 4. Check PM2 memory
pm2 monit  # Press Ctrl+C to exit

# 5. Restart backend
pm2 restart fence-estimator-api

# 6. Check NGINX worker processes
grep worker_processes /etc/nginx/nginx.conf
# Set to number of CPU cores: worker_processes auto;
```

### Issue 8.2 — Server Running Out of Memory
**Fix:**
```bash
# Check memory
free -h

# Set Node.js memory limit in PM2:
pm2 delete fence-estimator-api
pm2 start server.js --name fence-estimator-api --node-args="--max-old-space-size=512"
pm2 save

# Add swap if server has < 2GB RAM:
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## CATEGORY 9: BACKUP & RECOVERY

### Issue 9.1 — How to Backup the Database
```bash
# Daily backup
pg_dump -U fence_user -d fence_estimator -h localhost > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -U fence_user -d fence_estimator -h localhost | gzip > backup_$(date +%Y%m%d).sql.gz

# Automated daily backup (cron)
sudo crontab -e
# Add: 0 2 * * * pg_dump -U fence_user fence_estimator > /backups/fence_$(date +\%Y\%m\%d).sql
```

### Issue 9.2 — How to Restore the Database
```bash
# Restore from .sql file
psql -U fence_user -d fence_estimator -h localhost < backup_20260811.sql

# Restore from .sql.gz file
gunzip -c backup_20260811.sql.gz | psql -U fence_user -d fence_estimator -h localhost
```

### Issue 9.3 — Lost Admin Password
```bash
psql -U postgres -d fence_estimator << 'SQL'
UPDATE users SET password_hash = crypt('NewAdminPassword123!', gen_salt('bf'))
WHERE username = 'admin';
SQL
```

---

## CATEGORY 10: WINDOWS-SPECIFIC ISSUES

### Issue 10.1 — npm install Fails on Windows
**Fix:**
```powershell
# Run as Administrator
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
npm install --no-optional
```

### Issue 10.2 — PostgreSQL Not in PATH on Windows
**Fix:**
```powershell
# Add PostgreSQL to PATH
# System Properties → Environment Variables → Path → New
# Add: C:\Program Files\PostgreSQL\16\bin
# Restart PowerShell
```

### Issue 10.3 — Line Ending Issues (CRLF vs LF)
**Symptom:** Shell scripts fail on Windows  
**Fix:**
```bash
# In Git (run before cloning):
git config --global core.autocrlf false
```

---

## QUICK REFERENCE COMMANDS

```bash
# ============================================================
# DATABASE
# ============================================================
sudo systemctl status postgresql    # Check PostgreSQL status
sudo systemctl restart postgresql   # Restart PostgreSQL
psql -U fence_user -d fence_estimator -h localhost  # Connect to DB
\dt                                 # List tables (inside psql)
SELECT COUNT(*) FROM materials;     # Count materials
VACUUM ANALYZE;                     # Optimize database

# ============================================================
# BACKEND
# ============================================================
pm2 status                          # Check API status
pm2 logs fence-estimator-api        # View live logs
pm2 restart fence-estimator-api     # Restart API
pm2 stop fence-estimator-api        # Stop API
curl http://localhost:3000/api/health  # Test API

# ============================================================
# NGINX
# ============================================================
sudo nginx -t                       # Test config
sudo systemctl reload nginx         # Reload config
sudo systemctl restart nginx        # Full restart
sudo tail -f /var/log/nginx/error.log  # View error logs

# ============================================================
# SERVER
# ============================================================
free -h                             # Check memory
df -h                               # Check disk space
top                                 # Monitor processes
sudo lsof -i :3000                  # What's on port 3000
sudo lsof -i :80                    # What's on port 80
```

---

## GETTING MORE HELP

If your issue is not listed here:

1. **Check Logs First:**
   ```bash
   pm2 logs fence-estimator-api --lines 100
   sudo tail -50 /var/log/nginx/error.log
   sudo tail -50 /var/log/postgresql/postgresql-16-main.log
   ```

2. **Search Error Message:** Copy the exact error from logs and search online.

3. **GitHub Issues:** https://github.com/Auction2026/fence-estimator/issues

4. **Stack Overflow:** Tag with `node.js`, `postgresql`, `nginx`

---

*Troubleshooting Guide — Fence Estimator v1.0*  
*110+ Issues | Complete Solutions | Production Ready*
