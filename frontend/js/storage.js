
const StorageModule = (() => {
  const KEY = 'fence-estimator-project';
  const SESSION_KEY = 'fence-estimator-session';
  let autosaveTimer = null;

  const init = () => startAutoSave();

  function saveProjectData(data) {
    const existing = loadProjectData();
    const merged = { ...existing, ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(merged));
    return merged;
  }

  function loadProjectData() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch { return {}; }
  }

  function clearProjectData() {
    localStorage.removeItem(KEY);
  }

  function saveSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session || {}));
  }

  function loadSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch { return null; }
  }

  function startAutoSave() {
    if (autosaveTimer) clearInterval(autosaveTimer);
    autosaveTimer = setInterval(() => {
      const form = document.getElementById('project-form');
      if (!form) return;
      const payload = Object.fromEntries(new FormData(form).entries());
      saveProjectData(payload);
    }, 15000);
  }

  return { init, saveProjectData, loadProjectData, clearProjectData, saveSession, loadSession, startAutoSave };
})();
