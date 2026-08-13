const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', protect, role('admin'), createCategory);
router.put('/:id', protect, role('admin'), updateCategory);
router.delete('/:id', protect, role('admin'), deleteCategory);

module.exports = router;