import rateLimit from 'express-rate-limit';

// Ajustar segun trafico / infraestructura
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // max 30 requests por ip por minuto
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Demasiadas solicitudes. Intenta de nuevo más tarde.'
  }
});

export default limiter;
