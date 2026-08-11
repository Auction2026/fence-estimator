// Mapping tab
'use strict';

const Tab17 = {
  init() { this.bindEvents(); this.load(); },
  bindEvents() { const button = document.getElementById('mappingUpdateBtn'); if (button) button.addEventListener('click', () => this.updateFromManualCoordinates()); },
  updateFromManualCoordinates() { const lat = App.safeNumber(document.getElementById('mappingManualLat').value, 35.7796); const lng = App.safeNumber(document.getElementById('mappingManualLng').value, -78.6382); AppState.mapping.coordinates = { lat, lng }; if (window.MapTool) { MapTool.setAddress(document.getElementById('mappingAddress').value || ''); MapTool.addMarker(lat, lng, 'Project'); } this.renderMetrics(); this.save(); },
  renderMetrics() { const coords = document.getElementById('mappingCoordinates'); if (coords) coords.textContent = `${AppState.mapping.coordinates.lat.toFixed(4)}, ${AppState.mapping.coordinates.lng.toFixed(4)}`; if (window.MapTool) { const points = AppState.mapping.points.length ? AppState.mapping.points : [AppState.mapping.coordinates, { lat: AppState.mapping.coordinates.lat + 0.0005, lng: AppState.mapping.coordinates.lng + 0.0007 }, { lat: AppState.mapping.coordinates.lat + 0.0008, lng: AppState.mapping.coordinates.lng - 0.0002 }]; AppState.mapping.points = points; const distance = MapTool.calculateDistance(points); const area = MapTool.calculateArea(points); const distanceNode = document.getElementById('mappingDistance'); const areaNode = document.getElementById('mappingArea'); if (distanceNode) distanceNode.textContent = `${distance.toFixed(2)} ft`; if (areaNode) areaNode.textContent = `${area.toFixed(2)} sq ft`; } },
  load() { AppState.mapping = Storage.load('mapping-data') || AppState.mapping; if (window.MapTool) MapTool.init('mapPlaceholder'); this.renderMetrics(); },
  save() { Storage.save('mapping-data', AppState.mapping); return true; },
  validate() { return true; }
};
window.Tab17 = Tab17;
