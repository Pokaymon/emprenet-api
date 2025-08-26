export async function initUserProfileModal({ username, overlay, modal }) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // 1 Buscar el usuario por username → para conseguir su id
    const resSearch = await fetch(`/users/search?q=@${encodeURIComponent(username)}&mode=exact`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resSearch.ok) throw new Error("Error buscando usuario");
    const user = await resSearch.json();
    if (!user?.id) throw new Error("Usuario no encontrado");

    // 2 Obtener perfil completo
    const resProfile = await fetch(`/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resProfile.ok) throw new Error("Error obteniendo perfil");
    const profileData = await resProfile.json();

    // 3 Mapear datos al modal

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
    const usernameEl = modal.querySelector('[data-role="modal-username"]');
    if (usernameEl) {
      usernameEl.classList.remove("h-6", "w-40", "bg-gray-200", "animate-pulse", "rounded");
      usernameEl.textContent = `@${profileData.username}`;
    }

    // Bio
    const bioEl = modal.querySelector('[data-role="modal-bio"]');
    if (bioEl) {
      bioEl.classList.remove("h-4", "w-64", "bg-gray-200", "animate-pulse", "rounded");
      bioEl.textContent = profileData.profile.biografia || "Sin biografía";
    }

    // Stats
    const statsMap = {
      "stat-posts": profileData.profile.publicaciones,
      "stat-followers": profileData.profile.seguidores,
      "stat-following": profileData.profile.seguidos,
    };

    Object.entries(statsMap).forEach(([role, value]) => {
      const el = modal.querySelector(`[data-role="${role}"]`);
      if (el) {
        el.classList.remove("inline-block", "h-4", "w-8", "bg-gray-200", "animate-pulse", "rounded");
        el.textContent = value;
      }
    });

    // Botón seguir / dejar de seguir
    const followEl = modal.querySelector('[data-role="modal-follow"]');
    if (followEl) {
      // Reemplazar loader por botón real
      const btn = document.createElement("button");
      btn.setAttribute("data-role", "modal-follow");
      btn.className =
        "cursor-pointer rounded-md px-4 py-2 font-medium transition-colors";

      if (profileData.isFollowing) {
        btn.textContent = "Dejar de seguir";
        btn.classList.add("bg-gray-200", "text-black");
      } else {
        btn.textContent = "Seguir";
        btn.classList.add("bg-black", "text-white", "hover:bg-gray-800", "dark:bg-white", "dark:text-black", "dark:hover:bg-gray-200");
      }

      followEl.replaceWith(btn);
    }

    // (Opcional) aquí mismo puedes añadir handler para seguir/dejar de seguir

  } catch (err) {
    console.error("Error cargando perfil:", err);
  }
}

