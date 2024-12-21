import Joi from 'joi';

// Schema for creating a blog
export const createBlogSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  body: Joi.string().required(),
  userId: Joi.string().required()
});

// Schema for updating a blog
export const updateBlogSchema = Joi.object({
  newTitle: Joi.string().optional(),
  description: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  body: Joi.string().optional(),
  state: Joi.string().valid('draft', 'published').optional()
});