// Sign-off tab
'use strict';

const Tab13 = {
  storageKey: 'signoff-data',
  init() {
    this.form = document.getElementById('signOffForm');
    this.renderForm();
    this.bindEvents();
    this.load();
  },
  renderForm() {
    if (!this.form) return;
    this.form.innerHTML = `
      <div class="row"><div class="col col-4"><label class="form-label" for="completionDate">Completion Date</label><input class="form-control" id="completionDate" type="date"></div><div class="col col-8"><div class="checkbox-grid">
        <div class="checkbox-row"><input type="checkbox" id="inspectionPassed"><label for="inspectionPassed">Inspection Passed</label></div>
        <div class="checkbox-row"><input type="checkbox" id="walkthroughCompleted"><label for="walkthroughCompleted">Walkthrough Completed</label></div>
        <div class="checkbox-row"><input type="checkbox" id="warrantyExplained"><label for="warrantyExplained">Warranty Explained</label></div>
      </div></div></div>
      <div class="form-group"><label class="form-label" for="outstandingItems">Outstanding Items</label><textarea class="form-control" id="outstandingItems" rows="3"></textarea></div>
      <div class="form-group"><label class="form-label" for="customerNotes">Customer Notes</label><textarea class="form-control" id="customerNotes" rows="3"></textarea></div>
      <div class="form-group"><label class="form-label" for="photoUpload">Completion Photos</label><input class="form-control" id="photoUpload" type="file" accept="image/*" multiple></div>
      <div id="signOffPhotoPreview" class="row"></div>
      <div class="signature-grid"><div class="signature-panel"><label class="form-label" for="customerSignature">Customer Signature</label><input class="form-control" id="customerSignature"></div><div class="signature-panel"><label class="form-label" for="contractorSignature">Contractor Signature</label><input class="form-control" id="contractorSignature"></div></div>
      <div class="actions-inline mt-3"><button type="button" id="submitSignOffBtn" class="btn btn-success">Submit Sign-Off</button><span id="signOffStatusDisplay" class="badge badge-primary">Not Started</span></div>`;
  },
  bindEvents() {
    if (!this.form) return;
    this.form.addEventListener('input', App.debounce(() => this.save(false), 250));
    this.form.addEventListener('change', () => this.updateStatus());
    const upload = document.getElementById('photoUpload');
    const submit = document.getElementById('submitSignOffBtn');
    if (upload) upload.addEventListener('change', (event) => this.handlePhotoUpload(event));
    if (submit) submit.addEventListener('click', () => this.submitSignOff());
  },
  async handlePhotoUpload(event) {
    const files = Array.from((event.target && event.target.files) || []);
    const results = await Promise.all(files.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, dataUrl: reader.result, date: new Date().toISOString() });
      reader.readAsDataURL(file);
    })));
    AppState.signOff = AppState.signOff || {};
    AppState.signOff.photos = (AppState.signOff.photos || []).concat(results);
    this.renderPhotos();
    this.save(false);
  },
  renderPhotos() {
    const preview = document.getElementById('signOffPhotoPreview');
    const photos = ((AppState.signOff || {}).photos) || [];
    if (!preview) return;
    preview.innerHTML = photos.map((photo) => `<div class="col col-3"><img src="${photo.dataUrl}" alt="${photo.name}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;"></div>`).join('') || '<p class="small-text">No completion photos uploaded.</p>';
  },
  getData() {
    return {
      completionDate: document.getElementById('completionDate') ? document.getElementById('completionDate').value : '',
      inspectionPassed: Boolean(document.getElementById('inspectionPassed') && document.getElementById('inspectionPassed').checked),
      walkthroughCompleted: Boolean(document.getElementById('walkthroughCompleted') && document.getElementById('walkthroughCompleted').checked),
      warrantyExplained: Boolean(document.getElementById('warrantyExplained') && document.getElementById('warrantyExplained').checked),
      outstandingItems: document.getElementById('outstandingItems') ? document.getElementById('outstandingItems').value.trim() : '',
      customerNotes: document.getElementById('customerNotes') ? document.getElementById('customerNotes').value.trim() : '',
      customerSignature: document.getElementById('customerSignature') ? document.getElementById('customerSignature').value.trim() : '',
      contractorSignature: document.getElementById('contractorSignature') ? document.getElementById('contractorSignature').value.trim() : '',
      photos: ((AppState.signOff || {}).photos) || []
    };
  },
  applyData(data) {
    if (!data) return;
    const set = (id, value) => { const node = document.getElementById(id); if (node) node.value = value || ''; };
    const setCheck = (id, value) => { const node = document.getElementById(id); if (node) node.checked = Boolean(value); };
    set('completionDate', data.completionDate);
    set('outstandingItems', data.outstandingItems);
    set('customerNotes', data.customerNotes);
    set('customerSignature', data.customerSignature);
    set('contractorSignature', data.contractorSignature);
    setCheck('inspectionPassed', data.inspectionPassed);
    setCheck('walkthroughCompleted', data.walkthroughCompleted);
    setCheck('warrantyExplained', data.warrantyExplained);
    AppState.signOff = Object.assign({}, data);
    this.renderPhotos();
    this.updateStatus();
  },
  updateStatus() {
    const data = this.getData();
    const statusNode = document.getElementById('signOffStatusDisplay');
    let status = 'Not Started';
    if (data.completionDate || data.outstandingItems || data.customerSignature) status = 'In Progress';
    if (data.inspectionPassed && data.walkthroughCompleted && data.warrantyExplained && data.customerSignature && data.contractorSignature) status = 'Completed';
    if (statusNode) statusNode.textContent = status;
    return status;
  },
  async submitSignOff() {
    const data = this.getData();
    if (!data.inspectionPassed || !data.walkthroughCompleted || !data.warrantyExplained) {
      UI.showNotification('Complete all sign-off checklist items first.', 'warning');
      return false;
    }
    if (!data.customerSignature || !data.contractorSignature) {
      UI.showNotification('Customer and contractor signatures are required.', 'warning');
      return false;
    }
    try {
      const response = await Api.createSignOff(Object.assign({ projectId: (AppState.currentProject || {}).projectId || '' }, data));
      AppState.signOff = Object.assign({}, data, response);
      UI.showNotification('Final sign-off submitted successfully.', 'success');
    } catch (_error) {
      AppState.signOff = data;
      UI.showNotification('Sign-off saved locally; API sync pending.', 'warning');
    }
    this.save(false);
    this.updateStatus();
    return true;
  },
  load() {
    const saved = Storage.load(this.storageKey) || AppState.signOff || {};
    AppState.signOff = Object.assign({ photos: [] }, saved);
    this.applyData(AppState.signOff);
  },
  save(showToast = true) {
    AppState.signOff = this.getData();
    Storage.save(this.storageKey, AppState.signOff);
    this.updateStatus();
    if (showToast) UI.showNotification('Sign-off draft saved.', 'success');
    return true;
  },
  validate() {
    return true;
  }
};

window.Tab13 = Tab13;
