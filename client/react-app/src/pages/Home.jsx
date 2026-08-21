import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import './Home.css';
import HeroScene3D from '../components/HeroScene3D';

const CATEGORY_ICONS = {
  Mobiles: '📱', Laptops: '💻', Audio: '🎧', Tablets: '📟',
  Cameras: '📷', Wearables: '⌚', Fashion: '👗', Electronics: '🔌',
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts({ limit: 8, sort: 'rating' }),
          getCategories(),
        ]);
        setProducts(productsRes.data.products);
        setCategories(categoriesRes.data.categories);
      } catch (err) {
        console.error('Failed to load home page data', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <div className="home">
        {/* Hero */}
        <section className="hero">
  <div className="hero-3d-layer">
    <HeroScene3D />
  </div>
  <div className="hero-content">
    <div className="hero-badge">🏷️ India's #1 Price Comparison Platform</div>
    <h1>Compare Prices,<br /><span>Save More Money</span></h1>
    <p>Search thousands of products and compare prices across Amazon, Flipkart, Croma & more — all in one place.</p>
    <div className="hero-cta">
      <Link to="/search?q=iphone" className="btn-primary">🔍 Start Comparing</Link>
      <Link to="/search?q=deals" className="btn-secondary">🔥 Explore Deals</Link>
    </div>
    <div className="hero-stats">
      <div>
        <div className="hero-stat-value">50+</div>
        <div className="hero-stat-label">Products Listed</div>
      </div>
      <div>
        <div className="hero-stat-value">4</div>
        <div className="hero-stat-label">Stores Compared</div>
      </div>
      <div>
        <div className="hero-stat-value">₹30K+</div>
        <div className="hero-stat-label">Avg. Savings</div>
      </div>
    </div>
  </div>
</section>

{/* Categories */}
<section className="section">
  <div className="section-header">
    <h2>Browse Categories</h2>
    <Link to="/search">View all →</Link>
  </div>
  <div className="category-showcase">
    {categories.map((cat, i) => (
      <Link
        key={cat._id}
        to={`/search?category=${cat._id}`}
        className="category-card"
        style={{ animationDelay: `${i * 0.06}s` }}
      >
        <div className="category-card-glow" />
        <div className="category-card-icon">{CATEGORY_ICONS[cat.name] || '📦'}</div>
        <h3 className="category-card-name">{cat.name}</h3>
        <p className="category-card-desc">{cat.description}</p>
        <span className="category-card-arrow">Explore →</span>
      </Link>
    ))}
  </div>
</section>

        {/* Trending Products */}
        <section className="section">
          <div className="section-header">
            <h2>🔥 Trending Products</h2>
            <Link to="/search">See all →</Link>
          </div>
          {loading ? (
            <div className="skeleton-grid">
              {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="how-it-works">
          <h2>How Pricora Works</h2>
          <p>Three simple steps to find the best deal every time</p>
          <div className="steps">
            <div className="step">
              <div className="step-icon">🔍</div>
              <h3>Search Any Product</h3>
              <p>Type any product name, brand, or category. We'll find it across all major Indian stores instantly.</p>
            </div>
            <div className="step">
              <div className="step-icon">📊</div>
              <h3>Compare Prices</h3>
              <p>See real-time prices from Amazon, Flipkart, Croma, and Reliance Digital side by side.</p>
            </div>
            <div className="step">
              <div className="step-icon">💰</div>
              <h3>Save & Alert</h3>
              <p>Buy from the cheapest store, or set a price alert and we'll notify you when the price drops.</p>
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="brands-section">
          <h2>Top Brands We Track</h2>
          <div className="brands-grid">
            {['Apple', 'Samsung', 'Sony', 'Dell', 'OnePlus', 'Xiaomi', 'LG', 'Bose'].map((brand) => (
              <Link key={brand} to={`/search?q=${brand}`} className="brand-chip">{brand}</Link>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand">🏷️ Pricora</div>
              <p className="footer-desc">India's smartest price comparison platform. We help you find the best deals across all major online stores.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <Link to="/">Home</Link>
              <Link to="/search">Browse Products</Link>
              <Link to="/wishlist">My Wishlist</Link>
              <Link to="/alerts">Price Alerts</Link>
            </div>
            <div className="footer-col">
              <h4>Categories</h4>
              <Link to="/search?q=mobiles">Mobiles</Link>
              <Link to="/search?q=laptops">Laptops</Link>
              <Link to="/search?q=audio">Audio</Link>
              <Link to="/search?q=cameras">Cameras</Link>
            </div>
            <div className="footer-col">
              <h4>Account</h4>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
              <Link to="/alerts">My Alerts</Link>
              <Link to="/wishlist">Wishlist</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 Pricora. All rights reserved.</span>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
