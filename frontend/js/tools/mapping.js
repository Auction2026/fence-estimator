(function () {
  class MappingTool {
    constructor() {
      this.container = null;
      this.points = [];
      this.onChange = null;
    }

    init(containerId, onChange) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;
      this.onChange = onChange || null;
      this.renderFallback();
      this.container.addEventListener('click', (event) => this.handleClick(event));
    }

    initGoogleMap(config = {}) {
      if (!(window.google && google.maps && this.container)) {
        return false;
      }
      const center = config.center || { lat: 39.5, lng: -98.35 };
      this.map = new google.maps.Map(this.container, {
        zoom: config.zoom || 17,
        center,
        mapTypeId: 'satellite'
      });
      return true;
    }

    renderFallback() {
      this.container.innerHTML = '<div class="map-placeholder"></div>';
      this.redrawFallback();
    }

    handleClick(event) {
      if (!this.container) return;
      const rect = this.container.getBoundingClientRect();
      const point = {
        x: Math.round(event.clientX - rect.left),
        y: Math.round(event.clientY - rect.top)
      };
      this.points.push(point);
      this.redrawFallback();
      this.triggerChange();
    }

    redrawFallback() {
      if (!this.container) return;
      this.container.querySelectorAll('.boundary-point, .boundary-segment').forEach((node) => node.remove());

      this.points.forEach((point, index) => {
        const marker = document.createElement('div');
        marker.className = 'boundary-point';
        marker.style.left = `${point.x}px`;
        marker.style.top = `${point.y}px`;
        marker.title = `Point ${index + 1}`;
        this.container.appendChild(marker);

        if (index > 0) {
          const previous = this.points[index - 1];
          this.drawSegment(previous, point);
        }
      });
    }

    drawSegment(start, end) {
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const segment = document.createElement('div');
      segment.className = 'boundary-segment';
      segment.style.left = `${start.x}px`;
      segment.style.top = `${start.y}px`;
      segment.style.width = `${Math.hypot(dx, dy)}px`;
      segment.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
      this.container.appendChild(segment);
    }

    addMarker(latLng) {
      if (latLng && typeof latLng.x === 'number' && typeof latLng.y === 'number') {
        this.points.push(latLng);
        this.redrawFallback();
        this.triggerChange();
      }
    }

    clearBoundary() {
      this.points = [];
      this.redrawFallback();
      this.triggerChange();
    }

    centerOnAddress(address) {
      if (!address) return;
      this.triggerChange();
      if (window.UI) {
        UI.showNotification(`Map centered on ${address} (placeholder mode).`, 'success');
      }
    }

    drawBoundary(points = []) {
      this.points = Array.isArray(points) ? points : [];
      this.redrawFallback();
      this.triggerChange();
    }

    exportState() {
      return { points: this.points };
    }

    importState(state = {}) {
      this.points = Array.isArray(state.points) ? state.points : [];
      this.redrawFallback();
    }

    triggerChange() {
      if (typeof this.onChange === 'function') {
        this.onChange(this.exportState());
      }
    }
  }

  window.FenceEstimatorTools = window.FenceEstimatorTools || {};
  window.FenceEstimatorTools.mapping = new MappingTool();
})();
