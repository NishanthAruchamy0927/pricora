import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAlerts, deleteAlert } from '../api/alertApi';
import './Alerts.css';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAlerts();
      setAlerts(res.data.alerts);
    } catch (err) {
      console.error('Failed to load alerts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    await deleteAlert(id);
    load();
  };

  if (loading) return <div className="alerts-page"><div className="alerts-loading">⏳ Loading alerts...</div></div>;

  return (
    <div className="alerts-page">
      <h2 className="page-title">🔔 My Price Alerts</h2>
      <p className="page-subtitle">{alerts.length} active alert{alerts.length !== 1 ? 's' : ''}</p>

      {alerts.length === 0 ? (
        <div className="alerts-empty">
          <div className="empty-icon">🔔</div>
          <h3>No price alerts yet</h3>
          <p>Set a target price on any product and we'll notify you when it drops.</p>
          <Link to="/">Browse Products</Link>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div key={alert._id} className="alert-item">
              <img
                className="alert-item-img"
                src={alert.productId?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80'}
                alt={alert.productId?.name}
              />
              <div className="alert-info">
                <Link to={`/product/${alert.productId?._id}`}>{alert.productId?.name}</Link>
                <div className="alert-prices">
                  <span className="alert-target">🎯 Target: ₹{alert.targetPrice.toLocaleString()}</span>
                  <span className="alert-current">Current: ₹{alert.currentPrice.toLocaleString()}</span>
                </div>
              </div>
              <span className={`alert-status ${alert.status}`}>
                {alert.status === 'triggered' ? '✅ Triggered!' : '👁 Watching'}
              </span>
              <button className="alert-delete" onClick={() => handleDelete(alert._id)}>🗑 Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
