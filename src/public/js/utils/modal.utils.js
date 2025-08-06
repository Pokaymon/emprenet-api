export async function showProfileModal(username, email, email_verified = false) {
  const existing = document.getElementById('profile-modal-overlay');
  if (existing) existing.remove();

  const response = await fetch('/modals/profileModal.html');
  const html = await response.text();
  document.body.insertAdjacentHTML('beforeend', html);

  const modalOverlay = document.getElementById('profile-modal-overlay');
  const modal = document.getElementById('profile-modal');

  // Set data
  document.querySelector('[data-role="modal-username"]').textContent = username;
  const emailInput = document.querySelector('[data-role="modal-email"]');
  emailInput.value = email;

  // Transiciones
  requestAnimationFrame(() => {
    modalOverlay.classList.remove('opacity-0', 'pointer-events-none');
    modalOverlay.classList.add('opacity-100');
    modal.classList.remove('scale-95');
    modal.classList.add('scale-100');
  });

  // Eventos
  const close = () => {
    modalOverlay.classList.add('opacity-0');
    modal.classList.remove('scale-100');
    modal.classList.add('scale-95');
    setTimeout(() => modalOverlay.remove(), 300);
  };

  document.querySelector('[data-role="modal-close"]').addEventListener('click', close);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) close();
  });

  // Editar email
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
    const newEmail = emailInput.value.trim();
    if (!newEmail) return;

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

      Swal.fire('Actualizado', 'Tu email ha sido actualizado', 'success');
      close();
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  });

  const resendBtn = document.querySelector('[data-role="modal-resend-verification"]');

  if (email_verified) {
    resendBtn.disabled = true;
    resendBtn.textContent = 'Correo verificado';
  }

  // 🔁 Reenviar verificación con cooldown
  resendBtn?.addEventListener('click', async () => {
    try {
      resendBtn.disabled = true;
      startCooldown(resendBtn, 60); // 60 segundos

      const token = localStorage.getItem('token');
      const response = await fetch('/auth/email/resend-verification', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      Swal.fire('Enviado', data.message || 'Correo reenviado con éxito', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
      resendBtn.disabled = false;
      resendBtn.textContent = 'Verificar correo';
    }
  });
}

// ⏱️ Cooldown para botón
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

