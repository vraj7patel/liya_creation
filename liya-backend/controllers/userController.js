const User = require('../models/User');

// @desc    Get saved address
// @route   GET /api/users/address
// @access  Private
exports.getSavedAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('savedAddress');
    res.json({ success: true, data: user.savedAddress || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Save address
// @route   PUT /api/users/address
// @access  Private
exports.saveAddress = async (req, res) => {
  try {
    const { fullName, address, city, state, pincode, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { savedAddress: { fullName, address, city, state, pincode, phone } },
      { new: true, select: 'savedAddress' }
    );
    res.json({ success: true, message: 'Address saved successfully', data: user.savedAddress });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    let query = { role: 'user' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single user (Admin)
// @route   GET /api/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Block/Unblock user (Admin)
// @route   PUT /api/users/:id/block
// @access  Private (Admin)
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cannot block admin
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot block an admin'
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: user.isBlocked ? 'User blocked successfully' : 'User unblocked successfully',
      data: {
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    console.error('Toggle block user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cannot delete admin
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete an admin'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
