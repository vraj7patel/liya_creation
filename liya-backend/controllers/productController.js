const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Helper function to delete image files from filesystem
const deleteImageFiles = (images) => {
  if (!images || images.length === 0) return;
  
  images.forEach(imagePath => {
    // Skip URL-based images - only delete local files
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return;
    }
    // Extract filename from path (e.g., /uploads/products/filename.jpg -> filename.jpg)
    const filename = path.basename(imagePath);
    const fullPath = path.join(__dirname, '../uploads/products', filename);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted image file: ${filename}`);
    }
  });
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, page = 1, limit = 12, search, featured, minPrice, maxPrice, sort } = req.query;
    
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Sort logic
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'price-low')  sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get new arrivals
// @route   GET /api/products/new-arrivals
// @access  Public
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(8);
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(8);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Product.countDocuments({ category });

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  console.log('🎯 CREATE PRODUCT HANDLER EXECUTED');
  try {
    console.log('=== CREATE PRODUCT DEBUG ===');
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    console.log('req.user:', req.user ? req.user._id : 'no user');
    
    const { name, description, price, category, sizes, stock, isFeatured, isNewArrival, existingImages } = req.body;
    
    console.log('Parsed params:', { name, description, price, category, sizes, stock, isFeatured, isNewArrival, existingImages });

    // === VALIDATION ===
    const requiredFields = ['name', 'description', 'price', 'category'];
    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field].trim() === '') {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${field}`
        });
      }
    }

    // Validate category enum
    const validCategories = ['Lehengas', 'saree', 'Gowns', 'Kurtis'];
    if (!validCategories.includes(category.trim())) {
      return res.status(400).json({
        success: false,
        message: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // Validate numeric fields
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stock || '0');
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a valid positive number'
      });
    }
    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock must be a valid non-negative number'
      });
    }

    // Safely parse sizes
    let parsedSizes = ['M']; // default
    if (sizes) {
      try {
        parsedSizes = Array.isArray(sizes) ? sizes : JSON.parse(sizes);
        if (!Array.isArray(parsedSizes)) {
          throw new Error('Sizes must be an array');
        }
      } catch (parseErr) {
        console.error('Sizes parse error:', parseErr.message);
        return res.status(400).json({
          success: false,
          message: 'Invalid sizes format'
        });
      }
    }

    // Safely parse existingImages
    let existingImageUrls = [];
    if (existingImages) {
      try {
        existingImageUrls = Array.isArray(existingImages) ? existingImages : JSON.parse(existingImages);
        if (!Array.isArray(existingImageUrls)) {
          throw new Error('existingImages must be an array');
        }
      } catch (parseErr) {
        console.error('existingImages parse error:', parseErr.message);
        return res.status(400).json({
          success: false,
          message: 'Invalid existingImages format'
        });
      }
    }

    // Handle uploaded files
    let productImages = [];
    if (req.files && req.files.length > 0) {
      productImages = req.files.map(file => `/uploads/products/${file.filename}`);
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: priceNum,
      category: category.trim(),
      images: [...productImages, ...existingImageUrls],
      sizes: parsedSizes,
      stock: stockNum,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true
    };
    
    console.log('Final productData:', productData);
    
    const product = await Product.create(productData);
    console.log('Product created successfully:', product._id);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('=== CREATE PRODUCT ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    console.error('====================');
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, stock, isFeatured, isNewArrival, existingImages } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle uploaded files
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => `/uploads/products/${file.filename}`);
    }

    // Combine existing images with new uploads
    let finalImages = [];
    
    // Start with existing images if provided
    if (existingImages) {
      const existing = Array.isArray(existingImages) ? existingImages : JSON.parse(existingImages);
      finalImages = [...existing];
    }
    
    // Add newly uploaded files
    finalImages = [...finalImages, ...newImages];

    // If nothing was provided, keep the existing product images
    if (finalImages.length === 0) {
      finalImages = product.images;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.images = finalImages;
    product.sizes = sizes ? (Array.isArray(sizes) ? sizes : JSON.parse(sizes)) : product.sizes;
    product.stock = stock !== undefined ? stock : product.stock;
    product.isFeatured = isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : product.isFeatured;
    product.isNewArrival = isNewArrival !== undefined ? (isNewArrival === 'true' || isNewArrival === true) : product.isNewArrival;

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete associated image files from filesystem
    if (product.images && product.images.length > 0) {
      deleteImageFiles(product.images);
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all products for admin (with category breakdown)
// @route   GET /api/products/admin/all
// @access  Private/Admin
exports.getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    // Get category-wise counts
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$stock' } } }
    ]);

    res.json({
      success: true,
      data: {
        products,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get low stock products (stock <= 5)
// @route   GET /api/products/low-stock
// @access  Private/Admin
exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    const products = await Product.find({ stock: { $lte: threshold } })
      .select('name category stock images')
      .sort({ stock: 1 });
    res.json({ success: true, data: products, count: products.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) return res.status(400).json({ success: false, message: 'Rating and comment are required' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });

    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.numReviews = product.reviews.length;
    product.averageRating = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();

    res.status(201).json({ success: true, message: 'Review added', data: { averageRating: product.averageRating, numReviews: product.numReviews, reviews: product.reviews } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete own review
// @route   DELETE /api/products/:id/reviews
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.reviews = product.reviews.filter(r => r.user.toString() !== req.user._id.toString());
    product.numReviews = product.reviews.length;
    product.averageRating = product.reviews.length ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length : 0;
    await product.save();

    res.json({ success: true, message: 'Review deleted', data: { averageRating: product.averageRating, numReviews: product.numReviews, reviews: product.reviews } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get dashboard stats (public - no auth required)
// @route   GET /api/products/stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const Product = require('../models/Product');
    const User = require('../models/User');
    const Order = require('../models/Order');
    
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalOrders = await Order.countDocuments();
    
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const revenue = revenueResult[0]?.total || 0;
    
    // Get category breakdown
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$stock' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        revenue,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
