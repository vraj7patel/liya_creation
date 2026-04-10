const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkWishlist
} = require('../controllers/wishlistController');

// All routes require authentication
router.use(isAuthenticated);

// GET /api/wishlist - Get user's wishlist
router.get('/', getWishlist);

// GET /api/wishlist/check/:productId - Check if product is in wishlist
router.get('/check/:productId', checkWishlist);

// POST /api/wishlist - Add product to wishlist
router.post('/', addToWishlist);

// DELETE /api/wishlist/:productId - Remove product from wishlist
router.delete('/:productId', removeFromWishlist);

// DELETE /api/wishlist - Clear entire wishlist
router.delete('/', clearWishlist);

module.exports = router;
