export function formatCurrency(value) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(Number(value || 0));
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function showMessage(target, message, kind = '') {
  if (!target) return;
  target.textContent = message;
  target.className = `flash-message ${kind}`.trim();
  setTimeout(() => {
    if (target.textContent === message) {
      target.textContent = '';
      target.className = 'flash-message';
    }
  }, 3000);
}

export function formDataToObject(form) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}
