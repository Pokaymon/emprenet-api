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
  // Carga inicial de seguidos al conectar
  fetchFollowing().then(users => renderFollowing(users, els));

  // Cuando cambie la lista en el backend
  socket.on("following:updated", async () => {
    console.log("Lista de seguidos actualizada...");
    const users = await fetchFollowing();
    renderFollowing(users, els);
  });

  // Cuando cambie el estado de un usuario
  socket.on("user:status", ({ userId, status }) => {
    const chatList = els.chatContainer?.querySelector('[data-role="chat-users-list"]');
    if (!chatList) return;

    const userEl = chatList.querySelector(`[data-user-id="${userId}"] span`);
    if (userEl) {
      userEl.classList.remove("bg-gray-400", "bg-green-500");
      userEl.classList.add(status === "online" ? "bg-green-500" : "bg-gray-400");
    }

    // Si el usuario está en la conversación activa, actualizar header
    const conversation = els.chatConversation;
    if (conversation && !conversation.classList.contains("opacity-0")) {
      const usernameEl = conversation.querySelector("p.font-medium");
      if (usernameEl && usernameEl.textContent === userId) {
        const statusEl = conversation.querySelector("p.text-xs");
        if (statusEl) {
          statusEl.innerHTML = `
            <span class="w-2 h-2 rounded-full ${status === "online" ? "bg-green-500" : "bg-gray-400"}"></span>
            ${status === "online" ? "En línea" : "Desconectado"}
          `;
        }
      }
    }
  });
}

function renderFollowing(users, els) {
  const chatList = els.chatContainer?.querySelector('[data-role="chat-users-list"]');
  if (!chatList) return;

  div.addEventListener("click"; () => {
    renderConversationHeader(user, els);
    els.chatConversation?.classList.remove("opacity-0", "pointer-events-none");
  });

  chatList.innerHTML = "";

  if (users.length === 0) {
    chatList.innerHTML = `
      <div class="flex flex-col items-center justify-center py-10 text-center">
        <div class="w-20 h-20 flex items-center justify-center">
          <img 
            src="https://cdn.emprenet.work/Icons/png/empyChatlist.png" 
            alt="Sin chats" 
            class="max-w-full max-h-full opacity-70 dark:invert"
          />
        </div>
        <p class="mt-3 font-medium text-sm text-gray-600 dark:text-gray-300">
          Aún no sigues a nadie
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Cuando sigas a alguien, aparecerá aquí para que puedas chatear con él.
        </p>
      </div>
    `;
    return;
  }

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors";
    div.setAttribute("data-user-id", user.id);

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
      <span class="w-3 h-3 ${user.online ? "bg-green-500" : "bg-gray-400"} rounded-full"></span>
    `;
    div.addEventListener("click", () => {
      els.chatConversation?.classList.remove("opacity-0", "pointer-events-none");
    });
    chatList.appendChild(div);
  });
}

function renderConversationHeader(user, els) {
  const conversation = els.chatConversation;
  if (!conversation) return;

  const header = conversation.querySelector(".p-4.border-b");
  if (!header) return;

  header.innerHTML = `
    <div class="flex items-center gap-3">
      <img
        src="${user.avatar || "https://cdn.emprenet.work/Icons/default-avatar-2.webp"}"
        alt="Avatar"
        class="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p class="font-medium text-sm text-gray-900 dark:text-white">${user.username}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <span class="w-2 h-2 rounded-full ${user.online ? "bg-green-500" : "bg-gray-400"}"></span>
          ${user.online ? "En línea" : "Desconectado"}
        </p>
      </div>
    </div>

    <button
      data-role="chat-back"
      class="p-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
      aria-label="Volver"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
           stroke-width="2" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  `;
}
