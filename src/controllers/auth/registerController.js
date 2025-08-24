import bcrypt from 'bcrypt';
import crypto from 'crypto';

// Models
import User from '../../models/User.js';
import UserProfile from '../../models/UserProfile.js';

import { sendVerificationEmail } from '../../services/emailService.js';
import { validateRequiredFields, passwordsMatch } from '../../utils/validation.js';

export const registerUser = async (req, res) => {
  const { username, email, password, password_confirmation } = req.body;

  if (!validateRequiredFields({ username, email, password, password_confirmation })) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  if (!passwordsMatch(password, password_confirmation)) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  try {
    if (await User.existsByEmail(email)) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    if (await User.existsByUsername(username)) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verification_token = crypto.randomBytes(32).toString('hex');

    const now = new Date();
    const tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 Hora

    const newUserId = await User.create({
      username,
      email,
      password: hashedPassword,
      auth_provider: 'local',
      verification_token,
      verification_token_expires_at: tokenExpiresAt,
      last_verification_email_sent_at: now
    });

    // Crear perfil
    await UserProfile.create(newUserId);

    // Verificación de email
    await sendVerificationEmail(email, verification_token);

    return res.status(201).json({ message: 'Usuario registrado, Verifica tu correo.' });
  } catch (error) {
    console.error('Error en el registro:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

