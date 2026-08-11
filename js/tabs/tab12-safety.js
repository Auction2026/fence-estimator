export const tab12 = {
  id: 'tab12',
  order: 12,
  label: 'Safety',
  render: (ctx) => `
    <section class="panel">
      <h2>Safety</h2>
      <p>Workflow step 12 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="safety-primary" value="${ctx.state['safety-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="safety-notes">${ctx.state['safety-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
