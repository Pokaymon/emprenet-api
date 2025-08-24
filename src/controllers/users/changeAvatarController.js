import User from '../../models/User.js';
import fs from 'fs';
import path from 'path';

// JWT
import { generateJwt } from '../../utils/jwt.js';

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

    // Obtener datos actualizados
    const updatedUser = await User.findById(req.user.id);

    // Generar nuevo JWT
    const token = generateJwt ({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
    });

    return res.json({
      message: 'Avatar actualizado correctamente',
      avatar: updatedUser.avatar,
      token,
    });
  } catch (err) {
    console.error('Error al actualizar avatar:', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}
