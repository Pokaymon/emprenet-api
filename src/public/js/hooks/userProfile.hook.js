import { replaceSkeleton } from "../utils/skeleton.utils.js";
import { toggleFollow } from "./follow.hook.js";

export async function initUserProfileModal({ username, overlay, modal }) {
  const token = localStorage.getItem("token");
  if (!token) return;

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
    const followEl = modal.querySelector('[data-role="modal-follow"]');
    if (followEl) {
      // Fade out skeleton
      followEl.classList.add("transition-opacity", "duration-300", "opacity-0");

      setTimeout(() => {
        const btn = document.createElement("button");
        btn.setAttribute("data-role", "modal-follow");
        btn.className =
          "cursor-pointer rounded-md px-4 py-2 font-medium transition-colors";

        if (profileData.isFollowing) {
          btn.textContent = "Dejar de seguir";
          btn.classList.add("bg-gray-200", "text-black");
        } else {
          btn.textContent = "Seguir";
          btn.classList.add(
            "bg-black",
            "text-white",
            "hover:bg-gray-800",
            "dark:bg-white",
            "dark:text-black",
            "dark:hover:bg-gray-200"
          );
        }

        // Follow / Unfollow
        btn.addEventListener("click", async () => {
	  try {
	    const result = await toggleFollow(profileData.id);

	    // Invertir estado
	    const isNowFollowing = result.message.includes("sigues");
	    btn.textContent = isNowFollowing ? "Dejar de seguir" : "Seguir";

	    btn.className = "cursor-pointer rounded-md px-4 py-2 font-medium transition-colors";
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

	    // Update count
	    const statFollowers = modal.querySelector('[data-role="stat-followers"]');
	    if (statFollowers) {
	      let curret = parseInt(statFollowers.textContent) || 0;
	      statFollowers.textContent = isNowFollowing ? current + 1 : current - 1;
	    }
	  } catch (_){}
        });

        followEl.replaceWith(btn);
      }, 300);
    }

  } catch (err) {
    console.error("Error cargando perfil:", err);
  }
}
