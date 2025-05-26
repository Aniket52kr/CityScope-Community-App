import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllUsers);
router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;
