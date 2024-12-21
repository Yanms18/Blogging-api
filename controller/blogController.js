const Blog = require('../models/Blog');
const calculateReadingTime = require('../utils/calculateReadingTime');
const { createBlogSchema, updateBlogSchema } = require('../Middleware/validator');

// Create a new blog post
const createBlog = async (req, res) => {
  const { title, description, tags, body } = req.body;
  const { _id: userId } = req.user;

  try {
    // Convert userId to string
    const userIdString = userId.toString();

    // Validate the input data
    const { error, value } = createBlogSchema.validate({
      title,
      description,
      tags,
      body,
      userId: userIdString // Use the string version of userId
    });

    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const reading_time = calculateReadingTime(body);
    const blog = new Blog({
      title,
      description,
      tags,
      body,
      author: req.user.first_name + ' ' + req.user.last_name, // Set the author field as a string
      userId: userIdString, // Set the userId field to the authenticated user's ID as a string
      reading_time,
    });

    const result = await blog.save();
    res.status(201).json({ success: true, message: 'Blog created successfully', data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// Get a list of published blogs (accessible by both logged in and not logged in users)
const getPublishedBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, sortBy } = req.query;
    const query = { state: 'published' };

    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') },
        { author: new RegExp(search, 'i') },
      ];
    }

    const sortOptions = {};
    if (sortBy) {
      const sortFields = sortBy.split(',');
      sortFields.forEach((field) => {
        sortOptions[field] = 1; // Ascending order
      });
    }

    const blogs = await Blog.find(query)
      .populate('userId', 'first_name last_name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get a single published blog by title
const getBlogByTitle = async (req, res) => {
  try {
    const blog = await Blog.findOne({ title: req.query.title }).populate('userId', 'first_name last_name email');
    
    if (!blog || blog.state !== 'published') {
      return res.status(404).json({ message: 'Blog not found or not published' });
    }

    // Increment read count
    blog.read_count += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('userId', 'first_name last_name email');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if the blog is published or if the user is the author of the draft blog
    if (blog.state !== 'published' && (!req.user || blog.userId.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Increment read count only for published blogs
    if (blog.state === 'published') {
      blog.read_count += 1;
      await blog.save();
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Update a blog post by title
const updateBlogByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const { newTitle, description, tags, body, state } = req.body;

    // Validate the input data
    const { error, value } = updateBlogSchema.validate({
      newTitle,
      description,
      tags,
      body,
      state
    });

    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    let blog = await Blog.findOne({ title });

    if (!blog) {
      console.log('Blog not found');
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.userId.toString() !== req.user._id.toString()) {
      console.log('User not authorized');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Proceed with updating the blog
    if (newTitle) blog.title = newTitle;
    if (description) blog.description = description;
    if (tags) blog.tags = tags;
    if (body) {
      blog.body = body;
      blog.reading_time = calculateReadingTime(body);
    }
    if (state) blog.state = state;

    await blog.save();

    res.json({ success: true, message: 'Blog updated successfully', data: blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

// Delete a blog post
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog || blog.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized or Blog not found' });
    }

    await Blog.deleteOne({ _id: id });

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get a list of blogs for the logged-in user
const getUserBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, state } = req.query;
    const query = { userId: req.user._id };
    
    if (state) query.state = state;

    const blogs = await Blog.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = {
  createBlog,
  getPublishedBlogs,
  getBlogByTitle,
  getBlogById,
  updateBlogByTitle,
  deleteBlog,
  getUserBlogs
};