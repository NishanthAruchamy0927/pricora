const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  price: { type: Number, required: true },
  recordedAt: { type: Date, default: Date.now },
});

priceHistorySchema.index({ productId: 1, storeId: 1, recordedAt: 1 });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);