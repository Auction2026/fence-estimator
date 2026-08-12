"use strict";
/**
 * @file Permit information tab covering authority, fee, timeline, and notes.
 */
(function initPermitsTab(window, document) {
  /**
   * Permit tab controller.
   */
  class PermitsTab {
    /**
     * @param {string} containerId
     */
    constructor(containerId) {
      this.containerId = containerId;
      this.state = {
        permitType: "Fence Permit",
        jurisdiction: "",
        fee: 0,
        submissionDate: "",
        approvalDays: 10,
        inspections: ["Post hole inspection", "Final inspection"],
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
     * Render permit management content.
     * @returns {void}
     */
    render() {
      var container = this.getContainer();
      if (!container) {
        return;
      }

      container.innerHTML = [
        '<section class="panel permits-tab">',
        '  <h2>Permit Information</h2>',
        '  <div class="grid two-column">',
        '    <label>Permit type<select data-field="permitType"><option>Fence Permit</option><option>Zoning Review</option><option>Right-of-Way Permit</option><option>Heritage Approval</option></select></label>',
        '    <label>Jurisdiction<input type="text" data-field="jurisdiction" placeholder="City or township"></label>',
        '    <label>Permit fee<input type="number" min="0" step="0.01" data-field="fee"></label>',
        '    <label>Submission date<input type="date" data-field="submissionDate"></label>',
        '    <label>Approval timeline (days)<input type="number" min="1" step="1" data-field="approvalDays"></label>',
        '    <label>Inspection list<textarea rows="4" data-field="inspections"></textarea></label>',
        '  </div>',
        '  <label>Permit notes<textarea rows="6" data-field="notes" placeholder="Variances, setbacks, HOA details, contacts"></textarea></label>',
        '  <div class="permit-actions">',
        '    <button type="button" data-action="city-standard">Load City Standard</button>',
        '    <button type="button" data-action="county-standard">Load County Standard</button>',
        '  </div>',
        '  <div class="permit-summary" data-role="summary"></div>',
        '</section>'
      ].join("");

      this.populate();
      this.renderSummary();
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
      container.querySelector('[data-field="permitType"]').value = this.state.permitType;
      container.querySelector('[data-field="jurisdiction"]').value = this.state.jurisdiction;
      container.querySelector('[data-field="fee"]').value = this.state.fee;
      container.querySelector('[data-field="submissionDate"]').value = this.state.submissionDate;
      container.querySelector('[data-field="approvalDays"]').value = this.state.approvalDays;
      container.querySelector('[data-field="inspections"]').value = this.state.inspections.join("\n");
      container.querySelector('[data-field="notes"]').value = this.state.notes;
    }

    /**
     * @param {HTMLElement} container
     * @returns {void}
     */
    bindEvents(container) {
      var self = this;
      container.querySelectorAll("[data-field]").forEach(function (field) {
        field.addEventListener("input", function () {
          self.updateState(field.dataset.field, field.value);
        });
      });

      container.querySelector('[data-action="city-standard"]').addEventListener("click", function () {
        self.applyTemplate({
          permitType: "Fence Permit",
          fee: 185,
          approvalDays: 7,
          inspections: ["Layout review", "Final inspection"]
        });
      });

      container.querySelector('[data-action="county-standard"]').addEventListener("click", function () {
        self.applyTemplate({
          permitType: "Zoning Review",
          fee: 320,
          approvalDays: 21,
          inspections: ["Survey verification", "Encroachment final"]
        });
      });
    }

    /**
     * @param {object} template
     * @returns {void}
     */
    applyTemplate(template) {
      this.state.permitType = template.permitType;
      this.state.fee = template.fee;
      this.state.approvalDays = template.approvalDays;
      this.state.inspections = template.inspections.slice();
      this.populate();
      this.renderSummary();
    }

    /**
     * @param {string} field
     * @param {string} value
     * @returns {void}
     */
    updateState(field, value) {
      if (field === "fee" || field === "approvalDays") {
        this.state[field] = Number(value) || 0;
      } else if (field === "inspections") {
        this.state.inspections = value.split(/\n+/).map(function (line) {
          return line.trim();
        }).filter(Boolean);
      } else {
        this.state[field] = value;
      }
      this.renderSummary();
    }

    /**
     * @returns {string}
     */
    getEstimatedApprovalDate() {
      if (!this.state.submissionDate) {
        return "Awaiting submission";
      }
      var date = new Date(this.state.submissionDate + "T12:00:00");
      date.setDate(date.getDate() + this.state.approvalDays);
      return date.toISOString().slice(0, 10);
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
        '<h3>Permit Summary</h3>',
        '<p><strong>Authority:</strong> ' + (this.state.jurisdiction || "Not set") + '</p>',
        '<p><strong>Fee:</strong> $' + this.state.fee.toFixed(2) + '</p>',
        '<p><strong>Estimated approval:</strong> ' + this.getEstimatedApprovalDate() + '</p>',
        '<p><strong>Inspections:</strong> ' + (this.state.inspections.join(", ") || "None listed") + '</p>',
        '<p><strong>Notes:</strong> ' + (this.state.notes || "No notes added") + '</p>'
      ].join("");
    }

    /**
     * @returns {object}
     */
    getData() {
      return JSON.parse(JSON.stringify(this.state));
    }
  }

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.permits = {
    /**
     * @param {string} containerId
     * @returns {PermitsTab}
     */
    create: function (containerId) {
      var tab = new PermitsTab(containerId);
      tab.render();
      return tab;
    }
  };
})(window, document);
