
const PrintingTool = (() => {
  function printCurrentView() { window.print(); }
  function printEstimateSection() {
    const section = document.getElementById('tab8');
    if (!section) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><body>${section.outerHTML}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }
  return { printCurrentView, printEstimateSection };
})();
