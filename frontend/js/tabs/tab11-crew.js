// Crew tab
'use strict';

const Tab11 = {
  init() { this.body = document.getElementById('crewTableBody'); this.bindEvents(); this.load(); },
  bindEvents() { const addButton = document.getElementById('addCrewBtn'); const saveButton = document.getElementById('saveCrewBtn'); if (addButton) addButton.addEventListener('click', () => this.addRow()); if (saveButton) saveButton.addEventListener('click', () => this.save()); if (this.body) this.body.addEventListener('click', (event) => { if (event.target.matches('.remove-crew-btn')) event.target.closest('tr').remove(); }); },
  addRow(data = {}) { if (!this.body) return; const options = ['Foreman','Installer','Equipment Operator','Welder','Project Manager','Safety Lead'].map((role) => `<option value="${role}"${role === data.role ? ' selected' : ''}>${role}</option>`).join(''); const row = document.createElement('tr'); row.innerHTML = `<td><input class="form-control" data-key="name" type="text" value="${data.name || ''}"></td><td><select class="form-control" data-key="role">${options}</select></td><td><input class="form-control" data-key="phone" type="tel" value="${data.phone || ''}"></td><td><input class="form-control" data-key="scheduledDays" type="text" value="${data.scheduledDays || ''}"></td><td><input class="form-control" data-key="assignedTasks" type="text" value="${data.assignedTasks || ''}"></td><td><button type="button" class="btn btn-danger btn-sm remove-crew-btn">Remove</button></td>`; this.body.appendChild(row); },
  load() { const crew = Storage.load('crew-members') || []; if (crew.length && this.body) { this.body.innerHTML = ''; crew.forEach((member) => this.addRow(member)); } },
  save() { AppState.crewMembers = App.serializeTable('crewTableBody'); Storage.save('crew-members', AppState.crewMembers); showNotification('Crew plan saved.', 'success'); return true; },
  validate() { return true; }
};
window.Tab11 = Tab11;
