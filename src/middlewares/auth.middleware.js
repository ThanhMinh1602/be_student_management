const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';

async function authMiddleware(req, res, next) {
  try {
    // Ưu tiên lấy token từ Header chuẩn Bearer
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      // Fallback cho các trường hợp khác (nếu cần thiết cho debug)
      token = req.headers['x-access-token'] || req.query.token || req.body.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authorization token missing' });
    }

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Lấy user từ DB để đảm bảo user còn tồn tại
    const user = await authService.getUserById(payload.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or deactivated' });
    }

    // Gán user vào req để dùng ở controller
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

module.exports = authMiddleware;