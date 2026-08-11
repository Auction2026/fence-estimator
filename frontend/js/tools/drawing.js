(function registerDrawingTool(global) {
  global.FrontendTools = global.FrontendTools || {};
  global.FrontendTools.drawing = {
    start(container) {
      container.innerHTML += '<p>Drawing tool ready.</p>';
    },
  };
})(window);
