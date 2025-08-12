export function closeSidebar(sidebar) {
  if (!sidebar || sidebar.classList.contains('translate-x-full')) return;
  sidebar.classList.add('translate-x-full');
  sidebar.classList.remove('translate-x-0');
}
