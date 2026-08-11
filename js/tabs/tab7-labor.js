export const tab7 = {
  id: 'tab7',
  order: 7,
  label: 'Labor',
  render: (ctx) => `
    <section class="panel">
      <h2>Labor</h2>
      <p>Workflow step 7 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="labor-primary" value="${ctx.state['labor-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="labor-notes">${ctx.state['labor-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
