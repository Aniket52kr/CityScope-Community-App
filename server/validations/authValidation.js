import Joi from 'joi';

// Registration schema
export const registerValidation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Login schema
export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Middleware
export const validateAuth = (req, res, next) => {
  const schema = req.path.includes('register') ? registerValidation : loginValidation;
  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};
