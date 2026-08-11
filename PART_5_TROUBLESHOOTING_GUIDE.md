# PART 5: TROUBLESHOOTING GUIDE
## Fence Depot Fence Estimator - 110+ Issues with Solutions

---

## TABLE OF CONTENTS

1. [Installation Issues](#1-installation-issues)
2. [Database Connection Issues](#2-database-connection-issues)
3. [Login & Authentication Issues](#3-login--authentication-issues)
4. [Frontend Display Issues](#4-frontend-display-issues)
5. [Estimate Calculation Issues](#5-estimate-calculation-issues)
6. [Contract & PDF Issues](#6-contract--pdf-issues)
7. [Email Issues](#7-email-issues)
8. [API & Server Issues](#8-api--server-issues)
9. [Mobile & Responsive Issues](#9-mobile--responsive-issues)
10. [Performance Issues](#10-performance-issues)
11. [Data & Backup Issues](#11-data--backup-issues)
12. [Production Deployment Issues](#12-production-deployment-issues)

---

## 1. INSTALLATION ISSUES

### Issue 1.1: "node is not recognized as a command"
**Symptom**: Running `node --version` gives error "node is not recognized"
**Cause**: Node.js is not installed or not in PATH
**Solution**:
1. Download Node.js from: https://nodejs.org (choose LTS version)
2. Run the installer - check "Add to PATH" option
3. Close and reopen your Command Prompt/Terminal
4. Run: `node --version` - should show version number

### Issue 1.2: "npm is not recognized as a command"
**Symptom**: Running `npm install` gives error
**Cause**: npm is not in PATH
**Solution**:
1. npm comes with Node.js - reinstall Node.js
2. Windows: Search for "Environment Variables" → Add npm to PATH
3. Mac/Linux: Run `echo 'export PATH=/usr/local/bin:$PATH' >> ~/.bash_profile`

### Issue 1.3: npm install fails with ENOENT error
**Symptom**: `npm install` shows "ENOENT: no such file or directory"
**Cause**: You are not in the correct folder
**Solution**:
```bash
# Make sure you are in the backend folder
cd /path/to/fence-estimator/backend
ls  # Should see package.json
npm install
```

### Issue 1.4: npm install fails with permission error
**Symptom**: `npm install` shows "EACCES: permission denied"
**Solution**:
```bash
# Mac/Linux - fix npm permissions
sudo chown -R $USER ~/.npm
sudo chown -R $USER /usr/local/lib/node_modules
npm install

# Windows - run Command Prompt as Administrator
```

### Issue 1.5: "Cannot find module 'express'"
**Symptom**: Server starts but crashes with module error
**Cause**: npm install was not run or failed
**Solution**:
```bash
cd backend
rm -rf node_modules
npm install
npm start
```

### Issue 1.6: Package version conflicts
**Symptom**: npm install shows "peer dependency" warnings
**Solution**:
```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps
```

### Issue 1.7: Installation takes too long or hangs
**Solution**:
```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

### Issue 1.8: Git clone fails
**Symptom**: `git clone` shows authentication error
**Solution**:
1. Make sure you have Git installed: https://git-scm.com
2. If repository is private, set up SSH key or use personal access token
3. Run: `git clone https://YOUR_TOKEN@github.com/Auction2026/fence-estimator.git`

### Issue 1.9: "EADDRINUSE: port already in use"
**Symptom**: Server won't start - "Port 3000 already in use"
**Solution**:
```bash
# Windows - find and kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or change port in .env file
PORT=3001
```

### Issue 1.10: "Error: Cannot find module './config'"
**Symptom**: Server crashes looking for config file
**Solution**:
1. Make sure .env file exists in the backend folder
2. Copy from template: `cp .env.example .env`
3. Edit .env with your settings

---

## 2. DATABASE CONNECTION ISSUES

### Issue 2.1: MongoDB won't start
**Symptom**: `mongosh` gives "Connection refused"
**Solution**:
```bash
# Windows - start MongoDB service
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
sudo systemctl status mongod  # Check status
```

### Issue 2.2: "MongoNetworkError: connect ECONNREFUSED 127.0.0.1:27017"
**Symptom**: Server cannot connect to MongoDB
**Solution**:
1. Start MongoDB (see Issue 2.1)
2. Check MONGO_URI in .env file
3. For local: `MONGO_URI=mongodb://localhost:27017/fence_estimator_db`

### Issue 2.3: MongoDB Atlas connection fails
**Symptom**: "MongoServerError: bad auth" or "connection timeout"
**Solution**:
1. Check username and password in connection string
2. Make sure IP address is whitelisted in Atlas
3. In Atlas: Network Access → Add IP Address → Add Current IP
4. Connection string format: `******cluster.xxxxx.mongodb.net/fence_estimator_db`

### Issue 2.4: "MongoServerError: Authentication failed"
**Solution**:
1. Check MONGO_URI has correct username and password
2. In Atlas: Database Access → Edit user → Reset password
3. Update MONGO_URI with new password

### Issue 2.5: Database keeps disconnecting
**Solution**:
```javascript
// In .env file, add these options:
MONGO_URI=mongodb://localhost:27017/fence_estimator_db?connectTimeoutMS=30000&socketTimeoutMS=30000
```

### Issue 2.6: "MongoError: E11000 duplicate key error"
**Symptom**: Cannot create new user or project
**Cause**: Trying to create duplicate email or username
**Solution**:
1. Use a different email address
2. Check if user already exists: `mongosh` → `db.users.find({email: "test@test.com"})`

### Issue 2.7: MongoDB uses too much memory
**Solution**:
```bash
# Add memory limit to MongoDB config
# Edit /etc/mongod.conf or mongod.cfg:
storage:
  wiredTiger:
    engineConfig:
      cacheSizeGB: 0.5  # Limit to 500MB
```

### Issue 2.8: Data not saving to database
**Solution**:
1. Check server logs for errors
2. Verify MongoDB is running
3. Check that .env MONGO_URI is correct
4. Test with: `curl -X POST http://localhost:3000/api/projects -H "Content-Type: application/json" -d '{"name":"test"}'`

### Issue 2.9: Database getting too large
**Solution**:
```bash
# Check database size
mongosh
use fence_estimator_db
db.stats()

# Clean up old data
db.projects.deleteMany({status: "deleted", createdAt: {$lt: new Date(Date.now() - 90*24*60*60*1000)}})
```

### Issue 2.10: "MongoParseError: Invalid connection string"
**Solution**: Check your MONGO_URI format - no spaces, correct format:
```
mongodb://localhost:27017/fence_estimator_db
```

---

## 3. LOGIN & AUTHENTICATION ISSUES

### Issue 3.1: Cannot login - "Invalid credentials"
**Symptom**: Login fails even with correct password
**Solution**:
1. Check Caps Lock is off
2. Try resetting password through admin
3. Check MongoDB to verify user exists: `db.users.find({email: "your@email.com"})`

### Issue 3.2: "JWT must be provided" error
**Symptom**: API calls fail after login
**Cause**: Token not being sent with requests
**Solution**:
1. Make sure you are logged in
2. Check browser's localStorage: Open DevTools → Application → Local Storage
3. Verify 'token' key exists

### Issue 3.3: "JsonWebTokenError: invalid signature"
**Symptom**: Authentication fails after working previously
**Cause**: JWT_SECRET changed in .env file
**Solution**:
1. All users need to log out and log back in
2. Old tokens are invalid when JWT_SECRET changes

### Issue 3.4: Token expires too quickly
**Solution**: Edit server.js to extend token expiration:
```javascript
// Find this line in server.js and change expiresIn
const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });
```

### Issue 3.5: Cannot register new user - "User already exists"
**Solution**:
1. Use a different email address
2. Or delete existing user from database: `db.users.deleteOne({email: "existing@email.com"})`

### Issue 3.6: Cannot register - server returns 500 error
**Solution**:
1. Check server logs for specific error
2. Verify MongoDB is connected
3. Make sure JWT_SECRET is set in .env

### Issue 3.7: Login page not showing
**Solution**:
1. Open frontend/index.html in browser
2. Click the login button/tab
3. If page is blank, check browser console for errors (F12)

### Issue 3.8: Forgot password - no reset email
**Solution** (manual reset via database):
```bash
mongosh
use fence_estimator_db
# Generate new bcrypt hash for "newpassword"
# Then update:
db.users.updateOne(
  {email: "user@example.com"},
  {$set: {password: "$2a$10$new_bcrypt_hash_here"}}
)
```
Or add a password reset API endpoint in server.js.

### Issue 3.9: Multiple users getting logged out suddenly
**Cause**: JWT_SECRET was changed or server restarted
**Solution**: Users need to log in again - this is normal behavior

### Issue 3.10: "Access denied" even when logged in
**Solution**:
1. Check user role in database - needs to be 'admin' or 'estimator'
2. Log out and log back in to refresh token

---

## 4. FRONTEND DISPLAY ISSUES

### Issue 4.1: Page is blank or shows errors
**Solution**:
1. Press F12 to open Developer Tools
2. Click "Console" tab
3. Look for red error messages
4. Most common fix: clear browser cache (Ctrl+Shift+Delete)

### Issue 4.2: Tabs not working
**Solution**:
1. Check that JavaScript is enabled in browser
2. Open console (F12) for errors
3. Make sure frontend/js/app.js is loaded
4. Verify file path in index.html `<script>` tags

### Issue 4.3: CSS styles not loading
**Solution**:
1. Check that css/styles.css exists
2. Verify `<link>` tag in index.html points to correct path
3. Try hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

### Issue 4.4: "Cannot GET /api/projects" shown in browser
**Cause**: Opening frontend directly and making API calls to non-running backend
**Solution**: Start the backend server first: `cd backend && npm start`

### Issue 4.5: Forms not submitting
**Solution**:
1. Check for validation errors on form fields
2. Open console for JavaScript errors
3. Make sure you are logged in

### Issue 4.6: Numbers showing as NaN or undefined
**Cause**: Calculation error or missing value
**Solution**:
1. Enter values in all required fields
2. Make sure numeric fields contain numbers (not text)

### Issue 4.7: Table data not displaying
**Solution**:
1. Verify API call is returning data (check Network tab in DevTools)
2. Check that you have created data to display
3. Refresh the page

### Issue 4.8: Map tab not loading
**Solution**:
1. Google Maps requires an API key
2. Get free API key: https://console.cloud.google.com
3. Enable Maps JavaScript API
4. Add key to frontend/js/tools/mapping.js

### Issue 4.9: Canvas drawing not working
**Solution**:
1. Make sure you are using a modern browser (Chrome, Firefox, Edge)
2. Drawing.js requires HTML5 Canvas support
3. Try refreshing the page

### Issue 4.10: Printing looks wrong
**Solution**:
1. Use Chrome browser for best print results
2. In print dialog, select "More settings" → "Background graphics" ON
3. Set margins to "Minimum"

---

## 5. ESTIMATE CALCULATION ISSUES

### Issue 5.1: Materials total is zero
**Solution**:
1. Enter fence linear footage on the Fence Specs tab
2. Select fence type, height, and gauge
3. Click "Calculate Materials" button

### Issue 5.2: Wrong material quantities calculated
**Solution**:
1. Verify all specs are correct (height, gauge, terrain)
2. Check that product prices are in the inventory database
3. Review the FENCE_MATERIAL_SPECIFICATIONS.md file for correct ratios

### Issue 5.3: Tax not calculating
**Solution**:
1. Enter tax rate as a percentage (e.g., "8.5" not "0.085")
2. Tax is calculated on materials + labor subtotal
3. Check that tax rate field is not empty

### Issue 5.4: Total doesn't match sum of parts
**Solution**: The total should be: Materials + Labor + Equipment + Tax
If it doesn't match, reload the page and recalculate.

### Issue 5.5: Labor cost is zero
**Solution**:
1. Enter number of labor hours
2. Enter hourly rate
3. Or enter a fixed labor amount

### Issue 5.6: Estimate amounts keep changing
**Solution**: Save the estimate before printing - data in unsaved forms can be lost on page refresh.

### Issue 5.7: Negative numbers in estimate
**Cause**: Usually a data entry error
**Solution**: Check all input fields for negative values or incorrect math.

### Issue 5.8: Estimate not saving
**Solution**:
1. Check that a project is selected/created
2. Verify you are logged in
3. Check server logs for errors

### Issue 5.9: Cannot create second estimate for same project
**Solution**: Multiple estimates per project are allowed. Create a new one from the Estimates tab.

### Issue 5.10: Prices in inventory don't match estimate
**Solution**: Update product prices in the Inventory tab. Estimates use current prices when created.

---

## 6. CONTRACT & PDF ISSUES

### Issue 6.1: PDF not generating
**Solution**:
1. Check that PDFKit is installed: `npm list pdfkit`
2. If missing: `npm install pdfkit`
3. Check server logs for errors

### Issue 6.2: PDF is blank
**Solution**:
1. Make sure estimate data is complete
2. Check server console for PDF generation errors
3. Verify the /public folder exists and is writable

### Issue 6.3: Contract number not auto-generating
**Solution**: Contract numbers are generated on the server. Make sure backend is running.

### Issue 6.4: Cannot download PDF
**Solution**:
1. Check browser popup blocker - allow popups from localhost
2. Try right-click → "Save link as" on the PDF link
3. Check that the file was saved in backend/public folder

### Issue 6.5: PDF fonts look wrong
**Solution**: PDFKit uses built-in fonts. For custom fonts, add font files to backend/fonts/ folder.

### Issue 6.6: Contract terms not showing in PDF
**Solution**: Type contract terms in the Contract tab before generating PDF.

### Issue 6.7: Signature not saving
**Solution**:
1. Draw signature using mouse (click and drag)
2. Click "Save Signature" button
3. Signature is saved as an image

### Issue 6.8: Contract shows wrong customer info
**Solution**: Update customer information on Project Info tab and save before generating contract.

### Issue 6.9: Multiple page PDF cutting off content
**Solution**: PDFKit handles multi-page automatically. If content is cut off, this is a bug - check server logs.

### Issue 6.10: PDF generation is slow
**Solution**: Large PDFs with many photos can be slow. Resize photos before uploading.

---

## 7. EMAIL ISSUES

### Issue 7.1: Email not sending
**Solution**:
1. Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in .env
2. For Gmail: enable 2FA and use App Password (not regular password)
3. Check server logs for "Nodemailer" errors

### Issue 7.2: Gmail authentication fails
**Solution**:
1. Go to Google Account → Security → 2-Step Verification → Turn ON
2. Go to App passwords → Select app: Mail → Generate
3. Use the 16-character app password in EMAIL_PASS (not your Gmail password)

### Issue 7.3: "ECONNECTION" email error
**Solution**:
1. Check EMAIL_PORT: Gmail uses 587 (TLS) or 465 (SSL)
2. Check firewall is not blocking outbound port 587
3. Try port 465 with `secure: true`

### Issue 7.4: Emails going to spam
**Solution**:
1. Use your own domain email (not Gmail) for business emails
2. Set up SPF and DKIM records for your domain
3. Use a transactional email service like SendGrid or Mailgun

### Issue 7.5: Email attachments too large
**Solution**: Compress PDFs before attaching, or use a link instead of attachment.

### Issue 7.6: Cannot configure email
**Solution**: Email feature is optional. The app works without it. Skip email setup if not needed.

### Issue 7.7: "Message rejected" by email server
**Solution**: Some email providers require additional verification. Check your email provider's SMTP settings.

### Issue 7.8: Email works locally but not in production
**Solution**: Check that your production server allows outbound SMTP traffic (port 587).

---

## 8. API & SERVER ISSUES

### Issue 8.1: Server crashes on startup
**Solution**:
1. Check the error message in the console
2. Most common: missing .env file or MongoDB not running
3. Run: `node server.js` to see detailed error

### Issue 8.2: API returns 401 Unauthorized
**Solution**:
1. You are not logged in
2. Your token has expired - log in again
3. Token is not being sent - check api.js

### Issue 8.3: API returns 404 Not Found
**Solution**:
1. Check the API endpoint URL
2. Make sure you are using the correct ID
3. The resource may have been deleted

### Issue 8.4: API returns 500 Internal Server Error
**Solution**:
1. Check server console for detailed error message
2. This is usually a code bug - check server.js
3. Check that MongoDB is connected

### Issue 8.5: CORS error in browser console
**Symptom**: "Access to fetch at 'http://localhost:3000' from origin 'http://localhost:5000' has been blocked"
**Solution**:
1. CORS is already enabled in server.js
2. Make sure you are accessing the API from the correct URL
3. Check server.js cors() middleware is active

### Issue 8.6: Server keeps restarting
**Solution**:
1. There is a recurring error causing crashes
2. Check logs: `pm2 logs fence-estimator`
3. Fix the underlying error in server.js

### Issue 8.7: Slow API responses
**Solution**:
1. Add indexes to MongoDB queries (see database/migrations/002_indexes.sql)
2. Check MongoDB connection is healthy
3. Add pagination to large data queries

### Issue 8.8: API file upload not working
**Solution**:
1. Check that multer is installed
2. Verify the uploads folder exists and is writable
3. Check file size limits in server.js

### Issue 8.9: Cannot delete project - "403 Forbidden"
**Solution**: Only the project creator or admin can delete. Log in as admin to delete any project.

### Issue 8.10: API request times out
**Solution**:
1. Check MongoDB is responding quickly
2. Look for slow queries in server logs
3. Check server resources (CPU/memory usage)

---

## 9. MOBILE & RESPONSIVE ISSUES

### Issue 9.1: App doesn't fit on phone screen
**Solution**:
1. Make sure responsive.css is linked in index.html
2. App is designed for tablet (768px+) primarily
3. On small phones, horizontal scrolling may be needed for tables

### Issue 9.2: Buttons too small on mobile
**Solution**: Use two fingers to zoom in on mobile browsers.

### Issue 9.3: Form is hard to fill out on phone
**Solution**: The app is primarily designed for tablets and computers. Use a tablet for field use.

### Issue 9.4: Map not working on mobile
**Solution**: Google Maps works on mobile browsers. Make sure location permission is granted.

### Issue 9.5: Signature pad doesn't work on touchscreen
**Solution**:
1. The signature pad supports touch/stylus input
2. Make sure your browser is updated
3. Try using a stylus for better accuracy

### Issue 9.6: PDF doesn't open on iPhone
**Solution**: iPhone can open PDFs in Safari. If it doesn't open automatically, tap and hold → "Open in New Tab"

### Issue 9.7: App runs slowly on older tablet
**Solution**:
1. Close other browser tabs
2. Use Chrome browser (fastest for web apps)
3. Clear browser cache

---

## 10. PERFORMANCE ISSUES

### Issue 10.1: Page loads slowly
**Solution**:
1. Check internet connection
2. Make sure MongoDB queries are using indexes
3. Check server CPU/memory usage

### Issue 10.2: Large project lists load slowly
**Solution**: Projects list uses pagination - this is normal for large datasets.

### Issue 10.3: Server memory usage is high
**Solution**:
```bash
# Monitor memory usage
pm2 monit

# If consistently high, restart server
pm2 restart fence-estimator
```

### Issue 10.4: Database queries are slow
**Solution**:
```bash
# In MongoDB shell - check slow queries
mongosh
use fence_estimator_db
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().sort({ts:-1}).limit(10)
```

### Issue 10.5: Browser freezes when loading data
**Solution**:
1. Limit number of records loaded at once
2. Use pagination (add ?page=1&limit=20 to API calls)

---

## 11. DATA & BACKUP ISSUES

### Issue 11.1: Accidental data deletion
**Solution**:
1. Restore from most recent backup
2. See database/procedures/recovery.sql for steps
3. Never delete projects - change status to "archived" instead

### Issue 11.2: How to backup the database
**Solution**:
```bash
# Create backup folder
mkdir backup

# Backup MongoDB
mongodump --db fence_estimator_db --out ./backup/$(date +%Y%m%d_%H%M%S)

# Compress backup
tar -czf backup_$(date +%Y%m%d).tar.gz ./backup/
```

### Issue 11.3: How to restore from backup
**Solution**:
```bash
# Restore from backup folder
mongorestore --db fence_estimator_db ./backup/YYYYMMDD_HHMMSS/fence_estimator_db/
```

### Issue 11.4: Data not syncing between computers
**Solution**: Use MongoDB Atlas (cloud database) so all computers connect to the same database.

### Issue 11.5: Import existing customer data
**Solution**: Use MongoDB Compass (free GUI tool) to import CSV data into the database.

### Issue 11.6: Export data to Excel
**Solution**: Use the Export button in the Reports tab (Tab 15) to download CSV files.

### Issue 11.7: Data showing from wrong project
**Solution**: Make sure the correct project is selected before viewing estimates/contracts.

### Issue 11.8: Old estimates showing wrong prices
**Solution**: Estimates save prices at the time of creation. Old estimates keep their original prices.

---

## 12. PRODUCTION DEPLOYMENT ISSUES

### Issue 12.1: App works locally but not on server
**Solution**:
1. Check .env file has production settings
2. Verify NODE_ENV=production
3. Check that all npm packages are installed
4. Check server firewall allows port 3000

### Issue 12.2: Cannot access app from internet
**Solution**:
1. Configure firewall to allow ports 80, 443, 3000
2. Set up Nginx reverse proxy (see PART_4_IMPLEMENTATION_MENU.md Step 6C)
3. If using cloud server, check cloud firewall rules (Security Groups)

### Issue 12.3: App crashes in production
**Solution**:
```bash
# Check logs
pm2 logs fence-estimator --lines 100

# Check system resources
top
df -h  # Disk space
free -m  # Memory
```

### Issue 12.4: SSL certificate issues
**Solution**:
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Check certificate expiry
sudo certbot certificates
```

### Issue 12.5: "502 Bad Gateway" from Nginx
**Cause**: Node.js backend is not running
**Solution**:
```bash
pm2 status  # Check if fence-estimator is running
pm2 start fence-estimator  # Start if stopped
pm2 restart fence-estimator  # Restart if crashing
```

### Issue 12.6: Environment variables not loading in production
**Solution**:
1. Verify .env file exists in backend/ folder on production server
2. Or set environment variables in hosting platform dashboard
3. PM2: `pm2 start server.js --env production`

### Issue 12.7: Database connection fails in production
**Solution**:
1. Use MongoDB Atlas for production (not local MongoDB)
2. Whitelist your production server IP in Atlas
3. Check MONGO_URI in production .env

### Issue 12.8: Static files (CSS, JS, images) not loading in production
**Solution**:
1. Copy frontend files to correct server directory
2. Configure Nginx to serve static files (see Step 6C)
3. Check Nginx config for correct root path

### Issue 12.9: Server runs out of disk space
**Solution**:
```bash
# Check disk usage
df -h

# Find large files
du -sh /var/log/* | sort -rh | head

# Clean up logs
pm2 flush  # Clear PM2 logs
sudo journalctl --vacuum-time=7d  # Clear system logs
```

### Issue 12.10: Domain not pointing to server
**Solution**:
1. In your domain registrar (GoDaddy, Namecheap, etc.)
2. Set A record to point to your server's IP address
3. DNS propagation takes 24-48 hours
4. Verify with: `nslookup yourdomain.com`

---

## QUICK DIAGNOSTICS CHECKLIST

When something doesn't work, run through this checklist:

```
□ 1. Is MongoDB running?
     Mac: brew services list | grep mongodb
     Linux: systemctl status mongod
     Windows: services.msc → look for MongoDB

□ 2. Is the backend server running?
     Check: http://localhost:3000/api/health
     Start: cd backend && npm start

□ 3. Is the .env file configured?
     Check: ls backend/.env (file must exist)
     Verify: MONGO_URI, JWT_SECRET are set

□ 4. Are npm packages installed?
     Check: ls backend/node_modules (folder must exist)
     Install: cd backend && npm install

□ 5. Are you logged in to the app?
     Check: localStorage.getItem('token') in browser console
     Fix: Log out and log back in

□ 6. Are there console errors?
     Open: F12 → Console tab
     Fix: Address any red error messages

□ 7. Is the correct project selected?
     Check: Project selector shows a project name
     Fix: Select or create a project first

□ 8. Are all required fields filled?
     Check: Required fields marked with *
     Fix: Fill in all required fields
```

---

## GETTING MORE HELP

### Check Server Logs
```bash
# PM2 logs (production)
pm2 logs fence-estimator

# Direct Node.js logs (development)
cd backend && npm run dev
# Watch the terminal output
```

### Check Browser Console
1. Press F12 in any browser
2. Click "Console" tab
3. Look for red error messages
4. Click on error to see file and line number

### MongoDB Compass (Visual Database Tool)
- Download: https://www.mongodb.com/try/download/compass
- Connect to: mongodb://localhost:27017
- Browse and edit your data visually

### Community Support
- Node.js: https://nodejs.org/en/community
- MongoDB: https://www.mongodb.com/community/forums
- Express.js: https://expressjs.com/en/resources/community.html
- Stack Overflow: https://stackoverflow.com/questions/tagged/node.js

---

*Troubleshooting Guide Complete - Fence Depot Fence Estimator v1.0*
*110+ Issues Covered - All Major Categories*
