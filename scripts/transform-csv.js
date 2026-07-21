#!/usr/bin/env node
/**
 * Fence Depot — CSV/Excel to JSON Transformer
 *
 * A quick conversion utility — converts any CSV or Excel file to a
 * clean JSON array and prints it (or saves it to a file).
 *
 * Usage:
 *   node scripts/transform-csv.js my-file.csv
 *   node scripts/transform-csv.js my-file.xlsx --out output.json
 *   node scripts/transform-csv.js my-file.csv --pretty          # pretty-print JSON
 */

const fs   = require('fs');
const path = require('path');

const args      = process.argv.slice(2);
const inputArg  = args.find(a => !a.startsWith('--'));
const outArg    = args.find((a, i) => args[i-1] === '--out') || null;
const pretty    = args.includes('--pretty');

if (!inputArg) {
  console.error('Usage: node scripts/transform-csv.js <file.csv|file.xlsx> [--out output.json] [--pretty]');
  process.exit(1);
}

const inputPath = path.isAbsolute(inputArg) ? inputArg : path.join(process.cwd(), inputArg);
if (!fs.existsSync(inputPath)) {
  console.error('File not found: ' + inputPath);
  process.exit(1);
}

const ext = path.extname(inputPath).toLowerCase();

async function main() {
  let data;

  if (ext === '.xlsx' || ext === '.xls') {
    try {
      const XLSX = require('xlsx');
      const wb = XLSX.readFile(inputPath);
      const ws = wb.Sheets[wb.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(ws, { defval: '' });
    } catch (e) {
      console.error('Could not parse Excel file. Make sure xlsx is installed: npm install xlsx');
      process.exit(1);
    }
  } else if (ext === '.csv' || ext === '.txt') {
    data = await parseCSV(inputPath);
  } else if (ext === '.json') {
    data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  } else {
    console.error('Unsupported file type: ' + ext);
    process.exit(1);
  }

  const json = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);

  if (outArg) {
    const outPath = path.isAbsolute(outArg) ? outArg : path.join(process.cwd(), outArg);
    fs.writeFileSync(outPath, json, 'utf8');
    console.log(`✅ Saved ${data.length} records to: ${outPath}`);
  } else {
    process.stdout.write(json + '\n');
  }
}

function parseCSV(filePath) {
  return new Promise((resolve) => {
    try {
      const { parse } = require('csv-parse/sync');
      const content = fs.readFileSync(filePath, 'utf8');
      resolve(parse(content, { columns: true, skip_empty_lines: true, trim: true, bom: true }));
    } catch {
      // Fallback built-in parser
      const lines = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n').split('\n').filter(Boolean);
      if (lines.length < 2) { resolve([]); return; }
      const headers = splitCSVLine(lines[0]);
      const records = lines.slice(1).map(line => {
        const vals = splitCSVLine(line);
        const obj = {};
        headers.forEach((h, i) => { obj[h.trim()] = (vals[i] || '').trim(); });
        return obj;
      });
      resolve(records);
    }
  });
}

function splitCSVLine(line) {
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

main().catch(e => { console.error('Error:', e.message); process.exit(1); });
