import { showAlert } from '../utils/alert.utils.js';

async function fetchFollowing() {
  const token = localStorage.getItem('token');
  if (!token) return [];

  try {
    const res = await fetch("https://api.emprenet.work/users/following", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Error al obtener la lista de seguidos");

    const data = await res.json();
    return data.following || [];
  } catch (err) {
    console.error(err);
    showAlert("error", "No se pudo cargar la lista de seguidos.");
    return [];
  }
}

export function initFollowingSocket(socket, els) {
  socket.on("following:updated", async () => {
    console.log("Lista de seguidos actualizada...");
    const users = await fetchFollowing();
    renderFollowing(users, els);
  });
}

function renderFollowing(users, els) {
  const chatList = els.chatContainer?.querySelector('[data-role="chat-users-list"]');
  if (!chatList) return;

  chatList.innerHTML = "";

  if (users.length === 0) {
    chatList.innerHTML = `
      <div class="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
        <img src="https://cdn.emprenet.work/Icons/empty-chat.svg" alt="Sin chats" class="w-16 h-16 mb-3 opacity-70" />
        <p class="font-medium text-sm">Aún no sigues a nadie</p>
        <p class="text-xs">Cuando sigas a alguien, aparecerá aquí para que puedas chatear con él.</p>
      </div>
    `;
    return;
  }

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors";
    div.innerHTML = `
      <img
        src="${user.avatar || "https://cdn.emprenet.work/Icons/default-avatar-2.webp"}"
        alt="Avatar"
        class="w-10 h-10 rounded-full object-cover"
      />
      <div class="flex-1 text-left">
        <p class="font-medium text-sm text-gray-900 dark:text-white">${user.username}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">Último mensaje...</p>
      </div>
      <span class="w-3 h-3 bg-gray-400 rounded-full"></span>
    `;
    div.addEventListener("click", () => {
      els.chatConversation?.classList.remove("opacity-0", "pointer-events-none");
    });
    chatList.appendChild(div);
  });
}
