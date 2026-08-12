"use strict";
/**
 * @file Contract generation tab with terms, signatures, payment schedule, and preview.
 */
(function initContractTab(window, document) {
  /**
   * @param {number} amount
   * @returns {string}
   */
  function money(amount) {
    return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(Number(amount) || 0);
  }

  /**
   * Contract tab controller.
   */
  class ContractTab {
    /**
     * @param {string} containerId
     */
    constructor(containerId) {
      this.containerId = containerId;
      this.state = {
        title: "Fence Installation Agreement",
        total: 0,
        paymentType: "progress",
        terms: [
          "Work follows local code and accepted fence industry practice.",
          "Scope changes require a written and signed change order.",
          "Customer provides property access and utility locate clearance."
        ],
        schedule: [
          { label: "Deposit", percent: 30 },
          { label: "Materials", percent: 40 },
          { label: "Completion", percent: 30 }
        ],
        estimator: "",
        customer: "",
        signedDate: ""
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
        <section class="panel contract-tab">
          <h2>Contract Generation</h2>
          <div class="grid two-column">
            <label>Contract title<input type="text" data-field="title"></label>
            <label>Total amount<input type="number" min="0" step="0.01" data-field="total"></label>
            <label>Payment schedule<select data-field="paymentType"><option value="progress">Progress</option><option value="milestone">Milestone</option><option value="two-part">Two part</option></select></label>
            <label>Signed date<input type="date" data-field="signedDate"></label>
          </div>
          <label>Terms<textarea rows="6" data-field="terms"></textarea></label>
          <div class="grid two-column">
            <label>Estimator signature<input type="text" data-field="estimator"></label>
            <label>Customer signature<input type="text" data-field="customer"></label>
          </div>
          <div class="contract-actions">
            <button type="button" data-action="standardize">Standard Terms</button>
            <button type="button" data-action="rebalance">Rebalance Percentages</button>
          </div>
          <div class="grid two-column">
            <div data-role="schedule"></div>
            <div data-role="preview"></div>
          </div>
        </section>`;
      this.fill();
      this.bind();
      this.paint();
    }

    /**
     * @returns {void}
     */
    fill() {
      var root = this.root;
      root.querySelector('[data-field="title"]').value = this.state.title;
      root.querySelector('[data-field="total"]').value = this.state.total;
      root.querySelector('[data-field="paymentType"]').value = this.state.paymentType;
      root.querySelector('[data-field="signedDate"]').value = this.state.signedDate;
      root.querySelector('[data-field="terms"]').value = this.state.terms.join("\n");
      root.querySelector('[data-field="estimator"]').value = this.state.estimator;
      root.querySelector('[data-field="customer"]').value = this.state.customer;
    }

    /**
     * @returns {void}
     */
    bind() {
      var self = this;
      this.root.querySelectorAll("[data-field]").forEach(function (field) {
        field.addEventListener("input", function () {
          var key = field.dataset.field;
          self.state[key] = key === "total" ? Number(field.value) || 0 : field.value;
          if (key === "terms") {
            self.state.terms = field.value.split(/\n+/).map(function (line) { return line.trim(); }).filter(Boolean);
          }
          self.paint();
        });
      });
      this.root.querySelector('[data-action="standardize"]').addEventListener("click", function () {
        self.state.terms = [
          "Weather, permitting, and supplier delays may extend completion timing.",
          "Final payment is due upon substantial completion unless noted otherwise.",
          "Customer approvals for layout and gate swing are required before install."
        ];
        self.root.querySelector('[data-field="terms"]').value = self.state.terms.join("\n");
        self.paint();
      });
      this.root.querySelector('[data-action="rebalance"]').addEventListener("click", function () {
        self.rebalance();
      });
    }

    /**
     * @returns {void}
     */
    rebalance() {
      var total = this.state.schedule.reduce(function (sum, row) { return sum + row.percent; }, 0) || 100;
      var used = 0;
      this.state.schedule = this.state.schedule.map(function (row, index, list) {
        if (index === list.length - 1) {
          return { label: row.label, percent: 100 - used };
        }
        var percent = Math.round((row.percent / total) * 100);
        used += percent;
        return { label: row.label, percent: percent };
      });
      this.paint();
    }

    /**
     * @returns {void}
     */
    paint() {
      this.renderSchedule();
      this.renderPreview();
    }

    /**
     * @returns {void}
     */
    renderSchedule() {
      var host = this.root.querySelector('[data-role="schedule"]');
      host.innerHTML = "<h3>Payment Schedule</h3><ol>" + this.state.schedule.map(function (row) {
        return "<li><strong>" + row.label + "</strong> — " + row.percent + "% — " + money((row.percent / 100) * this.state.total) + "</li>";
      }, this).join("") + "</ol>";
    }

    /**
     * @returns {void}
     */
    renderPreview() {
      this.root.querySelector('[data-role="preview"]').innerHTML = `
        <h3>Contract Preview</h3>
        <p><strong>${this.state.title}</strong></p>
        <p>Total: ${money(this.state.total)}</p>
        <p>Schedule: ${this.state.paymentType}</p>
        <ol>${this.state.terms.map(function (term) { return "<li>" + term + "</li>"; }).join("")}</ol>
        <p>Estimator: ${this.state.estimator || "Pending"}</p>
        <p>Customer: ${this.state.customer || "Pending"}</p>
        <p>Signed: ${this.state.signedDate || "Not signed"}</p>`;
    }

    /**
     * @returns {object}
     */
    getData() {
      return JSON.parse(JSON.stringify(this.state));
    }
  }

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.contract = {
    /**
     * @param {string} containerId
     * @returns {ContractTab}
     */
    create: function (containerId) {
      var tab = new ContractTab(containerId);
      tab.render();
      return tab;
    }
  };
})(window, document);
