export const tab5 = {
  id: 'tab5',
  order: 5,
  label: 'Fence Configuration',
  render: (ctx) => `
    <section class="panel">
      <h2>Fence Configuration</h2>
      <p>Workflow step 5 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="fence-configuration-primary" value="${ctx.state['fence-configuration-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="fence-configuration-notes">${ctx.state['fence-configuration-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
