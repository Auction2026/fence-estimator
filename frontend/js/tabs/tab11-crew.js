/**
 * tab11-crew.js – Crew Breakdown tab
 */
const Tab11Crew = (() => {
  let crew = [];

  function init() {
    crew = Storage.loadCrew();
    renderTable();
    document.getElementById('btn-add-crew')?.addEventListener('click', addMember);
  }

  function addMember() {
    const name  = prompt('Crew Member Name:');
    if (!name) return;
    const role  = prompt('Role (Foreman/Installer/Helper):', 'Installer') || 'Installer';
    const rate  = parseFloat(prompt('Hourly Rate ($):', '65')) || 65;
    const hours = parseFloat(prompt('Scheduled Hours:', '8')) || 8;
    const start = prompt('Start Date (YYYY-MM-DD):', UI.todayISO()) || UI.todayISO();
    const end   = prompt('End Date (YYYY-MM-DD):', UI.todayISO()) || UI.todayISO();
    crew.push({ name, role, rate, hours, start, end });
    Storage.saveCrew(crew);
    renderTable();
  }

  function renderTable() {
    if (crew.length === 0) { UI.setTableEmpty('crew-tbody', 'No crew members assigned.', 8); updateTotal(); return; }
    const tbody = document.getElementById('crew-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    crew.forEach((m, i) => {
      const cost = (m.rate * m.hours).toFixed(2);
      UI.appendRow('crew-tbody', [
        m.name, m.role, Calculations.formatCurrency(m.rate), m.hours,
        m.start, m.end, `<strong>${Calculations.formatCurrency(cost)}</strong>`,
        `<button class="btn btn-sm btn-danger" onclick="Tab11Crew.remove(${i})">🗑️</button>`
      ]);
    });
    updateTotal();
  }

  function remove(i) {
    crew.splice(i, 1);
    Storage.saveCrew(crew);
    renderTable();
  }

  function updateTotal() {
    const total = Calculations.calcCrewTotal(crew);
    UI.setText('crew-total-cost', Calculations.formatCurrency(total));
  }

  return { init, remove };
})();
