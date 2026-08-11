
const STORAGE_KEYS = {
  PROJECT: 'fence_project',
  SPECS: 'fence_specs',
  ESTIMATE: 'fence_estimate',
  USER: 'fence_user',
  TAB_STATE: 'fence_tab_state',
  NOTES: 'fence_notes',
  DRAWING: 'fence_drawing',
  AUTO_SAVE_ENABLED: 'auto_save_enabled'
};

let autoSaveHandle = null;

function safeParse(data, fallback = null) {
  try {
    return data ? JSON.parse(data) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getJSON(key, fallback = null) {
  return safeParse(localStorage.getItem(key), fallback);
}

function saveProject(projectData) {
  saveJSON(STORAGE_KEYS.PROJECT, projectData);
}

function getProject() {
  return getJSON(STORAGE_KEYS.PROJECT, null);
}

function saveSpecs(specsData) {
  saveJSON(STORAGE_KEYS.SPECS, specsData);
}

function getSpecs() {
  return getJSON(STORAGE_KEYS.SPECS, null);
}

function saveEstimate(estimateData) {
  saveJSON(STORAGE_KEYS.ESTIMATE, estimateData);
}

function getEstimate() {
  return getJSON(STORAGE_KEYS.ESTIMATE, null);
}

function saveUser(userData) {
  saveJSON(STORAGE_KEYS.USER, userData);
}

function getUser() {
  return getJSON(STORAGE_KEYS.USER, null);
}

function saveNotes(notes) {
  saveJSON(STORAGE_KEYS.NOTES, notes);
}

function getNotes() {
  return getJSON(STORAGE_KEYS.NOTES, []);
}

function saveDrawing(drawingData) {
  saveJSON(STORAGE_KEYS.DRAWING, drawingData);
}

function getDrawing() {
  return getJSON(STORAGE_KEYS.DRAWING, []);
}

function saveTabState(state) {
  saveJSON(STORAGE_KEYS.TAB_STATE, state);
}

function getAllState() {
  return {
    project: getProject(),
    specs: getSpecs(),
    estimate: getEstimate(),
    user: getUser(),
    notes: getNotes(),
    drawing: getDrawing(),
    tabs: getJSON(STORAGE_KEYS.TAB_STATE, {})
  };
}

function enableAutoSave(callback, intervalMs = 30000) {
  disableAutoSave();
  localStorage.setItem(STORAGE_KEYS.AUTO_SAVE_ENABLED, 'true');
  autoSaveHandle = window.setInterval(() => {
    if (typeof callback === 'function') {
      callback();
    }
  }, intervalMs);
}

function disableAutoSave() {
  if (autoSaveHandle) {
    window.clearInterval(autoSaveHandle);
    autoSaveHandle = null;
  }
}

function clearAllStorage() {
  disableAutoSave();
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

window.FenceStorage = {
  STORAGE_KEYS,
  saveProject,
  getProject,
  saveSpecs,
  getSpecs,
  saveEstimate,
  getEstimate,
  saveUser,
  getUser,
  saveNotes,
  getNotes,
  saveDrawing,
  getDrawing,
  saveTabState,
  getAllState,
  enableAutoSave,
  disableAutoSave,
  clearAllStorage
};
