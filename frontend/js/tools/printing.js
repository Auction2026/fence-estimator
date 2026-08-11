
const PrintingTool = (() => {
  function printCurrentView() { window.print(); }
  function printEstimateSection() {
    const section = document.getElementById('tab8');
    if (!section) return;
    const w = window.open('', '_blank');
    if (!w) return;
    const doc = w.document;
    const container = doc.createElement('pre');
    container.textContent = section.innerText || '';
    container.style.whiteSpace = 'pre-wrap';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.padding = '16px';
    doc.body.appendChild(container);
    w.onafterprint = () => w.close();
    w.focus();
    setTimeout(() => w.print(), 100);
  }
  return { printCurrentView, printEstimateSection };
})();
