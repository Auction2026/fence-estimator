"use strict";
/**
 * @file Mapping tool with Google Maps stub support and a local fallback renderer.
 */
(function initMappingTool(window, document) {
  /**
   * Fallback map and geocoder service.
   */
  class MappingTool {
    /**
     * @param {HTMLElement} container
     * @param {object} [options]
     */
    constructor(container, options) {
      this.container = container;
      this.options = Object.assign({ zoom: 16 }, options || {});
      this.markers = [];
      this.currentLocation = { lat: 43.6532, lng: -79.3832, address: "Toronto, ON" };
      this.mapInstance = null;
      this.measurement = null;
      this.renderShell();
      this.initializeMap();
    }

    /**
     * Render base DOM structure.
     * @returns {void}
     */
    renderShell() {
      this.container.innerHTML = [
        '<div class="mapping-tool">',
        '  <div class="mapping-toolbar">',
        '    <input type="text" data-role="address" placeholder="Search address">',
        '    <button type="button" data-action="search">Geocode</button>',
        '    <button type="button" data-action="marker">Add Marker</button>',
        '    <button type="button" data-action="measure">Measure Last Two</button>',
        '  </div>',
        '  <div class="map-surface" data-role="surface"></div>',
        '  <div class="map-meta" data-role="meta"></div>',
        '</div>'
      ].join("");
      this.bindEvents();
    }

    /**
     * @returns {void}
     */
    bindEvents() {
      var self = this;
      this.container.querySelector('[data-action="search"]').addEventListener("click", function () {
        var address = self.container.querySelector('[data-role="address"]').value.trim();
        self.geocodeAddress(address).then(function (result) {
          self.setLocation(result);
        });
      });
      this.container.querySelector('[data-action="marker"]').addEventListener("click", function () {
        self.addMarker({
          lat: self.currentLocation.lat,
          lng: self.currentLocation.lng,
          label: "Marker " + (self.markers.length + 1)
        });
      });
      this.container.querySelector('[data-action="measure"]').addEventListener("click", function () {
        self.measureLastTwo();
      });
    }

    /**
     * Initialize Google Maps if available, otherwise render fallback.
     * @returns {void}
     */
    initializeMap() {
      if (window.google && window.google.maps) {
        this.initializeGoogleMap();
      } else {
        this.renderFallbackMap();
      }
      this.renderMeta();
    }

    /**
     * Create Google Maps stub instance.
     * @returns {void}
     */
    initializeGoogleMap() {
      var surface = this.container.querySelector('[data-role="surface"]');
      this.mapInstance = new window.google.maps.Map(surface, {
        center: { lat: this.currentLocation.lat, lng: this.currentLocation.lng },
        zoom: this.options.zoom,
        mapTypeControl: false,
        streetViewControl: false
      });
    }

    /**
     * Render a lightweight fallback map view.
     * @returns {void}
     */
    renderFallbackMap() {
      var surface = this.container.querySelector('[data-role="surface"]');
      surface.innerHTML = [
        '<div class="fallback-map">',
        '  <p><strong>Fallback map view</strong></p>',
        '  <p>Address: ' + this.currentLocation.address + '</p>',
        '  <p>Coordinates: ' + this.currentLocation.lat + ', ' + this.currentLocation.lng + '</p>',
        '  <p>Markers: ' + this.markers.length + '</p>',
        '</div>'
      ].join("");
    }

    /**
     * @param {string} address
     * @returns {Promise<object>}
     */
    geocodeAddress(address) {
      var query = address || this.currentLocation.address;
      if (window.google && window.google.maps && window.google.maps.Geocoder) {
        return new Promise(function (resolve) {
          var geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: query }, function (results, status) {
            if (status === "OK" && results[0]) {
              resolve({
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng(),
                address: results[0].formatted_address
              });
              return;
            }
            resolve(MappingTool.hashAddress(query));
          });
        });
      }
      return Promise.resolve(MappingTool.hashAddress(query));
    }

    /**
     * @param {object} location
     * @returns {void}
     */
    setLocation(location) {
      this.currentLocation = location;
      if (this.mapInstance) {
        this.mapInstance.setCenter({ lat: location.lat, lng: location.lng });
      } else {
        this.renderFallbackMap();
      }
      this.renderMeta();
    }

    /**
     * @param {{lat:number,lng:number,label:string}} marker
     * @returns {void}
     */
    addMarker(marker) {
      this.markers.push(marker);
      if (this.mapInstance && window.google && window.google.maps) {
        new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: this.mapInstance,
          title: marker.label
        });
      } else {
        this.renderFallbackMap();
      }
      this.renderMeta();
    }

    /**
     * @returns {number|null}
     */
    measureLastTwo() {
      if (this.markers.length < 2) {
        this.measurement = null;
        this.renderMeta();
        return null;
      }
      var a = this.markers[this.markers.length - 2];
      var b = this.markers[this.markers.length - 1];
      this.measurement = this.calculateDistance(a, b);
      this.renderMeta();
      return this.measurement;
    }

    /**
     * @param {{lat:number,lng:number}} first
     * @param {{lat:number,lng:number}} second
     * @returns {number}
     */
    calculateDistance(first, second) {
      var toRadians = function (degrees) {
        return degrees * Math.PI / 180;
      };
      var earthRadius = 6371000;
      var latDelta = toRadians(second.lat - first.lat);
      var lngDelta = toRadians(second.lng - first.lng);
      var startLat = toRadians(first.lat);
      var endLat = toRadians(second.lat);
      var a = Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
        Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) * Math.sin(lngDelta / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Number((earthRadius * c).toFixed(2));
    }

    /**
     * Render address, marker, and measurement details.
     * @returns {void}
     */
    renderMeta() {
      var host = this.container.querySelector('[data-role="meta"]');
      host.innerHTML = [
        '<h3>Map Details</h3>',
        '<p><strong>Address:</strong> ' + this.currentLocation.address + '</p>',
        '<p><strong>Coordinates:</strong> ' + this.currentLocation.lat + ', ' + this.currentLocation.lng + '</p>',
        '<p><strong>Markers:</strong> ' + this.markers.length + '</p>',
        '<p><strong>Measurement:</strong> ' + (this.measurement === null ? 'Add two markers' : this.measurement + ' m') + '</p>',
        '<ol>' + this.markers.map(function (marker) {
          return '<li>' + marker.label + ' — ' + marker.lat + ', ' + marker.lng + '</li>';
        }).join("") + '</ol>'
      ].join("");
    }

    /**
     * @param {string} address
     * @returns {{lat:number,lng:number,address:string}}
     */
    static hashAddress(address) {
      var seed = (address || "").split("").reduce(function (sum, char) {
        return sum + char.charCodeAt(0);
      }, 0);
      return {
        lat: Number((43 + ((seed % 800) / 1000)).toFixed(6)),
        lng: Number((-79 - ((seed % 600) / 1000)).toFixed(6)),
        address: address || "Unknown address"
      };
    }
  }

  /**
   * Mount a mapping tool instance by element id.
   * @param {string} hostId
   * @param {object} [options]
   * @returns {MappingTool|null}
   */
  function mountMappingTool(hostId, options) {
    var host = document.getElementById(hostId);
    if (!host) {
      return null;
    }
    return new MappingTool(host, options);
  }

  window.FenceEstimatorTools = window.FenceEstimatorTools || {};
  window.FenceEstimatorTools.mapping = {
    MappingTool: MappingTool,
    mount: mountMappingTool
  };
})(window, document);
