export const tab16 = {
  id: 'tab16',
  order: 16,
  label: 'Approval',
  render: (ctx) => `
    <section class="panel">
      <h2>Approval</h2>
      <p>Workflow step 16 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="approval-primary" value="${ctx.state['approval-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="approval-notes">${ctx.state['approval-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
