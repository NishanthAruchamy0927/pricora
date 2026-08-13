require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const startPriceAlertJob = require('./jobs/priceAlertCron');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Pricora server running on port ${PORT}`);
    startPriceAlertJob();
  });
});