import mysql from "mysql2/promise";
import config from "./../config.js";

const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('🛠️ Pool de conexiones MySQL inicializado');

export default pool;
