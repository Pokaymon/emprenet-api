import User from '../../models/User.js';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../services/emailService.js';

export const changeEmail = async (req, res) => {
  const userId = req.user.id;
  const { newEmail } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  if (await User.existsByEmail(newEmail)) {
    return res.status(400).json({ message: 'El nuevo correo ya está en uso.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const now = new Date();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await User.updateById(userId, {
    email: newEmail,
    email_verified: false,
    verification_token: token,
    verification_token_expires_at: expiresAt,
    last_verification_email_sent_at: now
  });

  await sendVerificationEmail(newEmail, token);

  res.status(200).json({ message: 'Correo cambiado. Verifica tu nuevo correo.' });
};
