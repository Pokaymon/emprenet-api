import db from '../db/database.js';
import { isUserOnline } from '../sockets/socket.js';

const Follow = {
  async follow(followerId, followedId) {
    await db.query(
      `INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)`,
      [followerId, followedId]
    );
  },

  async unfollow(followerId, followedId) {
    await db.query(
      `DELETE FROM follows WHERE follower_id = ? AND followed_id = ?`,
      [followerId, followedId]
    );
  },

  async isFollowing(followerId, followedId) {
    const [rows] = await db.query(
      `SELECT * FROM follows WHERE follower_id = ? AND followed_id = ?`,
      [followerId, followedId]
    );
    return rows.length > 0;
  },

  // Obtener usuarios seguidos
  async getFollowingUsers(followerId) {
    const [rows] = await db.query(
      `SELECT u.id, u.username, u.avatar
       FROM follows f
       JOIN users u ON f.followed_id = u.id
       WHERE f.follower_id = ?`,
       [followerId]
    );

    return rows.map(user => ({
      ...user,
      online: isUserOnline(user.id) // Estado actual
    }));
  }
};

export default Follow;
