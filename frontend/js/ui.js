
const UIModule = (() => {
  function show(selector) { document.querySelector(selector)?.classList.remove('hidden'); }
  function hide(selector) { document.querySelector(selector)?.classList.add('hidden'); }
  function setLoading(isLoading) { document.body.classList.toggle('is-loading', !!isLoading); }

  function updateTableContent(tableBodyId, rows = []) {
    const body = document.getElementById(tableBodyId);
    if (!body) return;
    body.innerHTML = rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('');
  }

  function notify(message, type = 'success') {
    const el = document.createElement('div');
    el.className = `alert alert-${type}`;
    el.textContent = message;
    document.querySelector('.app-shell')?.prepend(el);
    setTimeout(() => el.remove(), 3200);
  }

  function openModal(id) { document.getElementById(id)?.classList.add('open'); }
  function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
  function confirmDialog(message) { return window.confirm(message); }

  return { show, hide, setLoading, updateTableContent, notify, openModal, closeModal, confirmDialog };
})();
