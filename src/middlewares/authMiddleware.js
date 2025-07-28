import jwt from 'jsonwebtoken';
import config from '../config.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token no proporcionado' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt_secret);
    req.user = decoded; // { id, username, email }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export default authMiddleware;
