// Crew tab
    'use strict';

    const Tab11 = {
      storageKey: 'crew-members',
      roleRates: { Foreman: 85, Installer: 65, Laborer: 45, Driver: 45 },
      roles: ['Foreman', 'Installer', 'Laborer', 'Driver'],
      init() {
        this.body = document.getElementById('crewTableBody');
        this.bindEvents();
        this.ensureSummary();
        this.load();
      },
      ensureSummary() {
        const cardBody = document.querySelector('#tab-11 .card-body');
        if (!cardBody || document.getElementById('crewCostSummary')) return;
        const summary = document.createElement('div');
        summary.id = 'crewCostSummary';
        summary.className = 'totals-row grand-total mt-3';
        summary.innerHTML = '<span>Estimated Crew Cost</span><strong>$0.00</strong>';
        cardBody.appendChild(summary);
      },
      bindEvents() {
        const addButton = document.getElementById('addCrewBtn');
        const saveButton = document.getElementById('saveCrewBtn');
        if (addButton) addButton.addEventListener('click', () => this.addMember());
        if (saveButton) saveButton.addEventListener('click', () => this.save(true));
        if (!this.body) return;
        this.body.addEventListener('click', (event) => {
          const button = event.target.closest('[data-delete-member]');
          if (button) this.deleteMember(Number(button.dataset.deleteMember));
        });
        this.body.addEventListener('input', App.debounce(() => {
          this.syncFromDom();
          this.renderTable();
          this.save(false);
        }, 200));
      },
      defaultMember() {
        return { name: '', role: 'Installer', phone: '', scheduledDays: '', assignedTasks: '' };
      },
      normalizeMembers(members) {
        return (members || []).map((member) => Object.assign(this.defaultMember(), member));
      },
      getRoleRate(role) {
        return this.roleRates[role] || this.roleRates.Installer;
      },
      projectedHours(member) {
        return this.daysCount(member.scheduledDays) * 8;
      },
      memberLabel(member) {
        return `${member.name || 'Unassigned'} (${member.role || 'Installer'})`;
      },
      addMember(member = {}) {
        AppState.crewMembers = this.normalizeMembers(AppState.crewMembers);
        AppState.crewMembers.push(Object.assign(this.defaultMember(), member));
        this.renderTable();
        this.save(false);
      },
      deleteMember(index) {
        AppState.crewMembers.splice(index, 1);
        this.renderTable();
        this.save(false);
      },
      syncFromDom() {
        if (!this.body) return;
        AppState.crewMembers = Array.from(this.body.querySelectorAll('tr[data-crew-row]')).map((row) => ({
          name: row.querySelector('[data-field="name"]').value,
          role: row.querySelector('[data-field="role"]').value,
          phone: row.querySelector('[data-field="phone"]').value,
          scheduledDays: row.querySelector('[data-field="scheduledDays"]').value,
          assignedTasks: row.querySelector('[data-field="assignedTasks"]').value
        }));
      },
      daysCount(text) {
        return String(text || '').split(/[;,\n]+/).map((part) => part.trim()).filter(Boolean).length || (String(text || '').trim() ? 1 : 0);
      },
      roleSummary() {
        return this.roles.map((role) => {
          const count = (AppState.crewMembers || []).filter((member) => member.role === role).length;
          return `${role}: ${count}`;
        }).join(' • ');
      },
      calculateCrewCost() {
        return (AppState.crewMembers || []).reduce((sum, member) => {
          return sum + (this.projectedHours(member) * this.getRoleRate(member.role));
        }, 0);
      },
      renderTable() {
        if (!this.body) return;
        const members = this.normalizeMembers(AppState.crewMembers);
        AppState.crewMembers = members;
        this.body.innerHTML = members.map((member, index) => `
          <tr data-crew-row="${index}" title="${this.memberLabel(member)}">
            <td><input class="form-control" data-field="name" value="${member.name || ''}"></td>
            <td><select class="form-control" data-field="role">${this.roles.map((role) => `<option value="${role}" ${member.role === role ? 'selected' : ''}>${role}</option>`).join('')}</select></td>
            <td><input class="form-control" data-field="phone" value="${member.phone || ''}"></td>
            <td><input class="form-control" data-field="scheduledDays" value="${member.scheduledDays || ''}"></td>
            <td><input class="form-control" data-field="assignedTasks" value="${member.assignedTasks || ''}"></td>
            <td><button type="button" class="btn btn-danger btn-sm" data-delete-member="${index}">Delete</button></td>
          </tr>`).join('');
        if (!members.length) this.body.innerHTML = '<tr><td colspan="6">No crew members assigned.</td></tr>';
        const summary = document.querySelector('#crewCostSummary');
        if (summary) summary.innerHTML = `<span>${this.roleSummary()}</span><strong>${Calculator.formatCurrency(this.calculateCrewCost())}</strong>`;
      },
      load() {
        const members = Storage.load(this.storageKey) || AppState.crewMembers || [];
        AppState.crewMembers = this.normalizeMembers(members);
        this.renderTable();
      },
      save(showToast = true) {
        Storage.save(this.storageKey, this.normalizeMembers(AppState.crewMembers));
        if (showToast) UI.showNotification('Crew plan saved.', 'success');
        return true;
      },
      validate() {
        return true;
      }
    };

    window.Tab11 = Tab11;
