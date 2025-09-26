export function initMessageInput(socket, userId, els) {
  const input = els.chatConversation.querySelector("input[type='text']");
  const sendBtn = els.chatConversation.querySelector("button");

  function sendMessage(to, content) {
    socket.emit("private_message", { to, content });
  }

  sendBtn.onclick = () => {
    const content = input.value.trim();
    if (!content) return;
    sendMessage(userId, content);
    input.value = "";
  };

  input.onkeypress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendBtn.click();
    }
  };
}
