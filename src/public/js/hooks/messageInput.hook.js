import { appendMessage } from "../renders/messages.render.js";

export function initMessageInput(socket, userId, els) {
  const form = els.chatConversation?.querySelector("[data-role='chat-form']");
  const input = els.chatConversation?.querySelector("[data-role='chat-input']");

  if (!form || !input) return;

  // Definir el handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const content = input.value.trim();
    if (!content) return;

    // Enviar al backend
    socket.emit("private_message", { to: userId, content });

    // Render inmediato en el cliente
    appendMessage({ content, from: localStorage.getItem("userId"), to: userId }, els, "sent");

    input.value = "";
  };

  // Evitar duplicados removiendo antes el listener
  form.removeEventListener("submit", form._listener);
  form.addEventListener("submit", handleSubmit);
  form._listener = handleSubmit; // guardamos la referencia para quitarlo luego
}
