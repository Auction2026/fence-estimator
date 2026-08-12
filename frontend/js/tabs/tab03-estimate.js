/**
 * TAB 03 - ESTIMATE WIZARD
 * 5-step wizard: customer → fence type → dimensions → materials → summary
 */
'use strict';

const TabEstimate = (() => {

  let currentStep = 1;
  const TOTAL_STEPS = 5;

  const estimateState = {
    projectId:     null,
    customerName:  '',
    customerEmail: '',
    customerPhone: '',
    address:       '',
    city:          '',
    province:      '',
    postalCode:    '',
    fenceType:     '',
    heightFt:      6,
    color:         '',
    footage:       0,
    gates:         [],
    laborIncluded: true,
    taxRate:       0.05,
    notes:         '',
  };

  // ─────────────────────────────────────────
  function render() {
    const el = document.getElementById('estimate-tab');
    if (!el) return;

    // Merge saved project data
    const saved = Storage.getCurrentProject();
    if (saved) Object.assign(estimateState, saved);

    el.innerHTML = `
      <div class="wizard-container">
        <h2 style="margin-bottom:24px">📝 New Estimate</h2>
        <div class="wizard-progress" id="wizardProgress">${buildProgress()}</div>
        <div id="wizardPanels">
          ${buildStep1()}
          ${buildStep2()}
          ${buildStep3()}
          ${buildStep4()}
          ${buildStep5()}
        </div>
      </div>`;

    showStep(currentStep);
  }

  function buildProgress() {
    const labels = ['Customer', 'Fence Type', 'Dimensions', 'Materials', 'Summary'];
    return labels.map((lbl, i) => `
      <div class="wizard-step" id="progressStep${i+1}">
        <div class="step-circle">${i+1}</div>
        <div class="step-label">${lbl}</div>
      </div>`).join('');
  }

  // ── STEP 1: Customer info ──────────────────────────────
  function buildStep1() {
    return `
      <div class="wizard-panel card" id="wizardStep1">
        <div class="card-body">
          <h3 class="mb-20">👤 Step 1: Customer Information</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Customer Name <span class="required">*</span></label>
              <input class="form-control" id="est_customerName" placeholder="Full name" value="${UI.escapeHtml(estimateState.customerName)}">
            </div>
            <div class="form-group">
              <label class="form-label">Email <span class="required">*</span></label>
              <input class="form-control" id="est_customerEmail" type="email" placeholder="email@example.com" value="${UI.escapeHtml(estimateState.customerEmail)}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Phone <span class="required">*</span></label>
              <input class="form-control" id="est_customerPhone" placeholder="(555) 123-4567" value="${UI.escapeHtml(estimateState.customerPhone)}">
            </div>
            <div class="form-group">
              <label class="form-label">Address <span class="required">*</span></label>
              <input class="form-control" id="est_address" placeholder="123 Main St" value="${UI.escapeHtml(estimateState.address)}">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">City</label>
              <input class="form-control" id="est_city" placeholder="City" value="${UI.escapeHtml(estimateState.city)}">
            </div>
            <div class="form-group">
              <label class="form-label">Province</label>
              <select class="form-control" id="est_province">
                ${['AB','BC','MB','NB','NL','NS','ON','PE','QC','SK'].map(p =>
                  `<option${p===estimateState.province?' selected':''}>${p}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Postal Code</label>
              <input class="form-control" id="est_postalCode" placeholder="A1A 1A1" value="${UI.escapeHtml(estimateState.postalCode)}">
            </div>
          </div>
        </div>
        ${navRow(null, 2)}
      </div>`;
  }

  // ── STEP 2: Fence Type ─────────────────────────────────
  function buildStep2() {
    const types = [
      { value:'chain-link', icon:'⛓️', label:'Chain Link' },
      { value:'wood',       icon:'🪵', label:'Wood' },
      { value:'aluminum',   icon:'🔩', label:'Aluminum' },
      { value:'vinyl',      icon:'🏠', label:'Vinyl PVC' },
    ];
    const heights = [4,5,6,7,8];
    const colors  = [
      { value:'galvanized',  label:'Galvanized Silver' },
      { value:'black',       label:'Black' },
      { value:'green',       label:'Forest Green' },
      { value:'brown',       label:'Brown' },
      { value:'white',       label:'White' },
    ];
    return `
      <div class="wizard-panel card" id="wizardStep2">
        <div class="card-body">
          <h3 class="mb-20">🏗️ Step 2: Fence Type &amp; Style</h3>
          <div class="form-section">
            <div class="form-section-title">Fence Material</div>
            <div class="option-grid">
              ${types.map(t => `
                <div class="option-btn${estimateState.fenceType===t.value?' selected':''}"
                     data-value="${t.value}"
                     onclick="TabEstimate.selectFenceType(this,'${t.value}')">
                  <span class="option-icon">${t.icon}</span>${t.label}
                </div>`).join('')}
            </div>
          </div>
          <div class="form-row mt-20">
            <div class="form-group">
              <label class="form-label">Fence Height</label>
              <select class="form-control" id="est_height">
                ${heights.map(h => `<option value="${h}"${h===estimateState.heightFt?' selected':''}>${h} ft</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Color / Finish</label>
              <select class="form-control" id="est_color">
                ${colors.map(c => `<option value="${c.value}"${c.value===estimateState.color?' selected':''}>${c.label}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
        ${navRow(1, 3)}
      </div>`;
  }

  // ── STEP 3: Dimensions & Gates ─────────────────────────
  function buildStep3() {
    return `
      <div class="wizard-panel card" id="wizardStep3">
        <div class="card-body">
          <h3 class="mb-20">📏 Step 3: Dimensions &amp; Gates</h3>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Total Linear Footage <span class="required">*</span></label>
              <input class="form-control" id="est_footage" type="number" min="1" max="9999" placeholder="e.g. 150" value="${estimateState.footage||''}">
              <div class="form-hint">Measure all sides of the property you want fenced.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Number of Gates</label>
              <select class="form-control" id="est_gateCount" onchange="TabEstimate.updateGateFields()">
                ${[0,1,2,3,4,5].map(n=>`<option${n===estimateState.gates.length?' selected':''}>${n}</option>`).join('')}
              </select>
            </div>
          </div>
          <div id="gateFields"></div>
          <div class="form-group mt-20">
            <label class="form-label">Include Labour?</label>
            <select class="form-control" id="est_labor">
              <option value="yes"${estimateState.laborIncluded?' selected':''}>Yes — Include labour costs</option>
              <option value="no"${!estimateState.laborIncluded?' selected':''}>No — Materials only</option>
            </select>
          </div>
        </div>
        ${navRow(2, 4)}
      </div>`;
  }

  // ── STEP 4: Materials Breakdown ─────────────────────────
  function buildStep4() {
    return `
      <div class="wizard-panel card" id="wizardStep4">
        <div class="card-body">
          <h3 class="mb-20">🧱 Step 4: Materials Breakdown</h3>
          <div id="materialsTable"><p class="text-muted">Click "Calculate" to generate the materials list.</p></div>
          <button class="btn btn-primary mt-20" onclick="TabEstimate.calculateMaterials()">🔄 Calculate Materials</button>
        </div>
        ${navRow(3, 5)}
      </div>`;
  }

  // ── STEP 5: Summary ─────────────────────────────────────
  function buildStep5() {
    return `
      <div class="wizard-panel card" id="wizardStep5">
        <div class="card-body">
          <h3 class="mb-20">✅ Step 5: Estimate Summary</h3>
          <div id="estimateSummary"><p class="text-muted">Summary will appear after completing Step 4.</p></div>
          <div class="form-group mt-20">
            <label class="form-label">Additional Notes</label>
            <textarea class="form-control" id="est_notes" rows="3" placeholder="Warranty, timeline, special terms…">${UI.escapeHtml(estimateState.notes)}</textarea>
          </div>
        </div>
        <div class="card-footer" style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-ghost" onclick="TabEstimate.prevStep()">← Back</button>
          <button class="btn btn-primary" onclick="TabEstimate.saveEstimate()">💾 Save Estimate</button>
          <button class="btn btn-accent" onclick="TabEstimate.generatePDF()">📄 Generate PDF</button>
          <button class="btn btn-success" onclick="TabEstimate.emailEstimate()">📧 Email to Customer</button>
        </div>
      </div>`;
  }

  function navRow(prevStep, nextStep) {
    return `
      <div class="card-footer wizard-nav">
        ${prevStep ? `<button class="btn btn-ghost" onclick="TabEstimate.goToStep(${prevStep})">← Back</button>` : '<span></span>'}
        ${nextStep ? `<button class="btn btn-primary" onclick="TabEstimate.goToStep(${nextStep})">Next →</button>` : ''}
      </div>`;
  }

  // ─────────────────────────────────────────
  // NAV LOGIC
  // ─────────────────────────────────────────
  function showStep(n) {
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const panel = document.getElementById(`wizardStep${i}`);
      const prog  = document.getElementById(`progressStep${i}`);
      if (panel) panel.classList.toggle('active', i === n);
      if (prog) {
        prog.classList.remove('active','done');
        if (i === n) prog.classList.add('active');
        else if (i < n) prog.classList.add('done');
      }
    }
    currentStep = n;
  }

  function goToStep(n) {
    collectCurrentStep();
    const { valid, errors } = Validation.validateEstimateStep(currentStep, estimateState);
    if (!valid) {
      UI.showToast(errors[0], 'error');
      return;
    }
    if (n === 4) calculateMaterials();
    showStep(n);
    window.scrollTo(0,0);
  }

  function prevStep() { showStep(Math.max(1, currentStep - 1)); }

  // ─────────────────────────────────────────
  // DATA COLLECTION
  // ─────────────────────────────────────────
  function collectCurrentStep() {
    const v = (id) => { const e = document.getElementById(id); return e ? e.value : ''; };
    switch (currentStep) {
      case 1:
        estimateState.customerName  = v('est_customerName');
        estimateState.customerEmail = v('est_customerEmail');
        estimateState.customerPhone = v('est_customerPhone');
        estimateState.address       = v('est_address');
        estimateState.city          = v('est_city');
        estimateState.province      = v('est_province');
        estimateState.postalCode    = v('est_postalCode');
        break;
      case 2:
        estimateState.heightFt = Number(v('est_height')) || 6;
        estimateState.color    = v('est_color');
        break;
      case 3:
        estimateState.footage       = Number(v('est_footage')) || 0;
        estimateState.laborIncluded = v('est_labor') === 'yes';
        estimateState.gates = [];
        const gateCount = Number(v('est_gateCount')) || 0;
        for (let i = 0; i < gateCount; i++) {
          estimateState.gates.push({ width: Number(v(`gateWidth_${i}`)) || 4 });
        }
        break;
      case 5:
        estimateState.notes = v('est_notes');
        break;
    }
  }

  function selectFenceType(el, type) {
    estimateState.fenceType = type;
    document.querySelectorAll('#wizardStep2 .option-btn').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
  }

  function updateGateFields() {
    const count  = Number(document.getElementById('est_gateCount').value) || 0;
    const target = document.getElementById('gateFields');
    if (!target) return;
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="form-row mt-10" style="background:var(--neutral-light);padding:12px;border-radius:8px">
          <div class="form-group">
            <label class="form-label">Gate ${i+1} — Width (ft)</label>
            <select class="form-control" id="gateWidth_${i}">
              ${[3,4,5,6,8,10,12,16].map(w=>`<option value="${w}">${w} ft</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Gate Style</label>
            <select class="form-control">
              <option>Single Swing</option>
              <option>Double Swing</option>
              <option>Slide Gate</option>
            </select>
          </div>
        </div>`;
    }
    target.innerHTML = html;
  }

  // ─────────────────────────────────────────
  // CALCULATION
  // ─────────────────────────────────────────
  function calculateMaterials() {
    collectCurrentStep();
    if (!estimateState.footage || !estimateState.fenceType) {
      UI.showToast('Please complete Steps 2 and 3 first.', 'warning');
      return;
    }
    const result = Calculations.calculateMaterials(estimateState);
    estimateState._result = result;
    renderMaterialsTable(result);
    renderSummary(result);
  }

  function renderMaterialsTable(result) {
    const el = document.getElementById('materialsTable');
    if (!el) return;
    const rows = result.items.map(i => `
      <tr>
        <td>${UI.escapeHtml(i.plu||'')}</td>
        <td>${UI.escapeHtml(i.description)}</td>
        <td class="td-center">${UI.escapeHtml(i.category||'')}</td>
        <td class="td-right">${i.qty}</td>
        <td class="td-right">${formatCurrency(i.unitPrice)}</td>
        <td class="td-right"><strong>${formatCurrency(i.totalPrice)}</strong></td>
      </tr>`).join('');
    el.innerHTML = `
      <div class="table-wrapper">
        <table class="data-table">
          <thead><tr><th>PLU</th><th>Description</th><th>Category</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr><td colspan="5" class="td-right">Subtotal</td><td class="td-right">${formatCurrency(result.subtotal)}</td></tr>
            <tr><td colspan="5" class="td-right">GST/HST (${(result.taxRate*100).toFixed(0)}%)</td><td class="td-right">${formatCurrency(result.tax)}</td></tr>
            <tr><td colspan="5" class="td-right text-bold">TOTAL</td><td class="td-right text-bold" style="font-size:16px;color:var(--primary)">${formatCurrency(result.total)}</td></tr>
          </tfoot>
        </table>
      </div>`;
  }

  function renderSummary(result) {
    const el = document.getElementById('estimateSummary');
    if (!el) return;
    const p   = estimateState;
    const labour = Calculations.calcLabour(p.footage, p.fenceType);
    const labourAmt = p.laborIncluded ? labour.labour : 0;
    const grandTotal = result.total + labourAmt;
    el.innerHTML = `
      <div class="estimate-doc" style="margin:0;padding:30px">
        <div class="doc-header">
          <div><div class="doc-logo">🏗️</div><div class="doc-title">FENCE DEPOT</div></div>
          <div style="text-align:right"><div class="doc-title" style="font-size:24px">ESTIMATE</div><div class="doc-num">${generateId()}</div><div class="doc-num">Date: ${new Date().toLocaleDateString('en-CA')}</div></div>
        </div>
        <div class="doc-parties">
          <div><div class="party-label">Bill To</div><div class="party-name">${UI.escapeHtml(p.customerName)}</div><div>${UI.escapeHtml(p.address)}, ${UI.escapeHtml(p.city)} ${UI.escapeHtml(p.province)}</div><div>${UI.escapeHtml(p.customerEmail)}</div><div>${UI.escapeHtml(p.customerPhone)}</div></div>
          <div><div class="party-label">Fence Details</div><div><strong>Type:</strong> ${UI.escapeHtml(p.fenceType)}</div><div><strong>Height:</strong> ${p.heightFt} ft</div><div><strong>Footage:</strong> ${p.footage} linear ft</div><div><strong>Gates:</strong> ${p.gates.length}</div></div>
        </div>
        <table class="data-table" style="margin-bottom:20px"><thead><tr><th>Description</th><th class="td-right">Amount</th></tr></thead>
          <tbody>
            <tr><td>Materials — ${UI.escapeHtml(p.fenceType)} fence (${p.footage} linear ft)</td><td class="td-right">${formatCurrency(result.subtotal)}</td></tr>
            ${p.laborIncluded?`<tr><td>Labour — Installation (${labour.crewHours} crew hours estimated)</td><td class="td-right">${formatCurrency(labourAmt)}</td></tr>`:''}
            <tr><td>GST/HST</td><td class="td-right">${formatCurrency(result.tax)}</td></tr>
          </tbody>
          <tfoot><tr><td class="td-right text-bold" style="font-size:18px">TOTAL</td><td class="td-right text-bold" style="font-size:18px;color:var(--primary)">${formatCurrency(grandTotal)}</td></tr></tfoot>
        </table>
        ${p.notes?`<p style="font-size:13px;color:#555"><strong>Notes:</strong> ${UI.escapeHtml(p.notes)}</p>`:''}
        <p style="font-size:12px;color:#888;margin-top:20px">This estimate is valid for 30 days from the date issued.</p>
      </div>`;
  }

  // ─────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────
  function saveEstimate() {
    collectCurrentStep();
    const estimate = { ...estimateState, estimateId: generateId(), createdAt: new Date().toISOString() };
    Storage.saveCurrentEstimate(estimate);
    UI.showToast('Estimate saved successfully!', 'success');
  }

  function generatePDF() {
    UI.showToast('📄 PDF generation requires the backend server. Starting download…', 'info');
    // In production: call API.Estimates.pdf(estimateId)
  }

  function emailEstimate() {
    if (!estimateState.customerEmail) {
      UI.showToast('Please enter a customer email address first.', 'error');
      return;
    }
    UI.showToast(`📧 Estimate emailed to ${estimateState.customerEmail}`, 'success');
    // In production: call API.Estimates.email(estimateId, estimateState.customerEmail)
  }

  function init() {
    currentStep = 1;
    render();
  }

  return { init, render, goToStep, prevStep, selectFenceType, updateGateFields, calculateMaterials, saveEstimate, generatePDF, emailEstimate };
})();

window.TabEstimate = TabEstimate;
