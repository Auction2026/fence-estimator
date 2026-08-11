(function () {
  const catalog = [
    { sku: 'CL-MESH-006', name: '6ft Chain Link Mesh', category: 'chain-link', unit: 'lf', price: 8.95 },
    { sku: 'CL-POST-2-3/8', name: '2 3/8 Terminal Post', category: 'chain-link', unit: 'ea', price: 58.00 },
    { sku: 'CL-GATE-004', name: '4ft Walk Gate Kit', category: 'chain-link', unit: 'ea', price: 248.00 },
    { sku: 'WD-PICKET-CEDAR', name: 'Cedar Picket', category: 'wood', unit: 'ea', price: 6.5 },
    { sku: 'VN-PANEL-006', name: '6ft Vinyl Privacy Panel', category: 'vinyl', unit: 'ea', price: 146.0 },
    { sku: 'ORN-PANEL-006', name: '6ft Ornamental Panel', category: 'ornamental', unit: 'ea', price: 172.0 }
  ];
  window.FenceEstimatorCatalog = catalog;

  const MODULE = {
    app: null,
    rows: catalog,

    async init(app) {
      this.app = app;
      this.search = document.getElementById('catalogSearch');
      this.filter = document.getElementById('catalogFilter');
      this.search?.addEventListener('input', () => this.render());
      this.filter?.addEventListener('change', () => this.render());
      const products = await Api.getProducts();
      this.rows = products.length ? products : catalog;
      this.render();
    },

    getFilteredRows() {
      const query = (this.search?.value || '').toLowerCase();
      const category = this.filter?.value || 'all';
      return this.rows.filter((item) => {
        const matchesQuery = !query || `${item.sku} ${item.name}`.toLowerCase().includes(query);
        const matchesCategory = category === 'all' || item.category === category;
        return matchesQuery && matchesCategory;
      });
    },

    render() {
      const body = document.querySelector('#catalog-table tbody');
      body.innerHTML = '';
      const rows = this.getFilteredRows();
      if (!rows.length) {
        body.innerHTML = '<tr><td colspan="6">No catalog products match the current search.</td></tr>';
        return;
      }
      rows.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.sku}</td>
          <td>${item.name}</td>
          <td>${item.category}</td>
          <td>${item.unit}</td>
          <td>${Calculations.formatCurrency(item.price)}</td>
          <td><button class="btn btn-primary" type="button">Add to Estimate</button></td>`;
        row.querySelector('button').addEventListener('click', () => this.addToEstimate(item));
        body.appendChild(row);
      });
    },

    addToEstimate(item) {
      window.FenceEstimatorTabs.extras?.addItem({
        extraName: item.name,
        extraQty: 1,
        extraCost: item.price
      });
      UI.showNotification(`${item.name} added to estimate extras.`, 'success');
    }
  };

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.catalog = MODULE;
})();
