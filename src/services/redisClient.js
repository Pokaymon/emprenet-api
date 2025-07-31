import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://127.0.0.1:6379',
});

redisClient.on('error', (err) => {
  console.error('🔴 Redis Error:', err);
});

await redisClient.connect();

console.log('🟢 Redis conectado correctamente');
export default redisClient;
