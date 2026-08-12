/**
 * TAB 16 - Product Catalog
 * frontend/js/tabs/tab16-catalog.js
 */

'use strict';

var Tab16Catalog = (function () {

  // Static catalog data (expands with API products)
  var CATALOG = [
    // Chain Link
    { sku: 'CL-2IN-11GA-4FT', name: '2" 11ga Chain Link - 4ft',      dept: 'Chain Link', price: 0.65, unit: 'LF' },
    { sku: 'CL-2IN-11GA-6FT', name: '2" 11ga Chain Link - 6ft',      dept: 'Chain Link', price: 0.82, unit: 'LF' },
    { sku: 'CL-POST-2IN-60',  name: '2" Line Post 60"',               dept: 'Chain Link', price: 14.50,unit: 'EA' },
    { sku: 'CL-POST-2IN-84',  name: '2" Line Post 84"',               dept: 'Chain Link', price: 18.75,unit: 'EA' },
    { sku: 'CL-RAIL-1-5-8',   name: '1-5/8" Top Rail 21ft',          dept: 'Chain Link', price: 22.00,unit: 'EA' },
    { sku: 'CL-TENSION-9GA',  name: '9ga Tension Wire 1320ft',        dept: 'Chain Link', price: 85.00,unit: 'RL' },
    { sku: 'CL-GATE-4X4',     name: '4x4 Single Chain Link Gate',     dept: 'Chain Link', price: 145.00,unit:'EA'},
    { sku: 'CL-GATE-6X4',     name: '6x4 Single Chain Link Gate',     dept: 'Chain Link', price: 195.00,unit:'EA'},
    // Wood
    { sku: 'WD-PINE-6X6-8',   name: 'Pine Privacy Board 6" x 6ft',   dept: 'Wood',       price: 2.25, unit: 'EA' },
    { sku: 'WD-POST-4X4-8',   name: '4x4 Cedar Post 8ft',            dept: 'Wood',       price: 18.50,unit: 'EA' },
    { sku: 'WD-RAIL-2X4-16',  name: '2x4 Rail 16ft',                 dept: 'Wood',       price: 12.00,unit: 'EA' },
    { sku: 'WD-STAIN-GAL',    name: 'Wood Stain / Sealer 1 Gal',     dept: 'Wood',       price: 42.00,unit: 'GL' },
    // Vinyl
    { sku: 'VN-PNVL-6FT-WHT', name: 'Vinyl Privacy Panel 6ft White', dept: 'Vinyl',      price: 38.00,unit: 'EA' },
    { sku: 'VN-POST-5X5-72',  name: '5x5 Vinyl Post 72"',            dept: 'Vinyl',      price: 45.00,unit: 'EA' },
    { sku: 'VN-CAP-5X5',      name: '5x5 Vinyl Post Cap',            dept: 'Vinyl',      price: 6.50, unit: 'EA' },
    // Aluminum
    { sku: 'AL-PANEL-4FT',    name: 'Aluminum Panel 4ft Black',      dept: 'Aluminum',   price: 68.00,unit: 'EA' },
    { sku: 'AL-POST-2X2-84',  name: '2x2 Aluminum Post 84"',         dept: 'Aluminum',   price: 32.00,unit: 'EA' },
    // Hardware
    { sku: 'HW-CONCRETE-60',  name: 'Quikrete Fast-Set 60lb',        dept: 'Hardware',   price: 8.50, unit: 'BG' },
    { sku: 'HW-FENCE-STAPLE', name: 'Fence Staples 1lb Box',         dept: 'Hardware',   price: 4.25, unit: 'BX' },
    { sku: 'HW-CARRIAGE-3_8', name: '3/8 Carriage Bolt Box (50)',    dept: 'Hardware',   price: 12.75,unit: 'BX' },
    { sku: 'HW-SCREWS-DECK',  name: 'Deck Screws 1lb (2.5")',        dept: 'Hardware',   price: 9.00, unit: 'LB' },
    // Gates
    { sku: 'GT-OPENER-SINGLE',name: 'Gate Opener Single Swing',      dept: 'Gates',      price: 795.00,unit:'EA'},
    { sku: 'GT-OPENER-SLIDE', name: 'Gate Opener Slide 1200lb',      dept: 'Gates',      price: 1250.00,unit:'EA'},
  ];

  var currentFilter = '';
  var currentDept   = 'All';

  function init() {
    renderDeptFilter();
    renderCatalog();
    bindEvents();
  }

  function renderDeptFilter() {
    var depts = ['All', ...new Set(CATALOG.map(function (p) { return p.dept; }))];
    var container = document.getElementById('catalog-dept-filter');
    if (!container) return;
    container.innerHTML = depts.map(function (d) {
      return '<button class="btn btn-sm ' + (d === 'All' ? 'btn-primary' : 'btn-outline') + '" onclick="Tab16Catalog.filterByDept(\'' + d + '\')">' + d + '</button>';
    }).join(' ');
  }

  function renderCatalog(products) {
    products = products || getFilteredProducts();
    var container = document.getElementById('catalog-grid');
    if (!container) return;

    if (products.length === 0) {
      container.innerHTML = '<p class="text-muted text-center" style="padding:32px;grid-column:1/-1">No products found.</p>';
      return;
    }

    container.innerHTML = products.map(function (p) {
      return '<div class="catalog-card">' +
        '<div class="catalog-sku">' + UI.escapeHtml(p.sku) + '</div>' +
        '<div class="catalog-name">' + UI.escapeHtml(p.name) + '</div>' +
        '<div class="catalog-price">' + formatCurrency(p.price) + '<span class="catalog-unit"> / ' + UI.escapeHtml(p.unit) + '</span></div>' +
        '<div class="text-muted" style="font-size:12px;margin:6px 0">' + UI.escapeHtml(p.dept) + '</div>' +
        '<button class="btn btn-sm btn-primary btn-full" onclick="Tab16Catalog.addToEstimate(\'' + p.sku + '\')">+ Add to Estimate</button>' +
        '</div>';
    }).join('');
  }

  function getFilteredProducts() {
    return CATALOG.filter(function (p) {
      var matchDept   = currentDept === 'All' || p.dept === currentDept;
      var matchSearch = !currentFilter || (p.name + p.sku + p.dept).toLowerCase().includes(currentFilter.toLowerCase());
      return matchDept && matchSearch;
    });
  }

  function filterByDept(dept) {
    currentDept = dept;
    document.querySelectorAll('#catalog-dept-filter .btn').forEach(function (btn) {
      btn.className = btn.className.replace('btn-primary', 'btn-outline');
      if (btn.textContent.trim() === dept) btn.className = btn.className.replace('btn-outline', 'btn-primary');
    });
    renderCatalog();
  }

  function search(query) {
    currentFilter = query;
    renderCatalog();
  }

  function addToEstimate(sku) {
    var product = CATALOG.find(function (p) { return p.sku === sku; });
    if (!product) return;
    if (!FenceApp.project.extras) FenceApp.project.extras = [];
    FenceApp.project.extras.push({ name: product.name, qty: 1, unit: product.unit, rate: product.price });
    Storage.saveProject(FenceApp.project);
    UI.showToast(product.name + ' added to extras ✓', 'success');
  }

  function bindEvents() {
    var searchInput = document.getElementById('catalog-search');
    if (searchInput) searchInput.addEventListener('input', function () { search(searchInput.value); });

    // Try loading more from API if online
    if (FenceApp.isLoggedIn) {
      API.getProducts().then(function (data) {
        if (data && data.products) {
          data.products.forEach(function (p) {
            if (!CATALOG.find(function (c) { return c.sku === p.sku; })) {
              CATALOG.push(p);
            }
          });
          renderCatalog();
        }
      }).catch(function () {});
    }
  }

  return { init, filterByDept, search, addToEstimate };

})();

window.Tab16Catalog = Tab16Catalog;
