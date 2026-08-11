/**
 * mapping.js – Google Maps helper utilities
 */
const MappingTool = (() => {
  let distancePoints = [];

  function calcDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000; // metres
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  function metersToFeet(m) { return m * 3.28084; }

  function formatDistance(meters) {
    const ft = metersToFeet(meters);
    return ft >= 100 ? `${ft.toFixed(0)} ft` : `${ft.toFixed(1)} ft`;
  }

  function calcPolygonArea(points) {
    if (points.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].lat * points[j].lng;
      area -= points[j].lat * points[i].lng;
    }
    return Math.abs(area / 2) * 111320 * 111320; // rough sq meters
  }

  function addMeasurementPoint(lat, lng, mapInstance) {
    distancePoints.push({ lat, lng });
    if (distancePoints.length >= 2) {
      const last = distancePoints[distancePoints.length - 1];
      const prev = distancePoints[distancePoints.length - 2];
      const dist = calcDistance(prev.lat, prev.lng, last.lat, last.lng);
      UI.setText('map-distance', formatDistance(dist));
    }
    return distancePoints;
  }

  function clearMeasurements() {
    distancePoints = [];
    UI.setText('map-distance', '--');
    UI.setText('map-area', '--');
  }

  return { calcDistance, metersToFeet, formatDistance, calcPolygonArea, addMeasurementPoint, clearMeasurements };
})();
