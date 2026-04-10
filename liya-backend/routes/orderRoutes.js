const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getOrder, 
  getAllOrders, 
  updateOrderStatus,
  getOrderStats,
  getOrderStatusBreakdown,
  buyNow,
  trackOrder
} = require('../controllers/orderController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// Public route - Track order by ID (no authentication required)
router.get('/track/:id', trackOrder);

// Admin routes (must be before /:id to avoid conflicts)
router.get('/admin/all', isAuthenticated, isAdmin, getAllOrders);
router.get('/stats', isAuthenticated, isAdmin, getOrderStats);
router.get('/status-breakdown', isAuthenticated, isAdmin, getOrderStatusBreakdown);

// Protected routes
router.post('/', isAuthenticated, createOrder);
router.post('/buy-now', isAuthenticated, buyNow);
router.get('/my-orders', isAuthenticated, getMyOrders);

// Get single order by ID (must be last to avoid conflicts)
router.get('/:id', isAuthenticated, getOrder);

// Admin status update
router.put('/:id/status', isAuthenticated, isAdmin, updateOrderStatus);

module.exports = router;
