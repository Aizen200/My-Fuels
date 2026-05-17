import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { HiOutlineShoppingCart, HiOutlineClock, HiOutlineTruck, HiOutlineCurrencyRupee, HiOutlineMail, HiOutlinePhone, HiOutlineUser, HiOutlinePlusCircle } from 'react-icons/hi';

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ totalOrder: 0, pendingOrder: 0, deliveredOrder: 0, recentOrder: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/user/dashboard');
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-user-600"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Orders', value: data.totalOrder, sub: 'All Time', icon: <HiOutlineShoppingCart size={22} />, color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Pending Orders', value: data.pendingOrder, sub: 'In Progress', icon: <HiOutlineClock size={22} />, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    { label: 'Delivered Orders', value: data.deliveredOrder, sub: 'Completed', icon: <HiOutlineTruck size={22} />, color: 'bg-green-50 text-green-600 border-green-200' },
    { label: 'Total Spent', value: '₹0', sub: 'All Time', icon: <HiOutlineCurrencyRupee size={22} />, color: 'bg-purple-50 text-purple-600 border-purple-200' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}</h1>
        <p className="text-slate-500 mt-1">Here's what's happening with your orders.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white rounded-xl border p-5 ${stat.color} transition-all duration-200 hover:shadow-md`}>
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Current Orders</h2>
          <Link to="/order-history" className="text-sm text-user-600 font-medium hover:text-user-700">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Fuel</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Quantity</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.recentOrder?.length > 0 ? data.recentOrder.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.orderNumber || order._id?.slice(-6)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.fuel?.fuelName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.quantity} L</td>
                  <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.preferredDeliveryTime).toLocaleDateString('en-IN')}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h2>
          <Link to="/create-order" className="flex items-center justify-center gap-2 w-full py-3 bg-user-600 text-white rounded-xl font-semibold hover:bg-user-700 transition-all shadow-lg shadow-user-600/20">
            <HiOutlinePlusCircle size={20} />
            Create New Order
          </Link>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm"><HiOutlineUser className="text-slate-400" size={16} /><span className="text-slate-500">Name</span><span className="ml-auto font-medium text-slate-900">{user?.name}</span></div>
            <div className="flex items-center gap-3 text-sm"><HiOutlineMail className="text-slate-400" size={16} /><span className="text-slate-500">Email</span><span className="ml-auto font-medium text-slate-900">{user?.email}</span></div>
            <div className="flex items-center gap-3 text-sm"><HiOutlinePhone className="text-slate-400" size={16} /><span className="text-slate-500">Phone</span><span className="ml-auto font-medium text-slate-900">N/A</span></div>
            <div className="flex items-center gap-3 text-sm"><HiOutlineUser className="text-slate-400" size={16} /><span className="text-slate-500">Role</span><span className="ml-auto font-medium text-slate-900 capitalize">{user?.role}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
