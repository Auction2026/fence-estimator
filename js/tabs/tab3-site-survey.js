export const tab3 = {
  id: 'tab3',
  order: 3,
  label: 'Site Survey',
  render: (ctx) => `
    <section class="panel">
      <h2>Site Survey</h2>
      <p>Workflow step 3 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="site-survey-primary" value="${ctx.state['site-survey-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="site-survey-notes">${ctx.state['site-survey-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
