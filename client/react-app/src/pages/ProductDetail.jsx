import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getProductPrices } from '../api/productApi';
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/wishlistApi';
import { createAlert } from '../api/alertApi';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [productRes, pricesRes] = await Promise.all([getProduct(id), getProductPrices(id)]);
        setProduct(productRes.data.product);
        setPriceData(pricesRes.data);
        setActiveImg(0);
        if (user) {
          const wishlistRes = await getWishlist();
          setInWishlist(wishlistRes.data.wishlist.some((item) => item.product._id === id));
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user]);

  const toggleWishlist = async () => {
    if (!user) return alert('Please log in to use wishlist.');
    try {
      if (inWishlist) { await removeFromWishlist(id); setInWishlist(false); }
      else { await addToWishlist(id); setInWishlist(true); }
    } catch (err) { console.error('Wishlist toggle failed', err); }
  };

  const handleSetAlert = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please log in to set a price alert.');
    try {
      await createAlert({ productId: id, targetPrice: Number(alertPrice) });
      setAlertMsg('✅ Price alert set! We\'ll notify you when the price drops.');
      setAlertPrice('');
    } catch (err) {
      setAlertMsg(err.response?.data?.message || 'Failed to set alert');
    }
  };

  if (loading) return <div className="product-detail-loading">⏳ Loading product details...</div>;
  if (!product) return <div className="product-detail-loading">Product not found.</div>;

  const images = product.images?.length ? product.images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'];

  return (
    <div className="product-detail">
      <div className="pd-breadcrumb">
        <Link to="/">Home</Link> › <Link to="/search">{product.category?.name}</Link> › {product.name}
      </div>

      <div className="pd-top">
        <div className="pd-image-wrapper">
          <div className="pd-image">
            <img src={images[activeImg]} alt={product.name} />
          </div>
          {images.length > 1 && (
            <div className="pd-thumbnails">
              {images.map((img, i) => (
                <div key={i} className={`pd-thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                  <img src={img} alt={`${product.name} ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          <span className="pd-brand">{product.brand}</span>
          <h1>{product.name}</h1>
          <div className="pd-rating">
            <span className="pd-rating-stars">{'★'.repeat(Math.round(product.rating || 0))}</span>
            <strong>{product.rating?.toFixed(1)}</strong>
            <span className="pd-rating-count">({(product.reviewCount || 0).toLocaleString()} reviews)</span>
          </div>
          <p className="pd-description">{product.description}</p>

          {priceData?.comparison && (
            <div className="pd-price-summary">
              <div>
                <span className="pd-label">Best Price Available</span>
                <span className="pd-amount">₹{priceData.comparison.lowest.toLocaleString()}</span>
                <span className="pd-savings">
                  💰 Save ₹{priceData.comparison.savings.toLocaleString()} ({priceData.comparison.savingsPercentage}% off)
                </span>
              </div>
              <a href={priceData.prices[0]?.productUrl} target="_blank" rel="noopener noreferrer" className="pd-buy-btn">
                🛒 Buy Now
              </a>
            </div>
          )}

          <div className="pd-actions">
            <button className={`pd-wishlist-btn ${inWishlist ? 'active' : ''}`} onClick={toggleWishlist}>
              {inWishlist ? '♥ In Wishlist' : '♡ Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section className="pd-section">
          <h2>📋 Specifications</h2>
          <div className="pd-specs">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="pd-spec-row">
                <span className="pd-spec-key">{key}</span>
                <span className="pd-spec-value">{String(value)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="pd-section">
        <h2>🏪 Price Comparison</h2>
        {priceData?.prices?.length > 0 ? (
          <div className="pd-comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Current Price</th>
                  <th>Original Price</th>
                  <th>Discount</th>
                  <th>Availability</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {priceData.prices.map((p) => (
                  <tr key={p._id} className={p.currentPrice === priceData.comparison.lowest ? 'best-row' : ''}>
                    <td className="store-name">{p.storeId?.name}</td>
                    <td className="price-cell">
                      ₹{p.currentPrice.toLocaleString()}
                      {p.currentPrice === priceData.comparison.lowest && <span className="best-badge">BEST</span>}
                    </td>
                    <td style={{ color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      ₹{p.originalPrice.toLocaleString()}
                    </td>
                    <td className="discount-cell">{p.discount}% off</td>
                    <td className={p.availability === 'in_stock' ? 'in-stock' : 'out-stock'}>
                      {p.availability === 'in_stock' ? '✓ In Stock' : '✗ Out of Stock'}
                    </td>
                    <td>
                      <a href={p.productUrl} target="_blank" rel="noopener noreferrer">View →</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No price data available for this product yet.</p>
        )}
      </section>

      <section className="pd-section">
        <h2>🔔 Set a Price Alert</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
          We'll email you when the price drops to your target.
        </p>
        <form className="pd-alert-form" onSubmit={handleSetAlert}>
          <input
            type="number"
            placeholder="Enter target price (₹)"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            required
          />
          <button type="submit">🔔 Notify Me</button>
        </form>
        {alertMsg && <p className="pd-alert-msg">{alertMsg}</p>}
      </section>
    </div>
  );
};

export default ProductDetail;
