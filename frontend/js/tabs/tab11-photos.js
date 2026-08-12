"use strict";
/**
 * @file Photo documentation tab with uploads, labels, captions, and estimate attachment flags.
 */
(function initPhotosTab(window, document) {
  /**
   * @param {number} size
   * @returns {string}
   */
  function formatSize(size) {
    return ((Number(size) || 0) / 1024).toFixed(1) + " KB";
  }

  /**
   * Photos tab controller.
   */
  class PhotosTab {
    /**
     * @param {string} containerId
     */
    constructor(containerId) {
      this.containerId = containerId;
      this.photos = [];
      this.labels = ["Front elevation", "Property line", "Gate area", "Utilities", "Access route", "Damage"];
    }

    /**
     * @returns {HTMLElement|null}
     */
    get root() {
      return document.getElementById(this.containerId);
    }

    /**
     * @returns {void}
     */
    render() {
      if (!this.root) {
        return;
      }
      this.root.innerHTML = `
        <section class="panel photos-tab">
          <h2>Photo Documentation</h2>
          <div class="grid two-column">
            <label>Upload site photos<input type="file" data-role="upload" accept="image/*" multiple></label>
            <label>Default label<select data-role="default-label"></select></label>
          </div>
          <div class="photo-actions">
            <button type="button" data-action="attach-all">Attach All</button>
            <button type="button" data-action="clear">Clear</button>
          </div>
          <div class="grid two-column">
            <div data-role="summary"></div>
            <div data-role="list"></div>
          </div>
        </section>`;
      this.root.querySelector('[data-role="default-label"]').innerHTML = this.labels.map(function (label) {
        return '<option value="' + label + '">' + label + '</option>';
      }).join("");
      this.bind();
      this.paint();
    }

    /**
     * @returns {void}
     */
    bind() {
      var self = this;
      this.root.querySelector('[data-role="upload"]').addEventListener("change", function (event) {
        self.addFiles(event.target.files, self.root.querySelector('[data-role="default-label"]').value);
        event.target.value = "";
      });
      this.root.querySelector('[data-action="attach-all"]').addEventListener("click", function () {
        self.photos.forEach(function (photo) { photo.attached = true; });
        self.paint();
      });
      this.root.querySelector('[data-action="clear"]').addEventListener("click", function () {
        self.photos = [];
        self.paint();
      });
    }

    /**
     * @param {FileList|Array<File>} files
     * @param {string} label
     * @returns {void}
     */
    addFiles(files, label) {
      var self = this;
      Array.prototype.forEach.call(files || [], function (file) {
        self.photos.unshift({
          id: "photo-" + Date.now() + "-" + self.photos.length,
          name: file.name,
          size: file.size,
          label: label,
          caption: "",
          attached: false,
          previewUrl: window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(file) : ""
        });
      });
      this.paint();
    }

    /**
     * @returns {void}
     */
    paint() {
      this.renderSummary();
      this.renderList();
    }

    /**
     * @returns {void}
     */
    renderSummary() {
      var attached = this.photos.filter(function (photo) { return photo.attached; }).length;
      this.root.querySelector('[data-role="summary"]').innerHTML = `
        <h3>Photo Summary</h3>
        <p><strong>Total:</strong> ${this.photos.length}</p>
        <p><strong>Attached:</strong> ${attached}</p>
        <p><strong>Pending:</strong> ${this.photos.length - attached}</p>`;
    }

    /**
     * @returns {void}
     */
    renderList() {
      var self = this;
      var host = this.root.querySelector('[data-role="list"]');
      if (!this.photos.length) {
        host.innerHTML = "<h3>Photos</h3><p>No photos uploaded yet.</p>";
        return;
      }
      host.innerHTML = "<h3>Photos</h3>" + this.photos.map(function (photo) {
        var preview = photo.previewUrl ? '<img src="' + photo.previewUrl + '" alt="' + photo.name + '">' : '<div class="placeholder">Image</div>';
        return `
          <article class="photo-card" data-id="${photo.id}">
            <div class="photo-thumb">${preview}</div>
            <div class="photo-meta">
              <h4>${photo.name}</h4>
              <p>${formatSize(photo.size)}</p>
              <label>Label<input type="text" data-field="label" value="${photo.label}"></label>
              <label>Caption<textarea rows="2" data-field="caption">${photo.caption}</textarea></label>
              <label><input type="checkbox" data-field="attached" ${photo.attached ? "checked" : ""}> Attach to estimate</label>
              <button type="button" data-action="remove">Remove</button>
            </div>
          </article>`;
      }).join("");
      host.querySelectorAll(".photo-card").forEach(function (card) {
        self.bindCard(card);
      });
    }

    /**
     * @param {HTMLElement} card
     * @returns {void}
     */
    bindCard(card) {
      var self = this;
      var id = card.dataset.id;
      card.querySelectorAll("[data-field]").forEach(function (field) {
        field.addEventListener(field.type === "checkbox" ? "change" : "input", function () {
          var photo = self.photos.find(function (item) { return item.id === id; });
          if (!photo) {
            return;
          }
          photo[field.dataset.field] = field.type === "checkbox" ? field.checked : field.value;
          self.renderSummary();
        });
      });
      card.querySelector('[data-action="remove"]').addEventListener("click", function () {
        self.photos = self.photos.filter(function (item) { return item.id !== id; });
        self.paint();
      });
    }

    /**
     * @returns {Array<object>}
     */
    getData() {
      return this.photos.map(function (photo) { return Object.assign({}, photo); });
    }
  }

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.photos = {
    /**
     * @param {string} containerId
     * @returns {PhotosTab}
     */
    create: function (containerId) {
      var tab = new PhotosTab(containerId);
      tab.render();
      return tab;
    }
  };
})(window, document);
