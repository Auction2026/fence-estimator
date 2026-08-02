# Complete 17-Tab Fence Estimator System — Research & Implementation Notes

**Session:** Complete Fence Estimator Build  
**Date:** 2026-08-02

## Overview

Rebuilt `index-professional.html` from 11 tabs to a complete 17-tab professional fence estimator system. All tabs are fully functional with real document generation capabilities.

## 17-Tab Architecture

| # | Tab Name | ID | Key Features |
|---|----------|-----|-------------|
| 1 | Dashboard | `dashboard` | Stats, project checklist, quick actions, recent projects |
| 2 | Customer | `customer` | Full CRM, auto-save, all provinces |
| 3 | Fence Style | `fenceStyle` | All fence types, heights, colors, post selection with guidance popup |
| 4 | Shop Drawings | `shopDrawing` | Site layout, printable shop drawing sheet |
| 5 | Permits | `permit` | Permit tracking, printable permit application summary |
| 6 | Underground Utilities | `locates` | Utility locate tracking, printable locate request form |
| 7 | Installation | `installation` | Crew scheduling, equipment, progress tracking |
| 8 | Estimate | `estimate` | Full calculation engine, printable professional estimate |
| 9 | Contract | `contract` | Comprehensive Canadian fence contract, printable |
| 10 | Installer Paperwork | `installer` | Work order, material picklist, customer sign-off |
| 11 | Inventory | `inventory` | 51-SKU database, search/filter, add items, CSV export |
| 12 | Materials & Costs | `materials` | Labour rates, material pricing, margin settings |
| 13 | Suppliers | `suppliers` | 8 default suppliers, full CRUD |
| 14 | Projects | `projects` | Project list, status tracking, open/delete |
| 15 | Notes | `notes` | 12 default notes, autocomplete search, CRUD |
| 16 | Reports | `reports` | Stats, project table, PDF report, CSV export |
| 17 | Settings | `settings` | Company info, contract defaults, data backup/restore |

## Document Generation

All printable documents use `window.open()` + `document.write()` pattern, opening a new browser tab with:
- Print/Save as PDF button
- Close button  
- Formatted professional document
- Auto-triggered print dialog available

### Documents Generated:
1. **Professional Estimate** — Header, customer info, line-item materials, labour, HST, total, payment terms, signature lines
2. **Fence Installation Contract** — 10-clause Canadian contract: scope, payment, timeline, warranty, customer responsibilities, change orders, cancellation, liability/insurance, dispute resolution, general conditions
3. **Shop Drawing Sheet** — Site info, fence specs, layout description, sketch placeholder, installation notes, signatures
4. **Permit Application Summary** — Applicant info, project details, document checklist
5. **Utility Locate Request Form** — Safety notice, locate ticket details, utilities marked, clearances, crew sign-off
6. **Installer Work Order** — Customer info, crew/time tracking, material picklist, customer sign-off

## Canadian Labour Rates (Research)

Based on Canadian market research (2025/2026):

| Fence Type | Rate ($/hr CAD) |
|------------|-----------------|
| Chain Link Residential | $50 |
| Chain Link Commercial | $65 |
| Chain Link High Security | $75 |
| Wood Fencing | $55 |
| Vinyl/PVC | $60 |
| Ornamental / Welded Wire | $70 |
| Gate Installation | $80 |
| Automated Gate | $95 |
| Fence Removal/Demo | $45 |

All rates are configurable in the Materials & Costs tab (Tab 12).

## Default Suppliers

1. Putterman Athletic Inc. — Windscreen, sports fencing
2. Direct Fence Supplies — Chain link distributor
3. Oasis Vinyl Products — Vinyl/PVC manufacturer
4. Gorilla Fence Systems — Commercial/security
5. ARMA Gate Systems — Gate automation
6. Liftmaster/Chamberlain Canada — Gate operators
7. TUF Fence Inc. — Welded wire products
8. Devanco/Doorlec — Gate hardware

## Post Size Guide (in-app popup)

### Chain Link Posts:
- 1½" (38mm) — Residential line posts, up to 5ft fence
- 1⅞" (48mm) — Residential line posts, up to 8ft fence
- 2⅜" (60mm) — Terminal/corner/end posts (all heights)
- 3½" (89mm) — Heavy terminal posts, small gate posts
- 4½" (114mm) — Gate posts (up to 12ft wide)
- 6⅝" (168mm) — Large drive gates (12-20ft openings)

### Wood Posts (Pressure Treated):
- 4×4 x 8ft — Fence up to 5ft
- 4×4 x 10ft — Fence up to 6ft
- 4×6 x 10ft — Heavy duty, corners
- 6×6 x 10ft — Gate posts

### Vinyl/PVC Posts:
- 4×4 PVC — Up to 4ft vinyl
- 5×5 PVC — 5-6ft vinyl (steel insert required)
- 6×6 PVC — Gate posts (heavy steel insert required)

**Key Rule:** Post depth = 1/3 of total post length minimum. Canadian frost depths: Ontario = 4ft (1.2m), Alberta = 3.5ft (1.07m).

## Default Notes Library (12 entries)

1. Site has existing fence to remove
2. Sloped terrain - adjustment required
3. Rocky/hard soil - drilling required
4. Standard 1-year labour warranty
5. Permit required - customer responsibility
6. Permit - Company to obtain
7. Gate code / access note
8. Pets on property - safety note
9. Shared fence - neighbour notice
10. Pool barrier - safety compliance
11. Standard payment terms
12. Material delivery note

## Inventory Database

51 SKUs pre-loaded covering:
- Chain Link Fabric (galv + vinyl coated, 4/5/6ft, 9GA/11GA)
- Chain Link Posts (line + terminal + gate, all diameters)
- Top Rail + Tension Wire
- Fittings (caps, bands, tension bars, couplings, wire ties)
- Gates (residential + commercial frames, hardware sets)
- Concrete (standard + fast-setting 80lb bags)
- Wood Posts (4×4, 4×6, 6×6 PT)
- Wood Rails + Boards
- Vinyl Posts + Rails

## localStorage Keys (prefix: `fdp_`)

- `fdp_projects` — Project list array
- `fdp_inventory` — Inventory items array
- `fdp_suppliers` — Supplier list
- `fdp_notes` — Notes library
- `fdp_settings` — Company/system settings
- `fdp_laborRates` — Labour rate overrides
- `fdp_matPrices` — Material price overrides
- `fdp_margins` — Markup/overhead/profit margins
- `fdp_currentProject` — Active project ID

## Contract Clauses (10)

1. Scope of Work
2. Contract Price & Payment Terms (50/50 split)
3. Timeline
4. Warranty (labour + materials)
5. Customer Responsibilities
6. Change Orders
7. Cancellation Policy
8. Liability & Insurance (WSIB + CGL)
9. Dispute Resolution
10. General Conditions
