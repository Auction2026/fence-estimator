export const tab8 = {
  id: 'tab8',
  order: 8,
  label: 'Equipment',
  render: (ctx) => `
    <section class="panel">
      <h2>Equipment</h2>
      <p>Workflow step 8 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="equipment-primary" value="${ctx.state['equipment-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="equipment-notes">${ctx.state['equipment-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
