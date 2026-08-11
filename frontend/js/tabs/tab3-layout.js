(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab3-layout'] = function render(container) {
    container.innerHTML = [
      '<h2>Layout Diagram</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Layout Diagram details"></textarea></div>'
    ].join('');
  };
})(window);
