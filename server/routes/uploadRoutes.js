import express from 'express';
import { uploadImage } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import uploadMiddleware from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @route   POST /api/upload
router.post('/', protect, uploadMiddleware.single('image'), uploadImage);

export default router;
