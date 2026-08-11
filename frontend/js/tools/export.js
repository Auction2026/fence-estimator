(function registerExportTool(global) {
  global.FrontendTools = global.FrontendTools || {};
  global.FrontendTools.export = {
    asJson(data) {
      return JSON.stringify(data, null, 2);
    },
  };
})(window);
