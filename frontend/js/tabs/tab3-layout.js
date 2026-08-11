/**
 * tab3-layout.js – Layout Diagram tab (delegates to Drawing tool)
 */
const Tab3Layout = (() => {
  function init() {
    // Canvas drawing tool initialized by tools/drawing.js
    // Listen for tab activation to resize canvas if needed
    document.addEventListener('tabActivated', (e) => {
      if (e.detail.tabId === 'tab3') {
        if (window.DrawingTool && typeof DrawingTool.resize === 'function') {
          DrawingTool.resize();
        }
      }
    });
  }
  return { init };
})();
