const express = require('express');
const router = express.Router();
const { getAlerts, createAlert, updateAlert, deleteAlert } = require('../controllers/priceAlertController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAlerts);
router.post('/', protect, createAlert);
router.put('/:id', protect, updateAlert);
router.delete('/:id', protect, deleteAlert);

module.exports = router;