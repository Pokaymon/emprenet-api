import { getCurrentUserId } from "../utils/token.utils.js";

export function renderMessages(messages, els, user) {
  const currentUserId = getCurrentUserId();

  const container = els.chatConversation?.querySelector(".flex-1");
  if (!container) return;

  container.innerHTML = "";

  messages.forEach((msg) => {
    const type = msg.from === currentUserId ? "sent" : "received";
    appendMessage(msg, els, type);
  });
}

export function appendMessage(msg, els, type = "received") {
  const container = els.chatConversation?.querySelector(".flex-1");
  if (!container) return;

  const bubble = document.createElement("div");
  bubble.className =
    type === "sent"
      ? "flex items-end gap-2 justify-end"
      : "flex items-start gap-2";

  // Marcamos con tempId o messageId según exista
  const attrs = msg.tempId
    ? `data-temp-id="${msg.tempId}"`
    : msg.id
      ? `data-message-id="${msg.id}"`
      : "";

  bubble.innerHTML = `
    <div class="max-w-xs ${type === "sent"
      ? "bg-blue-500 text-white"
      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
    } rounded-lg px-3 py-2 text-sm" ${attrs}>
      <p>${msg.content}</p>
    </div>
  `;

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

export function updateMessage(tempId, realId) {
  const bubble = document.querySelector(`[data-temp-id="${tempId}"]`);
  if (bubble) {
    bubble.setAttribute("data-message-id", realId);
    bubble.removeAttribute("data-temp-id");
  }
}
