export default {
  id: 'contract',
  title: '9. Contract',
  render(state) {
    const values = state.tabs.contract || {};
    const total = state.estimate?.total || 0;
    return `
      <section class="card">
        <h2>9. Contract</h2>
        <p class="helper">Prepare the contract scope, deposit, payment terms, and customer acceptance language.</p>
        <form data-tab-form="contract" class="grid">
          <label>Contract Title<input name="title" value="${values.title ?? 'Fence Installation Agreement'}"></label>
          <label>Customer Name<input name="customerName" value="${values.customerName ?? state.tabs.project?.customerName ?? ''}"></label>
          <label>Status
            <select name="status">
              ${['draft','sent','signed'].map(status => `<option value="${status}" ${values.status === status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
          </label>
          <label>Total Contract Value<input name="total" type="number" value="${values.total ?? total}"></label>
          <label>Payment Terms<textarea name="paymentTerms">${values.paymentTerms ?? '50% deposit, balance due on completion.'}</textarea></label>
          <label>Scope of Work<textarea name="scope">${values.scope ?? ''}</textarea></label>
        </form>
        <div class="inline-actions">
          <button type="button" class="primary-btn" id="save-contract-record">Save Contract Record</button>
        </div>
      </section>
    `;
  },
  bind({ panel, onSave, api, projectId, state }) {
    const form = panel.querySelector('[data-tab-form="contract"]');
    form?.addEventListener('change', () => onSave('contract', Object.fromEntries(new FormData(form).entries()), false));
    panel.querySelector('#save-contract-record')?.addEventListener('click', async () => {
      const payload = { projectId, estimateId: state.lastEstimateRecord?.id || 0, ...Object.fromEntries(new FormData(form).entries()) };
      state.lastContractRecord = await api.createContract(payload);
    });
  }
};
