"use strict";
/**
 * @file Scheduling tab for start dates, crew assignment, milestones, and calendar summary.
 */
(function initSchedulingTab(window, document) {
  /**
   * @param {string} value
   * @returns {string}
   */
  function showDate(value) {
    return value || "Not scheduled";
  }

  /**
   * Scheduling tab controller.
   */
  class SchedulingTab {
    /**
     * @param {string} containerId
     */
    constructor(containerId) {
      this.containerId = containerId;
      this.crews = ["Crew A", "Crew B", "Crew C", "Subcontractor Team"];
      this.state = {
        startDate: "",
        crew: this.crews[0],
        milestones: [
          { label: "Layout confirmation", date: "" },
          { label: "Material delivery", date: "" },
          { label: "Installation complete", date: "" }
        ]
      };
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
        <section class="panel scheduling-tab">
          <h2>Job Scheduling</h2>
          <div class="grid two-column">
            <label>Projected start date<input type="date" data-field="startDate"></label>
            <label>Crew assignment<select data-field="crew"></select></label>
          </div>
          <div data-role="milestones"></div>
          <div class="schedule-actions">
            <button type="button" data-action="auto-plan">Auto Plan</button>
            <button type="button" data-action="shift-week">Shift 1 Week</button>
          </div>
          <div class="grid two-column">
            <div data-role="summary"></div>
            <div data-role="calendar"></div>
          </div>
        </section>`;
      this.root.querySelector('[data-field="crew"]').innerHTML = this.crews.map(function (crew) {
        return '<option value="' + crew + '">' + crew + '</option>';
      }).join("");
      this.renderMilestones();
      this.fill();
      this.bind();
      this.paint();
    }

    /**
     * @returns {void}
     */
    renderMilestones() {
      this.root.querySelector('[data-role="milestones"]').innerHTML = this.state.milestones.map(function (item, index) {
        return '<label>' + item.label + '<input type="date" data-milestone="' + index + '"></label>';
      }).join("");
    }

    /**
     * @returns {void}
     */
    fill() {
      var root = this.root;
      root.querySelector('[data-field="startDate"]').value = this.state.startDate;
      root.querySelector('[data-field="crew"]').value = this.state.crew;
      this.state.milestones.forEach(function (item, index) {
        var input = root.querySelector('[data-milestone="' + index + '"]');
        if (input) {
          input.value = item.date;
        }
      });
    }

    /**
     * @returns {void}
     */
    bind() {
      var self = this;
      this.root.querySelector('[data-field="startDate"]').addEventListener("input", function (event) {
        self.state.startDate = event.target.value;
        self.paint();
      });
      this.root.querySelector('[data-field="crew"]').addEventListener("input", function (event) {
        self.state.crew = event.target.value;
        self.paint();
      });
      this.root.querySelectorAll("[data-milestone]").forEach(function (input) {
        input.addEventListener("input", function () {
          self.state.milestones[Number(input.dataset.milestone)].date = input.value;
          self.paint();
        });
      });
      this.root.querySelector('[data-action="auto-plan"]').addEventListener("click", function () {
        self.autoPlan();
      });
      this.root.querySelector('[data-action="shift-week"]').addEventListener("click", function () {
        self.shift(7);
      });
    }

    /**
     * @returns {void}
     */
    autoPlan() {
      var base = new Date((this.state.startDate || new Date().toISOString().slice(0, 10)) + "T12:00:00");
      this.state.startDate = base.toISOString().slice(0, 10);
      this.state.milestones.forEach(function (item, index) {
        var date = new Date(base);
        date.setDate(base.getDate() + (index * 3) + 1);
        item.date = date.toISOString().slice(0, 10);
      });
      this.fill();
      this.paint();
    }

    /**
     * @param {number} days
     * @returns {void}
     */
    shift(days) {
      var adjust = function (value) {
        if (!value) {
          return value;
        }
        var date = new Date(value + "T12:00:00");
        date.setDate(date.getDate() + days);
        return date.toISOString().slice(0, 10);
      };
      this.state.startDate = adjust(this.state.startDate);
      this.state.milestones.forEach(function (item) { item.date = adjust(item.date); });
      this.fill();
      this.paint();
    }

    /**
     * @returns {void}
     */
    paint() {
      this.root.querySelector('[data-role="summary"]').innerHTML = `
        <h3>Schedule Summary</h3>
        <p><strong>Start:</strong> ${showDate(this.state.startDate)}</p>
        <p><strong>Crew:</strong> ${this.state.crew}</p>
        <ul>${this.state.milestones.map(function (item) { return "<li>" + item.label + ": " + showDate(item.date) + "</li>"; }).join("")}</ul>`;
      this.root.querySelector('[data-role="calendar"]').innerHTML = "<h3>Calendar View</h3><ol>" + [{ label: "Start date", date: this.state.startDate }].concat(this.state.milestones).map(function (item) {
        return "<li><strong>" + item.label + "</strong> — " + showDate(item.date) + "</li>";
      }).join("") + "</ol>";
    }

    /**
     * @returns {object}
     */
    getData() {
      return JSON.parse(JSON.stringify(this.state));
    }
  }

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.scheduling = {
    /**
     * @param {string} containerId
     * @returns {SchedulingTab}
     */
    create: function (containerId) {
      var tab = new SchedulingTab(containerId);
      tab.render();
      return tab;
    }
  };
})(window, document);
