// Catalog tab
'use strict';

const Tab16 = {
  init() { this.search = document.getElementById('catalogSearch'); this.filter = document.getElementById('catalogCategoryFilter'); this.body = document.getElementById('catalogTableBody'); this.bindEvents(); this.load(); },
  bindEvents() {
    if (this.search) this.search.addEventListener('input', () => this.filterRows());
    if (this.filter) this.filter.addEventListener('change', () => this.filterRows());
    if (this.body) this.body.addEventListener('click', (event) => { if (event.target.matches('.add-catalog-item-btn')) { const row = event.target.closest('tr'); const description = row.children[1].textContent; AppState.extraItems = AppState.extraItems || []; AppState.extraItems.push({ description, qty: 1, unitCost: Number(row.children[5].textContent.replace(/[^\d.-]/g, '')) }); Storage.save('extras-items', AppState.extraItems); showNotification(`${description} added to project extras.`, 'success'); } });
  },
  filterRows() { const query = this.search ? this.search.value.toLowerCase() : ''; const category = this.filter ? this.filter.value : 'All'; Array.from(this.body ? this.body.querySelectorAll('tr') : []).forEach((row) => { const text = row.textContent.toLowerCase(); const categoryMatches = category === 'All' || row.dataset.category === category; row.style.display = (!query || text.includes(query)) && categoryMatches ? '' : 'none'; }); },
  load() { this.filterRows(); },
  save() { return true; },
  validate() { return true; }
};
window.Tab16 = Tab16;
