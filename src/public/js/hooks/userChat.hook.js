import { showAlert } from "../utils/alert.utils.js";
import { getCurrentUserId } from "../utils/token.utils.js";

import { renderEmptyChatList, renderChatItem } from "../renders/chatList.render.js";
import { renderConversationHeader } from "../renders/conversationHeader.render.js";
import { renderMessages, appendMessage } from "../renders/messages.render.js";

import { initMessageInput } from "./messageInput.hook.js";

let currentChatUserId = null;

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

async function fetchMessages(userId) {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`https://api.emprenet.work/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Error al obtener mensajes");
    const data = await res.json();
    return data.messages || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

export function initFollowingSocket(socket, els) {
  const currentUserId = getCurrentUserId();

  // Carga inicial de seguidos
  fetchFollowing().then((users) => renderFollowing(users, els, socket));

  socket.on("following:updated", async () => {
    const users = await fetchFollowing();
    renderFollowing(users, els, socket);
  });

  socket.on("user:status", ({ userId, status }) => {
    updateStatus(userId, status, els);
  });

  // Listener global de mensajes privados
  socket.on("private_message", (msg) => {
    if (msg.from === currentChatUserId || msg.to === currentChatUserId) {
      // Mensaje pertenece a la conversación actual
      const type = msg.from === currentUserId ? "sent" : "received";
    appendMessage(msg, els, type);
    } else {
      console.log("Nuevo mensaje de otro usuario:", msg);
    }
  });
}

function renderFollowing(users, els, socket) {
  const chatList = els.chatContainer?.querySelector('[data-role="chat-users-list"]');
  if (!chatList) return;

  chatList.innerHTML = "";

  if (users.length === 0) {
    renderEmptyChatList(chatList);
    return;
  }

  users.forEach((user) => {
    const item = renderChatItem(user);
    item.addEventListener("click", async () => {
      currentChatUserId = user.id; // Conversación activa

      renderConversationHeader(user, els);
      els.chatConversation?.classList.remove("opacity-0", "pointer-events-none");

      // Vaciar conversación inmediatamente
      const container = els.chatConversation?.querySelector(".flex-1");
      if (container) {
	container.innerHTML = `
          <div class="flex justify-center items-center flex-1 text-gray-500 text-sm">
            Cargando mensajes...
          </div>
        `;
      }

      // Cargar historial
      const messages = await fetchMessages(user.id);
      renderMessages(messages, els, user);

      // Iniciar input para la conversación
      initMessageInput(socket, user.id, els);

      // Volver
      const backBtn = els.chatConversation.querySelector("[data-role='chat-back']");
      backBtn?.addEventListener("click", () => {
        currentChatUserId = null; // Cerrar conversación
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
