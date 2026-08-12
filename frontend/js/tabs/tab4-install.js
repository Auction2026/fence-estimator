(function () {
  const tabId = 'tab4';

  function initTab4() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return;
    node.dataset.module = 'loaded';
  }

  function collectTab4Data() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return {};
    return { tab: tabId, textLength: node.textContent.trim().length };
  }

  window['tab4Module'] = {
    id: tabId,
    init: initTab4,
    collect: collectTab4Data,
  };
})();
