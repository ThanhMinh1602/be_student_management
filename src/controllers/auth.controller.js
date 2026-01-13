const { registerSchema, loginSchema } = require('../helpers/validation_schema');
const authService = require('../services/auth.service');
const response = require('../helpers/response');
const MessageCodes = require('../constants/messageCodes');

async function register(req, res) {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return response.error(res, error.message, 400);

    // Truyền value chứa username vào service
    const user = await authService.registerUser(value);
    return response.success(res, user, MessageCodes.AUTH.USER_REGISTERED, 201);
  } catch (err) {
    const status = err.status || 500;
    return response.error(res, err.message, status);
  }
}

async function login(req, res) {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return response.error(res, error.message, 400);

    // Gọi loginUser bằng value chứa username
    const data = await authService.loginUser(value);

    return response.success(res, data, MessageCodes.AUTH.LOGGED_IN, 200);
  } catch (err) {
    const status = err.status || 500;
    return response.error(res, err.message, status);
  }
}

async function me(req, res) {
  try {
    // `authMiddleware` ensures req.user is populated
    const user = req.user;
    if (!user) return response.error(res, MessageCodes.USER.NOT_FOUND, 404);
    return response.success(res, user, MessageCodes.USER.CURRENT_USER, 200);
  } catch (err) {
    return response.error(res, err.message, 500);
  }
}

async function refresh(req, res) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return response.error(res, MessageCodes.AUTH.REFRESH_TOKEN_INVALID, 400);

    const accessToken = await authService.refreshAccessToken(refreshToken);
    
    // Trả về accessToken mới để FE cập nhật
    return response.success(res, { accessToken }, MessageCodes.AUTH.TOKEN_REFRESHED, 200);
  } catch (err) {
    const status = err.status || 500;
    return response.error(res, err.message, status);
  }
}

module.exports = {
  register,
  login,
  me,
  refresh,
};
