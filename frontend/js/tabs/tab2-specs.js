(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab2-specs'] = function render(container) {
    container.innerHTML = [
      '<h2>Fence Specifications</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Fence Specifications details"></textarea></div>'
    ].join('');
  };
})(window);
