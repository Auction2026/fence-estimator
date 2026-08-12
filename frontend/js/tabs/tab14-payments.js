"use strict";
/**
 * @file Payment tracking tab for deposit, progress invoices, final payment, and history.
 */
(function initPaymentsTab(window, document) {
  /**
   * @param {number} amount
   * @returns {string}
   */
  function money(amount) {
    return "$" + (Number(amount) || 0).toFixed(2);
  }

  /**
   * Payment tracking controller.
   */
  class PaymentsTab {
    /**
     * @param {string} containerId
     */
    constructor(containerId) {
      this.containerId = containerId;
      this.state = {
        contractTotal: 0,
        deposit: 0,
        progress: [
          { label: "Progress 1", amount: 0, received: false },
          { label: "Progress 2", amount: 0, received: false }
        ],
        finalPayment: 0,
        history: []
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
        <section class="panel payments-tab">
          <h2>Payment Tracking</h2>
          <div class="grid two-column">
            <label>Contract total<input type="number" min="0" step="0.01" data-field="contractTotal"></label>
            <label>Deposit<input type="number" min="0" step="0.01" data-field="deposit"></label>
            <label>Final payment<input type="number" min="0" step="0.01" data-field="finalPayment"></label>
            <button type="button" data-action="split">Auto Split Balance</button>
          </div>
          <div data-role="progress"></div>
          <div class="payment-actions">
            <button type="button" data-action="record-deposit">Record Deposit</button>
            <button type="button" data-action="record-final">Record Final</button>
          </div>
          <div class="grid two-column">
            <div data-role="summary"></div>
            <div data-role="history"></div>
          </div>
        </section>`;
      this.renderProgress();
      this.fill();
      this.bind();
      this.paint();
    }

    /**
     * @returns {void}
     */
    renderProgress() {
      this.root.querySelector('[data-role="progress"]').innerHTML = this.state.progress.map(function (payment, index) {
        return '<label>' + payment.label + '<input type="number" min="0" step="0.01" data-progress="' + index + '"></label><label><input type="checkbox" data-received="' + index + '"> Received</label>';
      }).join("");
    }

    /**
     * @returns {void}
     */
    fill() {
      var root = this.root;
      root.querySelector('[data-field="contractTotal"]').value = this.state.contractTotal;
      root.querySelector('[data-field="deposit"]').value = this.state.deposit;
      root.querySelector('[data-field="finalPayment"]').value = this.state.finalPayment;
      this.state.progress.forEach(function (payment, index) {
        root.querySelector('[data-progress="' + index + '"]').value = payment.amount;
        root.querySelector('[data-received="' + index + '"]').checked = payment.received;
      });
    }

    /**
     * @returns {void}
     */
    bind() {
      var self = this;
      this.root.querySelectorAll("[data-field]").forEach(function (field) {
        field.addEventListener("input", function () {
          self.state[field.dataset.field] = Number(field.value) || 0;
          self.paint();
        });
      });
      this.root.querySelectorAll("[data-progress]").forEach(function (field) {
        field.addEventListener("input", function () {
          self.state.progress[Number(field.dataset.progress)].amount = Number(field.value) || 0;
          self.paint();
        });
      });
      this.root.querySelectorAll("[data-received]").forEach(function (field) {
        field.addEventListener("change", function () {
          self.state.progress[Number(field.dataset.received)].received = field.checked;
          self.paint();
        });
      });
      this.root.querySelector('[data-action="split"]').addEventListener("click", function () {
        self.autoSplit();
      });
      this.root.querySelector('[data-action="record-deposit"]').addEventListener("click", function () {
        self.record("Deposit", self.state.deposit);
      });
      this.root.querySelector('[data-action="record-final"]').addEventListener("click", function () {
        self.record("Final Payment", self.state.finalPayment);
      });
    }

    /**
     * @returns {void}
     */
    autoSplit() {
      var remaining = Math.max(this.state.contractTotal - this.state.deposit - this.state.finalPayment, 0);
      var each = Number((remaining / this.state.progress.length).toFixed(2));
      this.state.progress.forEach(function (payment) { payment.amount = each; });
      this.fill();
      this.paint();
    }

    /**
     * @param {string} label
     * @param {number} amount
     * @returns {void}
     */
    record(label, amount) {
      if (!amount) {
        return;
      }
      this.state.history.unshift({ label: label, amount: amount, date: new Date().toISOString() });
      this.paint();
    }

    /**
     * @returns {number}
     */
    receivedTotal() {
      return this.state.history.reduce(function (sum, row) { return sum + row.amount; }, 0) + this.state.progress.reduce(function (sum, row) {
        return sum + (row.received ? row.amount : 0);
      }, 0);
    }

    /**
     * @returns {void}
     */
    paint() {
      var received = this.receivedTotal();
      this.root.querySelector('[data-role="summary"]').innerHTML = `
        <h3>Payment Summary</h3>
        <p><strong>Contract total:</strong> ${money(this.state.contractTotal)}</p>
        <p><strong>Received:</strong> ${money(received)}</p>
        <p><strong>Outstanding:</strong> ${money(this.state.contractTotal - received)}</p>
        <ul>${this.state.progress.map(function (row) { return "<li>" + row.label + ": " + money(row.amount) + " (" + (row.received ? "received" : "pending") + ")</li>"; }).join("")}</ul>`;
      this.root.querySelector('[data-role="history"]').innerHTML = "<h3>Payment History</h3>" + (this.state.history.length ? "<ol>" + this.state.history.map(function (row) {
        return "<li>" + row.label + " — " + money(row.amount) + " — " + row.date.slice(0, 10) + "</li>";
      }).join("") + "</ol>" : "<p>No payments recorded.</p>");
    }

    /**
     * @returns {object}
     */
    getData() {
      return JSON.parse(JSON.stringify(this.state));
    }
  }

  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.payments = {
    /**
     * @param {string} containerId
     * @returns {PaymentsTab}
     */
    create: function (containerId) {
      var tab = new PaymentsTab(containerId);
      tab.render();
      return tab;
    }
  };
})(window, document);
