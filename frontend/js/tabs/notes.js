// TAB 11: NOTES
function notesTabRefresh() {
  const notes = getCollection('notes');
  const grid  = document.getElementById('notesList');
  if (!notes.length) { grid.innerHTML = '<p class="empty-state">No notes yet.</p>'; return; }
  grid.innerHTML = [...notes].reverse().map(n => `
    <div class="note-card">
      <div style="display:flex;justify-content:space-between">
        <strong>${n.title||'Note'}</strong>
        <button class="btn btn-danger btn-sm" onclick="deleteNote(${n.id})">✕</button>
      </div>
      <p style="margin:.4rem 0;font-size:.88rem">${n.body}</p>
      <div class="note-card-date">${new Date(n.createdAt).toLocaleString()}</div>
    </div>`).join('');
}

function notesTabAdd() {
  app.openModal(`
    <h3>Add Note</h3>
    <div class="form-group"><label>Title</label><input id="noteTitle" class="form-control" /></div>
    <div class="form-group"><label>Note</label><textarea id="noteBody" class="form-control" rows="5"></textarea></div>
    <button class="btn btn-primary" onclick="saveNote()">Save Note</button>`);
}

function saveNote() {
  const notes = getCollection('notes');
  notes.push({ id: Date.now(), title: document.getElementById('noteTitle').value, body: document.getElementById('noteBody').value, createdAt: new Date().toISOString() });
  saveCollection('notes', notes);
  app.closeModal(); notesTabRefresh(); app.toast('Note saved!','success');
}

function deleteNote(id) {
  saveCollection('notes', getCollection('notes').filter(n => n.id !== id));
  notesTabRefresh();
}
