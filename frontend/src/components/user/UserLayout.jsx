import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineUser, HiOutlineBell, HiOutlineCheckCircle, HiOutlineInformationCircle, HiOutlineMenu } from 'react-icons/hi';
import API from '../../api/axios';

const UserLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Welcome to Fuel Order System!', time: 'Just now', icon: <HiOutlineCheckCircle className="text-green-500" size={18} /> }
  ]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get('/user/history');
        const orders = res.data.OrderHistory || [];
        if (orders.length > 0) {
          const dynamicNotifs = orders.slice(0, 5).map(o => ({
            id: o._id,
            text: `Order #${o.orderNumber || o._id.slice(-6)} status is ${o.status}`,
            time: new Date(o.createdAt).toLocaleDateString('en-IN'),
            icon: <HiOutlineInformationCircle className="text-blue-500" size={18} />
          }));
          setNotifications(dynamicNotifs);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between md:justify-end gap-4 relative">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:text-slate-700 focus:outline-none">
            <HiOutlineMenu size={24} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors focus:outline-none">
                <HiOutlineBell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-user-500 rounded-full"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    <span className="text-xs bg-user-50 text-user-600 font-medium px-2 py-0.5 rounded-full">3 New</span>
                  </div>
                  <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors flex gap-3 items-start">
                        <div className="mt-0.5">{n.icon}</div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-800">{n.text}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-sm font-medium text-slate-700">{user?.name || 'User'}</span>
              <div className="w-9 h-9 rounded-full bg-user-600 flex items-center justify-center shadow-md">
                <HiOutlineUser className="text-white" size={18} />
              </div>
            </Link>
          </div>
        </header>
        <main className="p-4 md:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
