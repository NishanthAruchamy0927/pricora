const express = require('express');
const router = express.Router();
const { getStores, createStore, updateStore, deleteStore } = require('../controllers/storeController');
const { protect } = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', getStores);
router.post('/', protect, role('admin'), createStore);
router.put('/:id', protect, role('admin'), updateStore);
router.delete('/:id', protect, role('admin'), deleteStore);

module.exports = router;