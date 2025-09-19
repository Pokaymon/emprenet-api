import Follow from '../../models/Follow.js';

export async function getFollowing(req, res) {
  try {
    const userId = req.user.id;
    const following = await Follow.getFollowingUsers(userId);
    return res.json({ following });
  } catch (error) {
    console.error("Error al obtener la lista de seguidos:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
