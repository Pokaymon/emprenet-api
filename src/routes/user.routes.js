import express from 'express';
import { searchUser } from '../controllers/users/searchUserController.js';
import { changeAvatar } from '../controllers/users/changeAvatarController.js';
import { toggleFollow } from '../controllers/users/followController.js';
import { getUserProfile } from '../controllers/users/getUserProfileController.js';

import { getFollowing } from '../controllers/users/getFollowingController.js';

// Middlewares
import rateLimiter from '../middlewares/rateLimiter.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// GET /users/search?q=@pokaymon&mode=exact
router.get('/search', rateLimiter, searchUser);

// GET /users/following
router.get('/following', authMiddleware, getFollowing);

// POST /users/avatar
router.post(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  changeAvatar
);

// POST /users/follow
router.post('/follow', authMiddleware, toggleFollow);

// GET /users/:id
router.get('/:id', authMiddleware, getUserProfile);

export default router;
