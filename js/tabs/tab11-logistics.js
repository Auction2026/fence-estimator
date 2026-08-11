export const tab11 = {
  id: 'tab11',
  order: 11,
  label: 'Logistics',
  render: (ctx) => `
    <section class="panel">
      <h2>Logistics</h2>
      <p>Workflow step 11 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="logistics-primary" value="${ctx.state['logistics-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="logistics-notes">${ctx.state['logistics-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
