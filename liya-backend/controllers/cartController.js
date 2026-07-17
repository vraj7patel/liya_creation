const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId })
      .populate('items.product', 'name price images category sizes stock');
    if (!cart) cart = await Cart.create({ user: userId, items: [] });
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting cart' });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1, size = 'Free Size' } = req.body;
    if (!productId) return res.status(400).json({ success: false, message: 'Product ID is required' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, size });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images category sizes stock');
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding to cart' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { size } = req.query;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    if (size) {
      cart.items = cart.items.filter(item => !(item.product.toString() === productId && item.size === size));
    } else {
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
    }

    await cart.save();
    await cart.populate('items.product', 'name price images category sizes stock');
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing from cart' });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity, size } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === size
    );

    if (itemIndex === -1) return res.status(404).json({ success: false, message: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.product', 'name price images category sizes stock');
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating cart' });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOneAndUpdate({ user: userId }, { items: [] }, { new: true });
    res.status(200).json({ success: true, data: cart || { user: userId, items: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error clearing cart' });
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateCartItem, clearCart };
