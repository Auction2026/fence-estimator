(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab16-catalog'] = function render(container) {
    container.innerHTML = [
      '<h2>Product Catalog</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Product Catalog details"></textarea></div>'
    ].join('');
  };
})(window);
