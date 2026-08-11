(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab5-drawings'] = function render(container) {
    container.innerHTML = [
      '<h2>Shop Drawings</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Shop Drawings details"></textarea></div>'
    ].join('');
  };
})(window);
