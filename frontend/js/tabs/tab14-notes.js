(function () {
  const MODULE = {
    app: null,
    init(app) {
      this.app = app;
      document.getElementById('add-note-btn')?.addEventListener('click', () => this.addNote());
      this.render();
    },
    addNote() {
      const category = document.getElementById('noteCategory')?.value || 'general';
      const text = document.getElementById('noteText')?.value?.trim();
      if (!text) {
        UI.showNotification('Enter note text to add a note.', 'warning');
        return;
      }
      const notes = [...(this.app.state.notes || []), {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        category,
        text,
        timestamp: new Date().toISOString()
      }];
      this.app.setSection('notes', notes);
      document.getElementById('noteText').value = '';
      this.render();
    },
    removeNote(id) {
      this.app.setSection('notes', (this.app.state.notes || []).filter((note) => note.id !== id));
      this.render();
    },
    render() {
      const list = document.getElementById('notes-list');
      const notes = (this.app.state.notes || []).slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      list.innerHTML = '';
      if (!notes.length) {
        list.innerHTML = '<div class="note-card">No notes logged yet.</div>';
        return;
      }
      notes.forEach((note) => {
        const card = document.createElement('article');
        card.className = 'note-card';
        card.innerHTML = `
          <header>
            <span class="badge">${note.category}</span>
            <small>${new Date(note.timestamp).toLocaleString()}</small>
          </header>
          <p>${note.text}</p>
          <button class="btn btn-danger" type="button">Delete</button>`;
        card.querySelector('button').addEventListener('click', () => this.removeNote(note.id));
        list.appendChild(card);
      });
    }
  };
  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.notes = MODULE;
})();
