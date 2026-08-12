/**
 * FENCE DEPOT ESTIMATOR - localStorage Persistence
 * storage.js
 */

'use strict';

const Storage = (() => {
  const KEYS = {
    session:         'fde_session',
    token:           'fde_token',
    estimateSeq:     'fde_estimate_seq',
    currentProject:  'fde_current_project',
    currentEstimate: 'fde_current_estimate',
    settings:        'fde_settings',
    drafts:          'fde_drafts',
  };

  // ── low-level ──────────────────────────────────────────────
  function _get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function _set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage write failed:', e);
      return false;
    }
  }

  function _remove(key) {
    localStorage.removeItem(key);
  }

  // ── session / auth ─────────────────────────────────────────
  function getSession()         { return _get(KEYS.session); }
  function saveSession(data)    { _set(KEYS.session, data); }
  function clearSession()       { _remove(KEYS.session); _remove(KEYS.token); }
  function getToken()           { return _get(KEYS.token); }
  function saveToken(token)     { _set(KEYS.token, token); }

  // ── estimate sequence number ────────────────────────────────
  function nextEstimateSeq() {
    const current = _get(KEYS.estimateSeq) || 0;
    const next = current + 1;
    _set(KEYS.estimateSeq, next);
    return next;
  }
  function peekEstimateSeq() { return _get(KEYS.estimateSeq) || 0; }

  // ── current project ─────────────────────────────────────────
  function getCurrentProject()       { return _get(KEYS.currentProject); }
  function saveCurrentProject(data)  { _set(KEYS.currentProject, data); }
  function clearCurrentProject()     { _remove(KEYS.currentProject); }

  // ── current estimate ────────────────────────────────────────
  function getCurrentEstimate()      { return _get(KEYS.currentEstimate); }
  function saveCurrentEstimate(data) { _set(KEYS.currentEstimate, data); }
  function clearCurrentEstimate()    { _remove(KEYS.currentEstimate); }

  // ── wizard draft state ──────────────────────────────────────
  function getDraft(draftKey) {
    const drafts = _get(KEYS.drafts) || {};
    return drafts[draftKey] || null;
  }
  function saveDraft(draftKey, data) {
    const drafts = _get(KEYS.drafts) || {};
    drafts[draftKey] = { ...data, _savedAt: Date.now() };
    _set(KEYS.drafts, drafts);
  }
  function clearDraft(draftKey) {
    const drafts = _get(KEYS.drafts) || {};
    delete drafts[draftKey];
    _set(KEYS.drafts, drafts);
  }
  function clearAllDrafts() { _remove(KEYS.drafts); }

  // ── app settings ────────────────────────────────────────────
  function getSettings()            { return _get(KEYS.settings) || {}; }
  function saveSetting(key, value) {
    const s = getSettings();
    s[key] = value;
    _set(KEYS.settings, s);
  }

  // ── customer fields (persisted across sessions) ─────────────
  const CUSTOMER_FIELDS = ['customerName', 'customerEmail', 'customerPhone', 'address', 'city', 'province', 'postalCode'];

  function saveCustomerFields(data) {
    const s = getSettings();
    s._lastCustomer = {};
    CUSTOMER_FIELDS.forEach(f => { if (data[f]) s._lastCustomer[f] = data[f]; });
    _set(KEYS.settings, s);
  }

  function getLastCustomerFields() {
    return getSettings()._lastCustomer || {};
  }

  // ── clear everything ────────────────────────────────────────
  function clearAll() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }

  return {
    getSession, saveSession, clearSession,
    getToken, saveToken,
    nextEstimateSeq, peekEstimateSeq,
    getCurrentProject, saveCurrentProject, clearCurrentProject,
    getCurrentEstimate, saveCurrentEstimate, clearCurrentEstimate,
    getDraft, saveDraft, clearDraft, clearAllDrafts,
    getSettings, saveSetting,
    saveCustomerFields, getLastCustomerFields,
    clearAll,
  };
})();

window.Storage = Storage;
