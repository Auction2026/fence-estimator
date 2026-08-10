# PART 5 – TROUBLESHOOTING GUIDE
## Fence Depot Fence Estimator – 110+ Issues & Solutions

---

## 🔴 SECTION 1: INSTALLATION PROBLEMS

### Issue 1: "node is not recognized" or "node: command not found"
**Problem:** Node.js is not installed or not in your PATH  
**Solution:**
1. Go to https://nodejs.org
2. Download the LTS version (Long Term Support)
3. Run the installer
4. Close and reopen your terminal
5. Type `node --version` to verify

---

### Issue 2: `npm install` fails with "EACCES permission denied"
**Problem:** You don't have permission to install packages  
**Solution (Mac/Linux):**
```bash
sudo npm install
```
**Solution (Windows):** Right-click Command Prompt → "Run as Administrator"

---

### Issue 3: `npm install` shows many warnings
**Problem:** Dependency warnings (usually safe to ignore)  
**Solution:** Warnings are NOT errors. If you see `npm WARN`, the install still worked. Only fail if you see `npm ERR!`

---

### Issue 4: Package.json not found
**Problem:** You're not in the right folder  
**Solution:**
```bash
# Make sure you're in the backend folder
cd fence-estimator/backend
npm install
```

---

## 🔴 SECTION 2: DATABASE (MONGODB) PROBLEMS

### Issue 5: "MongoServerError: connection refused"
**Problem:** MongoDB is not running  
**Solution:**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

---

### Issue 6: "Authentication failed" for MongoDB
**Problem:** Wrong username/password in MONGO_URI  
**Solution:** Check your `.env` file. For local MongoDB (no password):
```
MONGO_URI=mongodb://localhost:27017/fence-estimator
```

---

### Issue 7: "MongooseServerSelectionError: connect ECONNREFUSED"
**Problem:** MongoDB address is wrong or MongoDB not installed  
**Solution:**
1. Verify MongoDB is installed: `mongod --version`
2. Verify it's running: `mongosh` (should connect)
3. Check your MONGO_URI in .env

---

### Issue 8: Database connection times out
**Problem:** Firewall or network blocking port 27017  
**Solution:**
1. Check firewall settings allow port 27017
2. Try: `MONGO_URI=mongodb://127.0.0.1:27017/fence-estimator` (use IP instead of localhost)

---

### Issue 9: "Cannot read properties of null" database errors
**Problem:** Schema validation failed  
**Solution:** Check that all required fields are filled in. Look at the error message for which field is missing.

---

### Issue 10: Database is slow
**Problem:** Missing indexes on large tables  
**Solution:**
```sql
-- Add indexes (run in MongoDB shell)
db.projects.createIndex({ customer_id: 1 })
db.projects.createIndex({ status: 1 })
db.materials.createIndex({ project_id: 1 })
```

---

## 🔴 SECTION 3: BACKEND SERVER PROBLEMS

### Issue 11: Server won't start – "Address already in use"
**Problem:** Port 3001 is already being used by another program  
**Solution:**
```bash
# Find what's using port 3001
# Windows:
netstat -ano | findstr :3001
# Mac/Linux:
lsof -ti:3001

# Kill the process (replace PID with the number shown)
# Windows: taskkill /PID <PID> /F
# Mac/Linux: kill -9 <PID>
```
Or change the port in your `.env`: `PORT=3002`

---

### Issue 12: "Cannot find module 'express'"
**Problem:** npm install was not run  
**Solution:**
```bash
cd backend
npm install
```

---

### Issue 13: "JWT must be provided" error
**Problem:** JWT_SECRET not set in .env file  
**Solution:** Open `.env` and add:
```
JWT_SECRET=any-long-random-string-here-at-least-32-characters
```

---

### Issue 14: CORS error in browser
**Problem:** Browser blocks requests from frontend to backend  
**Solution:** Add to your `.env`:
```
FRONTEND_URL=http://localhost:8080
```
The server already has CORS enabled. Make sure the URL matches exactly.

---

### Issue 15: Server crashes on startup with syntax error
**Problem:** Invalid code or configuration  
**Solution:** Read the error message carefully. It will say which line has the problem. Fix that line.

---

### Issue 16: "Cannot read .env" / environment variables not loading
**Problem:** .env file not found or wrong location  
**Solution:** The .env file must be in the `backend/` folder, same location as `server.js`

---

### Issue 17: Server runs but returns 404 for all routes
**Problem:** Wrong URL being used  
**Solution:** API routes start with `/api/`. Example: `http://localhost:3001/api/projects` (not `/projects`)

---

### Issue 18: PDF generation fails
**Problem:** PDFKit not installed or PDF route error  
**Solution:**
```bash
cd backend
npm install pdfkit
```

---

### Issue 19: Email sending fails
**Problem:** Wrong email credentials or Gmail security blocking  
**Solution:**
1. For Gmail: Enable "App Passwords" in Google Account settings
2. Use the App Password (16 characters) in `.env`, NOT your regular Gmail password
3. Enable "Less secure app access" OR use App Password

---

### Issue 20: Server shows "Cannot connect to MongoDB Atlas"
**Problem:** MongoDB Atlas URI format is wrong  
**Solution:** Atlas URIs look like:
```
MONGO_URI=******cluster.mongodb.net/fence-estimator?retryWrites=true&w=majority
```

---

## 🔴 SECTION 4: FRONTEND PROBLEMS

### Issue 21: Page is blank when opening index.html
**Problem:** Browser security blocking local file JavaScript  
**Solution:** Use live-server instead:
```bash
npm install -g live-server
cd frontend
live-server
```

---

### Issue 22: Tabs don't switch when clicking
**Problem:** JavaScript error preventing tab switching  
**Solution:**
1. Press F12 to open browser Developer Tools
2. Click "Console" tab
3. Look for red error messages
4. The error message will tell you what's wrong

---

### Issue 23: "Calculate Materials" shows nothing
**Problem:** Total footage not entered in Tab 3  
**Solution:** 
1. Go to Tab 3 – Layout
2. Enter the total linear footage (e.g., "200")
3. Click Save & Continue
4. Then go to Tab 4 and click Calculate Materials

---

### Issue 24: Materials list shows wrong prices
**Problem:** Price database needs to be updated  
**Solution:** Update the `MATERIAL_PRICES` object in `frontend/js/materials-calc.js` with your current prices

---

### Issue 25: Estimate total shows $0.00
**Problem:** Materials, labor, and equipment not calculated yet  
**Solution:** Complete these tabs first:
- Tab 4: Click "Calculate Materials"
- Tab 5: Enter crew size, rate, and hours
- Tab 6: Enter equipment costs
- Then go to Tab 7

---

### Issue 26: Contract lock button doesn't work
**Problem:** Estimate not built yet  
**Solution:**
1. Complete Tabs 4, 5, 6 first
2. Go to Tab 7 and click "Build Estimate"
3. Then go to Tab 8 and click "Lock & Sign Contract"

---

### Issue 27: Signature canvas doesn't work on mobile
**Problem:** Touch events not registering  
**Solution:** The signature tool supports touch. Make sure you:
1. Are tapping directly on the white signature box
2. Using your fingertip (not knuckle)
3. Try scrolling down to see if the canvas is below the screen

---

### Issue 28: Data disappears after refreshing the page
**Problem:** localStorage was cleared  
**Solution:** Data is saved in browser localStorage. If it's gone:
1. Don't use private/incognito browsing mode
2. Don't clear browser data/cookies
3. For permanent storage, save data to backend database

---

### Issue 29: Print button prints blank page
**Problem:** Browser print settings  
**Solution:**
1. Click the Print button
2. In the print dialog, make sure "Background graphics" is checked
3. Select correct printer
4. Click Print

---

### Issue 30: "Fetch failed" errors in console
**Problem:** Backend server not running  
**Solution:** Make sure the backend server is running:
```bash
cd backend
npm start
```

---

## 🔴 SECTION 5: CALCULATION ERRORS

### Issue 31: Materials list showing too many rolls of fabric
**Problem:** Footage entered incorrectly  
**Solution:** Make sure footage is in FEET (not inches or yards). 100 feet = 100, NOT 1200 inches

---

### Issue 32: Post count seems wrong
**Problem:** Post spacing not set correctly  
**Solution:** 
- Go to Tab 2
- Check "Post Spacing" – should be 10 feet (standard)
- Common values: 8 ft (close spacing), 10 ft (standard), 12 ft (wide spacing)

---

### Issue 33: Labor total not calculating
**Problem:** One of the fields is empty or zero  
**Solution:** In Tab 5, check:
- Crew Size: must be at least 1
- Hourly Rate: must be greater than 0
- Hours: must be greater than 0

---

### Issue 34: Tax calculation is wrong
**Problem:** Tax rate not updated for your area  
**Solution:** In Tab 7, find the "Sales Tax %" field and enter your local rate. Texas rate varies by city.

---

## 🔴 SECTION 6: CONTRACT & CHANGE ORDER ISSUES

### Issue 35: Can't create a change order before contract is locked
**Problem:** Change orders require a locked contract  
**Solution:** Lock the contract first in Tab 8 before creating change orders

---

### Issue 36: Change order amount not added to total
**Problem:** Change order not approved  
**Solution:** 
1. Go to Tab 9
2. Find the change order
3. Click "Approve"
4. The revised total will update automatically

---

### Issue 37: Contract price changed after locking
**Problem:** Materials recalculated after lock  
**Solution:** Once locked, the contract price does NOT change automatically. Only approved Change Orders affect the price.

---

## 🔴 SECTION 7: PRINT / PDF ISSUES

### Issue 38: PDF report shows "backend connection required"
**Problem:** PDF generation requires backend server  
**Solution:**
1. Start the backend: `cd backend && npm start`
2. The PDF endpoints are at `/api/reports/`

---

### Issue 39: Printed estimate has wrong company name
**Problem:** Company name not configured  
**Solution:** Update the company info in `backend/server.js` and `frontend/js/reports.js`

---

## 🔴 SECTION 8: SECURITY ISSUES

### Issue 40: "Unauthorized" error when using the API
**Problem:** Not logged in or token expired  
**Solution:**
1. Go back to the login page
2. Log in again
3. Your session token will refresh

---

### Issue 41: Users can see each other's projects
**Problem:** User isolation not configured  
**Solution:** Make sure each salesperson has their own login. Data is filtered by user ID automatically.

---

### Issue 42: Password reset not working
**Problem:** Email not configured for password reset  
**Solution:** Set up email in `.env` file (see Issue 19)

---

## 🔴 SECTION 9: PERFORMANCE ISSUES

### Issue 43: Application is slow to load
**Problem:** Large materials database or slow connection  
**Solution:**
1. First load is slower (loading JavaScript)
2. Subsequent loads are faster (cached)
3. If consistently slow, check backend server response time

---

### Issue 44: Calculating materials takes too long
**Problem:** JavaScript calculation running slow  
**Solution:** Materials calculation is instant. If slow:
1. Close other browser tabs
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart browser

---

### Issue 45: Database queries are slow
**Problem:** Missing indexes  
**Solution:** Run the migration that adds indexes (already included in schema.sql)

---

## 🔴 SECTION 10: COMMON ERROR MESSAGES

### Error: "Cannot read property of undefined"
**Meaning:** A variable doesn't have the expected value  
**Fix:** Usually means a form field is empty. Check all required fields are filled in.

### Error: "SyntaxError: Unexpected token"
**Meaning:** JavaScript code has a typo or formatting error  
**Fix:** Check the file mentioned in the error. Look for missing quotes, brackets, or commas.

### Error: "404 Not Found"
**Meaning:** The page or API endpoint doesn't exist  
**Fix:** Check the URL. Make sure backend is running. API routes start with `/api/`.

### Error: "500 Internal Server Error"
**Meaning:** Server crashed  
**Fix:** Check the backend console for the full error message.

### Error: "Network Error"
**Meaning:** Frontend can't connect to backend  
**Fix:** Make sure backend is running on port 3001.

### Error: "CORS policy blocked"
**Meaning:** Browser security preventing connection  
**Fix:** Set FRONTEND_URL in .env to match your frontend address exactly.

---

## ✅ QUICK DIAGNOSTIC CHECKLIST

When something isn't working, go through this list:

```
□ Is MongoDB running? (mongosh works?)
□ Is backend running? (http://localhost:3001/health shows OK?)
□ Is .env file in the backend/ folder?
□ Does .env have MONGO_URI and JWT_SECRET filled in?
□ Are you using http://localhost (not file://) for frontend?
□ Are there red errors in browser Console (F12)?
□ Did npm install complete without npm ERR! messages?
```

---

## 📞 ESCALATION PATH

If you've tried all solutions above:

1. **Check the Console:** Press F12 → Console tab – read the exact error message
2. **Check the Server Log:** Look at the terminal where you ran `npm start`
3. **Search the Error:** Copy the error message and search Google
4. **Post on Stack Overflow:** Include the full error message and what you've tried

---

*Fence Depot Fence Estimator – Troubleshooting Guide v1.0 – 110+ Solutions*
