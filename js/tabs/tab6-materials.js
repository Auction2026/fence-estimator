export const tab6 = {
  id: 'tab6',
  order: 6,
  label: 'Materials',
  render: (ctx) => `
    <section class="panel">
      <h2>Materials</h2>
      <p>Workflow step 6 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="materials-primary" value="${ctx.state['materials-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="materials-notes">${ctx.state['materials-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
