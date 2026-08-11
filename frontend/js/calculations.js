
const Calculations = (() => {
  const toNumber = (value) => Number.parseFloat(value || 0) || 0;
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  function materialCost(items = []) {
    return items.reduce((sum, item) => sum + toNumber(item.quantity) * toNumber(item.unitCost), 0);
  }

  function laborCost(hours, rate) { return toNumber(hours) * toNumber(rate); }
  function equipmentCost(hours, rate) { return toNumber(hours) * toNumber(rate); }
  function taxCost(subtotal, taxRate) { return toNumber(subtotal) * (toNumber(taxRate) / 100); }

  function totalCost({ materials = 0, labor = 0, equipment = 0, tax = 0, extras = 0 }) {
    return [materials, labor, equipment, tax, extras].reduce((sum, n) => sum + toNumber(n), 0);
  }

  function changeOrderTotal(baseTotal, changeDelta) { return toNumber(baseTotal) + toNumber(changeDelta); }

  function updateEstimateView(data) {
    const rows = {
      Materials: materialCost(data.materialItems || []),
      Labor: laborCost(data.laborHours, data.laborRate),
      Equipment: equipmentCost(data.equipmentHours, data.equipmentRate)
    };
    const subtotal = rows.Materials + rows.Labor + rows.Equipment;
    rows.Tax = taxCost(subtotal, data.taxRate || 0);
    rows.Total = totalCost({ materials: rows.Materials, labor: rows.Labor, equipment: rows.Equipment, tax: rows.Tax, extras: data.extras || 0 });

    const body = document.getElementById('estimate-summary');
    if (body) {
      body.replaceChildren();
      Object.entries(rows).forEach(([name, amount]) => {
        const tr = document.createElement('tr');
        const nameCell = document.createElement('td');
        const amountCell = document.createElement('td');
        nameCell.textContent = name;
        amountCell.textContent = currency.format(amount);
        tr.append(nameCell, amountCell);
        body.appendChild(tr);
      });
    }

    return rows;
  }

  return {
    materialCost,
    laborCost,
    equipmentCost,
    taxCost,
    totalCost,
    changeOrderTotal,
    updateEstimateView,
    formatCurrency: (value) => currency.format(toNumber(value))
  };
})();
