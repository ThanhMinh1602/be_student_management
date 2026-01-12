function requireRole(...allowedRoles) {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: 'Authentication required' });

      if (!allowedRoles.includes(user.role)) {
        return res
          .status(403)
          .json({ success: false, message: 'Forbidden: insufficient role' });
      }

      return next();
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  };
}

module.exports = { requireRole };
