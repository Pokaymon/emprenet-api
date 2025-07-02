import nodemailer from 'nodemailer';
import config from './../config.js';

const transporter = nodemailer.createTransport({
    host: config.smtp_host,
    port: config.smtp_port,
    auth: {
        user: config.smtp_user,
        pass: config.smtp_pass
    }
});

export const sendVerificationEmail = async (email, token) => {
    const verificationLink = `https://api.emprenet.work/api/auth/verify-email?token=${token}`;

    const info = await transporter.sendMail({
        from: '"EmpreNet" <noreply@emprenet.work>',
        to: email,
        subject: 'Verifica tu correo electrónico',
        html: `<p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
               <a  href="${verificationLink}">${verificationLink}</a>`
    });
    console.log('Correo enviado: %s', info.messageId);
}
