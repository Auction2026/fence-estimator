(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const STORAGE_PREFIX = 'fenceDepotEstimator';
    const Storage = {};

    Storage.saveToLocalStorage = function saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(data));
            return true;
        } catch (error) { console.error('Unable to save to localStorage', error); return false; }
    };

    Storage.loadFromLocalStorage = function loadFromLocalStorage(key) {
        try { const raw = localStorage.getItem(`${STORAGE_PREFIX}:${key}`); return raw ? JSON.parse(raw) : null; } catch (error) { console.error('Unable to load from localStorage', error); return null; }
    };

    Storage.autoSave = function autoSave(data) { return Storage.saveToLocalStorage('autosave', { savedAt: new Date().toISOString(), data }); };
    Storage.loadAutoSave = function loadAutoSave() { return Storage.loadFromLocalStorage('autosave'); };

    Storage.clearStorage = function clearStorage() {
        Object.keys(localStorage).filter((key) => key.startsWith(`${STORAGE_PREFIX}:`)).forEach((key) => localStorage.removeItem(key));
    };

    Storage.saveProject = function saveProject(project) {
        const existing = Storage.loadFromLocalStorage('projects') || [];
        const projectId = project.projectId || `LOCAL-${Date.now()}`;
        const normalized = { ...project, projectId, updatedAt: new Date().toISOString() };
        const list = [normalized, ...existing.filter((item) => item.projectId !== projectId)];
        Storage.saveToLocalStorage('projects', list);
        Storage.saveToLocalStorage('lastProject', normalized);
        return normalized;
    };

    Storage.getProjects = function getProjects() { return Storage.loadFromLocalStorage('projects') || []; };

    Storage.saveCollectionItem = function saveCollectionItem(collection, item, idKey = 'id') {
        const existing = Storage.loadFromLocalStorage(collection) || [];
        const identity = item[idKey] || `${collection}-${Date.now()}`;
        const normalized = { ...item, [idKey]: identity, updatedAt: new Date().toISOString() };
        Storage.saveToLocalStorage(collection, [normalized, ...existing.filter((entry) => entry[idKey] !== identity)]);
        return normalized;
    };

    Storage.loadCollection = function loadCollection(collection) { return Storage.loadFromLocalStorage(collection) || []; };
    Storage.removeCollectionItem = function removeCollectionItem(collection, value, idKey = 'id') { const existing = Storage.loadCollection(collection); const next = existing.filter((entry) => entry[idKey] !== value); Storage.saveToLocalStorage(collection, next); return next; };
    Storage.saveSession = function saveSession(session) { return Storage.saveToLocalStorage('session', session); };
    Storage.loadSession = function loadSession() { return Storage.loadFromLocalStorage('session') || { token: '', user: null }; };
    Storage.exportSnapshot = function exportSnapshot() { const snapshot = {}; Object.keys(localStorage).filter((key) => key.startsWith(`${STORAGE_PREFIX}:`)).forEach((key) => { snapshot[key.replace(`${STORAGE_PREFIX}:`, '')] = JSON.parse(localStorage.getItem(key)); }); return snapshot; };
    Storage.saveProjectDraft = function saveProjectDraft(project) { return Storage.saveToLocalStorage('projectDraft', project); };
    Storage.loadProjectDraft = function loadProjectDraft() { return Storage.loadFromLocalStorage('projectDraft') || {}; };
    Storage.helper1 = function helper1(value) {
        return value;
    };

    Storage.helper2 = function helper2(value) {
        return value;
    };

    Storage.helper3 = function helper3(value) {
        return value;
    };

    Storage.helper4 = function helper4(value) {
        return value;
    };

    Storage.helper5 = function helper5(value) {
        return value;
    };

    Storage.helper6 = function helper6(value) {
        return value;
    };

    Storage.helper7 = function helper7(value) {
        return value;
    };

    Storage.helper8 = function helper8(value) {
        return value;
    };

    Storage.helper9 = function helper9(value) {
        return value;
    };

    Storage.helper10 = function helper10(value) {
        return value;
    };

    Storage.helper11 = function helper11(value) {
        return value;
    };

    Storage.helper12 = function helper12(value) {
        return value;
    };

    Storage.helper13 = function helper13(value) {
        return value;
    };

    Storage.helper14 = function helper14(value) {
        return value;
    };

    Storage.helper15 = function helper15(value) {
        return value;
    };

    Storage.helper16 = function helper16(value) {
        return value;
    };

    Storage.helper17 = function helper17(value) {
        return value;
    };

    Storage.helper18 = function helper18(value) {
        return value;
    };

    Storage.helper19 = function helper19(value) {
        return value;
    };

    Storage.helper20 = function helper20(value) {
        return value;
    };

    Storage.helper21 = function helper21(value) {
        return value;
    };

    Storage.helper22 = function helper22(value) {
        return value;
    };

    Storage.helper23 = function helper23(value) {
        return value;
    };

    Storage.helper24 = function helper24(value) {
        return value;
    };

    Storage.helper25 = function helper25(value) {
        return value;
    };

    FenceDepot.Storage = Storage;
})();
