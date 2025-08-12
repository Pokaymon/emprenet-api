import { updateAuthUI } from './ui/authUI.js';
import { closeSidebar } from './ui/sidebarUI.js';
import { toggleTabs } from './ui/toggleFormTabs.js';
import { useLogin } from './hooks/useLogin.js';
import { useRegister } from './hooks/useRegister.js';
import { showProfileModal } from './ui/modalUI.js';

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    loginFormContainer: document.querySelector('[data-role="login-form-container"]'),
    loginFormFields: document.querySelector('[data-role="login-form"]'),
    registerFormFields: document.querySelector('[data-role="register-form"]'),
    loginButton: document.querySelector('[data-role="login-button"]'),
    logoutButton: document.querySelector('[data-role="logout-button"]'),
    userImage: document.querySelector('[data-role="user-image"]'),
    sidebar: document.querySelector('[data-role="sidebar"]'),
  };

  const tokenFromUrl = new URLSearchParams(window.location.search).get('token');
  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);
    Swal.fire({ icon: 'success', title: 'Sesión iniciada', text: 'Bienvenido de nuevo.', timer: 2000, showConfirmButton: false });
    history.replaceState({}, document.title, location.pathname);
  }

  updateAuthUI(elements);

  elements.loginButton?.addEventListener('click', () =>
    elements.loginFormContainer.classList.toggle('opacity-0')
  );

  elements.loginFormFields?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = elements.loginFormFields.querySelector('input[type="email"]').value;
    const password = elements.loginFormFields.querySelector('input[type="password"]').value;

    try {
      const { message, warning } = await useLogin(email, password);
      Swal.fire({ icon: warning ? 'warning' : 'success', title: warning ? 'Atención' : 'Éxito', text: message });
      elements.loginFormFields.reset();
      updateAuthUI(elements);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  });

  elements.registerFormFields?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputs = elements.registerFormFields.querySelectorAll('input');
    const [username, email, password, confirmPassword] = [...inputs].map(i => i.value);

    if (password !== confirmPassword) {
      return Swal.fire({ icon: 'warning', title: 'Contraseñas no coinciden', text: 'Ambas contraseñas deben ser iguales.' });
    }

    try {
      const message = await useRegister({ username, email, password, password_confirmation: confirmPassword });
      Swal.fire({ icon: 'success', title: 'Registro exitoso', text: message });
      elements.registerFormFields.reset();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    }
  });

  elements.userImage?.addEventListener('click', () =>
    elements.sidebar?.classList.toggle('translate-x-full')
  );

  elements.logoutButton?.addEventListener('click', () => {
    localStorage.removeItem('token');
    updateAuthUI(elements);
    closeSidebar(elements.sidebar);
  });

  document.querySelector('[data-role="profile-link"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    const { username, email, email_verified } = JSON.parse(atob(token.split('.')[1]));
    showProfileModal(username, email, email_verified);
  });

  toggleTabs(
    document.querySelector('[data-role="switch-to-login"]'),
    document.querySelector('[data-role="switch-to-register"]'),
    elements.loginFormFields,
    elements.registerFormFields
  );
});
