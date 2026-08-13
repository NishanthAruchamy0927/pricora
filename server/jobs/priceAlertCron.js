const cron = require('node-cron');
const PriceAlert = require('../models/PriceAlert');
const ProductPrice = require('../models/ProductPrice');

const startPriceAlertJob = () => {
  // runs every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[cron] Checking price alerts...');
    try {
      const activeAlerts = await PriceAlert.find({ status: 'active' });

      for (const alert of activeAlerts) {
        const prices = await ProductPrice.find({ productId: alert.productId }).sort({ currentPrice: 1 });
        if (prices.length === 0) continue;

        const lowestPrice = prices[0].currentPrice;
        alert.currentPrice = lowestPrice;

        if (lowestPrice <= alert.targetPrice) {
          alert.status = 'triggered';
          alert.triggeredAt = new Date();
          console.log(`[cron] Alert triggered for product ${alert.productId}`);
        }

        await alert.save();
      }

      console.log(`[cron] Checked ${activeAlerts.length} active alerts.`);
    } catch (error) {
      console.error('[cron] Price alert job error:', error.message);
    }
  });

  console.log('Price alert cron job scheduled (runs hourly).');
};

module.exports = startPriceAlertJob;