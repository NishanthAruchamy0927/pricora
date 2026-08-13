const express = require('express');
const router = express.Router();
const { createPrice, updatePrice, deletePrice } = require('../controllers/priceController');
const { protect } = require('../middleware/auth');
const role = require('../middleware/role');

router.post('/', protect, role('admin'), createPrice);
router.put('/:id', protect, role('admin'), updatePrice);
router.delete('/:id', protect, role('admin'), deletePrice);

module.exports = router;