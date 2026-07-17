const User = require('../models/User');
const crypto = require('crypto');
const transporter = require('../config/email');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if email and password provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      authProvider: 'local'
    });

    // Create session (session-based auth - no JWT)
    req.session.userId = user._id;
    req.session.role = user.role;

    // Send welcome email to user
    transporter.sendMail({
      from: `"Liya Creation" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🎉 Welcome to Liya Creation!',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1)">
          <div style="background:linear-gradient(135deg,#8B4513,#D4A574);padding:30px;text-align:center">
            <h1 style="color:white;margin:0;font-size:28px">Liya Creation</h1>
            <p style="color:rgba(255,255,255,0.9);margin:5px 0 0">Premium Women's Ethnic Wear</p>
          </div>
          <div style="padding:30px">
            <h2 style="color:#8B4513">Welcome, ${user.name}! 🌸</h2>
            <p style="color:#555;line-height:1.6">Thank you for joining <strong>Liya Creation</strong>. We're thrilled to have you as part of our family!</p>
            <p style="color:#555;line-height:1.6">Explore our exclusive collection of Lehengas, Sarees, Gowns, and Kurtis crafted just for you.</p>
            <div style="text-align:center;margin:25px 0">
              <a href="${process.env.FRONTEND_URL}/products" style="background:#8B4513;color:white;padding:12px 30px;text-decoration:none;border-radius:25px;font-weight:bold;display:inline-block">Shop Now ✨</a>
            </div>
            <p style="color:#888;font-size:13px">If you have any questions, feel free to contact us.</p>
          </div>
          <div style="background:#f9f9f9;padding:15px;text-align:center;color:#aaa;font-size:12px">
            © 2024 Liya Creation. All rights reserved.
          </div>
        </div>
      `
    }).catch(err => console.error('Welcome email error:', err.message));

    // Send notification email to admin
    transporter.sendMail({
      from: `"Liya Creation" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '🆕 New User Registered - Liya Creation',
      html: `<p>New user registered:</p><ul><li><b>Name:</b> ${user.name}</li><li><b>Email:</b> ${user.email}</li><li><b>Phone:</b> ${user.phone || 'N/A'}</li></ul>`
    }).catch(err => console.error('Admin notification error:', err.message));

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been blocked. Please contact admin.'
      });
    }

    // Check if user has a password (for OAuth users)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Please login with your OAuth provider or reset your password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Create session (session-based auth - no JWT)
    req.session.userId = user._id;
    req.session.role = user.role;

    // Send login notification to admin
    transporter.sendMail({
      from: `"Liya Creation" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: '🔔 User Logged In - Liya Creation',
      html: `<p>User just logged in:</p><ul><li><b>Name:</b> ${user.name}</li><li><b>Email:</b> ${user.email}</li><li><b>Time:</b> ${new Date().toLocaleString('en-IN', {timeZone:'Asia/Kolkata'})}</li></ul>`
    }).catch(err => console.error('Login notification error:', err.message));

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with that email' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${token}`;

    await transporter.sendMail({
      from: `"Liya Creation" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>Hi ${user.name},</p>
        <p>Click the link below to reset your password. This link expires in 15 minutes.</p>
        <a href="${resetUrl}" style="background:#8B4513;color:white;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `
    });

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Error sending email' });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpiry');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({
          success: false,
          message: 'Error during logout'
        });
      }

      res.clearCookie('connect.sid');
      res.json({
        success: true,
        message: 'Logout successful'
      });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};
