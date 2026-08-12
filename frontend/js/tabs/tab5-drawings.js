(function () {
  const tabId = 'tab5';

  function initTab5() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return;
    node.dataset.module = 'loaded';
  }

  function collectTab5Data() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return {};
    return { tab: tabId, textLength: node.textContent.trim().length };
  }

  window['tab5Module'] = {
    id: tabId,
    init: initTab5,
    collect: collectTab5Data,
  };
})();
