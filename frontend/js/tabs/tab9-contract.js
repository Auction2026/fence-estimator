(function () {
  const tabId = 'tab9';

  function initTab9() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return;
    node.dataset.module = 'loaded';
  }

  function collectTab9Data() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return {};
    return { tab: tabId, textLength: node.textContent.trim().length };
  }

  window['tab9Module'] = {
    id: tabId,
    init: initTab9,
    collect: collectTab9Data,
  };
})();
