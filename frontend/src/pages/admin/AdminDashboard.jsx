import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiOutlineShoppingCart, HiOutlineClock, HiOutlineTruck, HiOutlineCurrencyRupee } from 'react-icons/hi';

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
};

const AdminDashboard = () => {
  const [data, setData] = useState({ totalOrder: 0, pendingOrder: 0, outfordelivery: 0, deliveredOrder: 0, recentOrder: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-admin-600"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Orders', value: data.totalOrder, sub: 'All Time', icon: <HiOutlineShoppingCart size={22} />, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    { label: 'Pending Orders', value: data.pendingOrder, sub: 'Pending', icon: <HiOutlineClock size={22} />, bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200' },
    { label: 'Delivered Orders', value: data.deliveredOrder, sub: 'Delivered', icon: <HiOutlineTruck size={22} />, bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    { label: 'Total Revenue', value: '₹0', sub: 'All Time', icon: <HiOutlineCurrencyRupee size={22} />, bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  ];

  const statusData = [
    { label: 'Pending', count: data.pendingOrder, color: 'bg-yellow-400' },
    { label: 'Accepted', count: 0, color: 'bg-blue-400' },
    { label: 'Out for Delivery', count: data.outfordelivery, color: 'bg-purple-400' },
    { label: 'Delivered', count: data.deliveredOrder, color: 'bg-green-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back, Admin! Here's an overview of the system.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-xl border ${stat.border} p-5 ${stat.text} transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium opacity-80">{stat.label}</span>
              {stat.icon}
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-xs opacity-60 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Fuel</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Qty</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentOrder?.length > 0 ? data.recentOrder.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.orderNumber || order._id?.slice(-6)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.fuel?.fuelName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.quantity} L</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">₹{order.totalPrice?.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>{order.status}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Orders by Status</h2>
          <div className="space-y-3">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${s.color}`}></div>
                <span className="text-sm text-slate-600 flex-1">{s.label}</span>
                <span className="text-sm font-semibold text-slate-900">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Top Fuel Types</h2>
          <div className="space-y-4">
            {['Diesel', 'Petrol', 'Premium Diesel'].map((fuel, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">{fuel}</span>
                  <span className="font-medium text-slate-900">{[56, 32, 12][i]}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${['bg-admin-500', 'bg-blue-500', 'bg-yellow-500'][i]}`} style={{ width: `${[56, 32, 12][i]}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
