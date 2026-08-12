/**
 * TAB 17 - Property Mapping
 * frontend/js/tabs/tab17-mapping.js
 */

'use strict';

var Tab17Mapping = (function () {

  var map = null;
  var markers = [];
  var polylines = [];

  function init() {
    var container = document.getElementById('map-container');
    if (!container) return;

    // Try Google Maps first
    if (typeof google !== 'undefined' && google.maps) {
      initGoogleMaps(container);
    } else {
      // Show manual coordinate fallback
      showFallback(container);
    }

    loadSavedMapData();
    bindEvents();
  }

  function initGoogleMaps(container) {
    map = new google.maps.Map(container, {
      center: { lat: 39.5, lng: -98.35 },
      zoom:   6,
      mapTypeId: 'hybrid',
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    map.addListener('click', function (e) {
      addMarker(e.latLng.lat(), e.latLng.lng());
    });

    // Geocode customer address if available
    var addr = buildAddress();
    if (addr) geocodeAddress(addr);
  }

  function showFallback(container) {
    container.innerHTML = '<div style="text-align:center;padding:40px">' +
      '<div style="font-size:48px;margin-bottom:16px">🗺️</div>' +
      '<p class="fw-bold" style="margin-bottom:8px">Google Maps Integration</p>' +
      '<p class="text-muted" style="font-size:14px">Add your Google Maps API key to enable interactive mapping.</p>' +
      '<p class="text-muted" style="font-size:12px;margin-top:8px">Property address: <strong>' +
      UI.escapeHtml(buildAddress() || 'Not set') +
      '</strong></p>' +
      '<a href="https://console.cloud.google.com/google/maps-apis/" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm" style="margin-top:16px">Get Maps API Key</a>' +
      '</div>';
  }

  function buildAddress() {
    var cust = FenceApp.project.customer || {};
    return [cust.address, cust.city, cust.state, cust.zip].filter(Boolean).join(', ');
  }

  function geocodeAddress(address) {
    if (!map || !google || !google.maps) return;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function (results, status) {
      if (status === 'OK' && results[0]) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(18);
        addMarker(results[0].geometry.location.lat(), results[0].geometry.location.lng(), 'Property');
      }
    });
  }

  function addMarker(lat, lng, label) {
    if (!map) return;
    var marker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      label: label || String(markers.length + 1),
      draggable: true,
    });
    markers.push({ marker, lat, lng, label: label || String(markers.length) });
    renderMarkerList();
  }

  function removeMarker(index) {
    if (markers[index] && markers[index].marker) {
      markers[index].marker.setMap(null);
    }
    markers.splice(index, 1);
    renderMarkerList();
  }

  function renderMarkerList() {
    var container = document.getElementById('map-markers-list');
    if (!container) return;
    if (markers.length === 0) {
      container.innerHTML = '<p class="text-muted" style="font-size:13px">Click the map to add markers.</p>';
      return;
    }
    container.innerHTML = markers.map(function (m, i) {
      return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--border)">' +
        '<span>📍 ' + UI.escapeHtml(m.label || 'Point ' + (i + 1)) + '</span>' +
        '<span class="text-muted" style="font-size:12px;flex:1">' + (m.lat || 0).toFixed(5) + ', ' + (m.lng || 0).toFixed(5) + '</span>' +
        '<button class="btn btn-sm btn-danger" onclick="Tab17Mapping.removeMarker(' + i + ')">×</button>' +
        '</div>';
    }).join('');
  }

  function loadSavedMapData() {
    var mapData = FenceApp.project.mapData || {};
    if (mapData.markers && map) {
      mapData.markers.forEach(function (m) { addMarker(m.lat, m.lng, m.label); });
    }
  }

  function bindEvents() {
    var btnSave = document.getElementById('btn-save-map');
    if (btnSave) btnSave.addEventListener('click', save);

    var btnGeocode = document.getElementById('btn-geocode-address');
    if (btnGeocode) btnGeocode.addEventListener('click', function () {
      var addr = buildAddress();
      if (addr) geocodeAddress(addr);
      else UI.showToast('No customer address set', 'warning');
    });
  }

  function save() {
    FenceApp.project.mapData = {
      markers: markers.map(function (m) { return { lat: m.lat, lng: m.lng, label: m.label }; }),
      savedAt: new Date().toISOString(),
    };
    Storage.saveProject(FenceApp.project);
    UI.showToast('Map data saved ✓', 'success');
  }

  return { init, removeMarker, save };

})();

window.Tab17Mapping  = Tab17Mapping;
window.MappingTool   = Tab17Mapping;  // alias used in app.js
