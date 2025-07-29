import bcrypt from 'bcrypt';
import config from '../../config.js';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });

  try {
    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Credenciales inválidas' });

    /*
    Ya no bloquear login, el frontend debe mostrar alerta para verificar correo
    if (!user.email_verified)
      return res.status(403).json({ message: 'Verifica tu correo antes de iniciar sesión.' });
    */

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, auth_provider: user.auth_provider },
      config.jwt_secret,
      { expiresIn: config.jwt_expires_in }
    );

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: { id: user.id, username: user.username, email: user.email },
      warning: user.email_verified
	? null
	: 'Tu correo aún no ha sido verificado. Algunas funcionalidades estaran limitadas.'
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

