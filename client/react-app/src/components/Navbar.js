import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">🏷️</span>
          Pricora
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products, brands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <nav className="navbar-links">
          {user ? (
            <>
              <Link to="/wishlist">♡ Wishlist</Link>
              <Link to="/alerts">🔔 Alerts</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="navbar-admin-link">⚙️ Admin</Link>
              )}
              <span className="navbar-user">Hi, {user.name.split(' ')[0]}</span>
              <button className="navbar-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="navbar-cta">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
