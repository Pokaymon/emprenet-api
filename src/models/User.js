import getConnection from '../db/database.js';

const User = {
  async query(sql, params = []) {
    const conn = await getConnection();
    const [result] = await conn.query(sql, params);
    return result;
  },

  async findByEmail(email) {
    const result = await this.query('SELECT * FROM users WHERE email = ?', [email]);
    return result[0];
  },

  async findById(id) {
    const result = await this.query('SELECT * FROM users WHERE id = ?', [id]);
    return result[0];
  },

  async create({ username, email, password, verification_token = null }) {
    await this.query(
      'INSERT INTO users (username, email, password, verification_token) VALUES (?, ?, ?, ?)',
      [username, email, password, verification_token]
    );
  },

  async existsByEmail(email) {
    const result = await this.query('SELECT COUNT(*) AS count FROM users WHERE email = ?', [email]);
    return result[0].count > 0;
  },

  async existsByUsername(username) {
    const result = await this.query('SELECT COUNT(*) AS count FROM users WHERE username = ?', [username]);
    return result[0].count > 0;
  },

  async getAll() {
    return await this.query('SELECT id, username, email FROM users');
  },

  async findByVerificationToken(token) {
    const result = await this.query('SELECT * FROM users WHERE verification_token = ?', [token]);
    return result[0];
  },

  async verifyEmail(userId) {
    await this.query(
      'UPDATE users SET email_verified = true, verification_token = NULL WHERE id = ?',
      [userId]
    );
  },

  async updateById(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map(key => `\`${key}\` = ?`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = ?`;

    await this.query(query, [...values, id]);
  }
};

export default User;
