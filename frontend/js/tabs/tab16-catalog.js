// Catalog tab
'use strict';

const Tab16 = {
  products: [],
  init() {
    this.searchInput = document.getElementById('catalogSearch');
    this.categorySelect = document.getElementById('catalogCategoryFilter');
    this.body = document.getElementById('catalogTableBody');
    this.bindEvents();
    this.load();
  },
  bindEvents() {
    if (this.searchInput) this.searchInput.addEventListener('input', (event) => this.searchProducts(event.target.value));
    if (this.categorySelect) this.categorySelect.addEventListener('change', (event) => this.filterByCategory(event.target.value));
    if (!this.body) return;
    this.body.addEventListener('click', (event) => {
      const button = event.target.closest('[data-add-sku]');
      if (button) this.addToProject(button.dataset.addSku);
    });
  },
  getSourceProducts() {
    return this.products.length ? this.products : (AppState.catalog || App.defaultCatalog || []);
  },
  normalizedProducts() {
    return this.getSourceProducts().map((product) => Object.assign({ sku: '', name: '', category: 'Uncategorized', unit: 'EA', cost: 0, price: 0 }, product));
  },
  currentFilters() {
    return {
      text: this.searchInput ? this.searchInput.value : '',
      category: this.categorySelect ? this.categorySelect.value : 'All'
    };
  },
  populateCategories() {
    if (!this.categorySelect) return;
    const currentValue = this.categorySelect.value || 'All';
    const categories = ['All'].concat(Array.from(new Set(this.normalizedProducts().map((product) => product.category))).filter(Boolean));
    this.categorySelect.innerHTML = categories.map((category) => `<option value="${category}">${category}</option>`).join('');
    this.categorySelect.value = categories.includes(currentValue) ? currentValue : 'All';
  },
  categoryCounts() {
    return this.normalizedProducts().reduce((counts, product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
      return counts;
    }, {});
  },
  filteredProducts(text, category) {
    return this.normalizedProducts().filter((product) => this.productMatches(product, text, category));
  },
  productMatches(product, text, category) {
    const haystack = `${product.name || ''} ${product.sku || ''}`.toLowerCase();
    const matchesText = haystack.includes(String(text || '').toLowerCase());
    const matchesCategory = category === 'All' || product.category === category;
    return matchesText && matchesCategory;
  },
  searchProducts(query) {
    const text = String(query || '').toLowerCase();
    const category = this.currentFilters().category;
    const filtered = this.filteredProducts(text, category);
    this.renderProductTable(filtered);
  },
  filterByCategory(category) {
    const text = this.currentFilters().text;
    const filtered = this.filteredProducts(text, category);
    this.renderProductTable(filtered);
  },
  currency(value) {
    return Calculator.formatCurrency(value);
  },
  setTableCaption(products) {
    const table = document.getElementById('catalogTable');
    if (!table) return;
    const counts = this.categoryCounts();
    table.dataset.catalogSummary = `${(products || []).length} shown / ${Object.keys(counts).length} categories`;
  },
  renderProductTable(products) {
    if (!this.body) return;
    this.body.innerHTML = (products || []).map((product) => `
      <tr>
        <td>${product.sku}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${product.unit}</td>
        <td>${this.currency(product.cost)}</td>
        <td>${this.currency(product.price)}</td>
        <td><button type="button" class="btn btn-success btn-sm" data-add-sku="${product.sku}">Add to Project</button></td>
      </tr>`).join('');
    if (!(products || []).length) this.body.innerHTML = '<tr><td colspan="7">No products match the current filters.</td></tr>';
    this.setTableCaption(products || []);
  },
  addToProject(sku) {
    const product = this.normalizedProducts().find((item) => item.sku === sku);
    if (!product) return false;
    AppState.extraItems = Array.isArray(AppState.extraItems) ? AppState.extraItems : [];
    AppState.extraItems.push({ description: product.name, quantity: 1, unitCost: product.price, sku: product.sku });
    Storage.save('extra-items', AppState.extraItems);
    if (window.Tab10) Tab10.load();
    const button = document.getElementById('tabBtn10');
    if (button) button.click();
    UI.showNotification(`${product.name} added to project extras.`, 'success');
    return true;
  },
  async load() {
    try {
      const products = await Api.getProducts();
      this.products = Array.isArray(products) ? products : [];
    } catch (_error) {
      this.products = AppState.catalog || App.defaultCatalog || [];
    }
    this.populateCategories();
    this.renderProductTable(this.normalizedProducts());
    return this.products;
  },
  reloadFilters() {
    const filters = this.currentFilters();
    if (filters.text) this.searchProducts(filters.text);
    else this.filterByCategory(filters.category);
  },
  refresh() {
    return this.load();
  },
  save() {
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab16 = Tab16;
