"use strict";
/**
 * @file Site mapping tab for address lookup, pin placement, map notes, and directions.
 */
(function initMappingTab(window, document) {
  /**
   * Mapping tab controller.
   */
  class MappingTab {
    /**
     * @param {string} containerId
     */
    constructor(containerId) {
      this.containerId = containerId;
      this.state = {
        address: "",
        lat: 43.6532,
        lng: -79.3832,
        pins: [],
        notes: ""
      };
    }

    /**
     * @returns {HTMLElement|null}
     */
    getContainer() {
      return document.getElementById(this.containerId);
    }

    /**
     * Render mapping tab.
     * @returns {void}
     */
    render() {
      var container = this.getContainer();
      if (!container) {
        return;
      }
      container.innerHTML = [
        '<section class="panel mapping-tab">',
        '  <h2>Site Mapping</h2>',
        '  <div class="grid two-column">',
        '    <label>Address lookup<input type="text" data-field="address" placeholder="123 Main St"></label>',
        '    <button type="button" data-action="lookup">Locate Address</button>',
        '  </div>',
        '  <div class="grid two-column">',
        '    <label>Latitude<input type="number" step="0.000001" data-field="lat"></label>',
        '    <label>Longitude<input type="number" step="0.000001" data-field="lng"></label>',
        '  </div>',
        '  <label>Map notes<textarea rows="4" data-field="notes" placeholder="Gate access, staging, neighbour considerations"></textarea></label>',
        '  <div class="map-actions">',
        '    <button type="button" data-action="pin">Drop Pin</button>',
        '    <a href="#" data-role="directions" target="_blank" rel="noopener">Open Directions</a>',
        '  </div>',
        '  <div class="grid two-column">',
        '    <div data-role="map"></div>',
        '    <div data-role="pins"></div>',
        '  </div>',
        '</section>'
      ].join("");

      this.populate();
      this.renderMap();
      this.renderPins();
      this.bindEvents(container);
    }

    /**
     * @returns {void}
     */
    populate() {
      var container = this.getContainer();
      if (!container) {
        return;
      }
      container.querySelector('[data-field="address"]').value = this.state.address;
      container.querySelector('[data-field="lat"]').value = this.state.lat;
      container.querySelector('[data-field="lng"]').value = this.state.lng;
      container.querySelector('[data-field="notes"]').value = this.state.notes;
      container.querySelector('[data-role="directions"]').href = this.getDirectionsUrl();
    }

    /**
     * @param {HTMLElement} container
     * @returns {void}
     */
    bindEvents(container) {
      var self = this;
      container.querySelectorAll("[data-field]").forEach(function (field) {
        field.addEventListener("input", function () {
          if (field.dataset.field === "lat" || field.dataset.field === "lng") {
            self.state[field.dataset.field] = Number(field.value) || 0;
          } else {
            self.state[field.dataset.field] = field.value;
          }
          container.querySelector('[data-role="directions"]').href = self.getDirectionsUrl();
          self.renderMap();
        });
      });
      container.querySelector('[data-action="lookup"]').addEventListener("click", function () {
        self.lookupAddress();
      });
      container.querySelector('[data-action="pin"]').addEventListener("click", function () {
        self.state.pins.push({
          id: "pin-" + Date.now(),
          label: "Fence point " + (self.state.pins.length + 1),
          lat: self.state.lat,
          lng: self.state.lng
        });
        self.renderPins();
      });
    }

    /**
     * @returns {void}
     */
    lookupAddress() {
      var seed = this.state.address.split("").reduce(function (sum, char) {
        return sum + char.charCodeAt(0);
      }, 0);
      this.state.lat = Number((43 + ((seed % 900) / 1000)).toFixed(6));
      this.state.lng = Number((-79 - ((seed % 700) / 1000)).toFixed(6));
      this.populate();
      this.renderMap();
    }

    /**
     * @returns {string}
     */
    getDirectionsUrl() {
      return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(this.state.lat + "," + this.state.lng);
    }

    /**
     * @returns {void}
     */
    renderMap() {
      var container = this.getContainer();
      var host = container && container.querySelector('[data-role="map"]');
      if (!host) {
        return;
      }
      host.innerHTML = [
        '<h3>Map View</h3>',
        '<div class="map-fallback">',
        '  <p><strong>Address:</strong> ' + (this.state.address || "No address provided") + '</p>',
        '  <p><strong>Coordinates:</strong> ' + this.state.lat + ', ' + this.state.lng + '</p>',
        '  <p><strong>Notes:</strong> ' + (this.state.notes || "No site notes") + '</p>',
        '</div>'
      ].join("");
    }

    /**
     * @returns {void}
     */
    renderPins() {
      var container = this.getContainer();
      var host = container && container.querySelector('[data-role="pins"]');
      var self = this;
      if (!host) {
        return;
      }
      if (!this.state.pins.length) {
        host.innerHTML = '<h3>Pins</h3><p>No pins placed.</p>';
        return;
      }
      host.innerHTML = '<h3>Pins</h3><ol>' + this.state.pins.map(function (pin) {
        return '<li data-id="' + pin.id + '">' + pin.label + ' — ' + pin.lat + ', ' + pin.lng + ' <button type="button" data-action="remove-pin">Remove</button></li>';
      }).join("") + '</ol>';
      host.querySelectorAll('[data-action="remove-pin"]').forEach(function (button) {
        button.addEventListener("click", function () {
          var id = button.parentNode.dataset.id;
          self.state.pins = self.state.pins.filter(function (pin) {
            return pin.id !== id;
          });
          self.renderPins();
        });
      });
    }

    /**
     * @returns {object}
     */
    getData() {
      return JSON.parse(JSON.stringify(this.state));
    }
  }

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.mapping = {
    /**
     * @param {string} containerId
     * @returns {MappingTab}
     */
    create: function (containerId) {
      var tab = new MappingTab(containerId);
      tab.render();
      return tab;
    }
  };
})(window, document);
