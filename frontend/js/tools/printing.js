
window.FencePrinting = (() => {
  function printCurrentTab(tabId) {
    printElement(`tab-${tabId}`);
  }

  function printElement(elementId) {
    const node = document.getElementById(elementId);
    if (!node) {
      return;
    }
    const stylesheetUrl = new URL('css/styles.css', window.location.href).href;
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (!printWindow) {
      return;
    }
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Print Preview</title><link rel="stylesheet" href="${stylesheetUrl}"></head><body>${node.outerHTML}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }

  return {
    printCurrentTab,
    printElement
  };
})();
