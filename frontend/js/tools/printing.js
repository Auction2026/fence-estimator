(function () {
  const PrintingTool = {
    printSelectedTab(tabId) {
      document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('print-target'));
      const panel = document.getElementById(tabId);
      if (panel) {
        panel.classList.add('print-target');
      }
      window.print();
      window.setTimeout(() => panel?.classList.remove('print-target'), 1000);
    },

    printAll() {
      const panels = document.querySelectorAll('.tab-panel');
      panels.forEach((panel) => panel.classList.add('print-target'));
      window.print();
      window.setTimeout(() => panels.forEach((panel) => panel.classList.remove('print-target')), 1000);
    }
  };

  window.FenceEstimatorTools = window.FenceEstimatorTools || {};
  window.FenceEstimatorTools.printing = PrintingTool;
})();
