const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

/**
 * GET /api/debug/whoami
 * Returns current user (for debugging tokens)
 */
router.get('/whoami', authMiddleware, (req, res) => {
  return res.json({ success: true, data: req.user, message: 'Current user' });
});

module.exports = router;
