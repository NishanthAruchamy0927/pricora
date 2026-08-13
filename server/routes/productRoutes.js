const express = require('express');
const router = express.Router();
const {
  getProducts,
  searchProducts,
  getProduct,
  getProductPrices,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/search', searchProducts);
router.get('/', getProducts);
router.get('/:id', getProduct);
router.get('/:id/prices', getProductPrices);
router.post('/', protect, role('admin'), createProduct);
router.put('/:id', protect, role('admin'), updateProduct);
router.delete('/:id', protect, role('admin'), deleteProduct);

module.exports = router;