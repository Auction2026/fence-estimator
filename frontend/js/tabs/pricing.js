// TAB 5: PRICING
function pricingTabRefresh() {
  const s = state.pricingSettings || {};
  ['defaultMarkup','laborOverhead','taxRate','minJobCharge'].forEach(id => {
    const el = document.getElementById(id);
    if (el && s[id.replace('default','').toLowerCase()]) el.value = s[id];
  });
  renderPricingTable();
}

function renderPricingTable() {
  const tbody = document.getElementById('pricingTableBody');
  tbody.innerHTML = Object.entries(FENCE_PRICING).map(([type, p]) => `
    <tr>
      <td style="text-transform:capitalize">${type.replace(/-/g,' ')}</td>
      <td>$${p.material.toFixed(2)}</td>
      <td>$${p.labor.toFixed(2)}</td>
      <td><strong>$${(p.material + p.labor).toFixed(2)}</strong></td>
    </tr>`).join('');
}
