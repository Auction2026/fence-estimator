/**
 * FENCE DEPOT ESTIMATOR - Export Tool
 * frontend/js/tools/export.js
 */

'use strict';

var ExportTool = (function () {

  // ---- PDF Export (uses browser print dialog as PDF) ----
  function exportPDF() {
    // Try server-side PDF first
    if (FenceApp.currentProject && FenceApp.isLoggedIn) {
      API.generatePDF(FenceApp.currentProject, 'estimate').catch(function () {
        // Fallback to print
        PrintTool.printEstimate();
      });
    } else {
      PrintTool.printEstimate();
    }
  }

  // ---- CSV Export ----
  function exportEstimateCSV() {
    var estimate = FenceApp.project.estimate || Calculations.calculateFullEstimate(FenceApp.project);
    var customer = FenceApp.project.customer || {};
    var specs    = FenceApp.project.specs    || {};
    var mat      = estimate.materials    || {};
    var lab      = estimate.labor        || {};
    var equip    = estimate.equipment    || {};
    var ext      = estimate.extras       || {};

    var rows = [
      ['FENCE DEPOT ESTIMATE'],
      ['Project ID', FenceApp.currentProject || ''],
      ['Date', new Date().toLocaleDateString('en-US')],
      [],
      ['CUSTOMER INFORMATION'],
      ['Name',    customer.name    || ''],
      ['Address', customer.address || ''],
      ['City',    customer.city    || ''],
      ['State',   customer.state   || ''],
      ['ZIP',     customer.zip     || ''],
      ['Phone',   customer.phone   || ''],
      ['Email',   customer.email   || ''],
      [],
      ['SPECIFICATIONS'],
      ['Fence Type',   specs.fenceType   || ''],
      ['Height (ft)',  specs.height      || ''],
      ['Linear Feet',  specs.linearFeet  || ''],
      ['Gates',        specs.gates       || '0'],
      ['Color',        specs.color       || ''],
      [],
      ['COST BREAKDOWN', 'Amount'],
      ['Materials (with markup)', mat.withMarkup  || '0'],
      ['Material Tax',            mat.materialTax || '0'],
      ['Labor',                   lab.subtotal    || '0'],
      ['Equipment',               equip.subtotal  || '0'],
      ['Extras',                  (ext.subtotal   || '0')],
      ['Grand Total',             estimate.grandTotal || '0'],
      ['Per Linear Foot',         estimate.perLinearFoot || '0'],
    ];

    // Extras detail
    var extras = FenceApp.project.extras || [];
    if (extras.length > 0) {
      rows.push([]);
      rows.push(['EXTRAS DETAIL', 'Qty', 'Unit', 'Rate', 'Total']);
      extras.forEach(function (ex) {
        rows.push([ex.name, ex.qty, ex.unit, ex.rate, (ex.qty * ex.rate).toFixed(2)]);
      });
    }

    var csv = rows.map(function (row) {
      return row.map(function (cell) {
        var s = String(cell || '');
        if (s.includes(',') || s.includes('"') || s.includes('\n')) {
          return '"' + s.replace(/"/g, '""') + '"';
        }
        return s;
      }).join(',');
    }).join('\r\n');

    downloadFile(csv, 'estimate-' + (FenceApp.currentProject || 'project') + '.csv', 'text/csv');
  }

  // ---- JSON Export ----
  function exportProjectJSON() {
    Storage.exportProjectJSON(FenceApp.currentProject);
  }

  // ---- Excel-compatible CSV (comma-delimited — opens in Excel) ----
  function exportExcel() {
    exportEstimateCSV(); // CSV opens in Excel
  }

  // ---- Helpers ----
  function downloadFile(content, filename, mimeType) {
    var blob = new Blob([content], { type: mimeType + ';charset=utf-8;' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href   = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return {
    exportPDF,
    exportEstimateCSV,
    exportProjectJSON,
    exportExcel,
  };

})();

window.ExportTool = ExportTool;
