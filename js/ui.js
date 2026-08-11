export function renderTabNav(container, tabs, activeId, onSelect) {
  container.innerHTML = '';
  tabs.forEach((tab) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = `${tab.order}. ${tab.label}`;
    btn.className = tab.id === activeId ? 'active' : '';
    btn.addEventListener('click', () => onSelect(tab.id));
    container.appendChild(btn);
  });
}

export function renderTabContent(container, tab, context) {
  container.innerHTML = tab.render(context);
}
