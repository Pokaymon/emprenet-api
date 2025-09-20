import { initFollowingSocket } from '../hooks/userChat.hook.js';

let socket = null;

export function connectSocket(token, els) {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io("https://api.emprenet.work", { auth: { token } });
  initFollowingSocket(socket, els);

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket desconectado manualmente");
  }
}


export function getSocket() {
  return socket;
}
