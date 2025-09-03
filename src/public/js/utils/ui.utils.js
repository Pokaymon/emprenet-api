import { parseJwt } from './token.utils.js';
import { initUserSearch } from '../hooks/searchUsers.hook.js';
import { toggleFollow } from '../hooks/follow.hook.js';

export function toggleVisibility(el, show) {
  if (!el) return;
  el.classList.toggle('opacity-0', !show);
  el.classList.toggle('pointer-events-none', !show);
}

export function switchTabs(showForm, hideForm, activeBtn, inactiveBtn) {
  // Mostrar formulario destino
  showForm.classList.remove("opacity-0", "pointer-events-none");
  showForm.classList.add("opacity-100");

  // Ocultar formulario actual
  hideForm.classList.remove("opacity-100");
  hideForm.classList.add("opacity-0", "pointer-events-none");

  // Ajustar dinámicamente el alto del wrapper
  const wrapper = showForm.closest("[data-role='form-wrapper']");
  if (wrapper) {
    // Leer altura actual
    const currentHeight = wrapper.offsetHeight;

    // Forzar transición: primero fijo la altura actual
    wrapper.style.height = currentHeight + "px";

    // Esperar dos frames antes de medir el nuevo alto
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const newHeight = showForm.scrollHeight;
        wrapper.style.height = newHeight + "px";
      });
    });
  }

  // Cambiar estado de los botones
  activeBtn.setAttribute("data-state", "active");
  inactiveBtn.setAttribute("data-state", "inactive");
}

export function updateAuthUI({
  loginFormContainer,
  loginButton,
  userImage,
  searchUsersContainer,
  sidebarAvatar,
}) {
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);

  toggleVisibility(loginFormContainer, !isAuthenticated);
  toggleVisibility(loginButton, !isAuthenticated);
  toggleVisibility(userImage, isAuthenticated);
  toggleVisibility(searchUsersContainer, isAuthenticated);

  if (isAuthenticated) {
    const user = parseJwt(token);
    document.querySelector('[data-role="sidebar-username"]').textContent = user?.username || 'Usuario';
    document.querySelector('[data-role="sidebar-email"]').textContent = user?.email || 'example@ejemplo.com';

    // Actualizar avatar
    const avatarUrl = user?.avatar || 'https://cdn.emprenet.work/Icons/default-avatar-2.webp';

    // Imagen circular en el index
    const userImageEl = userImage.querySelector('img');
    if (userImageEl) userImageEl.src = avatarUrl;

    // Avatar en sidebar
    if (sidebarAvatar) sidebarAvatar.src = avatarUrl;

    // Inicializar barra de búsqueda
    const searchInput = document.querySelector('[data-role="search-input"]');
    const searchResults = document.querySelector('[data-role="search-results"]');
    initUserSearch(searchInput, searchResults);
  }
};

/**
 * Actualiza dinámicamente el contador de seguidores en el modal
 * @param {HTMLElement} modal - Elemento modal donde buscar el contador
 * @param {boolean} isNowFollowing - true si el usuario empezó a seguir, false si dejó de seguir
 */
export function updateFollowerCount(modal, isNowFollowing) {
  const statFollowers = modal.querySelector('[data-role="stat-followers"]');
  if (!statFollowers) return;

  let current = parseInt(statFollowers.textContent) || 0;
  const newCount = isNowFollowing ? current + 1 : Math.max(current - 1, 0);
  statFollowers.textContent = newCount;
};

/**
 * Renderiza y gestiona el botón Seguir/Dejar de seguir
 * @param {Object} profileData - Datos del perfil
 * @param {HTMLElement} modal - Elemento del modal
 * @param {string} currentUserId - ID del usuario autenticado
 */
export function renderFollowButton(profileData, modal, currentUserId) {
  const followBtn = modal.querySelector('[data-role="modal-follow"]');
  if (!followBtn) return;

  // No renderizar si el usuario es el mismo
  if (profileData.id === currentUserId) {
    followBtn.remove();
    return;
  }

  // Estado inicial
  let isFollowing = Boolean(profileData.isFollowing);
  followBtn.textContent = isFollowing ? "Dejar de seguir" : "Seguir";
  applyFollowBtnStyle(followBtn, isFollowing);

  // Listener
  followBtn.addEventListener("click", async () => {
    try {
      const result = await toggleFollow(profileData.id);

      // Invertir estado
      isFollowing = !isFollowing;
      followBtn.textContent = isFollowing ? "Dejar de seguir" : "Seguir";
      applyFollowBtnStyle(followBtn, isFollowing);

      // Actualizar contador
      updateFollowerCount(modal, isFollowing);
    } catch (_) {}
  });
}

/**
 * Aplica estilos al botón según estado
 * @param {HTMLElement} btn
 * @param {boolean} isFollowing
 */
function applyFollowBtnStyle(btn, isFollowing) {
  btn.className =
    "cursor-pointer rounded-md px-4 py-2 font-medium transition-all duration-300 ease-in-out transform";
  if (isFollowing) {
    btn.classList.add(
      "bg-gray-200",
      "text-black",
      "hover:bg-gray-300",
      "scale-95",
    );
  } else {
    btn.classList.add(
      "bg-black",
      "text-white",
      "hover:bg-gray-800",
      "dark:bg-white",
      "dark:text-black",
      "dark:hover:bg-gray-200",
      "scale-100",
    );
  }
}
