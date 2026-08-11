(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab15-admin'] = function render(container) {
    container.innerHTML = [
      '<h2>Admin Dashboard</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Admin Dashboard details"></textarea></div>'
    ].join('');
  };
})(window);
