/**
 * TAB 5 - Shop Drawings
 * frontend/js/tabs/tab5-drawings.js
 */

'use strict';

var Tab5Drawings = (function () {

  var files = [];

  function init() {
    bindEvents();
    loadSavedFiles();
    renderFileList();
  }

  function bindEvents() {
    var input  = document.getElementById('drawing-upload');
    var dropEl = document.getElementById('drawing-dropzone');

    if (input) {
      input.addEventListener('change', function () {
        handleFiles(Array.from(input.files));
        input.value = '';
      });
    }

    if (dropEl) {
      dropEl.addEventListener('dragover', function (e) { e.preventDefault(); dropEl.classList.add('drag-over'); });
      dropEl.addEventListener('dragleave', function ()  { dropEl.classList.remove('drag-over'); });
      dropEl.addEventListener('drop', function (e) {
        e.preventDefault();
        dropEl.classList.remove('drag-over');
        handleFiles(Array.from(e.dataTransfer.files));
      });
      dropEl.addEventListener('click', function () { if (input) input.click(); });
    }

    var btnSave = document.getElementById('btn-save-drawings');
    if (btnSave) btnSave.addEventListener('click', save);
  }

  function handleFiles(newFiles) {
    newFiles.forEach(function (file) {
      if (!isAllowed(file)) { UI.showToast('File type not allowed: ' + file.name, 'error'); return; }
      if (file.size > 10 * 1024 * 1024) { UI.showToast('File too large (max 10 MB): ' + file.name, 'error'); return; }

      var reader = new FileReader();
      reader.onload = function (e) {
        files.push({
          name:    file.name,
          type:    file.type,
          size:    file.size,
          dataUrl: e.target.result,
          addedAt: new Date().toISOString(),
        });
        renderFileList();
      };
      reader.readAsDataURL(file);
    });
  }

  function isAllowed(file) {
    var allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    return allowed.includes(file.type);
  }

  function renderFileList() {
    var list = document.getElementById('drawing-file-list');
    if (!list) return;

    if (files.length === 0) {
      list.innerHTML = '<p class="text-muted text-center" style="padding:24px">No drawings uploaded yet.</p>';
      return;
    }

    list.innerHTML = files.map(function (f, i) {
      var isImg = f.type.startsWith('image/');
      var preview = isImg
        ? '<img src="' + f.dataUrl + '" alt="' + UI.escapeHtml(f.name) + '" style="max-height:80px;border-radius:6px;margin-right:10px">'
        : '<span style="font-size:32px;margin-right:10px">📄</span>';

      return '<div class="d-flex align-center" style="padding:12px;border-bottom:1px solid var(--border)">' +
        preview +
        '<div style="flex:1">' +
          '<div class="fw-bold">' + UI.escapeHtml(f.name) + '</div>' +
          '<div class="text-muted" style="font-size:12px">' + (f.size / 1024).toFixed(1) + ' KB · ' + formatDate(f.addedAt) + '</div>' +
        '</div>' +
        '<button class="btn btn-sm btn-danger" onclick="Tab5Drawings.removeFile(' + i + ')">🗑 Remove</button>' +
        '</div>';
    }).join('');
  }

  function removeFile(index) {
    files.splice(index, 1);
    renderFileList();
  }

  function loadSavedFiles() {
    if (FenceApp.project.drawings && Array.isArray(FenceApp.project.drawings)) {
      files = FenceApp.project.drawings;
    }
  }

  function save() {
    FenceApp.project.drawings = files;
    Storage.saveProject(FenceApp.project);
    UI.showToast('Drawings saved ✓', 'success');
  }

  return { init, save, removeFile };

})();

window.Tab5Drawings = Tab5Drawings;
