import { changeEmail, resendVerification } from '../hooks/profile.hook.js';
import { changeAvatar } from '../hooks/avatar.hook.js';
import { showAlert } from './alert.utils.js';
import { updateAuthUI } from './ui.utils.js';

/**
 * Carga y muestra un modal genérico
 * @param {string} url - Ruta al archivo HTML del modal
 * @param {string} overlayId - ID del overlay del modal
 * @param {string} modalId - ID del contenedor del modal
 * @param {Function} onInit - Callback para inicializar contenido y eventos
 */

async function loadAndShowModal({ url, overlayId, modalId, onInit }) {
  const existing = document.getElementById(overlayId);
  if (existing) existing.remove();

  const response = await fetch(url);
  if (!response.ok) {
    console.error('Error cargando el modal:', response.statusText);
    return;
  }

  const html = await response.text();
  document.body.insertAdjacentHTML('beforeend', html);

  const overlay = document.getElementById(overlayId);
  const modal = document.getElementById(modalId);

  // Animación de entrada
  requestAnimationFrame(() => {
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100');
    modal.classList.remove('scale-95');
    modal.classList.add('scale-100');
  });

  // Función cerrar
  const close = () => {
    overlay.classList.add('opacity-0');
    modal.classList.remove('scale-100');
    modal.classList.add('scale-95');
    setTimeout(() => overlay.remove(), 300);
  };

  // Eventos de cierre genéricos
  const closeBtn = overlay.querySelector('[data-role="modal-close"]');
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => e.target === overlay && close());

  // Ejecutar lógica específica del modal
  if (typeof onInit === 'function') {
    onInit({ overlay, modal, close });
  }
}

// === Modales específicos === //

export function showConfigProfileModal(username, email, email_verified = false) {
  return loadAndShowModal({
    url: '/modals/configProfileModal.html',
    overlayId: 'config-profile-modal-overlay',
    modalId: 'config-profile-modal',
    onInit: ({ close }) => {
      document.querySelector('[data-role="config-modal-username"]').textContent = username;
      const emailInput = document.querySelector('[data-role="config-modal-email"]');
      emailInput.value = email;

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
        if (emailInput.value.trim()) {
          await changeEmail(emailInput.value.trim());
          close();
        }
      });

      const resendBtn = document.querySelector('[data-role="modal-resend-verification"]');
      if (email_verified) {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Correo verificado';
      } else {
        resendBtn.addEventListener('click', () => resendVerification(resendBtn));
      }
    }
  });
}

export function showUserProfileModal({ username }) {
  return loadAndShowModal({
    url: '/modals/userProfileModal.html',
    overlayId: 'profile-modal-overlay',
    modalId: 'profile-modal',
    onInit: () => {
      document.querySelector('[data-role="modal-username"]').textContent = `@${username}`;
      document.querySelector('[data-role="modal-bio"]').textContent =
        'Este es un perfil de prueba. Aquí va la bio del usuario...';
    }
  });
}

export function showChangeAvatarModal(currentAvatarUrl, els) {
  return loadAndShowModal({
    url: '/modals/changeAvatarModal.html',
    overlayId: 'change-avatar-overlay',
    modalId: 'change-avatar-modal',
    onInit: () => {
      const avatarImg = document.querySelector('[data-role="current-avatar"]');
      avatarImg.src = currentAvatarUrl;

      const fileInput = document.getElementById('avatar-upload');
      fileInput.addEventListener('change', async(e) => {
        const file = e.target.files[0];
	if (!file) return;

	try {
	  const { avatar } = await changeAvatar(file);

	  // Actualiza la vista dentro del modal
	  avatarImg.src = avatar;

	  // Refresca toda la UI
	  updateAuthUI(els);

	  // También actualiza el sidebar
	  const sidebarAvatar = document.querySelector('[data-role="sidebar-avatar"]');
	  if (sidebarAvatar) sidebarAvatar.src = avatar;

	  showAlert('success', 'Avatar actualizado correctamente');
	  setTimeout(() => close(), 800);
	} catch (err) {
	  console.error(err);
	  showAlert('error', err.message);
	}
      });
    },
  });
}
