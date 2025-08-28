import { replaceSkeleton } from "../utils/skeleton.utils.js";
import { updateFollowerCount } from "../utils/ui.utils.js";
import { renderFollowButton } from "../utils/ui.utils.js";
import { parseJwt, getAuthToken } from "../utils/token.utils.js";

import { toggleFollow } from "./follow.hook.js";

export async function initUserProfileModal({ username, overlay, modal }) {
  const token = getAuthToken();
  if (!token) return;

  // Decodigicar token
  const currentUser = parseJwt(token);
  if (!currentUser?.id) {
    console.error("No se puedo obtener el usuario actual desde el token");
    return;
  }

  try {
    // 1. Buscar el usuario por username
    const resSearch = await fetch(`/users/search?q=@${encodeURIComponent(username)}&mode=exact`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resSearch.ok) throw new Error("Error buscando usuario");
    const user = await resSearch.json();
    if (!user?.id) throw new Error("Usuario no encontrado");

    // 2. Obtener perfil completo
    const resProfile = await fetch(`/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resProfile.ok) throw new Error("Error obteniendo perfil");
    const profileData = await resProfile.json();

    // 3. Mapear datos al modal

    // Avatar
    const avatarContainer = modal.querySelector('[data-role="modal-avatar"]');
    if (avatarContainer) {
      const img = document.createElement("img");
      img.src = profileData.avatar || "https://cdn.emprenet.work/Icons/default-avatar-2.webp";
      img.alt = "Avatar usuario";
      img.className = "h-full w-full object-cover";
      avatarContainer.replaceWith(img);
    }

    // Username
    replaceSkeleton(modal.querySelector('[data-role="modal-username"]'), {
      finalClasses: ["font-bold", "text-xl", "sm:text-2xl"],
      content: `@${profileData.username}`,
    });

    // Bio
    replaceSkeleton(modal.querySelector('[data-role="modal-bio"]'), {
      finalClasses: ["text-gray-700", "dark:text-gray-300"],
      content: profileData.profile.biografia || "Sin biografía",
    });

    // Stats
    const statsMap = {
      "stat-posts": profileData.profile.publicaciones,
      "stat-followers": profileData.profile.seguidores,
      "stat-following": profileData.profile.seguidos,
    };

    Object.entries(statsMap).forEach(([role, value]) => {
      replaceSkeleton(modal.querySelector(`[data-role="${role}"]`), {
        finalClasses: ["font-semibold"],
        content: value,
      });
    });

    // Botón seguir / dejar de seguir
    renderFollowButton(profileData, modal, currentUser.id);

    // Configurar evento follow/unfollow
    const btn = modal.querySelector('[data-role="follow-btn"]');
    if (btn) {
      btn.addEventListener("click", async () => {
        try {
          const result = await toggleFollow(profileData.id);

          const isNowFollowing = result.message.includes("sigues");
          btn.textContent = isNowFollowing ? "Dejar de seguir" : "Seguir";

          btn.className =
            "cursor-pointer rounded-md px-4 py-2 font-medium transition-colors";
          if (isNowFollowing) {
            btn.classList.add("bg-gray-200", "text-black");
          } else {
            btn.classList.add(
              "bg-black",
              "text-white",
              "hover:bg-gray-800",
              "dark:bg-white",
              "dark:text-black",
              "dark:hover:bg-gray-200"
            );
          }

          updateFollowerCount(modal, isNowFollowing);
        } catch (_) {}
      });
    }
  } catch (err) {
    console.error("Error cargando perfil:", err);
  }
}
