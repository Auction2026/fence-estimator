/**
 * TAB 11 - Crew Breakdown
 * frontend/js/tabs/tab11-crew.js
 */

'use strict';

var Tab11Crew = (function () {

  var crew = [];

  var ROLES = [
    'Foreman', 'Lead Installer', 'Installer', 'Apprentice',
    'Equipment Operator', 'Concrete Finisher', 'Driver / Laborer',
  ];

  function init() {
    loadSavedData();
    renderTable();
    bindEvents();
  }

  function loadSavedData() {
    crew = FenceApp.project.crew ? JSON.parse(JSON.stringify(FenceApp.project.crew)) : [];
  }

  function renderTable() {
    var tbody = document.getElementById('crew-tbody');
    if (!tbody) return;

    if (crew.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:20px">No crew members added yet.</td></tr>';
      updateSummary();
      return;
    }

    var roleOptions = ROLES.map(function (r) { return '<option value="' + r + '">' + r + '</option>'; }).join('');

    tbody.innerHTML = crew.map(function (member, i) {
      var lineTotal = (parseFloat(member.hours) || 0) * (parseFloat(member.rate) || 0);
      return '<tr>' +
        '<td><input class="form-control" type="text" value="' + UI.escapeHtml(member.name || '') + '" onchange="Tab11Crew.updateField(' + i + ',\'name\',this.value)"></td>' +
        '<td><select class="form-control" onchange="Tab11Crew.updateField(' + i + ',\'role\',this.value)">' +
          roleOptions.replace('>' + (member.role || 'Installer'), ' selected>' + (member.role || 'Installer')) +
          '</select></td>' +
        '<td><input class="form-control" type="number" min="0" step="0.5" value="' + (member.hours || 0) + '" onchange="Tab11Crew.updateField(' + i + ',\'hours\',this.value)" style="width:80px"></td>' +
        '<td><input class="form-control" type="number" min="0" step="0.5" value="' + (member.rate || 0) + '" onchange="Tab11Crew.updateField(' + i + ',\'rate\',this.value)" style="width:90px"></td>' +
        '<td class="fw-bold">' + formatCurrency(lineTotal) + '</td>' +
        '<td><button class="btn btn-sm btn-danger" onclick="Tab11Crew.removeMember(' + i + ')">🗑</button></td>' +
        '</tr>';
    }).join('');

    updateSummary();
  }

  function updateField(index, field, value) {
    if (!crew[index]) return;
    crew[index][field] = (field === 'hours' || field === 'rate') ? parseFloat(value) || 0 : value;
    renderTable();
  }

  function removeMember(index) {
    crew.splice(index, 1);
    renderTable();
  }

  function addMember() {
    crew.push({ name: '', role: 'Installer', hours: 8, rate: 35 });
    renderTable();
  }

  function updateSummary() {
    var totalCost  = crew.reduce(function (s, m) { return s + (m.hours || 0) * (m.rate || 0); }, 0);
    var totalHours = crew.reduce(function (s, m) { return s + (m.hours || 0); }, 0);
    UI.setCurrency('crew-total-cost',  totalCost);
    UI.setText('crew-total-hours', totalHours.toFixed(1) + ' hrs');
    UI.setText('crew-count', crew.length + ' members');
  }

  function bindEvents() {
    var btnAdd  = document.getElementById('btn-add-crew');
    if (btnAdd)  btnAdd.addEventListener('click', addMember);

    var btnSave = document.getElementById('btn-save-crew');
    if (btnSave) btnSave.addEventListener('click', save);
  }

  function save() {
    FenceApp.project.crew = crew;
    Storage.saveProject(FenceApp.project);
    UI.showToast('Crew saved ✓', 'success');
  }

  return { init, save, addMember, removeMember, updateField };

})();

window.Tab11Crew = Tab11Crew;
