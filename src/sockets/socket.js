import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import {
  addOnlineUser,
  removeOnlineUser,
  handlePrivateMessage,
  isUserOnline,
} from '../utils/socket.utils.js';

let io;

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
    } catch {
      return next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log(`✅ Usuario conectado: ${socket.user.username}`);

    // Guardar usuario
    addOnlineUser(userId, socket.id);

    // Notificar online
    io.emit("user:status", { userId, status: "online" });

    // Unirse a su propia sala
    socket.join(userId);

    // Eventos
    socket.on('private_message', (data) =>
      handlePrivateMessage(io, socket, data)
    );

    socket.on('disconnect', () => {
      console.log(`⛔ Usuario desconectado: ${socket.user.username}`);

      const isCompletelyOffline = removeOnlineUser(userId, socket.id);

      if (isCompletelyOffline) {
        io.emit("user:status", { userId, status: "offline" });
      }
    });
  });
};

export { isUserOnline };

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
