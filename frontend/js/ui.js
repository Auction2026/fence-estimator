(function () {
  function modalRoot() {
    return document.getElementById('modal-root');
  }

  function showModal(title, content) {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-label="${title}">
        <header>
          <div class="flex-row space-between align-center">
            <h3>${title}</h3>
            <button type="button" class="btn btn-secondary" data-modal-close>Close</button>
          </div>
        </header>
        <div class="modal-body"></div>
        <footer>
          <button type="button" class="btn btn-primary" data-modal-close>Done</button>
        </footer>
      </div>`;

    const body = overlay.querySelector('.modal-body');
    if (content instanceof HTMLElement) {
      body.appendChild(content);
    } else {
      body.innerHTML = String(content || '');
    }

    overlay.addEventListener('click', (event) => {
      if (event.target === overlay || event.target.closest('[data-modal-close]')) {
        closeModal();
      }
    });

    modalRoot().appendChild(overlay);
  }

  function closeModal() {
    modalRoot().innerHTML = '';
  }

  function showNotification(message, type = 'success') {
    const root = document.getElementById('notification-root');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    root.appendChild(notification);
    window.setTimeout(() => notification.remove(), 3600);
  }

  function toggleLoadingSpinner(show) {
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.toggle('hidden', !show);
  }

  function populateTable(tableId, data, columns) {
    const table = document.getElementById(tableId);
    if (!table) return;
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `<td colspan="${columns.length}">No records available.</td>`;
      tbody.appendChild(row);
      return;
    }

    data.forEach((rowData) => {
      const row = document.createElement('tr');
      row.innerHTML = columns.map((column) => {
        if (typeof column.render === 'function') {
          return `<td>${column.render(rowData) ?? ''}</td>`;
        }
        return `<td>${rowData[column.key] ?? ''}</td>`;
      }).join('');
      tbody.appendChild(row);
    });
  }

  function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
  }

  function setFormData(formId, data = {}) {
    const form = document.getElementById(formId);
    if (!form) return;
    Array.from(form.elements).forEach((element) => {
      if (!element.name) return;
      const value = data[element.name];
      if (element.type === 'checkbox') {
        element.checked = Boolean(value);
      } else if (value !== undefined && value !== null) {
        element.value = value;
      }
    });
  }

  function getFormData(formId) {
    const form = document.getElementById(formId);
    const data = {};
    if (!form) return data;
    Array.from(form.elements).forEach((element) => {
      if (!element.name) return;
      data[element.name] = element.type === 'checkbox' ? element.checked : element.value;
    });
    return data;
  }

  window.UI = {
    showModal,
    closeModal,
    showNotification,
    toggleLoadingSpinner,
    populateTable,
    clearForm,
    setFormData,
    getFormData
  };
})();
