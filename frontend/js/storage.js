/**
 * storage.js – Local storage persistence for Fence Estimator Pro
 * Auto-save and retrieve project data
 */

const Storage = (() => {
  const PREFIX = 'fe_';
  const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

  let autoSaveTimer = null;

  // ── Core helpers ──────────────────────────────────────────────
  function set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage.set error:', e);
      return false;
    }
  }

  function get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      console.error('Storage.get error:', e);
      return defaultValue;
    }
  }

  function remove(key) {
    localStorage.removeItem(PREFIX + key);
  }

  function clear() {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  }

  // ── Project data ──────────────────────────────────────────────
  function saveProject(data) {
    set('current_project', data);
    set('project_updated', new Date().toISOString());
  }

  function loadProject() {
    return get('current_project', {});
  }

  function saveSpecs(data) {
    set('fence_specs', data);
  }

  function loadSpecs() {
    return get('fence_specs', {});
  }

  function saveEstimate(data) {
    set('estimate', data);
  }

  function loadEstimate() {
    return get('estimate', {});
  }

  function saveContract(data) {
    set('contract', data);
  }

  function loadContract() {
    return get('contract', {});
  }

  function saveNotes(notes) {
    set('notes', notes);
  }

  function loadNotes() {
    return get('notes', []);
  }

  function saveTasks(tasks) {
    set('tasks', tasks);
  }

  function loadTasks() {
    return get('tasks', []);
  }

  function saveCrew(crew) {
    set('crew', crew);
  }

  function loadCrew() {
    return get('crew', []);
  }

  function saveExtras(extras) {
    set('extras', extras);
  }

  function loadExtras() {
    return get('extras', []);
  }

  function saveChangeOrders(cos) {
    set('change_orders', cos);
  }

  function loadChangeOrders() {
    return get('change_orders', []);
  }

  function savePermits(data) {
    set('permits', data);
  }

  function loadPermits() {
    return get('permits', {});
  }

  function saveUtilities(data) {
    set('utilities', data);
  }

  function loadUtilities() {
    return get('utilities', {});
  }

  function saveSignOff(data) {
    set('signoff', data);
  }

  function loadSignOff() {
    return get('signoff', {});
  }

  function saveMapNotes(notes) {
    set('map_notes', notes);
  }

  function loadMapNotes() {
    return get('map_notes', '');
  }

  function saveCanvas(dataUrl) {
    set('canvas_drawing', dataUrl);
  }

  function loadCanvas() {
    return get('canvas_drawing', null);
  }

  // ── Session / user ────────────────────────────────────────────
  function saveUser(user) {
    set('user', user);
  }

  function loadUser() {
    return get('user', null);
  }

  function clearUser() {
    remove('user');
    remove('token');
  }

  function saveToken(token) {
    set('token', token);
  }

  function loadToken() {
    return get('token', null);
  }

  // ── Settings ──────────────────────────────────────────────────
  function saveSettings(settings) {
    set('settings', settings);
  }

  function loadSettings() {
    return get('settings', {
      companyName: 'Fence Depot',
      taxRate: 13,
      labourRate: 65,
      mapsKey: ''
    });
  }

  // ── Auto-save ─────────────────────────────────────────────────
  function startAutoSave(callback) {
    stopAutoSave();
    autoSaveTimer = setInterval(() => {
      if (typeof callback === 'function') callback();
    }, AUTO_SAVE_INTERVAL);
  }

  function stopAutoSave() {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
  }

  // ── Estimate sequence number ──────────────────────────────────
  function nextEstimateNumber() {
    const year = new Date().getFullYear();
    const key = `est_seq_${year}`;
    const seq = get(key, 0) + 1;
    set(key, seq);
    return `EST-${year}-${String(seq).padStart(4, '0')}`;
  }

  function nextContractNumber() {
    const year = new Date().getFullYear();
    const key = `con_seq_${year}`;
    const seq = get(key, 0) + 1;
    set(key, seq);
    return `CON-${year}-${String(seq).padStart(4, '0')}`;
  }

  function nextChangeOrderNumber() {
    const key = 'co_seq';
    const seq = get(key, 0) + 1;
    set(key, seq);
    return `CO-${String(seq).padStart(3, '0')}`;
  }

  return {
    set, get, remove, clear,
    saveProject, loadProject,
    saveSpecs, loadSpecs,
    saveEstimate, loadEstimate,
    saveContract, loadContract,
    saveNotes, loadNotes,
    saveTasks, loadTasks,
    saveCrew, loadCrew,
    saveExtras, loadExtras,
    saveChangeOrders, loadChangeOrders,
    savePermits, loadPermits,
    saveUtilities, loadUtilities,
    saveSignOff, loadSignOff,
    saveMapNotes, loadMapNotes,
    saveCanvas, loadCanvas,
    saveUser, loadUser, clearUser,
    saveToken, loadToken,
    saveSettings, loadSettings,
    startAutoSave, stopAutoSave,
    nextEstimateNumber, nextContractNumber, nextChangeOrderNumber
  };
})();
