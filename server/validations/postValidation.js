import Joi from 'joi';

// Validation schema for creating posts
export const createPostValidation = Joi.object({
  // Content of the post (required)
  content: Joi.string()
    .min(5)
    .max(1000)
    .required(),

  // Image URL (optional, must be valid URI)
  imageUrl: Joi.string()
    .uri()
    .optional(),

  // Tags (optional array of strings)
  tags: Joi.array()
    .items(Joi.string().trim().lowercase())
    .optional(),

  // Type of post (must be one of the allowed values)
  type: Joi.string()
    .valid(
      'Recommend a place',
      'Ask for help',
      'Share a local update',
      'Event announcement'
    )
    .required(),
});

// Validation schema for updating posts
export const updatePostValidation = Joi.object({
  // Content (optional, if provided must meet constraints)
  content: Joi.string()
    .min(5)
    .max(1000),

  // Image URL (optional)
  imageUrl: Joi.string()
    .uri()
    .optional(),

  // Tags (optional)
  tags: Joi.array()
    .items(Joi.string().trim().lowercase())
    .optional(),

  // Type (optional, but must be valid if provided)
  type: Joi.string()
    .valid(
      'Recommend a place',
      'Ask for help',
      'Share a local update',
      'Event announcement'
    ),
});

// Middleware to validate post creation
export const validatePost = (req, res, next) => {
  const { error } = createPostValidation.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};