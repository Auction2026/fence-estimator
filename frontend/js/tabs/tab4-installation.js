/**
 * tab4-installation.js – Installation Breakdown tab
 */
const Tab4Installation = (() => {
  let state;
  let tasks = [];
  let editIndex = -1;

  const STANDARD_TASKS = [
    { desc: 'Site survey and layout marking', crew: 'Foreman', hours: 2, status: 'pending' },
    { desc: 'Mark and locate utility clearances', crew: 'All', hours: 1, status: 'pending' },
    { desc: 'Dig post holes (auger)', crew: 'Crew A', hours: 4, status: 'pending' },
    { desc: 'Set posts and pour concrete', crew: 'Crew A', hours: 6, status: 'pending' },
    { desc: 'Wait for concrete cure (48 hrs)', crew: '--', hours: 0, status: 'pending' },
    { desc: 'Install top rail and tension wire', crew: 'Crew B', hours: 4, status: 'pending' },
    { desc: 'Hang fence fabric / panels', crew: 'Crew B', hours: 6, status: 'pending' },
    { desc: 'Install gates and hardware', crew: 'Crew A', hours: 3, status: 'pending' },
    { desc: 'Final inspection and cleanup', crew: 'All', hours: 2, status: 'pending' }
  ];

  function init(appState) {
    state = appState;
    tasks = Storage.loadTasks();
    renderTable();
    setupButtons();
  }

  function setupButtons() {
    document.getElementById('btn-add-task')?.addEventListener('click', () => {
      editIndex = -1;
      clearModal();
      UI.showModal('task-modal');
    });

    document.getElementById('btn-generate-tasks')?.addEventListener('click', () => {
      if (tasks.length > 0 && !UI.confirm('Replace existing tasks with standard tasks?')) return;
      tasks = STANDARD_TASKS.map(t => ({ ...t, date: '' }));
      Storage.saveTasks(tasks);
      renderTable();
      UI.showNotification('Standard tasks generated', 'success');
    });

    document.getElementById('btn-save-task')?.addEventListener('click', saveTask);
    document.getElementById('btn-cancel-task')?.addEventListener('click', () => UI.hideModal('task-modal'));
  }

  function saveTask() {
    const task = {
      desc:   UI.getValue('task-desc'),
      crew:   UI.getValue('task-crew'),
      hours:  parseFloat(UI.getValue('task-hours')) || 0,
      date:   UI.getValue('task-date'),
      status: UI.getValue('task-status')
    };
    if (!task.desc) { alert('Task description required'); return; }
    if (editIndex >= 0) tasks[editIndex] = task;
    else tasks.push(task);
    Storage.saveTasks(tasks);
    renderTable();
    UI.hideModal('task-modal');
  }

  function clearModal() {
    UI.setValue('task-desc', ''); UI.setValue('task-crew', '');
    UI.setValue('task-hours', '2'); UI.setValue('task-date', '');
    UI.setValue('task-status', 'pending');
  }

  function renderTable() {
    const tbody = document.getElementById('installation-tbody');
    if (!tbody) return;
    if (tasks.length === 0) {
      UI.setTableEmpty('installation-tbody', 'No tasks. Click "Generate Standard Tasks" or add manually.', 7);
      document.getElementById('total-hours').textContent = '0';
      return;
    }
    tbody.innerHTML = '';
    let totalHrs = 0;
    tasks.forEach((t, i) => {
      totalHrs += t.hours || 0;
      const statusBadge = `<span class="badge badge-${t.status}">${t.status}</span>`;
      UI.appendRow('installation-tbody', [
        i + 1, t.desc, t.crew || '--', t.hours || 0,
        t.date || '--', { html: statusBadge },
        { html: `<button class="btn btn-sm btn-secondary" onclick="Tab4Installation.edit(${i})">✏️</button> <button class="btn btn-sm btn-danger" onclick="Tab4Installation.remove(${i})">🗑️</button>` }
      ]);
    });
    const el = document.getElementById('total-hours');
    if (el) el.textContent = totalHrs.toFixed(1);
  }

  function edit(i) {
    editIndex = i;
    const t = tasks[i];
    UI.setValue('task-desc', t.desc); UI.setValue('task-crew', t.crew);
    UI.setValue('task-hours', t.hours); UI.setValue('task-date', t.date || '');
    UI.setValue('task-status', t.status);
    UI.showModal('task-modal');
  }

  function remove(i) {
    if (!UI.confirm('Remove this task?')) return;
    tasks.splice(i, 1);
    Storage.saveTasks(tasks);
    renderTable();
  }

  return { init, edit, remove };
})();
