// Notes tab
'use strict';

const Tab14 = {
  storageKey: 'project-notes',
  editingId: null,
  badgeClasses: { General: 'badge-primary', Customer: 'badge-primary', Installation: 'badge-success', Finance: 'badge-warning', Legal: 'badge-danger', Safety: 'badge-secondary' },
  init() {
    this.container = document.getElementById('notesContainer');
    this.searchInput = document.getElementById('notesSearch');
    this.createButton = document.getElementById('createNoteBtn');
    this.bindEvents();
    this.load();
  },
  bindEvents() {
    if (this.searchInput) this.searchInput.addEventListener('input', (event) => this.searchNotes(event.target.value));
    if (this.createButton) this.createButton.addEventListener('click', () => this.openForm());
    if (!this.container) return;
    this.container.addEventListener('click', (event) => {
      const editButton = event.target.closest('[data-edit-note]');
      const deleteButton = event.target.closest('[data-delete-note]');
      if (editButton) this.editNote(editButton.dataset.editNote);
      if (deleteButton) this.deleteNote(deleteButton.dataset.deleteNote);
    });
  },
  noteFormHtml(note) {
    const current = note || { title: '', category: 'General', content: '' };
    return `
      <div class="form-group"><label class="form-label" for="noteTitle">Title</label><input class="form-control" id="noteTitle" value="${current.title}"></div>
      <div class="form-group"><label class="form-label" for="noteCategory">Category</label><select class="form-control" id="noteCategory"><option ${current.category === 'General' ? 'selected' : ''}>General</option><option ${current.category === 'Customer' ? 'selected' : ''}>Customer</option><option ${current.category === 'Installation' ? 'selected' : ''}>Installation</option><option ${current.category === 'Finance' ? 'selected' : ''}>Finance</option><option ${current.category === 'Legal' ? 'selected' : ''}>Legal</option><option ${current.category === 'Safety' ? 'selected' : ''}>Safety</option></select></div>
      <div class="form-group"><label class="form-label" for="noteContent">Content</label><textarea class="form-control" id="noteContent" rows="6">${current.content}</textarea></div>
      <button type="button" id="saveNoteBtn" class="btn btn-primary">Save Note</button>`;
  },
  openForm(note = null) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.noteFormHtml(note);
    UI.showModal(note ? 'Edit Note' : 'Create Note', wrapper);
    wrapper.querySelector('#saveNoteBtn').addEventListener('click', () => this.save());
    this.editingId = note ? note.id : null;
  },
  createNotePayload() {
    return {
      id: this.editingId || `note-${Date.now()}`,
      title: document.getElementById('noteTitle') ? document.getElementById('noteTitle').value.trim() : '',
      category: document.getElementById('noteCategory') ? document.getElementById('noteCategory').value : 'General',
      content: document.getElementById('noteContent') ? document.getElementById('noteContent').value.trim() : '',
      date: new Date().toISOString(),
      projectId: (AppState.currentProject || {}).projectId || ''
    };
  },
  previewText(note) {
    const text = String(note.content || '');
    return text.length > 140 ? `${text.slice(0, 140)}…` : text;
  },
  sortNotes(notes) {
    return (notes || []).slice().sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  },
  renderNotes(list = null) {
    if (!this.container) return;
    const notes = this.sortNotes(list || AppState.notes || []);
    this.container.innerHTML = notes.map((note) => `
      <article class="note-card">
        <div class="note-card-header"><h3>${note.title}</h3><span class="badge ${this.badgeClasses[note.category] || 'badge-primary'}">${note.category}</span></div>
        <p>${this.previewText(note)}</p>
        <div class="note-card-footer"><span>${formatDate(note.date)}</span><div><button type="button" class="btn btn-secondary btn-sm" data-edit-note="${note.id}">Edit</button> <button type="button" class="btn btn-danger btn-sm" data-delete-note="${note.id}">Delete</button></div></div>
      </article>`).join('');
    if (!notes.length) this.container.innerHTML = '<div class="card"><div class="card-body">No notes yet.</div></div>';
  },
  searchNotes(query) {
    const text = String(query || '').toLowerCase();
    const filtered = (AppState.notes || []).filter((note) => {
      return String(note.title || '').toLowerCase().includes(text) || String(note.content || '').toLowerCase().includes(text);
    });
    this.renderNotes(filtered);
  },
  editNote(id) {
    const note = (AppState.notes || []).find((item) => item.id === id);
    if (note) this.openForm(note);
  },
  async deleteNote(id) {
    AppState.notes = (AppState.notes || []).filter((note) => note.id !== id);
    Storage.save(this.storageKey, AppState.notes);
    try { await Api.deleteNote(id); } catch (_error) { /* local fallback */ }
    this.renderNotes();
  },
  async load() {
    try {
      const notes = await Api.getNotes();
      AppState.notes = Array.isArray(notes) ? notes : [];
    } catch (_error) {
      AppState.notes = Storage.load(this.storageKey) || AppState.notes || [];
    }
    AppState.notes = this.sortNotes(AppState.notes);
    this.renderNotes();
  },
  async save() {
    const payload = this.createNotePayload();
    if (!payload.title || !payload.content) {
      UI.showNotification('Title and content are required.', 'warning');
      return false;
    }
    try {
      if (this.editingId) await Api.updateNote(this.editingId, payload);
      else await Api.createNote(payload);
    } catch (_error) {
      UI.showNotification('Note saved locally; API sync pending.', 'warning');
    }
    const existingIndex = (AppState.notes || []).findIndex((note) => note.id === payload.id);
    if (existingIndex >= 0) AppState.notes.splice(existingIndex, 1, payload);
    else AppState.notes.unshift(payload);
    Storage.save(this.storageKey, AppState.notes);
    this.renderNotes();
    UI.hideModal();
    this.editingId = null;
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab14 = Tab14;
