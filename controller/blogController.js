// const blogService = require('../services/blogService');

// const createBlog = async (req, res) => {
//     const payload = req.body;
//     const user = req.user;

//     const serviceResponse = await blogService.CreateBlog({
//         text: payload.text, 
//         user
//     })

//     return res.status(serviceResponse.code).json(serviceResponse);
// }

// const GetPost = async (req, res) => {
//     // /post/:postId
//     // req.params.postId
//     const postId = req.params.postId

//     const serviceResponse = await PostService.GetPost({
//         postId 
//     })

//     return res.status(serviceResponse.code).json(serviceResponse);
// }
// const GetAllPost = async (req, res) => {

//     const { user_id, text, page = 1, perPage = 10 } = req.query;
//     const serviceResponse = await PostService.GetAllPost({
//         user_id, text, page, perPage
//     });

//     return res.status(serviceResponse.code).json(serviceResponse);
// }

// const UpdatePost = async (req, res) => {
//     const postId = req.params.postId
//     const user = req.user;
//     const text = req.body.text;

//     const serviceResponse = await PostService.UpdatePost({
//         postId,
//         user,
//         text,
//     })

//     return res.status(serviceResponse.code).json(serviceResponse);
// }
// const DeletePost = async (req, res) => {
//     const postId = req.params.postId
//     const user = req.user;

//     const serviceResponse = await PostService.DeletePost({
//         postId,
//         user
//     })

//     return res.status(serviceResponse.code).json(serviceResponse);
// }

// module.exports = {
//   createBlog,
//   getPublishedBlogs,
//   getBlogByTitle,
//   getBlogById,
//   updateBlogByTitle,
//   deleteBlog,
//   getUserBlogs,
// }


const blogService = require('../services/blogService');
const { createBlogSchema, updateBlogSchema } = require('../Middleware/validator');

// Create a new blog post
const createBlog = async (req, res) => {
  const { title, description, tags, body } = req.body;
  const { _id: userId } = req.user;

  // Validate the input data
  const { error, value } = createBlogSchema.validate({
    title,
    description,
    tags,
    body,
    userId: userId.toString(), // Use the string version of userId
  });

  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const result = await blogService.createBlog({ title, description, tags, body, user: req.user });
  res.status(result.code).json(result);
};

// Get a list of published blogs (accessible by both logged in and not logged in users)
const getPublishedBlogs = async (req, res) => {
  const { page = 1, limit = 20, search, sortBy } = req.query;
  const result = await blogService.getPublishedBlogs({ page, limit, search, sortBy });
  res.status(result.code).json(result);
};

// Get a single published blog by title
const getBlogByTitle = async (req, res) => {
  const result = await blogService.getBlogByTitle({ title: req.query.title });
  res.status(result.code).json(result);
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  const result = await blogService.getBlogById({ id: req.params.id, user: req.user });
  res.status(result.code).json(result);
};

// Update a blog post by title
const updateBlogByTitle = async (req, res) => {
  const { title } = req.params;
  const { newTitle, description, tags, body, state } = req.body;

  // Validate the input data
  const { error, value } = updateBlogSchema.validate({
    newTitle,
    description,
    tags,
    body,
    state,
  });

  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  const result = await blogService.updateBlogByTitle({ title, newTitle, description, tags, body, state, user: req.user });
  res.status(result.code).json(result);
};

// Delete a blog post
const deleteBlog = async (req, res) => {
  const result = await blogService.deleteBlog({ id: req.params.id, user: req.user });
  res.status(result.code).json(result);
};

// Get a list of blogs for the logged-in user
const getUserBlogs = async (req, res) => {
  const { page = 1, limit = 20, state } = req.query;
  const result = await blogService.getUserBlogs({ user: req.user, page, limit, state });
  res.status(result.code).json(result);
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