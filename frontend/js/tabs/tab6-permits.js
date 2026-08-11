(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab6-permits'] = function render(container) {
    container.innerHTML = [
      '<h2>Permits</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Permits details"></textarea></div>'
    ].join('');
  };
})(window);
