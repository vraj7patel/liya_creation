const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart
} = require('../controllers/cartController');

// All routes require authentication
router.use(isAuthenticated);

// GET /api/cart - Get user's cart
router.get('/', getCart);

// POST /api/cart - Add product to cart
router.post('/', addToCart);

// PUT /api/cart/:productId - Update cart item
router.put('/:productId', updateCartItem);

// DELETE /api/cart/:productId - Remove product from cart
router.delete('/:productId', removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete('/', clearCart);

module.exports = router;
