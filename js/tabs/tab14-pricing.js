export const tab14 = {
  id: 'tab14',
  order: 14,
  label: 'Pricing',
  render: (ctx) => `
    <section class="panel">
      <h2>Pricing</h2>
      <p>Workflow step 14 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="pricing-primary" value="${ctx.state['pricing-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="pricing-notes">${ctx.state['pricing-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
