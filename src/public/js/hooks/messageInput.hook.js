import { appendMessage } from "../renders/messages.render.js";

export function initMessageInput(socket, userId, els) {
  const form = els.chatConversation?.querySelector("[data-role='chat-form']");
  const input = els.chatConversation.querySelector("[data-role='chat-input']");

  if (!form || !input) return;

  function sendMessage(to, content) {
    socket.emit("private_message", { to, content });
  }

  // Limpiar listeners previos
  form.onsubmit = null;

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Evitar ocultar chatConversation

    const content = input.value.trim();
    if (!content) return;

    // Enviar al backend
    sendMessage(userId, content);

    // Render inmediato
    appendMessage({ content }, els, "sent");

    input.value = "";
  });
}
