import Blog from '../models/blogModel';
import calculateReadingTime from '../utils/calculateReadingTime';

// Create a new blog post
export const createBlog = async (req, res) => {
  try {
    const { title, description, tags, body } = req.body;
    const reading_time = calculateReadingTime(body);
    const blog = new Blog({
      title,
      description,
      tags,
      body,
      author: req.user.id,
      reading_time,
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get a list of published blogs (accessible by both logged in and not logged in users)
export const getPublishedBlogs = async (req, res) => {
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
      .populate('author', 'first_name last_name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get a single published blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'first_name last_name email');
    
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

// Update a blog post
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, body, state } = req.body;

    let blog = await Blog.findById(id);

    if (!blog || blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or Blog not found' });
    }

    if (title) blog.title = title;
    if (description) blog.description = description;
    if (tags) blog.tags = tags;
    if (body) {
      blog.body = body;
      blog.reading_time = calculateReadingTime(body);
    }
    
    if (state && ['draft', 'published'].includes(state)) {
      blog.state = state;
    }

    await blog.save();
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Delete a blog post
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog || blog.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized or Blog not found' });
    }

    await Blog.deleteOne({ _id: id });

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Get a list of blogs for the logged-in user
export const getUserBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, state } = req.query;
    
    const query = { author: req.user.id };
    
    if (state) query.state = state;

    const blogs = await Blog.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error });
  }
};
