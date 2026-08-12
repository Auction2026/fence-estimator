(function () {
  const tabId = 'tab13';

  function initTab13() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return;
    node.dataset.module = 'loaded';
  }

  function collectTab13Data() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return {};
    return { tab: tabId, textLength: node.textContent.trim().length };
  }

  window['tab13Module'] = {
    id: tabId,
    init: initTab13,
    collect: collectTab13Data,
  };
})();
