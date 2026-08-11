
(() => {
  const TAB_ID = 'notes';
  const FORM_ID = null;

  function readValues() {
    if (!FORM_ID) {
      return {};
    }
    return window.FenceUI.formToObject(FORM_ID);
  }

  function saveState(ctx) {
    const values = readValues();
    ctx.state.tabs[TAB_ID] = values;
    ctx.storage.saveTabState(ctx.state.tabs);
    return values;
  }

  function bindPrimaryButton(ctx) {
    const buttonId = "saveNoteBtn";
    if (!buttonId) {
      return;
    }
    const button = document.getElementById(buttonId);
    if (!button || button.dataset.bound === 'true') {
      return;
    }
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      if (TAB_ID === 'project') {
        const values = saveState(ctx);
        const errors = ctx.validation.validateProjectForm(values);
        ctx.validation.displayValidationErrors(errors);
        if (!errors.length) {
          ctx.storage.saveProject(values);
          window.refreshSessionSummary?.();
          ctx.ui.showNotification('Project information saved.', 'success');
        }
        return;
      }
      if (TAB_ID === 'specs') {
        const values = saveState(ctx);
        const errors = ctx.validation.validateFenceSpecs(values);
        ctx.validation.displayValidationErrors(errors);
        if (!errors.length) {
          ctx.storage.saveSpecs(values);
          ctx.ui.showNotification('Fence specifications saved.', 'success');
        }
        return;
      }
      if (TAB_ID === 'installation') {
        addSimpleRow('installationTable', ['New Phase', 'Crew', '0', 'Tools', 'Pending']);
        ctx.ui.showNotification('Installation phase row added.', 'success');
        return;
      }
      if (TAB_ID === 'extras') {
        addSimpleRow('extrasTable', ['Extra', 'Describe add-on', '0.00', '1', '0.00']);
        ctx.ui.showNotification('Extra row added.', 'success');
        return;
      }
      if (TAB_ID === 'change-orders') {
        addChangeOrder(ctx);
        return;
      }
      if (TAB_ID === 'notes') {
        addNote(ctx);
      }
    });
  }

  function addSimpleRow(tableId, cells) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) {
      return;
    }
    const tr = document.createElement('tr');
    cells.forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }

  function addChangeOrder(ctx) {
    const values = readValues();
    const tbody = document.querySelector('#changeOrdersTable tbody');
    if (!tbody) {
      return;
    }
    const tr = document.createElement('tr');
    [values.changeOrderDate || new Date().toISOString().slice(0, 10), values.changeOrderReason || 'Scope revision', values.changeOrderScope || 'Pending details', values.changeOrderCost || '0', 'Draft'].forEach((value) => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
    saveState(ctx);
    ctx.ui.showNotification('Change order added to draft table.', 'success');
  }

  function addNote(ctx) {
    const entry = document.getElementById('projectNoteEntry');
    const note = ctx.validation.sanitizeText(entry?.value || '');
    if (!note) {
      ctx.ui.showNotification('Enter a note before saving.', 'warning');
      return;
    }
    const notes = ctx.storage.getNotes();
    notes.unshift({ note, createdAt: new Date().toISOString() });
    ctx.storage.saveNotes(notes);
    entry.value = '';
    renderNotes(notes);
    ctx.ui.showNotification('Project note saved locally.', 'success');
  }

  function renderNotes(notes) {
    const list = document.getElementById('notesList');
    if (!list) {
      return;
    }
    list.innerHTML = '';
    notes.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = `${new Date(item.createdAt).toLocaleString()} — ${item.note}`;
      list.appendChild(li);
    });
  }

  function bindUploads() {
    if (TAB_ID !== 'drawings') {
      return;
    }
    const input = document.getElementById('shopDrawingsFiles');
    if (!input || input.dataset.bound === 'true') {
      return;
    }
    input.dataset.bound = 'true';
    input.addEventListener('change', () => {
      const list = document.getElementById('shopDrawingsList');
      list.innerHTML = '';
      Array.from(input.files || []).forEach((file) => {
        const li = document.createElement('li');
        li.textContent = `${file.name} (${Math.round(file.size / 1024)} KB)`;
        list.appendChild(li);
      });
    });
  }

  function updateSummary(ctx) {
    const values = readValues();
    if (TAB_ID === 'project') {
      ctx.ui.renderSummaryList('project-summary', []);
    }
  }

  function init(ctx) {
    bindPrimaryButton(ctx);
    bindUploads();
    if (FORM_ID) {
      const stored = ctx.state.tabs[TAB_ID] || {};
      ctx.ui.populateForm(FORM_ID, stored);
      const form = document.getElementById(FORM_ID);
      if (form && form.dataset.bound !== 'true') {
        form.dataset.bound = 'true';
        form.addEventListener('change', () => {
          saveState(ctx);
          updateSummary(ctx);
        });
      }
    }
    if (TAB_ID === 'notes') {
      renderNotes(ctx.storage.getNotes());
    }
  }

  function activate(ctx) {
    if (TAB_ID === 'layout') {
      window.FenceDrawing?.initialize?.('layoutCanvas');
    }
    if (TAB_ID === 'mapping') {
      window.FenceMapping?.initialize?.('mapContainer');
    }
    if (TAB_ID === 'catalog') {
      window.renderCatalogResults?.();
    }
    if (TAB_ID === 'admin') {
      const notes = ctx.storage.getNotes();
      document.getElementById('metricOpenEstimates')?.replaceChildren(document.createTextNode(ctx.storage.getEstimate() ? '1' : '0'));
      document.getElementById('metricPendingPermits')?.replaceChildren(document.createTextNode(ctx.state.tabs.permits?.permitStatus === 'approved' ? '0' : '1'));
      document.getElementById('metricLocateHolds')?.replaceChildren(document.createTextNode(ctx.state.tabs.utilities?.locateStatus === 'hold' ? '1' : '0'));
      document.getElementById('metricSignedContracts')?.replaceChildren(document.createTextNode(ctx.state.tabs.contract?.contractStatus === 'signed' ? '1' : '0'));
      document.getElementById('metricChangeOrders')?.replaceChildren(document.createTextNode(String(document.querySelectorAll('#changeOrdersTable tbody tr').length)));
      document.getElementById('metricCatalogSkus')?.replaceChildren(document.createTextNode(String((window.FenceSeedCatalog || []).length || 952)));
    }
    updateSummary(ctx);
  }

  window.registerFenceTab({
    id: TAB_ID,
    title: 'Notes',
    init,
    activate,
    saveState
  });
})();
