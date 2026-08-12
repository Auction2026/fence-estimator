(function () {
  const tabId = 'tab6';

  function initTab6() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return;
    node.dataset.module = 'loaded';
  }

  function collectTab6Data() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return {};
    return { tab: tabId, textLength: node.textContent.trim().length };
  }

  window['tab6Module'] = {
    id: tabId,
    init: initTab6,
    collect: collectTab6Data,
  };
})();
