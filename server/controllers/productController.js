const Product = require('../models/Product');
const ProductPrice = require('../models/ProductPrice');
const PriceHistory = require('../models/PriceHistory');

// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (brand) filter.brand = brand;

    let query = Product.find(filter).populate('category', 'name');

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'popularity') sortOption = { reviewCount: -1 };
    query = query.sort(sortOption);

    const skip = (Number(page) - 1) * Number(limit);
    query = query.skip(skip).limit(Number(limit));

    const products = await query;
    const total = await Product.countDocuments(filter);

    // Attach price summary to each product
    const productIds = products.map((p) => p._id);
    const allPrices = await ProductPrice.find({ productId: { $in: productIds } });

    const enriched = products.map((product) => {
      const prices = allPrices.filter((p) => p.productId.toString() === product._id.toString());
      const priceValues = prices.map((p) => p.currentPrice);
      const lowestPrice = priceValues.length ? Math.min(...priceValues) : null;
      const lowestEntry = prices.find((p) => p.currentPrice === lowestPrice);
      const bestDiscount = lowestEntry ? lowestEntry.discount : 0;
      const originalPrice = lowestEntry ? lowestEntry.originalPrice : null;
      return {
        ...product.toObject(),
        lowestPrice,
        bestDiscount,
        originalPrice,
        storeCount: prices.length,
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      products: enriched,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/products/search?q=
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const products = await Product.find({ $text: { $search: q } })
      .populate('category', 'name')
      .limit(20);

    const productIds = products.map((p) => p._id);
    const allPrices = await ProductPrice.find({ productId: { $in: productIds } });
    const enriched = products.map((product) => {
      const prices = allPrices.filter((p) => p.productId.toString() === product._id.toString());
      const priceValues = prices.map((p) => p.currentPrice);
      const lowestPrice = priceValues.length ? Math.min(...priceValues) : null;
      const lowestEntry = prices.find((p) => p.currentPrice === lowestPrice);
      return {
        ...product.toObject(),
        lowestPrice,
        bestDiscount: lowestEntry ? lowestEntry.discount : 0,
        originalPrice: lowestEntry ? lowestEntry.originalPrice : null,
        storeCount: prices.length,
      };
    });

    res.status(200).json({ success: true, count: enriched.length, products: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route GET /api/products/:id/prices
const getProductPrices = async (req, res) => {
  try {
    const prices = await ProductPrice.find({ productId: req.params.id })
      .populate('storeId', 'name logo website')
      .sort({ currentPrice: 1 });

    if (prices.length === 0) {
      return res.status(200).json({
        success: true,
        prices: [],
        comparison: null,
      });
    }

    const priceValues = prices.map((p) => p.currentPrice);
    const lowest = Math.min(...priceValues);
    const highest = Math.max(...priceValues);
    const average = priceValues.reduce((a, b) => a + b, 0) / priceValues.length;
    const savings = highest - lowest;
    const savingsPercentage = highest > 0 ? ((savings / highest) * 100).toFixed(2) : 0;
    const cheapestStore = prices.find((p) => p.currentPrice === lowest);

    res.status(200).json({
      success: true,
      prices,
      comparison: {
        lowest,
        highest,
        average: Math.round(average),
        savings,
        savingsPercentage: Number(savingsPercentage),
        cheapestStore: cheapestStore.storeId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route POST /api/products (admin)
const createProduct = async (req, res) => {
  try {
    const { name, slug, description, brand, category, images, specifications } = req.body;
    if (!name || !slug || !brand || !category) {
      return res.status(400).json({ success: false, message: 'Name, slug, brand and category are required' });
    }

    const product = await Product.create({
      name,
      slug,
      description,
      brand,
      category,
      images,
      specifications,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @route DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    await ProductPrice.deleteMany({ productId: req.params.id });
    await PriceHistory.deleteMany({ productId: req.params.id });
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  searchProducts,
  getProduct,
  getProductPrices,
  createProduct,
  updateProduct,
  deleteProduct,
};