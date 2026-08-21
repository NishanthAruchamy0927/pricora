import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../api/wishlistApi';
import './Wishlist.css';

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getWishlist();
      setItems(res.data.wishlist);
    } catch (err) {
      console.error('Failed to load wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
    load();
  };

  if (loading) return <div className="wishlist-page"><div className="wishlist-loading">⏳ Loading wishlist...</div></div>;

  return (
    <div className="wishlist-page">
      <h2 className="page-title">♡ My Wishlist</h2>
      <p className="page-subtitle">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>

      {items.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-icon">🛍️</div>
          <h3>Your wishlist is empty</h3>
          <p>Save products you love and track their prices.</p>
          <Link to="/">Browse Products</Link>
        </div>
      ) : (
        <div className="wishlist-list">
          {items.map((item) => (
            <div key={item._id} className="wishlist-item">
              <img
                className="wishlist-item-img"
                src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'}
                alt={item.product.name}
              />
              <div className="wishlist-item-info">
                <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                <span className="wishlist-item-brand">{item.product.brand}</span>
              </div>
              <div className="wishlist-item-price">
                {item.lowestPrice ? `₹${item.lowestPrice.toLocaleString()}` : 'Check price'}
              </div>
              <button className="wishlist-item-remove" onClick={() => handleRemove(item.product._id)}>
                🗑 Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
