(function () {
  const AUTO_SAVE_KEY = 'fenceDepot:autoSave';

  function saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Local storage save failed:', error);
      return false;
    }
  }

  function loadFromLocalStorage(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Local storage load failed:', error);
      return null;
    }
  }

  function clearLocalStorage() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith('fenceDepot'))
      .forEach((key) => localStorage.removeItem(key));
  }

  function autoSave(projectData) {
    return saveToLocalStorage(AUTO_SAVE_KEY, {
      savedAt: new Date().toISOString(),
      data: projectData
    });
  }

  function loadAutoSave() {
    return loadFromLocalStorage(AUTO_SAVE_KEY);
  }

  function exportToJSON(data) {
    const payload = JSON.stringify(data, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `fence-depot-project-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function importFromJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          resolve(JSON.parse(reader.result));
        } catch (error) {
          reject(new Error('The selected file is not valid JSON.'));
        }
      };
      reader.onerror = () => reject(reader.error || new Error('Unable to read the selected file.'));
      reader.readAsText(file);
    });
  }

  window.Storage = {
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage,
    autoSave,
    loadAutoSave,
    exportToJSON,
    importFromJSON
  };
})();
