// Notes tab
'use strict';

const Tab14 = {
  init() { this.container = document.getElementById('notesContainer'); this.search = document.getElementById('notesSearch'); this.bindEvents(); this.load(); },
  bindEvents() { if (this.search) this.search.addEventListener('input', () => this.render(this.search.value)); const createButton = document.getElementById('createNoteBtn'); if (createButton) createButton.addEventListener('click', () => this.openCreateModal()); if (this.container) this.container.addEventListener('click', (event) => { const card = event.target.closest('.note-card'); if (!card) return; const title = card.querySelector('h3').textContent; if (event.target.matches('.delete-note-btn')) this.delete(title); if (event.target.matches('.edit-note-btn')) this.openCreateModal(title); }); },
  openCreateModal(existingTitle = '') {
    const existing = (AppState.notes || []).find((item) => item.title === existingTitle) || { title: '', category: 'General', content: '' };
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="form-group"><label class="form-label">Title</label><input class="form-control" id="modalNoteTitle" value="${existing.title}"></div><div class="form-group"><label class="form-label">Category</label><select class="form-control" id="modalNoteCategory"><option ${existing.category === 'General' ? 'selected' : ''}>General</option><option ${existing.category === 'Customer' ? 'selected' : ''}>Customer</option><option ${existing.category === 'Installation' ? 'selected' : ''}>Installation</option><option ${existing.category === 'Finance' ? 'selected' : ''}>Finance</option><option ${existing.category === 'Legal' ? 'selected' : ''}>Legal</option></select></div><div class="form-group"><label class="form-label">Content</label><textarea class="form-control" id="modalNoteContent">${existing.content}</textarea></div><button type="button" id="saveModalNoteBtn" class="btn btn-primary">Save Note</button>`;
    UI.showModal('Project Note', wrapper);
    wrapper.querySelector('#saveModalNoteBtn').addEventListener('click', () => { const note = { title: wrapper.querySelector('#modalNoteTitle').value, category: wrapper.querySelector('#modalNoteCategory').value, content: wrapper.querySelector('#modalNoteContent').value, date: new Date().toISOString() }; AppState.notes = (AppState.notes || []).filter((item) => item.title !== existingTitle && item.title !== note.title).concat(note); this.save(); this.render(this.search ? this.search.value : ''); UI.hideModal(); });
  },
  delete(title) { AppState.notes = (AppState.notes || []).filter((item) => item.title !== title); this.save(); this.render(this.search ? this.search.value : ''); },
  render(filter = '') { if (!this.container) return; const query = String(filter || '').toLowerCase(); this.container.innerHTML = ''; (AppState.notes || []).filter((note) => !query || [note.title, note.category, note.content].join(' ').toLowerCase().includes(query)).forEach((note) => { this.container.insertAdjacentHTML('beforeend', `<article class="note-card"><div class="note-card-header"><h3>${note.title}</h3><span class="badge badge-primary">${note.category}</span></div><p>${note.content}</p><div class="note-card-footer"><span>${formatDate(note.date)}</span><div><button type="button" class="btn btn-secondary btn-sm edit-note-btn">Edit</button> <button type="button" class="btn btn-danger btn-sm delete-note-btn">Delete</button></div></div></article>`); }); },
  load() { AppState.notes = Storage.load('notes') || AppState.notes || []; this.render(); },
  save() { Storage.save('notes', AppState.notes || []); showNotification('Notes saved.', 'success'); return true; },
  validate() { return true; }
};
window.Tab14 = Tab14;
