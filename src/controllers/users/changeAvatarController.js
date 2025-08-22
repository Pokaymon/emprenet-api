import User from '../../models/User.js';

export async function changeAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo' });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    await User.updateById(req.user.id, { avatar: avatarPath });

    return res.json({
      message: 'Avatar actualizado correctamente',
      avatar: avatarPath
    });
  } catch (err) {
    console.error('Error al actualizar avatar:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}
