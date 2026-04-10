const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUser,
  toggleBlockUser,
  deleteUser
} = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Admin routes
router.get('/', isAuthenticated, isAdmin, getAllUsers);
router.get('/:id', isAuthenticated, isAdmin, getUser);
router.put('/:id/block', isAuthenticated, isAdmin, toggleBlockUser);
router.delete('/:id', isAuthenticated, isAdmin, deleteUser);

module.exports = router;
