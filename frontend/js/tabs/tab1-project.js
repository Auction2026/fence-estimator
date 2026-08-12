(function () {
  const tabId = 'tab1';

  function initTab1() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return;
    node.dataset.module = 'loaded';
  }

  function collectTab1Data() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return {};
    return { tab: tabId, textLength: node.textContent.trim().length };
  }

  window['tab1Module'] = {
    id: tabId,
    init: initTab1,
    collect: collectTab1Data,
  };
})();
