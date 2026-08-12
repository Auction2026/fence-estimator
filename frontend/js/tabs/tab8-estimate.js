/**
 * TAB 8 - Estimate Display
 * frontend/js/tabs/tab8-estimate.js
 */

'use strict';

var Tab8Estimate = (function () {

  var estimate = {};

  function init() {
    refresh();
    bindEvents();
  }

  function refresh() {
    estimate = Calculations.calculateFullEstimate(FenceApp.project);
    renderEstimate();
  }

  function renderEstimate() {
    var mat   = estimate.materials   || {};
    var lab   = estimate.labor       || {};
    var equip = estimate.equipment   || {};
    var ext   = estimate.extras      || {};
    var co    = estimate.changeOrders|| {};

    // Material section
    UI.setCurrency('est-mat-base',     mat.baseMaterial);
    UI.setCurrency('est-mat-posts',    mat.posts);
    UI.setCurrency('est-mat-gates',    mat.gates);
    UI.setCurrency('est-mat-hardware', mat.hardware);
    UI.setCurrency('est-mat-concrete', mat.concrete);
    UI.setCurrency('est-mat-markup',   mat.withMarkup - mat.subtotal);
    UI.setCurrency('est-mat-tax',      mat.materialTax);
    UI.setCurrency('est-mat-total',    mat.withMarkup + mat.materialTax);

    // Labor section
    UI.setCurrency('est-lab-linear',   lab.linearFootLabor);
    UI.setCurrency('est-lab-posts',    lab.postSetting);
    UI.setCurrency('est-lab-gates',    lab.gateInstall);
    UI.setCurrency('est-lab-cleanup',  lab.cleanup);
    UI.setCurrency('est-lab-removal',  lab.removalDemo);
    UI.setCurrency('est-lab-total',    lab.subtotal);

    // Equipment
    UI.setCurrency('est-equip-total',  equip.subtotal);

    // Extras
    UI.setCurrency('est-extras-total', ext.subtotal);

    // Change orders
    UI.setCurrency('est-co-total',     co.subtotal);

    // Totals
    UI.setCurrency('est-before-tax',   estimate.beforeTax);
    UI.setCurrency('est-tax',          estimate.tax);
    UI.setCurrency('est-grand-total',  estimate.grandTotal);
    UI.setCurrency('est-per-lf',       estimate.perLinearFoot);

    // Breakdown bar (materials / labor / other)
    var total = estimate.grandTotal || 1;
    var matPct   = Math.round(((mat.withMarkup + mat.materialTax) / total) * 100);
    var labPct   = Math.round((lab.subtotal  / total) * 100);
    var otherPct = 100 - matPct - labPct;

    UI.setProgress('progress-materials', matPct);
    UI.setProgress('progress-labor',     labPct);
    UI.setProgress('progress-other',     otherPct);
    UI.setText('progress-mat-label',   matPct   + '%');
    UI.setText('progress-lab-label',   labPct   + '%');
    UI.setText('progress-other-label', otherPct + '%');

    // Specs summary
    var specs = FenceApp.project.specs || {};
    UI.setText('est-fence-type',  specs.fenceType  || '--');
    UI.setText('est-linear-feet', (specs.linearFeet || '0') + ' ft');
    UI.setText('est-height',      (specs.height || '--') + ' ft');
    UI.setText('est-gate-count',  specs.gates || '0');
    UI.setText('est-post-count',  (estimate.materials || {}).postCount || '0');
  }

  function bindEvents() {
    var btnRecalc = document.getElementById('btn-recalculate');
    if (btnRecalc) btnRecalc.addEventListener('click', refresh);

    var btnSave = document.getElementById('btn-save-estimate');
    if (btnSave) btnSave.addEventListener('click', save);

    var btnPdf = document.getElementById('btn-estimate-pdf');
    if (btnPdf) btnPdf.addEventListener('click', function () {
      if (FenceApp.currentProject) {
        API.generatePDF(FenceApp.currentProject, 'estimate').catch(function () {
          PrintTool.printEstimate();
        });
      } else {
        PrintTool.printEstimate();
      }
    });

    var taxInput = document.getElementById('est-tax-rate');
    if (taxInput) {
      taxInput.addEventListener('change', function () {
        Calculations.TAX_RATES.materials = parseFloat(taxInput.value) / 100 || 0.08;
        refresh();
      });
    }
  }

  function save() {
    FenceApp.project.estimate = estimate;
    Storage.saveProject(FenceApp.project);
    UI.showToast('Estimate saved ✓', 'success');
  }

  function getEstimate() { return estimate; }

  return { init, refresh, save, getEstimate };

})();

window.Tab8Estimate = Tab8Estimate;
