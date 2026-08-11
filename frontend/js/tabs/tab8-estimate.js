// Estimate tab
    'use strict';

    const Tab8 = {
      init() {
        this.root = document.getElementById('estimateDisplay');
        this.bindEvents();
        this.load();
      },
      bindEvents() {
        document.addEventListener('click', (event) => {
          if (event.target.matches('#printEstimateBtn')) this.printEstimate();
          if (event.target.matches('#emailEstimateBtn')) this.emailEstimate();
        });
      },
      normalizeEstimate(estimateData) {
        const estimate = estimateData || Storage.loadEstimate() || AppState.estimate || {};
        const totals = estimate.totals || estimate;
        return Object.assign({
          materials: { items: [], total: 0 },
          labor: { items: [], total: 0 },
          equipment: { items: [], total: 0 },
          concrete: { bags: 0, unitCost: 0, total: 0 },
          totals: {
            materials: totals.materials || 0,
            labor: totals.labor || 0,
            equipment: totals.equipment || 0,
            permits: totals.permits || 0,
            contingency: totals.contingency || 0,
            subtotal: totals.subtotal || 0,
            tax: totals.tax || 0,
            total: totals.total || estimate.total || 0,
            extras: totals.extras || 0
          }
        }, estimate);
      },
      buildMaterialRows(materials) {
        return (materials.items || []).map((item) => `
          <tr>
            <td>${item.item}</td>
            <td>${item.qty}</td>
            <td>${Calculator.formatCurrency(item.unitCost)}</td>
            <td>${Calculator.formatCurrency(item.total)}</td>
          </tr>`).join('') || '<tr><td colspan="4">No material lines calculated yet.</td></tr>';
      },
      buildLaborRows(labor) {
        return (labor.items || []).map((item) => `
          <tr>
            <td>${item.item}</td>
            <td>${item.hours}</td>
            <td>${Calculator.formatCurrency(item.rate)}</td>
            <td>${Calculator.formatCurrency(item.total)}</td>
          </tr>`).join('') || '<tr><td colspan="4">No labor lines calculated yet.</td></tr>';
      },
      buildEquipmentRows(estimate) {
        const permitItem = { item: 'Permits / Fees', qty: 1, unitCost: estimate.totals.permits || 0, total: estimate.totals.permits || 0 };
        const extraItem = { item: 'Extras / Add-ons', qty: 1, unitCost: estimate.totals.extras || 0, total: estimate.totals.extras || 0 };
        const equipmentItems = (estimate.equipment.items || []).slice();
        if ((estimate.concrete || {}).total) {
          equipmentItems.push({ item: 'Concrete', qty: estimate.concrete.bags, unitCost: estimate.concrete.unitCost, total: estimate.concrete.total });
        }
        if (permitItem.total) equipmentItems.push(permitItem);
        if (extraItem.total) equipmentItems.push(extraItem);
        return equipmentItems.map((item) => `
          <tr>
            <td>${item.item}</td>
            <td>${item.qty}</td>
            <td>${Calculator.formatCurrency(item.unitCost)}</td>
            <td>${Calculator.formatCurrency(item.total)}</td>
          </tr>`).join('') || '<tr><td colspan="4">No equipment or fee lines calculated yet.</td></tr>';
      },
      setSummaryValue(id, value) {
        const node = document.getElementById(id);
        if (node) node.textContent = Calculator.formatCurrency(value || 0);
      },
      render(estimateData) {
        const estimate = this.normalizeEstimate(estimateData);
        AppState.estimate = estimate;
        Storage.saveEstimate(estimate);
        if (!this.root) this.root = document.getElementById('estimateDisplay');
        if (!this.root) return;
        this.root.innerHTML = `
          <div class="estimate-summary-grid">
            <div class="summary-card"><span>Materials</span><strong id="estimateSummaryMaterials">${Calculator.formatCurrency(estimate.totals.materials)}</strong></div>
            <div class="summary-card"><span>Labor</span><strong id="estimateSummaryLabor">${Calculator.formatCurrency(estimate.totals.labor)}</strong></div>
            <div class="summary-card"><span>Permits / Fees</span><strong id="estimateSummaryPermits">${Calculator.formatCurrency(estimate.totals.permits)}</strong></div>
            <div class="summary-card"><span>Total</span><strong id="estimateSummaryTotal">${Calculator.formatCurrency(estimate.totals.total)}</strong></div>
          </div>
          <div class="card mt-3"><div class="card-header">Materials Breakdown</div><div class="card-body"><table class="table table-striped" id="estimateMaterialsTable"><thead><tr><th>Item</th><th>Qty</th><th>Unit Cost</th><th>Total</th></tr></thead><tbody>${this.buildMaterialRows(estimate.materials)}</tbody></table></div></div>
          <div class="row mt-3">
            <div class="col col-6"><div class="card"><div class="card-header">Labor Section</div><div class="card-body"><table class="table" id="estimateLaborTable"><thead><tr><th>Description</th><th>Hours</th><th>Rate</th><th>Total</th></tr></thead><tbody>${this.buildLaborRows(estimate.labor)}</tbody></table></div></div></div>
            <div class="col col-6"><div class="card"><div class="card-header">Equipment / Permits / Fees</div><div class="card-body"><table class="table" id="estimateEquipmentTable"><thead><tr><th>Description</th><th>Qty</th><th>Unit Cost</th><th>Total</th></tr></thead><tbody>${this.buildEquipmentRows(estimate)}</tbody></table></div></div></div>
          </div>
          <div class="totals-panel mt-3">
            <div class="totals-row"><span>Contingency (10%)</span><strong id="estimateContingency">${Calculator.formatCurrency(estimate.totals.contingency)}</strong></div>
            <div class="totals-row"><span>Subtotal</span><strong id="estimateSubtotal">${Calculator.formatCurrency(estimate.totals.subtotal)}</strong></div>
            <div class="totals-row"><span>Tax (8%)</span><strong id="estimateTax">${Calculator.formatCurrency(estimate.totals.tax)}</strong></div>
            <div class="totals-row grand-total" style="font-size:1.25rem;font-weight:700;"><span>TOTAL</span><strong id="estimateGrandTotal">${Calculator.formatCurrency(estimate.totals.total)}</strong></div>
          </div>
          <div class="surface mt-3 p-3 rounded-8">
            <div><strong>Equipment Section:</strong> ${Calculator.formatCurrency(estimate.totals.equipment || 0)}</div>
            <div><strong>Permits / Fees:</strong> ${Calculator.formatCurrency(estimate.totals.permits || 0)}</div>
            <div><strong>Extras:</strong> ${Calculator.formatCurrency(estimate.totals.extras || 0)}</div>
          </div>
          <div class="actions-inline mt-3"><button type="button" id="printEstimateBtn" class="btn btn-secondary">Print Estimate</button><button type="button" id="emailEstimateBtn" class="btn btn-primary">Email Estimate</button></div>`;
        this.setSummaryValue('estimateSummaryMaterials', estimate.totals.materials);
        this.setSummaryValue('estimateSummaryLabor', estimate.totals.labor);
        this.setSummaryValue('estimateSummaryPermits', estimate.totals.permits);
        this.setSummaryValue('estimateSummaryTotal', estimate.totals.total);
      },
      async load() {
        const projectId = ((AppState.currentProject || {}).serverId || (AppState.currentProject || {}).id || (AppState.currentProject || {}).projectId || '');
        if (projectId) {
          try {
            const remote = await Api.getEstimate(projectId);
            this.render(remote);
            return remote;
          } catch (_error) {
            const fallback = Storage.loadEstimate() || AppState.estimate || {};
            this.render(fallback);
            return fallback;
          }
        }
        const estimate = Storage.loadEstimate() || AppState.estimate || {};
        this.render(estimate);
        return estimate;
      },
      printEstimate() {
        if (window.PrintTool) PrintTool.printEstimate(AppState.estimate || {});
      },
      emailEstimate() {
        const estimate = this.normalizeEstimate(AppState.estimate);
        const customerEmail = (AppState.currentProject || {}).customerEmail || '';
        const body = `Fence estimate total: ${Calculator.formatCurrency(estimate.totals.total)}

Generated ${formatDate(new Date())}`;
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
          <div class="form-group"><label class="form-label" for="estimateEmailTo">Send To</label><input class="form-control" id="estimateEmailTo" value="${customerEmail}"></div>
          <div class="form-group"><label class="form-label" for="estimateEmailBody">Message</label><textarea class="form-control" id="estimateEmailBody" rows="6">${body}</textarea></div>
          <button type="button" id="sendEstimateEmailBtn" class="btn btn-primary">Open Email Client</button>`;
        UI.showModal('Email Estimate', wrapper);
        const sendButton = wrapper.querySelector('#sendEstimateEmailBtn');
        if (!sendButton) return;
        sendButton.addEventListener('click', () => {
          const to = encodeURIComponent(wrapper.querySelector('#estimateEmailTo').value.trim());
          const message = encodeURIComponent(wrapper.querySelector('#estimateEmailBody').value);
          window.location.href = `mailto:${to}?subject=Fence%20Estimate&body=${message}`;
        });
      },
      save() {
        Storage.saveEstimate(AppState.estimate || {});
        return true;
      },
      validate() {
        return true;
      }
    };

    window.Tab8 = Tab8;
