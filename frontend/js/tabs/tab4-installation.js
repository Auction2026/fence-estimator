/**
 * TAB 4 - Installation Breakdown
 * frontend/js/tabs/tab4-installation.js
 */

'use strict';

var Tab4Installation = (function () {

  var DEFAULT_TASKS = [
    { task: 'Site Preparation & Layout', unit: 'Day', qty: 1, rate: 350, hours: 8 },
    { task: 'Post Hole Digging',         unit: 'Post', qty: 0, rate: 45, hours: 0 },
    { task: 'Concrete & Post Setting',   unit: 'Post', qty: 0, rate: 30, hours: 0 },
    { task: 'Fence Panel Installation',  unit: 'LF',   qty: 0, rate: 8,  hours: 0 },
    { task: 'Gate Installation',         unit: 'Gate', qty: 0, rate: 120, hours: 0 },
    { task: 'Hardware & Fasteners',      unit: 'LF',   qty: 0, rate: 1,  hours: 0 },
    { task: 'Final Inspection & Cleanup',unit: 'Day',  qty: 1, rate: 200, hours: 4 },
  ];

  var tasks = [];

  function init() {
    loadFromSpecs();
    renderTable();
    bindEvents();
  }

  function loadFromSpecs() {
    var specs  = FenceApp.project.specs || {};
    var linFt  = parseFloat(specs.linearFeet) || 0;
    var gates  = parseInt(specs.gates, 10)   || 0;
    var postCt = Math.ceil(linFt / 8) + 1;

    tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
    tasks.forEach(function (t) {
      if (t.unit === 'LF')   { t.qty = linFt;  t.hours = linFt * 0.05; }
      if (t.unit === 'Post') { t.qty = postCt; t.hours = postCt * 0.5; }
      if (t.unit === 'Gate') { t.qty = gates;  t.hours = gates * 2; }
    });

    if (FenceApp.project.installation && FenceApp.project.installation.tasks) {
      tasks = FenceApp.project.installation.tasks;
    }
  }

  function renderTable() {
    var tbody = document.getElementById('installation-tbody');
    if (!tbody) return;
    tbody.innerHTML = tasks.map(function (t, i) {
      var total = (t.qty * t.rate).toFixed(2);
      return '<tr>' +
        '<td>' + UI.escapeHtml(t.task) + '</td>' +
        '<td><input class="form-control" type="number" min="0" step="0.5" value="' + t.qty + '" data-idx="' + i + '" data-field="qty"></td>' +
        '<td><input class="form-control" type="number" min="0" step="0.5" value="' + t.rate + '" data-idx="' + i + '" data-field="rate"></td>' +
        '<td class="fw-bold">' + formatCurrency(t.qty * t.rate) + '</td>' +
        '<td>' + (t.hours || 0).toFixed(1) + ' hrs</td>' +
        '</tr>';
    }).join('');

    // Bind change events
    tbody.querySelectorAll('input').forEach(function (input) {
      input.addEventListener('change', function () {
        var idx   = parseInt(input.dataset.idx, 10);
        var field = input.dataset.field;
        tasks[idx][field] = parseFloat(input.value) || 0;
        renderTable();
        updateTotal();
      });
    });

    updateTotal();
  }

  function updateTotal() {
    var total = tasks.reduce(function (s, t) { return s + t.qty * t.rate; }, 0);
    UI.setCurrency('installation-total', total);

    var hours = tasks.reduce(function (s, t) { return s + (t.hours || 0); }, 0);
    UI.setText('installation-hours', hours.toFixed(1) + ' hrs');
  }

  function bindEvents() {
    var btn = document.getElementById('btn-save-installation');
    if (btn) btn.addEventListener('click', save);
  }

  function save() {
    FenceApp.project.installation = { tasks: tasks };
    Storage.saveProject(FenceApp.project);
    UI.showToast('Installation breakdown saved ✓', 'success');
  }

  return { init, save };

})();

window.Tab4Installation = Tab4Installation;
