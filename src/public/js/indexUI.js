import { handleLogin, handleRegister, logout } from './hooks/auth.hook.js';
import { updateAuthUI, switchTabs } from './utils/ui.utils.js';
import { getTokenFromURL } from './utils/token.utils.js';
import { showConfigProfileModal } from './utils/modal.utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const els = {
    // loginForm
    loginFormContainer: document.querySelector('[data-role="login-form-container"]'),
    loginForm: document.querySelector('[data-role="login-form"]'),
    registerForm: document.querySelector('[data-role="register-form"]'),
    loginButton: document.querySelector('[data-role="login-button"]'),
    logoutButton: document.querySelector('[data-role="logout-button"]'),
    userImage: document.querySelector('[data-role="user-image"]'),
    sidebar: document.querySelector('[data-role="sidebar"]'),
    profileLink: document.querySelector('[data-role="profile-link"]'),
    loginTab: document.querySelector('[data-role="switch-to-login"]'),
    registerTab: document.querySelector('[data-role="switch-to-register"]'),

    // searchUsers
    searchUsersContainer: document.querySelector('[data-role="search-users-container"]'),
  };

  const tokenFromUrl = getTokenFromURL();
  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Llamada inicial
  updateAuthUI(els);

  // Mostrar login form
  els.loginButton?.addEventListener('click', () =>
    els.loginFormContainer.classList.toggle('opacity-0')
  );

  // Mostrar sidebar
  els.userImage?.addEventListener('click', () => {
    els.sidebar?.classList.toggle('translate-x-full');
    els.sidebar?.classList.toggle('translate-x-0');
  });

  els.loginForm?.addEventListener('submit', (e) =>
    handleLogin(e, els.loginForm, () => updateAuthUI(els))
  );

  els.registerForm?.addEventListener('submit', (e) =>
    handleRegister(e, els.registerForm)
  );

  els.logoutButton?.addEventListener('click', () =>
    logout(() => updateAuthUI(els), els.sidebar)
  );

  // Modal
  els.profileLink?.addEventListener('click', () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const user = JSON.parse(atob(token.split('.')[1]));
    showConfigProfileModal(user.username, user.email, user.email_verified);
  });

  els.loginTab?.addEventListener('click', () =>
    switchTabs(els.loginForm, els.registerForm, els.loginTab, els.registerTab)
  );
  els.registerTab?.addEventListener('click', () =>
    switchTabs(els.registerForm, els.loginForm, els.registerTab, els.loginTab)
  );

});
