/**
 * tab14-notes.js – Notes Central Hub tab
 */
const Tab14Notes = (() => {
  let notes = [];
  let editId = null;

  function init() {
    notes = Storage.loadNotes();
    render();
    document.getElementById('btn-add-note')?.addEventListener('click', showForm);
    document.getElementById('btn-save-note')?.addEventListener('click', saveNote);
    document.getElementById('btn-cancel-note')?.addEventListener('click', hideForm);
    document.getElementById('note-filter')?.addEventListener('change', render);
    document.getElementById('note-search')?.addEventListener('input', render);
  }

  function showForm() {
    editId = null;
    UI.setValue('note-title', '');
    UI.setValue('note-content', '');
    UI.setValue('note-category', 'general');
    document.getElementById('note-form-container').style.display = '';
  }

  function hideForm() {
    document.getElementById('note-form-container').style.display = 'none';
  }

  function saveNote() {
    const title   = UI.getValue('note-title').trim();
    const content = UI.getValue('note-content').trim();
    if (!title || !content) { alert('Title and content required'); return; }
    const note = {
      id: editId || Date.now(),
      title, content,
      category: UI.getValue('note-category'),
      createdAt: editId ? (notes.find(n=>n.id===editId)?.createdAt||new Date().toISOString()) : new Date().toISOString()
    };
    if (editId) {
      const idx = notes.findIndex(n => n.id === editId);
      if (idx >= 0) notes[idx] = note;
    } else {
      notes.unshift(note);
    }
    Storage.saveNotes(notes);
    hideForm();
    render();
    UI.showNotification('Note saved', 'success');
  }

  function deleteNote(id) {
    if (!UI.confirm('Delete this note?')) return;
    notes = notes.filter(n => n.id !== id);
    Storage.saveNotes(notes);
    render();
  }

  function editNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;
    editId = id;
    UI.setValue('note-title', note.title);
    UI.setValue('note-content', note.content);
    UI.setValue('note-category', note.category);
    document.getElementById('note-form-container').style.display = '';
  }

  function render() {
    const filter = UI.getValue('note-filter') || 'all';
    const search = (UI.getValue('note-search') || '').toLowerCase();
    const list = document.getElementById('notes-list');
    if (!list) return;

    let filtered = notes.filter(n => {
      const matchCat = filter === 'all' || n.category === filter;
      const matchSearch = !search || n.title.toLowerCase().includes(search) || n.content.toLowerCase().includes(search);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      list.innerHTML = '<p class="no-items">No notes found.</p>';
      return;
    }

    list.innerHTML = filtered.map(n => `
      <div class="note-card">
        <div class="note-card-header">
          <span class="note-title">${escHtml(n.title)}</span>
          <span class="note-badge">${escHtml(n.category)}</span>
        </div>
        <div class="note-content">${escHtml(n.content)}</div>
        <div class="note-meta">Created: ${UI.formatDate(n.createdAt)}</div>
        <div class="note-actions">
          <button class="btn btn-sm btn-secondary" onclick="Tab14Notes.edit(${n.id})">✏️ Edit</button>
          <button class="btn btn-sm btn-danger" onclick="Tab14Notes.delete(${n.id})">🗑️ Delete</button>
        </div>
      </div>
    `).join('');
  }

  function escHtml(str) {
    return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { init, edit: editNote, delete: deleteNote };
})();
