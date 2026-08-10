export default {
  id: 'mapping',
  title: '17. Mapping',
  render(state) {
    const values = state.tabs.mapping || {};
    const lat = values.latitude || '43.6532';
    const lng = values.longitude || '-79.3832';
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${Number(lng) - 0.02}%2C${Number(lat) - 0.02}%2C${Number(lng) + 0.02}%2C${Number(lat) + 0.02}&layer=mapnik&marker=${lat}%2C${lng}`;
    return `
      <section class="card">
        <h2>17. Mapping</h2>
        <form data-tab-form="mapping" class="grid">
          <label>Address<input name="address" value="${values.address ?? state.tabs.project?.address ?? ''}"></label>
          <label>Latitude<input name="latitude" type="number" step="0.0001" value="${lat}"></label>
          <label>Longitude<input name="longitude" type="number" step="0.0001" value="${lng}"></label>
          <label>Lot / Plan Notes<textarea name="mapNotes">${values.mapNotes ?? ''}</textarea></label>
        </form>
      </section>
      <section class="card">
        <h3>Map Preview</h3>
        <iframe class="map-frame" src="${mapUrl}" loading="lazy" title="Map preview"></iframe>
        <div class="inline-actions">
          <a class="primary-btn" href="https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}" target="_blank" rel="noreferrer">Open full map</a>
        </div>
      </section>
    `;
  },
  bind({ panel, onSave }) {
    const form = panel.querySelector('[data-tab-form="mapping"]');
    form?.addEventListener('change', () => onSave('mapping', Object.fromEntries(new FormData(form).entries()), true));
  }
};
