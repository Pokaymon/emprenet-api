import app from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from './config.js';
import { connectMongo } from './db/mongo.js';
import Message from './models/Message.js';

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

await connectMongo();

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("No token provided"));

  try {
    const user = jwt.verify(token, config.jwt_secret);
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log(`Usuario conectado: ${socket.user.username}`);

  socket.on("private_message", async ({ toUserId, content }) => {
    const message = new Message({
      senderId: socket.user.id,
      receiverId: toUserId,
      content
    });
    await message.save();

    // Emitir al receptor si está conectado
    io.sockets.sockets.forEach((s) => {
      if (s.user?.id === toUserId) {
        s.emit("private_message", {
          fromUserId: socket.user.id,
          content,
          timestamp: message.timestamp
        });
      }
    });
  });
});

httpServer.listen(app.get("port"), () => {
  console.log(`Servidor corriendo en puerto ${app.get("port")}`);
});

