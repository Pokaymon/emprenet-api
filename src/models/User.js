import getConnection from '../db/database.js';

const User = {
  async findByEmail(email) {
    const conn = await getConnection();
    const [result] = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
    return result[0];
  },

  async findById(id) {
    const conn = await getConnection();
    const [result] = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
    return result[0];
  },

  async create({ username, email, password, verification_token = null }) {
    const conn = await getConnection();
    await conn.query(
      'INSERT INTO users (username, email, password, verification_token) VALUES (?, ?, ?, ?)',
      [username, email, password, verification_token]
    );
  },

  async existsByEmail(email) {
    const conn = await getConnection();
    const [result] = await conn.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', [email]);
    return result[0].count > 0;
  },

  async existsByUsername(username) {
    const conn = await getConnection();
    const [result] = await conn.query(
      'SELECT COUNT(*) AS count FROM users WHERE username = ?', [username]);
    return result[0].count > 0;
  },

  async getAll() {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT id, username, email FROM users');
    return rows;
  },

  async findByVerificationToken(token){
    const conn = await getConnection();
    const [result] = await conn.query(
      'SELECT * FROM users WHERE verification_token = ?',
      [token]
    );
    return result[0];
  },

  async verifyEmail(userId){
    const conn = await getConnection();
    await conn.query(
      'UPDATE users SET email_verified = true, verification_token = NULL WHERE id = ?',
      [userId]
    );
  },

  async updateById(id, fields) {
    const conn = await getConnection();

    // Extraer claves y valores de los campos a actualizar
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    // Generar dinámicamente la parte del SET
    const setClause = keys.map(key => `${key} = ?`).join(', ');

    const query = `UPDATE users SET ${setClause} WHERE id = ?`;

    await conn.query(query, [...values, id]);
  }

};

export default User;
