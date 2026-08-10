export function createFormTab(config) {
  return {
    ...config,
    render(state) {
      const values = state.tabs[config.id] || {};
      const fieldsHtml = config.fields.map(field => {
        const value = values[field.name] ?? field.defaultValue ?? '';
        if (field.type === 'textarea') {
          return `<label>${field.label}<textarea name="${field.name}" ${field.required ? 'required' : ''}>${value}</textarea><span class="helper">${field.help || ''}</span></label>`;
        }
        if (field.type === 'select') {
          const options = field.options.map(option => `<option value="${option.value}" ${String(value) === String(option.value) ? 'selected' : ''}>${option.label}</option>`).join('');
          return `<label>${field.label}<select name="${field.name}">${options}</select><span class="helper">${field.help || ''}</span></label>`;
        }
        return `<label>${field.label}<input type="${field.type || 'text'}" name="${field.name}" value="${value}"><span class="helper">${field.help || ''}</span></label>`;
      }).join('');

      return `
        <section class="card">
          <h2>${config.title}</h2>
          <p class="helper">${config.description}</p>
          <form data-tab-form="${config.id}" class="grid">${fieldsHtml}</form>
        </section>
      `;
    },
    bind({ panel, state, onSave }) {
      const form = panel.querySelector(`[data-tab-form="${config.id}"]`);
      if (!form) return;
      form.addEventListener('change', () => onSave(config.id, Object.fromEntries(new FormData(form).entries())));
    }
  };
}
