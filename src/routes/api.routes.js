import express from 'express';
import { registerUser } from '../controllers/auth/registerController.js';
import { verifyEmail } from '../controllers/auth/verifyEmailController.js';
import { loginUser } from '../controllers/auth/loginController.js';

// Para OAuth
import passport from '../services/passport.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

const router = express.Router();

// Login / Register EmpreNet
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/auth/verify-email', verifyEmail);

// Login OAuth Google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback de Google
router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      config.jwt_secret,
      { expiresIn: config.jwt_expires_in }
    );

    res.redirect(`/?token=${token}`);
  }
);

export default router;
