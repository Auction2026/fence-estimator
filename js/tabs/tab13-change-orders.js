export const tab13 = {
  id: 'tab13',
  order: 13,
  label: 'Change Orders',
  render: (ctx) => `
    <section class="panel">
      <h2>Change Orders</h2>
      <p>Workflow step 13 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="change-orders-primary" value="${ctx.state['change-orders-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="change-orders-notes">${ctx.state['change-orders-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
