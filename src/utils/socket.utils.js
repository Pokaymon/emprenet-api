import Message from '../models/Message.js';

const onlineUsers = new Map(); // userId -> socketId[]

/**
 * Marca a un usuario como conectado
 */
export function addOnlineUser(userId, socketId) {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, []);
  }
  onlineUsers.get(userId).push(socketId);
}

/**
 * Marca a un usuario como desconectado
 */
export function removeOnlineUser(userId, socketId) {
  const sockets = onlineUsers.get(userId) || [];
  const updatedSockets = sockets.filter((id) => id !== socketId);

  if (updatedSockets.length === 0) {
    onlineUsers.delete(userId);
    return true; // usuario completamente offline
  } else {
    onlineUsers.set(userId, updatedSockets);
    return false; // aún tiene conexiones activas
  }
}

/**
 * Verifica si un usuario está en línea
 */
export function isUserOnline(userId) {
  return onlineUsers.has(userId);
}

/**
 * Maneja el envío de mensajes privados
 */
export async function handlePrivateMessage(io, socket, { to, content, tempId }) {
  const message = new Message({
    from: Number(socket.user.id),
    to: Number(to),
    content,
    timestamp: new Date(),
  });

  await message.save();

  const payload = {
    id: message._id,
    from: message.from,
    to: message.to,
    content: message.content,
    timestamp: message.timestamp,
  };

  // Emitir al destinatario
  io.to(to).emit('private_message', payload);

  // Confirmar al remitente
  socket.emit("message:ack", { ...payload, tempId });
}
