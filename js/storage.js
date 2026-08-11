const KEY = 'fence_estimator_state_v1';

export function loadState() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveState(nextState) {
  localStorage.setItem(KEY, JSON.stringify(nextState));
}
