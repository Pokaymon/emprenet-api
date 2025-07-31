import app from './app.js';
import { createServer } from 'http';
import { initSocket } from './sockets/socket.js';
import { connectMongo } from './db/mongo.js';

const main = async () => {
  await connectMongo(); // Conecta Mongo
  const httpServer = createServer(app);

  await initSocket(httpServer); // Inicia sockets

  const PORT = app.get('port');
  httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor HTTP + WebSocket corriendo en puerto ${PORT}`);
  });
};

main();
