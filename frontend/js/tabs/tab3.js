(function () {
  const tabId = 'tab3';

  function initTab3() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return;
    node.dataset.module = 'loaded';
  }

  function collectTab3Data() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return {};
    return { tab: tabId, textLength: node.textContent.trim().length };
  }

  window['tab3Module'] = {
    id: tabId,
    init: initTab3,
    collect: collectTab3Data,
  };
})();
