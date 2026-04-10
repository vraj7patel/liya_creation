const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getFeaturedProducts,
  getNewArrivals,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
  getStats,
  getLowStockProducts,
  addReview,
  deleteReview
} = require('../controllers/productController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/stats', getStats);
router.get('/low-stock', isAuthenticated, isAdmin, getLowStockProducts);
router.get('/admin/all', isAuthenticated, isAdmin, getAdminProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProduct);
router.get('/', getProducts);

// Review routes
router.post('/:id/reviews', isAuthenticated, addReview);
router.delete('/:id/reviews', isAuthenticated, deleteReview);

// Admin routes
router.post('/', isAuthenticated, isAdmin, upload.array('images', 5), createProduct);
router.put('/:id', isAuthenticated, isAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, deleteProduct);

module.exports = router;
