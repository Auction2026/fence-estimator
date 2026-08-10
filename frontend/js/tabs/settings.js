// TAB 17: SETTINGS
function settingsTabRefresh() {
  const s = state.companySettings || {};
  const fields = ['Company','Phone','Email','Address','License','Website'];
  fields.forEach(f => {
    const el = document.getElementById(`sett${f}`);
    if (el) el.value = s[f.toLowerCase()] || '';
  });
  const url = document.getElementById('settApiUrl');
  if (url) url.value = localStorage.getItem('apiUrl') || 'http://localhost:3000';
}
