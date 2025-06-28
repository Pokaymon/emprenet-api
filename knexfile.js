import config from "./src/config.js";

export default {
  development: {
    client: 'mysql2',
    connection: {
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
    },
    migrations: {
      directory: './src/migrations',
    },
    seeds: {
      directory: '/src/seeds',
    },
  },
};
