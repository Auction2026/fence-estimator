#!/usr/bin/env node
/**
 * Fence Depot — Inventory Import Script
 *
 * Reads a CSV, Excel (.xlsx/.xls), or JSON file from data/imports/
 * and writes cleaned, validated JSON to data/processed/
 *
 * Usage:
 *   node scripts/import-inventory.js                        # auto-detect files in data/imports/
 *   node scripts/import-inventory.js my-inventory.xlsx      # specific file
 *   node scripts/import-inventory.js my-data.csv --type installation
 *
 * Options:
 *   --type inventory|installation|suppliers   (default: inventory)
 *   --out  filename.json                      (default: auto-named)
 */

const fs   = require('fs');
const path = require('path');

// ─── Paths ──────────────────────────────────────────────────────────────────
const ROOT       = path.join(__dirname, '..');
const IMPORTS_DIR  = path.join(ROOT, 'data', 'imports');
const PROCESSED_DIR = path.join(ROOT, 'data', 'processed');

// ─── Parse CLI args ──────────────────────────────────────────────────────────
const args = process.argv.slice(2);
let inputFile = args.find(a => !a.startsWith('--')) || null;
let importType = (args.find((a, i) => args[i-1] === '--type') || 'inventory').toLowerCase();
let outFile    = args.find((a, i) => args[i-1] === '--out') || null;

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🔧 Fence Depot — Inventory Import Script');
  console.log('==========================================\n');

  // Ensure directories
  [IMPORTS_DIR, PROCESSED_DIR].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });

  // Find input file
  if (!inputFile) {
    const files = fs.readdirSync(IMPORTS_DIR).filter(f =>
      /\.(csv|xlsx|xls|json|txt)$/i.test(f) && f !== 'README.md'
    );
    if (files.length === 0) {
      console.error('❌ No import files found in data/imports/');
      console.log('   Drop a .csv, .xlsx, or .json file there and run again.\n');
      process.exit(1);
    }
    inputFile = files[0];
    if (files.length > 1) {
      console.log(`ℹ️  Multiple files found — processing: ${inputFile}`);
      console.log(`   Others: ${files.slice(1).join(', ')}\n`);
    }
  }

  const inputPath = path.isAbsolute(inputFile)
    ? inputFile
    : path.join(IMPORTS_DIR, inputFile);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}\n`);
    process.exit(1);
  }

  console.log(`📄 Input:  ${inputPath}`);
  console.log(`🏷️  Type:   ${importType}`);

  // Parse
  let rawData;
  const ext = path.extname(inputFile).toLowerCase();

  if (ext === '.json') {
    rawData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
    if (!Array.isArray(rawData)) rawData = [rawData];
  } else if (ext === '.csv' || ext === '.txt') {
    rawData = await parseCSV(inputPath);
  } else if (ext === '.xlsx' || ext === '.xls') {
    rawData = parseExcel(inputPath);
  } else {
    console.error(`❌ Unsupported file type: ${ext}`);
    process.exit(1);
  }

  console.log(`📊 Rows read: ${rawData.length}\n`);

  // Auto-detect type from headers if not specified
  if (importType === 'inventory') {
    const headers = Object.keys(rawData[0] || {}).map(h => h.toLowerCase());
    if (headers.some(h => h.includes('labour') || h.includes('labor') || h.includes('hours') || h.includes('crew'))) {
      importType = 'installation';
      console.log('ℹ️  Auto-detected type: installation\n');
    } else if (headers.some(h => h.includes('supplier_name') || h.includes('lead_time'))) {
      importType = 'suppliers';
      console.log('ℹ️  Auto-detected type: suppliers\n');
    }
  }

  // Transform & validate
  const { data, stats } = transform(rawData, importType);

  // Print stats
  console.log('📈 Validation Results:');
  console.log(`   ✅ OK:       ${stats.ok}`);
  console.log(`   ⚠️  Warnings: ${stats.warn}`);
  console.log(`   ❌ Errors:   ${stats.errors}`);
  if (stats.issues.length > 0) {
    console.log('\n⚠️  Issues found:');
    stats.issues.slice(0, 20).forEach(i => console.log(`   Row ${i.row}: [${i.level}] ${i.msg}`));
    if (stats.issues.length > 20) console.log(`   ... and ${stats.issues.length - 20} more`);
  }

  // Write output
  if (!outFile) {
    const date = new Date().toISOString().split('T')[0];
    outFile = `${importType}-data-${date}.json`;
  }
  const outputPath = path.join(PROCESSED_DIR, outFile);
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf8');

  console.log(`\n✅ Done! Saved ${data.length} records to:`);
  console.log(`   ${outputPath}\n`);
}

// ─── Parse CSV ────────────────────────────────────────────────────────────────
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    try {
      const { parse } = require('csv-parse/sync');
      const content = fs.readFileSync(filePath, 'utf8');
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
      });
      resolve(records);
    } catch (e) {
      // Fallback: manual CSV parse (no dependency)
      console.log('ℹ️  csv-parse not found, using built-in parser');
      const lines = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').split('\n').filter(Boolean);
      if (lines.length < 2) { resolve([]); return; }
      const headers = parseCSVLine(lines[0]);
      const records = lines.slice(1).map(line => {
        const vals = parseCSVLine(line);
        const obj = {};
        headers.forEach((h, i) => { obj[h.trim()] = (vals[i] || '').trim(); });
        return obj;
      });
      resolve(records);
    }
  });
}

function parseCSVLine(line) {
  const result = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; }
    else if (c === ',' && !inQ) { result.push(cur); cur = ''; }
    else { cur += c; }
  }
  result.push(cur);
  return result;
}

// ─── Parse Excel ──────────────────────────────────────────────────────────────
function parseExcel(filePath) {
  try {
    const XLSX = require('xlsx');
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(ws, { defval: '' });
  } catch (e) {
    console.error('❌ Could not read Excel file. Run: npm install xlsx');
    process.exit(1);
  }
}

// ─── Transform & Validate ─────────────────────────────────────────────────────
function transform(rawData, type) {
  const stats = { ok: 0, warn: 0, errors: 0, issues: [] };

  const data = rawData.map((row, idx) => {
    const rowNum = idx + 2; // 1-indexed + header row
    const issues = [];
    const out = normalizeKeys(row);

    if (type === 'inventory') {
      // Required
      if (!out.item_name && !out.name && !out.description) {
        issues.push({ row: rowNum, level: 'error', msg: 'Missing item name' });
      }
      out.item_name = out.item_name || out.name || out.description || '';

      // Numeric fields
      ['cost_price', 'sell_price', 'stock_qty', 'reorder_point'].forEach(k => {
        if (out[k] !== undefined && out[k] !== '') {
          const n = parseFloat(String(out[k]).replace(/[$, ]/g, ''));
          if (isNaN(n)) {
            issues.push({ row: rowNum, level: 'warn', msg: `${k} is not a number: "${out[k]}"` });
            out[k] = null;
          } else {
            out[k] = n;
          }
        } else {
          out[k] = out[k] === '' ? null : out[k];
        }
      });

      // Auto-calc markup
      if (out.cost_price && out.sell_price && out.cost_price > 0) {
        out.markup_percent = Math.round(((out.sell_price - out.cost_price) / out.cost_price) * 10000) / 100;
      }

      // Sanity checks
      if (out.cost_price && out.sell_price && out.cost_price > out.sell_price) {
        issues.push({ row: rowNum, level: 'warn', msg: `Cost ($${out.cost_price}) > Sell ($${out.sell_price})` });
      }

    } else if (type === 'installation') {
      if (!out.fence_type) issues.push({ row: rowNum, level: 'error', msg: 'Missing fence_type' });
      if (!out.task_name)  issues.push({ row: rowNum, level: 'error', msg: 'Missing task_name' });

      ['labour_hours_per_unit', 'crew_size'].forEach(k => {
        if (out[k] !== undefined && out[k] !== '') {
          const n = parseFloat(out[k]);
          if (isNaN(n)) {
            issues.push({ row: rowNum, level: 'warn', msg: `${k} is not a number: "${out[k]}"` });
            out[k] = null;
          } else {
            out[k] = n;
          }
        }
      });

    } else if (type === 'suppliers') {
      if (!out.supplier_name && !out.name) {
        issues.push({ row: rowNum, level: 'error', msg: 'Missing supplier name' });
      }
      out.supplier_name = out.supplier_name || out.name || '';
    }

    // Metadata
    out.last_updated = new Date().toISOString().split('T')[0];
    out.active = true;

    // Track stats
    if (issues.some(i => i.level === 'error')) stats.errors++;
    else if (issues.length) stats.warn++;
    else stats.ok++;
    stats.issues.push(...issues);

    return out;
  });

  return { data, stats };
}

// Normalize object keys: trim whitespace, lowercase, replace spaces/dashes with underscore
function normalizeKeys(obj) {
  const out = {};
  Object.entries(obj).forEach(([k, v]) => {
    const nk = k.trim().toLowerCase().replace(/[\s\-\/]+/g, '_').replace(/[^a-z0-9_]/g, '');
    out[nk] = typeof v === 'string' ? v.trim() : v;
  });
  return out;
}

main().catch(e => { console.error('❌ Fatal error:', e.message); process.exit(1); });
