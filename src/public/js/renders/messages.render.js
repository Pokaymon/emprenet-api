export function renderMessages(messages, els, user) {
  const container = els.chatConversation?.querySelector(".flex-1");
  if (!container) return;

  container.innerHTML = "";

  messages.forEach((msg) => {
    const type = msg.from === localStorage.getItem("userId") ? "sent" : "received";
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

  bubble.innerHTML = `
    <div class="max-w-xs ${type === "sent"
      ? "bg-blue-500 text-white"
      : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
    } rounded-lg px-3 py-2 text-sm">
      <p>${msg.content}</p>
    </div>
  `;

  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight; // scroll al último
}
