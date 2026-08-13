const ProductPrice = require('../models/ProductPrice');
const PriceHistory = require('../models/PriceHistory');

// @route POST /api/prices (admin)
const createPrice = async (req, res) => {
  try {
    const { productId, storeId, originalPrice, currentPrice, discount, currency, availability, productUrl, deliveryInfo } = req.body;

    if (!productId || !storeId || !originalPrice || !currentPrice || !productUrl) {
      return res.status(400).json({ success: false, message: 'Missing required price fields' });
    }

    const price = await ProductPrice.create({
      productId,
      storeId,
      originalPrice,
      currentPrice,
      discount,
      currency,
      availability,
      productUrl,
      deliveryInfo,
    });

    await PriceHistory.create({ productId, storeId, price: currentPrice });

    res.status(201).json({ success: true, price });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/prices/:id (admin)
const updatePrice = async (req, res) => {
  try {
    const existing = await ProductPrice.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Price record not found' });
    }

    const priceChanged = req.body.currentPrice && req.body.currentPrice !== existing.currentPrice;

    const updated = await ProductPrice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );

    if (priceChanged) {
      await PriceHistory.create({
        productId: existing.productId,
        storeId: existing.storeId,
        price: req.body.currentPrice,
      });
    }

    res.status(200).json({ success: true, price: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/prices/:id (admin)
const deletePrice = async (req, res) => {
  try {
    const price = await ProductPrice.findByIdAndDelete(req.params.id);
    if (!price) {
      return res.status(404).json({ success: false, message: 'Price record not found' });
    }
    res.status(200).json({ success: true, message: 'Price deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createPrice, updatePrice, deletePrice };