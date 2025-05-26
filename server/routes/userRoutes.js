import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.get('/', protect, isAuthenticated ,getAllUsers);
router.get('/:id', protect, isAuthenticated ,getUserProfile);
router.put('/profile', protect, isAuthenticated , updateUserProfile);

export default router;
