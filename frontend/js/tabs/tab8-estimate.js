(function () {
  const tabId = 'tab8';

  function initTab8() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return;
    node.dataset.module = 'loaded';
  }

  function collectTab8Data() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return {};
    return { tab: tabId, textLength: node.textContent.trim().length };
  }

  window['tab8Module'] = {
    id: tabId,
    init: initTab8,
    collect: collectTab8Data,
  };
})();
