import {
  updateAuthUI,
  handleLogin,
  handleRegister,
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

  // Login
  elements.loginFormFields?.addEventListener('submit', (e) => {
    handleLogin(e, elements.loginFormContainer, elements.loginFormFields, () => {
      updateAuthUI(elements);
    });
  });

  // Register
  const registerFormFields = document.querySelector('[data-role="register-form"]');
  registerFormFields?.addEventListener('submit', (e) => {
    handleRegister(e, registerFormFields);
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

  // Alternar entre formularios
  const loginTab = document.querySelector('[data-role="switch-to-login"]');
  const registerTab = document.querySelector('[data-role="switch-to-register"]');
  const loginForm = document.querySelector('[data-role="login-form"]');
  const registerForm = document.querySelector('[data-role="register-form"]');

  // Alternar entre formularios
  loginTab?.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    loginForm.classList.add('flex');
    registerForm.classList.remove('flex');
    registerForm.classList.add('hidden');

    loginTab.classList.add('active');
    loginTab.classList.remove('inactive');

    registerTab.classList.add('inactive');
    registerTab.classList.remove('active');
  });

  registerTab?.addEventListener('click', () => {
    registerForm.classList.remove('hidden');
    registerForm.classList.add('flex');
    loginForm.classList.remove('flex');
    loginForm.classList.add('hidden');

    registerTab.classList.add('active');
    registerTab.classList.remove('inactive');

    loginTab.classList.add('inactive');
    loginTab.classList.remove('active');
  });

});
