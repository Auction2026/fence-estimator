(function attachUI(global) {
  const FE = global.FenceEstimator;
  const { byId, formatCurrency } = FE.utils;

  FE.UI = {
    switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach((button) => {
        button.classList.toggle('active', button.dataset.tab === tabId);
      });
      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.toggle('active', panel.id === tabId);
      });
      FE.state.currentTab = tabId;
      FE.persist('Switched tabs');
    },
    message(text) {
      byId('saveStatus').textContent = text;
    },
    renderProjectSnapshot() {
      const project = FE.state.project;
      byId('projectSnapshot').innerHTML = [
        ['Customer', project.customerName || '—'],
        ['Phone', project.customerPhone || '—'],
        ['Email', project.customerEmail || '—'],
        ['Address', project.address || '—'],
        ['Status', project.status || 'draft'],
      ].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('');
    },
    renderEstimateSnapshot() {
      const estimate = FE.state.estimate;
      const rows = [
        ['Materials', estimate.materials],
        ['Labor', estimate.labor],
        ['Equipment', estimate.equipment],
        ['Permits', estimate.permits],
        ['Extras', estimate.extras],
        ['Subtotal', estimate.subtotal],
        ['Tax', estimate.tax],
        ['Total', estimate.total, 'total'],
      ];
      const html = rows.map(([label, value, extraClass]) => `<div class="total-row ${extraClass || ''}"><span>${label}</span><strong>${formatCurrency(value)}</strong></div>`).join('');
      byId('estimateSnapshot').innerHTML = html;
      byId('estimateBreakdown').innerHTML = html;
      byId('scopeSummary').innerHTML = (estimate.scopeSummary || []).map((item) => `<li>${item}</li>`).join('');
    },
    renderStatus() {
      const state = FE.state;
      const statuses = [
        `Project saved: ${state.project.customerName ? 'yes' : 'no'}`,
        `Specs saved: ${state.specs.linearFeet > 0 ? 'yes' : 'no'}`,
        `Extras: ${state.extras.length}`,
        `Crew assigned: ${state.crew.length}`,
        `Change orders: ${state.changeOrders.length}`,
        `Notes: ${state.notes.length}`,
      ];
      byId('statusList').innerHTML = statuses.map((item) => `<li>${item}</li>`).join('');
    },
    renderTable(targetId, columns, rows) {
      const target = byId(targetId);
      if (!rows.length) {
        target.innerHTML = '<p class="muted">No records yet.</p>';
        return;
      }
      target.innerHTML = `<table><thead><tr>${columns.map((column) => `<th>${column.label}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${columns.map((column) => `<td>${row[column.key] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    },
    renderCards(targetId, entries, type) {
      const target = byId(targetId);
      if (!entries.length) {
        target.innerHTML = '<p class="muted">No items yet.</p>';
        return;
      }
      target.innerHTML = entries.map((entry) => {
        const title = entry.title || entry.description || entry.name || entry.fileName;
        const body = entry.content || entry.reason || entry.category || '';
        return `<article class="${type}-card"><div class="inline-actions"><strong>${title}</strong><button type="button" class="secondary" data-remove-type="${type}" data-remove-id="${entry.id}">Remove</button></div><p>${body}</p></article>`;
      }).join('');
    },
    renderAdmin() {
      const estimate = FE.state.estimate;
      const metrics = [
        { label: 'Total estimate', value: formatCurrency(estimate.total) },
        { label: 'Materials share', value: formatCurrency(estimate.materials) },
        { label: 'Crew count', value: String(FE.state.crew.length) },
        { label: 'Notes logged', value: String(FE.state.notes.length) },
      ];
      byId('adminMetrics').innerHTML = metrics.map((metric) => `<article class="metric-card"><p class="muted">${metric.label}</p><strong>${metric.value}</strong></article>`).join('');
      byId('auditLog').innerHTML = `<h3>Audit</h3><p class="muted">Last saved at ${FE.state.audit.lastSavedAt || 'not yet saved'}.</p>`;
    },
    renderCatalog(rows) {
      this.renderTable('catalogTable', [
        { label: 'SKU', key: 'sku' },
        { label: 'Name', key: 'name' },
        { label: 'Category', key: 'category' },
        { label: 'Unit price', key: 'formattedPrice' },
      ], rows.map((row) => Object.assign({}, row, { formattedPrice: formatCurrency(row.unitPrice) })));
      byId('catalogCount').textContent = `${rows.length} product(s)`;
    },
    renderMapping() {
      const map = FE.state.mapping;
      byId('mappingSummary').innerHTML = `
        <h3>Site summary</h3>
        <p><strong>Address:</strong> ${map.address || FE.state.project.address || 'Pending address'}</p>
        <p><strong>Coordinates:</strong> ${map.lat || '—'}, ${map.lng || '—'}</p>
        <p><strong>Lot:</strong> ${map.width || 0} × ${map.depth || 0} ft</p>
        <p><strong>Perimeter capacity:</strong> ${(Number(map.width || 0) * 2) + (Number(map.depth || 0) * 2)} lf</p>`;
    },
    renderContract() {
      byId('contractPreview').textContent = FE.Calculations.createContractPreview(FE.state);
    },
    renderAll() {
      this.renderProjectSnapshot();
      this.renderEstimateSnapshot();
      this.renderStatus();
      this.renderAdmin();
      this.renderContract();
      this.renderMapping();
      this.renderCards('drawingList', FE.state.drawings.files, 'drawing');
      this.renderCards('changeOrderList', FE.state.changeOrders, 'change');
      this.renderCards('notesList', FE.state.notes, 'note');
      this.renderTable('extrasTable', [
        { label: 'Description', key: 'description' },
        { label: 'Category', key: 'category' },
        { label: 'Cost', key: 'formattedCost' },
        { label: 'Action', key: 'action' },
      ], FE.state.extras.map((item) => Object.assign({}, item, {
        formattedCost: formatCurrency(item.cost),
        action: `<button type="button" class="secondary" data-remove-type="extra" data-remove-id="${item.id}">Remove</button>`,
      })));
      this.renderTable('crewTable', [
        { label: 'Name', key: 'name' },
        { label: 'Role', key: 'role' },
        { label: 'Rate', key: 'formattedRate' },
        { label: 'Action', key: 'action' },
      ], FE.state.crew.map((item) => Object.assign({}, item, {
        formattedRate: formatCurrency(item.rate),
        action: `<button type="button" class="secondary" data-remove-type="crew" data-remove-id="${item.id}">Remove</button>`,
      })));
      this.renderCatalog(FE.catalogFilter(FE.state.catalogQuery || ''));
      document.querySelector(`[data-tab="${FE.state.currentTab}"]`)?.classList.add('active');
      document.getElementById(FE.state.currentTab)?.classList.add('active');
    },
  };
})(window);
