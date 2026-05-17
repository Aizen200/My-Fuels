import { useState, useEffect } from 'react';
import { HiOutlineShieldCheck, HiOutlineTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import API from '../../api/axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get('/admin/users');
        setUsers(res.data.users || []);
      } catch (err) {
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      const res = await API.put(`/admin/users/${id}/role`, { roles: newRole });
      setUsers(users.map((u) => u._id === id ? { ...u, roles: res.data.user.roles } : u));
      toast.success('User role updated successfully!');
    } catch (err) {
      toast.error('Failed to update user role');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error('Failed to delete user');
    }
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">View and manage all users.</p>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{u.name}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{u.email}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${u.roles === 'admin' ? 'bg-admin-100 text-admin-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.roles === 'admin' && <HiOutlineShieldCheck size={12} />}
                      {u.roles ? u.roles.charAt(0).toUpperCase() + u.roles.slice(1) : 'User'}
                    </span>
                    <select
                      value={u.roles || 'user'}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="text-xs border border-slate-200 rounded px-1.5 py-0.5 bg-white outline-none focus:border-admin-500"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4"><span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:text-red-700"><HiOutlineTrash size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">Showing 1 to {users.length} of {users.length} users</p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
