# ⚡ QUICK START — Get Running in 5 Minutes

> **Just want to browse the code?** Skip to [Step 5 — Browse All 40 Sections](#step-5--browse-all-40-sections).

---

## Step 1 — Get the Code (1 minute)

Open a terminal and run:

```bash
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator
```

---

## Step 2 — Install Dependencies (1 minute)

```bash
cd backend
npm install
```

---

## Step 3 — Configure Environment (1 minute)

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and fill in your values:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fence_estimator
DB_USER=postgres
DB_PASSWORD=your_password
API_PORT=3000
GOOGLE_MAPS_API_KEY=your_api_key
```

---

## Step 4 — Start the App (1 minute)

```bash
cd backend
npm start
```

Open your browser and go to: **http://localhost:3000**

---

## Step 5 — Browse All 40 Sections

You do **not** need to install anything to browse the code and documentation.

### Option A — View on GitHub (easiest)
1. Go to: https://github.com/Auction2026/fence-estimator
2. Click **SECTIONS_INDEX.md** → see all 40 sections with direct links
3. Click any link → view that section's code immediately

### Option B — View locally
After cloning (Step 1), open these files in any text editor or browser:

| What you want | File to open |
|--------------|-------------|
| See all 40 sections listed | `SECTIONS_INDEX.md` |
| All 40 sections in one table | `SECTIONS_OVERVIEW.md` |
| Main web app | `index.html` |
| Professional version | `index-professional.html` |
| Backend server | `backend/server.js` |
| Full implementation guide | `docs/FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md` |

---

## Where to Find Each Section

| Sections | Location |
|---------|---------|
| 1–3 (HTML & CSS) | `index.html`, `index-professional.html` |
| 4–9 (Core JavaScript) | Inside `index.html` — `<script>` blocks |
| 10 (Package config) | `backend/package.json` |
| 11–27 (All 17 Tabs) | Inside `index.html` — each `<div id="tab-N">` |
| 28–30 (Tools) | Inside `index.html` — drawing, maps, print sections |
| 31–34 (Backend API) | `backend/server.js` |
| 35–38 (Database) | Defined in `docs/FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md` |
| 39–40 (Docs) | `docs/FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md` |

---

## Next Steps

After you're up and running:

1. Open the app in your browser at **http://localhost:3000**
2. Fill in **Tab 1 — Project Info** with customer details
3. Move to **Tab 2 — Fence Specs** and select fence type, height, color, footage
4. Click **Tab 8 — Estimate** to see the auto-calculated material list with prices
5. Print or export the estimate from **Tab 10 — Extras / Print**

---

*See [SECTIONS_INDEX.md](SECTIONS_INDEX.md) for all 40 sections · [FILE_STRUCTURE.md](FILE_STRUCTURE.md) for file layout*
