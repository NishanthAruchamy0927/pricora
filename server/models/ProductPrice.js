const mongoose = require('mongoose');

const productPriceSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    originalPrice: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    availability: { type: String, enum: ['in_stock', 'out_of_stock'], default: 'in_stock' },
    productUrl: { type: String, required: true },
    deliveryInfo: { type: String, default: '' },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

productPriceSchema.index({ productId: 1, storeId: 1 }, { unique: true });

module.exports = mongoose.model('ProductPrice', productPriceSchema);