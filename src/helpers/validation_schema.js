const Joi = require('joi');
const registerSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().min(3).max(30).required(), // Thay email bằng username
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'admin', 'teacher')
});

const loginSchema = Joi.object({
  username: Joi.string().required(), // Thay email bằng username
  password: Joi.string().required()
});

// Set schemas
const setCreateSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
});

const setUpdateSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  questionCount: Joi.number().integer().min(0).optional(),
});

// Question schemas
const questionCreateSchema = Joi.object({
  setId: Joi.string().required(),
  type: Joi.string()
    .valid('multipleChoice', 'trueFalse', 'typing', 'rearrange')
    .required(),
  content: Joi.string().allow('').required(),
  timeLimit: Joi.number().integer().min(0).optional().default(30),
  isRandom: Joi.boolean().optional().default(false),
  options: Joi.array().items(Joi.string()).optional(),
  answers: Joi.array().items(Joi.string()).min(1).required(),
});

const questionUpdateSchema = Joi.object({
  type: Joi.string()
    .valid('multipleChoice', 'trueFalse', 'typing', 'rearrange')
    .optional(),
  content: Joi.string().optional(),
  timeLimit: Joi.number().integer().min(0).optional(),
  isRandom: Joi.boolean().optional(),
  options: Joi.array().items(Joi.string()).optional(),
  answers: Joi.array().items(Joi.string()).optional(),
});
const studentCreateSchema = Joi.object({
  fullName: Joi.string().min(3).required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).default('123456'),
  role: Joi.string().valid('student', 'teacher', 'admin').default('student')
});
module.exports = {
  registerSchema,
  loginSchema,
  setCreateSchema,
  setUpdateSchema,
  questionCreateSchema,
  questionUpdateSchema,
  studentCreateSchema,
};
