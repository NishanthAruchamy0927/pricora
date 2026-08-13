const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Store = require('../models/Store');
const ProductPrice = require('../models/ProductPrice');
const PriceAlert = require('../models/PriceAlert');
const bcrypt = require('bcryptjs');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalCategories, totalStores, totalAlerts] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Product.countDocuments(),
      Category.countDocuments(),
      Store.countDocuments(),
      PriceAlert.countDocuments(),
    ]);

    const recentProducts = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: { totalUsers, totalProducts, totalCategories, totalStores, totalAlerts },
      recentProducts,
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/users/:id/toggle
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot deactivate admin' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot delete admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/prices
const getAllPrices = async (req, res) => {
  try {
    const prices = await ProductPrice.find()
      .populate('productId', 'name brand images')
      .populate('storeId', 'name')
      .sort({ updatedAt: -1 });
    res.json({ success: true, prices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/admin/prices
const createPrice = async (req, res) => {
  try {
    const { productId, storeId, originalPrice, currentPrice, discount, productUrl, availability } = req.body;
    if (!productId || !storeId || !originalPrice || !currentPrice || !productUrl) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    const price = await ProductPrice.create({ productId, storeId, originalPrice, currentPrice, discount, productUrl, availability });
    res.status(201).json({ success: true, price });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/prices/:id
const updatePrice = async (req, res) => {
  try {
    const price = await ProductPrice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!price) return res.status(404).json({ success: false, message: 'Price not found' });
    res.json({ success: true, price });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/prices/:id
const deletePrice = async (req, res) => {
  try {
    const price = await ProductPrice.findByIdAndDelete(req.params.id);
    if (!price) return res.status(404).json({ success: false, message: 'Price not found' });
    res.json({ success: true, message: 'Price deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStats, getUsers, toggleUserStatus, deleteUser, getAllPrices, createPrice, updatePrice, deletePrice };
