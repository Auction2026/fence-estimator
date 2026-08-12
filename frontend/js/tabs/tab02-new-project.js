/**
 * TAB 02 - NEW PROJECT
 * Customer intake form: name, address, contact info, property notes.
 */
'use strict';

const TabNewProject = (() => {

  const state = {
    projectId: null,
  };

  function render() {
    const el = document.getElementById('new-project-tab');
    if (!el) return;

    state.projectId = generateId('FDE');

    el.innerHTML = `
      <div class="card" style="max-width:800px;margin:0 auto">
        <div class="card-header">
          <h2>📋 New Project</h2>
          <span class="badge badge-info">Project #: ${UI.escapeHtml(state.projectId)}</span>
        </div>
        <div class="card-body">
          <form id="newProjectForm" data-validate>

            <div class="form-section">
              <div class="form-section-title">👤 Customer Information</div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Customer Name <span class="required">*</span></label>
                  <input class="form-control" name="customerName" placeholder="Full name" data-rules="required" id="np_customerName">
                </div>
                <div class="form-group">
                  <label class="form-label">Email <span class="required">*</span></label>
                  <input class="form-control" name="customerEmail" type="email" placeholder="email@example.com" data-rules="required,email" id="np_customerEmail">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Phone <span class="required">*</span></label>
                  <input class="form-control" name="customerPhone" type="tel" placeholder="(555) 123-4567" data-rules="required,phone" id="np_customerPhone">
                </div>
                <div class="form-group">
                  <label class="form-label">Alt. Phone</label>
                  <input class="form-control" name="altPhone" type="tel" placeholder="Optional">
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="form-section-title">📍 Property Address</div>
              <div class="form-group">
                <label class="form-label">Street Address <span class="required">*</span></label>
                <input class="form-control" name="address" placeholder="123 Main Street" data-rules="required" id="np_address">
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">City <span class="required">*</span></label>
                  <input class="form-control" name="city" placeholder="City" data-rules="required">
                </div>
                <div class="form-group">
                  <label class="form-label">Province <span class="required">*</span></label>
                  <select class="form-control" name="province" data-rules="required" id="np_province">
                    <option value="">-- Select --</option>
                    <option>AB</option><option>BC</option><option>MB</option>
                    <option>NB</option><option>NL</option><option>NS</option>
                    <option>ON</option><option>PE</option><option>QC</option>
                    <option>SK</option><option>NT</option><option>NU</option><option>YT</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Postal Code</label>
                  <input class="form-control" name="postalCode" placeholder="A1A 1A1">
                </div>
              </div>
            </div>

            <div class="form-section">
              <div class="form-section-title">📝 Project Notes</div>
              <div class="form-group">
                <label class="form-label">Notes / Special Instructions</label>
                <textarea class="form-control" name="projectNotes" rows="4" placeholder="Gate location, terrain, access notes…"></textarea>
              </div>
            </div>

            <div class="wizard-nav">
              <button type="button" class="btn btn-ghost" onclick="switchTab('dashboard')">← Cancel</button>
              <button type="button" class="btn btn-primary" onclick="TabNewProject.save()">Save &amp; Continue to Estimate →</button>
            </div>
          </form>
        </div>
      </div>`;

    // Pre-fill from last session
    const last = Storage.getLastCustomerFields();
    Object.entries(last).forEach(([k, v]) => {
      const input = document.querySelector(`[name="${k}"]`);
      if (input) input.value = v;
    });

    Validation.attachRealtime(document.getElementById('newProjectForm'));
  }

  function save() {
    const form = document.getElementById('newProjectForm');
    const { valid } = Validation.validateForm(form);
    if (!valid) {
      UI.showToast('Please fix the errors above before continuing.', 'error');
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    data.projectId = state.projectId;
    Storage.saveCurrentProject(data);
    Storage.saveCustomerFields(data);
    UI.showToast('Project saved! Moving to estimate wizard…', 'success');
    switchTab('estimate');
  }

  function init() { render(); }

  return { init, render, save };
})();

window.TabNewProject = TabNewProject;
