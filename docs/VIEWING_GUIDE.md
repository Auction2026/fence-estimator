
# Viewing Guide

## Goal
Use this guide to inspect the Fence Depot repository, open files quickly, and run the app locally while reviewing the code and documentation.

## 1. View the repository tree
### Terminal
```bash
find . -maxdepth 3 -type f | sort
```

### Git-tracked files only
```bash
git --no-pager ls-files | sort
```

## 2. Key places to start
- `index.html` - root prototype frontend
- `index-professional.html` - alternative polished frontend prototype
- `backend/server.js` - Express backend sample
- `backend/package.json` - backend scripts and dependencies
- `backend/.env.example` - environment variable template
- `docs/` - implementation, API, schema, troubleshooting, and diagram docs

## 3. Open the code in VS Code
```bash
code .
```
If the `code` command is unavailable:
1. Open VS Code.
2. Choose **File → Open Folder**.
3. Select the repository root.

## 4. Recommended VS Code workflow
- Open the Explorer panel.
- Pin `backend/server.js` and `docs/API_DOCUMENTATION.md` side by side.
- Use global search for terms such as `auth`, `estimate`, `contract`, `change`, or `inventory`.
- Open the integrated terminal from the repository root.

## 5. Open the frontend in a browser
### Option A: Open static HTML directly
Open `index.html` or `index-professional.html` in your browser.

### Option B: Serve locally
```bash
npx serve .
```
Then browse to the printed local URL.

### Option C: VS Code Live Server
If you use the Live Server extension:
1. Right-click `index.html`.
2. Choose **Open with Live Server**.

## 6. Start the backend for API review
```bash
cd backend
npm install
npm start
```
Then test:
```bash
curl http://localhost:3001/api/health
```

## 7. Inspect API requests in the browser
- Open Developer Tools.
- Go to the **Network** tab.
- Filter by `fetch` or `XHR`.
- Verify request URLs, methods, headers, payloads, and responses.

## 8. Compare code to docs
Best pairings while reading:
- `backend/server.js` ↔ `docs/API_DOCUMENTATION.md`
- `backend/.env.example` ↔ `docs/SETUP_GUIDE.md`
- estimate logic ↔ `docs/WIRE_GRIDS/CALCULATION_FLOW.md`
- data model ↔ `docs/DATABASE_SCHEMA.md`

## 9. Browser testing checklist
- Login form renders correctly
- Tabs switch cleanly
- Estimate values recalculate after edits
- Console contains no fatal errors
- Network requests reach the expected API origin

## 10. If you get stuck
Start with `docs/INDEX.md`, then use `PART_5_TROUBLESHOOTING_GUIDE.md` to diagnose environment, backend, frontend, or auth issues.
