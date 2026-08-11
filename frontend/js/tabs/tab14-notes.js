(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab14-notes'] = function render(container) {
    container.innerHTML = [
      '<h2>Notes</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Notes details"></textarea></div>'
    ].join('');
  };
})(window);
