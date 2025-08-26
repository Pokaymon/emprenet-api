import User from '../../models/User.js';
import UserProfile from '../../models/UserProfile.js';
import Follow from '../../models/Follow.js';

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // ID del usuario a consultar
    const authUserId = req.user?.id; // viene del JWT

    // Buscar usuario
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Buscar perfil
    const profile = await UserProfile.findByUserId(id);

    // Verificar si el usuario autenticado lo sigue
    let isFollowing = false;
    if (authUserId && authUserId !== parseInt(id, 10)) {
      isFollowing = await Follow.isFollowing(authUserId, id);
    }

    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      auth_provider: user.auth_provider,
      email_verified: user.email_verified,

      profile: {
        publicaciones: profile?.publicaciones ?? 0,
        seguidores: profile?.seguidores ?? 0,
        seguidos: profile?.seguidos ?? 0,
        biografia: profile?.biografia ?? null
      },

      isFollowing
    });
  } catch (error) {
    console.error('Error en getUserProfile:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
