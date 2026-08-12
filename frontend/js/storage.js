/**
 * FENCE DEPOT ESTIMATOR - Local Storage & Session Management
 * frontend/js/storage.js
 */

'use strict';

var Storage = (function () {

  var PREFIX    = 'fe_';
  var PROJECT_KEY   = PREFIX + 'project';
  var SESSION_KEY   = PREFIX + 'session';
  var SETTINGS_KEY  = PREFIX + 'settings';
  var PROJECTS_LIST = PREFIX + 'projects';

  // ---- SESSION ----
  function loadSession() {
    try {
      var raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        var session = JSON.parse(raw);
        FenceApp.currentProject = session.currentProject || null;
        FenceApp.currentTab     = session.currentTab     || 1;

        if (session.currentProject) {
          var proj = loadProject(session.currentProject);
          if (proj) {
            FenceApp.project = proj;
            console.log('📂 Session restored: ' + session.currentProject);
          }
        }
      }
    } catch (e) {
      console.warn('Session restore failed:', e);
    }
  }

  function saveSession() {
    var session = {
      currentProject: FenceApp.currentProject,
      currentTab:     FenceApp.currentTab,
      savedAt:        new Date().toISOString(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  // ---- PROJECT ----
  function saveProject(project) {
    if (!project || !project.id) return;
    try {
      project.updatedAt = new Date().toISOString();
      localStorage.setItem(PROJECT_KEY + '_' + project.id, JSON.stringify(project));
      addToProjectsList(project);
      saveSession();
      console.log('💾 Project saved: ' + project.id);
    } catch (e) {
      console.error('Save failed:', e);
      if (e.name === 'QuotaExceededError') {
        UI.showToast('Storage full - cannot save. Please export/delete old projects.', 'error');
      }
    }
  }

  function loadProject(id) {
    try {
      var raw = localStorage.getItem(PROJECT_KEY + '_' + id);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Load project failed:', e);
      return null;
    }
  }

  function deleteProject(id) {
    localStorage.removeItem(PROJECT_KEY + '_' + id);
    removeFromProjectsList(id);
    if (FenceApp.currentProject === id) {
      FenceApp.currentProject = null;
      FenceApp.project = {};
      saveSession();
    }
  }

  function getAllProjects() {
    try {
      var raw = localStorage.getItem(PROJECTS_LIST);
      var list = raw ? JSON.parse(raw) : [];
      return list.map(function (entry) {
        var proj = loadProject(entry.id);
        return proj || entry;
      }).filter(Boolean);
    } catch (e) {
      return [];
    }
  }

  function addToProjectsList(project) {
    var list = getAllProjects();
    var idx  = list.findIndex(function (p) { return p.id === project.id; });
    var entry = {
      id:          project.id,
      name:        (project.customer && project.customer.name) || 'Unnamed Project',
      updatedAt:   project.updatedAt,
      createdAt:   project.createdAt,
    };
    if (idx >= 0) list[idx] = entry;
    else list.unshift(entry);
    localStorage.setItem(PROJECTS_LIST, JSON.stringify(list.slice(0, 50)));
  }

  function removeFromProjectsList(id) {
    var list = getAllProjects().filter(function (p) { return p.id !== id; });
    localStorage.setItem(PROJECTS_LIST, JSON.stringify(list));
  }

  // ---- SPECS ----
  function saveSpecs(specs) {
    localStorage.setItem(PREFIX + 'specs', JSON.stringify(specs));
  }

  function loadSpecs() {
    try {
      var raw = localStorage.getItem(PREFIX + 'specs');
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  // ---- SETTINGS ----
  function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function loadSettings() {
    try {
      var raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : getDefaultSettings();
    } catch (e) { return getDefaultSettings(); }
  }

  function getDefaultSettings() {
    return {
      taxRate:    8.0,
      markup:     30,
      company:    'Fence Depot',
      phone:      '',
      email:      '',
      license:    '',
      theme:      'light',
    };
  }

  // ---- AUTO-SAVE ----
  function autoSave() {
    if (FenceApp.project && FenceApp.project.id) {
      saveProject(FenceApp.project);
      console.log('⏱ Auto-saved: ' + new Date().toLocaleTimeString());
    }
  }

  // ---- EXPORT / IMPORT ----
  function exportProjectJSON(id) {
    var proj = loadProject(id) || FenceApp.project;
    if (!proj) return;
    var blob = new Blob([JSON.stringify(proj, null, 2)], { type: 'application/json' });
    var url  = URL.createObjectURL(blob);
    var a    = document.createElement('a');
    a.href   = url;
    a.download = (proj.id || 'project') + '.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importProjectJSON(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function (e) {
        try {
          var proj = JSON.parse(e.target.result);
          saveProject(proj);
          resolve(proj);
        } catch (err) { reject(err); }
      };
      reader.readAsText(file);
    });
  }

  // ---- CLEAR ----
  function clearAll() {
    var keys = Object.keys(localStorage).filter(function (k) { return k.startsWith(PREFIX); });
    keys.forEach(function (k) { localStorage.removeItem(k); });
  }

  // ---- PUBLIC ----
  return {
    loadSession, saveSession,
    saveProject, loadProject, deleteProject, getAllProjects,
    saveSpecs, loadSpecs,
    saveSettings, loadSettings, getDefaultSettings,
    autoSave,
    exportProjectJSON, importProjectJSON,
    clearAll,
  };

})();

window.Storage = Storage;
