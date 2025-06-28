import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../../models/User.js';
import { sendVerificationEmail } from '../../services/emailService.js';

export const registerUser = async (req, res) => {
  const { username, email, password, password_confirmation } = req.body;

  if (!username || !email || !password || !password_confirmation) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  if (password !== password_confirmation) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden' });
  }

  try {
    const userExists = await User.existsByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const usernameExists = await User.existsByUsername(username);
    if (usernameExists) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verification_token = crypto.randomBytes(32).toString('hex');

    await User.create({
      username,
      email,
      password: hashedPassword,
      verification_token,
    });

    await sendVerificationEmail(email, verification_token);

    return res.status(201).json({ message: 'Usuario registrado, Verifica tu correo.' });
  } catch (error) {
    console.error('Error en el registro:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
