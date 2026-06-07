import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Users, DollarSign, TrendingUp, Search, ChevronDown,
  Edit2, X, Check, LogOut, Truck, AlertCircle, RefreshCw,
} from 'lucide-react';

// â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const API = import.meta.env.VITE_API_URL || '/api';

const STATUS_COLORS = {
  pending:    'bg-yellow-50 text-yellow-700 border-yellow-200',
  paid:       'bg-blue-50 text-blue-700 border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border-purple-200',
  shipped:    'bg-indigo-50 text-indigo-700 border-indigo-200',
  delivered:  'bg-green-50 text-green-700 border-green-200',
  refunded:   'bg-orange-50 text-orange-700 border-orange-200',
  canceled:   'bg-red-50 text-red-700 border-red-200',
};

const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'refunded', 'canceled'];

function fmtMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function useAuthHeaders() {
  const token = localStorage.getItem('ac_admin_token');
  return useMemo(() => token ? { Authorization: `Bearer ${token}` } : {}, [token]);
}

// â”€â”€â”€ Login screen â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Login failed'); setLoading(false); return; }
      if (!data.user?.isAdmin) { setError('You do not have admin access.'); setLoading(false); return; }
      localStorage.setItem('ac_admin_token', data.token);
      onLogin(data.user);
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <p className="text-center text-xs uppercase tracking-[0.3em] text-gold font-sans mb-6">Abundance Code Â· Admin</p>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
          <h1 className="font-serif text-2xl text-[#111827] mb-6">Sign in</h1>
          {error && (
            <div className="flex items-center gap-2 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
              <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm font-sans">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Admin email"
              className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] placeholder-[#9CA3AF] text-sm font-sans focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
            />
            <input
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] placeholder-[#9CA3AF] text-sm font-sans focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
            />
            <button
              type="submit" disabled={loading}
              className="w-full btn-gold text-sm disabled:opacity-60"
            >
              {loading ? 'Signing inâ€¦' : 'Sign in'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

// â”€â”€â”€ Stat card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatCard({ icon, label, value, sub }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-gold">{icon}</span>
        <p className="text-[#6B7280] text-xs uppercase tracking-widest font-sans">{label}</p>
      </div>
      <p className="font-serif text-3xl text-[#111827]">{value}</p>
      {sub && <p className="text-[#9CA3AF] text-xs font-sans mt-1">{sub}</p>}
    </div>
  );
}

// â”€â”€â”€ Order edit modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function EditOrderModal({ order, onClose, onSave, headers }) {
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.trackingNumber || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/admin/orders/${order._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ status, trackingNumber: tracking }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); setLoading(false); return; }
      onSave(data);
    } catch {
      setError('Save failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F1ED]/70 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-lg text-[#111827]">Update Order</h2>
          <button onClick={onClose} className="text-[#9CA3AF] hover:text-[#111827] transition-colors"><X size={18} /></button>
        </div>

        <div className="mb-4">
          <p className="text-[#6B7280] text-xs font-sans mb-0.5">Customer</p>
          <p className="text-[#111827] text-sm font-sans">{order.name} â€” {order.email}</p>
        </div>
        <div className="mb-4">
          <p className="text-[#6B7280] text-xs font-sans mb-0.5">Product</p>
          <p className="text-[#111827] text-sm font-sans">{order.product?.name} Â· {fmtMoney(order.product?.price)}</p>
        </div>

        <div className="mb-4">
          <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Status</label>
          <select
            value={status} onChange={e => setStatus(e.target.value)}
            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] text-sm font-sans focus:outline-none focus:border-[#D4AF37]"
          >
            {STATUSES.map(s => <option key={s} value={s} className="bg-white">{s}</option>)}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Tracking number</label>
          <input
            type="text"
            value={tracking} onChange={e => setTracking(e.target.value)}
            placeholder="e.g. 1Z999AA10123456784"
            className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] placeholder-[#9CA3AF] text-sm font-sans focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
          />
        </div>

        {error && <p className="text-red-400 text-sm font-sans mb-4">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-sans hover:border-[#D4AF37]/40 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave} disabled={loading}
            className="flex-1 btn-gold text-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Check size={15} />}
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// â”€â”€â”€ Main Admin panel â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function Admin() {
  const [admin, setAdmin] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('ac_admin_token');
    if (!token) return;
    fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.isAdmin) setAdmin(data); else localStorage.removeItem('ac_admin_token'); })
      .catch(() => localStorage.removeItem('ac_admin_token'));
  }, []);

  if (!admin) return <LoginScreen onLogin={setAdmin} />;

  return <AdminDashboard admin={admin} onLogout={() => { localStorage.removeItem('ac_admin_token'); setAdmin(null); }} />;
}

function AdminDashboard({ admin, onLogout }) {
  const headers = useAuthHeaders();

  // Stats
  const [stats, setStats] = useState(null);

  // Orders
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Edit modal
  const [editOrder, setEditOrder] = useState(null);

  // Active tab
  const [tab, setTab] = useState('orders');

  // Products
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productForm, setProductForm] = useState(null);
  const [productError, setProductError] = useState('');

  // Blog
  const [blogPosts, setBlogPosts] = useState([]);
  const [loadingBlog, setLoadingBlog] = useState(false);
  const [blogForm, setBlogForm] = useState(null); // null | {} | {existing}
  const [blogError, setBlogError] = useState('');

  // Users
  const [users, setUsers] = useState([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [userSearchInput, setUserSearchInput] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/admin/stats`, { headers });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch { /* ignore */ }
  }, [headers]);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);
      const res = await fetch(`${API}/admin/orders?${params}`, { headers });
      const data = await res.json();
      if (res.ok) { setOrders(data.orders); setTotal(data.total); setPages(data.pages); }
    } catch { /* ignore */ }
    setLoadingOrders(false);
  }, [page, statusFilter, search, headers]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({ page: usersPage, limit: 20 });
      if (userSearch) params.set('search', userSearch);
      const res = await fetch(`${API}/admin/users?${params}`, { headers });
      const data = await res.json();
      if (res.ok) { setUsers(data.users); setUsersTotal(data.total); }
    } catch { /* ignore */ }
    setLoadingUsers(false);
  }, [usersPage, userSearch, headers]);

  // Products helpers
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API}/admin/products`, { headers });
      const data = await res.json();
      if (res.ok) setProducts(data.products);
    } catch { /* ignore */ }
    setLoadingProducts(false);
  }, [headers]);

  const saveProduct = async (form) => {
    setProductError('');
    const isEdit = !!form._id;
    const url = isEdit ? `${API}/admin/products/${form._id}` : `${API}/admin/products`;
    const method = isEdit ? 'PATCH' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setProductError(data.message || 'Error saving'); return; }
      fetchProducts();
      setProductForm(null);
    } catch { setProductError('Connection error'); }
  };

  const deleteProductById = async (id) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`${API}/admin/products/${id}`, { method: 'DELETE', headers });
    fetchProducts();
  };

  // Blog helpers
  const fetchBlog = useCallback(async () => {
    setLoadingBlog(true);
    try {
      const res = await fetch(`${API}/admin/blog`, { headers });
      const data = await res.json();
      if (res.ok) setBlogPosts(data.posts || []);
    } catch { /* ignore */ }
    setLoadingBlog(false);
  }, [headers]);

  const saveBlogPost = async (form) => {
    setBlogError('');
    const isEdit = !!form._id;
    const url    = isEdit ? `${API}/admin/blog/${form._id}` : `${API}/admin/blog`;
    const method = isEdit ? 'PATCH' : 'POST';
    try {
      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setBlogError(data.message || 'Error saving'); return; }
      fetchBlog();
      setBlogForm(null);
    } catch { setBlogError('Connection error'); }
  };

  const deleteBlogPost = async (id) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`${API}/admin/blog/${id}`, { method: 'DELETE', headers });
    fetchBlog();
  };

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { if (tab === 'orders')   fetchOrders();   }, [fetchOrders, tab]);
  useEffect(() => { if (tab === 'users')    fetchUsers();    }, [fetchUsers, tab]);
  useEffect(() => { if (tab === 'products') fetchProducts(); }, [fetchProducts, tab]);
  useEffect(() => { if (tab === 'blog')     fetchBlog();     }, [fetchBlog, tab]);

  const handleSearchSubmit = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };
  const handleUserSearchSubmit = (e) => { e.preventDefault(); setUserSearch(userSearchInput); setUsersPage(1); };

  const handleOrderSaved = (updated) => {
    setOrders(prev => prev.map(o => o._id === updated._id ? updated : o));
    setEditOrder(null);
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Top bar */}
      <div className="border-b border-[#E5E7EB] bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gold font-sans">Abundance Code Â· Admin</p>
          <div className="hidden sm:flex gap-1">
            {['orders', 'users', 'products', 'blog'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-sans font-medium capitalize transition-colors ${
                  tab === t ? 'bg-gold/15 text-gold' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[#6B7280] text-xs font-sans hidden sm:block">{admin.email}</p>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#111827] text-xs font-sans transition-colors"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<DollarSign size={18} />}
              label="Total Revenue"
              value={fmtMoney(stats.totalRevenue)}
              sub={`${fmtMoney(stats.revenueLastMonth)} last 30 days`}
            />
            <StatCard
              icon={<Package size={18} />}
              label="Total Orders"
              value={stats.totalOrders}
              sub={`${stats.byStatus?.paid || 0} paid Â· ${stats.byStatus?.shipped || 0} shipped`}
            />
            <StatCard
              icon={<Truck size={18} />}
              label="Processing"
              value={(stats.byStatus?.paid || 0) + (stats.byStatus?.processing || 0)}
              sub="Awaiting shipment"
            />
            <StatCard
              icon={<Users size={18} />}
              label="Portal Users"
              value={stats.totalUsers}
              sub="Activated accounts"
            />
          </div>
        )}

        {/* Tab: Orders */}
        {tab === 'orders' && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={searchInput} onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search by email, name, codeâ€¦"
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-[#9CA3AF] text-sm font-sans focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] text-sm font-sans hover:border-[#D4AF37]/50 transition-colors">
                  Search
                </button>
              </form>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                  className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-[#111827] text-sm font-sans focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="all" className="bg-white">All statuses</option>
                  {STATUSES.map(s => <option key={s} value={s} className="bg-white capitalize">{s}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
              </div>

              <button
                onClick={() => { fetchOrders(); fetchStats(); }}
                className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827] transition-colors flex items-center gap-1.5 text-sm font-sans"
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white shadow-sm">
              {loadingOrders ? (
                <div className="flex items-center justify-center py-16 text-[#9CA3AF] text-sm font-sans">Loading ordersâ€¦</div>
              ) : orders.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-[#9CA3AF] text-sm font-sans">No orders found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                        <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest">Customer</th>
                        <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest hidden md:table-cell">Product</th>
                        <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest">Status</th>
                        <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest hidden lg:table-cell">Code</th>
                        <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest hidden lg:table-cell">Date</th>
                        <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest">Total</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, i) => (
                        <tr
                          key={order._id}
                          className={`border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFAFA]'}`}
                        >
                          <td className="px-5 py-4">
                            <p className="text-[#111827] font-sans text-sm">{order.name || 'â€”'}</p>
                            <p className="text-[#6B7280] font-sans text-xs">{order.email}</p>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <p className="text-[#374151] font-sans text-xs">{order.product?.name || 'â€”'}</p>
                            {order.product?.includesBracelet && (
                              <span className="text-gold/70 text-xs font-sans">+ Bracelet</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-sans border capitalize ${STATUS_COLORS[order.status] || 'text-[#6B7280]'}`}>
                              {order.status}
                            </span>
                            {order.trackingNumber && (
                              <p className="text-[#9CA3AF] text-xs font-sans mt-1 flex items-center gap-1">
                                <Truck size={10} /> {order.trackingNumber}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <p className="text-[#6B7280] text-xs font-mono">{order.activationCode || 'â€”'}</p>
                            {order.isActivated && <span className="text-green-400 text-xs font-sans">Activated</span>}
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <p className="text-[#6B7280] font-sans text-xs">{fmtDate(order.createdAt)}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-[#111827] font-serif">{fmtMoney(order.product?.price || 0)}</p>
                          </td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => setEditOrder(order)}
                              className="p-2 rounded-lg bg-[#F3F4F6] text-[#6B7280] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors"
                            >
                              <Edit2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-[#9CA3AF] text-xs font-sans">{total} total orders</p>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-xs font-sans disabled:opacity-30 hover:border-[#D4AF37]/40 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1.5 text-[#6B7280] text-xs font-sans">{page} / {pages}</span>
                  <button
                    disabled={page >= pages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-xs font-sans disabled:opacity-30 hover:border-[#D4AF37]/40 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Users */}
        {tab === 'users' && (
          <div>
            <form onSubmit={handleUserSearchSubmit} className="flex gap-2 mb-5 max-w-md">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={userSearchInput} onChange={e => setUserSearchInput(e.target.value)}
                  placeholder="Search users by email or nameâ€¦"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-[#9CA3AF] text-sm font-sans focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <button type="submit" className="px-4 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-[#6B7280] text-sm font-sans hover:border-[#D4AF37]/50 transition-colors">
                Search
              </button>
            </form>

            <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white shadow-sm">
              {loadingUsers ? (
                <div className="flex items-center justify-center py-16 text-[#9CA3AF] text-sm font-sans">Loading usersâ€¦</div>
              ) : users.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-[#9CA3AF] text-sm font-sans">No users found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                        <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest">User</th>
                        <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest hidden md:table-cell">Birth data</th>
                        <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest">Subscription</th>
                        <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest hidden lg:table-cell">Activated</th>
                        <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest hidden lg:table-cell">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, i) => (
                        <tr key={user._id} className={`border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFAFA]'}`}>
                          <td className="px-5 py-4">
                            <p className="text-[#111827] font-sans text-sm">{user.name || 'â€”'}</p>
                            <p className="text-[#6B7280] font-sans text-xs">{user.email}</p>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            {user.birthDate ? (
                              <p className="text-[#6B7280] font-sans text-xs">
                                {new Date(user.birthDate).toLocaleDateString()}{user.birthTime ? ` Â· ${user.birthTime}` : ''}<br />
                                {user.birthPlace || ''}
                              </p>
                            ) : <p className="text-[#D1D5DB] text-xs font-sans">Not set</p>}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-sans border capitalize ${
                              user.subscriptionStatus === 'active' ? 'bg-green-500/15 text-green-400 border-green-500/30' :
                              user.subscriptionStatus === 'trial' ? 'bg-blue-500/15 text-blue-400 border-blue-500/30' :
                              'bg-gray-50 text-gray-400 border-gray-200'
                            }`}>
                              {user.subscriptionStatus}
                            </span>
                            {user.trialEndDate && user.subscriptionStatus === 'trial' && (
                              <p className="text-[#9CA3AF] text-xs font-sans mt-1">
                                Trial ends {fmtDate(user.trialEndDate)}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            {user.isActivated
                              ? <span className="text-green-400 text-xs font-sans">âœ“ {user.activatedAt ? fmtDate(user.activatedAt) : 'Yes'}</span>
                              : <span className="text-[#9CA3AF] text-xs font-sans">Pending</span>}
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <p className="text-[#6B7280] text-xs font-sans">{fmtDate(user.createdAt)}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {usersTotal > 20 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-[#9CA3AF] text-xs font-sans">{usersTotal} total users</p>
                <div className="flex gap-2">
                  <button disabled={usersPage <= 1} onClick={() => setUsersPage(p => p - 1)}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-xs font-sans disabled:opacity-30 hover:border-[#D4AF37]/40 transition-colors">
                    Previous
                  </button>
                  <button disabled={usersPage * 20 >= usersTotal} onClick={() => setUsersPage(p => p + 1)}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-xs font-sans disabled:opacity-30 hover:border-[#D4AF37]/40 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Products */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-[#111827] text-xl">Products</h2>
              <button
                onClick={() => { setProductForm({ name: '', description: '', price: '', imageUrl: '', isActive: true }); setProductError(''); }}
                className="btn-gold text-xs px-5 py-2.5"
              >
                + Add Product
              </button>
            </div>

            {/* Product form */}
            {productForm && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm mb-6">
                <h3 className="font-serif text-[#111827] text-lg mb-5">{productForm._id ? 'Edit Product' : 'New Product'}</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Name *</label>
                    <input
                      type="text" value={productForm.name}
                      onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Crystal Code"
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] placeholder-[#9CA3AF] text-sm font-sans focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Price (USD) *</label>
                    <input
                      type="number" step="0.01" min="0" value={productForm.price}
                      onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))}
                      placeholder="177.00"
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] placeholder-[#9CA3AF] text-sm font-sans focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Description</label>
                  <textarea
                    rows={3} value={productForm.description}
                    onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the productâ€¦"
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] placeholder-[#9CA3AF] text-sm font-sans focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 resize-none"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Image URL</label>
                  <input
                    type="url" value={productForm.imageUrl}
                    onChange={e => setProductForm(p => ({ ...p, imageUrl: e.target.value }))}
                    placeholder="https://â€¦"
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] placeholder-[#9CA3AF] text-sm font-sans focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20"
                  />
                  {productForm.imageUrl && (
                    <img src={productForm.imageUrl} alt="preview" className="mt-2 h-24 w-24 object-cover rounded-lg border border-[#E5E7EB]" />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-5">
                  <input
                    type="checkbox" id="isActive" checked={productForm.isActive}
                    onChange={e => setProductForm(p => ({ ...p, isActive: e.target.checked }))}
                    className="accent-gold"
                  />
                  <label htmlFor="isActive" className="text-[#374151] text-sm font-sans">Active (visible to customers)</label>
                </div>
                {productError && <p className="text-red-400 text-sm font-sans mb-4">{productError}</p>}
                <div className="flex gap-3">
                  <button onClick={() => setProductForm(null)} className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-sans hover:border-[#D4AF37]/40 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => saveProduct(productForm)} className="flex-1 btn-gold text-sm">
                    {productForm._id ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </div>
            )}

            {/* Product list */}
            {loadingProducts ? (
              <div className="flex items-center justify-center py-16 text-[#9CA3AF] text-sm font-sans">Loading productsâ€¦</div>
            ) : products.length === 0 && !productForm ? (
              <div className="flex flex-col items-center justify-center py-16 text-[#9CA3AF] text-sm font-sans gap-3">
                <p>No products yet.</p>
                <button onClick={() => { setProductForm({ name: '', description: '', price: '', imageUrl: '', isActive: true }); setProductError(''); }} className="text-gold/60 hover:text-gold text-xs underline transition-colors">Add your first product</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => (
                  <div key={p._id} className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-sm">
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-40 object-cover" />
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-serif text-[#111827] text-base">{p.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans ${p.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {p.description && <p className="text-[#6B7280] text-xs font-sans mb-3 line-clamp-2">{p.description}</p>}
                      <p className="font-serif text-gold text-xl mb-4">${(p.price / 100).toFixed(2)} USD</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setProductForm({ ...p, price: (p.price / 100).toFixed(2) }); setProductError(''); }}
                          className="flex-1 py-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] text-xs font-sans hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProductById(p._id)}
                          className="py-2 px-3 rounded-lg border border-red-500/20 text-red-400/60 text-xs font-sans hover:border-red-500/50 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Blog */}
        {tab === 'blog' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-[#111827] text-xl">Blog Posts</h2>
              <button
                onClick={() => { setBlogForm({ title: '', slug: '', excerpt: '', content: '', imageUrl: '', author: 'Abundance Code', category: 'Astrology', isPublished: false }); setBlogError(''); }}
                className="btn-gold text-xs px-5 py-2.5"
              >
                + New Post
              </button>
            </div>

            {/* Blog form */}
            {blogForm && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 mb-6 shadow-sm">
                <h3 className="font-serif text-[#111827] text-lg mb-5">{blogForm._id ? 'Edit Post' : 'New Post'}</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Title *</label>
                    <input value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="Your post title" className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] text-sm font-sans focus:outline-none focus:border-[#D4AF37] placeholder-[#9CA3AF]" />
                  </div>
                  <div>
                    <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Slug (URL)</label>
                    <input value={blogForm.slug} onChange={e => setBlogForm(f => ({ ...f, slug: e.target.value }))}
                      placeholder="auto-generated-from-title" className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] text-sm font-sans focus:outline-none focus:border-[#D4AF37] placeholder-[#9CA3AF]" />
                  </div>
                  <div>
                    <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Category</label>
                    <select value={blogForm.category} onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] text-sm font-sans focus:outline-none focus:border-[#D4AF37]">
                      {['Astrology', 'Tarot', 'Numerology', 'Crystals', 'Abundance', 'Mindset'].map(c => (
                        <option key={c} value={c} className="bg-white">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Author</label>
                    <input value={blogForm.author} onChange={e => setBlogForm(f => ({ ...f, author: e.target.value }))}
                      placeholder="Abundance Code" className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] text-sm font-sans focus:outline-none focus:border-[#D4AF37] placeholder-[#9CA3AF]" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Image URL</label>
                  <input value={blogForm.imageUrl} onChange={e => setBlogForm(f => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..." className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] text-sm font-sans focus:outline-none focus:border-[#D4AF37] placeholder-[#9CA3AF]" />
                  {blogForm.imageUrl && (
                    <img src={blogForm.imageUrl} alt="preview" className="mt-2 h-28 w-full object-cover rounded-xl opacity-70" />
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Excerpt (short description)</label>
                  <textarea value={blogForm.excerpt} onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))}
                    rows={2} placeholder="A brief summary shown in the blog list..."
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] text-sm font-sans focus:outline-none focus:border-[#D4AF37] placeholder-[#9CA3AF] resize-none" />
                </div>
                <div className="mb-4">
                  <label className="block text-[#6B7280] text-xs font-sans mb-1.5">Content (HTML supported)</label>
                  <textarea value={blogForm.content} onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))}
                    rows={10} placeholder="<p>Your full article content here...</p>"
                    className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[#111827] text-sm font-mono focus:outline-none focus:border-[#D4AF37] placeholder-[#9CA3AF] resize-y" />
                </div>
                <div className="flex items-center gap-3 mb-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" checked={blogForm.isPublished} onChange={e => setBlogForm(f => ({ ...f, isPublished: e.target.checked }))}
                      className="w-4 h-4 accent-[#D4AF37]" />
                    <span className="text-[#374151] text-sm font-sans">Published (visible on site)</span>
                  </label>
                </div>
                {blogError && <p className="text-red-400 text-sm font-sans mb-4">{blogError}</p>}
                <div className="flex gap-3">
                  <button onClick={() => setBlogForm(null)}
                    className="flex-1 py-3 rounded-xl border border-[#E5E7EB] text-[#6B7280] text-sm font-sans hover:border-[#D4AF37]/40 transition-colors">
                    Cancel
                  </button>
                  <button onClick={() => saveBlogPost(blogForm)}
                    className="flex-1 btn-gold text-sm">
                    {blogForm._id ? 'Save Changes' : 'Create Post'}
                  </button>
                </div>
              </div>
            )}

            {/* Blog list */}
            <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white shadow-sm">
              {loadingBlog ? (
                <div className="flex items-center justify-center py-16 text-[#9CA3AF] text-sm font-sans">Loading postsâ€¦</div>
              ) : blogPosts.length === 0 ? (
                <div className="flex items-center justify-center py-16 text-[#9CA3AF] text-sm font-sans">No posts yet. Create your first one.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                      <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest">Title</th>
                      <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest hidden md:table-cell">Category</th>
                      <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest">Status</th>
                      <th className="text-left px-5 py-3 text-[#9CA3AF] font-sans text-xs uppercase tracking-widest hidden lg:table-cell">Date</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map((post, i) => (
                      <tr key={post._id} className={`border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors ${i % 2 === 0 ? '' : 'bg-[#FAFAFA]'}`}>
                        <td className="px-5 py-4">
                          <p className="text-[#111827] font-sans text-sm font-medium">{post.title}</p>
                          <p className="text-[#9CA3AF] text-xs font-mono">/blog/{post.slug}</p>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className="text-[#6B7280] text-xs font-sans">{post.category}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-sans border ${
                            post.isPublished
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-gray-50 text-gray-400 border-gray-200'
                          }`}>
                            {post.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <p className="text-[#6B7280] text-xs font-sans">
                            {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={async () => {
                              const res  = await fetch(`${API}/admin/blog/${post._id}`, { headers });
                              const data = await res.json();
                              setBlogForm(data);
                              setBlogError('');
                            }} className="p-2 rounded-lg bg-[#F3F4F6] text-[#6B7280] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors">
                              <Edit2 size={13} />
                            </button>
                            <button onClick={() => deleteBlogPost(post._id)}
                              className="p-2 rounded-lg bg-[#F3F4F6] text-[#6B7280] hover:text-red-500 hover:bg-red-50 transition-colors">
                              <X size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Edit modal */}
      {editOrder && (
        <EditOrderModal
          order={editOrder}
          headers={headers}
          onClose={() => setEditOrder(null)}
          onSave={handleOrderSaved}
        />
      )}
    </div>
  );
}
