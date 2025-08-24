import Follow from '../../models/Follow.js';
import UserProfile from '../../models/UserProfile.js';

export const toggleFollow = async (req, res) => {
  try {
    const followerId = req.user.id; // viene del authMiddleware
    const { userId } = req.body; // usuario a seguir o dejar de seguir

    if (followerId === userId) {
      return res.status(400).json({ message: "No puedes seguirte a ti mismo." });
    }

    const isFollowing = await Follow.isFollowing(followerId, userId);

    if (isFollowing) {
      await Follow.unfollow(followerId, userId);

      // Decrementar contadores
      await UserProfile.updateCounts(followerId, {
        seguidos: db.raw('seguidos - 1')
      });
      await UserProfile.updateCounts(userId, {
        seguidores: db.raw('seguidores - 1')
      });

      return res.json({ message: "Dejaste de seguir al usuario." });
    } else {
      await Follow.follow(followerId, userId);

      // Incrementar contadores
      await UserProfile.updateCounts(followerId, {
        seguidos: db.raw('seguidos + 1')
      });
      await UserProfile.updateCounts(userId, {
        seguidores: db.raw('seguidores + 1')
      });

      return res.json({ message: "Ahora sigues al usuario." });
    }
  } catch (error) {
    console.error("Error en toggleFollow:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
