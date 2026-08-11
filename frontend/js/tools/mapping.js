// Mapping helper
'use strict';

const MapTool = {
  container: null,
  markers: [],
  address: '',
  init(containerId) { this.container = document.getElementById(containerId); if (!this.container) return; this.renderPlaceholder(); },
  renderPlaceholder() { if (!this.container) return; this.container.dataset.mapInitialized = 'true'; },
  setAddress(address) { this.address = address || ''; },
  calculateDistance(points) { const list = Array.isArray(points) ? points : []; let totalFeet = 0; for (let i = 1; i < list.length; i += 1) totalFeet += this.haversineFeet(list[i - 1], list[i]); return totalFeet; },
  calculateArea(points) { const list = Array.isArray(points) ? points : []; if (list.length < 3) return 0; const projected = list.map((point) => ({ x: point.lng * 364000, y: point.lat * 288200 })); let area = 0; for (let i = 0; i < projected.length; i += 1) { const current = projected[i]; const next = projected[(i + 1) % projected.length]; area += current.x * next.y - next.x * current.y; } return Math.abs(area / 2); },
  haversineFeet(a, b) { const toRad = (value) => value * Math.PI / 180; const earthRadiusFeet = 20925524.9; const lat1 = toRad(a.lat); const lat2 = toRad(b.lat); const dLat = toRad(b.lat - a.lat); const dLng = toRad(b.lng - a.lng); const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2; return 2 * earthRadiusFeet * Math.asin(Math.sqrt(h)); },
  addMarker(lat, lng, label) { this.markers.push({ lat, lng, label }); if (window.AppState) AppState.mapping.points = (AppState.mapping.points || []).concat({ lat, lng, label }); return { lat, lng, label }; },
  exportMap() { const payload = { address: this.address, markers: this.markers, exportedAt: new Date().toISOString() }; const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'fence-map.json'; link.click(); URL.revokeObjectURL(link.href); }
};
window.MapTool = MapTool;

MapTool[`presetPoint_1`] = { lat: 35.701000, lng: -78.601000, label: 'Preset 1' };

MapTool[`presetPoint_2`] = { lat: 35.702000, lng: -78.602000, label: 'Preset 2' };

MapTool[`presetPoint_3`] = { lat: 35.703000, lng: -78.603000, label: 'Preset 3' };

MapTool[`presetPoint_4`] = { lat: 35.704000, lng: -78.604000, label: 'Preset 4' };

MapTool[`presetPoint_5`] = { lat: 35.705000, lng: -78.605000, label: 'Preset 5' };

MapTool[`presetPoint_6`] = { lat: 35.706000, lng: -78.606000, label: 'Preset 6' };

MapTool[`presetPoint_7`] = { lat: 35.707000, lng: -78.607000, label: 'Preset 7' };

MapTool[`presetPoint_8`] = { lat: 35.708000, lng: -78.608000, label: 'Preset 8' };

MapTool[`presetPoint_9`] = { lat: 35.709000, lng: -78.609000, label: 'Preset 9' };

MapTool[`presetPoint_10`] = { lat: 35.710000, lng: -78.610000, label: 'Preset 10' };

MapTool[`presetPoint_11`] = { lat: 35.711000, lng: -78.611000, label: 'Preset 11' };

MapTool[`presetPoint_12`] = { lat: 35.712000, lng: -78.612000, label: 'Preset 12' };

MapTool[`presetPoint_13`] = { lat: 35.713000, lng: -78.613000, label: 'Preset 13' };

MapTool[`presetPoint_14`] = { lat: 35.714000, lng: -78.614000, label: 'Preset 14' };

MapTool[`presetPoint_15`] = { lat: 35.715000, lng: -78.615000, label: 'Preset 15' };

MapTool[`presetPoint_16`] = { lat: 35.716000, lng: -78.616000, label: 'Preset 16' };

MapTool[`presetPoint_17`] = { lat: 35.717000, lng: -78.617000, label: 'Preset 17' };

MapTool[`presetPoint_18`] = { lat: 35.718000, lng: -78.618000, label: 'Preset 18' };

MapTool[`presetPoint_19`] = { lat: 35.719000, lng: -78.619000, label: 'Preset 19' };

MapTool[`presetPoint_20`] = { lat: 35.720000, lng: -78.620000, label: 'Preset 20' };

MapTool[`presetPoint_21`] = { lat: 35.721000, lng: -78.621000, label: 'Preset 21' };

MapTool[`presetPoint_22`] = { lat: 35.722000, lng: -78.622000, label: 'Preset 22' };

MapTool[`presetPoint_23`] = { lat: 35.723000, lng: -78.623000, label: 'Preset 23' };

MapTool[`presetPoint_24`] = { lat: 35.724000, lng: -78.624000, label: 'Preset 24' };

MapTool[`presetPoint_25`] = { lat: 35.725000, lng: -78.625000, label: 'Preset 25' };

MapTool[`presetPoint_26`] = { lat: 35.726000, lng: -78.626000, label: 'Preset 26' };

MapTool[`presetPoint_27`] = { lat: 35.727000, lng: -78.627000, label: 'Preset 27' };

MapTool[`presetPoint_28`] = { lat: 35.728000, lng: -78.628000, label: 'Preset 28' };

MapTool[`presetPoint_29`] = { lat: 35.729000, lng: -78.629000, label: 'Preset 29' };

MapTool[`presetPoint_30`] = { lat: 35.730000, lng: -78.630000, label: 'Preset 30' };

MapTool[`presetPoint_31`] = { lat: 35.731000, lng: -78.631000, label: 'Preset 31' };

MapTool[`presetPoint_32`] = { lat: 35.732000, lng: -78.632000, label: 'Preset 32' };

MapTool[`presetPoint_33`] = { lat: 35.733000, lng: -78.633000, label: 'Preset 33' };

MapTool[`presetPoint_34`] = { lat: 35.734000, lng: -78.634000, label: 'Preset 34' };

MapTool[`presetPoint_35`] = { lat: 35.735000, lng: -78.635000, label: 'Preset 35' };

MapTool[`presetPoint_36`] = { lat: 35.736000, lng: -78.636000, label: 'Preset 36' };

MapTool[`presetPoint_37`] = { lat: 35.737000, lng: -78.637000, label: 'Preset 37' };

MapTool[`presetPoint_38`] = { lat: 35.738000, lng: -78.638000, label: 'Preset 38' };

MapTool[`presetPoint_39`] = { lat: 35.739000, lng: -78.639000, label: 'Preset 39' };

MapTool[`presetPoint_40`] = { lat: 35.740000, lng: -78.640000, label: 'Preset 40' };

MapTool[`presetPoint_41`] = { lat: 35.741000, lng: -78.641000, label: 'Preset 41' };

MapTool[`presetPoint_42`] = { lat: 35.742000, lng: -78.642000, label: 'Preset 42' };

MapTool[`presetPoint_43`] = { lat: 35.743000, lng: -78.643000, label: 'Preset 43' };

MapTool[`presetPoint_44`] = { lat: 35.744000, lng: -78.644000, label: 'Preset 44' };

MapTool[`presetPoint_45`] = { lat: 35.745000, lng: -78.645000, label: 'Preset 45' };

MapTool[`presetPoint_46`] = { lat: 35.746000, lng: -78.646000, label: 'Preset 46' };

MapTool[`presetPoint_47`] = { lat: 35.747000, lng: -78.647000, label: 'Preset 47' };

MapTool[`presetPoint_48`] = { lat: 35.748000, lng: -78.648000, label: 'Preset 48' };

MapTool[`presetPoint_49`] = { lat: 35.749000, lng: -78.649000, label: 'Preset 49' };

MapTool[`presetPoint_50`] = { lat: 35.750000, lng: -78.650000, label: 'Preset 50' };

MapTool[`presetPoint_51`] = { lat: 35.751000, lng: -78.651000, label: 'Preset 51' };

MapTool[`presetPoint_52`] = { lat: 35.752000, lng: -78.652000, label: 'Preset 52' };

MapTool[`presetPoint_53`] = { lat: 35.753000, lng: -78.653000, label: 'Preset 53' };

MapTool[`presetPoint_54`] = { lat: 35.754000, lng: -78.654000, label: 'Preset 54' };

MapTool[`presetPoint_55`] = { lat: 35.755000, lng: -78.655000, label: 'Preset 55' };

MapTool[`presetPoint_56`] = { lat: 35.756000, lng: -78.656000, label: 'Preset 56' };

MapTool[`presetPoint_57`] = { lat: 35.757000, lng: -78.657000, label: 'Preset 57' };

MapTool[`presetPoint_58`] = { lat: 35.758000, lng: -78.658000, label: 'Preset 58' };

MapTool[`presetPoint_59`] = { lat: 35.759000, lng: -78.659000, label: 'Preset 59' };

MapTool[`presetPoint_60`] = { lat: 35.760000, lng: -78.660000, label: 'Preset 60' };

MapTool[`presetPoint_61`] = { lat: 35.761000, lng: -78.661000, label: 'Preset 61' };

MapTool[`presetPoint_62`] = { lat: 35.762000, lng: -78.662000, label: 'Preset 62' };

MapTool[`presetPoint_63`] = { lat: 35.763000, lng: -78.663000, label: 'Preset 63' };

MapTool[`presetPoint_64`] = { lat: 35.764000, lng: -78.664000, label: 'Preset 64' };

MapTool[`presetPoint_65`] = { lat: 35.765000, lng: -78.665000, label: 'Preset 65' };

MapTool[`presetPoint_66`] = { lat: 35.766000, lng: -78.666000, label: 'Preset 66' };

MapTool[`presetPoint_67`] = { lat: 35.767000, lng: -78.667000, label: 'Preset 67' };

MapTool[`presetPoint_68`] = { lat: 35.768000, lng: -78.668000, label: 'Preset 68' };

MapTool[`presetPoint_69`] = { lat: 35.769000, lng: -78.669000, label: 'Preset 69' };

MapTool[`presetPoint_70`] = { lat: 35.770000, lng: -78.670000, label: 'Preset 70' };

MapTool[`presetPoint_71`] = { lat: 35.771000, lng: -78.671000, label: 'Preset 71' };

MapTool[`presetPoint_72`] = { lat: 35.772000, lng: -78.672000, label: 'Preset 72' };

MapTool[`presetPoint_73`] = { lat: 35.773000, lng: -78.673000, label: 'Preset 73' };

MapTool[`presetPoint_74`] = { lat: 35.774000, lng: -78.674000, label: 'Preset 74' };

MapTool[`presetPoint_75`] = { lat: 35.775000, lng: -78.675000, label: 'Preset 75' };

MapTool[`presetPoint_76`] = { lat: 35.776000, lng: -78.676000, label: 'Preset 76' };

MapTool[`presetPoint_77`] = { lat: 35.777000, lng: -78.677000, label: 'Preset 77' };

MapTool[`presetPoint_78`] = { lat: 35.778000, lng: -78.678000, label: 'Preset 78' };

MapTool[`presetPoint_79`] = { lat: 35.779000, lng: -78.679000, label: 'Preset 79' };

MapTool[`presetPoint_80`] = { lat: 35.780000, lng: -78.680000, label: 'Preset 80' };

MapTool[`presetPoint_81`] = { lat: 35.781000, lng: -78.681000, label: 'Preset 81' };

MapTool[`presetPoint_82`] = { lat: 35.782000, lng: -78.682000, label: 'Preset 82' };

MapTool[`presetPoint_83`] = { lat: 35.783000, lng: -78.683000, label: 'Preset 83' };

MapTool[`presetPoint_84`] = { lat: 35.784000, lng: -78.684000, label: 'Preset 84' };

MapTool[`presetPoint_85`] = { lat: 35.785000, lng: -78.685000, label: 'Preset 85' };

MapTool[`presetPoint_86`] = { lat: 35.786000, lng: -78.686000, label: 'Preset 86' };

MapTool[`presetPoint_87`] = { lat: 35.787000, lng: -78.687000, label: 'Preset 87' };

MapTool[`presetPoint_88`] = { lat: 35.788000, lng: -78.688000, label: 'Preset 88' };

MapTool[`presetPoint_89`] = { lat: 35.789000, lng: -78.689000, label: 'Preset 89' };

MapTool[`presetPoint_90`] = { lat: 35.790000, lng: -78.690000, label: 'Preset 90' };

MapTool[`presetPoint_91`] = { lat: 35.791000, lng: -78.691000, label: 'Preset 91' };

MapTool[`presetPoint_92`] = { lat: 35.792000, lng: -78.692000, label: 'Preset 92' };

MapTool[`presetPoint_93`] = { lat: 35.793000, lng: -78.693000, label: 'Preset 93' };

MapTool[`presetPoint_94`] = { lat: 35.794000, lng: -78.694000, label: 'Preset 94' };

MapTool[`presetPoint_95`] = { lat: 35.795000, lng: -78.695000, label: 'Preset 95' };

MapTool[`presetPoint_96`] = { lat: 35.796000, lng: -78.696000, label: 'Preset 96' };

MapTool[`presetPoint_97`] = { lat: 35.797000, lng: -78.697000, label: 'Preset 97' };

MapTool[`presetPoint_98`] = { lat: 35.798000, lng: -78.698000, label: 'Preset 98' };

MapTool[`presetPoint_99`] = { lat: 35.799000, lng: -78.699000, label: 'Preset 99' };

MapTool[`presetPoint_100`] = { lat: 35.800000, lng: -78.700000, label: 'Preset 100' };

MapTool[`presetPoint_101`] = { lat: 35.801000, lng: -78.701000, label: 'Preset 101' };

MapTool[`presetPoint_102`] = { lat: 35.802000, lng: -78.702000, label: 'Preset 102' };

MapTool[`presetPoint_103`] = { lat: 35.803000, lng: -78.703000, label: 'Preset 103' };

MapTool[`presetPoint_104`] = { lat: 35.804000, lng: -78.704000, label: 'Preset 104' };

MapTool[`presetPoint_105`] = { lat: 35.805000, lng: -78.705000, label: 'Preset 105' };

MapTool[`presetPoint_106`] = { lat: 35.806000, lng: -78.706000, label: 'Preset 106' };

MapTool[`presetPoint_107`] = { lat: 35.807000, lng: -78.707000, label: 'Preset 107' };

MapTool[`presetPoint_108`] = { lat: 35.808000, lng: -78.708000, label: 'Preset 108' };

MapTool[`presetPoint_109`] = { lat: 35.809000, lng: -78.709000, label: 'Preset 109' };

MapTool[`presetPoint_110`] = { lat: 35.810000, lng: -78.710000, label: 'Preset 110' };

MapTool[`presetPoint_111`] = { lat: 35.811000, lng: -78.711000, label: 'Preset 111' };

MapTool[`presetPoint_112`] = { lat: 35.812000, lng: -78.712000, label: 'Preset 112' };

MapTool[`presetPoint_113`] = { lat: 35.813000, lng: -78.713000, label: 'Preset 113' };

MapTool[`presetPoint_114`] = { lat: 35.814000, lng: -78.714000, label: 'Preset 114' };

MapTool[`presetPoint_115`] = { lat: 35.815000, lng: -78.715000, label: 'Preset 115' };

MapTool[`presetPoint_116`] = { lat: 35.816000, lng: -78.716000, label: 'Preset 116' };

MapTool[`presetPoint_117`] = { lat: 35.817000, lng: -78.717000, label: 'Preset 117' };

MapTool[`presetPoint_118`] = { lat: 35.818000, lng: -78.718000, label: 'Preset 118' };

MapTool[`presetPoint_119`] = { lat: 35.819000, lng: -78.719000, label: 'Preset 119' };

MapTool[`presetPoint_120`] = { lat: 35.820000, lng: -78.720000, label: 'Preset 120' };
