const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');
const response = require('../helpers/response');
const MessageCodes = require('../constants/messageCodes');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';

async function authMiddleware(req, res, next) {
  try {
    // 1. Lấy token từ Header Bearer
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Fallback lấy từ các nguồn khác nếu cần
      token = req.headers['x-access-token'] || req.query.token || req.body.token;
    }

    // 2. Kiểm tra token có tồn tại không
    if (!token) {
      return response.error(res, MessageCodes.AUTH.AUTH_TOKEN_MISSING, 401);
    }

    // 3. Xác thực token
    const payload = jwt.verify(token, JWT_SECRET);

    // 4. Kiểm tra user trong Database (đảm bảo user không bị xóa hoặc bị khóa)
    const user = await authService.getUserById(payload.id);

    if (!user) {
      return response.error(res, MessageCodes.USER.NOT_FOUND, 401);
    }

    if (user.isActive === false) {
      return response.error(res, MessageCodes.AUTH.ACCOUNT_LOCKED, 403);
    }

    // 5. Gán user vào request để sử dụng ở các controller tiếp theo
    req.user = user;
    next();
  } catch (err) {
    // Xử lý các loại lỗi JWT cụ thể
    if (err.name === 'TokenExpiredError') {
      return response.error(res, 'TOKEN_EXPIRED', 401);
    }

    // Mặc định trả về lỗi Invalid Token
    return response.error(res, 'INVALID_TOKEN', 401);
  }
}

module.exports = authMiddleware;