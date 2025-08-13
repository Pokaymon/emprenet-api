import express from 'express';
import { searchUser } from '../controllers/users/searchUserController.js';
import rateLimiter from '../middlewares/rateLimiter.js';

const router = express.Router();

// Rate limiter para evitar scraping abusivo
// GET /users/search?q=@pokaymon&mode=exact
router.get('/search', rateLimiter, searchUser);

export default router;
