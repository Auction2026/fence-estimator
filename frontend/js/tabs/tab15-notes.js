"use strict";
/**
 * @file Notes and comments tab for internal notes, customer notes, and flagged issues.
 */
(function initNotesTab(window, document) {
  /**
   * Notes tab controller.
   */
  class NotesTab {
    /**
     * @param {string} containerId
     */
    constructor(containerId) {
      this.containerId = containerId;
      this.state = {
        internalNotes: "",
        customerNotes: "",
        flaggedItems: []
      };
    }

    /**
     * @returns {HTMLElement|null}
     */
    getContainer() {
      return document.getElementById(this.containerId);
    }

    /**
     * Render notes UI.
     * @returns {void}
     */
    render() {
      var container = this.getContainer();
      if (!container) {
        return;
      }
      container.innerHTML = [
        '<section class="panel notes-tab">',
        '  <h2>Notes and Comments</h2>',
        '  <label>Internal notes<textarea rows="8" data-field="internalNotes" placeholder="Crew reminders, quoting assumptions, risks"></textarea></label>',
        '  <label>Customer-facing notes<textarea rows="6" data-field="customerNotes" placeholder="Friendly summary shown on estimate"></textarea></label>',
        '  <div class="grid two-column">',
        '    <label>Flagged item title<input type="text" data-role="flag-title" placeholder="Utility conflict"></label>',
        '    <label>Priority<select data-role="flag-priority"><option>High</option><option>Medium</option><option>Low</option></select></label>',
        '  </div>',
        '  <label>Flag details<textarea rows="3" data-role="flag-detail" placeholder="Describe issue, owner, and next step"></textarea></label>',
        '  <div class="note-actions">',
        '    <button type="button" data-action="add-flag">Add Flagged Item</button>',
        '    <button type="button" data-action="load-template">Load Meeting Template</button>',
        '  </div>',
        '  <div class="grid two-column">',
        '    <div data-role="summary"></div>',
        '    <div data-role="flags"></div>',
        '  </div>',
        '</section>'
      ].join("");

      this.renderSummary();
      this.renderFlags();
      this.bindEvents(container);
    }

    /**
     * @param {HTMLElement} container
     * @returns {void}
     */
    bindEvents(container) {
      var self = this;
      container.querySelectorAll("[data-field]").forEach(function (field) {
        field.addEventListener("input", function () {
          self.state[field.dataset.field] = field.value;
          self.renderSummary();
        });
      });
      container.querySelector('[data-action="add-flag"]').addEventListener("click", function () {
        self.addFlag(container);
      });
      container.querySelector('[data-action="load-template"]').addEventListener("click", function () {
        self.state.internalNotes = "Confirm property line markers before digging.\nVerify gate hardware finish matches estimate.\nCall customer 24 hours before crew arrival.";
        self.state.customerNotes = "Installation schedule is weather dependent. Please keep access clear for material delivery and crew staging.";
        container.querySelector('[data-field="internalNotes"]').value = self.state.internalNotes;
        container.querySelector('[data-field="customerNotes"]').value = self.state.customerNotes;
        self.renderSummary();
      });
    }

    /**
     * @param {HTMLElement} container
     * @returns {void}
     */
    addFlag(container) {
      var title = container.querySelector('[data-role="flag-title"]').value.trim();
      var priority = container.querySelector('[data-role="flag-priority"]').value;
      var detail = container.querySelector('[data-role="flag-detail"]').value.trim();
      if (!title) {
        return;
      }
      this.state.flaggedItems.unshift({
        id: "flag-" + Date.now(),
        title: title,
        priority: priority,
        detail: detail,
        createdAt: new Date().toISOString()
      });
      container.querySelector('[data-role="flag-title"]').value = "";
      container.querySelector('[data-role="flag-detail"]').value = "";
      this.renderSummary();
      this.renderFlags();
    }

    /**
     * @returns {void}
     */
    renderSummary() {
      var container = this.getContainer();
      var host = container && container.querySelector('[data-role="summary"]');
      if (!host) {
        return;
      }
      host.innerHTML = [
        '<h3>Notes Summary</h3>',
        '<p><strong>Internal lines:</strong> ' + this.countLines(this.state.internalNotes) + '</p>',
        '<p><strong>Customer lines:</strong> ' + this.countLines(this.state.customerNotes) + '</p>',
        '<p><strong>Flagged items:</strong> ' + this.state.flaggedItems.length + '</p>',
        '<p><strong>High priority:</strong> ' + this.state.flaggedItems.filter(function (item) { return item.priority === "High"; }).length + '</p>'
      ].join("");
    }

    /**
     * @returns {void}
     */
    renderFlags() {
      var container = this.getContainer();
      var host = container && container.querySelector('[data-role="flags"]');
      var self = this;
      if (!host) {
        return;
      }
      if (!this.state.flaggedItems.length) {
        host.innerHTML = '<h3>Flagged Items</h3><p>No flagged issues.</p>';
        return;
      }
      host.innerHTML = '<h3>Flagged Items</h3>' + this.state.flaggedItems.map(function (item) {
        return [
          '<article class="flag-item" data-id="' + item.id + '">',
          '  <h4>' + item.title + '</h4>',
          '  <p><strong>Priority:</strong> ' + item.priority + '</p>',
          '  <p>' + (item.detail || "No detail provided") + '</p>',
          '  <p><small>' + item.createdAt.slice(0, 16).replace("T", " ") + '</small></p>',
          '  <button type="button" data-action="resolve">Resolve</button>',
          '</article>'
        ].join("");
      }).join("");
      host.querySelectorAll('[data-action="resolve"]').forEach(function (button) {
        button.addEventListener("click", function () {
          var id = button.closest(".flag-item").dataset.id;
          self.state.flaggedItems = self.state.flaggedItems.filter(function (item) {
            return item.id !== id;
          });
          self.renderSummary();
          self.renderFlags();
        });
      });
    }

    /**
     * @param {string} text
     * @returns {number}
     */
    countLines(text) {
      return text ? text.split(/\n/).filter(Boolean).length : 0;
    }

    /**
     * @returns {object}
     */
    getData() {
      return JSON.parse(JSON.stringify(this.state));
    }
  }

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.notes = {
    /**
     * @param {string} containerId
     * @returns {NotesTab}
     */
    create: function (containerId) {
      var tab = new NotesTab(containerId);
      tab.render();
      return tab;
    }
  };
})(window, document);
