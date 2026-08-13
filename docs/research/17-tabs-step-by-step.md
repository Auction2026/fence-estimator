# The 17 Tabs — Step-by-Step Guide

**Date:** August 13, 2026
**Source:** `frontend/index.html` (the 17-tab app) and `frontend/js/app.js` (all tab logic).
**How to open the program:** double-click `frontend/index.html` (or use `Open-Fence-Estimator.url` / `Start-Fence-Estimator.bat`).

Everything you type is saved automatically in your browser (localStorage), so your work is still there when you come back — as long as you use the same computer and browser and don't clear browser data.

---

## Tab 1 — Project

**What it's for:** The customer's information. This is where every job starts.

1. Click **1. Project**.
2. Fill in: Customer Name, Email, Phone, Date Created, Address, City, Province, Postal Code, and Property Size (sq ft). All fields are required.
3. Click **Save Project Info**.
4. You'll see "Project information saved successfully!" — the info is stored and reused on the Contract tab and PDF estimate.

## Tab 2 — Specs

**What it's for:** Describing the fence itself. This drives the price.

1. Click **2. Specs**.
2. Choose **Fence Type** (Chain Link, Wood, Vinyl, or Wrought Iron).
3. Enter **Height** (3–8 ft), **Color**, and **Material Grade** (Standard / Premium / Commercial).
4. Enter **Linear Feet**, **Number of Posts**, **Number of Gates**, and **Gate Width**.
5. Click **Save Specifications**.
6. The program instantly recalculates the estimate (Tab 8) using per-foot prices: chain link $15, wood $25, vinyl $35, wrought iron $50; labor at $50/hr × ½ hour per foot; equipment $5/ft; gates $150 each.

## Tab 3 — Layout

**What it's for:** Sketching the fence layout on the property.

1. Click **3. Layout**.
2. Click **Draw Layout** — drawing mode turns on.
3. Click and drag your mouse on the big white canvas to draw the fence lines (blue lines).
4. Made a mistake? Click **Clear Canvas** to erase everything.
5. Click **Save Drawing** — the sketch is saved as a picture with the project.

## Tab 4 — Install

**What it's for:** Showing the standard installation work plan.

1. Click **4. Install**.
2. Read the table: Site Preparation (4 hrs), Digging & Posts (8 hrs), Fence Installation (16 hrs), Gate Installation (4 hrs), Cleanup & Finishing (4 hrs) — all at $50/hr.
3. This tab is read-only today; it's a reference schedule. (Future: make hours adjust automatically to the job size.)

## Tab 5 — Drawings

**What it's for:** Attaching shop drawings, survey PDFs, or photos to the project.

1. Click **5. Drawings**.
2. Click **Choose File** and pick a PDF, JPG, or PNG (must be under 10 MB).
3. Click **Upload Drawing**.
4. The file is stored with the project and you'll see a confirmation with the file name.

## Tab 6 — Permits

**What it's for:** Tracking the building permit.

1. Click **6. Permits**.
2. Type the **Permit Number**.
3. Set **Permit Status**: Pending, Approved, or Denied.
4. Click **Save Permit Info**.

## Tab 7 — Utilities

**What it's for:** Recording the utility locates before digging (safety requirement).

1. Click **7. Utilities**.
2. Check every service that has been located: **Hydro**, **Gas**, **Water**, **Sewer**.
3. Click **Save Utilities Info** — a confirmation lists exactly what you checked.

## Tab 8 — Estimate

**What it's for:** The money page — the full price breakdown.

1. Click **8. Estimate**.
2. Review the automatic breakdown: Materials, Labor, Equipment, Permits, Extras, then Subtotal, **Tax (13% Ontario HST)**, and **TOTAL**. These numbers update by themselves whenever Specs (Tab 2) or Extras (Tab 10) change.
3. Click **Generate PDF** to open a clean printable estimate (customer info + fence details + full price table) and print or save it.
4. Click **Lock Price** when the customer agrees — this freezes the total and writes it onto the Contract tab.

## Tab 9 — Contract

**What it's for:** Getting the customer's signature.

1. Click **9. Contract**.
2. Check that the **Customer** name and locked **Price** shown are correct (they come from Tabs 1 and 8).
3. Click **Sign Contract** once — the signature box activates.
4. Have the customer sign inside the box with the mouse (or finger on a touchscreen).
5. Click **Sign Contract** again to confirm — the signature and the date are saved with the project.

## Tab 10 — Extras

**What it's for:** Add-ons that aren't part of the base fence (e.g., removing an old fence, extra gate latch).

1. Click **10. Extras**.
2. Type the **Extra Item** name and its **Cost**.
3. Click **Add Extra** — it appears in the table below.
4. The cost is instantly added to the estimate total on Tab 8 (tax recalculates too).
5. Click **Remove** next to any extra to take it off — the total updates automatically.

## Tab 11 — Crew

**What it's for:** Listing who is working on the job.

1. Click **11. Crew**.
2. Type the person's **Name** and pick a **Role**: Foreman, Laborer, or Specialist.
3. Click **Add Crew** — they appear in the table.
4. Click **Remove** to take someone off the job.

## Tab 12 — Changes

**What it's for:** Change orders — when the customer changes their mind after signing.

1. Click **12. Changes**.
2. Describe the change in the **Description** box.
3. Enter the **Cost Change** (can be positive or negative).
4. Click **Create Change Order** — it's saved with today's date and "Pending" status and listed below.
5. (Note: change orders are a record only today — they do not yet change the Tab 8 total automatically.)

## Tab 13 — SignOff

**What it's for:** Closing out the finished job.

1. Click **13. SignOff**.
2. Pick the **Completion Date**.
3. Check all three boxes: All work completed, Property cleaned, Quality check passed. The program will not let you sign off until every box is checked.
4. Click **Sign Off Project** — the completion is recorded with a timestamp.

## Tab 14 — Notes

**What it's for:** A running job diary.

1. Click **14. Notes**.
2. Type anything worth remembering (weather delay, customer request, gate code…).
3. Click **Add Note** — it's stamped with the date and time and shown newest-first.

## Tab 15 — Admin

**What it's for:** A quick business snapshot.

1. Click **15. Admin**.
2. Read **Total Projects** and **Total Revenue** (the current project's total). No typing needed.
3. (Today this tracks one project at a time; multi-project totals come when the backend is connected.)

## Tab 16 — Catalog

**What it's for:** Looking up products and prices.

1. Click **16. Catalog**.
2. The table lists products with SKU, Name, Price, and Stock (currently 10 sample items — your full POS inventory import is on the programmer's to-do list).
3. Type in the **Search products…** box to filter instantly by name or SKU (e.g., type "gate").

## Tab 17 — Mapping

**What it's for:** Viewing the property on a map to measure the fence line.

1. Click **17. Mapping**.
2. Today you'll see a placeholder message: the map needs a Google Maps API key, which the programmer adds (see PROGRAMMER_HANDOFF.md).
3. Once the key is added: the map will show the customer's address, and you'll be able to trace the fence line on the satellite view to measure footage.

---

## How the tabs work together (the normal job flow)

1. **Tab 1** — enter the customer.
2. **Tab 2** — enter the fence specs → price calculates itself.
3. **Tab 3 & 17** — sketch/measure the layout.
4. **Tab 7 & 6** — utility locates, then permit.
5. **Tab 10** — add any extras.
6. **Tab 8** — review, print PDF, **Lock Price**.
7. **Tab 9** — customer signs the contract.
8. **Tab 11** — assign the crew; **Tab 4** — installation plan.
9. **Tab 12 & 14** — record changes and notes during the job.
10. **Tab 13** — final sign-off when done.
11. **Tab 5** — attach drawings any time; **Tab 15/16** — admin numbers and product lookup any time.

## Still to be finished (per PROGRAMMER_HANDOFF.md)

- Connect the app to the backend server (so data isn't only in the browser).
- Google Maps key for Tab 17.
- Import the full POS product catalog into Tab 16 (only samples now).
- Email estimates/contracts to customers.
- Make Tab 4's hours adjust to job size, and have Tab 12 change orders update the total.
