import User from "../../models/User.js";

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).render('email/verify-result', {
      title: 'Token no proporcionado',
      message: 'No se ha encontrado un token válido para la verificación del correo electrónico.'
    });
  }

  try {
    const user = await User.findByVerificationToken(token);

    if (!user || !user.verification_token_expires_at || new Date() > new Date(user.verification_token_expires_at)) {
      return res.status(400).render('email/verify-result', {
        title: 'Token inválido o expirado',
        message: 'El enlace de verificación ya expiró o es inválido. Solicita uno nuevo desde tu perfil.'
      });
    }

    await User.verifyEmail(user.id);

    return res.status(200).render('email/verify-result', {
      title: '¡Correo verificado con éxito!',
      message: 'Gracias por verificar tu correo. Ya puedes iniciar sesión en EmpreNet.'
    });

  } catch (error) {
    console.error('Error al verificar correo: ', error);
    return res.status(500).render('email/verify-result', {
      title: 'Error del servidor',
      message: 'Ocurrió un error inesperado durante la verificación. Intenta de nuevo más tarde.'
    });
  }
};
