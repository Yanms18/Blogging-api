const Blog = require('../models/Blog');
const calculateReadingTime = require('../utils/calculateReadingTime');

const createBlog = async ({ title, description, tags, body, user }) => {
  try {
    const reading_time = calculateReadingTime(body);
    const blog = await Blog.create({
      title,
      description,
      tags,
      body,
      author: `${user.first_name} ${user.last_name}`,
      userId: user._id.toString(),
      reading_time,
    });

    return {
      code: 201,
      success: true,
      message: 'Blog created successfully',
      data: blog,
    };
  } catch (error) {
    return {
      code: 500,
      success: false,
      message: error.message || 'Server Error',
      data: null,
    };
  }
};

const getPublishedBlogs = async ({ page = 1, limit = 20, search, sortBy }) => {
  try {
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

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortOptions,
      populate: 'userId',
    };

    const blogs = await Blog.paginate(query, options);

    return {
      code: 200,
      success: true,
      message: 'Blogs found',
      data: blogs,
    };
  } catch (error) {
    return {
      code: 500,
      success: false,
      message: error.message || 'Server Error',
      data: null,
    };
  }
};

const getBlogByTitle = async ({ title }) => {
  try {
    const blog = await Blog.findOne({ title }).populate('userId', 'first_name last_name email');

    if (!blog || blog.state !== 'published') {
      return {
        code: 404,
        success: false,
        message: 'Blog not found or not published',
        data: null,
      };
    }

    // Increment read count
    blog.read_count += 1;
    await blog.save();

    return {
      code: 200,
      success: true,
      message: 'Blog found',
      data: blog,
    };
  } catch (error) {
    return {
      code: 500,
      success: false,
      message: error.message || 'Server Error',
      data: null,
    };
  }
};

const getBlogById = async ({ id, user }) => {
  try {
    const blog = await Blog.findById(id).populate('userId', 'first_name last_name email');

    if (!blog) {
      return {
        code: 404,
        success: false,
        message: 'Blog not found',
        data: null,
      };
    }

    // Check if the blog is published or if the user is the author of the draft blog
    if (blog.state !== 'published' && (!user || blog.userId.toString() !== user._id.toString())) {
      return {
        code: 403,
        success: false,
        message: 'Unauthorized',
        data: null,
      };
    }

    // Increment read count only for published blogs
    if (blog.state === 'published') {
      blog.read_count += 1;
      await blog.save();
    }

    return {
      code: 200,
      success: true,
      message: 'Blog found',
      data: blog,
    };
  } catch (error) {
    return {
      code: 500,
      success: false,
      message: error.message || 'Server Error',
      data: null,
    };
  }
};

const updateBlogByTitle = async ({ title, newTitle, description, tags, body, state, user }) => {
  try {
    let blog = await Blog.findOne({ title });

    if (!blog) {
      return {
        code: 404,
        success: false,
        message: 'Blog not found',
        data: null,
      };
    }

    if (blog.userId.toString() !== user._id.toString()) {
      return {
        code: 403,
        success: false,
        message: 'Unauthorized',
        data: null,
      };
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

    return {
      code: 200,
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    };
  } catch (error) {
    return {
      code: 500,
      success: false,
      message: error.message || 'Server Error',
      data: null,
    };
  }
};

const deleteBlog = async ({ id, user }) => {
  try {
    const blog = await Blog.findById(id);

    if (!blog || blog.userId.toString() !== user._id.toString()) {
      return {
        code: 403,
        success: false,
        message: 'Unauthorized or Blog not found',
        data: null,
      };
    }

    await Blog.deleteOne({ _id: id });

    return {
      code: 200,
      success: true,
      message: 'Blog deleted successfully',
      data: null,
    };
  } catch (error) {
    return {
      code: 500,
      success: false,
      message: error.message || 'Server Error',
      data: null,
    };
  }
};

const getUserBlogs = async ({ user, page = 1, limit = 20, state }) => {
  try {
    const query = { userId: user._id };

    if (state) query.state = state;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    };

    const blogs = await Blog.paginate(query, options);

    return {
      code: 200,
      success: true,
      message: 'Blogs found',
      data: blogs,
    };
  } catch (error) {
    return {
      code: 500,
      success: false,
      message: error.message || 'Server Error',
      data: null,
    };
  }
};

module.exports = {
  createBlog,
  getPublishedBlogs,
  getBlogByTitle,
  getBlogById,
  updateBlogByTitle,
  deleteBlog,
  getUserBlogs,
};