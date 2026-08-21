import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats, getAdminUsers, toggleUser, deleteAdminUser,
  getAdminPrices, createAdminPrice, updateAdminPrice, deleteAdminPrice,
  createProduct, updateProduct, deleteProduct,
  createCategory, updateCategory, deleteCategory,
  createStore, updateStore, deleteStore,
} from '../api/adminApi';
import { getProducts, getCategories, getStores } from '../api/productApi';
import './Admin.css';

/* ─── tiny helpers ─── */
const EMPTY_PRODUCT  = { name:'', slug:'', brand:'', description:'', category:'', images:'', specifications:'' };
const EMPTY_CATEGORY = { name:'', description:'', status:'active' };
const EMPTY_STORE    = { name:'', website:'', description:'', status:'active' };
const EMPTY_PRICE    = { productId:'', storeId:'', originalPrice:'', currentPrice:'', discount:'', productUrl:'', availability:'in_stock' };

const slugify = (s) => s.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');

/* ─── Modal wrapper ─── */
const Modal = ({ title, onClose, onSave, children }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <h3>{title}</h3>
      {children}
      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn-save"   onClick={onSave}>Save</button>
      </div>
    </div>
  </div>
);

/* ─── Main component ─── */
const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [tab,        setTab]        = useState('overview');
  const [stats,      setStats]      = useState(null);
  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores,     setStores]     = useState([]);
  const [users,      setUsers]      = useState([]);
  const [prices,     setPrices]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  /* modal state */
  const [modal,     setModal]     = useState(null);   // 'product'|'category'|'store'|'price'
  const [editItem,  setEditItem]  = useState(null);   // null = create, obj = edit
  const [form,      setForm]      = useState({});

  /* ── redirect if not admin ── */
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) navigate('/login');
  }, [user, authLoading, navigate]);

  /* ── load all data ── */
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, prodsRes, catsRes, storesRes, usersRes, pricesRes] = await Promise.all([
        getAdminStats(),
        getProducts({ limit: 100 }),
        getCategories(),
        getStores(),
        getAdminUsers(),
        getAdminPrices(),
      ]);
      setStats(statsRes.data);
      setProducts(prodsRes.data.products);
      setCategories(catsRes.data.categories);
      setStores(storesRes.data.stores);
      setUsers(usersRes.data.users);
      setPrices(pricesRes.data.prices);
    } catch (e) {
      setError('Failed to load data. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (user?.role === 'admin') loadAll(); }, [user, loadAll]);

  /* ── open modal helpers ── */
  const openCreate = (type, defaults) => { setModal(type); setEditItem(null); setForm(defaults); };
  const openEdit   = (type, item, mapper) => { setModal(type); setEditItem(item); setForm(mapper(item)); };
  const closeModal = () => { setModal(null); setEditItem(null); setForm({}); };
  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  /* ── CRUD: Products ── */
  const saveProduct = async () => {
    try {
      const payload = {
        name: form.name, slug: form.slug || slugify(form.name),
        brand: form.brand, description: form.description,
        category: form.category,
        images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
        specifications: form.specifications ? JSON.parse(form.specifications) : {},
      };
      if (editItem) await updateProduct(editItem._id, payload);
      else          await createProduct(payload);
      closeModal(); loadAll();
    } catch (e) { alert(e.response?.data?.message || e.message); }
  };

  const removeProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id); loadAll();
  };

  /* ── CRUD: Categories ── */
  const saveCategory = async () => {
    try {
      if (editItem) await updateCategory(editItem._id, form);
      else          await createCategory(form);
      closeModal(); loadAll();
    } catch (e) { alert(e.response?.data?.message || e.message); }
  };

  const removeCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await deleteCategory(id); loadAll();
  };

  /* ── CRUD: Stores ── */
  const saveStore = async () => {
    try {
      if (editItem) await updateStore(editItem._id, form);
      else          await createStore(form);
      closeModal(); loadAll();
    } catch (e) { alert(e.response?.data?.message || e.message); }
  };

  const removeStore = async (id) => {
    if (!window.confirm('Delete this store?')) return;
    await deleteStore(id); loadAll();
  };

  /* ── CRUD: Prices ── */
  const savePrice = async () => {
    try {
      const payload = {
        ...form,
        originalPrice: Number(form.originalPrice),
        currentPrice:  Number(form.currentPrice),
        discount:      Number(form.discount),
      };
      if (editItem) await updateAdminPrice(editItem._id, payload);
      else          await createAdminPrice(payload);
      closeModal(); loadAll();
    } catch (e) { alert(e.response?.data?.message || e.message); }
  };

  const removePrice = async (id) => {
    if (!window.confirm('Delete this price entry?')) return;
    await deleteAdminPrice(id); loadAll();
  };

  /* ── Users ── */
  const handleToggleUser = async (id) => { await toggleUser(id); loadAll(); };
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteAdminUser(id); loadAll();
  };

  /* ── guards ── */
  if (authLoading || loading) return <div className="admin-loading">⏳ Loading dashboard...</div>;
  if (!user || user.role !== 'admin') return null;

  const s = stats?.stats || {};

  return (
    <div className="admin-page">

      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>⚙️ Admin Dashboard</h1>
          <p>Welcome back, {user.name} — manage your entire store from here.</p>
        </div>
        <span className="badge badge-amber">Admin Panel</span>
      </div>

      {error && <div className="admin-error">⚠️ {error}</div>}

      {/* Stats */}
      <div className="admin-stats">
        {[
          { icon:'👥', label:'Total Users',      value: s.totalUsers,      color:'purple' },
          { icon:'📦', label:'Products',          value: s.totalProducts,   color:'blue'   },
          { icon:'🏷️', label:'Categories',        value: s.totalCategories, color:'green'  },
          { icon:'🏪', label:'Stores',            value: s.totalStores,     color:'amber'  },
          { icon:'🔔', label:'Price Alerts',      value: s.totalAlerts,     color:'red'    },
        ].map((st) => (
          <div className="stat-card" key={st.label}>
            <div className={`stat-icon ${st.color}`}>{st.icon}</div>
            <div>
              <div className="stat-value">{st.value ?? '—'}</div>
              <div className="stat-label">{st.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {['overview','products','categories','stores','prices','users'].map((t) => (
          <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {{ overview:'📊 Overview', products:'📦 Products', categories:'🏷️ Categories',
               stores:'🏪 Stores', prices:'💰 Prices', users:'👥 Users' }[t]}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="admin-section">
          <div className="admin-section-header"><h2>Recent Products</h2></div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Brand</th><th>Category</th><th>Rating</th></tr></thead>
              <tbody>
                {(stats?.recentProducts || []).map((p) => (
                  <tr key={p._id}>
                    <td><img className="admin-table-img" src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=60'} alt={p.name} /></td>
                    <td className="td-name">{p.name}</td>
                    <td className="td-muted">{p.brand}</td>
                    <td className="td-muted">{p.category?.name}</td>
                    <td>⭐ {p.rating?.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-section-header" style={{ marginTop: 32 }}><h2>Recent Users</h2></div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th></tr></thead>
              <tbody>
                {(stats?.recentUsers || []).map((u) => (
                  <tr key={u._id}>
                    <td className="td-name">{u.name}</td>
                    <td className="td-muted">{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>{u.role}</span></td>
                    <td><span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="td-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PRODUCTS ── */}
      {tab === 'products' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>All Products ({products.length})</h2>
            <button className="btn-add" onClick={() => openCreate('product', EMPTY_PRODUCT)}>+ Add Product</button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Image</th><th>Name</th><th>Brand</th><th>Category</th><th>Rating</th><th>Reviews</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td><img className="admin-table-img" src={p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=60'} alt={p.name} /></td>
                    <td className="td-name">{p.name}</td>
                    <td className="td-muted">{p.brand}</td>
                    <td className="td-muted">{p.category?.name}</td>
                    <td>⭐ {p.rating?.toFixed(1)}</td>
                    <td className="td-muted">{(p.reviewCount || 0).toLocaleString()}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEdit('product', p, (x) => ({
                          name: x.name, slug: x.slug, brand: x.brand, description: x.description,
                          category: x.category?._id || x.category,
                          images: (x.images || []).join(', '),
                          specifications: JSON.stringify(x.specifications || {}),
                        }))}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => removeProduct(p._id)}>🗑 Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CATEGORIES ── */}
      {tab === 'categories' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>All Categories ({categories.length})</h2>
            <button className="btn-add" onClick={() => openCreate('category', EMPTY_CATEGORY)}>+ Add Category</button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id}>
                    <td className="td-name">{c.name}</td>
                    <td className="td-muted">{c.description}</td>
                    <td><span className={`badge ${c.status === 'active' ? 'badge-green' : 'badge-red'}`}>{c.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEdit('category', c, (x) => ({ name: x.name, description: x.description, status: x.status }))}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => removeCategory(c._id)}>🗑 Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── STORES ── */}
      {tab === 'stores' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>All Stores ({stores.length})</h2>
            <button className="btn-add" onClick={() => openCreate('store', EMPTY_STORE)}>+ Add Store</button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Website</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s._id}>
                    <td className="td-name">{s.name}</td>
                    <td><a href={s.website} target="_blank" rel="noopener noreferrer" style={{ color:'var(--primary)', fontSize:13 }}>{s.website}</a></td>
                    <td className="td-muted">{s.description}</td>
                    <td><span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-red'}`}>{s.status}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEdit('store', s, (x) => ({ name: x.name, website: x.website, description: x.description, status: x.status }))}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => removeStore(s._id)}>🗑 Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── PRICES ── */}
      {tab === 'prices' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>All Price Entries ({prices.length})</h2>
            <button className="btn-add" onClick={() => openCreate('price', EMPTY_PRICE)}>+ Add Price</button>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Product</th><th>Store</th><th>Current Price</th><th>Original</th><th>Discount</th><th>Availability</th><th>Actions</th></tr></thead>
              <tbody>
                {prices.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <img className="admin-table-img" src={p.productId?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=60'} alt="" />
                        <span className="td-name">{p.productId?.name}</span>
                      </div>
                    </td>
                    <td className="td-muted">{p.storeId?.name}</td>
                    <td className="td-price">₹{p.currentPrice?.toLocaleString()}</td>
                    <td className="td-muted" style={{ textDecoration:'line-through' }}>₹{p.originalPrice?.toLocaleString()}</td>
                    <td style={{ color:'#dc2626', fontWeight:700 }}>{p.discount}%</td>
                    <td><span className={`badge ${p.availability === 'in_stock' ? 'badge-green' : 'badge-red'}`}>{p.availability === 'in_stock' ? 'In Stock' : 'Out of Stock'}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEdit('price', p, (x) => ({
                          productId: x.productId?._id || x.productId,
                          storeId:   x.storeId?._id   || x.storeId,
                          originalPrice: x.originalPrice, currentPrice: x.currentPrice,
                          discount: x.discount, productUrl: x.productUrl, availability: x.availability,
                        }))}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => removePrice(p._id)}>🗑 Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {tab === 'users' && (
        <div className="admin-section">
          <div className="admin-section-header"><h2>All Users ({users.length})</h2></div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="td-name">{u.name}</td>
                    <td className="td-muted">{u.email}</td>
                    <td><span className={`badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}`}>{u.role}</span></td>
                    <td><span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="td-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      {u.role !== 'admin' && (
                        <div className="action-btns">
                          <button className={u.isActive ? 'btn-toggle-active' : 'btn-toggle-inactive'} onClick={() => handleToggleUser(u._id)}>
                            {u.isActive ? '🔒 Deactivate' : '🔓 Activate'}
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteUser(u._id)}>🗑 Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════ MODALS ══════════ */}

      {/* Product Modal */}
      {modal === 'product' && (
        <Modal title={editItem ? '✏️ Edit Product' : '➕ Add Product'} onClose={closeModal} onSave={saveProduct}>
          <div className="form-row">
            <div className="form-group"><label>Name *</label><input value={form.name} onChange={f('name')} placeholder="iPhone 15 Pro" /></div>
            <div className="form-group"><label>Slug</label><input value={form.slug} onChange={f('slug')} placeholder="auto-generated" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Brand *</label><input value={form.brand} onChange={f('brand')} placeholder="Apple" /></div>
            <div className="form-group">
              <label>Category *</label>
              <select value={form.category} onChange={f('category')}>
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group"><label>Description</label><textarea value={form.description} onChange={f('description')} placeholder="Product description..." /></div>
          <div className="form-group"><label>Image URLs (comma-separated)</label><input value={form.images} onChange={f('images')} placeholder="https://..." /></div>
          <div className="form-group"><label>Specifications (JSON)</label><textarea value={form.specifications} onChange={f('specifications')} placeholder='{"display":"6.1 inch","storage":"128GB"}' /></div>
        </Modal>
      )}

      {/* Category Modal */}
      {modal === 'category' && (
        <Modal title={editItem ? '✏️ Edit Category' : '➕ Add Category'} onClose={closeModal} onSave={saveCategory}>
          <div className="form-group"><label>Name *</label><input value={form.name} onChange={f('name')} placeholder="Mobiles" /></div>
          <div className="form-group"><label>Description</label><textarea value={form.description} onChange={f('description')} placeholder="Category description..." /></div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={f('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </Modal>
      )}

      {/* Store Modal */}
      {modal === 'store' && (
        <Modal title={editItem ? '✏️ Edit Store' : '➕ Add Store'} onClose={closeModal} onSave={saveStore}>
          <div className="form-group"><label>Store Name *</label><input value={form.name} onChange={f('name')} placeholder="Amazon" /></div>
          <div className="form-group"><label>Website URL *</label><input value={form.website} onChange={f('website')} placeholder="https://www.amazon.in" /></div>
          <div className="form-group"><label>Description</label><textarea value={form.description} onChange={f('description')} placeholder="Store description..." /></div>
          <div className="form-group">
            <label>Status</label>
            <select value={form.status} onChange={f('status')}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </Modal>
      )}

      {/* Price Modal */}
      {modal === 'price' && (
        <Modal title={editItem ? '✏️ Edit Price' : '➕ Add Price Entry'} onClose={closeModal} onSave={savePrice}>
          <div className="form-group">
            <label>Product *</label>
            <select value={form.productId} onChange={f('productId')}>
              <option value="">Select product</option>
              {products.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Store *</label>
            <select value={form.storeId} onChange={f('storeId')}>
              <option value="">Select store</option>
              {stores.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Original Price (₹) *</label><input type="number" value={form.originalPrice} onChange={f('originalPrice')} placeholder="79900" /></div>
            <div className="form-group"><label>Current Price (₹) *</label><input type="number" value={form.currentPrice} onChange={f('currentPrice')} placeholder="69900" /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Discount (%)</label><input type="number" value={form.discount} onChange={f('discount')} placeholder="12" /></div>
            <div className="form-group">
              <label>Availability</label>
              <select value={form.availability} onChange={f('availability')}>
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
          <div className="form-group"><label>Product URL *</label><input value={form.productUrl} onChange={f('productUrl')} placeholder="https://www.amazon.in/dp/..." /></div>
        </Modal>
      )}

    </div>
  );
};

export default Admin;
