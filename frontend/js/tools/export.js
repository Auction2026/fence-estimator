/**
 * FENCE DEPOT ESTIMATOR - Export Tool
 * export.js — PDF, CSV, print utilities (client-side)
 */
'use strict';

const ExportTool = (() => {

  // ── Print ────────────────────────────────────────────────
  function printEstimate() {
    window.print();
  }

  // ── CSV Export ───────────────────────────────────────────
  function downloadCSV(rows, columns, filename = 'estimate.csv') {
    const header = columns.map(c => `"${c.label}"`).join(',');
    const body   = rows.map(row =>
      columns.map(c => {
        const val = String(row[c.key] ?? '').replace(/"/g, '""');
        return `"${val}"`;
      }).join(',')
    ).join('\n');
    const csv  = header + '\n' + body;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    _triggerDownload(blob, filename);
  }

  // ── JSON Export ──────────────────────────────────────────
  function downloadJSON(data, filename = 'estimate.json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    _triggerDownload(blob, filename);
  }

  // ── HTML→PDF (via browser print dialog) ──────────────────
  function downloadEstimateHTML(htmlContent, filename = 'estimate.html') {
    const blob = new Blob([
      `<!DOCTYPE html><html><head><meta charset="UTF-8">
       <title>Fence Estimate</title>
       <style>body{font-family:Arial,sans-serif;padding:40px;color:#333}
       table{border-collapse:collapse;width:100%}
       th,td{border:1px solid #ddd;padding:8px}th{background:#1B2D4D;color:white}
       .total{font-weight:bold;font-size:18px;color:#0FA89F}</style>
       </head><body>${htmlContent}</body></html>`
    ], { type: 'text/html' });
    _triggerDownload(blob, filename);
  }

  // ── Estimate to CSV helper ───────────────────────────────
  function estimateToCSV(estimate) {
    if (!estimate || !estimate._result) return;
    const cols = [
      { key: 'plu',         label: 'PLU' },
      { key: 'description', label: 'Description' },
      { key: 'category',    label: 'Category' },
      { key: 'qty',         label: 'Quantity' },
      { key: 'unit',        label: 'Unit' },
      { key: 'unitPrice',   label: 'Unit Price' },
      { key: 'totalPrice',  label: 'Total Price' },
    ];
    downloadCSV(estimate._result.items, cols, `estimate-${estimate.estimateId || 'draft'}.csv`);
  }

  // ── Internal helper ──────────────────────────────────────
  function _triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  return { printEstimate, downloadCSV, downloadJSON, downloadEstimateHTML, estimateToCSV };
})();

window.ExportTool = ExportTool;
