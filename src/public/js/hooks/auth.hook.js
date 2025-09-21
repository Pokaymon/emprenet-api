import { alertError, alertSuccess, alertWarning } from '../utils/alert.utils.js';
import { toggleVisibility } from '../utils/ui.utils.js';

export async function handleLogin(e, form, onSuccess) {
  e.preventDefault();
  const email = form.querySelector('input[type="email"]').value;
  const password = form.querySelector('input[type="password"]').value;

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) return alertError(data.message || 'Error en login');

    localStorage.setItem('token', data.token);

    form.reset();

    const loginFormContainer = document.querySelector('[data-role="login-form-container"]');
    toggleVisibility(loginFormContainer, false);

    const swalPromise = data.warning
      ? alertWarning(data.warning)
      : alertSuccess(data.message);

    // Esperar a cerrar alerta
    await swalPromise;

    if (!data.warning) {
      onSuccess?.();
    }

  } catch {
    alertError('No se pudo conectar al servidor.');
  }
}

export async function handleRegister(e, form, onSuccess) {
  e.preventDefault();
  const [usernameInput, emailInput, passInput, confirmInput] = form.querySelectorAll('input');

  if (passInput.value !== confirmInput.value) {
    return alertWarning('Asegúrate de que ambas contraseñas coincidan.');
  }

  try {
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: usernameInput.value,
        email: emailInput.value,
        password: passInput.value,
        password_confirmation: confirmInput.value
      })
    });
    const data = await res.json();

    if (!res.ok) return alertError(data.message || 'Error en registro');

    form.reset();

    alertSuccess(data.message || 'Verifica tu correo.')
    .then(() => {
      setTimeout(() => {
	onSuccess?.();
      }, 100);
    });

  } catch {
    alertError('No se pudo conectar al servidor.');
  }
}

export function logout(updateUI, sidebar) {
  localStorage.removeItem('token');
  updateUI();
  sidebar?.classList.add('translate-x-full');
}
