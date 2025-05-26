import express from 'express';

import {
  createPost,
  getPosts,
  getPostById,
  deletePost,
  likePost,
  replyToPost,  
  uploadImage,
} from '../controllers/postController.js';

import {
  editReply,
  deleteReply,
  getRepliesByPost
} from '../controllers/replyController.js';

import {
  toggleReaction,
  getReactionsByPost
} from '../controllers/reactionController.js';

// Middleware
import { protect } from '../middleware/authMiddleware.js';
import { validatePost } from '../validations/postValidation.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();



// POST /api/posts
router.post('/', protect, upload.single('image'), createPost);

// GET all posts
router.get('/', protect, getPosts);

// GET a post by id
router.get('/:id', protect, getPostById);

// DELETE a post
router.delete('/:id', protect, deletePost);

// LIKE a post
router.post('/:id/like', protect, likePost);

// ADD a reply to a post
router.post('/:id/reply', protect, replyToPost);

// GET all replies for a post — **added missing route**
router.get('/:id/replies', protect, getRepliesByPost);

// EDIT a reply by reply id
router.put('/replies/:id', protect, editReply);

// DELETE a reply by reply id
router.delete('/replies/:id', protect, deleteReply);

// POST a reaction to a post
router.post('/:id/reaction', protect, toggleReaction);

// GET reactions of a post
router.get('/:id/reactions', protect, getReactionsByPost);

export default router;
