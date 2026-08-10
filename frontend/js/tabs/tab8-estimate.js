import { formatCurrency } from '../utils.js';

export default {
  id: 'estimate',
  title: '8. Estimate',
  render(state) {
    const values = state.tabs.estimate || {};
    const estimate = state.estimate || {};
    return `
      <section class="card">
        <h2>8. Estimate</h2>
        <p class="helper">Server-backed calculation engine for labour, material, concrete, hardware, and margin totals.</p>
        <form data-tab-form="estimate" class="grid">
          <label>Fence Type
            <select name="fenceType">
              ${['chain-link','wood','vinyl','ornamental','composite'].map(type => `<option value="${type}" ${values.fenceType === type ? 'selected' : ''}>${type}</option>`).join('')}
            </select>
          </label>
          <label>Linear Feet<input type="number" name="linearFeet" value="${values.linearFeet ?? 120}"></label>
          <label>Height (ft)<input type="number" name="heightFeet" value="${values.heightFeet ?? 6}"></label>
          <label>Gates<input type="number" name="gates" value="${values.gates ?? 1}"></label>
          <label>Tear-out Feet<input type="number" name="tearOutFeet" value="${values.tearOutFeet ?? 0}"></label>
          <label>Labour Rate<input type="number" name="labourRate" value="${values.labourRate ?? 78}"></label>
          <label>Overhead Rate<input type="number" step="0.01" name="overheadRate" value="${values.overheadRate ?? 0.12}"></label>
          <label>Profit Rate<input type="number" step="0.01" name="profitRate" value="${values.profitRate ?? 0.18}"></label>
        </form>
      </section>
      <section class="card">
        <h3>Calculated Summary</h3>
        <div class="summary-grid">
          <div><span>Material</span><strong>${formatCurrency(estimate.materialCost)}</strong></div>
          <div><span>Hardware</span><strong>${formatCurrency(estimate.hardwareCost)}</strong></div>
          <div><span>Concrete</span><strong>${formatCurrency(estimate.concreteCost)}</strong></div>
          <div><span>Labour</span><strong>${formatCurrency(estimate.labourCost)}</strong></div>
          <div><span>Overhead</span><strong>${formatCurrency(estimate.overhead)}</strong></div>
          <div><span>Profit</span><strong>${formatCurrency(estimate.profit)}</strong></div>
          <div><span>Total</span><strong>${formatCurrency(estimate.total)}</strong></div>
          <div><span>Posts / Bags</span><strong>${estimate.posts || 0} / ${estimate.concreteBags || 0}</strong></div>
        </div>
        <div class="inline-actions">
          <button type="button" class="primary-btn" id="save-estimate-record">Save Estimate Record</button>
        </div>
      </section>
    `;
  },
  bind({ panel, onSave, onCalculate, state, projectId, api }) {
    const form = panel.querySelector('[data-tab-form="estimate"]');
    const saveButton = panel.querySelector('#save-estimate-record');
    if (form) {
      form.addEventListener('change', async () => {
        const payload = Object.fromEntries(new FormData(form).entries());
        onSave('estimate', payload, false);
        await onCalculate(payload);
      });
    }
    saveButton?.addEventListener('click', async () => {
      const payload = { projectId, ...Object.fromEntries(new FormData(form).entries()) };
      const breakdown = await api.createEstimate(payload);
      state.lastEstimateRecord = breakdown;
    });
  }
};
