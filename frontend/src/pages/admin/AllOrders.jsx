import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { HiOutlineSearch, HiOutlineDownload } from 'react-icons/hi';
import toast from 'react-hot-toast';

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
};

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/admin/vieworders');
        setOrders(res.data.allorders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleExport = () => {
    if (orders.length === 0) {
      toast.error('No orders to export');
      return;
    }
    const headers = ['Order ID', 'User', 'Fuel Type', 'Quantity (L)', 'Total Price (INR)', 'Status', 'Order Date'];
    const rows = orders.map(o => [
      o.orderNumber || o._id?.slice(-6),
      o.user?.name || 'N/A',
      o.fuel?.fuelName || 'N/A',
      o.quantity,
      o.totalPrice,
      o.status,
      new Date(o.createdAt).toLocaleDateString('en-IN')
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported successfully!');
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.orderNumber = search;
      if (statusFilter) params.filter = statusFilter;
      const res = await API.get('/admin/search', { params });
      const result = res.data.filterOrder || (res.data.findOrder ? [res.data.findOrder] : []);
      setOrders(result);
      setPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-admin-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Orders</h1>
          <p className="text-slate-500 mt-1">View and manage all customer orders.</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-admin-600 text-white rounded-lg text-sm font-medium hover:bg-admin-700 transition-all shadow-md">
          <HiOutlineDownload size={16} />
          Export
        </button>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[250px]">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Order ID, User, Fuel..." className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-admin-500 focus:border-admin-500 outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-admin-500 outline-none">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
        </select>
        <button onClick={handleFilter} className="px-5 py-2.5 bg-admin-600 text-white rounded-lg text-sm font-medium hover:bg-admin-700 transition-all">Filter</button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Fuel</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Quantity</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Order Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length > 0 ? paginated.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.orderNumber || order._id?.slice(-6)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.fuel?.fuelName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.quantity} L</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">₹{order.totalPrice?.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-6 py-4"><Link to={`/admin/update-status/${order._id}`} className="text-sm text-admin-600 font-medium hover:text-admin-700">Update Status</Link></td>
                </tr>
              )) : (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} orders</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded-lg border border-slate-200 text-sm disabled:opacity-40">←</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded-lg text-sm ${page === i + 1 ? 'bg-admin-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{i + 1}</button>
              ))}
              {totalPages > 5 && <span className="px-2 py-1 text-slate-400">...</span>}
              {totalPages > 5 && <button onClick={() => setPage(totalPages)} className={`px-3 py-1 rounded-lg text-sm ${page === totalPages ? 'bg-admin-600 text-white' : 'border border-slate-200'}`}>{totalPages}</button>}
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded-lg border border-slate-200 text-sm disabled:opacity-40">→</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
