/**
 * mapping.js - Google Maps / Site Mapping Integration
 * Fence Depot Estimator
 */

const MappingTool = {
    map: null,
    polygon: null,
    markers: [],

    init(mapDivId) {
        if (typeof google === 'undefined') {
            console.warn('Google Maps API not loaded.');
            return;
        }
        this.map = new google.maps.Map(document.getElementById(mapDivId), {
            zoom: 17,
            center: { lat: 43.6532, lng: -79.3832 }, // Default: Toronto
            mapTypeId: 'satellite'
        });
        this.bindDrawingManager();
    },

    bindDrawingManager() {
        if (!google.maps.drawing) return;
        const dm = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            polygonOptions: {
                strokeColor: '#0FA89F',
                strokeWeight: 2,
                fillColor: '#0FA89F',
                fillOpacity: 0.2
            }
        });
        dm.setMap(this.map);
        google.maps.event.addListener(dm, 'polygoncomplete', polygon => {
            this.polygon = polygon;
            this.calculatePerimeter();
        });
    },

    calculatePerimeter() {
        if (!this.polygon) return 0;
        const path = this.polygon.getPath();
        let total = 0;
        for (let i = 0; i < path.getLength(); i++) {
            const a = path.getAt(i);
            const b = path.getAt((i + 1) % path.getLength());
            total += google.maps.geometry.spherical.computeDistanceBetween(a, b);
        }
        const feet = Math.round(total * 3.28084);
        console.log(`Perimeter: ${feet} feet`);
        return feet;
    },

    geocode(address) {
        const geocoder = new google.maps.Geocoder();
        return new Promise((resolve, reject) => {
            geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK') {
                    this.map.setCenter(results[0].geometry.location);
                    resolve(results[0]);
                } else {
                    reject(status);
                }
            });
        });
    },

    clear() {
        if (this.polygon) {
            this.polygon.setMap(null);
            this.polygon = null;
        }
        this.markers.forEach(m => m.setMap(null));
        this.markers = [];
    }
};
