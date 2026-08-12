/**
 * TAB 10 - Extras / Add-Ons
 * frontend/js/tabs/tab10-extras.js
 */

'use strict';

var Tab10Extras = (function () {

  var extras = [];

  var PRESET_EXTRAS = [
    { name: 'Post Cap Installation',   unit: 'Each', rate: 15 },
    { name: 'Privacy Slats',           unit: 'LF',   rate: 3 },
    { name: 'Barbed Wire Topping',     unit: 'LF',   rate: 2.5 },
    { name: 'Electric Gate Opener',    unit: 'Each', rate: 850 },
    { name: 'Padlock & Hardware Set',  unit: 'Set',  rate: 65 },
    { name: 'Staining / Sealing',      unit: 'LF',   rate: 4 },
    { name: 'Decorative Post Tops',    unit: 'Each', rate: 25 },
    { name: 'Concrete Curb / Mow Strip', unit: 'LF', rate: 12 },
    { name: 'Site Survey / Markout',   unit: 'Job',  rate: 300 },
    { name: 'Weekend / Rush Surcharge',unit: 'Job',  rate: 500 },
  ];

  function init() {
    loadSavedData();
    renderTable();
    bindEvents();
  }

  function loadSavedData() {
    extras = FenceApp.project.extras ? JSON.parse(JSON.stringify(FenceApp.project.extras)) : [];
  }

  function renderTable() {
    var tbody = document.getElementById('extras-tbody');
    if (!tbody) return;

    if (extras.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted" style="padding:20px">No extras added yet.</td></tr>';
      updateTotal();
      return;
    }

    tbody.innerHTML = extras.map(function (ex, i) {
      var lineTotal = (parseFloat(ex.qty) || 0) * (parseFloat(ex.rate) || 0);
      return '<tr>' +
        '<td><input class="form-control" type="text" value="' + UI.escapeHtml(ex.name) + '" onchange="Tab10Extras.updateField(' + i + ',\'name\',this.value)"></td>' +
        '<td><input class="form-control" type="number" min="0" step="0.01" value="' + ex.qty + '" onchange="Tab10Extras.updateField(' + i + ',\'qty\',this.value)" style="width:80px"></td>' +
        '<td>' + UI.escapeHtml(ex.unit || 'Each') + '</td>' +
        '<td><input class="form-control" type="number" min="0" step="0.01" value="' + ex.rate + '" onchange="Tab10Extras.updateField(' + i + ',\'rate\',this.value)" style="width:100px"></td>' +
        '<td class="fw-bold">' + formatCurrency(lineTotal) + '</td>' +
        '<td><button class="btn btn-sm btn-danger" onclick="Tab10Extras.removeExtra(' + i + ')">🗑</button></td>' +
        '</tr>';
    }).join('');

    updateTotal();
  }

  function updateField(index, field, value) {
    if (!extras[index]) return;
    extras[index][field] = (field === 'qty' || field === 'rate') ? parseFloat(value) || 0 : value;
    renderTable();
  }

  function removeExtra(index) {
    extras.splice(index, 1);
    renderTable();
  }

  function addExtra(preset) {
    extras.push({
      name: preset ? preset.name : 'Custom Item',
      qty:  1,
      unit: preset ? preset.unit : 'Each',
      rate: preset ? preset.rate : 0,
    });
    renderTable();
  }

  function updateTotal() {
    var total = extras.reduce(function (s, ex) { return s + (ex.qty || 0) * (ex.rate || 0); }, 0);
    UI.setCurrency('extras-total', total);
    UI.setText('extras-count', extras.length + ' items');
  }

  function renderPresets() {
    var container = document.getElementById('extras-presets');
    if (!container) return;
    container.innerHTML = PRESET_EXTRAS.map(function (p) {
      return '<button class="btn btn-outline btn-sm" onclick="Tab10Extras.addExtra(' + JSON.stringify(p).replace(/"/g, '&quot;') + ')">' +
        p.name + ' (' + formatCurrency(p.rate) + '/' + p.unit + ')' +
        '</button>';
    }).join(' ');
  }

  function bindEvents() {
    renderPresets();
    var btnAdd = document.getElementById('btn-add-extra');
    if (btnAdd) btnAdd.addEventListener('click', function () { addExtra(null); });

    var btnSave = document.getElementById('btn-save-extras');
    if (btnSave) btnSave.addEventListener('click', save);
  }

  function save() {
    FenceApp.project.extras = extras;
    Storage.saveProject(FenceApp.project);
    UI.showToast('Extras saved ✓', 'success');
  }

  return { init, save, addExtra, removeExtra, updateField };

})();

window.Tab10Extras = Tab10Extras;
