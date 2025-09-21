import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import Message from '../models/Message.js';

let io;
const onlineUsers = new Map(); // userId -> socketId[]

export const initSocket = async (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    }
  });

  // Redis Adapter
  await setupRedisAdapter(io);

  // Middleware de autenticación
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Token no proporcionado'));

    try {
      const decoded = jwt.verify(token, config.jwt_secret);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Usuario conectado: ${socket.user.username}`);
    const userId = socket.user.id;

    // Guardar usuario como conectado
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, []);
    }
    onlineUsers.get(userId).push(socket.io);

    // Notificar el estado a seguidores del usuario
    io.emit("user:status", { userId, status: "online" });

    // Unir socket a sala identificada por su id
    socket.join(socket.user.id);

    socket.on('private_message', async ({ to, content }) => {
      const message = new Message({
        from: socket.user.id,
        to,
        content,
        timestamp: new Date(),
      });

      await message.save();

      // Enviar a sala del destinatario
      io.to(to).emit('private_message', {
        from: socket.user.id,
        content,
        timestamp: message.timestamp,
      });
    });

    socket.on('disconnect', () => {
      console.log(`⛔ Usuario desconectado: ${socket.user.username}`);

      // Eliminar socket de la lista
      const sockets = onlineUsers.get(userId) || [];
      const updatedSockets = sockets.filter((id) => id !== socket.id);

      if (updatedSockets.length === 0) {
        onlineUsers.delete(userId);

        // Notificar que esta offline
        io.emit("user:status", { userId, status: "offline" });
      } else {
        onlineUsers.set(userId, updatedSockets);
      }
    });
  });
};

// Exportar helper para determinar stado del usuario
export function isUserOnline(userId) {
  return onlineUsers.has(userId);
}

const setupRedisAdapter = async (ioInstance) => {
  const { createAdapter } = await import('socket.io-redis');
  const { createClient } = await import('redis');

  const pubClient = createClient({ url: 'redis://localhost:6379' });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  ioInstance.adapter(createAdapter(pubClient, subClient));
};

export const getIO = () => io;
