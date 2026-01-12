const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';

async function authMiddleware(req, res, next) {
  try {
    // Accept token from Authorization header, x-access-token header, query param, or body (for debugging/dev)
    const authHeader = req.headers.authorization;
    const tokenFromHeader =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;
    const token =
      tokenFromHeader ||
      req.headers['x-access-token'] ||
      req.query.token ||
      req.body.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization token missing' });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    const user = await authService.getUserById(payload.id);
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = authMiddleware;
