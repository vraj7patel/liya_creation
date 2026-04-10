const User = require('../models/User');

// Check if user is authenticated (session-based only)
const isAuthenticated = async (req, res, next) => {
  try {
    // Check session for userId
    if (!req.session || !req.session.userId) {
      return res.status(401).json({
        success: false,
        message: 'Please login to access this resource'
      });
    }

    // Get user from database
    const user = await User.findById(req.session.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please login again.'
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact admin.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

// Check if user is admin (uses req.user set by isAuthenticated)
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Please login to access this resource' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied. Admin privileges required.' });
  }
  if (req.user.isBlocked) {
    return res.status(403).json({ success: false, message: 'Your account has been blocked.' });
  }
  next();
};

module.exports = { isAuthenticated, isAdmin };
