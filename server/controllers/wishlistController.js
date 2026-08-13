const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const ProductPrice = require('../models/ProductPrice');

// @route GET /api/wishlist
const getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.user._id }).populate({
      path: 'productId',
      populate: { path: 'category', select: 'name' },
    });

    // attach current lowest price for each wishlist item
    const enriched = await Promise.all(
      items.map(async (item) => {
        const prices = await ProductPrice.find({ productId: item.productId._id }).sort({ currentPrice: 1 });
        const lowestPrice = prices.length > 0 ? prices[0].currentPrice : null;
        return {
          _id: item._id,
          product: item.productId,
          lowestPrice,
          createdAt: item.createdAt,
        };
      })
    );

    res.status(200).json({ success: true, count: enriched.length, wishlist: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existing = await Wishlist.findOne({ userId: req.user._id, productId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }

    const item = await Wishlist.create({ userId: req.user._id, productId });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findOneAndDelete({
      userId: req.user._id,
      productId: req.params.productId,
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in wishlist' });
    }

    res.status(200).json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };