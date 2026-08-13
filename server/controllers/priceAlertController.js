const PriceAlert = require('../models/PriceAlert');
const Product = require('../models/Product');
const ProductPrice = require('../models/ProductPrice');

// @route GET /api/alerts
const getAlerts = async (req, res) => {
  try {
    const alerts = await PriceAlert.find({ userId: req.user._id })
      .populate('productId', 'name images slug')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/alerts
const createAlert = async (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    if (!productId || !targetPrice) {
      return res.status(400).json({ success: false, message: 'productId and targetPrice are required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const prices = await ProductPrice.find({ productId }).sort({ currentPrice: 1 });
    const currentPrice = prices.length > 0 ? prices[0].currentPrice : 0;

    const status = currentPrice > 0 && currentPrice <= targetPrice ? 'triggered' : 'active';

    const alert = await PriceAlert.create({
      userId: req.user._id,
      productId,
      targetPrice,
      currentPrice,
      status,
      triggeredAt: status === 'triggered' ? new Date() : null,
    });

    res.status(201).json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/alerts/:id
const updateAlert = async (req, res) => {
  try {
    const alert = await PriceAlert.findOne({ _id: req.params.id, userId: req.user._id });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }

    const { targetPrice } = req.body;
    if (targetPrice) alert.targetPrice = targetPrice;

    if (alert.currentPrice > 0 && alert.currentPrice <= alert.targetPrice) {
      alert.status = 'triggered';
      alert.triggeredAt = new Date();
    } else {
      alert.status = 'active';
      alert.triggeredAt = null;
    }

    await alert.save();
    res.status(200).json({ success: true, alert });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/alerts/:id
const deleteAlert = async (req, res) => {
  try {
    const alert = await PriceAlert.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found' });
    }
    res.status(200).json({ success: true, message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAlerts, createAlert, updateAlert, deleteAlert };