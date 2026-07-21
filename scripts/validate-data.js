#!/usr/bin/env node
/**
 * Fence Depot — Data Validation Script
 *
 * Validates JSON files in data/processed/ against the schemas in data/schema/
 * Prints a detailed report of any issues found.
 *
 * Usage:
 *   node scripts/validate-data.js                              # validate all processed files
 *   node scripts/validate-data.js inventory-data-2026-07-21.json
 */

const fs   = require('fs');
const path = require('path');

const ROOT          = path.join(__dirname, '..');
const PROCESSED_DIR = path.join(ROOT, 'data', 'processed');
const SCHEMA_DIR    = path.join(ROOT, 'data', 'schema');

const VALID_CATEGORIES = ['Chain Link','Wood','Vinyl','Wrought Iron','Guide Rail','Concrete & Aggregate','Hardware','Tools','Other'];
const VALID_UNITS      = ['Each','LF','Roll','Bag','Tonne','Box','Bundle','Sheet','Pail','Tube','Panel','Post','Gate'];
const VALID_SKILL      = ['Basic','Intermediate','Advanced','Specialist'];

const args = process.argv.slice(2);
const targetFile = args[0] || null;

function main() {
  console.log('\n🔍 Fence Depot — Data Validation');
  console.log('=================================\n');

  if (!fs.existsSync(PROCESSED_DIR)) {
    console.log('❌ No data/processed/ directory found.');
    console.log('   Run import-inventory.js first to generate processed data files.\n');
    process.exit(1);
  }

  let files = fs.readdirSync(PROCESSED_DIR).filter(f => f.endsWith('.json'));
  if (targetFile) files = files.filter(f => f === targetFile || f === path.basename(targetFile));
  if (files.length === 0) {
    console.log('❌ No JSON files found in data/processed/\n');
    process.exit(1);
  }

  let totalIssues = 0;
  files.forEach(file => {
    console.log(`📄 Validating: ${file}`);
    const filePath = path.join(PROCESSED_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (!Array.isArray(data)) {
      console.log(`   ❌ File is not a JSON array\n`);
      totalIssues++;
      return;
    }

    const type = detectType(file, data);
    console.log(`   🏷️  Type: ${type} | Records: ${data.length}`);

    const issues = validateData(data, type);
    totalIssues += issues.length;

    if (issues.length === 0) {
      console.log(`   ✅ All ${data.length} records are valid\n`);
    } else {
      const errors = issues.filter(i => i.level === 'error');
      const warns  = issues.filter(i => i.level === 'warn');
      console.log(`   ⚠️  Found ${issues.length} issues (${errors.length} errors, ${warns.length} warnings)`);
      issues.slice(0, 15).forEach(i => console.log(`      Row ${i.row}: [${i.level.toUpperCase()}] ${i.msg}`));
      if (issues.length > 15) console.log(`      ... and ${issues.length - 15} more`);
      console.log('');
    }
  });

  if (totalIssues === 0) {
    console.log('🎉 All files passed validation!\n');
  } else {
    console.log(`\n⚠️  Total issues across all files: ${totalIssues}`);
    console.log('   Fix the issues and re-run validation, or re-import the source files.\n');
  }
}

function detectType(filename, data) {
  const fn = filename.toLowerCase();
  if (fn.includes('install')) return 'installation';
  if (fn.includes('supplier')) return 'suppliers';
  const keys = data[0] ? Object.keys(data[0]).join(' ') : '';
  if (keys.includes('labour_hours') || keys.includes('crew_size')) return 'installation';
  if (keys.includes('supplier_name') && !keys.includes('cost_price')) return 'suppliers';
  return 'inventory';
}

function validateData(data, type) {
  const issues = [];

  data.forEach((row, idx) => {
    const rowNum = idx + 1;

    if (type === 'inventory') {
      if (!row.item_name) issues.push({ row: rowNum, level: 'error', msg: 'Missing item_name' });

      if (row.cost_price !== null && row.cost_price !== undefined) {
        if (typeof row.cost_price !== 'number' || row.cost_price < 0)
          issues.push({ row: rowNum, level: 'error', msg: `cost_price must be a non-negative number, got: ${row.cost_price}` });
      }
      if (row.sell_price !== null && row.sell_price !== undefined) {
        if (typeof row.sell_price !== 'number' || row.sell_price < 0)
          issues.push({ row: rowNum, level: 'error', msg: `sell_price must be a non-negative number, got: ${row.sell_price}` });
      }
      if (row.cost_price && row.sell_price && row.cost_price > row.sell_price)
        issues.push({ row: rowNum, level: 'warn', msg: `cost_price ($${row.cost_price}) > sell_price ($${row.sell_price})` });

      if (row.category && !VALID_CATEGORIES.includes(row.category))
        issues.push({ row: rowNum, level: 'warn', msg: `Unknown category: "${row.category}". Valid: ${VALID_CATEGORIES.join(', ')}` });

      if (row.stock_qty !== null && row.stock_qty !== undefined && typeof row.stock_qty !== 'number')
        issues.push({ row: rowNum, level: 'warn', msg: `stock_qty should be a number, got: "${row.stock_qty}"` });

    } else if (type === 'installation') {
      if (!row.fence_type) issues.push({ row: rowNum, level: 'error', msg: 'Missing fence_type' });
      if (!row.task_name)  issues.push({ row: rowNum, level: 'error', msg: 'Missing task_name' });
      if (row.labour_hours_per_unit === null || row.labour_hours_per_unit === undefined)
        issues.push({ row: rowNum, level: 'warn', msg: 'Missing labour_hours_per_unit' });
      else if (typeof row.labour_hours_per_unit !== 'number' || row.labour_hours_per_unit < 0)
        issues.push({ row: rowNum, level: 'error', msg: `labour_hours_per_unit must be a non-negative number` });

      if (row.skill_level && !VALID_SKILL.includes(row.skill_level))
        issues.push({ row: rowNum, level: 'warn', msg: `Unknown skill_level: "${row.skill_level}". Valid: ${VALID_SKILL.join(', ')}` });

    } else if (type === 'suppliers') {
      if (!row.supplier_name) issues.push({ row: rowNum, level: 'error', msg: 'Missing supplier_name' });
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email))
        issues.push({ row: rowNum, level: 'warn', msg: `Invalid email format: "${row.email}"` });
      if (row.lead_time_days && typeof row.lead_time_days !== 'number')
        issues.push({ row: rowNum, level: 'warn', msg: `lead_time_days should be a number` });
    }

    // All types: check last_updated
    if (row.last_updated && !/^\d{4}-\d{2}-\d{2}$/.test(row.last_updated))
      issues.push({ row: rowNum, level: 'warn', msg: `last_updated should be YYYY-MM-DD format` });
  });

  return issues;
}

main();
