import db from '../db/database.js';

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
  }
};

export default Follow;
