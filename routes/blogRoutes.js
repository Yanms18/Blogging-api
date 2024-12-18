import express from 'express';
import {
  createBlog,
  getPublishedBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getUserBlogs
} from '../controller/blogController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

// Endpoint to create a new blog post (requires authentication)
router.post('/', authenticateJWT, createBlog);

// Endpoint to get a list of published blogs (accessible by everyone)
router.get('/', getPublishedBlogs);

// Endpoint to get a specific published blog by ID (accessible by everyone)
router.get('/:id', getBlogById);

// Endpoint to update a blog post (requires authentication)
router.put('/:id', authenticateJWT, updateBlog);

// Endpoint to delete a blog post (requires authentication)
router.delete('/:id', authenticateJWT, deleteBlog);

// Endpoint to get a list of blogs created by the logged-in user (requires authentication)
router.get('/user/blogs', authenticateJWT, getUserBlogs);

export default router;
