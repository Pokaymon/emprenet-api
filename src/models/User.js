import db from '../db/database.js';

const User = {
  async query(sql, params = []) {
    const [result] = await db.query(sql, params);
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

  async create ({
    username,
    email,
    password,
    auth_provider = 'local',
    verification_token = null,
    email_verified = false,
    avatar = 'https://cdn.emprenet.work/Icons/default-avatar-2.webp',
    verification_token_expires_at = null,
    last_verification_email_sent_at = null
  }) {
    const [result] = await db.query(
      'INSERT INTO users (username, username_lower, email, password, auth_provider, verification_token, email_verified, avatar, verification_token_expires_at, last_verification_email_sent_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [username, username.toLowerCase(), email, password, auth_provider, verification_token, email_verified, avatar, verification_token_expires_at, last_verification_email_sent_at]
    );
    return result.insertId;
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
      'UPDATE users SET email_verified = true, verification_token = NULL, verification_token_expires_at = NULL, last_verification_email_sent_at = NULL WHERE id = ?',
      [userId]
    );
  },

  async updateById(id, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map(key => `\`${key}\` = ?`).join(', ');
    const query = `UPDATE users SET ${setClause} WHERE id = ?`;

    await this.query(query, [...values, id]);
  },

  // Funciones para busqueda por username

  // Busqueda exacta por username (case-intensitive)
  async findByUsernameExact(username) {
    const result = await this.query(
      'SELECT id, username, avatar, email_verified FROM users WHERE LOWER(username) = LOWER(?) LIMIT 1',
      [username]
    );
    return result[0];
  },

  async searchByUsernamePartial(term, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const lowerTerm = term.toLowerCase();

    // 🔹 1. Primer intento (rápido, usa índice)
    let likeTerm = `${lowerTerm}%`;
    let result = await this.query(
      'SELECT id, username, avatar, email_verified FROM users WHERE username_lower LIKE ? ORDER BY username ASC LIMIT ? OFFSET ?',
      [likeTerm, Number(limit), Number(offset)]
    );

    // 🔹 2. Si no hay resultados, intentar búsqueda más amplia
    if (result.length === 0) {
      likeTerm = `%${lowerTerm}%`;
      result = await this.query(
        'SELECT id, username, avatar, email_verified FROM users WHERE username_lower LIKE ? ORDER BY username ASC LIMIT ? OFFSET ?',
        [likeTerm, Number(limit), Number(offset)]
      );
    }

    return result;
  }

};

export default User;
