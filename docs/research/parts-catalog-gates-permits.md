# Parts Catalog, Gate Shop Drawings, and Locate/Permit Links

**Date:** August 13, 2026
**Request:** Build a parts catalog for every fence type from the owner's research, a modifiable gate CAD shop drawing, links to underground service and permit information, and answer whether the owner can test the program alone.

## What was built

### 1. Fence Parts Catalog — Tab 16 (`frontend/js/parts-catalog.js`)
Built 100% from the owner's research in `FENCE_MATERIAL_SPECIFICATIONS.md` (Canadian Standards, July 16 2026). Every part, quantity, unit, description, and standard/SKU was retained.

| Fence Type | Parts | Source standard |
|---|---|---|
| Chain Link | 39 | CAN/CGSB-138.3-2019 |
| PVC / Vinyl | 26 | Homeland Vinyl Products SKUs |
| Wood | 29 | CSA O141 Grade #2 |
| Wrought Iron | 24 | Cloutier Direct SKUs |
| Guide Rail | 18 | OPSD 02.16.04 |
| Interior Post Mounting (A/B/C) | 21 | CSA A3000 / O141 / G40.8 |
| **Total** | **157** | |

Features: fence-type dropdown, live parts search, compliance notes per type, and a Print Parts List button. The 10-item product price list remains below it.

### 2. Gate Shop Drawing Generator — Tab 5 (`frontend/js/gate-drawings.js`)
A modifiable, CAD-style dimensioned drawing (SVG):
- 4 gate styles: Chain Link, Vinyl (Homeland), Wood (CSA O141), Wrought Iron (Cloutier) — each with its correct infill (mesh, boards, pickets with spear tips) and its exact gate parts list from the research.
- Editable width (2–20 ft) and height (3–8 ft) — drawing and dimension callouts redraw instantly.
- Title block with style, size, date, and drawing number (e.g. GATE-WOOD-10x6).
- Hinge/latch/gate-post callouts, red dimension lines.
- Print Drawing and Save to Project (stores the SVG in the project's drawings list).

### 3. Underground Service & Permit Links
- **Tab 7 (Utilities):** Ontario One Call (ON1Call), Click Before You Dig (Canada-wide), Hydro One underground cable safety, Enbridge Gas dig safely. Note added: locates are free and required by Ontario law at least 5 business days before digging.
- **Tab 6 (Permits):** Ontario Building Code, National Building Code of Canada, and Toronto / Ottawa / Mississauga municipal permit pages. Note about pool enclosures (CSA B95.1) and height limits.

### 4. Can the owner test it without the programmer?
**Yes.** No server, no install:
1. Open the `frontend` folder.
2. Double-click `index.html` (or use `Open-Fence-Estimator.url`).
3. Everything above runs in the browser and saves automatically.

## Verification
- `node --check` passes on all JS files.
- jsdom smoke test: all 6 catalog types render (157 rows total), search filters correctly, all 4 gate styles draw with parts lists, resizing updates dimensions, save-to-project persists to localStorage, all links present in the page.

## Still open
- Full POS inventory (Parts 2–7 of the owner's export) is still pending import into the price list.
- The gate drawings are working shop drawings (SVG) — if true DWG/DXF CAD files are ever needed for a fabricator, the programmer can export from these dimensions.
