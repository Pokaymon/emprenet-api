import express from 'express';
import { registerUser } from '../controllers/auth/registerController.js';
import { verifyEmail } from '../controllers/auth/verifyEmailController.js';
import { loginUser } from '../controllers/auth/loginController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/auth/verify-email', verifyEmail);

export default router;