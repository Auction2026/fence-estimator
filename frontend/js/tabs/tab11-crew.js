(function registerTab(global) {
  global.FrontendTabs = global.FrontendTabs || {};
  global.FrontendTabs['tab11-crew'] = function render(container) {
    container.innerHTML = [
      '<h2>Crew Breakdown</h2>',
      '<div class="field"><label>Notes</label><textarea rows="4" placeholder="Enter Crew Breakdown details"></textarea></div>'
    ].join('');
  };
})(window);
