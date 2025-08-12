import { useChangeEmail } from '../hooks/useChangeEmail.js';
import { useResendVerification } from '../hooks/useResendVerification.js';
import { startCooldown } from '../utils/cooldown.js';

export async function showProfileModal(username, email, email_verified = false) {
  const existing = document.getElementById('profile-modal-overlay');
  if (existing) existing.remove();

  const response = await fetch('/modals/profileModal.html');
  const html = await response.text();
  document.body.insertAdjacentHTML('beforeend', html);

  const modalOverlay = document.getElementById('profile-modal-overlay');
  const modal = document.getElementById('profile-modal');

  document.querySelector('[data-role="modal-username"]').textContent = username;
  const emailInput = document.querySelector('[data-role="modal-email"]');
  emailInput.value = email;

  requestAnimationFrame(() => {
    modalOverlay.classList.replace('opacity-0', 'opacity-100');
    modal.classList.replace('scale-95', 'scale-100');
  });

  const close = () => {
    modalOverlay.classList.replace('opacity-100', 'opacity-0');
    modal.classList.replace('scale-100', 'scale-95');
    setTimeout(() => modalOverlay.remove(), 300);
  };

  document.querySelector('[data-role="modal-close"]').addEventListener('click', close);
  modalOverlay.addEventListener('click', e => e.target === modalOverlay && close());

  const editBtn = document.querySelector('[data-role="modal-edit-email"]');
  const saveBtn = document.querySelector('[data-role="modal-save-email"]');
  let editable = false;

  editBtn.addEventListener('click', () => {
    editable = true;
    emailInput.disabled = false;
    emailInput.focus();
    saveBtn.classList.remove('hidden');
  });

  saveBtn.addEventListener('click', async () => {
    try {
      const message = await useChangeEmail(emailInput.value.trim());
      Swal.fire('Actualizado', message, 'success');
      close();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  });

  const resendBtn = document.querySelector('[data-role="modal-resend-verification"]');
  if (email_verified) {
    resendBtn.disabled = true;
    resendBtn.textContent = 'Correo verificado';
  } else {
    resendBtn.addEventListener('click', async () => {
      try {
        resendBtn.disabled = true;
        startCooldown(resendBtn, 60);
        const message = await useResendVerification();
        Swal.fire('Enviado', message, 'success');
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
        resendBtn.disabled = false;
        resendBtn.textContent = 'Verificar correo';
      }
    });
  }
}
