(function registerPrintingTool(global) {
  global.FrontendTools = global.FrontendTools || {};
  global.FrontendTools.printing = {
    printEstimate() {
      window.print();
    },
  };
})(window);
