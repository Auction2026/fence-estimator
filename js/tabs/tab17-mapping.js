export const tab17 = {
  id: 'tab17',
  order: 17,
  label: 'Mapping',
  render: (ctx) => `
    <section class="panel">
      <h2>Mapping</h2>
      <p>Workflow step 17 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="mapping-primary" value="${ctx.state['mapping-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="mapping-notes">${ctx.state['mapping-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
