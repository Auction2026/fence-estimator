/* ═══════════════════════════════════════════════════════════════
   projects.js – projects list & detail
   ═══════════════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('tabLoad', async e => {
  if (e.detail !== 'projects') return;
  await loadProjects();
});

async function loadProjects(query = '') {
  let rows;
  try {
    const data = await App.Api.get('/projects?search=' + encodeURIComponent(query));
    rows = data.projects || data;
  } catch (_) {
    rows = JSON.parse(localStorage.getItem('fd_projects') || '[]');
    if (query) rows = rows.filter(r => JSON.stringify(r).toLowerCase().includes(query.toLowerCase()));
  }
  const tbody = document.getElementById('projects-body');
  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${App.escHtml(r.id)}</td>
      <td>${App.escHtml(r.customerName || '')}</td>
      <td>${App.escHtml(r.fenceType || '')}</td>
      <td>${App.escHtml(r.linearFt || '')}</td>
      <td>${App.escHtml(App.fmtDate(r.startDate))}</td>
      <td>${App.escHtml(r.status || '')}</td>
      <td>${App.escHtml(App.fmtCurrency(r.total))}</td>
      <td>
        <button class="btn-sm btn-secondary" onclick="editProject(${Number(r.id)})">Edit</button>
        <button class="btn-sm btn-danger"    onclick="deleteProject(${Number(r.id)})">Del</button>
      </td>
    </tr>`).join('') || '<tr><td colspan="8">No projects found</td></tr>';
}

document.getElementById('project-search').addEventListener('input', e => loadProjects(e.target.value));

document.getElementById('new-project-btn').addEventListener('click', () => {
  App.Modal.open('New Project', `
    <div class="form-grid">
      <label>Customer Name <input id="np-name" type="text" /></label>
      <label>Fence Type
        <select id="np-type">
          <option value="chain-link">Chain Link</option>
          <option value="wood">Wood</option>
          <option value="vinyl">Vinyl</option>
          <option value="ornamental">Ornamental</option>
          <option value="aluminum">Aluminum</option>
        </select>
      </label>
      <label>Linear Feet <input id="np-ft" type="number" /></label>
      <label>Status
        <select id="np-status">
          <option>pending</option><option>in-progress</option><option>complete</option><option>cancelled</option>
        </select>
      </label>
      <label>Total <input id="np-total" type="number" step="0.01" /></label>
    </div>`,
    `<button class="btn-primary" onclick="saveNewProject()">Save</button>`
  );
});

window.saveNewProject = async function () {
  const proj = {
    id: Date.now(),
    customerName: document.getElementById('np-name').value,
    fenceType:    document.getElementById('np-type').value,
    linearFt:     document.getElementById('np-ft').value,
    status:       document.getElementById('np-status').value,
    total:        document.getElementById('np-total').value,
    startDate:    new Date().toISOString()
  };
  try { await App.Api.post('/projects', proj); } catch (_) {}
  const all = JSON.parse(localStorage.getItem('fd_projects') || '[]');
  all.push(proj);
  localStorage.setItem('fd_projects', JSON.stringify(all));
  App.Modal.close();
  App.toast('Project saved', 'success');
  loadProjects();
};

window.deleteProject = async function (id) {
  if (!confirm('Delete project?')) return;
  try { await App.Api.del('/projects/' + id); } catch (_) {}
  const all = JSON.parse(localStorage.getItem('fd_projects') || '[]').filter(r => r.id != id);
  localStorage.setItem('fd_projects', JSON.stringify(all));
  loadProjects();
};

window.editProject = function (id) {
  App.toast('Edit coming soon', 'info');
};
