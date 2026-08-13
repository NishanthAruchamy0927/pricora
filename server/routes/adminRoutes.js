const express = require('express');
const router = express.Router();
const {
  getStats, getUsers, toggleUserStatus, deleteUser,
  getAllPrices, createPrice, updatePrice, deletePrice,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const role = require('../middleware/role');

const adminOnly = [protect, role('admin')];

router.get('/stats', ...adminOnly, getStats);
router.get('/users', ...adminOnly, getUsers);
router.put('/users/:id/toggle', ...adminOnly, toggleUserStatus);
router.delete('/users/:id', ...adminOnly, deleteUser);
router.get('/prices', ...adminOnly, getAllPrices);
router.post('/prices', ...adminOnly, createPrice);
router.put('/prices/:id', ...adminOnly, updatePrice);
router.delete('/prices/:id', ...adminOnly, deletePrice);

module.exports = router;
