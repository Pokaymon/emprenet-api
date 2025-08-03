import { updateUIBasedOnToken, handleLogin } from './utils/index.utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('[data-role="login-form-container"]');
  const loginFormCamps = document.querySelector('[data-role="login-form"]');
  const userImage = document.querySelector('[data-role="user-image"]');
  const loginButton = document.querySelector('[data-role="login-button"]');
  const logoutButton = document.querySelector('[data-role="logout-button"]');
  const sidebar = document.querySelector('[data-role="sidebar"]');

  // Detectar token desde URL y almacenarlo
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');

  if (tokenFromUrl) {
    localStorage.setItem('token', tokenFromUrl);

    // Success message
    Swal.fire({
      icon: 'success',
      title: 'Sesión iniciada',
      text: 'Bienvenido de nuevo.',
      timer: 2000,
      showConfirmButton: false,
    });

    // Limpiar el token de la URL sin recargar la página
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  updateUIBasedOnToken({ loginForm, loginButton, userImage });

  if (loginButton) {
    loginButton.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.toggle('opacity-0');
      loginForm.classList.toggle('pointer-events-none');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      handleLogin(e, loginForm, loginFormCamps, () => {
        updateUIBasedOnToken({ loginForm, loginButton, userImage });
      });
    });
  }

  if (userImage) {
    userImage.addEventListener('click', () => {
      if (sidebar) {
	sidebar.classList.toggle('translate-x-full');
	sidebar.classList.toggle('translate-x-0');
      }
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      updateUIBasedOnToken({ loginForm, loginButton, userImage });

      if (sidebar && !sidebar.classList.contains('translate-x-full')){
	sidebar.classList.add('translate-x-full');
	sidebar.classList.remove('translate-x-0');
      }
    });
  }

});
