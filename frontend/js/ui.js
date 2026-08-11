
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach((tab) => {
    tab.classList.remove('active');
  });

  const panel = document.getElementById(`tab-${tabName}`);
  if (panel) {
    panel.classList.add('active');
  }

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });
}

function showLoading() {
  const node = document.getElementById('loading');
  if (node) {
    node.classList.add('active');
    node.setAttribute('aria-hidden', 'false');
  }
}

function hideLoading() {
  const node = document.getElementById('loading');
  if (node) {
    node.classList.remove('active');
    node.setAttribute('aria-hidden', 'true');
  }
}

function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `notification notification-${type}`;
  notif.textContent = message;
  document.body.appendChild(notif);

  window.setTimeout(() => notif.remove(), 5000);
}

function showConfirmDialog(message, onConfirm, onCancel) {
  const dialog = document.createElement('div');
  dialog.className = 'confirm-dialog';

  const card = document.createElement('div');
  card.className = 'dialog-content';

  const text = document.createElement('p');
  text.textContent = message;

  const controls = document.createElement('div');
  controls.className = 'action-row';

  const yesButton = document.createElement('button');
  yesButton.className = 'btn btn-primary';
  yesButton.type = 'button';
  yesButton.textContent = 'Yes';

  const noButton = document.createElement('button');
  noButton.className = 'btn btn-secondary';
  noButton.type = 'button';
  noButton.textContent = 'No';

  yesButton.addEventListener('click', () => {
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
    dialog.remove();
  });

  noButton.addEventListener('click', () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
    dialog.remove();
  });

  controls.append(yesButton, noButton);
  card.append(text, controls);
  dialog.appendChild(card);
  document.body.appendChild(dialog);
}

function updateTableWithData(tableId, data) {
  const table = document.getElementById(tableId);
  if (!table) {
    return;
  }

  const tbody = table.querySelector('tbody');
  if (!tbody) {
    return;
  }

  tbody.innerHTML = '';

  data.forEach((row) => {
    const tr = document.createElement('tr');
    Object.values(row).forEach((cell) => {
      const td = document.createElement('td');
      td.textContent = String(cell);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function renderSummaryList(nodeId, entries) {
  const list = document.getElementById(nodeId);
  if (!list) {
    return;
  }

  list.innerHTML = '';
  entries.forEach(([label, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value || '—';
    list.append(dt, dd);
  });
}

function populateForm(formId, values = {}) {
  const form = document.getElementById(formId);
  if (!form) {
    return;
  }

  Object.entries(values).forEach(([key, value]) => {
    const field = form.querySelector(`[name="${key}"]`);
    if (!field) {
      return;
    }

    if (field.type === 'checkbox') {
      field.checked = Boolean(value);
    } else {
      field.value = value ?? '';
    }
  });
}

function formToObject(formId) {
  const form = document.getElementById(formId);
  if (!form) {
    return {};
  }

  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

window.FenceUI = {
  showTab,
  showLoading,
  hideLoading,
  showNotification,
  showConfirmDialog,
  updateTableWithData,
  renderSummaryList,
  populateForm,
  formToObject
};
