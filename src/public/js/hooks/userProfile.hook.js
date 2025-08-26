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
    const avatarEl = modal.querySelector("img");
    if (avatarEl) {
      avatarEl.src = profileData.avatar || "https://cdn.emprenet.work/Icons/default-avatar-2.webp";
    }

    // Username
    modal.querySelector('[data-role="modal-username"]').textContent = `@${profileData.username}`;

    // Bio
    modal.querySelector('[data-role="modal-bio"]').textContent =
      profileData.profile.biografia || "Sin biografía";

    // Stats
    const statsEls = modal.querySelectorAll("strong");
    if (statsEls.length >= 3) {
      statsEls[0].textContent = profileData.profile.publicaciones;
      statsEls[1].textContent = profileData.profile.seguidores;
      statsEls[2].textContent = profileData.profile.seguidos;
    }

    // Botón seguir / dejar de seguir
    const followBtn = modal.querySelector('[data-role="modal-follow"]');
    if (followBtn) {
      if (profileData.isFollowing) {
        followBtn.textContent = "Dejar de seguir";
        followBtn.classList.remove("bg-black", "text-white");
        followBtn.classList.add("bg-gray-200", "text-black");
      } else {
        followBtn.textContent = "Seguir";
        followBtn.classList.remove("bg-gray-200", "text-black");
        followBtn.classList.add("bg-black", "text-white");
      }
    }

    // (Opcional) aquí mismo puedes añadir handler para seguir/dejar de seguir

  } catch (err) {
    console.error("Error cargando perfil:", err);
  }
}
