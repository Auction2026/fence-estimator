/**
 * @module storage
 * @description localStorage and sessionStorage manager with namespacing, migration, and import/export support.
 */
(function storageModule(global) {
    'use strict';

    // Namespaces, versions, and fallback memory stores
    var STORAGE_PREFIX = "fenceEstimator";
    var STORAGE_VERSION = 1;
    var PROJECTS_KEY = STORAGE_PREFIX + ":projects";
    var ESTIMATES_KEY = STORAGE_PREFIX + ":estimates";
    var DRAFT_KEY = STORAGE_PREFIX + ":draft";
    var SETTINGS_KEY = STORAGE_PREFIX + ":settings";
    var SESSION_DRAFT_KEY = STORAGE_PREFIX + ":sessionDraft";
    var memoryStorage = {};
    function getStorage(type) {
        try {
            var target = type === 'session' ? global.sessionStorage : global.localStorage;
            var probe = STORAGE_PREFIX + ':probe';
            target.setItem(probe, '1');
            target.removeItem(probe);
            return target;
        } catch (error) {
            return {
                getItem: function getItem(key) {
                    return Object.prototype.hasOwnProperty.call(memoryStorage, key) ? memoryStorage[key] : null;
                },
                setItem: function setItem(key, value) {
                    memoryStorage[key] = String(value);
                },
                removeItem: function removeItem(key) {
                    delete memoryStorage[key];
                },
                clear: function clear() {
                    memoryStorage = {};
                }
            };
        }
    }

    function safeParse(json, fallback) {
        if (!json) {
            return typeof fallback === 'undefined' ? null : fallback;
        }
        try {
            return JSON.parse(json);
        } catch (error) {
            console.warn('Unable to parse storage payload', error);
            return typeof fallback === 'undefined' ? null : fallback;
        }
    }

    function safeStringify(value) {
        return JSON.stringify(value, function replacer(key, currentValue) {
            if (currentValue instanceof Date) {
                return currentValue.toISOString();
            }
            if (typeof currentValue === 'function') {
                return undefined;
            }
            return currentValue;
        });
    }

    function createEnvelope(type, data) {
        return {
            version: STORAGE_VERSION,
            type: type,
            updatedAt: new Date().toISOString(),
            data: data
        };
    }

    function writeValue(key, data, type) {
        var storage = getStorage(type);
        var envelope = createEnvelope(key, data);
        storage.setItem(key, safeStringify(envelope));
        return envelope.data;
    }

    function readValue(key, fallback, type) {
        var storage = getStorage(type);
        var parsed = safeParse(storage.getItem(key), null);
        if (!parsed || typeof parsed !== 'object') {
            return typeof fallback === 'undefined' ? null : fallback;
        }
        return typeof parsed.data === 'undefined' ? fallback : parsed.data;
    }

    function removeValue(key, type) {
        getStorage(type).removeItem(key);
    }

    function ensureArray(value) {
        return Array.isArray(value) ? value : [];
    }

    function clone(value) {
        return safeParse(safeStringify(value), value);
    }

    function generateId(prefix) {
        return [prefix || 'item', Date.now(), Math.floor(Math.random() * 100000)].join('-');
    }

    function upsertById(collection, item, idField) {
        var key = idField || 'id';
        var list = ensureArray(collection).slice();
        var payload = clone(item || {});
        if (!payload[key]) {
            payload[key] = generateId(key);
        }
        var index = list.findIndex(function findItem(entry) {
            return entry && entry[key] === payload[key];
        });
        if (index === -1) {
            list.push(payload);
        } else {
            list[index] = Object.assign({}, list[index], payload, { updatedAt: new Date().toISOString() });
        }
        return {
            collection: list,
            item: payload
        };
    }

    function removeById(collection, id, idField) {
        var key = idField || 'id';
        return ensureArray(collection).filter(function filterEntry(entry) {
            return entry && entry[key] !== id;
        });
    }
    // Projects and estimates
    function getProjects() {
        return ensureArray(readValue(PROJECTS_KEY, [], 'local'));
    }

    function getEstimates() {
        return ensureArray(readValue(ESTIMATES_KEY, [], 'local'));
    }

    function saveProject(project) {
        var result = upsertById(getProjects(), Object.assign({ savedAt: new Date().toISOString() }, project), 'id');
        writeValue(PROJECTS_KEY, result.collection, 'local');
        return result.item;
    }

    function loadProject(projectId) {
        return getProjects().find(function findProject(project) {
            return project && project.id === projectId;
        }) || null;
    }

    function saveEstimate(estimate) {
        var payload = Object.assign({ savedAt: new Date().toISOString() }, estimate || {});
        var result = upsertById(getEstimates(), payload, 'id');
        writeValue(ESTIMATES_KEY, result.collection, 'local');
        return result.item;
    }

    function loadEstimate(estimateId) {
        return getEstimates().find(function findEstimate(estimate) {
            return estimate && estimate.id === estimateId;
        }) || null;
    }

    function saveDraft(draft, options) {
        var useSession = Boolean(options && options.sessionOnly);
        return writeValue(useSession ? SESSION_DRAFT_KEY : DRAFT_KEY, Object.assign({ savedAt: new Date().toISOString() }, draft || {}), useSession ? 'session' : 'local');
    }

    function loadDraft(options) {
        var useSession = Boolean(options && options.sessionOnly);
        return readValue(useSession ? SESSION_DRAFT_KEY : DRAFT_KEY, null, useSession ? 'session' : 'local');
    }

    function clearDraft(options) {
        var useSession = Boolean(options && options.sessionOnly);
        removeValue(useSession ? SESSION_DRAFT_KEY : DRAFT_KEY, useSession ? 'session' : 'local');
    }

    function saveSettings(settings) {
        var nextSettings = Object.assign({
            currency: 'USD',
            locale: 'en-US',
            taxRate: 0.0825,
            markupRate: 0.22,
            autosave: true
        }, settings || {});
        writeValue(SETTINGS_KEY, nextSettings, 'local');
        return nextSettings;
    }

    function loadSettings() {
        return Object.assign({
            currency: 'USD',
            locale: 'en-US',
            taxRate: 0.0825,
            markupRate: 0.22,
            autosave: true
        }, readValue(SETTINGS_KEY, {}, 'local'));
    }

    // Import and export operations
    function exportData() {
        return safeStringify({
            version: STORAGE_VERSION,
            exportedAt: new Date().toISOString(),
            projects: getProjects(),
            estimates: getEstimates(),
            draft: loadDraft(),
            settings: loadSettings()
        });
    }

    function importData(rawData, options) {
        var parsed = typeof rawData === "string" ? safeParse(rawData, null) : rawData;
        if (!parsed || typeof parsed !== "object") {
            throw new Error("Imported data is invalid.");
        }
        if (options && options.merge) {
            var mergedProjects = getProjects().concat(ensureArray(parsed.projects));
            var mergedEstimates = getEstimates().concat(ensureArray(parsed.estimates));
            writeValue(PROJECTS_KEY, dedupeById(mergedProjects), "local");
            writeValue(ESTIMATES_KEY, dedupeById(mergedEstimates), "local");
        } else {
            writeValue(PROJECTS_KEY, dedupeById(ensureArray(parsed.projects)), "local");
            writeValue(ESTIMATES_KEY, dedupeById(ensureArray(parsed.estimates)), "local");
        }
        if (parsed.draft) {
            saveDraft(parsed.draft);
        }
        if (parsed.settings) {
            saveSettings(parsed.settings);
        }
        return {
            projects: getProjects().length,
            estimates: getEstimates().length
        };
    }

    function dedupeById(items) {
        var seen = {};
        return ensureArray(items).reduce(function reducer(result, item) {
            if (!item || !item.id) {
                return result;
            }
            seen[item.id] = Object.assign({}, seen[item.id] || {}, item);
            return result;
        }, []).concat(Object.keys(seen).map(function mapKey(key) {
            return seen[key];
        }));
    }

    function deleteProject(projectId) {
        var nextItems = removeById(getProjects(), projectId, "id");
        writeValue(PROJECTS_KEY, nextItems, "local");
        return nextItems;
    }

    function deleteEstimate(estimateId) {
        var nextItems = removeById(getEstimates(), estimateId, "id");
        writeValue(ESTIMATES_KEY, nextItems, "local");
        return nextItems;
    }

    function findProjectsByCustomer(customerName) {
        var query = String(customerName || "").trim().toLowerCase();
        if (!query) {
            return [];
        }
        return getProjects().filter(function filterProject(project) {
            return String(project.customerName || project.name || "").toLowerCase().indexOf(query) !== -1;
        });
    }

    function getRecentEstimates(limit) {
        var max = Math.max(1, Number(limit) || 10);
        return getEstimates()
            .slice()
            .sort(function sortByDate(a, b) {
                return new Date(b.updatedAt || b.savedAt || 0).getTime() - new Date(a.updatedAt || a.savedAt || 0).getTime();
            })
            .slice(0, max);
    }

    function clearAll() {
        [PROJECTS_KEY, ESTIMATES_KEY, DRAFT_KEY, SETTINGS_KEY, SESSION_DRAFT_KEY].forEach(function eachKey(key) {
            removeValue(key, key === SESSION_DRAFT_KEY ? "session" : "local");
        });
    }

    function migrateLegacyData() {
        var legacyProject = safeParse(getStorage('local').getItem('fenceEstimatorProject'), null);
        var legacyEstimate = safeParse(getStorage('local').getItem('fenceEstimatorEstimate'), null);
        if (legacyProject) {
            saveProject(Object.assign({ id: legacyProject.id || generateId('project') }, legacyProject));
            getStorage('local').removeItem('fenceEstimatorProject');
        }
        if (legacyEstimate) {
            saveEstimate(Object.assign({ id: legacyEstimate.id || generateId('estimate') }, legacyEstimate));
            getStorage('local').removeItem('fenceEstimatorEstimate');
        }
        return {
            migratedProject: Boolean(legacyProject),
            migratedEstimate: Boolean(legacyEstimate)
        };
    }

    function getStorageStats() {
        var exportPayload = exportData();
        return {
            projectCount: getProjects().length,
            estimateCount: getEstimates().length,
            draftExists: Boolean(loadDraft()),
            settingsExists: Boolean(readValue(SETTINGS_KEY, null, 'local')),
            approximateBytes: exportPayload.length
        };
    }



    // Supplemental storage helpers and reporting
    function listProjectIds() {
        return getProjects().map(function mapProject(project) {
            return project.id;
        });
    }

    function listEstimateIds() {
        return getEstimates().map(function mapEstimate(estimate) {
            return estimate.id;
        });
    }

    function getProjectEstimates(projectId) {
        return getEstimates().filter(function filterEstimate(estimate) {
            return estimate && estimate.projectId === projectId;
        });
    }

    function saveSessionValue(key, value) {
        if (!key) {
            throw new Error('A session storage key is required.');
        }
        return writeValue(STORAGE_PREFIX + ':session:' + key, value, 'session');
    }

    function loadSessionValue(key, fallback) {
        if (!key) {
            return fallback || null;
        }
        return readValue(STORAGE_PREFIX + ':session:' + key, typeof fallback === 'undefined' ? null : fallback, 'session');
    }

    function removeSessionValue(key) {
        if (!key) {
            return;
        }
        removeValue(STORAGE_PREFIX + ':session:' + key, 'session');
    }

    function createBackupSnapshot() {
        var snapshot = {
            createdAt: new Date().toISOString(),
            projects: getProjects(),
            estimates: getEstimates(),
            draft: loadDraft(),
            settings: loadSettings()
        };
        saveSessionValue('backup', snapshot);
        return snapshot;
    }

    function restoreBackupSnapshot() {
        var snapshot = loadSessionValue('backup', null);
        if (!snapshot) {
            return null;
        }
        writeValue(PROJECTS_KEY, ensureArray(snapshot.projects), 'local');
        writeValue(ESTIMATES_KEY, ensureArray(snapshot.estimates), 'local');
        if (snapshot.draft) {
            saveDraft(snapshot.draft);
        }
        if (snapshot.settings) {
            saveSettings(snapshot.settings);
        }
        return snapshot;
    }

    function pruneProjects(predicate) {
        var matcher = typeof predicate === 'function' ? predicate : function alwaysKeep() { return true; };
        var nextProjects = getProjects().filter(function filterProject(project) {
            return matcher(project) !== false;
        });
        writeValue(PROJECTS_KEY, nextProjects, 'local');
        return nextProjects;
    }

    function pruneEstimates(predicate) {
        var matcher = typeof predicate === 'function' ? predicate : function alwaysKeep() { return true; };
        var nextEstimates = getEstimates().filter(function filterEstimate(estimate) {
            return matcher(estimate) !== false;
        });
        writeValue(ESTIMATES_KEY, nextEstimates, 'local');
        return nextEstimates;
    }

    function hasUnsavedDraft() {
        return Boolean(loadDraft());
    }

    function touchProject(projectId) {
        var project = loadProject(projectId);
        if (!project) {
            return null;
        }
        project.updatedAt = new Date().toISOString();
        return saveProject(project);
    }

    function touchEstimate(estimateId) {
        var estimate = loadEstimate(estimateId);
        if (!estimate) {
            return null;
        }
        estimate.updatedAt = new Date().toISOString();
        return saveEstimate(estimate);
    }

    function summarizeProjects() {
        return getProjects().map(function mapProject(project) {
            return {
                id: project.id,
                name: project.projectName || project.name || '',
                customerName: project.customerName || '',
                estimateCount: getProjectEstimates(project.id).length,
                updatedAt: project.updatedAt || project.savedAt || null
            };
        });
    }

    function summarizeEstimates() {
        return getEstimates().map(function mapEstimate(estimate) {
            return {
                id: estimate.id,
                projectId: estimate.projectId || null,
                total: estimate.total || 0,
                status: estimate.status || 'draft',
                updatedAt: estimate.updatedAt || estimate.savedAt || null
            };
        });
    }

    // Operational note: defensive coding guards support legacy pages and partial form states.
    var exported = {
        saveProject: saveProject,
        loadProject: loadProject,
        saveEstimate: saveEstimate,
        loadEstimate: loadEstimate,
        saveDraft: saveDraft,
        loadDraft: loadDraft,
        clearDraft: clearDraft,
        exportData: exportData,
        importData: importData,
        getProjects: getProjects,
        getEstimates: getEstimates,
        saveSettings: saveSettings,
        loadSettings: loadSettings,
        clearAll: clearAll,
        deleteProject: deleteProject,
        deleteEstimate: deleteEstimate,
        findProjectsByCustomer: findProjectsByCustomer,
        getRecentEstimates: getRecentEstimates,
        migrateLegacyData: migrateLegacyData,
        getStorageStats: getStorageStats,
        listProjectIds: listProjectIds,
        listEstimateIds: listEstimateIds,
        getProjectEstimates: getProjectEstimates,
        saveSessionValue: saveSessionValue,
        loadSessionValue: loadSessionValue,
        removeSessionValue: removeSessionValue,
        createBackupSnapshot: createBackupSnapshot,
        restoreBackupSnapshot: restoreBackupSnapshot,
        pruneProjects: pruneProjects,
        pruneEstimates: pruneEstimates,
        hasUnsavedDraft: hasUnsavedDraft,
        touchProject: touchProject,
        touchEstimate: touchEstimate,
        summarizeProjects: summarizeProjects,
        summarizeEstimates: summarizeEstimates
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exported;
    }

    global.FenceEstimatorStorage = exported;
}(typeof window !== 'undefined' ? window : globalThis));
