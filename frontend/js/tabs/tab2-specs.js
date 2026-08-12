(function () {
  const tabId = 'tab2';

  function initTab2() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return;
    node.dataset.module = 'loaded';
  }

  function collectTab2Data() {
    const node = document.getElementById('tab-' + tabId);
    if (!node) return {};
    return { tab: tabId, textLength: node.textContent.trim().length };
  }

  window['tab2Module'] = {
    id: tabId,
    init: initTab2,
    collect: collectTab2Data,
  };
})();
