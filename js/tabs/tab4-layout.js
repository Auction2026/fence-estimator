export const tab4 = {
  id: 'tab4',
  order: 4,
  label: 'Layout',
  render: (ctx) => `
    <section class="panel">
      <h2>Layout</h2>
      <p>Workflow step 4 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="layout-primary" value="${ctx.state['layout-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="layout-notes">${ctx.state['layout-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
