(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab17-mapping'] = function render(container) {
    container.innerHTML = [
      '<h2>Mapping</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Mapping details"></textarea></div>'
    ].join('');
  };
})(window);
