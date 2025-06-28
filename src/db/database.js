import mysql from "mysql2/promise";
import config from "./../config.js";

let connection;

const getConnection = async () => {
    if (!connection) {
        connection = await mysql.createConnection({
            host: config.host,
            database: config.database,
            user: config.user,
            password: config.password,
	    port: config.port
        });
    }
    return connection;
};

console.log("🔐 Conectando con:", config);

export default getConnection;
