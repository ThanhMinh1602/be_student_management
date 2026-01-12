const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme_secret';

async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ success: false, message: 'Authorization token missing' });
    }

    const token = auth.split(' ')[1];
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
