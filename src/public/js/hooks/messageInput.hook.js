import { appendMessage } from "../renders/messages.render.js";

export function initMessageInput(socket, userId, els) {
  const form = els.chatConversation?.querySelector("[data-role='chat-form']");
  const input = els.chatConversation.querySelector("[data-role='chat-input']");

  if (!form || !input) return;

  // Clonar el formulario para limpiar listeners anteriores
  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const content = input.value.trim();
    if (!content) return;

    // Emitir al backend
    socket.emit("private_message", { to: userId, content });

    // Render inmediato en el cliente
    appendMessage({ content, to: userId }, els, "sent");

    input.value = "";
  });
}
