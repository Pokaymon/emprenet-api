export function renderEmptyChatList(chatList) {
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
}

export function renderChatItem(user) {
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

  return div;
}
