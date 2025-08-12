import { alertError, alertSuccess } from '../utils/alert.utils.js';

export async function changeEmail(newEmail) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('/auth/email/change', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ newEmail })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    alertSuccess('Tu email ha sido actualizado');
  } catch (err) {
    alertError(err.message);
  }
}

export async function resendVerification(button) {
  try {
    button.disabled = true;
    startCooldown(button, 60); // 60 segundos
    const token = localStorage.getItem('token');
    const response = await fetch('/auth/email/resend-verification', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    alertSuccess(data.message || 'Correo reenviado con éxito');
  } catch (err) {
    alertError(err.message);
    button.disabled = false;
    button.textContent = 'Verificar correo';
  }
}

function startCooldown(button, seconds) {
  let remaining = seconds;
  const originalText = 'Verificar correo';
  const interval = setInterval(() => {
    button.textContent = `Reenviar en ${remaining--}s`;
    if (remaining < 0) {
      clearInterval(interval);
      button.disabled = false;
      button.textContent = originalText;
    }
  }, 1000);
}
