import jwt from 'jsonwebtoken';
import config from '../config.js';

export function generateJwt(payload) {
  return jwt.sign(payload, config.jwt_secret, { expiresIn: config.jwt_expires_in });
}
