import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { HiOutlineTruck, HiOutlineUser, HiOutlineX, HiOutlinePhone } from 'react-icons/hi';
import toast from 'react-hot-toast';

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const tabs = ['All Orders', 'Pending', 'Accepted', 'Out for Delivery', 'Delivered', 'Cancelled'];

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Orders');
  const [page, setPage] = useState(1);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [simLocation, setSimLocation] = useState({ lat: 28.6139, lng: 77.2090, progress: 35 });
  const perPage = 6;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/user/history');
        setOrders(res.data.OrderHistory || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let interval;
    if (trackingOrder) {
      interval = setInterval(() => {
        setSimLocation(prev => ({
          lat: prev.lat + 0.0002,
          lng: prev.lng + 0.0002,
          progress: prev.progress < 95 ? prev.progress + 2 : prev.progress
        }));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [trackingOrder]);

  const filtered = activeTab === 'All Orders' ? orders : orders.filter((o) => o.status === activeTab);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-user-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
        <p className="text-slate-500 mt-1">View and track all your past and current orders.</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-user-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Fuel</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Quantity</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Total Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Order Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length > 0 ? paginated.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.orderNumber || order._id?.slice(-6)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.fuel?.fuelName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{order.quantity} L</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">₹{order.totalPrice?.toLocaleString()}</td>
                  <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>{order.status}</span></td>
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="px-6 py-4"><button onClick={() => { setTrackingOrder(order); setSimLocation({ lat: 28.6139, lng: 77.2090, progress: order.status === 'Delivered' ? 100 : order.status === 'Out for Delivery' ? 70 : order.status === 'Accepted' ? 40 : 15 }); }} className="text-sm text-user-600 font-medium cursor-pointer hover:text-user-700 focus:outline-none">Track</button></td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of {filtered.length} orders</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-3 py-1 rounded-lg border border-slate-200 text-sm disabled:opacity-40">←</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded-lg text-sm ${page === i + 1 ? 'bg-user-600 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages} className="px-3 py-1 rounded-lg border border-slate-200 text-sm disabled:opacity-40">→</button>
            </div>
          </div>
        )}
      </div>

      {trackingOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-3xl shadow-2xl relative animate-scale-up overflow-hidden max-h-[90vh] flex flex-col">
            <button onClick={() => setTrackingOrder(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-full hover:bg-slate-100 focus:outline-none">
              <HiOutlineX size={24} />
            </button>
            <div className="mb-6">
              <span className="bg-user-50 text-user-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Live GPS Tracking</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">Order {trackingOrder.orderNumber || trackingOrder._id?.slice(-6)}</h2>
              <p className="text-slate-500 text-sm mt-1">Simulated Real-Time Delivery Tracking & Route Map</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-center">
                <span className="text-xs text-slate-500 font-medium">Estimated Arrival</span>
                <span className="text-lg font-bold text-slate-900 mt-0.5">25 Mins</span>
                <span className="text-[10px] text-green-600 font-medium mt-1 flex items-center gap-1">● On Time</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-center">
                <span className="text-xs text-slate-500 font-medium">Current Status</span>
                <span className="text-lg font-bold text-slate-900 mt-0.5">{trackingOrder.status}</span>
                <span className="text-[10px] text-slate-500 mt-1">Updated 2s ago</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-center">
                <span className="text-xs text-slate-500 font-medium">Live Coordinates</span>
                <span className="text-sm font-bold text-slate-900 mt-0.5 font-mono">{simLocation.lat.toFixed(4)}°N, {simLocation.lng.toFixed(4)}°E</span>
                <span className="text-[10px] text-blue-600 font-medium mt-1 animate-pulse flex items-center gap-1">● GPS Active</span>
              </div>
            </div>

            <div className="relative w-full h-80 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mb-2 flex-shrink-0 shadow-inner">
              <iframe
                title="Google Maps Live Tracking"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${simLocation.lat},${simLocation.lng}&z=15&output=embed`}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
