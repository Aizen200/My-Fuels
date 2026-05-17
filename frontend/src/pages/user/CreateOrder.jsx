import { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const CreateOrder = () => {
  const [fuels, setFuels] = useState([]);
  const [form, setForm] = useState({ fuel: '', quantity: '', address: '', preferredDeliveryTime: '', notes: '' });
  const [selectedFuel, setSelectedFuel] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFuels = async () => {
      try {
        const res = await API.get('/user/fuels');
        setFuels(res.data.fuels || []);
      } catch (err) {
        toast.error('Failed to load fuel types');
      }
    };
    fetchFuels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'fuel') {
      setSelectedFuel(fuels.find((f) => f._id === value));
    }
  };

  const totalAmount = selectedFuel ? (selectedFuel.pricePerLitre * (parseFloat(form.quantity) || 0)).toFixed(2) : '0.00';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/user/orders', { ...form, quantity: parseFloat(form.quantity) });
      toast.success('Order placed successfully!');
      setForm({ fuel: '', quantity: '', address: '', preferredDeliveryTime: '', notes: '' });
      setSelectedFuel(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create New Fuel Order</h1>
        <p className="text-slate-500 mt-1">Fill in the details below to place a new order.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Type</label>
            <select name="fuel" value={form.fuel} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-user-500 focus:border-user-500 outline-none text-sm bg-white" required>
              <option value="">Select fuel type</option>
              {fuels.map((f) => (<option key={f._id} value={f._id}>{f.fuelName}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Quantity (in Litres)</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-user-500 focus:border-user-500 outline-none text-sm" placeholder="100" min="1" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Location</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-user-500 focus:border-user-500 outline-none text-sm" placeholder="123, Industrial Area, Pune, Maharashtra" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Preferred Delivery Date</label>
            <input type="datetime-local" name="preferredDeliveryTime" value={form.preferredDeliveryTime} onChange={handleChange} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-user-500 focus:border-user-500 outline-none text-sm" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes (Optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-user-500 focus:border-user-500 outline-none text-sm resize-none" placeholder="Any special instructions..." />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-user-600 text-white rounded-xl font-semibold hover:bg-user-700 transition-all shadow-lg shadow-user-600/20 disabled:opacity-50">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
        <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm"><span className="text-slate-500">Fuel Type</span><span className="font-medium text-slate-900">{selectedFuel?.fuelName || '-'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Price per Litre</span><span className="font-medium text-slate-900">{selectedFuel ? `₹${selectedFuel.pricePerLitre}` : '-'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-500">Quantity</span><span className="font-medium text-slate-900">{form.quantity ? `${form.quantity} L` : '-'}</span></div>
            <hr className="border-slate-200" />
            <div className="flex justify-between"><span className="font-semibold text-slate-900">Total Amount</span><span className="text-xl font-bold text-user-600">₹{totalAmount}</span></div>
          </div>
          <div className="mt-5 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-700">Note: Final amount may vary based on delivery and taxes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
