/* ═══════════════════════════════════════════════════════════════
   sign-off.js – project completion sign-off
   ═══════════════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('tabLoad', e => {
  if (e.detail !== 'sign-off') return;
  loadSignOffs();
});

function loadSignOffs(q = '') {
  const projects = JSON.parse(localStorage.getItem('fd_projects') || '[]')
    .filter(p => !q || JSON.stringify(p).toLowerCase().includes(q.toLowerCase()));
  const signOffs = JSON.parse(localStorage.getItem('fd_signoffs') || '{}');

  document.getElementById('signoff-list').innerHTML = projects.map(p => {
    const so = signOffs[p.id] || {};
    const signed = !!so.signedAt;
    return `
      <div class="card" style="margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <strong>${App.escHtml(p.customerName)}</strong> – ${App.escHtml(p.fenceType)} – ${App.escHtml(p.linearFt || '?')} ft
            <br><small>${App.escHtml(App.fmtDate(p.startDate))}</small>
          </div>
          <div>
            ${signed
              ? `<span class="badge badge-success">Signed ${App.escHtml(App.fmtDate(so.signedAt))}</span>`
              : `<button class="btn-primary" onclick="signOffProject(${Number(p.id)})">Sign Off</button>`}
          </div>
        </div>
        ${signed ? `<p style="margin-top:8px;font-size:.85rem">Signed by: <em>${App.escHtml(so.name)}</em></p>` : ''}
      </div>`;
  }).join('') || '<p class="hint">No projects found</p>';
}

document.getElementById('signoff-search').addEventListener('input', e => loadSignOffs(e.target.value));

window.signOffProject = function (id) {
  App.Modal.open('Project Sign-Off', `
    <div class="form-grid">
      <label class="full">Customer / Representative Name <input id="so-name" /></label>
      <label class="full">Signature (type full name to sign)
        <input id="so-sig" placeholder="Type full name as electronic signature" />
      </label>
      <label class="full">Date <input id="so-date" type="date" value="${new Date().toISOString().slice(0,10)}" /></label>
      <label class="full">Comments <textarea id="so-comments" rows="3"></textarea></label>
    </div>`,
    `<button class="btn-primary" onclick="completeSignOff(${id})">Confirm Sign-Off</button>`
  );
};

window.completeSignOff = function (id) {
  const name = document.getElementById('so-name').value.trim();
  const sig  = document.getElementById('so-sig').value.trim();
  if (!name || !sig) { App.toast('Name and signature are required', 'error'); return; }
  const signOffs = JSON.parse(localStorage.getItem('fd_signoffs') || '{}');
  signOffs[id] = { name, sig, signedAt: new Date().toISOString(), comments: document.getElementById('so-comments').value };
  localStorage.setItem('fd_signoffs', JSON.stringify(signOffs));
  App.Modal.close();
  App.toast('Project signed off!', 'success');
  loadSignOffs();
};
