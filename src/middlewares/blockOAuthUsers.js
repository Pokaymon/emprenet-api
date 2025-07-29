const blockOAuthUsers = async (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: 'No autenticado' });

  if (user.auth_provider !== 'local') {
    return res.status(403).json({ message: 'Los usuarios autenticados con Google no pueden cambiar su correo.' });
  }

  next();
};

export default blockOAuthUsers;
