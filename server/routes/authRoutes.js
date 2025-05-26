import express from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateAuth } from '../validations/authValidation.js';

const router = express.Router();


router.post('/register', validateAuth, registerUser);


router.post('/login', validateAuth, loginUser);


router.get('/me', protect, getCurrentUser);


router.post('/logout', logoutUser); 

export default router;