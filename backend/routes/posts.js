const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { upload, uploadErrorHandler } = require('../middleware/upload');
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  addComment,
} = require('../controllers/postController');

const router = express.Router();

// Get all posts (public)
router.get('/', getPosts);

// Get single post (public)
router.get('/:id', getPost);

// Create post (protected)
router.post(
  '/',
  auth,
  upload.single('image'),
  uploadErrorHandler,
  [body('text').optional().trim().isLength({ max: 500 }).withMessage('Text must be less than 500 characters')],
  createPost
);

// Like post (protected)
router.post('/:id/like', auth, likePost);

// Add comment (protected)
router.post(
  '/:id/comment',
  auth,
  [body('text').notEmpty().trim().withMessage('Comment text is required')],
  addComment
);

module.exports = router;
