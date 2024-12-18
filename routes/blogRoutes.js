import express from 'express';
import {
  createBlog,
  getPublishedBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getUserBlogs
} from '../controller/blogController.js';
import passport from '../Auth/auth.js';

const router = express.Router();

// Endpoint to create a new blog post (requires authentication)
router.post('/', passport.authenticate('jwt', { session: false }), createBlog);

// Endpoint to get a list of published blogs (accessible by everyone)
router.get('/', getPublishedBlogs);

// Endpoint to get a specific published blog by ID (accessible by everyone)
router.get('/:id', getBlogById);

// Endpoint to update a blog post (requires authentication)
router.put('/:id', passport.authenticate('jwt', { session: false }), updateBlog);

// Endpoint to delete a blog post (requires authentication)
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteBlog);

// Endpoint to get a list of blogs created by the logged-in user (requires authentication)
router.get('/user/blogs', passport.authenticate('jwt', { session: false }), getUserBlogs);

export default router;
