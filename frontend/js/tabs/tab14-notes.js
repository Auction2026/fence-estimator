/**
 * TAB 14 - Notes Hub
 * frontend/js/tabs/tab14-notes.js
 */

'use strict';

var Tab14Notes = (function () {

  var notes = [];

  var CATEGORIES = ['General', 'Customer', 'Installation', 'Materials', 'Permits', 'Financial', 'Follow-Up'];

  function init() {
    loadSavedData();
    renderNotes();
    bindEvents();
  }

  function loadSavedData() {
    notes = FenceApp.project.notes ? JSON.parse(JSON.stringify(FenceApp.project.notes)) : [];
  }

  function renderNotes(filterCategory) {
    var container = document.getElementById('notes-container');
    if (!container) return;

    var filtered = filterCategory && filterCategory !== 'All'
      ? notes.filter(function (n) { return n.category === filterCategory; })
      : notes;

    if (filtered.length === 0) {
      container.innerHTML = '<p class="text-muted text-center" style="padding:24px">No notes yet. Add your first note!</p>';
      return;
    }

    container.innerHTML = filtered.map(function (note, i) {
      var realIdx = notes.indexOf(note);
      return '<div class="card" style="margin-bottom:12px">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">' +
          '<span class="badge badge-info">' + UI.escapeHtml(note.category || 'General') + '</span>' +
          '<span class="text-muted" style="font-size:12px">' + formatDate(note.createdAt) + '</span>' +
        '</div>' +
        (note.title ? '<div class="fw-bold" style="margin-bottom:6px">' + UI.escapeHtml(note.title) + '</div>' : '') +
        '<div style="font-size:14px;line-height:1.6;white-space:pre-wrap">' + UI.escapeHtml(note.body || '') + '</div>' +
        '<div style="margin-top:12px;display:flex;gap:8px">' +
          '<button class="btn btn-sm btn-outline" onclick="Tab14Notes.editNote(' + realIdx + ')">✏ Edit</button>' +
          '<button class="btn btn-sm btn-danger" onclick="Tab14Notes.deleteNote(' + realIdx + ')">🗑 Delete</button>' +
        '</div>' +
        '</div>';
    }).join('');
  }

  function addNote() {
    var data = UI.getFormData('form-note');
    if (!data.note_body && !data.note_title) {
      UI.showToast('Enter a title or body for your note', 'warning');
      return;
    }
    notes.unshift({
      id:        generateId(),
      title:     data.note_title,
      body:      data.note_body,
      category:  data.note_category || 'General',
      createdAt: new Date().toISOString(),
    });
    UI.clearForm('form-note');
    UI.closeModal('modal-note');
    renderNotes();
    save();
    UI.showToast('Note added ✓', 'success');
  }

  function editNote(index) {
    var note = notes[index];
    if (!note) return;
    UI.populateForm('form-note', {
      note_title:    note.title,
      note_body:     note.body,
      note_category: note.category,
    });
    var btnSubmit = document.getElementById('btn-submit-note');
    if (btnSubmit) {
      btnSubmit.onclick = function () {
        var data = UI.getFormData('form-note');
        notes[index].title    = data.note_title;
        notes[index].body     = data.note_body;
        notes[index].category = data.note_category;
        notes[index].editedAt = new Date().toISOString();
        UI.closeModal('modal-note');
        renderNotes();
        save();
        UI.showToast('Note updated ✓', 'success');
        btnSubmit.onclick = addNote;
      };
    }
    UI.openModal('modal-note');
  }

  function deleteNote(index) {
    if (!window.confirm('Delete this note?')) return;
    notes.splice(index, 1);
    renderNotes();
    save();
    UI.showToast('Note deleted', 'info');
  }

  function bindEvents() {
    var btnNew = document.getElementById('btn-new-note');
    if (btnNew) btnNew.addEventListener('click', function () { UI.openModal('modal-note'); });

    var btnSubmit = document.getElementById('btn-submit-note');
    if (btnSubmit) btnSubmit.addEventListener('click', addNote);

    // Category filter
    var categorySelect = document.getElementById('notes-category-filter');
    if (categorySelect) {
      categorySelect.innerHTML = '<option value="All">All Categories</option>' +
        CATEGORIES.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
      categorySelect.addEventListener('change', function () { renderNotes(categorySelect.value); });
    }

    // Category select in form
    var formCat = document.getElementById('note_category');
    if (formCat) {
      formCat.innerHTML = CATEGORIES.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
    }

    var btnSave = document.getElementById('btn-save-notes');
    if (btnSave) btnSave.addEventListener('click', save);
  }

  function save() {
    FenceApp.project.notes = notes;
    Storage.saveProject(FenceApp.project);
  }

  return { init, save, editNote, deleteNote };

})();

window.Tab14Notes = Tab14Notes;
