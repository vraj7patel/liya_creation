const express = require('express');
const router = express.Router();
const passport = require('passport');
const { 
  register, 
  login, 
  logout, 
  getCurrentUser, 
  updateProfile, 
  changePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { getSavedAddress, saveAddress } = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/auth/login?error=google_failed` }),
  (req, res) => {
    // Set session
    req.session.userId = req.user._id;
    req.session.role = req.user.role;
    // Redirect to frontend with user data encoded
    const user = encodeURIComponent(JSON.stringify({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone || '',
      role: req.user.role
    }));
    res.redirect(`${process.env.FRONTEND_URL}/auth/google-callback?user=${user}`);
  }
);

// Protected routes
router.post('/logout', isAuthenticated, logout);
router.get('/me', isAuthenticated, getCurrentUser);
router.put('/profile', isAuthenticated, updateProfile);
router.put('/change-password', isAuthenticated, changePassword);

// Saved address
router.get('/address', isAuthenticated, getSavedAddress);
router.put('/address', isAuthenticated, saveAddress);

module.exports = router;
