export const tab2 = {
  id: 'tab2',
  order: 2,
  label: 'Customer',
  render: (ctx) => `
    <section class="panel">
      <h2>Customer</h2>
      <p>Workflow step 2 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="customer-primary" value="${ctx.state['customer-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="customer-notes">${ctx.state['customer-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
