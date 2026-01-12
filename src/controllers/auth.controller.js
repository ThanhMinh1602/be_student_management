const { registerSchema, loginSchema } = require('../helpers/validation_schema');
const authService = require('../services/auth.service');
const response = require('../helpers/response');

async function register(req, res) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return response.error(res, error.message, 400);

    const user = await authService.registerUser(value);
    return response.success(res, user, 'User registered', 201);
  } catch (err) {
    const status = err.status || 500;
    return response.error(res, err.message, status);
  }
}

async function login(req, res) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return response.error(res, error.message, 400);

    const { token, user } = await authService.loginUser(value);
    return response.success(res, { token, user }, 'Logged in', 200);
  } catch (err) {
    const status = err.status || 500;
    return response.error(res, err.message, status);
  }
}

async function me(req, res) {
  try {
    // `authMiddleware` ensures req.user is populated
    const user = req.user;
    if (!user) return response.error(res, 'User not found', 404);
    return response.success(res, user, 'Current user', 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

module.exports = {
  register,
  login,
  me,
};
