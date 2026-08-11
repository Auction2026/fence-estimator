(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab12-changeorder'] = function render(container) {
    container.innerHTML = [
      '<h2>Change Orders</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Change Orders details"></textarea></div>'
    ].join('');
  };
})(window);
