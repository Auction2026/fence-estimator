# PART 5: TROUBLESHOOTING GUIDE
## Fence Depot Fence Estimator — 110+ Issues & Solutions

---

## HOW TO USE THIS GUIDE

1. Find your issue in the category list below
2. Follow the numbered solution steps in order
3. Test after each step — stop when the problem is fixed

---

## CATEGORY A: INSTALLATION PROBLEMS

### A-01: "node is not recognized as an internal or external command"
**Cause:** Node.js is not installed or not in your system PATH.
**Solution:**
1. Go to https://nodejs.org and download the LTS version
2. Run the installer — make sure "Add to PATH" is checked
3. Restart your terminal (close and reopen)
4. Type `node --version` — should now show a version number

### A-02: npm install fails with "EACCES permission denied"
**Cause:** Your user account doesn't have write permission to the folder.
**Solution:**
1. Windows: Right-click terminal → "Run as Administrator"
2. Mac/Linux: Use `sudo npm install`
3. Or change the folder owner: `sudo chown -R $USER ~/.npm`

### A-03: npm install hangs / never finishes
**Cause:** Slow internet or npm registry timeout.
**Solution:**
1. Cancel with Ctrl+C
2. Clear npm cache: `npm cache clean --force`
3. Try again: `npm install`
4. If still failing: `npm install --legacy-peer-deps`

### A-04: "Cannot find module 'express'"
**Cause:** npm install was not run in the backend folder.
**Solution:**
1. Make sure you are in the `backend/` folder: `cd backend`
2. Run: `npm install`
3. Verify: `ls node_modules` — should list many folders

### A-05: Git clone fails "Permission denied (publickey)"
**Cause:** Repository is private and SSH key not set up.
**Solution:**
1. Use HTTPS instead: `git clone https://github.com/Auction2026/fence-estimator.git`
2. Enter your GitHub username and Personal Access Token (not password)

### A-06: "ERESOLVE unable to resolve dependency tree"
**Cause:** Package version conflicts.
**Solution:**
1. Run: `npm install --legacy-peer-deps`
2. Or: `npm install --force`

### A-07: Node version too old — package requires Node 14+
**Cause:** Old Node.js version installed.
**Solution:**
1. Check version: `node --version`
2. If v12 or older → uninstall and reinstall from nodejs.org (get LTS)
3. Or use nvm (Node Version Manager) to switch versions

### A-08: "EPERM: operation not permitted" on Windows
**Cause:** Windows antivirus or UAC blocking file operations.
**Solution:**
1. Temporarily disable antivirus real-time scanning
2. Run terminal as Administrator
3. Try install again

### A-09: "ENOENT: no such file or directory, open '.env'"
**Cause:** .env file not created.
**Solution:**
1. Copy the example: `cp .env.example .env` (Mac/Linux)
2. Windows: `copy .env.example .env`
3. Edit the .env file with your settings

### A-10: Python error during npm install
**Cause:** Some packages need Python for native compilation.
**Solution:**
1. Windows: `npm install --global windows-build-tools`
2. Mac: Install Xcode Command Line Tools: `xcode-select --install`
3. Linux: `sudo apt-get install python3 build-essential`

---

## CATEGORY B: DATABASE PROBLEMS

### B-01: "Access denied for user 'root'@'localhost'"
**Cause:** Wrong MySQL password.
**Solution:**
1. Try logging in with: `mysql -u root -p` and enter your password
2. If you forgot the password, reset it:
   - Stop MySQL service
   - Start with: `mysqld --skip-grant-tables`
   - Login: `mysql -u root`
   - Run: `ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';`
   - Restart MySQL normally

### B-02: "ERROR 1049 (42000): Unknown database 'fence_estimator'"
**Cause:** Database hasn't been created yet.
**Solution:**
1. Log in to MySQL: `mysql -u root -p`
2. Run: `CREATE DATABASE fence_estimator CHARACTER SET utf8mb4;`
3. Then run the schema: `source /path/to/database/schema.sql`

### B-03: Schema.sql fails — "Table already exists"
**Cause:** Running schema on a database that already has tables.
**Solution:**
1. The schema uses `CREATE TABLE IF NOT EXISTS` — this is safe to ignore
2. If you want a fresh start: `DROP DATABASE fence_estimator;` then recreate

### B-04: Seed.sql fails partway through
**Cause:** Duplicate PLU codes or syntax error.
**Solution:**
1. Check which line failed in the MySQL error output
2. Find that INSERT statement in seed.sql
3. Either fix the duplicate or add `INSERT IGNORE INTO` instead of `INSERT INTO`

### B-05: "Too many connections" error
**Cause:** MySQL connection pool exhausted.
**Solution:**
1. In MySQL: `SET GLOBAL max_connections = 200;`
2. In backend .env: reduce concurrent users or add connection pooling
3. Restart the backend server

### B-06: Database is slow — queries take more than 2 seconds
**Cause:** Missing indexes or large data set.
**Solution:**
1. Run migration 003: `source database/migrations/003_add_indexes.sql`
2. Run: `ANALYZE TABLE estimates, inventory_products;`
3. Check slow query log in MySQL

### B-07: "emoji characters not stored correctly" — shows ??? in database
**Cause:** Database character set not set to utf8mb4.
**Solution:**
1. In MySQL: `ALTER DATABASE fence_estimator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
2. Add to MySQL config (my.cnf): `character-set-server=utf8mb4`

### B-08: Cannot connect to MySQL from backend — "ECONNREFUSED"
**Cause:** MySQL not running, or wrong host/port in .env.
**Solution:**
1. Start MySQL: `sudo systemctl start mysql` (Linux) or start from Services (Windows)
2. Check .env: `DB_HOST=localhost` and `DB_PORT=3306`
3. Test connection: `mysql -u fence_app -p fence_estimator`

### B-09: Stored procedures fail to create
**Cause:** DELIMITER not supported in some MySQL clients.
**Solution:**
1. Use MySQL Workbench (GUI) to run the procedures file
2. Or use: `mysql -u root -p fence_estimator < database/procedures/stored_procedures.sql`

### B-10: "Row size too large" error when creating tables
**Cause:** Row format issue on older MySQL.
**Solution:**
1. Add to my.cnf: `innodb_file_format=Barracuda` and `innodb_file_per_table=ON`
2. Restart MySQL

### B-11: Forgot to USE the database before running schema
**Cause:** Running SQL without selecting the database first.
**Solution:**
1. In MySQL terminal: `USE fence_estimator;`
2. Then run your SQL commands

### B-12: Products not showing in the estimator after seed
**Cause:** Backend not connected to MySQL (using MongoDB instead).
**Solution:**
1. The backend uses MongoDB by default
2. Products in index.html come from the built-in INVENTORY_DB JavaScript array
3. MySQL is for long-term storage; the frontend inventory works standalone

---

## CATEGORY C: BACKEND SERVER PROBLEMS

### C-01: Server won't start — "Error: listen EADDRINUSE :::3001"
**Cause:** Another process is already using port 3001.
**Solution:**
1. Windows: `netstat -ano | findstr :3001` — find the PID, then `taskkill /PID [number] /F`
2. Mac/Linux: `lsof -ti:3001 | xargs kill`
3. Or change the port in .env: `PORT=3002`

### C-02: "JWT_SECRET is not defined" warning
**Cause:** .env file not loaded or missing JWT_SECRET variable.
**Solution:**
1. Make sure `.env` file exists in the `backend/` folder
2. Make sure it contains: `JWT_SECRET=your-secret-here`
3. Restart the server

### C-03: Server crashes on startup — "MongoServerError: connect ECONNREFUSED"
**Cause:** MongoDB not running.
**Solution:**
1. Start MongoDB: `mongod` (or `sudo systemctl start mongod`)
2. Or change MONGO_URI in .env to point to MongoDB Atlas (cloud)
3. Or switch to MySQL by updating the database connection code

### C-04: API returns 404 for all routes
**Cause:** Server not running, or wrong API URL.
**Solution:**
1. Check if server is running: visit `http://localhost:3001/health`
2. Make sure you started server with `npm start` from the `backend/` folder
3. Check for typos in the API URL

### C-05: CORS error in browser console
**Cause:** Frontend and backend on different origins without CORS configured.
**Solution:**
1. In `backend/server.js`, the CORS middleware is already configured
2. Make sure the backend is running: `npm start`
3. If using a custom domain, add it to the CORS whitelist in server.js

### C-06: "UnauthorizedError: No authorization token was found"
**Cause:** Frontend not sending JWT token with API request.
**Solution:**
1. Log in through the frontend to get a token
2. Token is stored in localStorage automatically
3. If testing with Postman: add header `Authorization: ******

### C-07: PDF generation fails — "Cannot find module 'pdfkit'"
**Cause:** pdfkit package not installed.
**Solution:**
1. In backend folder: `npm install pdfkit`
2. Or reinstall all: `npm install`

### C-08: Emails not sending
**Cause:** Email credentials in .env are wrong or Gmail blocking.
**Solution:**
1. For Gmail: enable "App Passwords" in Google Account security settings
2. Use the App Password (16-digit) as EMAIL_PASS in .env, not your regular password
3. Make sure `EMAIL_USER` matches the Gmail address
4. Test with: `telnet smtp.gmail.com 587`

### C-09: Server works but is very slow
**Cause:** Debug logging, synchronous operations, or missing indexes.
**Solution:**
1. Set `NODE_ENV=production` in .env
2. Check for console.log statements causing slowness
3. Add database indexes (migration 003)
4. Consider using PM2 for process management: `npm install -g pm2 && pm2 start server.js`

### C-10: "Error: secretOrPrivateKey must have a value" — JWT error
**Cause:** JWT_SECRET not set in .env.
**Solution:**
1. Open `.env` and add: `JWT_SECRET=any-long-random-string-here-minimum-32-chars`
2. Save and restart server

### C-11: Server crashes after running for a while — memory leak
**Cause:** Unclosed database connections or accumulation of data in memory.
**Solution:**
1. Use PM2 to auto-restart: `pm2 start server.js --max-memory-restart 500M`
2. Check for missing `await` in async functions
3. Ensure all database connections are properly closed

### C-12: "Cannot read property of undefined" — runtime crash
**Cause:** Missing data in request body.
**Solution:**
1. Add validation to API routes (already in server.js for main routes)
2. Check browser network tab to see what data is being sent
3. Ensure all required fields are being filled before submitting

---

## CATEGORY D: FRONTEND / APP PROBLEMS

### D-01: Page shows blank — white screen
**Cause:** JavaScript error on load.
**Solution:**
1. Open browser: press F12 → Console tab
2. Look for red error messages
3. Most common: missing closing bracket `}` or `>` in HTML
4. Try clearing browser cache: Ctrl+Shift+Delete

### D-02: Tabs not switching when clicked
**Cause:** JavaScript not loading, or event listener error.
**Solution:**
1. Press F12 → Console — look for errors
2. Make sure you're opening the file from a server (not double-clicking on Mac)
3. Try a different browser (Chrome recommended)

### D-03: "calculateAndRenderMaterials is not a function" error
**Cause:** Script loading issue or function not defined.
**Solution:**
1. Hard refresh: Ctrl+F5
2. Check browser console for earlier errors that might have stopped script loading
3. Make sure index.html is complete (not truncated)

### D-04: Products not showing in estimate calculations
**Cause:** INVENTORY_DB not loaded or empty.
**Solution:**
1. Open browser console and type: `console.log(INVENTORY_DB.length)`
2. Should return 61 or more
3. If 0 or undefined, the script block containing INVENTORY_DB has an error

### D-05: Estimate amounts show NaN or $0.00
**Cause:** Form fields not being read correctly.
**Solution:**
1. Make sure all required fields are filled in the estimate wizard
2. Check that fence type and linear footage are selected
3. Open console and look for calculation errors

### D-06: Print/PDF not working
**Cause:** Browser blocking popup, or print function error.
**Solution:**
1. Allow popups for localhost in browser settings
2. Use Ctrl+P to print manually
3. In Chrome: click the three dots → Print

### D-07: Mobile view is broken — buttons overlapping
**Cause:** Viewport meta tag issue or CSS conflict.
**Solution:**
1. index.html already has `<meta name="viewport" ...>` in the head
2. Try rotating device to landscape mode
3. For better mobile experience, access from a desktop browser

### D-08: Login screen keeps appearing after logging in
**Cause:** localStorage not saving session data, or browser blocking localStorage.
**Solution:**
1. Allow localStorage: Browser Settings → Privacy → Allow localStorage for localhost
2. Try incognito mode to test
3. Make sure you're not in a sandboxed iframe environment

### D-09: Customer data not saving between sessions
**Cause:** Expected — localStorage saves in the browser, data clears if browser storage is cleared.
**Solution:**
1. Don't clear browsing data if you want to keep local data
2. For permanent storage: use the backend API (requires backend running)
3. Export/print estimates before closing the session

### D-10: Estimate number not incrementing
**Cause:** localStorage counter reset.
**Solution:**
1. Open browser console: `localStorage.getItem('estimateSequence')`
2. Set manually: `localStorage.setItem('estimateSequence', '100')`
3. Reload the page

### D-11: App not loading in Internet Explorer
**Cause:** IE is not supported (outdated browser).
**Solution:**
1. Use Chrome, Firefox, Edge, or Safari
2. Internet Explorer is no longer supported by Microsoft
3. Download Chrome: https://chrome.google.com

### D-12: Images / icons not displaying
**Cause:** Icons use emoji or Unicode — font rendering issue.
**Solution:**
1. All icons in this app use emoji (no external image files needed)
2. Make sure system fonts are up to date
3. Try a different browser

---

## CATEGORY E: ESTIMATE CALCULATION PROBLEMS

### E-01: Materials list is wrong / incomplete
**Cause:** Inventory DB items not matching fence type selection.
**Solution:**
1. Open index.html and search for `INVENTORY_DB`
2. Verify the PLU codes match the lookup functions (findMesh, findTensionWire, etc.)
3. Parts 2–7 of the inventory database are pending import

### E-02: Post count calculation seems off
**Cause:** Post spacing formula.
**Solution:**
- Formula: `Number of posts = ceil(linear_feet / post_spacing) + 1`
- Default spacing: 10 feet for chain link, 8 feet for wood
- Corner and gate posts add extra posts

### E-03: Price seems too high or too low
**Cause:** Markup percentage or tax rate.
**Solution:**
1. Default markup: 20% (adjustable per estimate)
2. Default tax: 5% GST
3. Adjust in the estimate settings or in the code constants

### E-04: Labor cost not calculating
**Cause:** Labor rate not set or labor hours at zero.
**Solution:**
1. Default labor rate: $65/hour
2. Labor hours auto-calculate based on linear footage
3. Chain link: ~1 hour per 10 linear feet
4. Wood: ~1 hour per 8 linear feet
5. Override manually in the estimate if needed

### E-05: Estimate total doesn't match line items
**Cause:** Rounding or markup applied differently.
**Solution:**
1. Run stored procedure: `CALL sp_recalculate_estimate_totals(estimate_id);`
2. Or recalculate manually: material + labor + equipment + markup + tax

### E-06: Change order amounts not reflecting in project total
**Cause:** Change orders are separate records — must be summed manually.
**Solution:**
1. Project total = Base estimate + Sum of all approved change orders
2. Query: `SELECT SUM(total_delta) FROM change_orders WHERE project_id=? AND status='approved'`

---

## CATEGORY F: NETWORK / API PROBLEMS

### F-01: Frontend can't connect to backend — network error
**Cause:** Backend server not running, or wrong API URL.
**Solution:**
1. Make sure backend is running: `cd backend && npm start`
2. Visit `http://localhost:3001/health` in browser
3. In index.html, verify API_BASE constant matches your backend URL

### F-02: API works in Postman but not in browser
**Cause:** CORS issue.
**Solution:**
1. Backend already has CORS enabled for all origins in development
2. In production, update CORS whitelist to your domain only

### F-03: "Failed to fetch" error in browser console
**Cause:** Backend is down or unreachable.
**Solution:**
1. Check terminal where you ran `npm start` — look for error messages
2. Restart the backend: Ctrl+C then `npm start` again
3. Check if antivirus is blocking port 3001

### F-04: Slow API responses (more than 3 seconds)
**Cause:** Database query taking too long, or too much data.
**Solution:**
1. Add database indexes (migration 003)
2. Add pagination to list queries
3. Use `EXPLAIN` in MySQL to analyze slow queries

### F-05: 401 Unauthorized on all API calls
**Cause:** JWT token expired or not included.
**Solution:**
1. Log out and log back in (refreshes the token)
2. Token expires after 7 days by default (set in JWT_EXPIRY in .env)
3. Frontend automatically handles token refresh on login

### F-06: 500 Internal Server Error from API
**Cause:** Server-side error — check the backend terminal for the stack trace.
**Solution:**
1. Look at the terminal where the backend is running
2. Find the error message and line number
3. Fix the issue or check GitHub issues for known bugs

---

## CATEGORY G: DEPLOYMENT / PRODUCTION PROBLEMS

### G-01: How to run 24/7 without keeping terminal open
**Solution:**
1. Install PM2: `npm install -g pm2`
2. Start: `pm2 start backend/server.js --name fence-estimator`
3. Auto-start on reboot: `pm2 startup && pm2 save`
4. Monitor: `pm2 status`

### G-02: Deploying to a web hosting server (VPS)
**Solution:**
1. Upload code: `git pull origin main` on the server
2. Install dependencies: `npm install --production`
3. Set environment variables in the server's control panel or .env
4. Start with PM2 (see G-01)
5. Set up a reverse proxy with Nginx to serve on port 80/443

### G-03: SSL / HTTPS not working
**Solution:**
1. Get a free SSL certificate from Let's Encrypt: https://letsencrypt.org
2. Use Certbot: `sudo certbot --nginx`
3. Update FRONTEND_URL in .env to use `https://`

### G-04: App slow on production server
**Solution:**
1. Set `NODE_ENV=production` in .env
2. Enable gzip compression in Express (already included in server.js)
3. Use a CDN for static files
4. Optimize database queries with indexes

### G-05: How to back up the database
**Solution:**
1. Manual backup: `mysqldump -u root -p fence_estimator > backup_$(date +%Y%m%d).sql`
2. Automated: Add a cron job:
   ```
   0 2 * * * mysqldump -u root -p'password' fence_estimator > /backups/fence_$(date +\%Y\%m\%d).sql
   ```

### G-06: How to update the app with new code
**Solution:**
1. Pull latest code: `git pull origin main`
2. Install new packages: `npm install`
3. Restart server: `pm2 restart fence-estimator`
4. Run any new migrations in the database folder

### G-07: Multiple users logging in at the same time — conflicts
**Solution:**
1. The JWT-based auth system handles multiple concurrent users
2. Each user gets their own token
3. If you see data mixing between users, check that API routes are using `req.user.id` to filter data

### G-08: Running on a Mac for team use (sharing on local network)
**Solution:**
1. Find your Mac's local IP: System Preferences → Network → IP address
2. Start backend on that IP: `HOST=0.0.0.0 npm start`
3. Other computers on the same WiFi can access: `http://192.168.x.x:3001`

---

## CATEGORY H: PRICING & INVENTORY PROBLEMS

### H-01: Prices are outdated / wrong
**Solution:**
1. Update inventory_products table:
   ```sql
   UPDATE inventory_products SET sell_price=12.99 WHERE plu='CL-PL-163-08';
   ```
2. Or import a new seed file with updated prices
3. Use the Inventory tab in the app (when backend is connected) to update prices

### H-02: Product not found in estimate calculations
**Solution:**
1. Check that the PLU code exists: `SELECT * FROM inventory_products WHERE plu='YOUR-PLU';`
2. Add missing product:
   ```sql
   INSERT INTO inventory_products (plu, description, department, unit_of_measure, cost_price, sell_price) VALUES ('NEW-PLU', 'Product Name', 'Chain Link', 'EA', 5.00, 6.50);
   ```

### H-03: Pricing locked — cannot edit estimate
**Solution:**
1. Pricing lock is a feature to prevent accidental changes to approved estimates
2. Admin can unlock: `UPDATE estimates SET pricing_locked=0 WHERE id=?;`
3. Or use the Unlock button in the app (admin role required)

### H-04: Estimate shows old prices after price update
**Solution:**
1. Line items store the price at the time of estimate creation
2. Recalculate to get new prices: delete line items and re-add them
3. Or use the change order system to document the price difference

---

## CATEGORY I: USER / LOGIN PROBLEMS

### I-01: Forgot admin password
**Solution:**
1. In MySQL: 
   ```sql
   UPDATE users SET password_hash='$2b$10$new-bcrypt-hash' WHERE username='admin';
   ```
2. To generate a new bcrypt hash: use https://bcrypt-generator.com (rounds=10)
3. Or reset via the backend API if you set up a reset email

### I-02: New user can't log in
**Solution:**
1. Make sure user was created with a hashed password (not plain text)
2. Check that `is_active=1` in the users table
3. Verify username/email spelling

### I-03: "Role" permission not working — estimator sees admin features
**Solution:**
1. Role checking is implemented in the backend middleware
2. Frontend shows/hides UI based on role stored in localStorage
3. Hard refresh (Ctrl+F5) after role change

### I-04: Session expires too quickly
**Solution:**
1. In .env, add: `JWT_EXPIRY=30d` (30 days)
2. Default is 7 days
3. Restart the backend for changes to take effect

---

## CATEGORY J: MISCELLANEOUS PROBLEMS

### J-01: App displays in wrong language
**Solution:**
1. App is English-only currently
2. Browser translation: right-click → "Translate to English" for any foreign text

### J-02: Date format is wrong (DD/MM vs MM/DD)
**Solution:**
1. Date format is set in the JavaScript — search for `toLocaleDateString` in index.html
2. Change locale: `new Date().toLocaleDateString('en-CA')` for Canadian format

### J-03: Estimate PDF has wrong company name
**Solution:**
1. Search `index.html` for "Fence Depot" and replace with your company name
2. Update server.js PDF generation section for the backend-generated PDFs

### J-04: How to add a new fence type
**Solution:**
1. In `index.html`, find the fence type selection buttons
2. Add a new button with your fence type name
3. Add calculation logic in `calculateAndRenderMaterials()`
4. Add products to INVENTORY_DB
5. In database: add the new type to the ENUM in `fence_specifications` table

### J-05: How to add a new tab
**Solution:**
1. Add a tab button in the navigation bar section of index.html
2. Add a `<div id="newtab-tab" class="tab-content">` section
3. Add the tab's HTML content inside that div
4. The `switchTab()` function handles visibility automatically

### J-06: Export to Excel / CSV
**Solution:**
1. Open the estimate in the app
2. Press Ctrl+P → Save as PDF
3. Or: right-click the materials table → Inspect → Copy the HTML
4. Excel export feature is planned for a future update

### J-07: App not printing correctly
**Solution:**
1. Use Chrome browser for best print support
2. In print dialog: uncheck "Headers and Footers"
3. Set margins to "Minimum"
4. Scale: 90% for better fit

### J-08: How to update from an older version of the app
**Solution:**
1. `git pull origin main`
2. `npm install` in backend folder
3. Check for new migration files in `database/migrations/`
4. Run any new migration files
5. Restart server

### J-09: Multiple office locations — how to handle
**Solution:**
1. Add a `location` field to the users table
2. Filter estimates by `estimator_id` and their location
3. Or use separate databases for each location

### J-10: Customers want a copy of their estimate
**Solution:**
1. Use the "Email Estimate" button (requires email configured in .env)
2. Or print to PDF and share the file
3. Or click "Share Estimate" to generate a link (backend feature)

---

## QUICK DIAGNOSTIC CHECKLIST

When something is wrong, run through this list:

```
□ Is Node.js installed? (node --version)
□ Is MySQL running? (mysql -u root -p)
□ Is the backend server running? (http://localhost:3001/health)
□ Is the .env file properly filled out?
□ Are there errors in the browser console? (F12 → Console)
□ Are there errors in the backend terminal?
□ Is the database schema loaded? (SHOW TABLES in MySQL)
□ Is seed data loaded? (SELECT COUNT(*) FROM inventory_products)
□ Is npm install complete? (ls backend/node_modules)
□ Is the JWT_SECRET set in .env?
```

If all boxes are checked and problem persists, check the GitHub Issues page or contact your programmer.

---

## GETTING HELP

- **GitHub Issues:** https://github.com/Auction2026/fence-estimator/issues
- **Node.js Docs:** https://nodejs.org/docs
- **MySQL Docs:** https://dev.mysql.com/doc/
- **Express.js Docs:** https://expressjs.com
