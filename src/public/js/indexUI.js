import { handleLogin, handleRegister, logout } from './hooks/auth.hook.js';
import { initFollowingSocket } from './hooks/userChat.hook.js';

import { updateAuthUI, switchTabs } from './utils/ui.utils.js';
import { getTokenFromURL } from './utils/token.utils.js';
import { showConfigProfileModal, showChangeAvatarModal } from './utils/modal.utils.js';
import { initTheme, toggleTheme } from './utils/theme.utils.js';

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

    // changeAvatar
    changeAvatarBtn: document.querySelector('[data-role="change-avatar-btn"]'),
    sidebarAvatar: document.querySelector('[data-role="sidebar-avatar"]'),

    // theme
    themeToggle: document.querySelector('[data-role="theme-toggle"]'),

    // chat
    chatToggle: document.querySelector('[data-role="chat-toggle"]'),
    chatClose: document.querySelector('[data-role="chat-close"]'),
    chatBack: document.querySelector('[data-role="chat-back"]'),
    chatContainer: document.querySelector('[data-role="chat-container"]'),
    chatOverlay: document.querySelector('[data-role="chat-overlay"]'),
    chatUsersList: document.querySelector('[data-role="chat-users-list"]'),
    chatUser: document.querySelector('[data-role="chat-user"]'),
    chatConversation: document.querySelector('[data-role="chat-conversation"]'),
  };

  // Iniciar tema al cargar
  initTheme();

  const tokenFromUrl = getTokenFromURL();
  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  const token = localStorage.getItem("token");
  if (token) {
    const socket = io("https://api.emprenet.work", { auth: { token } });
    initFollowingSocket(socket, els);
  }

  // Llamada inicial
  updateAuthUI(els);

  // Cambio de tema
  els.themeToggle?.addEventListener("click", toggleTheme);

  // Mostrar / Cerrar chat
  els.chatToggle?.addEventListener("click", () => {
    els.chatOverlay.classList.toggle('opacity-0');
    els.chatOverlay.classList.toggle('pointer-events-none');
  });

  // Cerrar chat
  els.chatClose?.addEventListener("click", () => {
    els.chatOverlay.classList.toggle('opacity-0');
    els.chatOverlay.classList.toggle('pointer-events-none');
  });

  // Abrir conversación
  els.chatUser?.addEventListener("click", () => {
    els.chatConversation.classList.remove('opacity-0');
    els.chatConversation.classList.remove('pointer-events-none');
  });

  // Cerrar conversación
  els.chatBack.addEventListener("click", () => {
    els.chatConversation.classList.add('opacity-0');
    els.chatConversation.classList.add('pointer-events-none');
  });

  // Mostrar login form
  els.loginButton?.addEventListener('click', () => {
    const isHidden = els.loginFormContainer.classList.contains('opacity-0');
    if (isHidden) {
      els.loginFormContainer.classList.remove('opacity-0', 'pointer-events-none');
      els.loginFormContainer.classList.add('opacity-100');
    } else {
      els.loginFormContainer.classList.add('opacity-0', 'pointer-events-none');
      els.loginFormContainer.classList.remove('opacity-100');
    }
  });

  // Mostrar sidebar
  els.userImage?.addEventListener('click', () => {
    els.sidebar?.classList.toggle('translate-x-full');
    els.sidebar?.classList.toggle('translate-x-0');
  });

  els.loginForm?.addEventListener('submit', (e) =>
    handleLogin(e, els.loginForm, () => {
      updateAuthUI(els);

      const token = localStorage.getItem("token");
      if (token) {
        const socket = io("https://api.emprenet.work", { auth: { token } });
        initFollowingSocket(socket, els);
      }
    })
  );

  els.registerForm?.addEventListener('submit', (e) =>
    handleRegister(e, els.registerForm, () => {
      switchTabs(els.loginForm, els.registerForm, els.loginTab, els.registerTab);
    })
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

  // Modal Change Avatar
  els.sidebarAvatar?.addEventListener('click', () => {
    const currentAvatar = els.sidebarAvatar?.src || "https://cdn.emprenet.work/Icons/default-avatar-2.webp";
    showChangeAvatarModal(currentAvatar, els);
  });

  els.loginTab?.addEventListener('click', () =>
    switchTabs(els.loginForm, els.registerForm, els.loginTab, els.registerTab)
  );
  els.registerTab?.addEventListener('click', () =>
    switchTabs(els.registerForm, els.loginForm, els.registerTab, els.loginTab)
  );

});
