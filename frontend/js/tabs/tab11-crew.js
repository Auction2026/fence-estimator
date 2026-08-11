(function () {
  const MODULE = {
    app: null,

    init(app) {
      this.app = app;
      document.getElementById('add-crew-member-btn')?.addEventListener('click', () => this.addMember());
      document.getElementById('foremanName')?.addEventListener('input', () => this.captureForeman());
      this.loadFromState();
    },

    captureForeman() {
      this.app.updateSection('crew', {
        ...(this.app.state.crew || {}),
        foreman: document.getElementById('foremanName')?.value || '',
        members: this.app.state.crew.members || []
      });
    },

    addMember() {
      const name = document.getElementById('crewMemberName')?.value?.trim();
      const role = document.getElementById('crewMemberRole')?.value?.trim();
      const hours = Number(document.getElementById('crewMemberHours')?.value || 0);
      if (!name) {
        UI.showNotification('Crew member name is required.', 'warning');
        return;
      }
      const members = [...(this.app.state.crew.members || []), {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        name,
        role,
        hours
      }];
      this.app.updateSection('crew', { foreman: document.getElementById('foremanName')?.value || '', members });
      document.getElementById('crewMemberName').value = '';
      document.getElementById('crewMemberRole').value = '';
      document.getElementById('crewMemberHours').value = '8';
      this.render();
    },

    removeMember(id) {
      const members = (this.app.state.crew.members || []).filter((member) => member.id !== id);
      this.app.updateSection('crew', { ...this.app.state.crew, members });
      this.render();
    },

    render() {
      const body = document.querySelector('#crew-table tbody');
      const members = this.app.state.crew.members || [];
      body.innerHTML = '';
      if (!members.length) {
        body.innerHTML = '<tr><td colspan="4">No crew members assigned.</td></tr>';
        return;
      }
      members.forEach((member) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${member.name}</td>
          <td>${member.role || ''}</td>
          <td>${member.hours}</td>
          <td><button class="btn btn-danger" type="button">Remove</button></td>`;
        row.querySelector('button').addEventListener('click', () => this.removeMember(member.id));
        body.appendChild(row);
      });
    },

    loadFromState() {
      const crew = this.app.state.crew || {};
      document.getElementById('foremanName').value = crew.foreman || '';
      this.render();
    }
  };
  window.FenceEstimatorTabs = window.FenceEstimatorTabs || {};
  window.FenceEstimatorTabs.crew = MODULE;
})();
