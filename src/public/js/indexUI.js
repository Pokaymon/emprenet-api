import {
  updateAuthUI,
  handleLogin,
  closeSidebar,
  getTokenFromURL
} from './utils/index.utils.js';

import { showProfileModal } from './utils/modal.utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    loginFormContainer: document.querySelector('[data-role="login-form-container"]'),
    loginFormFields: document.querySelector('[data-role="login-form"]'),
    userImage: document.querySelector('[data-role="user-image"]'),
    loginButton: document.querySelector('[data-role="login-button"]'),
    logoutButton: document.querySelector('[data-role="logout-button"]'),
    sidebar: document.querySelector('[data-role="sidebar"]'),
  };

  const tokenFromUrl = getTokenFromURL();

  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    Swal.fire({
      icon: 'success',
      title: 'Sesión iniciada',
      text: 'Bienvenido de nuevo.',
      timer: 2000,
      showConfirmButton: false,
    });
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  updateAuthUI(elements);

  elements.loginButton?.addEventListener('click', (e) => {
    e.preventDefault();
    elements.loginFormContainer.classList.toggle('opacity-0');
    elements.loginFormContainer.classList.toggle('pointer-events-none');
  });

  elements.loginFormFields?.addEventListener('submit', (e) => {
    handleLogin(e, elements.loginFormContainer, elements.loginFormFields, () => {
      updateAuthUI(elements);
    });
  });

  elements.userImage?.addEventListener('click', () => {
    elements.sidebar?.classList.toggle('translate-x-full');
    elements.sidebar?.classList.toggle('translate-x-0');
  });

  elements.logoutButton?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    updateAuthUI(elements);
    closeSidebar(elements.sidebar);
  });

  // Cargar contenido en el profile modal
  const profileLink = document.querySelector('[data-role="profile-link"]');
  profileLink?.addEventListener('click', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    const user = JSON.parse(atob(token.split('.')[1]));
    const username = user?.username || 'Usuario';
    const email = user?.email || 'example@ejemplo.com';
    const email_verified = user.email_verified;

    showProfileModal(username, email, email_verified);
  });

});
