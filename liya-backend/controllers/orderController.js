const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

// Helper function to validate shipping address
const validateShippingAddress = (address) => {
  const errors = [];

  // Name, city, state: letters and spaces only
  const textFields = ['fullName', 'city', 'state'];
  for (const field of textFields) {
    if (!address[field] || !/^[a-zA-Z\s]+$/.test(address[field].trim())) {
      errors.push(`${field.replace(/([A-Z])/g, ' $1').trim()} must contain only letters and spaces`);
    }
  }

  // Pincode: exactly 6 digits
  if (!address.pincode || !/^\d{6}$/.test(address.pincode)) {
    errors.push('Pincode must be exactly 6 digits');
  }

  // Phone: exactly 10 digits
  if (!address.phone || !/^\d{10}$/.test(address.phone)) {
    errors.push('Phone must be exactly 10 digits');
  }

  // Required fields check
  if (!address.address || address.address.trim().length === 0) {
    errors.push('Address is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// @desc    Track order by ID (Public - no authentication required)
// @route   GET /api/orders/track/:id
// @access  Public
exports.trackOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId before query
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    const order = await Order.findById(id).select('-__v');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found. Please check your order ID and try again.'
      });
    }

    // Return order with simplified data for public tracking
    res.json({
      success: true,
      data: {
        _id: order._id,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        products: order.products,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to track order. Please try again.'
    });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { products, shippingAddress, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No products in order'
      });
    }

    // Validate shipping address
    const addressValidation = validateShippingAddress(shippingAddress);
    if (!addressValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid shipping address',
        errors: addressValidation.errors
      });
    }

    // Calculate total and validate products
    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      orderProducts.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        image: product.images[0]
      });

      totalAmount += product.price * item.quantity;

      // Decrease stock
      product.stock -= item.quantity;
      await product.save();
    }

    // COD limit validation (₹5000 max for COD)
    if (paymentMethod === 'COD' && totalAmount > 5000) {
      // Restore stock for all products
      for (const item of products) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
      return res.status(400).json({
        success: false,
        message: 'Cash on Delivery is available only for orders up to ₹5000. Please use card payment for higher amounts.'
      });
    }

    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      orderStatus: 'Pending',
      paymentStatus: paymentMethod === 'card' ? 'Paid' : 'Pending',
      source: 'cart'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Buy Now - Direct checkout for single product
// @route   POST /api/orders/buy-now
// @access  Private
exports.buyNow = async (req, res) => {
  try {
    const { productId, quantity = 1, size = 'Free Size' } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }

    // Calculate total amount using the product price
    const unitPrice = product.price;
    const totalAmount = unitPrice * quantity;

    // Create order - shipping address will be filled later at checkout
    const order = new Order({
      user: req.user._id,
      products: [{
        product: product._id,
        name: product.name,
        price: unitPrice,
        quantity: quantity,
        size: size,
        image: product.images && product.images.length > 0 ? product.images[0] : ''
      }],
      totalAmount: totalAmount,
      shippingAddress: {
        fullName: 'To Be Updated',
        address: 'To Be Updated',
        city: 'To Be Updated',
        state: 'To Be Updated',
        pincode: 'To Be Updated',
        phone: 'To Be Updated'
      },
      paymentMethod: 'COD',
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
      source: 'buy-now'
    });

    await order.save();

    // Decrease product stock
    product.stock -= quantity;
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: order._id,
        totalAmount: order.totalAmount
      }
    });
  } catch (error) {
    console.error('Buy now error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId before query
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    const order = await Order.findById(id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If cancelling, restore stock
    if (orderStatus === 'Cancelled' && order.orderStatus !== 'Cancelled') {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') order.paymentStatus = 'Paid';
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get order status breakdown counts
// @route   GET /api/orders/status-breakdown
// @access  Private/Admin
exports.getOrderStatusBreakdown = async (req, res) => {
  try {
    const breakdown = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, data: breakdown });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/orders/stats
// @access  Private (Admin)
exports.getOrderStats = async (req, res) => {
  try {
    // Get counts from database
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $nin: ['Cancelled'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    
    const revenue = revenueResult[0]?.total || 0;

    // Get recent orders with populated user data
    const recentOrders = await Order.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        revenue,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
