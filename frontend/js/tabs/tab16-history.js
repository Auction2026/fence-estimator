"use strict";
/**
 * @file Project history tab for revisions, author attribution, and timestamps.
 */
(function initHistoryTab(window, document) {
  /**
   * History tab controller.
   */
  class HistoryTab {
    /**
     * @param {string} containerId
     */
    constructor(containerId) {
      this.containerId = containerId;
      this.state = {
        filter: "all",
        entries: [
          { action: "Estimate created", user: "System", time: "2026-01-10T09:00:00Z", details: "Initial record opened." },
          { action: "Measurements updated", user: "Estimator", time: "2026-01-10T11:30:00Z", details: "Linear footage revised to match site walk." },
          { action: "Customer notes revised", user: "Coordinator", time: "2026-01-10T14:15:00Z", details: "Added HOA reminder." }
        ]
      };
    }

    /**
     * @returns {HTMLElement|null}
     */
    getContainer() {
      return document.getElementById(this.containerId);
    }

    /**
     * Render project history tab.
     * @returns {void}
     */
    render() {
      var container = this.getContainer();
      if (!container) {
        return;
      }
      container.innerHTML = [
        '<section class="panel history-tab">',
        '  <h2>Project History</h2>',
        '  <div class="grid two-column">',
        '    <label>Filter<select data-field="filter"><option value="all">All changes</option><option value="System">System</option><option value="Estimator">Estimator</option><option value="Coordinator">Coordinator</option></select></label>',
        '    <button type="button" data-action="add-snapshot">Add Snapshot Entry</button>',
        '  </div>',
        '  <div class="grid two-column">',
        '    <div data-role="summary"></div>',
        '    <div data-role="timeline"></div>',
        '  </div>',
        '</section>'
      ].join("");

      this.renderSummary();
      this.renderTimeline();
      this.bindEvents(container);
    }

    /**
     * @param {HTMLElement} container
     * @returns {void}
     */
    bindEvents(container) {
      var self = this;
      container.querySelector('[data-field="filter"]').addEventListener("input", function (event) {
        self.state.filter = event.target.value;
        self.renderSummary();
        self.renderTimeline();
      });
      container.querySelector('[data-action="add-snapshot"]').addEventListener("click", function () {
        self.state.entries.unshift({
          action: "Manual snapshot saved",
          user: "Estimator",
          time: new Date().toISOString(),
          details: "Current estimate values captured for review."
        });
        self.renderSummary();
        self.renderTimeline();
      });
    }

    /**
     * @returns {Array<object>}
     */
    getVisibleEntries() {
      if (this.state.filter === "all") {
        return this.state.entries.slice();
      }
      return this.state.entries.filter(function (entry) {
        return entry.user === this.state.filter;
      }, this);
    }

    /**
     * @returns {void}
     */
    renderSummary() {
      var container = this.getContainer();
      var host = container && container.querySelector('[data-role="summary"]');
      var entries = this.getVisibleEntries();
      if (!host) {
        return;
      }
      host.innerHTML = [
        '<h3>Revision Summary</h3>',
        '<p><strong>Visible entries:</strong> ' + entries.length + '</p>',
        '<p><strong>Most recent change:</strong> ' + (entries[0] ? entries[0].action : "None") + '</p>',
        '<p><strong>Contributors:</strong> ' + this.getContributorList(entries).join(", ") + '</p>'
      ].join("");
    }

    /**
     * @returns {void}
     */
    renderTimeline() {
      var container = this.getContainer();
      var host = container && container.querySelector('[data-role="timeline"]');
      var self = this;
      if (!host) {
        return;
      }
      var entries = this.getVisibleEntries();
      if (!entries.length) {
        host.innerHTML = '<h3>Timeline</h3><p>No entries match the selected filter.</p>';
        return;
      }
      host.innerHTML = '<h3>Timeline</h3><ol>' + entries.map(function (entry, index) {
        return [
          '<li class="history-entry" data-index="' + index + '">',
          '  <strong>' + entry.action + '</strong>',
          '  <p>' + entry.details + '</p>',
          '  <p><small>' + entry.user + ' · ' + self.formatTime(entry.time) + '</small></p>',
          '</li>'
        ].join("");
      }).join("") + '</ol>';
    }

    /**
     * @param {Array<object>} entries
     * @returns {Array<string>}
     */
    getContributorList(entries) {
      var seen = {};
      return entries.reduce(function (list, entry) {
        if (!seen[entry.user]) {
          seen[entry.user] = true;
          list.push(entry.user);
        }
        return list;
      }, []);
    }

    /**
     * @param {string} value
     * @returns {string}
     */
    formatTime(value) {
      return value.replace("T", " ").slice(0, 16);
    }

    /**
     * @returns {object}
     */
    getData() {
      return JSON.parse(JSON.stringify(this.state));
    }
  }

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.history = {
    /**
     * @param {string} containerId
     * @returns {HistoryTab}
     */
    create: function (containerId) {
      var tab = new HistoryTab(containerId);
      tab.render();
      return tab;
    }
  };
})(window, document);
