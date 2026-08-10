/* ═══════════════════════════════════════════════════════════════
   admin.js – user & company administration
   ═══════════════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('tabLoad', async e => {
  if (e.detail !== 'admin') return;
  loadAdminUsers();
  loadCompanySettings();
});

async function loadAdminUsers() {
  let users;
  try { users = (await App.Api.get('/admin/users')).users || []; }
  catch (_) { users = JSON.parse(localStorage.getItem('fd_users') || '[]'); }
  document.getElementById('admin-users-body').innerHTML = users.map(u => `
    <tr>
      <td>${App.escHtml(u.name || '')}</td>
      <td>${App.escHtml(u.email)}</td>
      <td>${App.escHtml(u.role || 'estimator')}</td>
      <td><button class="btn-sm btn-danger" onclick="removeUser(${Number(u.id)})">Remove</button></td>
    </tr>`).join('') || '<tr><td colspan="4">No users</td></tr>';
}

function loadCompanySettings() {
  const s = JSON.parse(localStorage.getItem('fd_company') || '{}');
  if (s.name)    document.getElementById('co-name').value    = s.name;
  if (s.phone)   document.getElementById('co-phone').value   = s.phone;
  if (s.license) document.getElementById('co-license').value = s.license;
  if (s.tax)     document.getElementById('co-tax').value     = s.tax;
}

document.getElementById('save-co-btn').addEventListener('click', () => {
  const s = {
    name:    document.getElementById('co-name').value,
    phone:   document.getElementById('co-phone').value,
    license: document.getElementById('co-license').value,
    tax:     document.getElementById('co-tax').value
  };
  localStorage.setItem('fd_company', JSON.stringify(s));
  App.toast('Company settings saved', 'success');
});

document.getElementById('add-user-btn').addEventListener('click', () => {
  App.Modal.open('Add User', `
    <div class="form-grid">
      <label>Full Name <input id="au-name" /></label>
      <label>Email <input id="au-email" type="email" /></label>
      <label>Role
        <select id="au-role">
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="estimator">Estimator</option>
          <option value="viewer">Viewer</option>
        </select>
      </label>
      <label>Temp Password <input id="au-pw" type="password" /></label>
    </div>`,
    `<button class="btn-primary" onclick="createUser()">Create User</button>`
  );
});

window.createUser = async function () {
  const user = {
    id: Date.now(),
    name:  document.getElementById('au-name').value,
    email: document.getElementById('au-email').value,
    role:  document.getElementById('au-role').value
  };
  try { await App.Api.post('/admin/users', { ...user, password: document.getElementById('au-pw').value }); }
  catch (_) {}
  const all = JSON.parse(localStorage.getItem('fd_users') || '[]');
  all.push(user);
  localStorage.setItem('fd_users', JSON.stringify(all));
  App.Modal.close();
  App.toast('User created', 'success');
  loadAdminUsers();
};

window.removeUser = async function (id) {
  if (!confirm('Remove user?')) return;
  try { await App.Api.del('/admin/users/' + id); } catch (_) {}
  const all = JSON.parse(localStorage.getItem('fd_users') || '[]').filter(u => u.id != id);
  localStorage.setItem('fd_users', JSON.stringify(all));
  loadAdminUsers();
};
