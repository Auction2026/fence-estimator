
const MappingTool = (() => {
  function init() {
    const map = document.getElementById('map-container');
    if (!map) return;
    map.replaceChildren();
    const message = document.createElement('p');
    message.style.padding = '1rem';
    message.textContent = 'Map integration ready. Configure Google Maps key to enable live tiles.';
    map.appendChild(message);
  }
  function setMarker(lat, lng, label = 'Project') {
    const map = document.getElementById('map-container');
    if (!map) return;
    const marker = document.createElement('div');
    marker.textContent = `${label}: ${lat}, ${lng}`;
    marker.style.padding = '0.5rem 1rem';
    map.appendChild(marker);
  }
  document.addEventListener('DOMContentLoaded', init);
  return { init, setMarker };
})();
