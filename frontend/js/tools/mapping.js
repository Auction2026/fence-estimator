(function registerMappingTool(global) {
  global.FrontendTools = global.FrontendTools || {};
  global.FrontendTools.mapping = {
    setCoordinates(lat, lng) {
      return { lat: Number(lat), lng: Number(lng) };
    },
  };
})(window);
