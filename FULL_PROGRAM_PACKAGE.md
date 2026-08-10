# FULL PROGRAM PACKAGE

This file is the **written-out guide** that goes with the code in this repository so a programmer can review it quickly.

## 1. What is included

This repository currently contains the complete code package that exists today for review:

- `/home/runner/work/fence-estimator/fence-estimator/index-professional.html`
- `/home/runner/work/fence-estimator/fence-estimator/index.html`
- `/home/runner/work/fence-estimator/fence-estimator/FENCE_MATERIAL_SPECIFICATIONS.md`
- `/home/runner/work/fence-estimator/fence-estimator/MEGA_RESEARCH_SESSION_LOG.md`
- `/home/runner/work/fence-estimator/fence-estimator/BACKUP_LOG.md`

## 2. Best file for the programmer to start with

Start with:

- `index-professional.html`

Why:

- it is the larger interface
- it contains the professional multi-tab estimator workflow
- it includes the estimate calculator logic in the same file
- it is the clearest starting point for turning this into a production application

Use `index.html` as the secondary reference because it shows a different 7-tab dashboard and estimate wizard layout.

## 3. File-by-file explanation

### A. `index-professional.html`

This is a single-file HTML/CSS/JavaScript application.

It contains:

- the page structure
- all styling
- all tab content
- all client-side calculation logic

Main sections inside this file:

1. **Header**
   - company branding
   - user welcome area
   - logout action

2. **Tab navigation**
   - Fence Style
   - Installation
   - Permit
   - Locates
   - Estimate
   - Contract
   - Shop Drawings
   - Installer Paperwork
   - Customer
   - Inventory
   - Reports

3. **Estimate logic**
   - `calculateEstimate()`
   - calculates labour hours
   - calculates labour cost
   - calculates overhead
   - calculates profit
   - calculates final total

4. **Shared utility logic**
   - `switchTab()`
   - `showAlert()`
   - `calculateHours()`

### B. `index.html`

This is also a single-file HTML/CSS/JavaScript application.

It contains:

- a landing page
- a login screen
- a dashboard
- a 7-tab navigation system
- a 5-step estimate wizard

Main tabs in this file:

- Dashboard
- New Estimate
- Projects
- Materials & Costs
- Suppliers
- Analytics
- Settings

Main client-side workflow:

- open landing page
- move to login or demo mode
- open dashboard
- switch tabs
- move through the estimate wizard
- generate a simple estimate action

### C. `FENCE_MATERIAL_SPECIFICATIONS.md`

This is a written material/specification reference.

It contains:

- chain link standards
- vinyl standards
- wood standards
- wrought iron standards
- Canadian standards references
- material quantities and fitting references

### D. `MEGA_RESEARCH_SESSION_LOG.md`

This is a detailed planning and research document.

It contains:

- research notes
- labour assumptions
- standards references
- workflow ideas
- regional considerations

### E. `BACKUP_LOG.md`

This is a session summary and backup note for the project history.

## 4. How the programmer should use this package

### Step 1
Open `index-professional.html` and review the full layout.

### Step 2
Open `index.html` and compare the simpler flow and dashboard structure.

### Step 3
Read `FENCE_MATERIAL_SPECIFICATIONS.md` for material rules and estimating reference data.

### Step 4
Read `MEGA_RESEARCH_SESSION_LOG.md` for business rules, labour logic, and standards research.

### Step 5
Choose which interface becomes the main production base:

- use `index-professional.html` as the likely main base
- borrow any preferred screens or copy from `index.html`

## 5. Where the most important code lives

### In `index-professional.html`

Key behavior is in the script block near the bottom of the file:

- tab switching
- form saves
- estimate calculations
- contract actions
- inventory actions
- reports actions

Most important function for pricing:

- `calculateEstimate()`

That function currently:

1. reads user-entered inputs
2. computes labour hours from linear footage
3. computes labour cost
4. computes subtotal
5. computes overhead
6. computes profit
7. writes totals back into the page

### In `index.html`

Key behavior is also in the final script block:

- login/demo mode
- tab switching
- estimate step navigation
- progress update logic

## 6. Current architecture

The current implementation is a **front-end prototype architecture**:

- HTML for structure
- CSS for layout and design
- JavaScript for interaction
- no build step
- no server requirement
- no separate API layer
- no separate database layer in code yet

That means the code is easy to review because the programmer can see everything directly in the source files.

## 7. Recommended production conversion path

If the programmer is turning this into a larger production system, the clean path is:

1. keep one HTML version as the approved UI reference
2. split styles into a CSS file
3. split logic into JavaScript modules
4. move estimates, customers, projects, inventory, and reports into a database
5. create backend endpoints for save/load/export actions
6. replace alert-based placeholder actions with real persistence and document generation

## 8. Troubleshooting guide

### Problem: File opens but looks plain or icons are missing

Cause:
- internet access may be blocked for Google Fonts or Font Awesome

Fix:
1. connect to the internet
2. or replace remote font/icon links with local assets

### Problem: Buttons only show alerts

Cause:
- many actions are prototype actions and currently demonstrate workflow only

Fix:
1. find the related JavaScript function in the bottom script block
2. replace the `showAlert(...)` or `alert(...)` call
3. add real save/export/backend logic

### Problem: Programmer cannot find the estimate calculation

Fix:
1. open `index-professional.html`
2. search for `function calculateEstimate()`
3. review the input reads and total calculations inside that function

### Problem: Programmer cannot find the tab logic

Fix:
1. search for `function switchTab(`
2. review the related button `onclick` handlers near the top navigation

### Problem: No backend or database files are present

Cause:
- the current repository is organized as a front-end review/prototype package

Fix:
1. use the HTML files as the visual and workflow reference
2. use the research/specification markdown files as business-rule input
3. build the server/database layer from this reviewed package

## 9. Quick handoff summary for the programmer

If the programmer only reads one short note, give them this:

- `index-professional.html` is the main code base to review first
- `index.html` is the simpler alternate flow
- `FENCE_MATERIAL_SPECIFICATIONS.md` contains the materials/spec reference
- `MEGA_RESEARCH_SESSION_LOG.md` contains deeper estimating and standards research
- the current repository is easiest to understand because almost all behavior is directly visible in the HTML files

## 10. Final note

This repository now contains:

- the complete code files currently available for the estimator
- a simple written guide for review
- a programmer handoff path showing where to start, what to read, and how to extend it
