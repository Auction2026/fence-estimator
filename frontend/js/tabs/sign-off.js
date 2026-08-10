// TAB 10: SIGN-OFF
function signOffTabRefresh() { populateSignOffDropdown(); }

function signOffTabLoad(id) {
  const el = document.getElementById('signOffContent');
  if (!id) { el.innerHTML = ''; return; }
  const e = getCollection('estimates').find(x => String(x.id) === String(id));
  if (!e) { el.innerHTML = '<p>Project not found.</p>'; return; }
  const safeId = Number(id);  // id is always a timestamp integer
  el.innerHTML = `
    <div class="card" style="margin-top:1rem">
      <h3>${escHtml(e.estimateNum)} — Customer Sign-Off</h3>
      <div class="summary-box">
        <div class="summary-row"><span>Customer</span><span>${escHtml(e.customer?.name)}</span></div>
        <div class="summary-row"><span>Fence Type</span><span>${escHtml(e.specs?.type)} ${escHtml(String(e.specs?.height || ''))} ft</span></div>
        <div class="summary-row"><span>Total</span><span>$${(e.costs?.total||0).toFixed(2)}</span></div>
      </div>
      <div class="form-group" style="margin-top:1rem">
        <label>Customer Signature (type full name)</label>
        <input id="customerSig" type="text" class="form-control" placeholder="Type your full name to sign" />
      </div>
      <div class="form-group">
        <label>Date</label>
        <input id="signDate" type="date" class="form-control" value="${new Date().toISOString().split('T')[0]}" />
      </div>
      <button class="btn btn-success" onclick="saveSignOff(${safeId})">✅ Confirm Sign-Off</button>
    </div>`;
}

function saveSignOff(id) {
  const sig  = document.getElementById('customerSig').value.trim();
  const date = document.getElementById('signDate').value;
  if (!sig) { app.toast('Please type your full name to sign.', 'error'); return; }
  const estimates = getCollection('estimates');
  const e = estimates.find(x => x.id === id);
  if (e) {
    e.status    = 'signed';
    e.signOff   = { signature: sig, date };
    saveCollection('estimates', estimates);
    app.toast('Sign-off recorded!', 'success');
    signOffTabLoad('');
  }
}
