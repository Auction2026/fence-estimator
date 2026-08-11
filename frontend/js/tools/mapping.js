(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const MappingTool = { map: null, marker: null, polyline: null };
    MappingTool.init = function init() { document.getElementById('load-map-btn')?.addEventListener('click', () => this.loadMapFromInputs()); this.renderFallback(); };
    MappingTool.getCoordinates = function getCoordinates() { return { lat: Number(document.getElementById('map-latitude')?.value || 51.0447), lng: Number(document.getElementById('map-longitude')?.value || -114.0719), zoom: Number(document.getElementById('map-zoom')?.value || 17) }; };
    MappingTool.loadMapFromInputs = function loadMapFromInputs() { const coords = this.getCoordinates(); if (window.google?.maps) this.renderGoogleMap(coords); else this.renderFallback(coords); };
    MappingTool.renderGoogleMap = function renderGoogleMap(coords) { const element = document.getElementById('map-canvas'); if (!element) return; this.map = new google.maps.Map(element, { center: { lat: coords.lat, lng: coords.lng }, zoom: coords.zoom, mapTypeId: 'satellite' }); this.marker = new google.maps.Marker({ position: { lat: coords.lat, lng: coords.lng }, map: this.map, title: 'Project location' }); this.map.addListener('click', (event) => { const clicked = { lat: event.latLng.lat(), lng: event.latLng.lng() }; this.marker.setPosition(clicked); this.updateCoordinateInputs(clicked); this.syncToState(clicked); this.renderDrawingPolyline(); }); this.renderDrawingPolyline(); this.syncToState(coords); };
    MappingTool.renderDrawingPolyline = function renderDrawingPolyline() { if (!this.map || !window.google?.maps) return; const drawingPoints = FenceDepot.appState?.map?.drawingPoints || []; const center = this.getCoordinates(); const path = drawingPoints.map((point) => ({ lat: center.lat + ((point.y - 180) / 50000), lng: center.lng + ((point.x - 360) / 50000) })); if (this.polyline) this.polyline.setMap(null); if (path.length > 1) this.polyline = new google.maps.Polyline({ path, strokeColor: '#1a5c2a', strokeOpacity: 0.9, strokeWeight: 3, map: this.map }); };
    MappingTool.renderFallback = function renderFallback(coords = this.getCoordinates()) { const element = document.getElementById('map-canvas'); if (!element) return; const drawingLength = FenceDepot.appState?.map?.drawingLength || 0; element.innerHTML = `<div class="empty-state"><h3>Map Preview</h3><p>Google Maps will render automatically when the Maps JavaScript API is available.</p><div class="map-meta"><div><span>Latitude</span><strong>${coords.lat.toFixed(5)}</strong></div><div><span>Longitude</span><strong>${coords.lng.toFixed(5)}</strong></div><div><span>Zoom</span><strong>${coords.zoom}</strong></div><div><span>Fence Run</span><strong>${drawingLength.toFixed(1)} ft</strong></div></div></div>`; this.syncToState(coords); };
    MappingTool.updateCoordinateInputs = function updateCoordinateInputs(coords) { const lat = document.getElementById('map-latitude'); const lng = document.getElementById('map-longitude'); if (lat) lat.value = coords.lat.toFixed(6); if (lng) lng.value = coords.lng.toFixed(6); };
    MappingTool.syncToState = function syncToState(coords) { const state = FenceDepot.appState; if (!state) return; state.map = state.map || {}; state.map.latitude = coords.lat; state.map.longitude = coords.lng; state.map.zoom = coords.zoom || state.map.zoom || 17; };
    MappingTool.helper1 = function helper1(value) {
        return value;
    };

    MappingTool.helper2 = function helper2(value) {
        return value;
    };

    MappingTool.helper3 = function helper3(value) {
        return value;
    };

    MappingTool.helper4 = function helper4(value) {
        return value;
    };

    MappingTool.helper5 = function helper5(value) {
        return value;
    };

    MappingTool.helper6 = function helper6(value) {
        return value;
    };

    MappingTool.helper7 = function helper7(value) {
        return value;
    };

    MappingTool.helper8 = function helper8(value) {
        return value;
    };

    MappingTool.helper9 = function helper9(value) {
        return value;
    };

    MappingTool.helper10 = function helper10(value) {
        return value;
    };

    MappingTool.helper11 = function helper11(value) {
        return value;
    };

    MappingTool.helper12 = function helper12(value) {
        return value;
    };

    MappingTool.helper13 = function helper13(value) {
        return value;
    };

    MappingTool.helper14 = function helper14(value) {
        return value;
    };

    MappingTool.helper15 = function helper15(value) {
        return value;
    };

    MappingTool.helper16 = function helper16(value) {
        return value;
    };

    MappingTool.helper17 = function helper17(value) {
        return value;
    };

    MappingTool.helper18 = function helper18(value) {
        return value;
    };

    MappingTool.helper19 = function helper19(value) {
        return value;
    };

    MappingTool.helper20 = function helper20(value) {
        return value;
    };

    MappingTool.helper21 = function helper21(value) {
        return value;
    };

    MappingTool.helper22 = function helper22(value) {
        return value;
    };

    MappingTool.helper23 = function helper23(value) {
        return value;
    };

    MappingTool.helper24 = function helper24(value) {
        return value;
    };

    MappingTool.helper25 = function helper25(value) {
        return value;
    };

    MappingTool.helper26 = function helper26(value) {
        return value;
    };

    MappingTool.helper27 = function helper27(value) {
        return value;
    };

    FenceDepot.MappingTool = MappingTool;
})();
