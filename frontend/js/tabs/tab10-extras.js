(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab10-extras'] = function render(container) {
    container.innerHTML = [
      '<h2>Extras</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Extras details"></textarea></div>'
    ].join('');
  };
})(window);
