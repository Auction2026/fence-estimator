(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab8-estimate'] = function render(container) {
    container.innerHTML = [
      '<h2>Estimate</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Estimate details"></textarea></div>'
    ].join('');
  };
})(window);
