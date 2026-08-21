import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(email, password);
      navigate(loggedUser.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    if (type === 'admin') { setEmail('admin@pricora.com'); setPassword('admin123'); }
    else { setEmail('user@pricora.com'); setPassword('user123'); }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">🏷️ Pricora</div>
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Log in to track prices and save your wishlist.</p>

        <div className="auth-demo">
          <strong>🎯 Demo Credentials</strong>
          <span
            style={{ cursor: 'pointer', marginRight: 12, textDecoration: 'underline' }}
            onClick={() => fillDemo('user')}
          >
            User: <code>user@pricora.com</code> / <code>user123</code>
          </span>
          <span
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => fillDemo('admin')}
          >
            Admin: <code>admin@pricora.com</code> / <code>admin123</code>
          </span>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login →'}
        </button>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up free</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
