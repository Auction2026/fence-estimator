window.FEMapping = {
  init(elementId) {
    const node = document.getElementById(elementId);
    if (node) node.textContent = 'Map placeholder - configure Google Maps API key in deployment.';
  }
};
