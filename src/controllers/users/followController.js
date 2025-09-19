import Follow from '../../models/Follow.js';
import UserProfile from '../../models/UserProfile.js';

import { getIO } from '../../sockets/socket.js';

export const toggleFollow = async (req, res) => {
  try {
    const followerId = req.user.id; // viene del authMiddleware
    const { userId } = req.body;

    if (followerId === userId) {
      return res.status(400).json({ message: "No puedes seguirte a ti mismo." });
    }

    const isFollowing = await Follow.isFollowing(followerId, userId);

    if (isFollowing) {
      await Follow.unfollow(followerId, userId);

      // Decrementar contadores
      await UserProfile.decrement(followerId, 'seguidos');
      await UserProfile.decrement(userId, 'seguidores');

      // Emitir al user que acaba de hacer unfollow
      getIO().to(followerId).emit("following:updated");

      return res.json({ message: "Dejaste de seguir al usuario." });
    } else {
      await Follow.follow(followerId, userId);

      // Incrementar contadores
      await UserProfile.increment(followerId, 'seguidos');
      await UserProfile.increment(userId, 'seguidores');

      // Emitir al user que acaba de hacer follow
      getIO().to(followerId).emit("following:updated");

      return res.json({ message: "Ahora sigues al usuario." });
    }
  } catch (error) {
    console.error("Error en toggleFollow:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
