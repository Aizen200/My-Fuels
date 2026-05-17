import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft } from 'react-icons/hi';

const statusSteps = ['Pending', 'Accepted', 'Out for Delivery', 'Delivered'];

const statusColor = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Accepted: 'bg-blue-100 text-blue-700',
  'Out for Delivery': 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
};

const UpdateOrderStatus = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/admin/vieworders');
        const allOrders = res.data.allorders || [];
        setOrders(allOrders);
        if (id) {
          const found = allOrders.find((o) => o._id === id);
          if (found) {
            setSelectedOrder(found);
            setNewStatus(found.status);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [id]);

  const handleUpdate = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      await API.patch(`/admin/orders/${selectedOrder._id}/status`, { status: newStatus });
      toast.success('Status updated successfully!');
      setSelectedOrder({ ...selectedOrder, status: newStatus });
      setOrders(orders.map((o) => o._id === selectedOrder._id ? { ...o, status: newStatus } : o));
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-admin-600"></div>
      </div>
    );
  }

  if (!selectedOrder && !id) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Update Order Status</h1>
          <p className="text-slate-500 mt-1">Select an order to update its status.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.orderNumber || order._id?.slice(-6)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{order.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}`}>{order.status}</span></td>
                    <td className="px-6 py-4"><Link to={`/admin/update-status/${order._id}`} className="text-sm text-admin-600 font-medium hover:text-admin-700">Update</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(selectedOrder?.status);

  return (
    <div className="space-y-6">
      <Link to="/admin/update-status" className="inline-flex items-center gap-2 text-sm text-admin-600 font-medium hover:text-admin-700">
        <HiOutlineArrowLeft size={16} />
        Back to Orders
      </Link>
      <h1 className="text-2xl font-bold text-slate-900">Update Order Status</h1>
      <p className="text-slate-500">Update the status of order {selectedOrder?.orderNumber || selectedOrder?._id?.slice(-6)}</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Order Details</h2>
          <div className="space-y-4">
            <div><p className="text-xs text-slate-500">Order ID</p><p className="text-sm font-semibold text-slate-900">{selectedOrder?.orderNumber || selectedOrder?._id?.slice(-6)}</p></div>
            <div><p className="text-xs text-slate-500">User</p><p className="text-sm font-semibold text-slate-900">{selectedOrder?.user?.name || 'N/A'}</p></div>
            <div><p className="text-xs text-slate-500">Fuel</p><p className="text-sm font-semibold text-slate-900">{selectedOrder?.fuel?.fuelName || 'N/A'}</p></div>
            <div><p className="text-xs text-slate-500">Quantity</p><p className="text-sm font-semibold text-slate-900">{selectedOrder?.quantity} L</p></div>
            <div><p className="text-xs text-slate-500">Amount</p><p className="text-sm font-semibold text-slate-900">₹{selectedOrder?.totalPrice?.toLocaleString()}</p></div>
            <div><p className="text-xs text-slate-500">Address</p><p className="text-sm font-semibold text-slate-900">{selectedOrder?.address}</p></div>
            <div><p className="text-xs text-slate-500">Order Date</p><p className="text-sm font-semibold text-slate-900">{new Date(selectedOrder?.createdAt).toLocaleString('en-IN')}</p></div>
            <div><p className="text-xs text-slate-500">Current Status</p><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor[selectedOrder?.status]}`}>{selectedOrder?.status}</span></div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Update Status</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select new status</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-admin-500 outline-none">
                {statusSteps.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes (Optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm resize-none focus:ring-2 focus:ring-admin-500 outline-none" placeholder="Add a note about this status update..." />
            </div>
            <button onClick={handleUpdate} disabled={updating} className="w-full py-3 bg-admin-600 text-white rounded-xl font-semibold hover:bg-admin-700 transition-all shadow-lg shadow-admin-600/20 disabled:opacity-50">
              {updating ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Status Timeline</h2>
          <div className="space-y-0">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 ${i <= currentStepIndex ? 'bg-admin-600 border-admin-600' : 'bg-white border-slate-300'}`}></div>
                  {i < statusSteps.length - 1 && <div className={`w-0.5 h-12 ${i < currentStepIndex ? 'bg-admin-600' : 'bg-slate-200'}`}></div>}
                </div>
                <div className="pb-8">
                  <p className={`text-sm font-medium ${i <= currentStepIndex ? 'text-slate-900' : 'text-slate-400'}`}>{step}</p>
                  {i <= currentStepIndex && <p className="text-xs text-slate-500 mt-1">{i === currentStepIndex ? 'Current' : 'Completed'}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrderStatus;
