const { registerSchema, loginSchema } = require('../helpers/validation_schema');
const authService = require('../services/auth.service');

async function register(req, res) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.message });

    const user = await authService.registerUser(value);
    return res
      .status(201)
      .json({ success: true, data: user, message: 'User registered' });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
}

async function login(req, res) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, message: error.message });

    const { token, user } = await authService.loginUser(value);
    return res.json({
      success: true,
      data: { token, user },
      message: 'Logged in',
    });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ success: false, message: err.message });
  }
}

async function me(req, res) {
  try {
    // `authMiddleware` ensures req.user is populated
    const user = req.user;
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: user, message: 'Current user' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  register,
  login,
  me,
};
