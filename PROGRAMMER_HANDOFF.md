# PROGRAMMER HANDOFF — FENCE DEPOT ESTIMATOR v1.0

**Prepared:** August 13, 2026
**Repository:** https://github.com/Auction2026/fence-estimator
**Download everything as one ZIP:** https://github.com/Auction2026/fence-estimator/archive/refs/heads/main.zip
**Full guide:** docs/FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md

---

## 1. WHAT THIS PROJECT IS

A fence estimation system with three deliverables:

1. **`index.html`** — standalone demo (landing page, login screen, dashboard, 5-step estimate wizard). Pure HTML/CSS/JS, no dependencies. Complete.
2. **`frontend/index.html`** — the main 17-tab application. Pure HTML/CSS/JS with localStorage persistence. All 17 tabs functional as of Aug 13, 2026.
3. **`backend/server.js`** — Express + Mongoose API (12 endpoints, JWT auth, bcrypt). Complete and syntax-valid, but **not yet connected to the frontend**.

`index-professional.html` is an alternate standalone variant kept for reference.

## 2. HOW TO RUN

```bash
# Frontend (no build step, no server needed)
open frontend/index.html          # or just double-click it

# Backend (optional)
cd backend
npm install
npm start                         # requires MongoDB running locally
# MONGO_URI, PORT, JWT_SECRET env vars supported; server exits fast if DB unreachable (intentional, see PR #54)
```

There is no bundler or framework. Do not add one without discussing with the owner.

## 3. CODE MAP

| File | Purpose | Status |
|---|---|---|
| `frontend/js/app.js` | Main app: appState, tab switching, saving, estimate math, ALL tab 3–17 handlers (extras, crew, change orders, notes, permits, utilities, PDF, price lock, contract signature, sign-off, catalog, admin) | ✅ Complete |
| `frontend/js/calculations.js` | `EstimationCalculator` class (material/labor/equipment pricing, discounts, installments, timeline) | ✅ Complete, loaded only if you add a `<script>` tag |
| `frontend/js/storage.js` | `StorageManager` class (multi-project localStorage) | ✅ Complete, not yet loaded by index.html |
| `frontend/js/validation.js` | `FormValidator` class (email/phone/CA postal) | ✅ Complete, not yet loaded |
| `frontend/js/ui.js` | `UIManager` class (notifications, loaders, tables) | ✅ Complete, not yet loaded |
| `frontend/js/api.js` | `APIClient` class for the backend REST API | ✅ Complete, not yet loaded |
| `frontend/js/tabs/tab1..tab5*.js` | Alternate per-tab modules using the classes above | ✅ Written, not yet loaded |
| `backend/server.js` | Express API, Mongoose schemas (User, Project, FenceSpecs, Estimate, Contract, ChangeOrder, SignOff, Notes) | ✅ Complete |

**IMPORTANT:** `frontend/index.html` currently loads **only `js/app.js`** (self-contained, everything works from it). The other js files are a prepared modular architecture for you to wire in.

## 4. REMAINING WORK (PRIORITY ORDER)

1. **Connect frontend to backend** — load `js/api.js`, replace localStorage calls with API calls (or sync both). Login screen exists in `index.html` demo; the 17-tab app has no auth UI yet.
2. **Google Maps on Tab 17** — `#mapContainer` div is ready; needs an API key and `js/tools/mapping.js` (folder currently absent).
3. **Real product catalog (Tab 16)** — `PRODUCT_CATALOG` in app.js holds 10 sample SKUs. Owner has a full POS inventory export to import (previous work imported "Part 1 of 7" — 61 SKUs — into an earlier standalone build).
4. **Email estimates/contracts** — `nodemailer` is already in backend dependencies; no route uses it yet.
5. **Optional refactor** — migrate tab 6–17 logic from app.js into `js/tabs/tab6..tab17` files following the tab1–5 pattern, and load all modules from index.html.
6. **Cleanup** — root contains scratch files (`test-dom*.js`, `test-js.js`, `scan*.py`, `diff.txt`, `test-server.js`) safe to delete; `node_modules/` at root is only jsdom for smoke-testing.

## 5. KNOWN DECISIONS / GOTCHAS

- **Backend fast-fails when MongoDB is down** (PR #54) — intentional, do not re-add the silent retry loop.
- Tax is hard-coded at **13% (Ontario HST)** in both frontend and backend calculators.
- Labor: $50/hr × 0.5 hr per linear ft; gates $150 each — sample rates, confirm with owner.
- All persistence is per-browser localStorage until the API is wired in — clearing browser data erases projects.
- The owner is not technical: keep the one-click launchers (`Start-Fence-Estimator.bat` / `.command`, `Open-Fence-Estimator.url`) working after any restructuring.

## 6. TESTING

- Syntax: `node --check frontend/js/app.js` (and each js file) — all pass.
- A jsdom smoke test exercised all 17 tab handlers successfully (Aug 13, 2026).
- Backend: `cd backend && npm test` (Jest configured; add tests as you build).
