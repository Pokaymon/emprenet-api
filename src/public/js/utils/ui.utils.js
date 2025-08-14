import { parseJwt } from './token.utils.js';

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

  if (!isAuthenticated) {
    // Mostrar login con animación
    loginFormContainer?.classList.remove('hidden');
    loginFormContainer?.classList.add('opacity-0', 'pointer-events-none');
    requestAnimationFrame(() => {
      loginFormContainer?.classList.remove('opacity-0', 'pointer-events-none');
    });

    toggleVisibility(loginButton, true);
    toggleVisibility(userImage, false);

    // Ocultar barra de búsqueda con fade out
    searchUsersContainer?.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      searchUsersContainer?.classList.add('hidden');
    }, 300);
  } else {
    // Ocultar login con fade out
    loginFormContainer?.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
      loginFormContainer?.classList.add('hidden');
    }, 300);

    toggleVisibility(loginButton, false);
    toggleVisibility(userImage, true);

    // Mostrar barra de búsqueda con animación
    searchUsersContainer?.classList.remove('hidden');
    searchUsersContainer?.classList.add('opacity-0', 'pointer-events-none');
    requestAnimationFrame(() => {
      searchUsersContainer?.classList.remove('opacity-0', 'pointer-events-none');
    });

    const user = parseJwt(token);
    document.querySelector('[data-role="sidebar-username"]').textContent = user?.username || 'Usuario';
    document.querySelector('[data-role="sidebar-email"]').textContent = user?.email || 'example@ejemplo.com';
  }
}
