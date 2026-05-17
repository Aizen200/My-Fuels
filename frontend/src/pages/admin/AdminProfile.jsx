import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import { HiOutlineUser, HiOutlineMail } from 'react-icons/hi';

const AdminProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get(`/profile/${user?.name}`);
        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.name) fetchProfile();
  }, [user]);

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
        <h1 className="text-2xl font-bold text-slate-900">Admin Profile</h1>
        <p className="text-slate-500 mt-1">Manage your administrative account details</p>
      </div>
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-admin-600 to-admin-800 px-8 py-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shadow-inner">
                <HiOutlineUser className="text-white" size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profile?.name || user?.name}</h2>
                <p className="text-admin-200 mt-1 capitalize">{profile?.roles || user?.role || 'Admin'}</p>
              </div>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-admin-100 flex items-center justify-center">
                <HiOutlineUser className="text-admin-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Full Name</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{profile?.name || user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-admin-100 flex items-center justify-center">
                <HiOutlineMail className="text-admin-600" size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Email Address</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{profile?.email || user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
