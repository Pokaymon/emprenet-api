import { appendMessage, updateMessage } from "../renders/messages.render.js";
import { getCurrentUserId } from "../utils/token.utils.js";

export function initMessageInput(socket, userId, els) {
  const form = els.chatConversation?.querySelector("[data-role='chat-form']");
  const input = els.chatConversation?.querySelector("[data-role='chat-input']");

  if (!form || !input) return;

  // Definir el handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const content = input.value.trim();
    if (!content) return;

    const tempId = Date.now();

    // Pintar inmediatamente en UI
    appendMessage({ content, from: getCurrentUserId(), to: userId, tempId }, els, "sent");

    // Enviar al backend
    socket.emit("private_message", { to: userId, content, tempId });

    input.value = "";
  };

  // Evitar duplicados removiendo antes el listener
  form.removeEventListener("submit", form._listener);
  form.addEventListener("submit", handleSubmit);
  form._listener = handleSubmit; // guardamos la referencia para quitarlo luego
}
