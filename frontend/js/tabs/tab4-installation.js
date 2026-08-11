(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab4-installation'] = function render(container) {
    container.innerHTML = [
      '<h2>Installation Breakdown</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Installation Breakdown details"></textarea></div>'
    ].join('');
  };
})(window);
