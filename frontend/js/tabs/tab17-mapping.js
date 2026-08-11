/**
 * tab17-mapping.js – Mapping tab (Google Maps integration)
 */
const Tab17Mapping = (() => {
  let map = null;
  let marker = null;

  function init() {
    document.getElementById('btn-map-search')?.addEventListener('click', searchAddress);
    document.getElementById('btn-map-measure')?.addEventListener('click', () => {
      UI.showNotification('Click on the map to place measurement points (requires Maps API)', 'info');
    });
    document.getElementById('btn-map-export')?.addEventListener('click', () => {
      UI.showNotification('Export map: requires Maps API key in Admin Settings', 'info');
    });
    document.getElementById('btn-save-map-notes')?.addEventListener('click', () => {
      const notes = UI.getValue('map-notes');
      Storage.saveMapNotes(notes);
      UI.showNotification('Map notes saved', 'success');
    });

    // Load saved notes
    const saved = Storage.loadMapNotes();
    UI.setValue('map-notes', saved);

    // Pre-populate address from project
    const proj = Storage.loadProject();
    if (proj && proj.address) {
      const fullAddr = [proj.address, proj.city, proj.province, proj.postalCode].filter(Boolean).join(', ');
      UI.setValue('map-address-input', fullAddr);
      UI.setText('map-address-display', fullAddr);
    }

    // Try to init Google Maps if API key is set
    initGoogleMaps();
  }

  function searchAddress() {
    const addr = UI.getValue('map-address-input');
    if (!addr) { UI.showNotification('Enter an address to search', 'error'); return; }
    UI.setText('map-address-display', addr);

    if (window.google && map) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: addr }, (results, status) => {
        if (status === 'OK') {
          const loc = results[0].geometry.location;
          map.setCenter(loc);
          map.setZoom(18);
          if (marker) marker.setPosition(loc);
          else marker = new google.maps.Marker({ position: loc, map });
          UI.setText('map-coords', `${loc.lat().toFixed(6)}, ${loc.lng().toFixed(6)}`);
        } else {
          UI.showNotification('Address not found: ' + status, 'error');
        }
      });
    } else {
      UI.showNotification('Add Google Maps API key in Admin Settings (Tab 15) to enable full mapping', 'info');
    }
  }

  function initGoogleMaps() {
    const settings = Storage.loadSettings();
    if (!settings.mapsKey || !window.google) return;
    const container = document.getElementById('google-map');
    if (!container) return;
    container.innerHTML = '';
    map = new window.google.maps.Map(container, {
      center: { lat: 43.7, lng: -79.4 },
      zoom: 12
    });
  }

  return { init };
})();
