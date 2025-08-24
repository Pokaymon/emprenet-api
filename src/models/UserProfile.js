import db from '../db/database.js';

const UserProfile = {
  async create(userId) {
    await db.query(
      `INSERT INTO user_profiles (user_id) VALUES (?)`,
      [userId]
    );
  },

  async findByUserId(userId) {
    const [rows] = await db.query(
      `SELECT * FROM user_profiles WHERE user_id = ?`,
      [userId]
    );
    return rows[0];
  },

  async updateCounts(userId, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);

    const setClause = keys.map(key => `\`${key}\` = ?`).join(', ');
    const query = `UPDATE user_profiles SET ${setClause} WHERE user_id = ?`;

    await db.query(query, [...values, userId]);
  }
};

export default UserProfile;
