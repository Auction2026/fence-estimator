const NAMESPACE = 'fence-estimator';
const VERSION = '2026.08';
const KEYS = {
  draftEstimate: `${NAMESPACE}:draft-estimate`,
  projects: `${NAMESPACE}:projects`,
  settings: `${NAMESPACE}:settings`,
  preferences: `${NAMESPACE}:preferences`,
  session: `${NAMESPACE}:session`,
  analyticsCache: `${NAMESPACE}:analytics-cache`,
  activityFeed: `${NAMESPACE}:activity-feed`,
};

function canUseStorage() {
  try {
    if (typeof localStorage === 'undefined') return false;
    const probe = `${NAMESPACE}:probe`;
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function safeParse(value, fallback = null) {
  if (!value) return fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

function nowIso() {
  return new Date().toISOString();
}

function write(key, value) {
  if (!canUseStorage()) return false;
  localStorage.setItem(key, JSON.stringify({ version: VERSION, savedAt: nowIso(), value }));
  return true;
}

function read(key, fallback = null) {
  if (!canUseStorage()) return fallback;
  const parsed = safeParse(localStorage.getItem(key));
  if (!parsed || parsed.version !== VERSION) return fallback;
  return parsed.value ?? fallback;
}

function remove(key) {
  if (canUseStorage()) localStorage.removeItem(key);
}

export const storage = {
  canUseStorage,
  write,
  read,
  remove,
  saveDraftEstimate: (draft) => write(KEYS.draftEstimate, draft),
  loadDraftEstimate: () => read(KEYS.draftEstimate, null),
  clearDraftEstimate: () => remove(KEYS.draftEstimate),
  saveProjects: (projects) => write(KEYS.projects, Array.isArray(projects) ? projects : []),
  loadProjects: () => read(KEYS.projects, []),
  saveSettings: (settings) => write(KEYS.settings, settings),
  loadSettings: (defaults = {}) => ({ ...defaults, ...(read(KEYS.settings, {}) || {}) }),
  savePreferences: (preferences) => write(KEYS.preferences, preferences),
  loadPreferences: (defaults = {}) => ({ ...defaults, ...(read(KEYS.preferences, {}) || {}) }),
  saveSession: (session) => write(KEYS.session, session),
  loadSession: (defaults = {}) => ({ ...defaults, ...(read(KEYS.session, {}) || {}) }),
  cacheAnalytics: (payload) => write(KEYS.analyticsCache, payload),
  loadAnalyticsCache: () => read(KEYS.analyticsCache, null),
  appendActivity(activity) {
    const current = read(KEYS.activityFeed, []);
    current.unshift({ id: globalThis.crypto?.randomUUID?.() || String(Date.now()), savedAt: nowIso(), ...activity });
    return write(KEYS.activityFeed, current.slice(0, 50));
  },
  loadActivityFeed: () => read(KEYS.activityFeed, []),
  resetAll() { Object.values(KEYS).forEach(remove); },
};

export function createRecentTabTracker(maxItems = 8) {
  const key = `${NAMESPACE}:recent-tabs`;
  return {
    push(tabId) {
      const recentTabs = read(key, []);
      const next = [tabId, ...recentTabs.filter((value) => value !== tabId)].slice(0, maxItems);
      write(key, next);
      return next;
    },
    load: () => read(key, []),
    clear: () => remove(key),
  };
}

export function createDraftCollection(collectionKey) {
  const key = `${NAMESPACE}:${collectionKey}`;
  return {
    all: () => read(key, []),
    upsert(item, idField = 'id') {
      const items = read(key, []);
      const index = items.findIndex((entry) => entry[idField] === item[idField]);
      const next = index === -1 ? [item, ...items] : items.map((entry, entryIndex) => entryIndex === index ? { ...entry, ...item } : entry);
      write(key, next);
      return next;
    },
    remove(id, idField = 'id') {
      const items = read(key, []);
      const next = items.filter((entry) => entry[idField] !== id);
      write(key, next);
      return next;
    },
    clear: () => remove(key),
  };
}

export function migrateLegacyKeys() {
  if (!canUseStorage()) return;
  const legacyMap = { estimateDraft: KEYS.draftEstimate, estimatorSettings: KEYS.settings, estimatorPrefs: KEYS.preferences };
  Object.entries(legacyMap).forEach(([legacyKey, nextKey]) => {
    const legacyValue = localStorage.getItem(legacyKey);
    if (legacyValue && !localStorage.getItem(nextKey)) {
      localStorage.setItem(nextKey, legacyValue);
      localStorage.removeItem(legacyKey);
    }
  });
}

export function withExpiry(value, ttlMs) {
  return { value, expiresAt: Date.now() + ttlMs };
}

export function isExpired(record) {
  return Boolean(record?.expiresAt && record.expiresAt < Date.now());
}

export function saveExpiringRecord(key, value, ttlMs) {
  return write(`${NAMESPACE}:${key}`, withExpiry(value, ttlMs));
}

export function loadExpiringRecord(key, fallback = null) {
  const storageKey = `${NAMESPACE}:${key}`;
  const record = read(storageKey, null);
  if (!record || isExpired(record)) {
    remove(storageKey);
    return fallback;
  }
  return record.value;
}

migrateLegacyKeys();

if (typeof window !== 'undefined') {
  window.FenceEstimatorStorage = storage;
}
