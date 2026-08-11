export const tab10 = {
  id: 'tab10',
  order: 10,
  label: 'Subcontractors',
  render: (ctx) => `
    <section class="panel">
      <h2>Subcontractors</h2>
      <p>Workflow step 10 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="subcontractors-primary" value="${ctx.state['subcontractors-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="subcontractors-notes">${ctx.state['subcontractors-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
