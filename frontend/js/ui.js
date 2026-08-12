function money(amount) {
  const value = Number(amount || 0);
  return `$${value.toFixed(2)}`;
}

function updateEstimateUI(estimate) {
  const ids = {
    estimateMaterials: estimate.materials,
    estimateLabor: estimate.labor,
    estimateEquipment: estimate.equipment,
    estimatePermits: estimate.permits,
    estimateExtras: estimate.extras,
    estimateSubtotal: estimate.subtotal,
    estimateTax: estimate.tax,
    estimateTotal: estimate.total,
  };

  Object.entries(ids).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) element.textContent = money(value);
  });
}

function showMessage(message, level = 'info') {
  const prefix = level.toUpperCase();
  console.log(`[${prefix}] ${message}`);
}

window.fenceUI = { updateEstimateUI, showMessage };
