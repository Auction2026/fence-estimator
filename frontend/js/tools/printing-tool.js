"use strict";
/**
 * @file Print and PDF formatting tool for fence estimate summaries.
 */
(function initPrintingTool(window, document) {
  /**
   * Print formatting helper.
   */
  class PrintingTool {
    /**
     * @param {object} [options]
     */
    constructor(options) {
      this.options = Object.assign({
        title: "Fence Estimate",
        companyName: "Fence Depot",
        footerText: "Prepared by Fence Depot Estimator",
        locale: "en-US",
        currency: "USD"
      }, options || {});
    }

    /**
     * @param {object} estimate
     * @returns {string}
     */
    buildMarkup(estimate) {
      var sections = [
        this.renderHeader(estimate),
        this.renderCustomerSection(estimate.customer || {}),
        this.renderScopeSection(estimate.scope || {}),
        this.renderPricingSection(estimate.pricing || {}),
        this.renderTermsSection(estimate.terms || []),
        this.renderFooter()
      ];
      return [
        '<!doctype html>',
        '<html lang="en">',
        '<head>',
        '  <meta charset="utf-8">',
        '  <title>' + this.options.title + '</title>',
        '  <style>' + this.buildStyles() + '</style>',
        '</head>',
        '<body>',
        sections.join(""),
        '</body>',
        '</html>'
      ].join("");
    }

    /**
     * @param {object} estimate
     * @returns {string}
     */
    renderHeader(estimate) {
      return [
        '<header class="print-header">',
        '  <h1>' + this.escape(this.options.companyName) + '</h1>',
        '  <div>',
        '    <p><strong>' + this.escape(this.options.title) + '</strong></p>',
        '    <p>Estimate #: ' + this.escape(estimate.number || "Draft") + '</p>',
        '    <p>Date: ' + this.escape(estimate.date || new Date().toISOString().slice(0, 10)) + '</p>',
        '  </div>',
        '</header>'
      ].join("");
    }

    /**
     * @param {object} customer
     * @returns {string}
     */
    renderCustomerSection(customer) {
      return [
        '<section>',
        '  <h2>Customer Information</h2>',
        '  <p>' + this.escape(customer.name || "Unnamed customer") + '</p>',
        '  <p>' + this.escape(customer.address || "Address pending") + '</p>',
        '  <p>' + this.escape(customer.email || "") + ' ' + this.escape(customer.phone || "") + '</p>',
        '</section>'
      ].join("");
    }

    /**
     * @param {object} scope
     * @returns {string}
     */
    renderScopeSection(scope) {
      var items = scope.items || [];
      return [
        '<section>',
        '  <h2>Scope of Work</h2>',
        '  <p>Fence type: ' + this.escape(scope.fenceType || "Not specified") + '</p>',
        '  <p>Height: ' + this.escape(scope.height || "Not specified") + '</p>',
        '  <ul>' + items.map(this.renderListItem, this).join("") + '</ul>',
        '</section>'
      ].join("");
    }

    /**
     * @param {object} pricing
     * @returns {string}
     */
    renderPricingSection(pricing) {
      var rows = [
        { label: "Materials", amount: pricing.materials },
        { label: "Labor", amount: pricing.labor },
        { label: "Equipment", amount: pricing.equipment },
        { label: "Permits", amount: pricing.permits },
        { label: "Tax", amount: pricing.tax },
        { label: "Total", amount: pricing.total, isTotal: true }
      ];
      return [
        '<section>',
        '  <h2>Pricing</h2>',
        '  <table>',
        '    <tbody>' + rows.map(function (row) {
          return '<tr class="' + (row.isTotal ? 'total-row' : '') + '"><th>' + row.label + '</th><td>' + this.formatMoney(row.amount, pricing) + '</td></tr>';
        }, this).join("") + '</tbody>',
        '  </table>',
        '</section>'
      ].join("");
    }

    /**
     * @param {Array<string>} terms
     * @returns {string}
     */
    renderTermsSection(terms) {
      return [
        '<section>',
        '  <h2>Terms</h2>',
        '  <ol>' + terms.map(this.renderListItem, this).join("") + '</ol>',
        '</section>'
      ].join("");
    }

    /**
     * @returns {string}
     */
    renderFooter() {
      return [
        '<footer class="print-footer">',
        '  <p>' + this.escape(this.options.footerText) + '</p>',
        '  <p>Thank you for the opportunity to quote your fence project.</p>',
        '</footer>'
      ].join("");
    }

    /**
     * @param {string} item
     * @returns {string}
     */
    renderListItem(item) {
      return '<li>' + this.escape(item || "") + '</li>';
    }

    /**
     * @returns {string}
     */
    buildStyles() {
      return [
        'body{font-family:Arial,sans-serif;color:#1f2937;margin:32px;}',
        'h1,h2{margin:0 0 12px;}',
        '.print-header,.print-footer{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;}',
        'section{margin-bottom:20px;page-break-inside:avoid;}',
        'table{width:100%;border-collapse:collapse;}',
        'th,td{padding:8px 10px;border-bottom:1px solid #d1d5db;text-align:left;}',
        '.total-row th,.total-row td{font-weight:700;font-size:1.05em;}',
        '@media print{body{margin:16px;}button{display:none;}}'
      ].join("");
    }

    /**
     * Open a print window.
     * @param {object} estimate
     * @returns {Window|null}
     */
    printEstimate(estimate) {
      var markup = this.buildMarkup(estimate);
      var printWindow = window.open("", "_blank", "width=1024,height=768");
      if (!printWindow) {
        return null;
      }
      printWindow.document.open();
      printWindow.document.write(markup);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      return printWindow;
    }

    /**
     * Attach print button behavior.
     * @param {string} buttonId
     * @param {function():object} estimateProvider
     * @returns {void}
     */
    bindPrintButton(buttonId, estimateProvider) {
      var button = document.getElementById(buttonId);
      var self = this;
      if (!button) {
        return;
      }
      button.addEventListener("click", function () {
        self.printEstimate(estimateProvider());
      });
    }

    /**
     * @param {string} value
     * @returns {string}
     */
    escape(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    /**
     * @param {number} amount
     * @param {object} [pricing]
     * @returns {string}
     */
    formatMoney(amount, pricing) {
      return new Intl.NumberFormat(pricing && pricing.locale || this.options.locale, {
        style: "currency",
        currency: pricing && pricing.currency || this.options.currency
      }).format(Number(amount) || 0);
    }

    /**
     * @param {number} amount
     * @returns {string}
     */
    static formatMoney(amount) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(amount) || 0);
    }
  }

  window.FenceEstimatorTools = window.FenceEstimatorTools || {};
  window.FenceEstimatorTools.printing = {
    PrintingTool: PrintingTool
  };
})(window, document);
