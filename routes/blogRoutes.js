const express = require('express');
const {
  createBlog,
  getPublishedBlogs,
  getBlogByTitle,
  getBlogById,
  updateBlogByTitle,
  deleteBlog,
  getUserBlogs
} = require('../controller/blogController');
const passport = require('../Auth/auth');

const router = express.Router();

// Endpoint to create a new blog post (requires authentication)
router.post('/create-post', passport.authenticate('jwt', { session: false }), createBlog);

// Endpoint to get a list of published blogs (accessible by everyone)
router.get('/all-posts', getPublishedBlogs);

// Endpoint to get a specific blog by title (accessible by everyone)
router.get('/single-post', getBlogByTitle);

// Endpoint to get a specific blog by ID (accessible by everyone)
router.get('/:id', getBlogById);

// Endpoint to update a blog post by title (requires authentication)
router.put('/title/:title', passport.authenticate('jwt', { session: false }), updateBlogByTitle);

// Endpoint to delete a blog post (requires authentication)
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteBlog);

// Endpoint to get a list of blogs created by the logged-in user (requires authentication)
router.get('/user/blogs', passport.authenticate('jwt', { session: false }), getUserBlogs);

module.exports = router;