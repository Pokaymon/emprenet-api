import User from "../../models/User.js";

export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Token no proporcionado' });
    }

    try {
        const user = await User.findByVerificationToken(token);

        if (!user) {
            return res.status(400).json({ message: 'Token invalido o expirado' });
        }

        await User.verifyEmail(user.id);
        return res.status(200).json({ message: 'Correo verificado con éxito. Ya puedes iniciar sesión.' });
    } catch {
        console.error('Error al verificar correo: ', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};