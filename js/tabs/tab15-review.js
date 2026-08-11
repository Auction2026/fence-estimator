export const tab15 = {
  id: 'tab15',
  order: 15,
  label: 'Review',
  render: (ctx) => `
    <section class="panel">
      <h2>Review</h2>
      <p>Workflow step 15 of 17.</p>
      <div class="grid">
        <label class="field">Primary Input
          <input name="review-primary" value="${ctx.state['review-primary'] || ''}" />
        </label>
        <label class="field">Notes
          <textarea name="review-notes">${ctx.state['review-notes'] || ''}</textarea>
        </label>
      </div>
    </section>
  `
};
