(function () {
  const MODULE = {
    app: null,
    formId: 'extras-form',
    init(app) {
      this.app = app;
      document.getElementById('add-extra-btn')?.addEventListener('click', () => this.addItem());
      this.render();
    },
    addItem(itemOverride = null) {
      const data = itemOverride || UI.getFormData(this.formId);
      if (!data.extraName) {
        UI.showNotification('Enter an extra item name.', 'warning');
        return;
      }
      const quantity = Number(data.extraQty || 1);
      const unitCost = Number(data.extraCost || data.price || 0);
      const item = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        name: data.extraName,
        quantity,
        unitCost,
        total: quantity * unitCost
      };
      const extras = [...(this.app.state.extras || []), item];
      this.app.setSection('extras', extras);
      UI.clearForm(this.formId);
      document.getElementById('extraQty').value = 1;
      this.render();
      document.dispatchEvent(new CustomEvent('estimate:recalculate'));
    },
    removeItem(id) {
      const extras = (this.app.state.extras || []).filter((item) => item.id !== id);
      this.app.setSection('extras', extras);
      this.render();
      document.dispatchEvent(new CustomEvent('estimate:recalculate'));
    },
    render() {
      const extras = this.app.state.extras || [];
      const body = document.querySelector('#extras-table tbody');
      body.innerHTML = '';
      if (!extras.length) {
        body.innerHTML = '<tr><td colspan="5">No extras added.</td></tr>';
      } else {
        extras.forEach((item) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${Calculations.formatCurrency(item.unitCost)}</td>
            <td>${Calculations.formatCurrency(item.total)}</td>
            <td><button class="btn btn-danger" type="button">Remove</button></td>`;
          row.querySelector('button').addEventListener('click', () => this.removeItem(item.id));
          body.appendChild(row);
        });
      }
      const total = extras.reduce((sum, item) => sum + Number(item.total || 0), 0);
      document.getElementById('extras-total').textContent = Calculations.formatCurrency(total);
    }
  };
  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.extras = MODULE;
})();
