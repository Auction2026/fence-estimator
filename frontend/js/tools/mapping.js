/**
 * FENCE DEPOT ESTIMATOR - Mapping Tool
 * frontend/js/tools/mapping.js
 */

'use strict';

var MappingTool = MappingTool || (function () {

  var _map = null;
  var _markers = [];
  var _polylines = [];
  var _initialized = false;

  // ---- Initialize ----
  function init() {
    if (_initialized) return;

    var container = document.getElementById('map-container');
    if (!container) return;

    if (typeof google !== 'undefined' && google.maps) {
      _initGoogleMaps(container);
    } else if (typeof Tab17Mapping !== 'undefined') {
      Tab17Mapping.init();
    } else {
      _showPlaceholder(container);
    }
    _initialized = true;
  }

  function _initGoogleMaps(container) {
    _map = new google.maps.Map(container, {
      center: { lat: 39.5, lng: -98.35 },
      zoom:   6,
      mapTypeId: 'hybrid',
      disableDefaultUI: false,
      streetViewControl: false,
    });

    _map.addListener('click', function (e) {
      _addMarker(e.latLng.lat(), e.latLng.lng());
    });
  }

  function _showPlaceholder(container) {
    container.style.background = '#F5F7FA';
    container.style.display    = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'center';
    container.innerHTML =
      '<div style="text-align:center;color:#7F8C8D">' +
      '<div style="font-size:48px;margin-bottom:12px">🗺️</div>' +
      '<p>Google Maps API key required for interactive map.</p>' +
      '<p style="font-size:12px;margin-top:8px">Add key to index.html Google Maps script src</p>' +
      '</div>';
  }

  // ---- Geocoding ----
  function geocode(address, callback) {
    if (!google || !google.maps) { if (callback) callback(null); return; }
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function (results, status) {
      if (status === 'OK' && results[0]) {
        var loc = results[0].geometry.location;
        if (_map) {
          _map.setCenter(loc);
          _map.setZoom(18);
        }
        if (callback) callback({ lat: loc.lat(), lng: loc.lng() });
      } else {
        if (callback) callback(null);
      }
    });
  }

  // ---- Markers ----
  function _addMarker(lat, lng, label, icon) {
    if (!_map) return null;
    var marker = new google.maps.Marker({
      position:  { lat, lng },
      map:       _map,
      label:     label || String(_markers.length + 1),
      icon:      icon,
      draggable: true,
    });
    _markers.push(marker);
    return marker;
  }

  function clearMarkers() {
    _markers.forEach(function (m) { m.setMap(null); });
    _markers = [];
  }

  // ---- Polylines ----
  function drawPolyline(coords, color, weight) {
    if (!_map) return null;
    var line = new google.maps.Polyline({
      path:          coords,
      map:           _map,
      strokeColor:   color  || '#1B2D4D',
      strokeWeight:  weight || 3,
      strokeOpacity: 1,
    });
    _polylines.push(line);
    return line;
  }

  function clearPolylines() {
    _polylines.forEach(function (l) { l.setMap(null); });
    _polylines = [];
  }

  // ---- Distance ----
  function haversineDistance(lat1, lng1, lat2, lng2) {
    var R    = 3958.8; // miles
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a    = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function getMap() { return _map; }

  return {
    init, geocode,
    addMarker: _addMarker, clearMarkers,
    drawPolyline, clearPolylines,
    haversineDistance,
    getMap,
  };

})();

window.MappingTool = MappingTool;
