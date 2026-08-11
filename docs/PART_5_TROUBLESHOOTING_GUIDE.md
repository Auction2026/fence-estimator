# PART 5: TROUBLESHOOTING GUIDE

**Fence Estimator Pro** – 110+ Issues with Solutions

---

## CATEGORY 1: DATABASE ISSUES

### DB-01: Cannot Connect to MySQL
**Error:** `ECONNREFUSED 127.0.0.1:3306`
**Solution:**
```bash
sudo systemctl status mysql
sudo systemctl start mysql
# Check .env: DB_HOST=localhost DB_PORT=3306
```

### DB-02: Access Denied for User
**Error:** `Access denied for user 'fence_user'@'localhost'`
**Solution:**
```sql
GRANT ALL PRIVILEGES ON fence_estimator.* TO 'fence_user'@'localhost' IDENTIFIED BY 'password';
FLUSH PRIVILEGES;
```

### DB-03: Database Not Found
**Error:** `Unknown database 'fence_estimator'`
**Solution:**
```bash
mysql -u root -p -e "CREATE DATABASE fence_estimator;"
mysql -u fence_user -p fence_estimator < database/schema.sql
```

### DB-04: Table Does Not Exist
**Error:** `Table 'fence_estimator.users' doesn't exist`
**Solution:** Re-run schema: `mysql -u fence_user -p fence_estimator < database/schema.sql`

### DB-05: Duplicate Entry on Seed
**Error:** `Duplicate entry 'admin' for key 'users.username'`
**Solution:** Normal – seed uses `ON DUPLICATE KEY UPDATE`. Safe to ignore.

### DB-06: Character Set Error
**Error:** `Incorrect string value: '\xF0\x9F...'`
**Solution:**
```sql
ALTER DATABASE fence_estimator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE notes CONVERT TO CHARACTER SET utf8mb4;
```

### DB-07: Query Timeout
**Error:** Slow queries / timeouts on product search
**Solution:**
```sql
-- Rebuild full-text index
ALTER TABLE inventory DROP INDEX ft_inv_search;
ALTER TABLE inventory ADD FULLTEXT KEY ft_inv_search (name, description, sku);
```

### DB-08: Max Connections Reached
**Error:** `Too many connections`
**Solution:**
```sql
SET GLOBAL max_connections = 200;
-- Or in my.cnf: max_connections=200
```

### DB-09: Disk Full
**Error:** Database write fails
**Solution:** Free disk space: `df -h` | Delete old audit logs: `DELETE FROM audit_log WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);`

### DB-10: JSON Column Error
**Error:** `Invalid JSON value for column 'photos'`
**Solution:** Ensure photos are passed as valid JSON array: `'["photo1.jpg","photo2.jpg"]'`

---

## CATEGORY 2: BACKEND ISSUES

### BE-01: Backend Won't Start
**Error:** `Error: Cannot find module 'express'`
**Solution:** `cd backend && npm install`

### BE-02: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::3000`
**Solution:**
```bash
lsof -i :3000
kill -9 <PID>
# Or change PORT in .env
```

### BE-03: JWT Token Invalid
**Error:** `JsonWebTokenError: invalid signature`
**Solution:** Verify JWT_SECRET in .env is the same as when tokens were issued. Clear browser storage and log in again.

### BE-04: JWT Token Expired
**Error:** `TokenExpiredError: jwt expired`
**Solution:** User needs to log in again. Increase JWT_EXPIRES_IN in .env (e.g., `7d`).

### BE-05: CORS Error
**Error:** `Access to fetch at ... blocked by CORS policy`
**Solution:** In `backend/server.js`, add your frontend URL to CORS origins:
```javascript
cors({ origin: ['http://yourwebsite.com', 'http://localhost:5000'] })
```

### BE-06: Environment Variables Not Loading
**Error:** `DB_PASSWORD is undefined`
**Solution:**
```bash
# Verify .env file exists
ls -la backend/.env
# Install dotenv if missing
npm install dotenv
```

### BE-07: bcrypt Module Error
**Error:** `Error: Cannot find module 'bcrypt'`
**Solution:** `cd backend && npm install bcrypt`

### BE-08: Route Not Found
**Error:** `404 – /api/projects not found`
**Solution:** Check backend is running: `curl http://localhost:3000/api/health`

### BE-09: Request Too Large
**Error:** `413 Payload Too Large`
**Solution:** Add to server.js:
```javascript
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
```

### BE-10: Server Crash on Error
**Solution:** Use PM2 to auto-restart: `pm2 start server.js --name fence-estimator`

### BE-11: Cannot POST /api/auth/login
**Error:** `404`
**Solution:** Verify auth routes are registered in server.js: `app.use('/api/auth', authRoutes);`

### BE-12: Estimate Calculation Returns Wrong Values
**Solution:** Check input data types – `linearFeet` must be a number, not a string. Parse with `parseInt()`.

### BE-13: Cannot Save Large Contract Text
**Error:** `Data too long for column 'scope_of_work'`
**Solution:** Column is TEXT type (65535 chars). If still failing, alter to MEDIUMTEXT:
```sql
ALTER TABLE contracts MODIFY scope_of_work MEDIUMTEXT;
```

### BE-14: Node Version Incompatible
**Error:** `SyntaxError: Unexpected token '??='`
**Solution:** Upgrade Node.js to v16+: `nvm install 18 && nvm use 18`

### BE-15: Memory Leak / High RAM Usage
**Solution:** Add `--max-old-space-size=512` to Node: `node --max-old-space-size=512 server.js`

---

## CATEGORY 3: FRONTEND ISSUES

### FE-01: Page Shows Blank / White Screen
**Cause:** JavaScript error on load
**Solution:** Open browser DevTools (F12) → Console tab. Fix the first error shown.

### FE-02: Tab Content Not Showing
**Cause:** CSS not loaded
**Solution:** Verify `frontend/css/styles.css` exists and path is correct in index.html.

### FE-03: Estimate Not Calculating
**Cause:** Missing fence specs
**Solution:** Complete Tab 2 (Fence Specifications) first. `linearFeet` is required.

### FE-04: Data Not Saving
**Cause:** localStorage blocked (private/incognito mode)
**Solution:** Use regular browser mode. Check: `localStorage.setItem('test','1')`

### FE-05: Auto-save Not Working
**Cause:** Auto-save timer not started
**Solution:** Check `Storage.startAutoSave()` is called in `app.js`

### FE-06: Product Catalog Shows Empty
**Cause:** Backend not connected
**Solution:** The catalog falls back to 950 built-in products offline. If still empty, check the browser console for errors.

### FE-07: Canvas Drawing Not Working
**Cause:** Touch events not supported
**Solution:** Use mouse on desktop. Mobile touch events are handled via `touchstart`/`touchmove`.

### FE-08: Google Maps Not Showing
**Cause:** No API key
**Solution:** Add Google Maps API key in Admin Settings (Tab 15). Requires billing enabled on Google Cloud.

### FE-09: PDF Export Not Working
**Cause:** jsPDF library not loaded
**Solution:** Add jsPDF CDN to index.html:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

### FE-10: Form Data Disappears on Refresh
**Cause:** Not using auto-save
**Solution:** Click "Save" button on each tab. Auto-save runs every 30 seconds.

### FE-11: Currency Shows Wrong Format
**Solution:** `Calculations.formatCurrency()` uses standard format. Verify locale settings.

### FE-12: Notes Filter Not Working
**Solution:** Ensure note categories match the filter options: general, customer, materials, installation, permits, safety, billing.

### FE-13: Responsive Layout Broken on Mobile
**Solution:** Ensure `responsive.css` is loaded. Test with Chrome DevTools mobile simulation.

### FE-14: Tab Navigation Hard to Read on Mobile
**Solution:** Tab nav scrolls horizontally – swipe left/right on mobile.

### FE-15: Change Order "New Total" Not Updating
**Solution:** Click into the material/labour fields and tab out. The `input` event listener will recalculate.

### FE-16: Signature Field Not Accepting Text
**Solution:** The signature fields accept typed text. Ensure JavaScript is enabled.

### FE-17: Drawing Tool Not Responding
**Solution:** Click "Pen" tool button first. Canvas must have focus.

### FE-18: Admin Tab Not Visible
**Cause:** User role is not admin
**Solution:** Log in as admin user. Admin tab is hidden for estimator/crew roles.

### FE-19: File Upload Not Working
**Cause:** File too large (>20MB)
**Solution:** Compress images before uploading. Supported: PDF, PNG, JPG, DWG, SVG.

### FE-20: Price Lock Banner Not Showing
**Cause:** Contract not yet generated
**Solution:** Go to Tab 8, calculate estimate, then click "Create Contract".

---

## CATEGORY 4: SECURITY ISSUES

### SEC-01: JWT Secret Too Short
**Risk:** Brute-forceable tokens
**Solution:** Generate secure secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### SEC-02: SQL Injection Risk
**Solution:** Always use parameterized queries. The backend uses MySQL prepared statements.

### SEC-03: XSS in Notes
**Solution:** Notes are escaped using `escHtml()` before rendering. Never use `innerHTML` with user input directly.

### SEC-04: Password Too Weak
**Solution:** Enforce minimum 8 characters, 1 uppercase, 1 number, 1 symbol in registration.

### SEC-05: No HTTPS
**Risk:** Login credentials visible on network
**Solution:** Install SSL cert via Let's Encrypt:
```bash
sudo certbot --nginx -d yourwebsite.com
```

### SEC-06: Default Admin Password
**Risk:** Unauthorized access
**Solution:** Change admin password immediately after first login. Use the admin settings or SQL:
```sql
UPDATE users SET password_hash = NEW_HASH WHERE username = 'admin';
```

### SEC-07: Rate Limiting Not Configured
**Solution:** Backend includes express-rate-limit. Verify it's applied to `/api/auth/*` routes.

### SEC-08: CORS Too Permissive
**Risk:** Any site can make API calls
**Solution:** Set specific allowed origins in backend CORS config.

### SEC-09: Sensitive Data in localStorage
**Risk:** XSS attack exposing project data
**Solution:** Minimize sensitive data in localStorage. Auth tokens are stored; log out on shared computers.

### SEC-10: File Upload Validation
**Risk:** Malicious file upload
**Solution:** Backend validates file type and size. Never serve uploaded files as executable.

---

## CATEGORY 5: PERFORMANCE ISSUES

### PERF-01: Slow Product Search
**Solution:**
```sql
-- Ensure full-text index exists:
SHOW INDEX FROM inventory WHERE Key_name = 'ft_inv_search';
-- If not: ALTER TABLE inventory ADD FULLTEXT KEY ft_inv_search (name, description, sku);
```

### PERF-02: Slow Project List Loading
**Solution:** Add pagination to GET /projects. Default: 50 per page.

### PERF-03: High Memory Usage
**Solution:** Enable Node.js garbage collection logging: `node --expose-gc server.js`

### PERF-04: Slow Canvas Drawing
**Solution:** Canvas is hardware accelerated in modern browsers. Update browser if sluggish.

### PERF-05: Long Estimate Calculation Time
**Solution:** Estimate calculation is client-side JavaScript and should be instant. If slow, check browser DevTools performance tab.

### PERF-06: Database Query Slow
**Solution:**
```sql
-- Check slow query log
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
```

### PERF-07: Large Number of Notes Slowing UI
**Solution:** Notes are paginated by filter. If >500 notes, implement backend pagination.

### PERF-08: Too Many Files in Upload Gallery
**Solution:** Gallery is client-side only. Files are not stored on server – they're lost on page refresh. Implement server upload if persistence needed.

### PERF-09: Browser Tab Memory High
**Solution:** Close unused tabs in the browser. The SPA keeps all 17 tab states in memory.

### PERF-10: Slow API Response Times
**Solution:** Add caching for product catalog:
```javascript
// Cache products in memory for 5 minutes
let productCache = null;
let cacheTime = 0;
```

---

## CATEGORY 6: GENERAL ISSUES

### GEN-01: How to Reset Everything
```bash
# Clear database:
mysql -u fence_user -p -e "DROP DATABASE fence_estimator; CREATE DATABASE fence_estimator;"
mysql -u fence_user -p fence_estimator < database/schema.sql
mysql -u fence_user -p fence_estimator < database/seed.sql

# Clear frontend localStorage:
# Open browser console: localStorage.clear()
```

### GEN-02: How to Add a New User
```bash
# Via API:
curl -X POST http://localhost:3000/api/admin/users \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"user@co.com","password":"Pass123!","role":"estimator","company":"Fence Co"}'
```

### GEN-03: How to Export All Projects
```bash
# Via MySQL:
mysqldump -u fence_user -p fence_estimator projects estimates contracts > projects_backup.sql
```

### GEN-04: How to Update Product Prices
```sql
-- Increase all chain-link prices by 10%:
UPDATE inventory SET retail_price = ROUND(retail_price * 1.10, 2) WHERE category = 'chain-link';
```

### GEN-05: How to Change Tax Rate
Option A: Admin Dashboard → Tab 15 → Settings → Tax Rate
Option B: Update `TAX_RATE` in `frontend/js/calculations.js`

### GEN-06: How to Add New Product Category
1. Add category to `<select id="catalog-category-filter">` in index.html
2. Add products to database: `INSERT INTO inventory (sku, name, category, ...) VALUES (...)`
3. Update `MATERIAL_RATES` in calculations.js if it's a new fence type

### GEN-07: How to Print
Use browser print (Ctrl+P or Cmd+P) while on the relevant tab.
Print styles are defined in `css/responsive.css` under `@media print`.

### GEN-08: How to Backup Data
```bash
# Automated backup script (add to cron):
#!/bin/bash
DATE=$(date +%Y-%m-%d)
mysqldump -u fence_user -pfence_password fence_estimator | gzip > /backups/fence_estimator_$DATE.sql.gz
find /backups -name "*.sql.gz" -mtime +30 -delete
```

### GEN-09: How to Update the Software
```bash
cd /path/to/fence-estimator
git pull origin main
cd backend && npm install
pm2 restart fence-estimator
```

### GEN-10: Browser Compatibility
| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Fully supported |
| Firefox 88+ | ✅ Fully supported |
| Safari 14+ | ✅ Supported |
| Edge 90+ | ✅ Fully supported |
| IE 11 | ❌ Not supported |
| Mobile Chrome | ✅ Responsive |
| Mobile Safari | ✅ Responsive |

---

*Fence Estimator Pro – Troubleshooting Guide | Fence Depot © 2026*
