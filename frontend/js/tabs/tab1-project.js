(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab1-project'] = function render(container) {
    container.innerHTML = [
      '<h2>Project Information</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Project Information details"></textarea></div>'
    ].join('');
  };
})(window);
