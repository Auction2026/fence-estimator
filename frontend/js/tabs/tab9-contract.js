(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab9-contract'] = function render(container) {
    container.innerHTML = [
      '<h2>Contract</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Contract details"></textarea></div>'
    ].join('');
  };
})(window);
