import { changeEmail, resendVerification } from '../hooks/profile.hook.js';

export async function showConfigProfileModal(username, email, email_verified = false) {
  const existing = document.getElementById('config-profile-modal-overlay');
  if (existing) existing.remove();

  const response = await fetch('/modals/configProfileModal.html');
  if (!response.ok) {
    console.error("Error cargando el modal:", response.statusText);
    return;
  }

  const html = await response.text();
  document.body.insertAdjacentHTML('beforeend', html);

  const modalOverlay = document.getElementById('config-profile-modal-overlay');
  const modal = document.getElementById('config-profile-modal');

  document.querySelector('[data-role="config-modal-username"]').textContent = username;
  const emailInput = document.querySelector('[data-role="config-modal-email"]');
  emailInput.value = email;

  requestAnimationFrame(() => {
    modalOverlay.classList.remove('opacity-0', 'pointer-events-none');
    modalOverlay.classList.add('opacity-100');
    modal.classList.remove('scale-95');
    modal.classList.add('scale-100');
  });

  const close = () => {
    modalOverlay.classList.add('opacity-0');
    modal.classList.remove('scale-100');
    modal.classList.add('scale-95');
    setTimeout(() => modalOverlay.remove(), 300);
  };

  document.querySelector('[data-role="config-modal-close"]').addEventListener('click', close);
  modalOverlay.addEventListener('click', (e) => e.target === modalOverlay && close());

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

export async function showUserProfileModal({ username }) {
  const existing = document.getElementById("profile-modal-overlay");
  if (existing) existing.remove();

  const response = await fetch("/modals/userProfileModal.html");
  if (!response.ok) {
    console.error("Error cargando el modal:", response.statusText);
    return;
  }

  const html = await response.text();
  document.body.insertAdjacentHTML("beforeend", html);

  const modalOverlay = document.getElementById("profile-modal-overlay");
  const modal = document.getElementById("profile-modal");

  // Por ahora contenido estático
  document.querySelector("[data-role='modal-username']").textContent = `@${username}`;
  document.querySelector("[data-role='modal-bio']").textContent = "Este es un perfil de prueba. Aquí va la bio del usuario...";

  // Animación de entrada
  requestAnimationFrame(() => {
    modalOverlay.classList.remove("opacity-0", "pointer-events-none");
    modalOverlay.classList.add("opacity-100");
    modal.classList.remove("scale-95");
    modal.classList.add("scale-100");
  });

  // Cerrar modal
  const close = () => {
    modalOverlay.classList.add("opacity-0");
    modal.classList.remove("scale-100");
    modal.classList.add("scale-95");
    setTimeout(() => modalOverlay.remove(), 300);
  };

  document.querySelector("[data-role='modal-close']").addEventListener("click", close);
  modalOverlay.addEventListener("click", (e) => e.target === modalOverlay && close());
}

export async function showChangeAvatarModal(currentAvatarUrl) {
  const existing = document.getElementById("change-avatar-overlay");
  if (existing) existing.remove();

  const response = await fetch("/modals/changeAvatarModal.html");
  if (!response.ok) {
    console.error("Error cargando el modal:", response.statusText);
    return;
  }

  const html = await response.text();
  document.body.insertAdjacentHTML("beforeend", html);

  const overlay = document.getElementById("change-avatar-overlay");
  const modal = document.getElementById("change-avatar-modal");

  // Set avatar actual
  document.querySelector("[data-role='current-avatar']").src = currentAvatarUrl;

  // Animación entrada
  requestAnimationFrame(() => {
    overlay.classList.remove("opacity-0", "pointer-events-none");
    overlay.classList.add("opacity-100");
    modal.classList.remove("scale-95");
    modal.classList.add("scale-100");
  });

  // Cerrar
  const close = () => {
    overlay.classList.add("opacity-0");
    modal.classList.remove("scale-100");
    modal.classList.add("scale-95");
    setTimeout(() => overlay.remove(), 300);
  };

  document.querySelector("[data-role='modal-close']").addEventListener("click", close);
  overlay.addEventListener("click", (e) => e.target === overlay && close());
}
