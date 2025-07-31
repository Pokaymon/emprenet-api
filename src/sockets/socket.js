import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config.js';
import Message from '../models/Message.js';

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
    } catch (err) {
      return next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Usuario conectado: ${socket.user.username}`);

    socket.on('private_message', async ({ to, content }) => {
      const message = new Message({
        from: socket.user.id,
        to,
        content,
        timestamp: new Date(),
      });

      await message.save();

      io.to(to).emit('private_message', {
        from: socket.user.id,
        content,
        timestamp: message.timestamp,
      });
    });

    socket.on('disconnect', () => {
      console.log(`⛔ Usuario desconectado: ${socket.user.username}`);
    });
  });
};

const setupRedisAdapter = async (ioInstance) => {
  const { createAdapter } = await import('socket.io-redis');
  const { createClient } = await import('redis');

  const pubClient = createClient({ url: 'redis://localhost:6379' });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  ioInstance.adapter(createAdapter(pubClient, subClient));
};
