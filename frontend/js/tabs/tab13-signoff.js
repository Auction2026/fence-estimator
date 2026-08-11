(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab13-signoff'] = function render(container) {
    container.innerHTML = [
      '<h2>Sign-Off</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Sign-Off details"></textarea></div>'
    ].join('');
  };
})(window);
