import User from '../../models/User.js';
import fs from 'fs';
import path from 'path';

export async function changeAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo' });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    // Obtener usuario actual
    const user = await User.findById(req.user.id);

    if (user?.avatar) {
      // Ruta absoluta del avatar anterior
      const oldPath = path.join(process.cwd(), user.avatar);

      // Verificar existencia
      if (fs.existsSync(oldPath) && !user.avatar.includes('default-avatar.png')) {
	fs.unlink(oldPath, (err) => {
	  if (err) console.error('Error al eliminar avatar anterior:', err);
	  else console.log('Avatar anterior eliminado:', oldPath);
	});
      }
    }

    // Guardar el nuevo avatar
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
