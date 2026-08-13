const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    targetPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    status: { type: String, enum: ['active', 'triggered'], default: 'active' },
    triggeredAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PriceAlert', priceAlertSchema);