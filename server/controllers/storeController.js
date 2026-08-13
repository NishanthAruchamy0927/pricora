const Store = require('../models/Store');

// @route GET /api/stores
const getStores = async (req, res) => {
  try {
    const stores = await Store.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: stores.length, stores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/stores (admin)
const createStore = async (req, res) => {
  try {
    const { name, logo, website, description, status } = req.body;
    if (!name || !website) {
      return res.status(400).json({ success: false, message: 'Store name and website are required' });
    }

    const existing = await Store.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Store already exists' });
    }

    const store = await Store.create({ name, logo, website, description, status });
    res.status(201).json({ success: true, store });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/stores/:id (admin)
const updateStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.status(200).json({ success: true, store });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/stores/:id (admin)
const deleteStore = async (req, res) => {
  try {
    const store = await Store.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }
    res.status(200).json({ success: true, message: 'Store deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getStores, createStore, updateStore, deleteStore };