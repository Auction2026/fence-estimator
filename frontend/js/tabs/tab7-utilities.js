(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab7-utilities'] = function render(container) {
    container.innerHTML = [
      '<h2>Utilities</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Utilities details"></textarea></div>'
    ].join('');
  };
})(window);
