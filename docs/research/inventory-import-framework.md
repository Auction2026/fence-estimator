# Inventory Import Framework — Research & Design Notes

**Date:** 2026-07-21  
**Session:** Data import infrastructure setup

---

## Context

The user has existing inventory data in an external program (QuickBooks, Excel, Google Sheets, or a legacy system). The goal is to allow them to re-download/export that data and import it directly into the fence-estimator repository without manual re-entry.

The repo is currently a pure HTML/JS single-file SPA with no backend.

---

## Data Types Identified

| Type | Description | Key Fields |
|------|-------------|------------|
| **Inventory** | Materials with costs and prices | sku, item_name, category, unit, cost_price, sell_price, stock_qty, supplier |
| **Installation** | Labour tasks and time estimates | fence_type, task_name, unit, labour_hours_per_unit, crew_size, skill_level |
| **Suppliers** | Supplier contacts and terms | supplier_name, phone, email, payment_terms, lead_time_days |

---

## Approach Chosen

Since there is no Node.js backend or build system, two parallel approaches are provided:

### 1. Browser-based (zero install needed)
- `tools/import-tool.html` — self-contained HTML page with:
  - File upload via drag-and-drop
  - CSV parsing via PapaParse (CDN)
  - Excel parsing via SheetJS (CDN)
  - Auto column-mapping with fuzzy matching
  - Validation with row-level status (OK/Warning/Error)
  - JSON download to save to `data/processed/`

### 2. Node.js scripts (for power users / automation)
- `scripts/import-inventory.js` — main import script
- `scripts/validate-data.js` — standalone validator
- `scripts/transform-csv.js` — quick CSV→JSON converter
- `package.json` — deps: `csv-parse`, `xlsx`

---

## File Formats Supported

| Format | Tool | Notes |
|--------|------|-------|
| `.csv` | Both | Works with Google Sheets exports |
| `.xlsx` | Both | Uses SheetJS |
| `.xls` | Both | Uses SheetJS |
| `.json` | Both | Pass-through with normalization |
| `.txt` (CSV) | Both | Treated as CSV |

---

## Column Auto-Detection

The import tool attempts to auto-map column names from the user's file to the system fields.
It uses a dictionary of ~50 known aliases per field (e.g. "cost", "cost price", "our cost", "purchase price" all map to `cost_price`).

---

## Data Storage

Processed JSON files land in `data/processed/` — these are the files the estimator reads.
The `.gitignore` excludes raw import files (may contain sensitive pricing) but includes processed JSON.

---

## POS Integration Readiness

The JSON schema is designed to be POS-compatible:
- `sku` field maps to most POS part numbers
- `stock_qty` and `reorder_point` support real-time sync
- `last_updated` timestamp enables delta sync
- `active` flag allows soft-delete without data loss

When connecting a POS, the POS system simply writes updated JSON to `data/processed/inventory-data-*.json` using the same schema, and the estimator picks it up automatically.

---

## Known Gaps / Future Work

1. The estimator (`index.html`) still has hard-coded price data — needs update to read from `data/processed/` JSON files
2. No automatic polling / file-watch — user must refresh page to pick up new imports
3. Excel multi-sheet support not yet handled (uses only first sheet)
4. No conflict resolution when re-importing (current approach: full replace)
