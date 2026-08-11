export const tab9 = {
  id: 'tab9',
  order: 9,
  label: 'Permits',
  render: (ctx) => `
    <section class="panel">
      <h2>Permits</h2>
      <p>Workflow step 9 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="permits-primary" value="${ctx.state['permits-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="permits-notes">${ctx.state['permits-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
