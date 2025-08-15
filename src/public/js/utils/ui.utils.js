import { parseJwt } from './token.utils.js';
import { initUserSearch } from '../hooks/searchUsers.hook.js';

export function toggleVisibility(el, show) {
  if (!el) return;
  el.classList.toggle('opacity-0', !show);
  el.classList.toggle('pointer-events-none', !show);
}

export function switchTabs(showForm, hideForm, activeBtn, inactiveBtn) {
  showForm.classList.replace('hidden', 'flex');
  hideForm.classList.replace('flex', 'hidden');
  activeBtn.classList.add('active');
  activeBtn.classList.remove('inactive');
  inactiveBtn.classList.add('inactive');
  inactiveBtn.classList.remove('active');
}

export function updateAuthUI({ loginFormContainer, loginButton, userImage, searchUsersContainer }) {
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);

  toggleVisibility(loginFormContainer, !isAuthenticated);
  toggleVisibility(loginButton, !isAuthenticated);
  toggleVisibility(userImage, isAuthenticated);
  toggleVisibility(searchUsersContainer, isAuthenticated);

  if (isAuthenticated) {
    const user = parseJwt(token);
    document.querySelector('[data-role="sidebar-username"]').textContent = user?.username || 'Usuario';
    document.querySelector('[data-role="sidebar-email"]').textContent = user?.email || 'example@ejemplo.com';

    // Inicializar barra de búsqueda
    const searchInput = document.querySelector('[data-role="search-input"]');
    const searchResults = document.querySelector('[data-role="search-results"]');
    initUserSearch(searchInput, searchResults);
  }
}
