import { showAlert } from "../utils/alert.utils.js";
import { renderEmptyChatList, renderChatItem } from "../renders/chatList.render.js";
import { renderConversationHeader } from "../renders/conversationHeader.render.js";

async function fetchFollowing() {
  const token = localStorage.getItem("token");
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
  // Carga inicial de seguidos
  fetchFollowing().then((users) => renderFollowing(users, els));

  socket.on("following:updated", async () => {
    const users = await fetchFollowing();
    renderFollowing(users, els);
  });

  socket.on("user:status", ({ userId, status }) => {
    updateStatus(userId, status, els);
  });
}

function renderFollowing(users, els) {
  const chatList = els.chatContainer?.querySelector('[data-role="chat-users-list"]');
  if (!chatList) return;

  chatList.innerHTML = "";

  if (users.length === 0) {
    renderEmptyChatList(chatList);
    return;
  }

  users.forEach((user) => {
    const item = renderChatItem(user);
    item.addEventListener("click", () => {
      renderConversationHeader(user, els);
      els.chatConversation?.classList.remove("opacity-0", "pointer-events-none");

      const backBtn = els.chatConversation.querySelector("[data-role='chat-back']");
      backBtn?.addEventListener("click", () => {
        els.chatConversation.classList.add("opacity-0", "pointer-events-none");
      });
    });

    chatList.appendChild(item);
  });
}

function updateStatus(userId, status, els) {
  const chatList = els.chatContainer?.querySelector('[data-role="chat-users-list"]');
  if (!chatList) return;

  // Lista
  const userEl = chatList.querySelector(`[data-user-id="${userId}"] span`);
  if (userEl) {
    userEl.classList.remove("bg-gray-400", "bg-green-500");
    userEl.classList.add(status === "online" ? "bg-green-500" : "bg-gray-400");
  }

  // Header activo
  const conversation = els.chatConversation;
  const activeUserId = conversation?.querySelector("[data-conversation-user-id]")?.getAttribute("data-conversation-user-id");

  if (conversation && activeUserId === String(userId)) {
    const statusEl = conversation.querySelector("[data-role='conversation-status']");
    if (statusEl) {
      const dot = statusEl.querySelector("span");
      if (dot) {
        dot.classList.remove("bg-gray-400", "bg-green-500");
        dot.classList.add(status === "online" ? "bg-green-500" : "bg-gray-400");
      }
      statusEl.lastChild.textContent = status === "online" ? "En línea" : "Desconectado";
    }
  }
}
