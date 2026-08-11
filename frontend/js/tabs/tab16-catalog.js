/**
 * tab16-catalog.js – Product Catalog tab (950+ products)
 */
const Tab16Catalog = (() => {
  let products = [];
  let filtered = [];
  let page = 1;
  const PAGE_SIZE = 25;

  // Built-in sample products for offline mode
  const SAMPLE_PRODUCTS = generateSampleProducts();

  function generateSampleProducts() {
    const items = [];
    const types = [
      { cat:'chain-link', prefix:'CL', heights:[4,5,6,8,10], price:45 },
      { cat:'wood', prefix:'WD', heights:[4,5,6,8], price:65 },
      { cat:'vinyl', prefix:'VN', heights:[4,5,6], price:85 },
      { cat:'posts', prefix:'PT', heights:[6,7,8,10,12], price:22 },
      { cat:'gates', prefix:'GT', heights:[4,5,6], price:185 },
      { cat:'hardware', prefix:'HW', heights:[1], price:3.50 },
      { cat:'concrete', prefix:'CO', heights:[1], price:8.50 },
    ];
    const suppliers = ['Supplier A','Supplier B','Supplier C'];
    let id = 1;
    types.forEach(t => {
      t.heights.forEach(h => {
        for (let i = 0; i < 20; i++) {
          const sku = `${t.prefix}-${h}-${String(id).padStart(3,'0')}`;
          const unitCost = t.price + (i * 2.5) + (h * 1.5);
          items.push({
            sku, category: t.cat,
            name: `${t.cat.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())} ${h}ft Model ${i+1}`,
            type: 'Material', unit_cost: unitCost.toFixed(2),
            retail_price: (unitCost * 1.65).toFixed(2),
            supplier: suppliers[id % 3], quantity: 100 + (id * 3)
          });
          id++;
        }
      });
    });
    return items;
  }

  function init() {
    products = SAMPLE_PRODUCTS;
    filtered = products;
    render();

    document.getElementById('btn-search-catalog')?.addEventListener('click', search);
    document.getElementById('catalog-search')?.addEventListener('keyup', (e) => { if (e.key==='Enter') search(); });
    document.getElementById('catalog-category-filter')?.addEventListener('change', search);

    // Try to load from backend
    API.Products.getAll({ limit: 1000 }).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        products = data;
        filtered = products;
        render();
      }
    }).catch(() => {});
  }

  function search() {
    const q = (UI.getValue('catalog-search') || '').toLowerCase();
    const cat = UI.getValue('catalog-category-filter') || 'all';
    filtered = products.filter(p => {
      const matchCat = cat === 'all' || p.category === cat;
      const matchQ = !q || p.name.toLowerCase().includes(q) || (p.sku||'').toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    page = 1;
    render();
  }

  function render() {
    const start = (page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);
    const tbody = document.getElementById('catalog-tbody');
    if (!tbody) return;

    UI.setText('catalog-result-count', `Showing ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`);

    if (filtered.length === 0) { UI.setTableEmpty('catalog-tbody', 'No products match your search.', 8); renderPagination(); return; }
    tbody.innerHTML = '';
    pageItems.forEach(p => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-primary';
      btn.textContent = '+ Add';
      btn.addEventListener('click', () => Tab16Catalog.addToEstimate(p.sku));
      const btnCell = { html: '' };
      UI.appendRow('catalog-tbody', [
        p.sku, p.name, p.category, p.type || 'Material',
        Calculations.formatCurrency(p.unit_cost),
        Calculations.formatCurrency(p.retail_price),
        p.supplier || '--',
        btnCell
      ]);
      // Attach button to last row's last cell
      const lastRow = document.getElementById('catalog-tbody').lastElementChild;
      if (lastRow) lastRow.lastElementChild.appendChild(btn);
    });
    renderPagination();
  }

  function renderPagination() {
    const container = document.getElementById('catalog-pagination');
    if (!container) return;
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    if (totalPages <= 1) { container.innerHTML = ''; return; }
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i===page?'active':''}" onclick="Tab16Catalog.goPage(${i})">${i}</button>`;
    }
    container.innerHTML = html;
  }

  function goPage(p) { page = p; render(); }

  function addToEstimate(sku) {
    const product = products.find(p => p.sku === sku);
    if (!product) return;
    const extras = Storage.loadExtras();
    extras.push({ desc: product.name, qty: 1, unit: 'ea', unitPrice: parseFloat(product.retail_price) });
    Storage.saveExtras(extras);
    UI.showNotification(`${product.name} added to Extras (Tab 10)`, 'success');
  }

  return { init, goPage, addToEstimate };
})();
