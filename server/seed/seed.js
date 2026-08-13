require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Category = require('../models/Category');
const Store = require('../models/Store');
const Product = require('../models/Product');
const ProductPrice = require('../models/ProductPrice');
const PriceHistory = require('../models/PriceHistory');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await Promise.all([
      User.deleteMany({ role: { $in: ['admin', 'user'] } }),
      Category.deleteMany({}),
      Store.deleteMany({}),
      Product.deleteMany({}),
      ProductPrice.deleteMany({}),
      PriceHistory.deleteMany({}),
    ]);
    console.log('Old seed data cleared.');

    // Admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Pricora Admin',
      email: 'admin@pricora.com',
      password: adminPassword,
      role: 'admin',
    });

    // Demo user
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      name: 'Demo User',
      email: 'user@pricora.com',
      password: userPassword,
      role: 'user',
    });
    console.log('Users created.');

    // Categories
    const categories = await Category.insertMany([
      { name: 'Mobiles', description: 'Smartphones and accessories', status: 'active' },
      { name: 'Laptops', description: 'Laptops and notebooks', status: 'active' },
      { name: 'Audio', description: 'Headphones, earbuds, speakers', status: 'active' },
      { name: 'Tablets', description: 'Tablets and iPads', status: 'active' },
      { name: 'Cameras', description: 'DSLR, mirrorless and action cameras', status: 'active' },
      { name: 'Wearables', description: 'Smartwatches and fitness bands', status: 'active' },
    ]);
    console.log(`${categories.length} categories created.`);

    // Stores
    const stores = await Store.insertMany([
      { name: 'Amazon', website: 'https://www.amazon.in', description: 'Amazon India', status: 'active' },
      { name: 'Flipkart', website: 'https://www.flipkart.com', description: 'Flipkart India', status: 'active' },
      { name: 'Croma', website: 'https://www.croma.com', description: 'Croma electronics retailer', status: 'active' },
      { name: 'Reliance Digital', website: 'https://www.reliancedigital.in', description: 'Reliance Digital', status: 'active' },
    ]);
    console.log(`${stores.length} stores created.`);

    const cat = (name) => categories.find((c) => c.name === name)._id;

    // ---------- PRODUCTS ----------
    const products = await Product.insertMany([
      // ===== Original 12 (unchanged) =====
      {
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Apple iPhone 15 Pro with A17 Pro chip, titanium design, 48MP camera system, and USB-C connectivity.',
        brand: 'Apple',
        category: cat('Mobiles'),
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
        ],
        specifications: { display: '6.1 inch Super Retina XDR', storage: '256GB', chip: 'A17 Pro', camera: '48MP Triple', battery: '3274 mAh' },
        rating: 4.8, reviewCount: 3240,
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3, 200MP camera, built-in S Pen, and AI features.',
        brand: 'Samsung',
        category: cat('Mobiles'),
        images: [
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
        ],
        specifications: { display: '6.8 inch QHD+', storage: '256GB', chip: 'Snapdragon 8 Gen 3', camera: '200MP Quad', battery: '5000 mAh' },
        rating: 4.7, reviewCount: 2180,
      },
      {
        name: 'OnePlus 12',
        slug: 'oneplus-12',
        description: 'OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad camera, 100W SUPERVOOC charging.',
        brand: 'OnePlus',
        category: cat('Mobiles'),
        images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80'],
        specifications: { display: '6.82 inch LTPO AMOLED', storage: '256GB', chip: 'Snapdragon 8 Gen 3', camera: '50MP Triple', battery: '5400 mAh' },
        rating: 4.5, reviewCount: 980,
      },
      {
        name: 'MacBook Air M3',
        slug: 'macbook-air-m3',
        description: 'Apple MacBook Air with M3 chip, 15.3-inch Liquid Retina display, 18-hour battery life.',
        brand: 'Apple',
        category: cat('Laptops'),
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
          'https://images.unsplash.com/photo-1611186871525-9c4e3b6a5e1e?w=600&q=80',
        ],
        specifications: { display: '15.3 inch Liquid Retina', ram: '16GB', storage: '512GB SSD', chip: 'Apple M3', battery: '18 hours' },
        rating: 4.9, reviewCount: 1560,
      },
      {
        name: 'Dell XPS 15',
        slug: 'dell-xps-15',
        description: 'Dell XPS 15 with Intel Core i9, OLED display, NVIDIA RTX 4060, premium build quality.',
        brand: 'Dell',
        category: cat('Laptops'),
        images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80'],
        specifications: { display: '15.6 inch OLED', ram: '32GB', storage: '1TB SSD', processor: 'Intel Core i9', gpu: 'NVIDIA RTX 4060' },
        rating: 4.6, reviewCount: 720,
      },
      {
        name: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        description: 'Sony WH-1000XM5 industry-leading noise cancelling wireless headphones with 30-hour battery.',
        brand: 'Sony',
        category: cat('Audio'),
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
        ],
        specifications: { type: 'Over-ear', batteryLife: '30 hours', noiseCancelling: 'Yes', connectivity: 'Bluetooth 5.2', weight: '250g' },
        rating: 4.8, reviewCount: 4320,
      },
      {
        name: 'Apple AirPods Pro 2',
        slug: 'airpods-pro-2',
        description: 'Apple AirPods Pro 2nd generation with H2 chip, Adaptive Transparency, and USB-C charging.',
        brand: 'Apple',
        category: cat('Audio'),
        images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80'],
        specifications: { type: 'In-ear', batteryLife: '6 hours (30 with case)', noiseCancelling: 'Yes', chip: 'H2', waterResistance: 'IPX4' },
        rating: 4.7, reviewCount: 5600,
      },
      {
        name: 'iPad Pro M4',
        slug: 'ipad-pro-m4',
        description: 'Apple iPad Pro with M4 chip, Ultra Retina XDR OLED display, thinnest Apple product ever.',
        brand: 'Apple',
        category: cat('Tablets'),
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80'],
        specifications: { display: '11 inch Ultra Retina XDR', storage: '256GB', chip: 'Apple M4', camera: '12MP', connectivity: 'Wi-Fi 6E' },
        rating: 4.8, reviewCount: 890,
      },
      {
        name: 'Samsung Galaxy Tab S9',
        slug: 'samsung-galaxy-tab-s9',
        description: 'Samsung Galaxy Tab S9 with Snapdragon 8 Gen 2, Dynamic AMOLED display, S Pen included.',
        brand: 'Samsung',
        category: cat('Tablets'),
        images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80'],
        specifications: { display: '11 inch Dynamic AMOLED', storage: '128GB', chip: 'Snapdragon 8 Gen 2', camera: '13MP', sPen: 'Included' },
        rating: 4.5, reviewCount: 640,
      },
      {
        name: 'Sony Alpha A7 IV',
        slug: 'sony-alpha-a7-iv',
        description: 'Sony Alpha A7 IV full-frame mirrorless camera with 33MP sensor, 4K 60fps video.',
        brand: 'Sony',
        category: cat('Cameras'),
        images: [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
          'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
        ],
        specifications: { sensor: '33MP Full-Frame', video: '4K 60fps', autofocus: '759-point AF', stabilization: '5-axis IBIS', mount: 'Sony E-mount' },
        rating: 4.9, reviewCount: 1120,
      },
      {
        name: 'Apple Watch Series 9',
        slug: 'apple-watch-series-9',
        description: 'Apple Watch Series 9 with S9 chip, Double Tap gesture, Always-On Retina display.',
        brand: 'Apple',
        category: cat('Wearables'),
        images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80'],
        specifications: { display: '45mm Always-On Retina', chip: 'S9', health: 'ECG, Blood Oxygen', battery: '18 hours', waterResistance: '50m' },
        rating: 4.7, reviewCount: 2890,
      },
      {
        name: 'Samsung Galaxy Watch 6',
        slug: 'samsung-galaxy-watch-6',
        description: 'Samsung Galaxy Watch 6 with advanced health monitoring, sapphire crystal glass, Wear OS.',
        brand: 'Samsung',
        category: cat('Wearables'),
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
        specifications: { display: '44mm Super AMOLED', chip: 'Exynos W930', health: 'BioActive Sensor', battery: '40 hours', os: 'Wear OS 4' },
        rating: 4.4, reviewCount: 1340,
      },

      // ===== New: Mobiles (7) =====
      {
        name: 'Google Pixel 8 Pro',
        slug: 'google-pixel-8-pro',
        description: 'Google Pixel 8 Pro with Tensor G3, Magic Editor AI photo tools, and pure Android experience.',
        brand: 'Google',
        category: cat('Mobiles'),
        images: ['https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=600&q=80'],
        specifications: { display: '6.7 inch LTPO OLED', storage: '128GB', chip: 'Google Tensor G3', camera: '50MP Triple', battery: '5050 mAh' },
        rating: 4.6, reviewCount: 1240,
      },
      {
        name: 'Xiaomi 14 Ultra',
        slug: 'xiaomi-14-ultra',
        description: 'Xiaomi 14 Ultra with Leica quad-camera system and Snapdragon 8 Gen 3.',
        brand: 'Xiaomi',
        category: cat('Mobiles'),
        images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80'],
        specifications: { display: '6.73 inch LTPO AMOLED', storage: '512GB', chip: 'Snapdragon 8 Gen 3', camera: '50MP Leica Quad', battery: '5300 mAh' },
        rating: 4.6, reviewCount: 560,
      },
      {
        name: 'iPhone 15',
        slug: 'iphone-15',
        description: 'Apple iPhone 15 with A16 Bionic chip, Dynamic Island, and 48MP main camera.',
        brand: 'Apple',
        category: cat('Mobiles'),
        images: ['https://images.unsplash.com/photo-1697284960547-8e0c3b5f2a1b?w=600&q=80'],
        specifications: { display: '6.1 inch Super Retina XDR', storage: '128GB', chip: 'A16 Bionic', camera: '48MP Dual', battery: '3349 mAh' },
        rating: 4.6, reviewCount: 2960,
      },
      {
        name: 'Samsung Galaxy S24',
        slug: 'samsung-galaxy-s24',
        description: 'Samsung Galaxy S24 with Exynos 2400, Galaxy AI features, compact flagship design.',
        brand: 'Samsung',
        category: cat('Mobiles'),
        images: ['https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=600&q=80'],
        specifications: { display: '6.2 inch Dynamic AMOLED', storage: '128GB', chip: 'Exynos 2400', camera: '50MP Triple', battery: '4000 mAh' },
        rating: 4.5, reviewCount: 1450,
      },
      {
        name: 'OnePlus Nord 3',
        slug: 'oneplus-nord-3',
        description: 'OnePlus Nord 3 with MediaTek Dimensity 9000, 80W fast charging, 120Hz AMOLED display.',
        brand: 'OnePlus',
        category: cat('Mobiles'),
        images: ['https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80'],
        specifications: { display: '6.74 inch AMOLED 120Hz', storage: '128GB', chip: 'Dimensity 9000', camera: '50MP Triple', battery: '5000 mAh' },
        rating: 4.3, reviewCount: 780,
      },
      {
        name: 'Vivo X100 Pro',
        slug: 'vivo-x100-pro',
        description: 'Vivo X100 Pro with ZEISS optics, MediaTek Dimensity 9300, flagship camera performance.',
        brand: 'Vivo',
        category: cat('Mobiles'),
        images: ['https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=600&q=80'],
        specifications: { display: '6.78 inch AMOLED', storage: '256GB', chip: 'Dimensity 9300', camera: '50MP ZEISS Triple', battery: '5400 mAh' },
        rating: 4.5, reviewCount: 410,
      },
      {
        name: 'Nothing Phone 2',
        slug: 'nothing-phone-2',
        description: 'Nothing Phone 2 with Glyph Interface, Snapdragon 8+ Gen 1, transparent design.',
        brand: 'Nothing',
        category: cat('Mobiles'),
        images: ['https://images.unsplash.com/photo-1691346074988-16a516601e93?w=600&q=80'],
        specifications: { display: '6.7 inch LTPO OLED', storage: '128GB', chip: 'Snapdragon 8+ Gen 1', camera: '50MP Dual', battery: '4700 mAh' },
        rating: 4.3, reviewCount: 620,
      },

      // ===== New: Laptops (9) =====
      {
        name: 'HP Spectre x360',
        slug: 'hp-spectre-x360',
        description: 'HP Spectre x360 convertible laptop with Intel Core Ultra 7, OLED touchscreen, gem-cut design.',
        brand: 'HP',
        category: cat('Laptops'),
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80'],
        specifications: { display: '13.5 inch OLED Touch', ram: '16GB', storage: '1TB SSD', processor: 'Intel Core Ultra 7', battery: '17 hours' },
        rating: 4.6, reviewCount: 480,
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon',
        slug: 'lenovo-thinkpad-x1-carbon',
        description: 'Lenovo ThinkPad X1 Carbon, ultralight business laptop with MIL-SPEC durability.',
        brand: 'Lenovo',
        category: cat('Laptops'),
        images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80'],
        specifications: { display: '14 inch WUXGA', ram: '16GB', storage: '512GB SSD', processor: 'Intel Core i7', weight: '1.12 kg' },
        rating: 4.7, reviewCount: 690,
      },
      {
        name: 'ASUS ROG Zephyrus G14',
        slug: 'asus-rog-zephyrus-g14',
        description: 'ASUS ROG Zephyrus G14 gaming laptop with Ryzen 9, RTX 4070, AniMe Matrix display.',
        brand: 'ASUS',
        category: cat('Laptops'),
        images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80'],
        specifications: { display: '14 inch QHD 165Hz', ram: '32GB', storage: '1TB SSD', processor: 'AMD Ryzen 9', gpu: 'RTX 4070' },
        rating: 4.7, reviewCount: 350,
      },
      {
        name: 'Microsoft Surface Laptop 6',
        slug: 'microsoft-surface-laptop-6',
        description: 'Microsoft Surface Laptop 6 with Intel Core Ultra, Copilot AI key, premium aluminum chassis.',
        brand: 'Microsoft',
        category: cat('Laptops'),
        images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80'],
        specifications: { display: '13.5 inch PixelSense', ram: '16GB', storage: '512GB SSD', processor: 'Intel Core Ultra 7', battery: '19 hours' },
        rating: 4.5, reviewCount: 220,
      },
      {
        name: 'Acer Predator Helios Neo 16',
        slug: 'acer-predator-helios-neo-16',
        description: 'Acer Predator Helios Neo 16 gaming laptop with Intel Core i9, RTX 4060, 16-inch WQXGA display.',
        brand: 'Acer',
        category: cat('Laptops'),
        images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80'],
        specifications: { display: '16 inch WQXGA 165Hz', ram: '16GB', storage: '1TB SSD', processor: 'Intel Core i9', gpu: 'RTX 4060' },
        rating: 4.4, reviewCount: 290,
      },
      {
        name: 'MacBook Pro 16 M3',
        slug: 'macbook-pro-16-m3',
        description: 'Apple MacBook Pro 16-inch with M3 Pro chip, Liquid Retina XDR display, all-day battery.',
        brand: 'Apple',
        category: cat('Laptops'),
        images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80'],
        specifications: { display: '16.2 inch Liquid Retina XDR', ram: '18GB', storage: '512GB SSD', chip: 'Apple M3 Pro', battery: '22 hours' },
        rating: 4.9, reviewCount: 980,
      },
      {
        name: 'MSI Stealth 16',
        slug: 'msi-stealth-16',
        description: 'MSI Stealth 16 gaming ultrabook with Intel Core i7, RTX 4070, sleek all-metal chassis.',
        brand: 'MSI',
        category: cat('Laptops'),
        images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80'],
        specifications: { display: '16 inch QHD+ 240Hz', ram: '32GB', storage: '1TB SSD', processor: 'Intel Core i7', gpu: 'RTX 4070' },
        rating: 4.5, reviewCount: 180,
      },
      {
        name: 'Dell Inspiron 14',
        slug: 'dell-inspiron-14',
        description: 'Dell Inspiron 14 everyday laptop with Intel Core i5, compact and reliable for daily use.',
        brand: 'Dell',
        category: cat('Laptops'),
        images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80'],
        specifications: { display: '14 inch FHD', ram: '8GB', storage: '512GB SSD', processor: 'Intel Core i5', battery: '10 hours' },
        rating: 4.2, reviewCount: 540,
      },
      {
        name: 'ASUS Zenbook 14 OLED',
        slug: 'asus-zenbook-14-oled',
        description: 'ASUS Zenbook 14 OLED with Intel Core Ultra, 2.8K OLED display, ultra-portable design.',
        brand: 'ASUS',
        category: cat('Laptops'),
        images: ['https://images.unsplash.com/photo-1523475496153-3d6cc0f0bf19?w=600&q=80'],
        specifications: { display: '14 inch 2.8K OLED', ram: '16GB', storage: '1TB SSD', processor: 'Intel Core Ultra 5', weight: '1.2 kg' },
        rating: 4.6, reviewCount: 310,
      },

      // ===== New: Audio (7) =====
      {
        name: 'Bose QuietComfort Ultra',
        slug: 'bose-quietcomfort-ultra',
        description: 'Bose QuietComfort Ultra headphones with immersive spatial audio and best-in-class noise cancellation.',
        brand: 'Bose',
        category: cat('Audio'),
        images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80'],
        specifications: { type: 'Over-ear', batteryLife: '24 hours', noiseCancelling: 'Yes', spatialAudio: 'Yes', weight: '254g' },
        rating: 4.7, reviewCount: 1580,
      },
      {
        name: 'JBL Flip 6',
        slug: 'jbl-flip-6',
        description: 'JBL Flip 6 portable Bluetooth speaker with punchy sound and IP67 waterproof rating.',
        brand: 'JBL',
        category: cat('Audio'),
        images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80'],
        specifications: { type: 'Portable Speaker', batteryLife: '12 hours', waterResistance: 'IP67', connectivity: 'Bluetooth 5.1', weight: '550g' },
        rating: 4.6, reviewCount: 3400,
      },
      {
        name: 'Samsung Galaxy Buds2 Pro',
        slug: 'samsung-galaxy-buds2-pro',
        description: 'Samsung Galaxy Buds2 Pro true wireless earbuds with 24-bit Hi-Fi audio and ANC.',
        brand: 'Samsung',
        category: cat('Audio'),
        images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80'],
        specifications: { type: 'In-ear', batteryLife: '5 hours (18 with case)', noiseCancelling: 'Yes', audio: '24-bit Hi-Fi', waterResistance: 'IPX7' },
        rating: 4.5, reviewCount: 1620,
      },
      {
        name: 'Sennheiser Momentum 4',
        slug: 'sennheiser-momentum-4',
        description: 'Sennheiser Momentum 4 Wireless with 60-hour battery life and adaptive noise cancellation.',
        brand: 'Sennheiser',
        category: cat('Audio'),
        images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80'],
        specifications: { type: 'Over-ear', batteryLife: '60 hours', noiseCancelling: 'Yes', connectivity: 'Bluetooth 5.2', weight: '293g' },
        rating: 4.7, reviewCount: 960,
      },
      {
        name: 'Marshall Emberton II',
        slug: 'marshall-emberton-ii',
        description: 'Marshall Emberton II portable speaker with iconic design and 360-degree sound.',
        brand: 'Marshall',
        category: cat('Audio'),
        images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80'],
        specifications: { type: 'Portable Speaker', batteryLife: '30 hours', waterResistance: 'IP67', connectivity: 'Bluetooth 5.1', weight: '700g' },
        rating: 4.6, reviewCount: 1150,
      },
      {
        name: 'Boat Rockerz 550',
        slug: 'boat-rockerz-550',
        description: 'Boat Rockerz 550 over-ear wireless headphones with 20-hour playback and punchy bass.',
        brand: 'Boat',
        category: cat('Audio'),
        images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80'],
        specifications: { type: 'Over-ear', batteryLife: '20 hours', noiseCancelling: 'No', connectivity: 'Bluetooth 5.0', weight: '220g' },
        rating: 4.2, reviewCount: 8900,
      },
      {
        name: 'Jabra Elite 10',
        slug: 'jabra-elite-10',
        description: 'Jabra Elite 10 true wireless earbuds with Dolby Atmos spatial sound and advanced ANC.',
        brand: 'Jabra',
        category: cat('Audio'),
        images: ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80'],
        specifications: { type: 'In-ear', batteryLife: '6 hours (27 with case)', noiseCancelling: 'Yes', audio: 'Dolby Atmos', waterResistance: 'IP57' },
        rating: 4.5, reviewCount: 740,
      },

      // ===== New: Tablets (5) =====
      {
        name: 'Apple iPad Air 5',
        slug: 'apple-ipad-air-5',
        description: 'Apple iPad Air with M1 chip, 10.9-inch Liquid Retina display, support for Apple Pencil 2.',
        brand: 'Apple',
        category: cat('Tablets'),
        images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80'],
        specifications: { display: '10.9 inch Liquid Retina', storage: '64GB', chip: 'Apple M1', camera: '12MP', connectivity: 'Wi-Fi' },
        rating: 4.7, reviewCount: 1780,
      },
      {
        name: 'Lenovo Tab P12',
        slug: 'lenovo-tab-p12',
        description: 'Lenovo Tab P12 with 12.7-inch 2.5K display, quad speakers, and large battery.',
        brand: 'Lenovo',
        category: cat('Tablets'),
        images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80'],
        specifications: { display: '12.7 inch 2.5K', storage: '128GB', chip: 'MediaTek Kompanio 838', camera: '13MP', battery: '10200 mAh' },
        rating: 4.3, reviewCount: 320,
      },
      {
        name: 'Xiaomi Pad 6',
        slug: 'xiaomi-pad-6',
        description: 'Xiaomi Pad 6 with Snapdragon 870, 144Hz display, great value flagship tablet.',
        brand: 'Xiaomi',
        category: cat('Tablets'),
        images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80'],
        specifications: { display: '11 inch 144Hz LCD', storage: '128GB', chip: 'Snapdragon 870', camera: '13MP', battery: '8840 mAh' },
        rating: 4.4, reviewCount: 610,
      },
      {
        name: 'Microsoft Surface Pro 9',
        slug: 'microsoft-surface-pro-9',
        description: 'Microsoft Surface Pro 9 2-in-1 tablet with Intel Core i7, laptop-class performance.',
        brand: 'Microsoft',
        category: cat('Tablets'),
        images: ['https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&q=80'],
        specifications: { display: '13 inch PixelSense', storage: '256GB', processor: 'Intel Core i7', camera: '10MP', connectivity: 'Wi-Fi 6E' },
        rating: 4.5, reviewCount: 450,
      },
      {
        name: 'Amazon Fire HD 10',
        slug: 'amazon-fire-hd-10',
        description: 'Amazon Fire HD 10 budget tablet with Full HD display and hands-free Alexa.',
        brand: 'Amazon',
        category: cat('Tablets'),
        images: ['https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=600&q=80'],
        specifications: { display: '10.1 inch Full HD', storage: '32GB', chip: 'Octa-core 2.0GHz', camera: '5MP', battery: '12 hours' },
        rating: 4.1, reviewCount: 5200,
      },

      // ===== New: Cameras (5) =====
      {
        name: 'Canon EOS R6 Mark II',
        slug: 'canon-eos-r6-mark-ii',
        description: 'Canon EOS R6 Mark II full-frame mirrorless camera with 24.2MP sensor and 40fps burst.',
        brand: 'Canon',
        category: cat('Cameras'),
        images: ['https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80'],
        specifications: { sensor: '24.2MP Full-Frame', video: '4K 60p', autofocus: 'Dual Pixel CMOS AF II', stabilization: '5-axis IBIS', mount: 'Canon RF' },
        rating: 4.8, reviewCount: 640,
      },
      {
        name: 'Nikon Z6 III',
        slug: 'nikon-z6-iii',
        description: 'Nikon Z6 III full-frame mirrorless camera with partially stacked sensor for fast readout.',
        brand: 'Nikon',
        category: cat('Cameras'),
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80'],
        specifications: { sensor: '24.5MP Full-Frame', video: '6K RAW', autofocus: '299-point AF', stabilization: '5-axis IBIS', mount: 'Nikon Z' },
        rating: 4.7, reviewCount: 280,
      },
      {
        name: 'Fujifilm X-T5',
        slug: 'fujifilm-x-t5',
        description: 'Fujifilm X-T5 APS-C mirrorless camera with 40MP sensor and classic dial-based controls.',
        brand: 'Fujifilm',
        category: cat('Cameras'),
        images: ['https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=600&q=80'],
        specifications: { sensor: '40.2MP APS-C', video: '6.2K', autofocus: '425-point AF', stabilization: '5-axis IBIS', mount: 'Fujifilm X' },
        rating: 4.8, reviewCount: 390,
      },
      {
        name: 'GoPro Hero 12 Black',
        slug: 'gopro-hero-12-black',
        description: 'GoPro Hero 12 Black action camera with HyperSmooth 6.0 stabilization and 5.3K video.',
        brand: 'GoPro',
        category: cat('Cameras'),
        images: ['https://images.unsplash.com/photo-1526040652367-ac003a0475fe?w=600&q=80'],
        specifications: { sensor: '1/1.9 inch', video: '5.3K60', stabilization: 'HyperSmooth 6.0', waterproof: '10m', battery: '1720 mAh' },
        rating: 4.6, reviewCount: 1230,
      },
      {
        name: 'DJI Osmo Pocket 3',
        slug: 'dji-osmo-pocket-3',
        description: 'DJI Osmo Pocket 3 gimbal camera with 1-inch sensor and rotatable touchscreen.',
        brand: 'DJI',
        category: cat('Cameras'),
        images: ['https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=600&q=80'],
        specifications: { sensor: '1 inch', video: '4K120', stabilization: '3-axis Gimbal', screen: 'Rotatable Touch', battery: '1300 mAh' },
        rating: 4.7, reviewCount: 510,
      },

      // ===== New: Wearables (5) =====
      {
        name: 'Fitbit Charge 6',
        slug: 'fitbit-charge-6',
        description: 'Fitbit Charge 6 fitness tracker with built-in GPS, heart rate, and Google apps integration.',
        brand: 'Fitbit',
        category: cat('Wearables'),
        images: ['https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=600&q=80'],
        specifications: { display: 'AMOLED', gps: 'Built-in', health: 'Heart Rate, SpO2', battery: '7 days', waterResistance: '50m' },
        rating: 4.4, reviewCount: 2340,
      },
      {
        name: 'Garmin Venu 3',
        slug: 'garmin-venu-3',
        description: 'Garmin Venu 3 smartwatch with advanced health monitoring and up to 14-day battery.',
        brand: 'Garmin',
        category: cat('Wearables'),
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
        specifications: { display: 'AMOLED', gps: 'Built-in', health: 'Sleep Coach, HRV', battery: '14 days', waterResistance: '5 ATM' },
        rating: 4.7, reviewCount: 890,
      },
      {
        name: 'Amazfit GTR 4',
        slug: 'amazfit-gtr-4',
        description: 'Amazfit GTR 4 smartwatch with dual-band GPS, Alexa built-in, and long battery life.',
        brand: 'Amazfit',
        category: cat('Wearables'),
        images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80'],
        specifications: { display: 'AMOLED', gps: 'Dual-band', health: '150+ Sports Modes', battery: '14 days', waterResistance: '5 ATM' },
        rating: 4.3, reviewCount: 670,
      },
      {
        name: 'OnePlus Watch 2',
        slug: 'oneplus-watch-2',
        description: 'OnePlus Watch 2 with dual-engine architecture, Wear OS, and 100-hour battery life.',
        brand: 'OnePlus',
        category: cat('Wearables'),
        images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80'],
        specifications: { display: 'AMOLED', os: 'Wear OS 4', health: 'Heart Rate, SpO2', battery: '100 hours', waterResistance: '5 ATM' },
        rating: 4.4, reviewCount: 320,
      },
      {
        name: 'Noise ColorFit Pro 4',
        slug: 'noise-colorfit-pro-4',
        description: 'Noise ColorFit Pro 4 budget smartwatch with Bluetooth calling and AMOLED display.',
        brand: 'Noise',
        category: cat('Wearables'),
        images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80'],
        specifications: { display: 'AMOLED', calling: 'Bluetooth Calling', health: 'Heart Rate, SpO2', battery: '7 days', waterResistance: 'IP68' },
        rating: 4.0, reviewCount: 4100,
      },
    ]);
    console.log(`${products.length} products created.`);

    const amazon = stores.find((s) => s.name === 'Amazon');
    const flipkart = stores.find((s) => s.name === 'Flipkart');
    const croma = stores.find((s) => s.name === 'Croma');
    const reliance = stores.find((s) => s.name === 'Reliance Digital');

    const p = (slug) => products.find((x) => x.slug === slug)._id;

    // ---------- PRICE DATA ----------
    const priceData = [
      // ===== Original 12 (unchanged) =====
      { productId: p('iphone-15-pro'), storeId: amazon._id, originalPrice: 134900, currentPrice: 119900, discount: 11, productUrl: 'https://www.amazon.in' },
      { productId: p('iphone-15-pro'), storeId: flipkart._id, originalPrice: 134900, currentPrice: 117999, discount: 13, productUrl: 'https://www.flipkart.com' },
      { productId: p('iphone-15-pro'), storeId: croma._id, originalPrice: 134900, currentPrice: 122900, discount: 9, productUrl: 'https://www.croma.com' },
      { productId: p('samsung-galaxy-s24-ultra'), storeId: amazon._id, originalPrice: 129999, currentPrice: 114999, discount: 12, productUrl: 'https://www.amazon.in' },
      { productId: p('samsung-galaxy-s24-ultra'), storeId: flipkart._id, originalPrice: 129999, currentPrice: 112999, discount: 13, productUrl: 'https://www.flipkart.com' },
      { productId: p('samsung-galaxy-s24-ultra'), storeId: reliance._id, originalPrice: 129999, currentPrice: 118999, discount: 8, productUrl: 'https://www.reliancedigital.in' },
      { productId: p('oneplus-12'), storeId: amazon._id, originalPrice: 64999, currentPrice: 57999, discount: 11, productUrl: 'https://www.amazon.in' },
      { productId: p('oneplus-12'), storeId: flipkart._id, originalPrice: 64999, currentPrice: 59999, discount: 8, productUrl: 'https://www.flipkart.com' },
      { productId: p('macbook-air-m3'), storeId: amazon._id, originalPrice: 149900, currentPrice: 134900, discount: 10, productUrl: 'https://www.amazon.in' },
      { productId: p('macbook-air-m3'), storeId: croma._id, originalPrice: 149900, currentPrice: 139900, discount: 7, productUrl: 'https://www.croma.com' },
      { productId: p('macbook-air-m3'), storeId: reliance._id, originalPrice: 149900, currentPrice: 137900, discount: 8, productUrl: 'https://www.reliancedigital.in' },
      { productId: p('dell-xps-15'), storeId: amazon._id, originalPrice: 199990, currentPrice: 179990, discount: 10, productUrl: 'https://www.amazon.in' },
      { productId: p('dell-xps-15'), storeId: croma._id, originalPrice: 199990, currentPrice: 189990, discount: 5, productUrl: 'https://www.croma.com' },
      { productId: p('sony-wh-1000xm5'), storeId: amazon._id, originalPrice: 34990, currentPrice: 24990, discount: 29, productUrl: 'https://www.amazon.in' },
      { productId: p('sony-wh-1000xm5'), storeId: flipkart._id, originalPrice: 34990, currentPrice: 25990, discount: 26, productUrl: 'https://www.flipkart.com' },
      { productId: p('sony-wh-1000xm5'), storeId: croma._id, originalPrice: 34990, currentPrice: 27990, discount: 20, productUrl: 'https://www.croma.com' },
      { productId: p('airpods-pro-2'), storeId: amazon._id, originalPrice: 24900, currentPrice: 19900, discount: 20, productUrl: 'https://www.amazon.in' },
      { productId: p('airpods-pro-2'), storeId: flipkart._id, originalPrice: 24900, currentPrice: 20900, discount: 16, productUrl: 'https://www.flipkart.com' },
      { productId: p('ipad-pro-m4'), storeId: amazon._id, originalPrice: 99900, currentPrice: 89900, discount: 10, productUrl: 'https://www.amazon.in' },
      { productId: p('ipad-pro-m4'), storeId: croma._id, originalPrice: 99900, currentPrice: 94900, discount: 5, productUrl: 'https://www.croma.com' },
      { productId: p('samsung-galaxy-tab-s9'), storeId: amazon._id, originalPrice: 72999, currentPrice: 62999, discount: 14, productUrl: 'https://www.amazon.in' },
      { productId: p('samsung-galaxy-tab-s9'), storeId: flipkart._id, originalPrice: 72999, currentPrice: 64999, discount: 11, productUrl: 'https://www.flipkart.com' },
      { productId: p('sony-alpha-a7-iv'), storeId: amazon._id, originalPrice: 259990, currentPrice: 229990, discount: 12, productUrl: 'https://www.amazon.in' },
      { productId: p('sony-alpha-a7-iv'), storeId: croma._id, originalPrice: 259990, currentPrice: 239990, discount: 8, productUrl: 'https://www.croma.com' },
      { productId: p('apple-watch-series-9'), storeId: amazon._id, originalPrice: 41900, currentPrice: 35900, discount: 14, productUrl: 'https://www.amazon.in' },
      { productId: p('apple-watch-series-9'), storeId: flipkart._id, originalPrice: 41900, currentPrice: 36900, discount: 12, productUrl: 'https://www.flipkart.com' },
      { productId: p('apple-watch-series-9'), storeId: croma._id, originalPrice: 41900, currentPrice: 38900, discount: 7, productUrl: 'https://www.croma.com' },
      { productId: p('samsung-galaxy-watch-6'), storeId: amazon._id, originalPrice: 29999, currentPrice: 22999, discount: 23, productUrl: 'https://www.amazon.in' },
      { productId: p('samsung-galaxy-watch-6'), storeId: flipkart._id, originalPrice: 29999, currentPrice: 23999, discount: 20, productUrl: 'https://www.flipkart.com' },

      // ===== New product prices =====
      { productId: p('google-pixel-8-pro'), storeId: amazon._id, originalPrice: 106999, currentPrice: 91999, discount: 14, productUrl: 'https://www.amazon.in' },
      { productId: p('google-pixel-8-pro'), storeId: flipkart._id, originalPrice: 106999, currentPrice: 89999, discount: 16, productUrl: 'https://www.flipkart.com' },

      { productId: p('xiaomi-14-ultra'), storeId: amazon._id, originalPrice: 99999, currentPrice: 89999, discount: 10, productUrl: 'https://www.amazon.in' },
      { productId: p('xiaomi-14-ultra'), storeId: flipkart._id, originalPrice: 99999, currentPrice: 87999, discount: 12, productUrl: 'https://www.flipkart.com' },

      { productId: p('iphone-15'), storeId: amazon._id, originalPrice: 79900, currentPrice: 69900, discount: 13, productUrl: 'https://www.amazon.in' },
      { productId: p('iphone-15'), storeId: flipkart._id, originalPrice: 79900, currentPrice: 68900, discount: 14, productUrl: 'https://www.flipkart.com' },
      { productId: p('iphone-15'), storeId: croma._id, originalPrice: 79900, currentPrice: 72900, discount: 9, productUrl: 'https://www.croma.com' },

      { productId: p('samsung-galaxy-s24'), storeId: amazon._id, originalPrice: 79999, currentPrice: 69999, discount: 12, productUrl: 'https://www.amazon.in' },
      { productId: p('samsung-galaxy-s24'), storeId: reliance._id, originalPrice: 79999, currentPrice: 71999, discount: 10, productUrl: 'https://www.reliancedigital.in' },

      { productId: p('oneplus-nord-3'), storeId: amazon._id, originalPrice: 33999, currentPrice: 27999, discount: 18, productUrl: 'https://www.amazon.in' },
      { productId: p('oneplus-nord-3'), storeId: flipkart._id, originalPrice: 33999, currentPrice: 26999, discount: 21, productUrl: 'https://www.flipkart.com' },

      { productId: p('vivo-x100-pro'), storeId: amazon._id, originalPrice: 89999, currentPrice: 79999, discount: 11, productUrl: 'https://www.amazon.in' },
      { productId: p('vivo-x100-pro'), storeId: flipkart._id, originalPrice: 89999, currentPrice: 77999, discount: 13, productUrl: 'https://www.flipkart.com' },

      { productId: p('nothing-phone-2'), storeId: amazon._id, originalPrice: 44999, currentPrice: 36999, discount: 18, productUrl: 'https://www.amazon.in' },
      { productId: p('nothing-phone-2'), storeId: flipkart._id, originalPrice: 44999, currentPrice: 35999, discount: 20, productUrl: 'https://www.flipkart.com' },

      { productId: p('hp-spectre-x360'), storeId: amazon._id, originalPrice: 154999, currentPrice: 134999, discount: 13, productUrl: 'https://www.amazon.in' },
      { productId: p('hp-spectre-x360'), storeId: croma._id, originalPrice: 154999, currentPrice: 141999, discount: 8, productUrl: 'https://www.croma.com' },

      { productId: p('lenovo-thinkpad-x1-carbon'), storeId: amazon._id, originalPrice: 169999, currentPrice: 149999, discount: 12, productUrl: 'https://www.amazon.in' },
      { productId: p('lenovo-thinkpad-x1-carbon'), storeId: reliance._id, originalPrice: 169999, currentPrice: 154999, discount: 9, productUrl: 'https://www.reliancedigital.in' },

      { productId: p('asus-rog-zephyrus-g14'), storeId: amazon._id, originalPrice: 184999, currentPrice: 164999, discount: 11, productUrl: 'https://www.amazon.in' },
      { productId: p('asus-rog-zephyrus-g14'), storeId: flipkart._id, originalPrice: 184999, currentPrice: 161999, discount: 12, productUrl: 'https://www.flipkart.com' },

      { productId: p('microsoft-surface-laptop-6'), storeId: amazon._id, originalPrice: 139999, currentPrice: 124999, discount: 11, productUrl: 'https://www.amazon.in' },
      { productId: p('microsoft-surface-laptop-6'), storeId: croma._id, originalPrice: 139999, currentPrice: 129999, discount: 7, productUrl: 'https://www.croma.com' },

      { productId: p('acer-predator-helios-neo-16'), storeId: amazon._id, originalPrice: 149999, currentPrice: 129999, discount: 13, productUrl: 'https://www.amazon.in' },
      { productId: p('acer-predator-helios-neo-16'), storeId: flipkart._id, originalPrice: 149999, currentPrice: 127999, discount: 15, productUrl: 'https://www.flipkart.com' },

      { productId: p('macbook-pro-16-m3'), storeId: amazon._id, originalPrice: 249900, currentPrice: 229900, discount: 8, productUrl: 'https://www.amazon.in' },
      { productId: p('macbook-pro-16-m3'), storeId: reliance._id, originalPrice: 249900, currentPrice: 234900, discount: 6, productUrl: 'https://www.reliancedigital.in' },

      { productId: p('msi-stealth-16'), storeId: amazon._id, originalPrice: 199999, currentPrice: 174999, discount: 13, productUrl: 'https://www.amazon.in' },
      { productId: p('msi-stealth-16'), storeId: croma._id, originalPrice: 199999, currentPrice: 179999, discount: 10, productUrl: 'https://www.croma.com' },

      { productId: p('dell-inspiron-14'), storeId: amazon._id, originalPrice: 54999, currentPrice: 44999, discount: 18, productUrl: 'https://www.amazon.in' },
      { productId: p('dell-inspiron-14'), storeId: flipkart._id, originalPrice: 54999, currentPrice: 43999, discount: 20, productUrl: 'https://www.flipkart.com' },

      { productId: p('asus-zenbook-14-oled'), storeId: amazon._id, originalPrice: 89999, currentPrice: 76999, discount: 14, productUrl: 'https://www.amazon.in' },
      { productId: p('asus-zenbook-14-oled'), storeId: flipkart._id, originalPrice: 89999, currentPrice: 74999, discount: 17, productUrl: 'https://www.flipkart.com' },

      { productId: p('bose-quietcomfort-ultra'), storeId: amazon._id, originalPrice: 34900, currentPrice: 28900, discount: 17, productUrl: 'https://www.amazon.in' },
      { productId: p('bose-quietcomfort-ultra'), storeId: croma._id, originalPrice: 34900, currentPrice: 30900, discount: 11, productUrl: 'https://www.croma.com' },

      { productId: p('jbl-flip-6'), storeId: amazon._id, originalPrice: 11999, currentPrice: 8999, discount: 25, productUrl: 'https://www.amazon.in' },
      { productId: p('jbl-flip-6'), storeId: flipkart._id, originalPrice: 11999, currentPrice: 8499, discount: 29, productUrl: 'https://www.flipkart.com' },

      { productId: p('samsung-galaxy-buds2-pro'), storeId: amazon._id, originalPrice: 17999, currentPrice: 13999, discount: 22, productUrl: 'https://www.amazon.in' },
      { productId: p('samsung-galaxy-buds2-pro'), storeId: reliance._id, originalPrice: 17999, currentPrice: 14999, discount: 17, productUrl: 'https://www.reliancedigital.in' },

      { productId: p('sennheiser-momentum-4'), storeId: amazon._id, originalPrice: 34990, currentPrice: 27990, discount: 20, productUrl: 'https://www.amazon.in' },
      { productId: p('sennheiser-momentum-4'), storeId: croma._id, originalPrice: 34990, currentPrice: 29990, discount: 14, productUrl: 'https://www.croma.com' },

      { productId: p('marshall-emberton-ii'), storeId: amazon._id, originalPrice: 14999, currentPrice: 11999, discount: 20, productUrl: 'https://www.amazon.in' },
      { productId: p('marshall-emberton-ii'), storeId: flipkart._id, originalPrice: 14999, currentPrice: 11499, discount: 23, productUrl: 'https://www.flipkart.com' },

      { productId: p('boat-rockerz-550'), storeId: amazon._id, originalPrice: 2999, currentPrice: 1499, discount: 50, productUrl: 'https://www.amazon.in' },
      { productId: p('boat-rockerz-550'), storeId: flipkart._id, originalPrice: 2999, currentPrice: 1399, discount: 53, productUrl: 'https://www.flipkart.com' },

      { productId: p('jabra-elite-10'), storeId: amazon._id, originalPrice: 19999, currentPrice: 15999, discount: 20, productUrl: 'https://www.amazon.in' },
      { productId: p('jabra-elite-10'), storeId: flipkart._id, originalPrice: 19999, currentPrice: 15499, discount: 22, productUrl: 'https://www.flipkart.com' },

      { productId: p('apple-ipad-air-5'), storeId: amazon._id, originalPrice: 59900, currentPrice: 52900, discount: 12, productUrl: 'https://www.amazon.in' },
      { productId: p('apple-ipad-air-5'), storeId: croma._id, originalPrice: 59900, currentPrice: 54900, discount: 8, productUrl: 'https://www.croma.com' },

      { productId: p('lenovo-tab-p12'), storeId: amazon._id, originalPrice: 34999, currentPrice: 28999, discount: 17, productUrl: 'https://www.amazon.in' },
      { productId: p('lenovo-tab-p12'), storeId: flipkart._id, originalPrice: 34999, currentPrice: 27999, discount: 20, productUrl: 'https://www.flipkart.com' },

      { productId: p('xiaomi-pad-6'), storeId: amazon._id, originalPrice: 26999, currentPrice: 21999, discount: 19, productUrl: 'https://www.amazon.in' },
      { productId: p('xiaomi-pad-6'), storeId: flipkart._id, originalPrice: 26999, currentPrice: 20999, discount: 22, productUrl: 'https://www.flipkart.com' },

      { productId: p('microsoft-surface-pro-9'), storeId: amazon._id, originalPrice: 99999, currentPrice: 87999, discount: 12, productUrl: 'https://www.amazon.in' },
      { productId: p('microsoft-surface-pro-9'), storeId: reliance._id, originalPrice: 99999, currentPrice: 91999, discount: 8, productUrl: 'https://www.reliancedigital.in' },

      { productId: p('amazon-fire-hd-10'), storeId: amazon._id, originalPrice: 15999, currentPrice: 10999, discount: 31, productUrl: 'https://www.amazon.in' },
      { productId: p('amazon-fire-hd-10'), storeId: flipkart._id, originalPrice: 15999, currentPrice: 11499, discount: 28, productUrl: 'https://www.flipkart.com' },

      { productId: p('canon-eos-r6-mark-ii'), storeId: amazon._id, originalPrice: 259995, currentPrice: 234995, discount: 10, productUrl: 'https://www.amazon.in' },
      { productId: p('canon-eos-r6-mark-ii'), storeId: croma._id, originalPrice: 259995, currentPrice: 244995, discount: 6, productUrl: 'https://www.croma.com' },

      { productId: p('nikon-z6-iii'), storeId: amazon._id, originalPrice: 249995, currentPrice: 227995, discount: 9, productUrl: 'https://www.amazon.in' },
      { productId: p('nikon-z6-iii'), storeId: croma._id, originalPrice: 249995, currentPrice: 234995, discount: 6, productUrl: 'https://www.croma.com' },

      { productId: p('fujifilm-x-t5'), storeId: amazon._id, originalPrice: 169999, currentPrice: 149999, discount: 12, productUrl: 'https://www.amazon.in' },
      { productId: p('fujifilm-x-t5'), storeId: flipkart._id, originalPrice: 169999, currentPrice: 147999, discount: 13, productUrl: 'https://www.flipkart.com' },

      { productId: p('gopro-hero-12-black'), storeId: amazon._id, originalPrice: 44500, currentPrice: 36500, discount: 18, productUrl: 'https://www.amazon.in' },
      { productId: p('gopro-hero-12-black'), storeId: flipkart._id, originalPrice: 44500, currentPrice: 35500, discount: 20, productUrl: 'https://www.flipkart.com' },

      { productId: p('dji-osmo-pocket-3'), storeId: amazon._id, originalPrice: 53999, currentPrice: 48999, discount: 9, productUrl: 'https://www.amazon.in' },
      { productId: p('dji-osmo-pocket-3'), storeId: croma._id, originalPrice: 53999, currentPrice: 50999, discount: 6, productUrl: 'https://www.croma.com' },

      { productId: p('fitbit-charge-6'), storeId: amazon._id, originalPrice: 15999, currentPrice: 11999, discount: 25, productUrl: 'https://www.amazon.in' },
      { productId: p('fitbit-charge-6'), storeId: flipkart._id, originalPrice: 15999, currentPrice: 11499, discount: 28, productUrl: 'https://www.flipkart.com' },

      { productId: p('garmin-venu-3'), storeId: amazon._id, originalPrice: 49990, currentPrice: 42990, discount: 14, productUrl: 'https://www.amazon.in' },
      { productId: p('garmin-venu-3'), storeId: reliance._id, originalPrice: 49990, currentPrice: 44990, discount: 10, productUrl: 'https://www.reliancedigital.in' },

      { productId: p('amazfit-gtr-4'), storeId: amazon._id, originalPrice: 16999, currentPrice: 12999, discount: 24, productUrl: 'https://www.amazon.in' },
      { productId: p('amazfit-gtr-4'), storeId: flipkart._id, originalPrice: 16999, currentPrice: 12499, discount: 27, productUrl: 'https://www.flipkart.com' },

      { productId: p('oneplus-watch-2'), storeId: amazon._id, originalPrice: 24999, currentPrice: 19999, discount: 20, productUrl: 'https://www.amazon.in' },
      { productId: p('oneplus-watch-2'), storeId: flipkart._id, originalPrice: 24999, currentPrice: 19499, discount: 22, productUrl: 'https://www.flipkart.com' },

      { productId: p('noise-colorfit-pro-4'), storeId: amazon._id, originalPrice: 4999, currentPrice: 2999, discount: 40, productUrl: 'https://www.amazon.in' },
      { productId: p('noise-colorfit-pro-4'), storeId: flipkart._id, originalPrice: 4999, currentPrice: 2799, discount: 44, productUrl: 'https://www.flipkart.com' },
    ];

    const prices = await ProductPrice.insertMany(priceData);
    console.log(`${prices.length} price records created.`);

    // Price history (last 30 days)
    const historyDocs = [];
    for (const pd of priceData) {
      for (let i = 30; i >= 0; i -= 3) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const fluctuation = Math.round((Math.random() - 0.5) * pd.currentPrice * 0.08);
        historyDocs.push({
          productId: pd.productId,
          storeId: pd.storeId,
          price: Math.max(pd.currentPrice + fluctuation, pd.currentPrice * 0.85),
          recordedAt: date,
        });
      }
    }
    await PriceHistory.insertMany(historyDocs);
    console.log(`${historyDocs.length} price history records created.`);

    console.log('\n✅ Seed complete!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin  → email: admin@pricora.com | password: admin123');
    console.log('User   → email: user@pricora.com  | password: user123');
    console.log(`Products: ${products.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();