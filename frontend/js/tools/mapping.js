/**
 * FENCE DEPOT ESTIMATOR - Mapping Tool
 * mapping.js — Google Maps / Leaflet integration stub
 *
 * Usage: MappingTool.init('mapContainer', { lat, lng })
 * When a mapping API key is configured, the real map loads.
 * Otherwise shows a placeholder with measurement instructions.
 */
'use strict';

const MappingTool = (() => {

  let mapInstance  = null;
  let polyline     = null;
  let measurePoints = [];

  function init(containerId, coords = { lat: 51.0, lng: -114.0 }) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (typeof google !== 'undefined' && google.maps) {
      _initGoogleMaps(container, coords);
    } else if (typeof L !== 'undefined') {
      _initLeaflet(container, coords);
    } else {
      _showPlaceholder(container);
    }
  }

  function _initGoogleMaps(container, coords) {
    mapInstance = new google.maps.Map(container, {
      center: { lat: coords.lat, lng: coords.lng },
      zoom:   18,
      mapTypeId: 'satellite',
    });
    polyline = new google.maps.Polyline({
      strokeColor:   '#0FA89F',
      strokeOpacity: 1,
      strokeWeight:  3,
      map: mapInstance,
    });
    mapInstance.addListener('click', e => {
      measurePoints.push({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      polyline.setPath(measurePoints);
    });
  }

  function _initLeaflet(container, coords) {
    mapInstance = L.map(container).setView([coords.lat, coords.lng], 18);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance);
    const pl = L.polyline([], { color: '#0FA89F', weight: 3 });
    pl.addTo(mapInstance);
    mapInstance.on('click', e => {
      measurePoints.push([e.latlng.lat, e.latlng.lng]);
      pl.setLatLngs(measurePoints);
    });
    polyline = pl;
  }

  function _showPlaceholder(container) {
    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:300px;background:#f5f7fa;border-radius:8px;padding:30px;text-align:center;gap:16px">
        <span style="font-size:48px">🗺️</span>
        <h3 style="color:#1B2D4D">Map Integration</h3>
        <p style="color:#7F8C8D;max-width:400px">
          Add a Google Maps or Leaflet API key to enable satellite measurement.
          Until then, use the <strong>Drawing Tool</strong> tab to sketch your fence layout.
        </p>
        <p style="font-size:12px;color:#aaa">Set MAPS_API_KEY in backend/.env to enable.</p>
      </div>`;
  }

  function clearMeasurement() { measurePoints = []; if (polyline) polyline.setPath ? polyline.setPath([]) : polyline.setLatLngs([]); }

  function getTotalFootage() {
    if (measurePoints.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < measurePoints.length; i++) {
      const a = measurePoints[i-1], b = measurePoints[i];
      total += _haversine(a[0]||a.lat, a[1]||a.lng, b[0]||b.lat, b[1]||b.lng);
    }
    return Math.round(total * 3.28084); // meters → feet
  }

  function _haversine(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const φ1 = lat1 * Math.PI/180, φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180, Δλ = (lng2-lng1) * Math.PI/180;
    const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  return { init, clearMeasurement, getTotalFootage };
})();

window.MappingTool = MappingTool;
