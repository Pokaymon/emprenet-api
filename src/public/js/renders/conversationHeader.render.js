export function renderConversationHeader(user, els) {
  const conversation = els.chatConversation;
  if (!conversation) return;

  const header = conversation.querySelector(".p-4.border-b");
  if (!header) return;

  // Tomar estado actualizado desde la lista
  const chatList = els.chatContainer?.querySelector('[data-role="chat-users-list"]');
  const userDot = chatList?.querySelector(`[data-user-id="${user.id}"] span`);
  const isOnline = userDot?.classList.contains("bg-green-500");

  header.setAttribute("data-conversation-user-id", user.id);

  header.innerHTML = `
    <div class="flex items-center gap-3">
      <img
        src="${user.avatar || "https://cdn.emprenet.work/Icons/default-avatar-2.webp"}"
        alt="Avatar"
        class="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p data-user-id="${user.id}" class="font-medium text-sm text-gray-900 dark:text-white">${user.username}</p>
        <p data-role="conversation-status" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <span class="w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}"></span>
          ${isOnline ? "En línea" : "Desconectado"}
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
