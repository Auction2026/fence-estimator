export const tab1 = {
  id: 'tab1',
  order: 1,
  label: 'Project',
  render: (ctx) => `
    <section class="panel">
      <h2>Project</h2>
      <p>Workflow step 1 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="project-primary" value="${ctx.state['project-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="project-notes">${ctx.state['project-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
