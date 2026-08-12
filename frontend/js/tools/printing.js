/**
 * FENCE DEPOT ESTIMATOR - Print Tool
 * frontend/js/tools/printing.js
 */

'use strict';

var PrintTool = (function () {

  function printEstimate() {
    var estimate = FenceApp.project.estimate || Calculations.calculateFullEstimate(FenceApp.project);
    var customer = FenceApp.project.customer || {};
    var specs    = FenceApp.project.specs    || {};

    var content = buildEstimatePrintHTML(customer, specs, estimate);
    openPrintWindow(content, 'Fence Estimate');
  }

  function printContract() {
    var contract = FenceApp.project.contract || {};
    var customer = FenceApp.project.customer || {};
    var estimate = FenceApp.project.estimate || {};

    var content = buildContractPrintHTML(customer, contract, estimate);
    openPrintWindow(content, 'Fence Contract');
  }

  function openPrintWindow(htmlContent, title) {
    var win = window.open('', '_blank', 'width=900,height=700');
    win.document.write('<!DOCTYPE html><html><head><title>' + title + '</title>' +
      '<style>' + getPrintStyles() + '</style>' +
      '</head><body>' + htmlContent + '</body></html>');
    win.document.close();
    setTimeout(function () { win.print(); }, 500);
  }

  function buildEstimatePrintHTML(customer, specs, estimate) {
    var mat   = estimate.materials    || {};
    var lab   = estimate.labor        || {};
    var equip = estimate.equipment    || {};
    var ext   = estimate.extras       || {};
    var co    = estimate.changeOrders || {};
    var settings = Storage.loadSettings();

    return '<div class="page">' +
      '<div class="header">' +
        '<div class="company">' +
          '<div class="company-name">' + esc(settings.company || 'Fence Depot') + '</div>' +
          (settings.phone ? '<div>' + esc(settings.phone) + '</div>' : '') +
          (settings.email ? '<div>' + esc(settings.email) + '</div>' : '') +
          (settings.license ? '<div>Lic# ' + esc(settings.license) + '</div>' : '') +
        '</div>' +
        '<div class="doc-title"><h1>FENCE ESTIMATE</h1>' +
          '<p>Date: ' + formatDate(new Date().toISOString()) + '</p>' +
          (FenceApp.currentProject ? '<p>Project ID: ' + esc(FenceApp.currentProject) + '</p>' : '') +
        '</div>' +
      '</div>' +

      '<div class="customer-info">' +
        '<div><strong>Customer:</strong> ' + esc(customer.name || '--') + '</div>' +
        '<div><strong>Address:</strong> ' + esc([customer.address, customer.city, customer.state, customer.zip].filter(Boolean).join(', ') || '--') + '</div>' +
        '<div><strong>Phone:</strong> ' + esc(customer.phone || '--') + '</div>' +
        '<div><strong>Email:</strong> ' + esc(customer.email || '--') + '</div>' +
      '</div>' +

      '<div class="specs-summary">' +
        '<h3>Project Specifications</h3>' +
        '<table><tr><td><strong>Fence Type:</strong></td><td>' + esc(specs.fenceType || '--') + '</td>' +
          '<td><strong>Height:</strong></td><td>' + (specs.height || '--') + ' ft</td>' +
          '<td><strong>Linear Feet:</strong></td><td>' + (specs.linearFeet || '--') + ' ft</td>' +
        '</tr></table>' +
      '</div>' +

      '<h3>Cost Breakdown</h3>' +
      '<table class="cost-table">' +
        '<thead><tr><th>Category</th><th>Description</th><th class="right">Amount</th></tr></thead>' +
        '<tbody>' +
          '<tr><td>Materials</td><td>Fence materials, posts, gates, hardware, concrete</td><td class="right">' + fc(mat.withMarkup) + '</td></tr>' +
          '<tr><td>Material Tax</td><td>Sales tax on materials</td><td class="right">' + fc(mat.materialTax) + '</td></tr>' +
          '<tr><td>Labor</td><td>Installation, post setting, gates, cleanup</td><td class="right">' + fc(lab.subtotal) + '</td></tr>' +
          '<tr><td>Equipment</td><td>Tools, fuel, misc equipment</td><td class="right">' + fc(equip.subtotal) + '</td></tr>' +
          (ext.subtotal ? '<tr><td>Extras</td><td>Additional items & add-ons</td><td class="right">' + fc(ext.subtotal) + '</td></tr>' : '') +
          (co.subtotal  ? '<tr><td>Change Orders</td><td>Approved change orders</td><td class="right">' + fc(co.subtotal) + '</td></tr>'  : '') +
        '</tbody>' +
        '<tfoot>' +
          '<tr class="grand-total"><td colspan="2"><strong>TOTAL ESTIMATE</strong></td><td class="right"><strong>' + fc(estimate.grandTotal) + '</strong></td></tr>' +
          '<tr><td colspan="2">Price Per Linear Foot</td><td class="right">' + fc(estimate.perLinearFoot) + '/ft</td></tr>' +
        '</tfoot>' +
      '</table>' +

      '<div class="terms">' +
        '<h3>Terms & Conditions</h3>' +
        '<p>This estimate is valid for 30 days from the date above. Prices are subject to change. A 50% deposit is required to begin work. Final payment is due upon completion.</p>' +
      '</div>' +

      '<div class="signatures">' +
        '<div><div class="sig-line"></div><p>Customer Signature</p></div>' +
        '<div><div class="sig-line"></div><p>Authorized Contractor</p></div>' +
        '<div><div class="sig-line"></div><p>Date</p></div>' +
      '</div>' +

      '</div>';
  }

  function buildContractPrintHTML(customer, contract, estimate) {
    var settings = Storage.loadSettings();
    return '<div class="page">' +
      '<div class="header">' +
        '<div class="company">' +
          '<div class="company-name">' + esc(settings.company || 'Fence Depot') + '</div>' +
        '</div>' +
        '<div class="doc-title"><h1>FENCE INSTALLATION CONTRACT</h1>' +
          '<p>Date: ' + formatDate(new Date().toISOString()) + '</p>' +
        '</div>' +
      '</div>' +

      '<div class="customer-info">' +
        '<div><strong>Customer:</strong> ' + esc(customer.name || '--') + '</div>' +
        '<div><strong>Address:</strong> ' + esc([customer.address, customer.city, customer.state, customer.zip].filter(Boolean).join(', ') || '--') + '</div>' +
        '<div><strong>Contract Total:</strong> <span class="total-price">' + fc(contract.total || estimate.grandTotal || 0) + '</span></div>' +
        (contract.locked ? '<div><strong>Locked:</strong> ' + formatDate(contract.lockedAt) + '</div>' : '') +
      '</div>' +

      '<div class="terms">' +
        '<h3>Contract Terms</h3>' +
        '<p>This agreement is entered into between the Customer named above and ' + esc(settings.company || 'Fence Depot') + ', hereinafter referred to as "Contractor."</p>' +
        '<ol>' +
          '<li><strong>Scope of Work:</strong> Contractor shall furnish all materials and labor for fence installation as specified in the attached estimate.</li>' +
          '<li><strong>Payment Terms:</strong> 50% deposit due upon signing. Remaining balance due upon completion of work.</li>' +
          '<li><strong>Permits:</strong> Customer is responsible for ensuring all required permits are obtained unless otherwise agreed in writing.</li>' +
          '<li><strong>Warranty:</strong> Contractor warrants workmanship for 12 months from completion date.</li>' +
          '<li><strong>Changes:</strong> Any changes to the scope of work must be authorized in writing via a signed Change Order.</li>' +
          '<li><strong>Delays:</strong> Contractor is not liable for delays caused by weather, material shortages, or other factors beyond reasonable control.</li>' +
        '</ol>' +
      '</div>' +

      '<div class="signatures">' +
        '<div>' +
          (contract.signature ? '<img src="' + contract.signature + '" style="height:60px;border-bottom:1px solid #ccc;width:250px">' : '<div class="sig-line"></div>') +
          '<p>Customer Signature</p>' +
        '</div>' +
        '<div><div class="sig-line"></div><p>Contractor Signature</p></div>' +
        '<div><div class="sig-line"></div><p>Date</p></div>' +
      '</div>' +
      '</div>';
  }

  function getPrintStyles() {
    return 'body{font-family:Arial,sans-serif;font-size:13px;color:#333;margin:0;padding:0}' +
      '.page{max-width:800px;margin:0 auto;padding:40px}' +
      '.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #1B2D4D;padding-bottom:20px;margin-bottom:24px}' +
      '.company-name{font-size:22px;font-weight:700;color:#1B2D4D}' +
      '.doc-title{text-align:right}' +
      '.doc-title h1{font-size:20px;margin:0;color:#1B2D4D}' +
      '.customer-info{background:#f5f7fa;padding:16px;border-radius:6px;margin-bottom:20px}' +
      '.customer-info div{margin:4px 0}' +
      '.specs-summary{margin-bottom:20px}' +
      'h3{color:#1B2D4D;margin:0 0 12px}' +
      '.cost-table{width:100%;border-collapse:collapse;margin-bottom:24px}' +
      '.cost-table th{background:#1B2D4D;color:#fff;padding:10px 12px;text-align:left}' +
      '.cost-table td{padding:9px 12px;border-bottom:1px solid #eee}' +
      '.right{text-align:right}' +
      '.grand-total td{background:#f5f7fa;font-size:15px}' +
      '.terms{margin-bottom:24px;font-size:12px;line-height:1.6}' +
      '.terms ol{padding-left:18px}' +
      '.terms li{margin-bottom:6px}' +
      '.signatures{display:flex;gap:40px;margin-top:40px}' +
      '.sig-line{border-bottom:1px solid #333;height:60px;width:220px}' +
      '.signatures p{font-size:11px;margin-top:4px;color:#666}' +
      '.total-price{font-size:18px;font-weight:700;color:#0FA89F}' +
      '@media print{body{padding:0}.page{padding:20px}}';
  }

  function esc(str) { return String(str || '').replace(/[<>&"]/g, function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];}); }
  function fc(n)    { return '$' + parseFloat(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  return { printEstimate, printContract };

})();

window.PrintTool = PrintTool;
