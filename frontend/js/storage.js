const STORAGE_KEY = 'fenceEstimatorState';

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

function saveDraft(id, payload) {
  localStorage.setItem(`fenceDraft:${id}`, JSON.stringify(payload));
}

function loadDraft(id) {
  const raw = localStorage.getItem(`fenceDraft:${id}`);
  return raw ? JSON.parse(raw) : null;
}

window.fenceStorage = { saveState, loadState, clearState, saveDraft, loadDraft };
