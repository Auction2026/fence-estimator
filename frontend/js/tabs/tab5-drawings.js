/**
 * tab5-drawings.js – Shop Drawings upload tab
 */
const Tab5Drawings = (() => {
  let files = [];

  function init() {
    const input = document.getElementById('drawing-file-input');
    const area = document.getElementById('drawing-upload-area');
    if (input) input.addEventListener('change', handleFiles);
    if (area) {
      area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag-over'); });
      area.addEventListener('dragleave', () => area.classList.remove('drag-over'));
      area.addEventListener('drop', e => {
        e.preventDefault();
        area.classList.remove('drag-over');
        handleFiles({ target: { files: e.dataTransfer.files } });
      });
    }
  }

  function handleFiles(e) {
    const newFiles = Array.from(e.target.files || []);
    newFiles.forEach(f => {
      if (f.size > 20 * 1024 * 1024) {
        UI.showNotification(`${f.name} exceeds 20MB limit`, 'error');
        return;
      }
      files.push(f);
      addToGallery(f);
    });
  }

  function addToGallery(file) {
    const gallery = document.getElementById('gallery-items');
    if (!gallery) return;
    const noItems = gallery.querySelector('.no-items');
    if (noItems) noItems.remove();

    const item = document.createElement('div');
    item.className = 'gallery-item';
    const isImage = file.type.startsWith('image/');
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        item.innerHTML = `<img src="${e.target.result}" alt="${file.name}" />
          <div class="gallery-item-info"><strong>${file.name}</strong><br/>${(file.size/1024).toFixed(0)} KB</div>`;
      };
      reader.readAsDataURL(file);
    } else {
      item.innerHTML = `<div style="padding:2rem;text-align:center;font-size:2rem;">📄</div>
        <div class="gallery-item-info"><strong>${file.name}</strong><br/>${(file.size/1024).toFixed(0)} KB</div>`;
    }
    gallery.appendChild(item);
  }

  return { init };
})();
