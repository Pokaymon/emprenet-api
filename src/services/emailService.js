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
        subject: 'Verifica tu cuenta en EmpreNet',
        html: `
        <div style="font-family: Inter, sans-serif; background-color: #f9f9f9; padding: 32px; color: #111;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 5px 15px rgba(0,0,0,0.05);">
            <div style="text-align: center;">
              <img src="https://cdn.emprenet.work/Favicons/NetFavicon.svg" alt="EmpreNet Logo" width="250px" style="margin-bottom: 24px;" />
              <h2 style="margin: 0; font-size: 22px; color: #000;">Verifica tu correo electrónico</h2>
              <p style="margin: 16px 0 24px; font-size: 15px; color: #444;">
                Gracias por registrarte en <strong>EmpreNet</strong>. Para completar tu registro, haz clic en el siguiente botón:
              </p>
              <a href="${verificationLink}" style="background-color: #111; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; display: inline-block; font-size: 16px;">
                Verificar cuenta
              </a>
              <p style="font-size: 13px; color: #777; margin-top: 24px;">
                Si el botón no funciona, también puedes usar este enlace:
              </p>
              <a href="${verificationLink}" style="font-size: 13px; color: #0073e6; word-break: break-all;">${verificationLink}</a>
            </div>

            <hr style="margin: 32px 0; border: none; border-top: 1px solid #eee;" />

            <div style="text-align: center; font-size: 14px; color: #444;">
              <p>Explora más:</p>
              <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin: 16px 0;">
                <a href="https://emprenet.work" target="_blank" style="text-decoration: none; color: #111; display: inline-flex; align-items: center; gap: 6px;">
                  <img src="https://cdn.emprenet.work/Favicons/NetFavicon.svg" alt="EmpreNet" width="18px" height="18px" />
                  Oficial Site
                </a>
                <a href="https://github.com/Pokaymon/emprenet-api" target="_blank" style="text-decoration: none; color: #111; display: inline-flex; align-items: center; gap: 6px;">
                  <img src="https://cdn.emprenet.work/Icons/github-logo.svg" alt="GitHub" width="18px" height="18px" />
                  @Emprenet.git
                </a>
                <a href="https://unidadestecno-my.sharepoint.com/:f:/g/personal/jasocha_uts_edu_co/EhTaGE0X9udOlcGW2Ke_ih0BsoenjeXxP31VEgy3CkkGxw?e=R8M9t" target="_blank" style="text-decoration: none; color: #111; display: inline-flex; align-items: center; gap: 6px;">
                  Documents
                </a>
              </div>
              <p style="font-size: 12px; color: #888; margin-top: 24px;">
                Este correo fue enviado automáticamente por EmpreNet. Por favor, no respondas a este mensaje.
              </p>
            </div>
          </div>
        </div>
        `
    });

    console.log('Correo enviado: %s', info.messageId);
};
