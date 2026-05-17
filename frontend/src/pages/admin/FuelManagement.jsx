import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import API from '../../api/axios';

const FuelManagement = () => {
  const [fuels, setFuels] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editFuel, setEditFuel] = useState(null);
  const [form, setForm] = useState({ fuelName: '', pricePerLitre: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFuels = async () => {
      try {
        const res = await API.get('/admin/fuels');
        setFuels(res.data.fuels || []);
      } catch (err) {
        toast.error('Failed to load fuels');
      } finally {
        setLoading(false);
      }
    };
    fetchFuels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editFuel) {
        const res = await API.put(`/admin/fuels/${editFuel._id}`, { ...form, pricePerLitre: parseFloat(form.pricePerLitre) });
        setFuels(fuels.map((f) => f._id === editFuel._id ? { ...f, ...res.data.fuel } : f));
        toast.success('Fuel updated successfully!');
      } else {
        const res = await API.post('/admin/fuels', { ...form, pricePerLitre: parseFloat(form.pricePerLitre) });
        setFuels([...fuels, { ...res.data.fuel, status: 'Active' }]);
        toast.success('Fuel added successfully!');
      }
      setShowModal(false);
      setEditFuel(null);
      setForm({ fuelName: '', pricePerLitre: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save fuel');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/fuels/${id}`);
      setFuels(fuels.filter((f) => f._id !== id));
      toast.success('Fuel deleted successfully');
    } catch (err) {
      toast.error('Failed to delete fuel');
    }
  };

  const openEdit = (fuel) => {
    setEditFuel(fuel);
    setForm({ fuelName: fuel.fuelName, pricePerLitre: fuel.pricePerLitre.toString() });
    setShowModal(true);
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Fuel Management</h1>
          <p className="text-slate-500 mt-1">Manage fuel types and prices.</p>
        </div>
        <button onClick={() => { setEditFuel(null); setForm({ fuelName: '', pricePerLitre: '' }); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-admin-600 text-white rounded-lg text-sm font-medium hover:bg-admin-700 transition-all shadow-md">
          <HiOutlinePlus size={16} />
          Add Fuel
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
               <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Fuel Type</th>
               <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Price Per Litre</th>
               <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
               <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {fuels.map((fuel) => (
               <tr key={fuel._id} className="hover:bg-slate-50 transition-colors">
                 <td className="px-6 py-4 text-sm font-medium text-slate-900">{fuel.fuelName}</td>
                 <td className="px-6 py-4 text-sm text-slate-600">₹{fuel.pricePerLitre?.toFixed(2)}</td>
                 <td className="px-6 py-4"><span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span></td>
                 <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                     <button onClick={() => openEdit(fuel)} className="text-blue-600 hover:text-blue-700"><HiOutlinePencil size={16} /></button>
                     <button onClick={() => handleDelete(fuel._id)} className="text-red-600 hover:text-red-700"><HiOutlineTrash size={16} /></button>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
         <div className="px-6 py-4 border-t border-slate-100">
           <p className="text-sm text-slate-500">Showing 1 to {fuels.length} of {fuels.length} fuels</p>
         </div>
       </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-5">{editFuel ? 'Edit Fuel' : 'Add New Fuel'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Name</label>
                <input type="text" value={form.fuelName} onChange={(e) => setForm({ ...form, fuelName: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-admin-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price Per Litre (₹)</label>
                <input type="number" step="0.01" value={form.pricePerLitre} onChange={(e) => setForm({ ...form, pricePerLitre: e.target.value })} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-admin-500 outline-none" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-admin-600 text-white rounded-xl font-semibold hover:bg-admin-700 transition-all">{editFuel ? 'Update' : 'Add Fuel'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelManagement;
