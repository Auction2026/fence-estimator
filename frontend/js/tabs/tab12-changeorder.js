(function () {
  const MODULE = {
    app: null,
    init(app) {
      this.app = app;
      document.getElementById('add-change-order-btn')?.addEventListener('click', () => this.addChangeOrder());
      this.render();
    },
    addChangeOrder() {
      const title = document.getElementById('changeTitle')?.value?.trim();
      const description = document.getElementById('changeDescription')?.value?.trim();
      const amount = Number(document.getElementById('changeAmount')?.value || 0);
      if (!title) {
        UI.showNotification('Change order title is required.', 'warning');
        return;
      }
      const orders = [...(this.app.state.changeOrders || []), {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        title,
        description,
        amount,
        status: 'Draft',
        createdAt: new Date().toISOString()
      }];
      this.app.setSection('changeOrders', orders);
      UI.clearForm('change-order-form');
      this.render();
    },
    updateStatus(id, status) {
      const orders = (this.app.state.changeOrders || []).map((order) => order.id === id ? { ...order, status } : order);
      this.app.setSection('changeOrders', orders);
      this.render();
    },
    edit(order) {
      document.getElementById('changeTitle').value = order.title;
      document.getElementById('changeDescription').value = order.description;
      document.getElementById('changeAmount').value = order.amount;
      this.app.setSection('changeOrders', (this.app.state.changeOrders || []).filter((item) => item.id !== order.id));
      this.render();
    },
    render() {
      const body = document.querySelector('#changeorder-table tbody');
      const orders = this.app.state.changeOrders || [];
      body.innerHTML = '';
      if (!orders.length) {
        body.innerHTML = '<tr><td colspan="5">No change orders logged.</td></tr>';
        return;
      }
      orders.forEach((order) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${order.title}</td>
          <td>${order.description || ''}</td>
          <td>${Calculations.formatCurrency(order.amount)}</td>
          <td>${order.status}</td>
          <td></td>`;
        const actionCell = row.lastElementChild;
        ['Edit', 'Approve', 'Reject'].forEach((action) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = `btn ${action === 'Reject' ? 'btn-danger' : 'btn-secondary'}`;
          button.textContent = action;
          button.addEventListener('click', () => {
            if (action === 'Edit') this.edit(order);
            if (action === 'Approve') this.updateStatus(order.id, 'Approved');
            if (action === 'Reject') this.updateStatus(order.id, 'Rejected');
          });
          actionCell.appendChild(button);
        });
        body.appendChild(row);
      });
    }
  };
  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.changeOrders = MODULE;
})();
