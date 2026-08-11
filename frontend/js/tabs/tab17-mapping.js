// Mapping tab
'use strict';

const Tab17 = {
  init() {
    this.ensureWorkspace();
    this.cache();
    if (window.MapTool && this.mapContainer) MapTool.init(this.mapContainer.id);
    this.bindEvents();
    this.load();
  },
  ensureWorkspace() {
    const existing = document.getElementById('mapContainer') || document.getElementById('mapPlaceholder');
    if (existing) existing.id = 'mapContainer';
    const addressField = document.getElementById('mappingAddress');
    if (addressField && !document.getElementById('mappingLocateBtn')) {
      const controls = document.createElement('div');
      controls.className = 'actions-inline mt-2';
      controls.innerHTML = '<button type="button" id="mappingLocateBtn" class="btn btn-primary">Locate</button><button type="button" id="mappingAddPointBtn" class="btn btn-secondary">Add Fence Point</button><button type="button" id="mappingExportBtn" class="btn btn-success">Export Map</button>';
      addressField.parentElement.appendChild(controls);
    }
    const sideCard = document.querySelector('#tab-17 .col.col-5 .card-body');
    if (sideCard && !document.getElementById('mappingPointsList')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'mt-3';
      wrapper.innerHTML = '<div class="card nested-card"><div class="card-header">Fence Route Points</div><div class="card-body" id="mappingPointsList"></div></div>';
      sideCard.appendChild(wrapper);
    }
  },
  cache() {
    this.addressInput = document.getElementById('addressInput') || document.getElementById('mappingAddress');
    this.mapContainer = document.getElementById('mapContainer');
    this.latInput = document.getElementById('mappingManualLat');
    this.lngInput = document.getElementById('mappingManualLng');
    this.coordsNode = document.getElementById('mappingCoordinates');
    this.distanceNode = document.getElementById('mappingDistance');
    this.areaNode = document.getElementById('mappingArea');
    this.pointsNode = document.getElementById('mappingPointsList');
  },
  bindEvents() {
    const locateButton = document.getElementById('mappingLocateBtn');
    const addPointButton = document.getElementById('mappingAddPointBtn');
    const exportButton = document.getElementById('mappingExportBtn');
    const updateButton = document.getElementById('mappingUpdateBtn');
    if (locateButton) locateButton.addEventListener('click', () => this.onLocate());
    if (addPointButton) addPointButton.addEventListener('click', () => this.addFencePoint());
    if (exportButton) exportButton.addEventListener('click', () => this.exportMap());
    if (updateButton) updateButton.addEventListener('click', () => this.updateFromManualCoordinates());
  },
  pseudoCoordinates(address) {
    const seed = String(address || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const lat = 35.70 + ((seed % 700) / 10000);
    const lng = -78.70 + (((seed * 3) % 700) / 10000);
    return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
  },
  setCoordinates(coords) {
    AppState.mapping = AppState.mapping || { points: [] };
    AppState.mapping.coordinates = coords;
    if (this.latInput) this.latInput.value = coords.lat;
    if (this.lngInput) this.lngInput.value = coords.lng;
    if (this.coordsNode) this.coordsNode.textContent = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
  },
  onLocate() {
    const address = this.addressInput ? this.addressInput.value.trim() : '';
    if (window.MapTool) MapTool.setAddress(address);
    AppState.mapping = AppState.mapping || { points: [] };
    AppState.mapping.address = address;
    const coords = this.pseudoCoordinates(address || `${this.latInput.value},${this.lngInput.value}`);
    this.setCoordinates(coords);
    Storage.save('mapping-data', AppState.mapping);
    UI.showNotification('Address located on placeholder map.', 'success');
    return coords;
  },
  renderPoints() {
    if (!this.pointsNode) return;
    const points = AppState.mapping.points || [];
    this.pointsNode.innerHTML = points.map((point, index) => `<div class="small-text">${index + 1}. ${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}</div>`).join('') || '<div class="small-text">No fence points marked yet.</div>';
  },
  addFencePoint() {
    const lat = App.safeNumber(this.latInput && this.latInput.value, NaN);
    const lng = App.safeNumber(this.lngInput && this.lngInput.value, NaN);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      UI.showNotification('Enter valid coordinates first.', 'warning');
      return false;
    }
    AppState.mapping.points = Array.isArray(AppState.mapping.points) ? AppState.mapping.points : [];
    const point = { lat, lng };
    AppState.mapping.points.push(point);
    if (window.MapTool) MapTool.addMarker(lat, lng, `Point ${AppState.mapping.points.length}`);
    this.renderPoints();
    this.calculateDistance();
    this.calculateArea();
    Storage.save('mapping-data', AppState.mapping);
    return point;
  },
  calculateDistance() {
    const distance = window.MapTool ? MapTool.calculateDistance(AppState.mapping.points || []) : 0;
    if (this.distanceNode) this.distanceNode.textContent = `${distance.toFixed(2)} ft`;
    return distance;
  },
  calculateArea() {
    const area = window.MapTool ? MapTool.calculateArea(AppState.mapping.points || []) : 0;
    if (this.areaNode) this.areaNode.textContent = `${area.toFixed(2)} sq ft`;
    return area;
  },
  updateFromManualCoordinates() {
    const lat = App.safeNumber(this.latInput && this.latInput.value);
    const lng = App.safeNumber(this.lngInput && this.lngInput.value);
    this.setCoordinates({ lat, lng });
    this.renderPoints();
    this.calculateDistance();
    this.calculateArea();
    Storage.save('mapping-data', AppState.mapping);
  },
  exportMap() {
    if (window.MapTool) MapTool.exportMap();
  },
  load() {
    const saved = Storage.load('mapping-data') || AppState.mapping || { address: '', coordinates: { lat: 35.7796, lng: -78.6382 }, points: [] };
    AppState.mapping = saved;
    if (this.addressInput) this.addressInput.value = saved.address || '';
    this.setCoordinates(saved.coordinates || { lat: 35.7796, lng: -78.6382 });
    this.renderPoints();
    this.calculateDistance();
    this.calculateArea();
  },
  save() {
    Storage.save('mapping-data', AppState.mapping || {});
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab17 = Tab17;
