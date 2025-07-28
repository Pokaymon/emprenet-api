import crypto from 'crypto';
import User from '../../models/User.js';
import { sendVerificationEmail } from '../../services/emailService.js';

export const resendVerificationEmail = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

  if (user.email_verified) {
    return res.status(400).json({ message: 'El correo ya ha sido verificado' });
  }

  const lastSent = new Date(user.last_verification_email_sent_at || 0);
  const now = new Date();

  const diffInMs = now - lastSent;
  if (diffInMs < 60 * 1000) {
    const seconds = Math.ceil((60 * 1000 - diffInMs) / 1000);
    return res.status(429).json({ message: `Espera ${seconds}s para volver a solicitar el correo.` });
  }

  const newToken = crypto.randomBytes(32).toString('hex');
  const newExpiresAt = new Date(now.getTime() + 60 * 60 * 1000); // 1 hora

  await User.updateById(user.id, {
    verification_token: newToken,
    verification_token_expires_at: newExpiresAt,
    last_verification_email_sent_at: now
  });

  await sendVerificationEmail(user.email, newToken);

  res.status(200).json({ message: 'Correo de verificación reenviado.' });
};
