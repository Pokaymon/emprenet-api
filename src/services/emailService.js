import nodemailer from 'nodemailer';
import config from './../config.js';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: config.smtp_host,
  port: config.smtp_port,
  auth: {
    user: config.smtp_user,
    pass: config.smtp_pass
  }
});

const renderTemplate = async (templateName, data) => {
  const filePath = path.join(__dirname, `../views/email/${templateName}.ejs`);
  return await ejs.renderFile(filePath, data);
};

export const sendVerificationEmail = async (email, token) => {
  const verificationLink = `https://api.emprenet.work/api/auth/verify-email?token=${token}`;

  const html = await renderTemplate('verify-email', { verificationLink });

  try {
    const info = await transporter.sendMail({
      from: '"EmpreNet" <noreply@emprenet.work>',
      to: email,
      subject: 'Verifica tu cuenta en EmpreNet',
      html,
    });

    console.log('📧 Correo enviado:', info.messageId);
  } catch (error) {
    console.error('❌ Error enviando correo:', error);
    throw new Error('No se pudo enviar el correo de verificación');
  }
};
